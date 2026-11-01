"""Vercel Function: GET /api/rules."""

from __future__ import annotations

from urllib.parse import parse_qs, urlsplit

from backend.catalog import CatalogIntegrationError, build_bundle
from backend.http_utils import SecureJSONHandler


class handler(SecureJSONHandler):  # noqa: N801 - nome exigido pelo runtime Vercel
    def do_GET(self) -> None:  # noqa: N802
        params = parse_qs(urlsplit(self.path).query, keep_blank_values=True)
        if any(len(values) != 1 for values in params.values()) or set(params) - {"q", "category"}:
            self.send_json(400, {"error": "Parâmetros de consulta inválidos."})
            return
        query = params.get("q", [""])[0]
        category = params.get("category", [""])[0]
        try:
            bundle = build_bundle(query=query, category=category)
        except ValueError as exc:
            self.send_json(400, {"error": str(exc)})
            return
        except CatalogIntegrationError:
            self.send_json(
                503,
                {
                    "error": "O catálogo do CDC não pôde ser confirmado. Consulte a fonte oficial e tente novamente."
                },
            )
            return
        self.send_json(200, bundle)
