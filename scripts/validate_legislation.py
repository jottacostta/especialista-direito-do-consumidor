#!/usr/bin/env python3
"""Valida estrutura e duplicatas nos índices legislativos JSONL.

Não acessa a internet e não confirma vigência ou autoridade da fonte.
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from datetime import date
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
INDEX_DIR = ROOT / "legislacao" / "indices"
REQUIRED = {
    "jurisdiction",
    "territory",
    "kind",
    "identifier",
    "title",
    "enacted_date",
    "status",
    "consumer_relevance",
    "official_source_url",
    "official_source_org",
    "status_basis_url",
    "verification_date",
    "tags",
    "notes",
}
JURISDICTIONS = {"federal", "state", "district", "municipal"}
STATUSES = {
    "vigente",
    "parcialmente_vigente",
    "revogada",
    "declarada_inconstitucional",
    "nao_verificada",
}


def valid_iso_date(value: object, *, allow_empty: bool = False) -> bool:
    if allow_empty and value == "":
        return True
    if not isinstance(value, str):
        return False
    try:
        date.fromisoformat(value)
        return True
    except ValueError:
        return False


def valid_url(value: object, *, allow_empty: bool = False) -> bool:
    if allow_empty and value == "":
        return True
    if not isinstance(value, str) or any(ch.isspace() for ch in value):
        return False
    parsed = urlparse(value)
    return parsed.scheme in {"http", "https"} and bool(parsed.netloc)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--strict-duplicates",
        action="store_true",
        help="retorna falha se uma norma aparecer mais de uma vez no conjunto",
    )
    args = parser.parse_args()

    files = sorted(INDEX_DIR.glob("*.jsonl")) if INDEX_DIR.exists() else []
    errors: list[str] = []
    duplicates: dict[tuple[str, str, str], list[str]] = defaultdict(list)
    records = 0

    for path in files:
        for line_number, raw in enumerate(path.read_text(encoding="utf-8").splitlines(), 1):
            if not raw.strip():
                continue
            try:
                item = json.loads(raw)
            except json.JSONDecodeError as exc:
                errors.append(f"{path.name}:{line_number}: JSON inválido: {exc.msg}")
                continue
            records += 1
            if not isinstance(item, dict):
                errors.append(f"{path.name}:{line_number}: cada linha deve ser um objeto JSON")
                continue

            missing = REQUIRED - item.keys()
            if missing:
                errors.append(
                    f"{path.name}:{line_number}: campos ausentes: {', '.join(sorted(missing))}"
                )
                continue

            for field in ("jurisdiction", "territory", "kind", "identifier", "title",
                          "consumer_relevance", "official_source_org", "notes"):
                if not isinstance(item[field], str) or not item[field].strip():
                    errors.append(f"{path.name}:{line_number}: {field} deve ser texto não vazio")

            if item["jurisdiction"] not in JURISDICTIONS:
                errors.append(f"{path.name}:{line_number}: jurisdiction inválido")
            if item["status"] not in STATUSES:
                errors.append(f"{path.name}:{line_number}: status inválido")
            if not valid_iso_date(item["verification_date"]):
                errors.append(f"{path.name}:{line_number}: verification_date deve usar AAAA-MM-DD")
            if not valid_iso_date(item["enacted_date"], allow_empty=True):
                errors.append(f"{path.name}:{line_number}: enacted_date deve usar AAAA-MM-DD ou vazio")
            if not valid_url(item["official_source_url"]):
                errors.append(f"{path.name}:{line_number}: official_source_url inválida")
            if not valid_url(item["status_basis_url"], allow_empty=True):
                errors.append(f"{path.name}:{line_number}: status_basis_url inválida")
            if not isinstance(item["tags"], list) or not all(
                isinstance(tag, str) for tag in item["tags"]
            ):
                errors.append(f"{path.name}:{line_number}: tags deve ser uma lista de textos")
            if "related_source_urls" in item and (
                not isinstance(item["related_source_urls"], list)
                or not all(valid_url(url) for url in item["related_source_urls"])
            ):
                errors.append(
                    f"{path.name}:{line_number}: related_source_urls deve ser uma lista de URLs válidas"
                )

            key = (item["jurisdiction"], item["territory"], item["identifier"])
            duplicates[key].append(f"{path.name}:{line_number}")

    duplicate_sets = {key: refs for key, refs in duplicates.items() if len(refs) > 1}
    print(f"Arquivos JSONL: {len(files)} | Registros lidos: {records}")
    for message in errors:
        print(f"ERRO: {message}", file=sys.stderr)
    for key, refs in sorted(duplicate_sets.items()):
        print(
            f"DUPLICATA: {key[0]} / {key[1]} / {key[2]} — {', '.join(refs)}",
            file=sys.stderr,
        )

    if duplicate_sets and not args.strict_duplicates:
        print(
            f"Aviso: {len(duplicate_sets)} chaves duplicadas; use --strict-duplicates "
            "para tratá-las como falha."
        )
    if not files:
        print("Aviso: nenhum arquivo JSONL encontrado.")

    if errors or (args.strict_duplicates and duplicate_sets):
        print("Validação reprovada.", file=sys.stderr)
        return 1
    print("Validação estrutural concluída; confirme as fontes e a vigência manualmente.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
