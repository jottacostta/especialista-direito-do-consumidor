"""Servidor local da consulta informativa ao CDC; sem autenticação ou armazenamento."""

from __future__ import annotations

import argparse
import json
import mimetypes
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import parse_qs, urlsplit

from backend.catalog import CatalogIntegrationError, INDEX_DIR, ROOT, build_bundle

FRONTEND_DIR = ROOT / "public"
STATIC_FILES = {
    "/styles.css": FRONTEND_DIR / "styles.css",
    "/app.js": FRONTEND_DIR / "app.js",
}


class LocalHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True


def make_handler(index_dir: Path, rules_file: Path, frontend_dir: Path) -> type[BaseHTTPRequestHandler]:
    class Handler(BaseHTTPRequestHandler):
        server_version = "CDCGuide/0.1"
        sys_version = ""

        def log_message(self, format: str, *args: Any) -> None:
            # Não gravar consultas digitadas nem endereços de acesso em logs locais.
            return

        def log_error(self, format: str, *args: Any) -> None:
            return

        def _headers(self, content_type: str, content_length: int) -> None:
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(content_length))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("X-Frame-Options", "DENY")
            self.send_header("Referrer-Policy", "no-referrer")
            self.send_header("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
            self.send_header(
                "Content-Security-Policy",
                "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; "
                "connect-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; "
                "form-action 'self'",
            )

        def _send_bytes(self, status: int, body: bytes, content_type: str) -> None:
            self.send_response(status)
            self._headers(content_type, len(body))
            self.end_headers()
            self.wfile.write(body)

        def _send_json(self, status: int, payload: dict[str, Any]) -> None:
            body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
            self._send_bytes(status, body, "application/json; charset=utf-8")

        def do_GET(self) -> None:  # noqa: N802 - method required by BaseHTTPRequestHandler
            request = urlsplit(self.path)
            if request.path == "/api/health":
                try:
                    bundle = build_bundle(index_dir, rules_file)
                except CatalogIntegrationError:
                    self._send_json(503, {"status": "unavailable", "message": "O catálogo do CDC não pôde ser confirmado."})
                    return
                self._send_json(200, {
                    "status": "ok",
                    "law_status": bundle["law"]["status"],
                    "verification_date": bundle["law"]["verification_date"],
                    "rule_count": bundle["total_rules"],
                })
                return

            if request.path == "/api/rules":
                params = parse_qs(request.query, keep_blank_values=True)
                if any(len(values) != 1 for values in params.values()) or set(params) - {"q", "category"}:
                    self._send_json(400, {"error": "Parâmetros de consulta inválidos."})
                    return
                query = params.get("q", [""])[0]
                category = params.get("category", [""])[0]
                try:
                    bundle = build_bundle(index_dir, rules_file, query=query, category=category)
                except ValueError as exc:
                    self._send_json(400, {"error": str(exc)})
                    return
                except CatalogIntegrationError:
                    self._send_json(503, {"error": "O catálogo do CDC não pôde ser confirmado. Consulte a fonte oficial e tente novamente."})
                    return
                self._send_json(200, bundle)
                return

            if request.path == "/" or request.path == "/index.html":
                asset_path = frontend_dir / "index.html"
            else:
                asset_path = STATIC_FILES.get(request.path)
                if asset_path is None:
                    self._send_bytes(404, b"Nao encontrado", "text/plain; charset=utf-8")
                    return
                asset_path = frontend_dir / asset_path.name

            try:
                content = asset_path.read_bytes()
            except OSError:
                self._send_bytes(404, b"Arquivo da interface nao encontrado", "text/plain; charset=utf-8")
                return
            content_type = mimetypes.guess_type(asset_path.name)[0] or "application/octet-stream"
            charset = "; charset=utf-8" if content_type.startswith(("text/", "application/javascript")) else ""
            self._send_bytes(200, content, content_type + charset)

        def do_POST(self) -> None:  # noqa: N802
            self._send_json(405, {"error": "Esta consulta não aceita gravação de dados."})

        def do_PUT(self) -> None:  # noqa: N802
            self._send_json(405, {"error": "Esta consulta não aceita gravação de dados."})

        def do_DELETE(self) -> None:  # noqa: N802
            self._send_json(405, {"error": "Esta consulta não aceita gravação de dados."})

    return Handler


def serve(port: int = 8000) -> None:
    if not 1024 <= port <= 65535:
        raise ValueError("A porta deve estar entre 1024 e 65535.")
    handler = make_handler(INDEX_DIR, ROOT / "data" / "cdc_rules.json", FRONTEND_DIR)
    server = LocalHTTPServer(("127.0.0.1", port), handler)
    print(f"Consulta local do CDC disponível em http://127.0.0.1:{port}")
    print("Somente neste computador; nenhuma consulta é salva. Ctrl+C encerra o servidor.")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServidor encerrado.")
    finally:
        server.server_close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8000, help="porta local (padrão: 8000)")
    args = parser.parse_args()
    try:
        serve(args.port)
    except OSError as exc:
        parser.error(f"não foi possível iniciar o servidor local: {exc}")
    except ValueError as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
