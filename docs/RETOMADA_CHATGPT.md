# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-01. Este documento resume o estado de trabalho para que outra sessão possa continuar sem depender do histórico desta conversa.

## Objetivo e prioridade

O repositório privado `jottacostta/especialista-direito-do-consumidor` está construindo um assistente de informação geral sobre direito do consumidor brasileiro. A prioridade é o Estado do Rio de Janeiro e o Município do Rio de Janeiro, junto com normas federais aplicáveis. O catálogo contém índices de atos normativos e links oficiais, não cópias integrais das leis.

## Estado do catálogo

Os 39 atos do RJ no escopo desta rodada foram auditados com data de corte em 2026-11-01: 25 têm status recomendado `vigente`, 6 `declarada_inconstitucional`, 2 `parcialmente_vigente` e 6 `nao_verificada`. O workflow entregou 38 resultados estruturados. A Lei municipal nº 7.023/2021 teve falha de submissão JSON, mas deixou memorando individual com referências oficiais do Diário Oficial, da Câmara e do TJRJ. O memorando foi revisado, e o registro foi atualizado para `parcialmente_vigente`, com os dispositivos julgados inconstitucionais e as limitações da evidência. Os detalhes e as fontes estão em `docs/auditoria-rj-2026-11-01.md`.

A deduplicação consolidou 14 grupos e removeu 18 cópias secundárias. As tags, fontes oficiais complementares e notas pertinentes foram preservadas nos registros canônicos. Restam 229 registros em 16 arquivos e nenhuma chave repetida pelo critério do validador (`jurisdiction`, `territory`, `identifier`). O índice permanece seletivo e não exaustivo.

O validador aceita `declarada_inconstitucional`, distinta de `revogada`, e valida o campo opcional `related_source_urls`. Para as leis do RJ, o validador estrutural não substitui a consulta às fontes oficiais nem uma revisão profissional. Vários registros continuam `nao_verificada` por falta de confirmação oficial do estado atual.

## Validações executadas

Nesta atualização passaram `python3 -m py_compile scripts/validate_legislation.py`, `python3 scripts/validate_legislation.py`, `python3 scripts/validate_legislation.py --strict-duplicates` e `git diff --check`. O validador leu 229 registros em 16 arquivos; o modo estrito não encontrou duplicatas. A integridade das 67 citações numeradas do relatório também foi conferida.

## Arquivos principais desta atualização

- `legislacao/indices/00-estado-rj.jsonl` e `01-municipio-rio-de-janeiro.jsonl`: atualização dos 39 registros regionais auditados.
- Outros índices: consolidação das 14 duplicatas, com metadados e fontes alternativas preservados.
- `scripts/validate_legislation.py`: enum de status e validação de URLs complementares.
- `legislacao/README.md`: schema, contagens e limites.
- `docs/auditoria-rj-2026-11-01.md`: conclusões e fontes oficiais por ato.

## Limites e próximos passos

A auditoria cobre somente os 39 atos selecionados do Estado e da capital. Não demonstra cobertura exaustiva, não é parecer jurídico e não deve ser usada como conclusão para um caso concreto. `Não Consta` em um cadastro ou falta de resultado em pesquisa não equivale a certidão judicial negativa. Preserve as ressalvas junto a cada registro e confirme novamente a fonte oficial antes de utilizar um status em produto.

Quando retomar, confira o estado mais recente do PR e os checks do SHA atual. A expansão das coletas fora do RJ continua seletiva; a revisão jurídica profissional ainda é necessária antes de uso em um produto. Não faça merge em `main` sem autorização explícita da pessoa usuária.

## Branch, PR e acesso

O trabalho está no branch `research/legislacao-consumidor-2026-10-31`, baseado no commit inicial `4bc9c26` em `main`. O PR em rascunho é [#1](https://github.com/jottacostta/especialista-direito-do-consumidor/pull/1); `main` não foi alterada nem houve merge. Antes de continuar, confira `git status`, `git fetch --all --prune` e o estado do PR.

O repositório é privado. Para que uma sessão do ChatGPT consiga acessá-lo, a pessoa usuária precisa autorizar esse repositório no GitHub ou fornecer os arquivos por um canal permitido. Este documento não concede acesso nem inicia outra conta. O saldo de créditos não é monitorado pelo repositório.
