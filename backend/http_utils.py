"""Utilitários HTTP compartilhados pelos endpoints Python sem estado."""

from __future__ import annotations

import json
from http.server import BaseHTTPRequestHandler
from typing import Any


class SecureJSONHandler(BaseHTTPRequestHandler):
    """Base mínima para APIs locais/serverless que não armazenam requisições."""

    server_version = "CDCGuide/0.2"
    sys_version = ""

    def log_message(self, format: str, *args: Any) -> None:
        # Evita incluir paths e query strings da solicitação no log da aplicação.
        return

    def log_error(self, format: str, *args: Any) -> None:
        return

    def send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
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
        self.end_headers()
        self.wfile.write(body)

    def _reject_write(self) -> None:
        self.send_json(405, {"error": "Esta consulta não aceita gravação de dados."})

    def do_POST(self) -> None:  # noqa: N802 - method required by BaseHTTPRequestHandler
        self._reject_write()

    def do_PUT(self) -> None:  # noqa: N802
        self._reject_write()

    def do_PATCH(self) -> None:  # noqa: N802
        self._reject_write()

    def do_DELETE(self) -> None:  # noqa: N802
        self._reject_write()
