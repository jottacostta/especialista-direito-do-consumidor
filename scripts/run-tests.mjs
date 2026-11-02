import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TESTS_DIR = path.join(ROOT, "tests");
const REPORT_PATH = path.join(ROOT, "test-results", "latest.json");

export async function runTestCases({ testsDir = TESTS_DIR } = {}) {
  const startedAt = new Date().toISOString();
  const suiteStarted = performance.now();
  const files = (await readdir(testsDir)).filter((file) => file.endsWith(".test.mjs")).sort();
  const records = [];
  const output = [];

  for (const file of files) {
    const moduleUrl = pathToFileURL(path.join(testsDir, file)).href;
    let testModule;
    try {
      testModule = await import(moduleUrl);
    } catch (error) {
      records.push({
        id: `${file}::module-load`,
        name: `Carregar ${file}`,
        group: "Execução da suíte",
        outcome: "error",
        duration_seconds: 0,
        details: error?.stack || String(error),
      });
      continue;
    }
    if (!Array.isArray(testModule.cases)) {
      records.push({
        id: `${file}::cases`,
        name: `Exportar casos de ${file}`,
        group: "Execução da suíte",
        outcome: "error",
        duration_seconds: 0,
        details: "O módulo de teste precisa exportar `cases` como uma lista.",
      });
      continue;
    }

    for (const testCase of testModule.cases) {
      const id = `${file}::${testCase.name}`;
      const started = performance.now();
      let outcome = "passed";
      let details = "";
      try {
        await testCase.run();
      } catch (error) {
        outcome = "failed";
        details = error?.stack || String(error);
      }
      const durationSeconds = Number(((performance.now() - started) / 1000).toFixed(6));
      records.push({
        id,
        name: testCase.name,
        group: testCase.group || "Outros testes",
        outcome,
        duration_seconds: durationSeconds,
        details,
      });
    }
  }

  const durationSeconds = Number(((performance.now() - suiteStarted) / 1000).toFixed(3));
  const counts = {
    total: records.length,
    passed: records.filter((record) => record.outcome === "passed").length,
    failed: records.filter((record) => record.outcome === "failed").length,
    errors: records.filter((record) => record.outcome === "error").length,
    skipped: records.filter((record) => record.outcome === "skipped").length,
    expected_failures: records.filter((record) => record.outcome === "expected_failure").length,
    unexpected_successes: records.filter((record) => record.outcome === "unexpected_success").length,
  };
  for (const record of records) {
    const mark = record.outcome === "passed" ? "PASS" : record.outcome.toUpperCase();
    output.push(`${mark} ${record.name} · ${record.group} · ${(record.duration_seconds * 1000).toFixed(1)} ms`);
    if (record.details) output.push(record.details);
  }
  output.push(`${counts.total} testes concluídos em ${durationSeconds.toFixed(3)} s`);
  output.push(counts.failed + counts.errors + counts.unexpected_successes === 0
    ? "Todos os testes passaram."
    : `${counts.failed + counts.errors + counts.unexpected_successes} teste(s) precisam de atenção.`);

  return {
    schema_version: 1,
    generated_at: startedAt,
    node_version: process.version,
    duration_seconds: durationSeconds,
    success: counts.failed === 0 && counts.errors === 0 && counts.unexpected_successes === 0,
    counts,
    groups: [...new Set(records.map((record) => record.group))].sort((a, b) => a.localeCompare(b, "pt-BR")),
    tests: records,
    console_output: output.join("\n"),
  };
}

async function main() {
  const report = await runTestCases();
  await mkdir(path.dirname(REPORT_PATH), { recursive: true });
  await writeFile(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${report.console_output}\n`);
  process.stdout.write(`Relatório JSON: ${path.relative(ROOT, REPORT_PATH)}\n`);
  if (!report.success) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(`Falha ao executar a suíte: ${error?.stack || error}`);
    process.exitCode = 1;
  });
}
