import { cp, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { buildGuideBundle } from "./catalog-data.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const DASHBOARD_DIR = path.join(ROOT, "tools", "test-dashboard");
const DIST_DIR = path.join(ROOT, "dist");
const REPORT_FILE = path.join(ROOT, "test-results", "latest.json");

function validateReport(report) {
  if (!report || report.schema_version !== 1 || report.success !== true
    || !Array.isArray(report.tests) || !report.counts
    || report.counts.total !== report.tests.length
    || report.counts.passed !== report.counts.total
    || report.counts.failed !== 0 || report.counts.errors !== 0
    || report.counts.unexpected_successes !== 0
    || typeof report.console_output !== "string") {
    throw new Error("O relatório de testes está ausente ou fora do schema esperado. Execute `npm test` antes de criar o site.");
  }
  return report;
}

export async function buildPages({ outDir = DIST_DIR, reportFile = REPORT_FILE } = {}) {
  const target = path.resolve(outDir);
  if (target === ROOT || !target.startsWith(`${ROOT}${path.sep}`)) {
    throw new Error("O diretório de saída precisa ficar dentro do repositório.");
  }
  const bundle = await buildGuideBundle();
  const report = validateReport(JSON.parse(await readFile(reportFile, "utf8")));
  const dataDir = path.join(target, "data");
  const testsDir = path.join(target, "testes");
  await mkdir(dataDir, { recursive: true });
  await mkdir(testsDir, { recursive: true });

  for (const name of ["index.html", "styles.css", "app.js", "guide-core.js"]) {
    await cp(path.join(PUBLIC_DIR, name), path.join(target, name));
  }
  for (const name of ["index.html", "styles.css", "app.js"]) {
    await cp(path.join(DASHBOARD_DIR, name), path.join(testsDir, name));
  }
  await writeFile(path.join(dataDir, "cdc-guide.json"), `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
  await writeFile(path.join(dataDir, "test-report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
  await writeFile(path.join(target, ".nojekyll"), "", "utf8");

  return {
    output: target,
    law: bundle.law.identifier,
    rules: bundle.total_rules,
    tests: report.counts.total,
    passed: report.counts.passed,
  };
}

async function main() {
  const result = await buildPages();
  console.log(`Site Pages criado em ${path.relative(ROOT, result.output)}.`);
  console.log(`Bundle: ${result.law}; ${result.rules} guias; relatório: ${result.passed}/${result.tests} testes aprovados.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
