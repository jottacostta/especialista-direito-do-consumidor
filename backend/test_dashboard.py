"""Painel de desenvolvimento local para relatórios completos de unittest.

Não faz parte do servidor de atendimento nem do deploy Vercel.
"""

from __future__ import annotations

import argparse
import io
import json
import threading
import time
import unittest
from collections import Counter
from datetime import datetime
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
TESTS_DIR = ROOT / "tests"
DASHBOARD_DIR = ROOT / "tools" / "test-dashboard"
LOCAL_HOSTS = {"127.0.0.1", "localhost"}


def classify_test_group(test_id: str) -> str:
    """Agrupa os testes existentes por camada, sem inferir pelo texto do teste."""
    if ".test_cdc_catalog." in test_id:
        return "Unitário · Catálogo CDC"
    if ".test_cdc_server." in test_id:
        return "Integração · HTTP local e Vercel"
    if ".test_test_dashboard." in test_id:
        return "Unitário · Painel de testes"
    return "Outros testes"


class DashboardTestResult(unittest.TextTestResult):
    """TextTestResult que preserva o status, duração e traceback de cada caso."""

    def __init__(self, stream: Any, descriptions: bool, verbosity: int) -> None:
        super().__init__(stream, descriptions, verbosity)
        self.records: list[dict[str, Any]] = []
        self._record_by_test: dict[int, dict[str, Any]] = {}
        self._started_at: dict[int, float] = {}

    def startTest(self, test: unittest.case.TestCase) -> None:  # noqa: N802
        started = time.perf_counter()
        try:
            test_id = test.id()
        except Exception:
            test_id = str(test)
        class_name = f"{test.__class__.__module__}.{test.__class__.__qualname__}"
        record: dict[str, Any] = {
            "id": test_id,
            "name": getattr(test, "_testMethodName", test.__class__.__name__),
            "class": class_name,
            "group": classify_test_group(test_id),
            "outcome": "running",
            "duration_seconds": 0.0,
            "details": "",
        }
        key = id(test)
        self.records.append(record)
        self._record_by_test[key] = record
        self._started_at[key] = started
        super().startTest(test)

    def stopTest(self, test: unittest.case.TestCase) -> None:  # noqa: N802
        key = id(test)
        record = self._record_by_test.get(key)
        started = self._started_at.pop(key, None)
        if record is not None and started is not None:
            record["duration_seconds"] = round(time.perf_counter() - started, 6)
        super().stopTest(test)

    def _set_outcome(self, test: unittest.case.TestCase, outcome: str, details: str = "") -> None:
        record = self._record_by_test.get(id(test))
        if record is not None:
            record["outcome"] = outcome
            record["details"] = details

    def addSuccess(self, test: unittest.case.TestCase) -> None:  # noqa: N802
        self._set_outcome(test, "passed")
        super().addSuccess(test)

    def addFailure(self, test: unittest.case.TestCase, err: Any) -> None:  # noqa: N802
        self._set_outcome(test, "failed", self._exc_info_to_string(err, test))
        super().addFailure(test, err)

    def addError(self, test: unittest.case.TestCase, err: Any) -> None:  # noqa: N802
        self._set_outcome(test, "error", self._exc_info_to_string(err, test))
        super().addError(test, err)

    def addSkip(self, test: unittest.case.TestCase, reason: str) -> None:  # noqa: N802
        self._set_outcome(test, "skipped", reason)
        super().addSkip(test, reason)

    def addExpectedFailure(self, test: unittest.case.TestCase, err: Any) -> None:  # noqa: N802
        self._set_outcome(test, "expected_failure", self._exc_info_to_string(err, test))
        super().addExpectedFailure(test, err)

    def addUnexpectedSuccess(self, test: unittest.case.TestCase) -> None:  # noqa: N802
        self._set_outcome(test, "unexpected_success", "O teste marcado como esperado falhar passou.")
        super().addUnexpectedSuccess(test)


def run_test_suite() -> dict[str, Any]:
    """Executa a suíte descoberta e devolve o relatório completo em memória."""
    generated_at = datetime.now().astimezone().isoformat(timespec="seconds")
    started = time.perf_counter()
    output = io.StringIO()
    suite = unittest.defaultTestLoader.discover(
        start_dir=str(TESTS_DIR),
        pattern="test*.py",
        top_level_dir=str(ROOT),
    )
    runner = unittest.TextTestRunner(
        stream=output,
        verbosity=2,
        resultclass=DashboardTestResult,
    )
    result = runner.run(suite)
    duration = round(time.perf_counter() - started, 3)
    records = result.records
    counts = Counter(record["outcome"] for record in records)
    return {
        "schema_version": 1,
        "generated_at": generated_at,
        "duration_seconds": duration,
        "success": result.wasSuccessful(),
        "counts": {
            "total": len(records),
            "passed": counts["passed"],
            "failed": counts["failed"],
            "errors": counts["error"],
            "skipped": counts["skipped"],
            "expected_failures": counts["expected_failure"],
            "unexpected_successes": counts["unexpected_success"],
        },
        "groups": sorted({record["group"] for record in records}),
        "tests": records,
        "console_output": output.getvalue(),
    }


def _is_allowed_host(header: str, port: int) -> bool:
    try:
        parsed = urlsplit("//" + header)
        return parsed.hostname in LOCAL_HOSTS and parsed.port == port
    except ValueError:
        return False


def _is_allowed_origin(origin: str, port: int) -> bool:
    try:
        parsed = urlsplit(origin)
        return (
            parsed.scheme == "http"
            and parsed.hostname in LOCAL_HOSTS
            and parsed.port == port
            and parsed.path in ("", "/")
            and not parsed.query
            and not parsed.fragment
        )
    except ValueError:
        return False


class TestDashboardHTTPServer(ThreadingHTTPServer):
    daemon_threads = True
    allow_reuse_address = True

    def __init__(self, address: tuple[str, int], report: dict[str, Any]) -> None:
        self._report = report
        self._report_lock = threading.Lock()
        self._run_lock = threading.Lock()
        super().__init__(address, DashboardRequestHandler)

    def get_report(self) -> dict[str, Any]:
        with self._report_lock:
            return self._report

    def set_report(self, report: dict[str, Any]) -> None:
        with self._report_lock:
            self._report = report


class DashboardRequestHandler(BaseHTTPRequestHandler):
    server_version = "LocalTestDashboard/1.0"
    sys_version = ""

    def log_message(self, format: str, *args: Any) -> None:
        # Não gravar caminhos, conteúdo de relatórios nem requisições locais.
        return

    def log_error(self, format: str, *args: Any) -> None:
        return

    def _headers(self, content_type: str, length: int) -> None:
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(length))
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

    def _send(self, status: int, body: bytes, content_type: str) -> None:
        self.send_response(status)
        self._headers(content_type, len(body))
        self.end_headers()
        self.wfile.write(body)

    def _send_json(self, status: int, payload: dict[str, Any]) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self._send(status, body, "application/json; charset=utf-8")

    def _check_local_request(self) -> bool:
        port = self.server.server_port
        if not _is_allowed_host(self.headers.get("Host", ""), port):
            self._send_json(403, {"error": "Acesso permitido somente por localhost."})
            return False
        origin = self.headers.get("Origin")
        if origin and not _is_allowed_origin(origin, port):
            self._send_json(403, {"error": "Origem não permitida."})
            return False
        return True

    def do_GET(self) -> None:  # noqa: N802
        if not self._check_local_request():
            return
        path = urlsplit(self.path).path
        if path == "/api/report":
            self._send_json(200, self.server.get_report())
            return

        files = {
            "/": DASHBOARD_DIR / "index.html",
            "/index.html": DASHBOARD_DIR / "index.html",
            "/styles.css": DASHBOARD_DIR / "styles.css",
            "/app.js": DASHBOARD_DIR / "app.js",
        }
        file_path = files.get(path)
        if file_path is None:
            self._send(404, b"Nao encontrado", "text/plain; charset=utf-8")
            return
        try:
            body = file_path.read_bytes()
        except OSError:
            self._send(404, b"Arquivo do painel nao encontrado", "text/plain; charset=utf-8")
            return
        content_type = "text/html; charset=utf-8" if file_path.suffix == ".html" else (
            "text/css; charset=utf-8" if file_path.suffix == ".css" else "text/javascript; charset=utf-8"
        )
        self._send(200, body, content_type)

    def do_POST(self) -> None:  # noqa: N802
        if not self._check_local_request():
            return
        if self.path != "/api/run":
            self._send_json(404, {"error": "Rota não encontrada."})
            return
        if not self.server._run_lock.acquire(blocking=False):
            self._send_json(409, {"error": "Já há uma execução de testes em andamento."})
            return
        try:
            report = run_test_suite()
            self.server.set_report(report)
            self._send_json(200, report)
        except Exception:
            self._send_json(500, {"error": "Não foi possível gerar o relatório de testes."})
        finally:
            self.server._run_lock.release()

    def do_PUT(self) -> None:  # noqa: N802
        self._send_json(405, {"error": "Método não permitido."})

    def do_PATCH(self) -> None:  # noqa: N802
        self._send_json(405, {"error": "Método não permitido."})

    def do_DELETE(self) -> None:  # noqa: N802
        self._send_json(405, {"error": "Método não permitido."})


def serve(port: int = 8765) -> None:
    if not 1024 <= port <= 65535:
        raise ValueError("A porta deve estar entre 1024 e 65535.")
    report = run_test_suite()
    server = TestDashboardHTTPServer(("127.0.0.1", port), report)
    counts = report["counts"]
    print(
        f"Painel de testes local: http://127.0.0.1:{port} "
        f"({counts['total']} casos; {counts['passed']} aprovados; "
        f"{counts['failed'] + counts['errors']} falhas/erros).",
        flush=True,
    )
    print("Somente neste computador; relatório em memória, sem acesso pelo deploy da aplicação. Ctrl+C encerra.", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nPainel encerrado.")
    finally:
        server.server_close()


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--port", type=int, default=8765, help="porta local do painel (padrão: 8765)")
    args = parser.parse_args()
    try:
        serve(args.port)
    except OSError as exc:
        parser.error(f"não foi possível iniciar o painel local: {exc}")
    except ValueError as exc:
        parser.error(str(exc))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
