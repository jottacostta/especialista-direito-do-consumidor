import { createReadStream, promises as fs } from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE_DIR = path.join(ROOT, "dist");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

function sendText(response, status, text) {
  response.writeHead(status, {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(text);
}

function isWithin(root, candidate) {
  return candidate === root || candidate.startsWith(`${root}${path.sep}`);
}

export async function createPreviewServer({ port = 4173, host = "127.0.0.1", siteDir = SITE_DIR } = {}) {
  const root = await fs.realpath(path.resolve(siteDir));
  await fs.access(path.join(root, "index.html"));
  const server = http.createServer(async (request, response) => {
    if (request.method !== "GET" && request.method !== "HEAD") {
      sendText(response, 405, "Método não permitido");
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, `http://${host}:${port}`).pathname);
    } catch {
      sendText(response, 400, "Caminho inválido");
      return;
    }
    if (pathname.includes("\\") || pathname.includes("\0")) {
      sendText(response, 400, "Caminho inválido");
      return;
    }
    const candidate = path.resolve(root, `.${pathname}`);
    if (!isWithin(root, candidate)) {
      sendText(response, 403, "Acesso negado");
      return;
    }

    let filePath;
    try {
      filePath = await fs.realpath(candidate);
      if (!isWithin(root, filePath)) {
        sendText(response, 403, "Acesso negado");
        return;
      }
      const stats = await fs.stat(filePath);
      if (stats.isDirectory()) {
        filePath = await fs.realpath(path.join(filePath, "index.html"));
        if (!isWithin(root, filePath)) {
          sendText(response, 403, "Acesso negado");
          return;
        }
      }
      const fileStats = await fs.stat(filePath);
      if (!fileStats.isFile()) throw new Error("not file");
    } catch {
      sendText(response, 404, "Arquivo não encontrado");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    response.writeHead(200, {
      "Content-Type": TYPES[extension] || "application/octet-stream",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; connect-src 'self'; style-src 'self' 'unsafe-inline'; script-src 'self'; img-src 'self' data:; form-action 'self'",
    });
    if (request.method === "HEAD") response.end();
    else createReadStream(filePath).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, resolve);
  });
  return server;
}

async function main() {
  const port = Number(process.argv[2] || 4173);
  if (!Number.isInteger(port) || port < 1024 || port > 65535) {
    throw new Error("A porta deve ser um número entre 1024 e 65535.");
  }
  const server = await createPreviewServer({ port });
  console.log(`Prévia estática em http://127.0.0.1:${port} — apenas arquivos de dist/, Ctrl+C encerra.`);
  process.on("SIGINT", () => server.close(() => process.exit(0)));
  process.on("SIGTERM", () => server.close(() => process.exit(0)));
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(error?.stack || error);
    process.exitCode = 1;
  });
}
