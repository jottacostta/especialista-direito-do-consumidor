"""Vercel Function: GET /api/health."""

from __future__ import annotations

from backend.catalog import CatalogIntegrationError, build_bundle
from backend.http_utils import SecureJSONHandler


class handler(SecureJSONHandler):  # noqa: N801 - nome exigido pelo runtime Vercel
    def do_GET(self) -> None:  # noqa: N802
        try:
            bundle = build_bundle()
        except CatalogIntegrationError:
            self.send_json(
                503,
                {
                    "status": "unavailable",
                    "message": "O catálogo do CDC não pôde ser confirmado.",
                },
            )
            return
        self.send_json(
            200,
            {
                "status": "ok",
                "law_status": bundle["law"]["status"],
                "verification_date": bundle["law"]["verification_date"],
                "rule_count": bundle["total_rules"],
            },
        )
