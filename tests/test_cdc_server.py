from __future__ import annotations

import json
import tempfile
import threading
import unittest
from http.server import ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

from api.health import handler as VercelHealthHandler
from api.rules import handler as VercelRulesHandler
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
ROOT = Path(__file__).resolve().parents[1]
RULES_FILE = ROOT / "data" / "cdc_rules.json"


class CDCHTTPTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.fixture = tempfile.TemporaryDirectory()
        cls.index_dir = Path(cls.fixture.name) / "indices"
        cls.index_dir.mkdir()
        (cls.index_dir / "cdc.jsonl").write_text(
            json.dumps(CDC_RECORD, ensure_ascii=False) + "\n", encoding="utf-8"
        )

        cls.local_server = ThreadingHTTPServer(
            ("127.0.0.1", 0), make_handler(cls.index_dir, RULES_FILE, FRONTEND_DIR)
        )
        cls.local_thread = threading.Thread(target=cls.local_server.serve_forever, daemon=True)
        cls.local_thread.start()
        cls.local_url = f"http://127.0.0.1:{cls.local_server.server_port}"

        cls.vercel_server = ThreadingHTTPServer(("127.0.0.1", 0), VercelRulesHandler)
        cls.vercel_thread = threading.Thread(target=cls.vercel_server.serve_forever, daemon=True)
        cls.vercel_thread.start()
        cls.vercel_url = f"http://127.0.0.1:{cls.vercel_server.server_port}"

        cls.vercel_health_server = ThreadingHTTPServer(("127.0.0.1", 0), VercelHealthHandler)
        cls.vercel_health_thread = threading.Thread(
            target=cls.vercel_health_server.serve_forever, daemon=True
        )
        cls.vercel_health_thread.start()
        cls.vercel_health_url = f"http://127.0.0.1:{cls.vercel_health_server.server_port}"

    @classmethod
    def tearDownClass(cls) -> None:
        for server in (cls.local_server, cls.vercel_server, cls.vercel_health_server):
            server.shutdown()
            server.server_close()
        for thread in (cls.local_thread, cls.vercel_thread, cls.vercel_health_thread):
            thread.join(timeout=2)
        cls.fixture.cleanup()

    def test_home_has_security_headers(self) -> None:
        with urlopen(self.local_url + "/", timeout=2) as response:
            html = response.read().decode("utf-8")
            self.assertEqual(response.status, 200)
            self.assertIn("Informação clara", html)
            self.assertEqual(response.headers["X-Frame-Options"], "DENY")
            self.assertIn("default-src 'self'", response.headers["Content-Security-Policy"])
            self.assertEqual(response.headers["Cache-Control"], "no-store")

    def test_health_and_search_endpoints(self) -> None:
        with urlopen(self.local_url + "/api/health", timeout=2) as response:
            health = json.loads(response.read())
        self.assertEqual(health["status"], "ok")
        self.assertEqual(health["law_status"], "vigente")
        with urlopen(self.local_url + "/api/rules?q=pre%C3%A7o", timeout=2) as response:
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

    def test_vercel_file_based_functions_serve_health_and_rules(self) -> None:
        with urlopen(self.vercel_health_url + "/api/health", timeout=2) as response:
            health = json.loads(response.read())
            self.assertEqual(response.headers["X-Frame-Options"], "DENY")
        self.assertEqual(health["status"], "ok")
        self.assertEqual(health["law_status"], "vigente")

        with urlopen(self.vercel_url + "/api/rules", timeout=2) as response:
            result = json.loads(response.read())
            self.assertEqual(response.headers["Cache-Control"], "no-store")
        self.assertEqual(result["law"]["identifier"], CDC_IDENTIFIER)
        self.assertEqual(result["total_rules"], 6)

    def test_vercel_function_rejects_writes_and_bad_parameters(self) -> None:
        request = Request(self.vercel_url + "/api/rules", data=b"{}", method="POST")
        with self.assertRaises(HTTPError) as raised:
            urlopen(request, timeout=2)
        self.assertEqual(raised.exception.code, 405)
        with self.assertRaises(HTTPError) as raised:
            urlopen(self.vercel_url + "/api/rules?unknown=value", timeout=2)
        self.assertEqual(raised.exception.code, 400)

    def test_api_rejects_writes_and_unknown_paths(self) -> None:
        request = Request(self.local_url + "/api/rules", data=b"{}", method="POST")
        with self.assertRaises(HTTPError) as raised:
            urlopen(request, timeout=2)
        self.assertEqual(raised.exception.code, 405)
        with self.assertRaises(HTTPError) as raised:
            urlopen(self.local_url + "/.git/config", timeout=2)
        self.assertEqual(raised.exception.code, 404)

    def test_vercel_config_and_public_assets_are_present(self) -> None:
        config = json.loads((ROOT / "vercel.json").read_text(encoding="utf-8"))
        include_files = config["functions"]["api/**/*.py"]["includeFiles"]
        self.assertIn("legislacao/indices/**/*.jsonl", include_files)
        self.assertIn("data/cdc_rules.json", include_files)
        self.assertTrue((ROOT / "public" / "index.html").is_file())
        self.assertTrue((ROOT / "public" / "styles.css").is_file())
        self.assertTrue((ROOT / "public" / "app.js").is_file())


if __name__ == "__main__":
    unittest.main()
