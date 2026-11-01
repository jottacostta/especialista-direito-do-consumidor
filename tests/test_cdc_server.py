from __future__ import annotations

import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from backend.catalog import CDC_IDENTIFIER
from backend.server import FRONTEND_DIR, make_handler

CDC_RECORD = {
    "jurisdiction": "federal",
    "territory": "BR",
    "identifier": CDC_IDENTIFIER,
    "title": "Código de Defesa do Consumidor",
    "status": "vigente",
    "verification_date": "2026-10-31",
    "official_source_org": "Câmara dos Deputados",
    "official_source_url": "https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html",
    "status_basis_url": "https://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm",
    "related_source_urls": [],
}
RULES_FILE = Path(__file__).resolve().parents[1] / "data" / "cdc_rules.json"


class CDCHTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.fixture = tempfile.TemporaryDirectory()
        cls.index_dir = Path(cls.fixture.name) / "indices"
        cls.index_dir.mkdir()
        (cls.index_dir / "cdc.jsonl").write_text(
            json.dumps(CDC_RECORD, ensure_ascii=False) + "\n", encoding="utf-8"
        )
        handler = make_handler(cls.index_dir, RULES_FILE, FRONTEND_DIR)
        cls.server = ThreadingHTTPServer(("127.0.0.1", 0), handler)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls) -> None:
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=2)
        cls.fixture.cleanup()

    def test_home_has_security_headers(self) -> None:
        with urlopen(self.base_url + "/", timeout=2) as response:
            html = response.read().decode("utf-8")
            self.assertEqual(response.status, 200)
            self.assertIn("Informação clara", html)
            self.assertEqual(response.headers["X-Frame-Options"], "DENY")
            self.assertIn("default-src 'self'", response.headers["Content-Security-Policy"])
            self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_health_and_search_endpoints(self) -> None:
        with urlopen(self.base_url + "/api/health", timeout=2) as response:
            health = json.loads(response.read())
        self.assertEqual(health["status"], "ok")
        self.assertEqual(health["law_status"], "vigente")
        with urlopen(self.base_url + "/api/rules?q=pre%C3%A7o", timeout=2) as response:
            result = json.loads(response.read())
        self.assertEqual(result["law"]["identifier"], CDC_IDENTIFIER)
        self.assertGreaterEqual(result["matched_rules"], 1)

    def test_missing_catalog_returns_service_unavailable(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            empty_indices = Path(tmp) / "indices"
            empty_indices.mkdir()
            server = ThreadingHTTPServer(
                ("127.0.0.1", 0), make_handler(empty_indices, RULES_FILE, FRONTEND_DIR)
            )
            thread = threading.Thread(target=server.serve_forever, daemon=True)
            thread.start()
            try:
                with self.assertRaises(HTTPError) as raised:
                    urlopen(f"http://127.0.0.1:{server.server_port}/api/rules", timeout=2)
                self.assertEqual(raised.exception.code, 503)
                payload = json.loads(raised.exception.read())
                self.assertIn("catálogo", payload["error"])
            finally:
                server.shutdown()
                server.server_close()
                thread.join(timeout=2)

    def test_api_rejects_writes_and_unknown_paths(self) -> None:
        request = Request(self.base_url + "/api/rules", data=b"{}", method="POST")
        with self.assertRaises(HTTPError) as raised:
            urlopen(request, timeout=2)
        self.assertEqual(raised.exception.code, 405)
        with self.assertRaises(HTTPError) as raised:
            urlopen(self.base_url + "/.git/config", timeout=2)
        self.assertEqual(raised.exception.code, 404)


if __name__ == "__main__":
    unittest.main()
