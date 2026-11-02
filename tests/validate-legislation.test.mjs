import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { validateLegislation } from "../scripts/validate_legislation.mjs";

const validRecord = (overrides = {}) => ({
  jurisdiction: "federal",
  territory: "BR",
  kind: "lei",
  identifier: "Lei sintética nº 1/2024",
  title: "Registro legislativo sintético",
  enacted_date: "2024-01-15",
  status: "vigente",
  consumer_relevance: "Exemplo sintético para validação estrutural.",
  official_source_url: "https://example.org/fonte-oficial",
  official_source_org: "Órgão oficial sintético",
  status_basis_url: "",
  verification_date: "2026-11-01",
  tags: ["sintetico", "teste"],
  notes: "Fixture sem dados pessoais.",
  related_source_urls: ["http://example.org/fonte-complementar"],
  ...overrides,
});

async function withFixture(run) {
  const directory = await mkdtemp(join(tmpdir(), "legislation-validator-"));
  try {
    return await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

export const cases = [
  {
    name: "aceita um registro legislativo válido",
    group: "validate-legislation",
    run: () => withFixture(async (directory) => {
      await writeFile(
        join(directory, "00-valid.jsonl"),
        `${JSON.stringify(validRecord())}\n`,
        "utf8",
      );

      const result = await validateLegislation(directory, { strictDuplicates: true });
      assert.equal(result.exitCode, 0);
      assert.equal(result.failed, false);
      assert.deepEqual(result.files, ["00-valid.jsonl"]);
      assert.equal(result.records, 1);
      assert.deepEqual(result.errors, []);
      assert.deepEqual(result.duplicateSets, []);
    }),
  },
  {
    name: "reprova JSON inválido e registro fora do esquema",
    group: "validate-legislation",
    run: () => withFixture(async (directory) => {
      const malformed = "{\"jurisdiction\": \"federal\",\n";
      const missingFields = JSON.stringify({ jurisdiction: "federal" });
      const invalidSchema = JSON.stringify(validRecord({
        jurisdiction: "planetaria",
        territory: "",
        enacted_date: "2024-02-30",
        status: "desconhecido",
        official_source_url: "not-a-url",
        status_basis_url: "ftp://example.org/status",
        tags: ["ok", 42],
        related_source_urls: ["sem-esquema-de-url"],
      }));
      await writeFile(
        join(directory, "00-invalid.jsonl"),
        `${malformed}\n${missingFields}\n${invalidSchema}\n`,
        "utf8",
      );

      const result = await validateLegislation(directory);
      assert.equal(result.exitCode, 1);
      assert.equal(result.failed, true);
      assert.equal(result.records, 2);
      assert.equal(result.duplicateSets.length, 0);
      assert.ok(result.errors.some((message) => message.includes("JSON inválido")));
      assert.ok(result.errors.some((message) => message.includes("campos ausentes")));
      assert.ok(result.errors.some((message) => message.includes("jurisdiction inválido")));
      assert.ok(result.errors.some((message) => message.includes("enacted_date deve usar")));
      assert.ok(result.errors.some((message) => message.includes("official_source_url inválida")));
      assert.ok(result.errors.some((message) => message.includes("related_source_urls")));
    }),
  },
  {
    name: "reprova chave duplicada no modo estrito",
    group: "validate-legislation",
    run: () => withFixture(async (directory) => {
      await mkdir(join(directory, "nested"));
      await writeFile(
        join(directory, "00-first.jsonl"),
        `${JSON.stringify(validRecord())}\n`,
        "utf8",
      );
      await writeFile(
        join(directory, "01-second.jsonl"),
        `${JSON.stringify(validRecord({ title: "Segundo registro sintético" }))}\n`,
        "utf8",
      );

      const nonStrict = await validateLegislation(directory);
      assert.equal(nonStrict.exitCode, 0);
      assert.equal(nonStrict.failed, false);
      assert.equal(nonStrict.duplicateSets.length, 1);

      const strict = await validateLegislation(directory, { strictDuplicates: true });
      assert.equal(strict.exitCode, 1);
      assert.equal(strict.failed, true);
      assert.equal(strict.duplicateSets.length, 1);
      assert.deepEqual(strict.duplicateSets[0].key, ["federal", "BR", "Lei sintética nº 1/2024"]);
      assert.deepEqual(strict.duplicateSets[0].refs, [
        "00-first.jsonl:1",
        "01-second.jsonl:1",
      ]);
    }),
  },
];
