# Instruções para agentes de código e pesquisa

Leia `docs/RETOMADA_CHATGPT.md` antes de continuar trabalho em andamento e `legislacao/README.md` antes de alterar qualquer índice.

## Escopo e segurança jurídica

O projeto é um assistente de informação geral sobre relações de consumo no Brasil. A prioridade inicial é o Estado do Rio de Janeiro e o Município do Rio de Janeiro. Não apresente o produto como advogado, parecer profissional ou sistema já validado. Não invente leis, artigos, datas, vigência, decisões ou links. Diferencie fatos fornecidos, inferências e informação conferida em fonte oficial. Quando a vigência não estiver demonstrada em fonte primária, use `nao_verificada`.

## Dados legislativos

Siga o esquema de `legislacao/README.md`. Inclua atos normativos, não projetos de lei ou decisões individuais. Use links de fontes oficiais e registre a URL que sustenta o status quando ela for diferente da fonte do texto. Não copie textos integrais nem introduza dados pessoais. Preserve um objeto JSON por linha em UTF-8, com datas ISO `AAAA-MM-DD`.

## Fluxo Git

Trabalhe em branch de tarefa baseado no `main` atualizado. Não faça push direto em `main` nem mescle um PR sem autorização explícita. Preserve resultados parciais e histórico. Abra ou atualize um PR para revisão quando a alteração estiver pronta para publicação; deixe claro se os dados ainda não passaram por revisão jurídica substantiva. Nunca inclua credenciais, tokens ou arquivos `.env`.

## Validação

Execute `python3 scripts/validate_legislation.py` para verificar JSONL e campos. Resolva duplicatas e depois execute `python3 scripts/validate_legislation.py --strict-duplicates`. O script não acessa a internet e não verifica se uma lei continua vigente; essa checagem exige abrir a fonte oficial indicada. Não declare o catálogo exaustivo sem comprovação documentada de cobertura.
