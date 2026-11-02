import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateGuideBundle, validateRules } from "../public/guide-core.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const INDEX_DIR = path.join(ROOT, "legislacao", "indices");
export const RULES_FILE = path.join(ROOT, "data", "cdc_rules.json");
export const CDC_IDENTIFIER = "Lei nº 8.078, de 11 de setembro de 1990";

export class CatalogDataError extends Error {
  constructor(message) {
    super(message);
    this.name = "CatalogDataError";
  }
}

export async function readCatalogRecords(indexDir = INDEX_DIR) {
  let names;
  try {
    names = (await readdir(indexDir)).filter((name) => name.endsWith(".jsonl")).sort();
  } catch {
    throw new CatalogDataError("Diretório de índices legislativos não encontrado.");
  }
  if (names.length === 0) throw new CatalogDataError("Nenhum índice JSONL foi encontrado.");

  const records = [];
  for (const name of names) {
    const filePath = path.join(indexDir, name);
    let text;
    try {
      text = await readFile(filePath, "utf8");
    } catch {
      throw new CatalogDataError("Não foi possível ler um índice legislativo.");
    }
    for (const [index, raw] of text.split(/\r?\n/).entries()) {
      if (!raw.trim()) continue;
      let item;
      try {
        item = JSON.parse(raw);
      } catch {
        throw new CatalogDataError(`JSON inválido no índice ${name}, linha ${index + 1}.`);
      }
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        throw new CatalogDataError(`Registro não é um objeto JSON em ${name}, linha ${index + 1}.`);
      }
      records.push(item);
    }
  }
  return records;
}

export async function readRules(rulesFile = RULES_FILE) {
  let rules;
  try {
    rules = JSON.parse(await readFile(rulesFile, "utf8"));
  } catch {
    throw new CatalogDataError("O arquivo de regras informativas está ausente ou contém JSON inválido.");
  }
  try {
    validateRules(rules);
  } catch (error) {
    throw new CatalogDataError(error.message);
  }
  return rules;
}

export async function buildGuideBundle({ indexDir = INDEX_DIR, rulesFile = RULES_FILE } = {}) {
  const records = await readCatalogRecords(indexDir);
  const matches = records.filter((record) => record.jurisdiction === "federal"
    && record.territory === "BR" && record.identifier === CDC_IDENTIFIER);
  if (matches.length !== 1) {
    throw new CatalogDataError("O catálogo deve conter exatamente um registro federal da Lei nº 8.078/1990.");
  }
  const record = matches[0];
  const law = {
    identifier: record.identifier,
    title: record.title,
    jurisdiction: record.jurisdiction,
    territory: record.territory,
    status: record.status,
    verification_date: record.verification_date,
    official_source_org: record.official_source_org || "",
    official_source_url: record.official_source_url,
    status_basis_url: record.status_basis_url || "",
    related_source_urls: record.related_source_urls || [],
  };
  const rules = await readRules(rulesFile);
  const bundle = {
    law,
    categories: [...new Set(rules.map((rule) => rule.category))]
      .sort((a, b) => a.localeCompare(b, "pt-BR")),
    total_rules: rules.length,
    matched_rules: rules.length,
    rules,
  };
  try {
    validateGuideBundle(bundle);
  } catch (error) {
    throw new CatalogDataError(error.message);
  }
  return bundle;
}
