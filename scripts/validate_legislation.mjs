#!/usr/bin/env node
/**
 * Valida a estrutura e as duplicatas nos índices legislativos JSONL.
 *
 * Não acessa a internet e não confirma vigência ou autoridade da fonte.
 */

import { readdir, readFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
export const DEFAULT_INDEX_DIR = join(ROOT, "legislacao", "indices");

export const REQUIRED_FIELDS = Object.freeze([
  "jurisdiction",
  "territory",
  "kind",
  "identifier",
  "title",
  "enacted_date",
  "status",
  "consumer_relevance",
  "official_source_url",
  "official_source_org",
  "status_basis_url",
  "verification_date",
  "tags",
  "notes",
]);

const JURISDICTIONS = new Set(["federal", "state", "district", "municipal"]);
const STATUSES = new Set([
  "vigente",
  "parcialmente_vigente",
  "revogada",
  "declarada_inconstitucional",
  "nao_verificada",
]);
const TEXT_FIELDS = [
  "jurisdiction",
  "territory",
  "kind",
  "identifier",
  "title",
  "consumer_relevance",
  "official_source_org",
  "notes",
];

function isLeapYear(year) {
  return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function validCalendarDate(year, month, day) {
  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }
  const daysInMonth = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  return day <= daysInMonth[month - 1];
}

function isoWeekday(year, month, day) {
  // Sakamoto's algorithm avoids Date.UTC's special handling of years 0-99.
  const offsets = [0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4];
  let adjustedYear = year;
  if (month < 3) {
    adjustedYear -= 1;
  }
  const sundayBased = (adjustedYear + Math.floor(adjustedYear / 4) -
    Math.floor(adjustedYear / 100) + Math.floor(adjustedYear / 400) +
    offsets[month - 1] + day) % 7;
  return sundayBased === 0 ? 7 : sundayBased;
}

function validIsoWeekDate(year, week, weekday) {
  if (year < 1 || week < 1 || weekday < 1 || weekday > 7) {
    return false;
  }

  // ISO week 1 is the week containing 4 January. This also rejects week 53
  // in years that have only 52 ISO weeks.
  const januaryFirstWeekday = isoWeekday(year, 1, 1);
  const weeksInYear = januaryFirstWeekday === 4 ||
    (januaryFirstWeekday === 3 && isLeapYear(year)) ? 53 : 52;
  return week <= weeksInYear;
}

/**
 * Match the date forms accepted by Python's date.fromisoformat while keeping
 * the calendar validation deterministic across time zones.
 */
export function validIsoDate(value, { allowEmpty = false } = {}) {
  if (allowEmpty && value === "") {
    return true;
  }
  if (typeof value !== "string") {
    return false;
  }

  let match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (match) {
    return validCalendarDate(
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
    );
  }

  match = /^(\d{4})(\d{2})(\d{2})$/.exec(value);
  if (match) {
    return validCalendarDate(
      Number(match[1]),
      Number(match[2]),
      Number(match[3]),
    );
  }

  match = /^(\d{4})-W(\d{2})(?:-(\d))?$/.exec(value);
  if (match) {
    return validIsoWeekDate(
      Number(match[1]),
      Number(match[2]),
      match[3] === undefined ? 1 : Number(match[3]),
    );
  }

  match = /^(\d{4})W(\d{2})(\d)?$/.exec(value);
  if (match) {
    return validIsoWeekDate(
      Number(match[1]),
      Number(match[2]),
      match[3] === undefined ? 1 : Number(match[3]),
    );
  }

  return false;
}

export function validUrl(value, { allowEmpty = false } = {}) {
  if (allowEmpty && value === "") {
    return true;
  }
  if (typeof value !== "string" || /\s/u.test(value)) {
    return false;
  }

  // This mirrors urllib.parse.urlparse: require a scheme followed by // and
  // a non-empty netloc, while leaving the rest of the URL untouched.
  const parsed = /^([A-Za-z][A-Za-z0-9+.-]*):\/\/([^\/?#]*)/.exec(value);
  if (!parsed) {
    return false;
  }
  const scheme = parsed[1].toLowerCase();
  return (scheme === "http" || scheme === "https") && parsed[2].length > 0;
}

function isJsonObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function jsonErrorMessage(error) {
  if (error instanceof SyntaxError && error.message) {
    return error.message.split("\n", 1)[0];
  }
  return String(error);
}

function keyForDuplicate(values) {
  return JSON.stringify(values);
}

function compareDuplicateSets(left, right) {
  for (let index = 0; index < left.key.length; index += 1) {
    const leftValue = String(left.key[index]);
    const rightValue = String(right.key[index]);
    if (leftValue < rightValue) {
      return -1;
    }
    if (leftValue > rightValue) {
      return 1;
    }
  }
  return 0;
}

async function indexFiles(indexDir) {
  let entries;
  try {
    entries = await readdir(indexDir, { withFileTypes: true });
  } catch (error) {
    if (error?.code === "ENOENT") {
      return [];
    }
    throw error;
  }

  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".jsonl"))
    .map((entry) => entry.name)
    .sort();
}

/**
 * Validate all JSONL index files in a directory.
 *
 * The directory argument is intentionally injectable so callers can validate
 * temporary fixture directories without changing the repository catalog.
 */
export async function validateLegislation(
  indexDir = DEFAULT_INDEX_DIR,
  { strictDuplicates = false } = {},
) {
  const directory = resolve(indexDir);
  const fileNames = await indexFiles(directory);
  const errors = [];
  const duplicateMap = new Map();
  let records = 0;

  for (const fileName of fileNames) {
    const filePath = join(directory, fileName);
    const content = await readFile(filePath, "utf8");
    const lines = content.split(/\r\n|\n|\r/);

    for (let lineNumber = 1; lineNumber <= lines.length; lineNumber += 1) {
      const raw = lines[lineNumber - 1];
      if (!raw.trim()) {
        continue;
      }

      let item;
      try {
        item = JSON.parse(raw);
      } catch (error) {
        errors.push(
          `${fileName}:${lineNumber}: JSON inválido: ${jsonErrorMessage(error)}`,
        );
        continue;
      }

      records += 1;
      if (!isJsonObject(item)) {
        errors.push(`${fileName}:${lineNumber}: cada linha deve ser um objeto JSON`);
        continue;
      }

      const missing = REQUIRED_FIELDS.filter((field) => !Object.hasOwn(item, field))
        .sort();
      if (missing.length > 0) {
        errors.push(
          `${fileName}:${lineNumber}: campos ausentes: ${missing.join(", ")}`,
        );
        continue;
      }

      for (const field of TEXT_FIELDS) {
        if (typeof item[field] !== "string" || !item[field].trim()) {
          errors.push(
            `${fileName}:${lineNumber}: ${field} deve ser texto não vazio`,
          );
        }
      }

      if (!JURISDICTIONS.has(item.jurisdiction)) {
        errors.push(`${fileName}:${lineNumber}: jurisdiction inválido`);
      }
      if (!STATUSES.has(item.status)) {
        errors.push(`${fileName}:${lineNumber}: status inválido`);
      }
      if (!validIsoDate(item.verification_date)) {
        errors.push(
          `${fileName}:${lineNumber}: verification_date deve usar AAAA-MM-DD`,
        );
      }
      if (!validIsoDate(item.enacted_date, { allowEmpty: true })) {
        errors.push(
          `${fileName}:${lineNumber}: enacted_date deve usar AAAA-MM-DD ou vazio`,
        );
      }
      if (!validUrl(item.official_source_url)) {
        errors.push(`${fileName}:${lineNumber}: official_source_url inválida`);
      }
      if (!validUrl(item.status_basis_url, { allowEmpty: true })) {
        errors.push(`${fileName}:${lineNumber}: status_basis_url inválida`);
      }
      if (!Array.isArray(item.tags) || !item.tags.every((tag) => typeof tag === "string")) {
        errors.push(`${fileName}:${lineNumber}: tags deve ser uma lista de textos`);
      }
      if (Object.hasOwn(item, "related_source_urls") && (
        !Array.isArray(item.related_source_urls) ||
        !item.related_source_urls.every((url) => validUrl(url))
      )) {
        errors.push(
          `${fileName}:${lineNumber}: related_source_urls deve ser uma lista de URLs válidas`,
        );
      }

      // JSON values are allowed here so a malformed record produces validation
      // errors instead of crashing the maintenance command. Valid catalog keys
      // remain the exact (jurisdiction, territory, identifier) triple.
      const key = [item.jurisdiction, item.territory, item.identifier];
      const duplicateKey = keyForDuplicate(key);
      const refs = duplicateMap.get(duplicateKey) ?? { key, refs: [] };
      refs.refs.push(`${fileName}:${lineNumber}`);
      duplicateMap.set(duplicateKey, refs);
    }
  }

  const duplicateSets = [...duplicateMap.values()]
    .filter(({ refs }) => refs.length > 1)
    .sort(compareDuplicateSets);
  const failed = errors.length > 0 || (strictDuplicates && duplicateSets.length > 0);

  return {
    directory,
    files: fileNames,
    records,
    errors,
    duplicateSets,
    strictDuplicates,
    failed,
    exitCode: failed ? 1 : 0,
  };
}

export function formatValidationOutput(result) {
  const stdout = [
    `Arquivos JSONL: ${result.files.length} | Registros lidos: ${result.records}`,
  ];
  const stderr = [];

  for (const message of result.errors) {
    stderr.push(`ERRO: ${message}`);
  }
  for (const duplicate of result.duplicateSets) {
    stderr.push(
      `DUPLICATA: ${duplicate.key[0]} / ${duplicate.key[1]} / ${duplicate.key[2]} — ${duplicate.refs.join(", ")}`,
    );
  }

  if (result.duplicateSets.length > 0 && !result.strictDuplicates) {
    stdout.push(
      `Aviso: ${result.duplicateSets.length} chaves duplicadas; use --strict-duplicates para tratá-las como falha.`,
    );
  }
  if (result.files.length === 0) {
    stdout.push("Aviso: nenhum arquivo JSONL encontrado.");
  }

  if (result.failed) {
    stderr.push("Validação reprovada.");
  } else {
    stdout.push("Validação estrutural concluída; confirme as fontes e a vigência manualmente.");
  }

  return {
    stdout: `${stdout.join("\n")}\n`,
    stderr: stderr.length > 0 ? `${stderr.join("\n")}\n` : "",
  };
}

function cliHelp() {
  return [
    "Uso: node scripts/validate_legislation.mjs [--strict-duplicates]",
    "",
    "Valida a estrutura e as duplicatas nos índices legislativos JSONL.",
  ].join("\n") + "\n";
}

async function runCli(args) {
  let strictDuplicates = false;
  for (const argument of args) {
    if (argument === "--strict-duplicates") {
      strictDuplicates = true;
    } else if (argument === "--help" || argument === "-h") {
      process.stdout.write(cliHelp());
      return 0;
    } else {
      process.stderr.write(`Argumento não reconhecido: ${argument}\n${cliHelp()}`);
      return 2;
    }
  }

  const result = await validateLegislation(DEFAULT_INDEX_DIR, { strictDuplicates });
  const output = formatValidationOutput(result);
  process.stdout.write(output.stdout);
  process.stderr.write(output.stderr);
  return result.exitCode;
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? resolve(process.argv[1]) : "";
if (currentFile === invokedFile) {
  runCli(process.argv.slice(2))
    .then((exitCode) => {
      process.exitCode = exitCode;
    })
    .catch((error) => {
      process.stderr.write(`${error?.stack ?? error}\n`);
      process.exitCode = 1;
    });
}
