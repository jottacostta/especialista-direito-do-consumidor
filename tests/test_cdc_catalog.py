from __future__ import annotations

import json
import tempfile
import unittest
from pathlib import Path

from backend.catalog import (
    CDC_IDENTIFIER,
    RULES_FILE,
    CatalogIntegrationError,
    build_bundle,
    find_cdc_record,
    load_rules,
)


class CDCCatalogTests(unittest.TestCase):
    def setUp(self) -> None:
        self.temp_dir = tempfile.TemporaryDirectory()
        self.index_dir = Path(self.temp_dir.name) / "indices"
        self.index_dir.mkdir()
        self.record = {
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
        self._write_records([self.record])

    def tearDown(self) -> None:
        self.temp_dir.cleanup()

    def _write_records(self, records: list[dict]) -> None:
        path = self.index_dir / "02-federal-fundamentais.jsonl"
        path.write_text("".join(json.dumps(row, ensure_ascii=False) + "\n" for row in records), encoding="utf-8")

    def test_resolves_exact_cdc_entry_from_catalog(self) -> None:
        result = find_cdc_record(self.index_dir)
        self.assertEqual(result["identifier"], CDC_IDENTIFIER)
        self.assertEqual(result["status"], "vigente")
        self.assertEqual(result["verification_date"], "2026-10-31")
        self.assertTrue(result["official_source_url"].startswith("https://"))

    def test_rejects_missing_cdc_record(self) -> None:
        self._write_records([])
        with self.assertRaisesRegex(CatalogIntegrationError, "exatamente um"):
            find_cdc_record(self.index_dir)

    def test_rejects_duplicate_cdc_entries(self) -> None:
        self._write_records([self.record, self.record])
        with self.assertRaisesRegex(CatalogIntegrationError, "exatamente um"):
            find_cdc_record(self.index_dir)

    def test_rejects_unverified_status_or_source(self) -> None:
        changed = {**self.record, "status": "nao_verificada"}
        self._write_records([changed])
        with self.assertRaisesRegex(CatalogIntegrationError, "não marca"):
            find_cdc_record(self.index_dir)
        changed = {**self.record, "official_source_url": "http://example.org/law"}
        self._write_records([changed])
        with self.assertRaisesRegex(CatalogIntegrationError, "HTTPS"):
            find_cdc_record(self.index_dir)

    def test_rejects_malformed_json_in_an_index(self) -> None:
        (self.index_dir / "other.jsonl").write_text("{invalid}\n", encoding="utf-8")
        with self.assertRaisesRegex(CatalogIntegrationError, "JSON inválido"):
            find_cdc_record(self.index_dir)

    def test_rule_catalog_is_valid_and_unique(self) -> None:
        rules = load_rules(RULES_FILE)
        self.assertGreaterEqual(len(rules), 5)
        self.assertEqual(len({rule["id"] for rule in rules}), len(rules))
        self.assertTrue(all(rule["articles"] and rule["checklist"] for rule in rules))

    def test_bundle_search_is_accent_insensitive_and_uses_catalog_source(self) -> None:
        bundle = build_bundle(self.index_dir, RULES_FILE, query="preco")
        self.assertEqual(bundle["law"]["identifier"], CDC_IDENTIFIER)
        self.assertGreater(bundle["matched_rules"], 0)
        self.assertTrue(any(rule["id"] == "preco-e-oferta" for rule in bundle["rules"]))
        filtered = build_bundle(self.index_dir, RULES_FILE, category="Cobrança e pagamentos")
        self.assertEqual([row["id"] for row in filtered["rules"]], ["cobranca-sem-constrangimento"])

    def test_search_limits_and_unknown_categories_are_rejected(self) -> None:
        with self.assertRaises(ValueError):
            build_bundle(self.index_dir, RULES_FILE, query="x" * 121)
        with self.assertRaisesRegex(ValueError, "não existe"):
            build_bundle(self.index_dir, RULES_FILE, category="inventado")


if __name__ == "__main__":
    unittest.main()
