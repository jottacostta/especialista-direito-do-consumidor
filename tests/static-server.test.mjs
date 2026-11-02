import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, symlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { createPreviewServer } from "../scripts/serve-pages.mjs";

async function withServer(run) {
  const siteDir = await mkdtemp(path.join(os.tmpdir(), "static-pages-preview-"));
  let server;
  try {
    await mkdir(path.join(siteDir, "data"));
    await mkdir(path.join(siteDir, "testes"));
    await writeFile(path.join(siteDir, "index.html"), "<!doctype html><title>Fixture</title>", "utf8");
    await writeFile(path.join(siteDir, "data", "bundle.json"), "{\"ok\":true}", "utf8");
    await writeFile(path.join(siteDir, "testes", "index.html"), "<h1>Relatório</h1>", "utf8");
    server = await createPreviewServer({ port: 0, siteDir });
    const base = `http://127.0.0.1:${server.address().port}`;
    await run(base, siteDir);
  } finally {
    if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    await rm(siteDir, { recursive: true, force: true });
  }
}

export const cases = [
  {
    name: "serve páginas e bundle JSON por caminhos estáticos",
    group: "Integração · Prévia estática local",
    run: () => withServer(async (base) => {
      const home = await fetch(`${base}/`);
      assert.equal(home.status, 200);
      assert.match(home.headers.get("content-type"), /text\/html/);
      assert.match(await home.text(), /Fixture/);
      const reportPage = await fetch(`${base}/testes/`);
      assert.equal(reportPage.status, 200);
      assert.match(await reportPage.text(), /Relatório/);
      const bundle = await fetch(`${base}/data/bundle.json`);
      assert.deepEqual(await bundle.json(), { ok: true });
      assert.equal(bundle.headers.get("x-content-type-options"), "nosniff");
    }),
  },
  {
    name: "recusa escrita, traversal e symlink que escape da raiz estática",
    group: "Integração · Segurança da prévia",
    run: () => withServer(async (base, siteDir) => {
      const write = await fetch(`${base}/`, { method: "POST" });
      assert.equal(write.status, 405);
      const traversal = await fetch(`${base}/..%2fsecret.txt`);
      assert.ok([400, 403, 404].includes(traversal.status));
      assert.notEqual(traversal.status, 200);

      const outsideDir = await mkdtemp(path.join(os.tmpdir(), "static-outside-"));
      try {
        await writeFile(path.join(outsideDir, "secret.txt"), "sentinel secreto sintético", "utf8");
        await symlink(path.join(outsideDir, "secret.txt"), path.join(siteDir, "escape.txt"));
        const escaped = await fetch(`${base}/escape.txt`);
        assert.equal(escaped.status, 403);
        assert.doesNotMatch(await escaped.text(), /sentinel secreto sintético/);
      } finally {
        await rm(outsideDir, { recursive: true, force: true });
      }
    }),
  },
];
