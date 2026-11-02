from __future__ import annotations

import io
import unittest

from backend.test_dashboard import DashboardTestResult, classify_test_group


class DashboardResultTests(unittest.TestCase):
    def _run_case(self, test_case: unittest.case.TestCase) -> tuple[DashboardTestResult, str]:
        stream = io.StringIO()
        runner = unittest.TextTestRunner(
            stream=stream,
            verbosity=2,
            resultclass=DashboardTestResult,
        )
        result = runner.run(unittest.TestSuite([test_case]))
        return result, stream.getvalue()

    def test_classifies_catalog_and_http_integration_layers(self) -> None:
        self.assertEqual(
            classify_test_group("tests.test_cdc_catalog.CDCCatalogTests.test_example"),
            "Unitário · Catálogo CDC",
        )
        self.assertEqual(
            classify_test_group("tests.test_cdc_server.CDCHTTPTests.test_example"),
            "Integração · HTTP local e Vercel",
        )

    def test_records_passing_test_and_duration(self) -> None:
        class PassingCase(unittest.TestCase):
            def runTest(self) -> None:
                self.assertTrue(True)

        result, output = self._run_case(PassingCase())
        self.assertTrue(result.wasSuccessful())
        self.assertEqual(len(result.records), 1)
        self.assertEqual(result.records[0]["outcome"], "passed")
        self.assertGreaterEqual(result.records[0]["duration_seconds"], 0)
        self.assertIn("Ran 1 test", output)

    def test_records_failure_with_full_traceback(self) -> None:
        class FailingCase(unittest.TestCase):
            def runTest(self) -> None:
                self.fail("erro simulado para validar o painel")

        result, _ = self._run_case(FailingCase())
        self.assertFalse(result.wasSuccessful())
        self.assertEqual(result.records[0]["outcome"], "failed")
        self.assertIn("erro simulado para validar o painel", result.records[0]["details"])
        self.assertIn("Traceback", result.records[0]["details"])


if __name__ == "__main__":
    unittest.main()
