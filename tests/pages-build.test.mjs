import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPages } from "../scripts/build-pages.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const cases = [
  {
    name: "monta artefato estático com CDC validado e painel de CI",
    group: "Integração · Build GitHub Pages",
    run: async () => {
      const outDir = path.join(ROOT, "dist", `fixture-${process.pid}-${Date.now()}`);
      const reportDir = await mkdtemp(path.join(os.tmpdir(), "pages-report-"));
      const reportFile = path.join(reportDir, "report.json");
      const report = {
        schema_version: 1,
        generated_at: "2026-11-02T19:00:00.000Z",
        node_version: "v22.0.0",
        duration_seconds: 0.01,
        success: true,
        counts: {
          total: 1, passed: 1, failed: 0, errors: 0, skipped: 0,
          expected_failures: 0, unexpected_successes: 0,
        },
        groups: ["Fixture sintética"],
        tests: [{ id: "fixture::pass", name: "Passa", group: "Fixture sintética", outcome: "passed", duration_seconds: 0.001, details: "" }],
        console_output: "PASS fixture sintética",
      };
      await writeFile(reportFile, `${JSON.stringify(report)}\n`, "utf8");
      try {
        const result = await buildPages({ outDir, reportFile });
        assert.equal(result.rules, 6);
        assert.equal(result.tests, 1);
        const appHtml = await readFile(path.join(outDir, "index.html"), "utf8");
        assert.match(appHtml, /\.\/styles\.css/);
        assert.match(appHtml, /\.\/app\.js/);
        const bundle = JSON.parse(await readFile(path.join(outDir, "data", "cdc-guide.json"), "utf8"));
        assert.equal(bundle.law.status, "vigente");
        assert.equal(bundle.rules.length, 6);
        const publishedReport = JSON.parse(await readFile(path.join(outDir, "data", "test-report.json"), "utf8"));
        assert.equal(publishedReport.success, true);
        assert.equal((await readFile(path.join(outDir, "testes", "index.html"), "utf8")).includes("público"), true);
      } finally {
        await rm(outDir, { recursive: true, force: true });
        await rm(reportDir, { recursive: true, force: true });
      }
    },
  },
  {
    name: "recusa gerar artefato público quando o relatório contém falhas",
    group: "Integração · Segurança de publicação",
    run: async () => {
      const outDir = path.join(ROOT, "dist", `failed-fixture-${process.pid}-${Date.now()}`);
      const reportDir = await mkdtemp(path.join(os.tmpdir(), "pages-failed-report-"));
      const reportFile = path.join(reportDir, "report.json");
      await writeFile(reportFile, JSON.stringify({
        schema_version: 1,
        success: false,
        counts: { total: 1, passed: 0, failed: 1, errors: 0, unexpected_successes: 0 },
        tests: [{ name: "falha sintética" }],
        console_output: "falha sintética",
      }), "utf8");
      try {
        await assert.rejects(buildPages({ outDir, reportFile }), /schema esperado/i);
      } finally {
        await rm(outDir, { recursive: true, force: true });
        await rm(reportDir, { recursive: true, force: true });
      }
    },
  },
];
