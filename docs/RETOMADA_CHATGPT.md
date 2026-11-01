# Retomada do projeto — para ChatGPT

Atualizado em 2026-10-31. Este documento resume o estado de trabalho para que outra sessão possa continuar sem depender do histórico desta conversa.

## Objetivo e prioridade

O repositório privado `jottacostta/especialista-direito-do-consumidor` está construindo um assistente de informação geral sobre direito do consumidor brasileiro. A prioridade é o Estado do Rio de Janeiro e o Município do Rio de Janeiro, junto com as normas federais aplicáveis. A coleta cria um índice rastreável de atos normativos e links oficiais; não deve armazenar cópias integrais das leis.

## Estado da pesquisa

A coleta foi dividida em 16 frentes. O workflow reportou 8 entregas concluídas e 8 falhas por insuficiência de créditos. Houve uma tentativa de retomada, mas as frentes pendentes voltaram a falhar pelo mesmo motivo. No diretório há 10 arquivos JSONL com 219 registros: 178 registros estão nos oito resultados que o workflow marcou como concluídos; outros 41 estão em dois arquivos deixados por frentes que falharam e devem ser tratados como **parciais**, não como pesquisas concluídas.

O workflow marcou como concluídas estas frentes: `00-estado-rj.jsonl` (25 registros), `01-municipio-rio-de-janeiro.jsonl` (14), `03-federal-consumidor-geral.jsonl` (20), `04-digital-dados-atendimento.jsonl` (18), `07-saude-planos-medicamentos.jsonl` (25), `10-seguranca-produtos-alimentos.jsonl` (26), `11-habitacao-educacao-veiculos.jsonl` (22) e `15-estados-centro-oeste-df.jsonl` (28). As descrições de cada entrega estão no histórico do PR, mas precisam de revisão jurídica substantiva antes de uso.

Estas frentes falharam e não têm arquivo de saída concluído: `02-federal-fundamentais.jsonl`, `05-financeiro-credito-seguros.jsonl`, `06-telecom-postal.jsonl`, `08-energia-saneamento.jsonl`, `09-transporte-turismo.jsonl` e `13-estados-nordeste.jsonl`.

Os arquivos `12-estados-sudeste-sul.jsonl` (16 registros) e `14-estados-norte.jsonl` (25) existem, mas pertencem a agentes que falharam. Preserve-os como rascunhos e conclua/verifique a cobertura antes de incorporá-los como resultados completos. A legislação municipal fora da capital também não foi coberta nesta rodada.

## Duplicatas e validação

A verificação local encontrou seis duplicatas exatas entre os índices: Lei RJ 6.613/2013 (`00`/`04`); Lei RJ 8.265/2018 (`00`/`11`); Lei RJ 8.527/2019 (`00`/`04`); Leis municipais do Rio 6.309/2017 e 6.523/2019 (`01`/`04`); Lei municipal do Rio 7.384/2022 (`01`/`04`). Compare conteúdo, status e fontes antes de remover ou consolidar qualquer registro.

`python3 scripts/validate_legislation.py` verifica estrutura e registra as seis duplicatas como avisos. Use `python3 scripts/validate_legislation.py --strict-duplicates` depois de resolvê-las. O validador não acessa a internet e não confirma que links, vigência ou relevância jurídica estejam corretos. Não trate os 219 registros como revisão jurídica concluída.

## Próximos passos

1. Retomar as seis frentes sem saída, começando pelas normas federais fundamentais aplicáveis ao RJ.
2. Concluir e verificar os índices parciais de Sudeste/Sul e Norte. Manter a preferência pelo RJ e pela capital ao validar os resultados locais.
3. Abrir as fontes oficiais de cada registro e confirmar número, ementa, território, vigência, alterações e URL. Não inventar status; use `nao_verificada` quando a fonte não permitir confirmar.
4. Resolver as duplicatas, atualizar `legislacao/README.md`, rodar os dois comandos de validação e registrar a data real de conferência.
5. Atualizar este documento e o PR após cada etapa de pesquisa relevante, preservando o branch remoto mesmo que outra execução seja interrompida.

Não chame a cobertura de exaustiva. Leis municipais de outras cidades e possíveis atos regulatórios ainda não catalogados ficam fora desta rodada. Não mescle para `main` sem autorização explícita da pessoa usuária.

## Branch, PR e acesso

O trabalho está no branch `research/legislacao-consumidor-2026-10-31`, derivado do commit inicial `4bc9c26` em `main`. O PR em rascunho é [#1](https://github.com/jottacostta/especialista-direito-do-consumidor/pull/1); `main` não foi alterada nem houve merge. Antes de continuar, confira `git status`, `git fetch --all --prune` e o estado do PR.

O repositório é privado. Para que uma sessão do ChatGPT consiga acessá-lo, a pessoa usuária precisa autorizar esse repositório no GitHub ou fornecer os arquivos por um canal permitido. Este documento não concede acesso nem aciona automaticamente outra conta. O saldo de créditos não é monitorado por este repositório.
