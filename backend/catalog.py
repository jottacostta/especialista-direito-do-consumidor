"""Integra regras informativas do CDC ao registro federal do catálogo legislativo."""

from __future__ import annotations

import json
import re
import unicodedata
from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
INDEX_DIR = ROOT / "legislacao" / "indices"
RULES_FILE = ROOT / "data" / "cdc_rules.json"
CDC_IDENTIFIER = "Lei nº 8.078, de 11 de setembro de 1990"
RULE_FIELDS = {
    "id",
    "title",
    "category",
    "articles",
    "summary",
    "when_applicable",
    "checklist",
    "safe_response",
    "caution",
}


class CatalogIntegrationError(Exception):
    """Indica que o catálogo não permite servir informação legal rastreável."""


def _is_https_url(value: Any) -> bool:
    if not isinstance(value, str) or any(char.isspace() for char in value):
        return False
    parsed = urlparse(value)
    return parsed.scheme == "https" and bool(parsed.netloc)


def _normalize(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value.casefold())
    return "".join(char for char in decomposed if not unicodedata.combining(char))


def find_cdc_record(index_dir: Path = INDEX_DIR) -> dict[str, Any]:
    """Localiza uma única entrada federal do CDC e verifica sua proveniência mínima."""
    if not index_dir.is_dir():
        raise CatalogIntegrationError("Diretório de índices legislativos não encontrado.")

    matches: list[dict[str, Any]] = []
    for path in sorted(index_dir.glob("*.jsonl")):
        try:
            lines = path.read_text(encoding="utf-8").splitlines()
        except OSError as exc:
            raise CatalogIntegrationError("Não foi possível ler um índice legislativo.") from exc
        for line_number, raw in enumerate(lines, 1):
            if not raw.strip():
                continue
            try:
                item = json.loads(raw)
            except json.JSONDecodeError as exc:
                raise CatalogIntegrationError(
                    f"JSON inválido no índice {path.name}, linha {line_number}."
                ) from exc
            if not isinstance(item, dict):
                raise CatalogIntegrationError(
                    f"Registro não é um objeto JSON em {path.name}, linha {line_number}."
                )
            if (
                item.get("jurisdiction") == "federal"
                and item.get("territory") == "BR"
                and item.get("identifier") == CDC_IDENTIFIER
            ):
                matches.append(item)

    if len(matches) != 1:
        raise CatalogIntegrationError(
            "O catálogo deve conter exatamente um registro federal da Lei nº 8.078/1990."
        )

    record = matches[0]
    if record.get("status") != "vigente":
        raise CatalogIntegrationError(
            "O catálogo não marca o registro do CDC como vigente; confirme a fonte antes de usar o guia."
        )
    if not _is_https_url(record.get("official_source_url")):
        raise CatalogIntegrationError("O registro do CDC não contém uma fonte oficial HTTPS válida.")
    if not isinstance(record.get("title"), str) or not record["title"].strip():
        raise CatalogIntegrationError("O registro do CDC não contém título legível.")
    try:
        verified = date.fromisoformat(record.get("verification_date", ""))
    except (TypeError, ValueError) as exc:
        raise CatalogIntegrationError(
            "A data de verificação do registro do CDC está ausente ou inválida."
        ) from exc

    related = record.get("related_source_urls", [])
    if not isinstance(related, list) or not all(_is_https_url(url) for url in related):
        raise CatalogIntegrationError("Há uma fonte complementar inválida no registro do CDC.")

    return {
        "identifier": record["identifier"],
        "title": record["title"],
        "jurisdiction": record["jurisdiction"],
        "territory": record["territory"],
        "status": record["status"],
        "verification_date": verified.isoformat(),
        "official_source_org": record.get("official_source_org", ""),
        "official_source_url": record["official_source_url"],
        "status_basis_url": record.get("status_basis_url", ""),
        "related_source_urls": related,
    }


def load_rules(rules_file: Path = RULES_FILE) -> list[dict[str, Any]]:
    """Lê e valida regras editoriais, sem interpretá-las como parecer jurídico."""
    try:
        payload = json.loads(rules_file.read_text(encoding="utf-8"))
    except OSError as exc:
        raise CatalogIntegrationError("Arquivo de regras informativas não encontrado.") from exc
    except json.JSONDecodeError as exc:
        raise CatalogIntegrationError("O arquivo de regras informativas contém JSON inválido.") from exc

    if not isinstance(payload, list) or not payload:
        raise CatalogIntegrationError("A lista de regras informativas está vazia ou inválida.")

    seen: set[str] = set()
    for position, rule in enumerate(payload, 1):
        if not isinstance(rule, dict) or set(rule) != RULE_FIELDS:
            raise CatalogIntegrationError(f"Regra {position} possui campos ausentes ou inesperados.")
        if any(not isinstance(rule[field], str) or not rule[field].strip() for field in (
            "id", "title", "category", "summary", "when_applicable", "safe_response", "caution"
        )):
            raise CatalogIntegrationError(f"Regra {position} contém texto obrigatório vazio.")
        if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", rule["id"]):
            raise CatalogIntegrationError(f"Identificador inválido na regra {position}.")
        if rule["id"] in seen:
            raise CatalogIntegrationError(f"Identificador repetido na regra {position}.")
        seen.add(rule["id"])
        if not isinstance(rule["articles"], list) or not rule["articles"] or not all(
            isinstance(article, str) and article.strip() for article in rule["articles"]
        ):
            raise CatalogIntegrationError(f"Referência de artigo inválida na regra {position}.")
        if not isinstance(rule["checklist"], list) or not rule["checklist"] or not all(
            isinstance(step, str) and step.strip() for step in rule["checklist"]
        ):
            raise CatalogIntegrationError(f"Checklist inválido na regra {position}.")

    return payload


def build_bundle(
    index_dir: Path = INDEX_DIR,
    rules_file: Path = RULES_FILE,
    query: str = "",
    category: str = "",
) -> dict[str, Any]:
    """Combina resumo editorial e proveniência do CDC vindos do catálogo validado."""
    if len(query) > 120:
        raise ValueError("A busca deve ter no máximo 120 caracteres.")
    if len(category) > 80:
        raise ValueError("O filtro de tema é inválido.")

    law = find_cdc_record(index_dir)
    rules = load_rules(rules_file)
    categories = sorted({rule["category"] for rule in rules})
    if category and category not in categories:
        raise ValueError("O tema solicitado não existe.")

    normalized_query = _normalize(query.strip())
    selected: list[dict[str, Any]] = []
    for rule in rules:
        if category and rule["category"] != category:
            continue
        searchable = " ".join(
            [rule["title"], rule["category"], rule["summary"], rule["when_applicable"],
             *rule["articles"], *rule["checklist"], rule["safe_response"], rule["caution"]]
        )
        if normalized_query and normalized_query not in _normalize(searchable):
            continue
        selected.append(rule)

    return {
        "law": law,
        "categories": categories,
        "total_rules": len(rules),
        "matched_rules": len(selected),
        "rules": selected,
    }
