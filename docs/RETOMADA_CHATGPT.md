# Retomada do projeto — para ChatGPT

Atualizado em 2026-10-31. Este documento resume o estado de trabalho para que outra sessão possa continuar sem depender do histórico desta conversa.

## Objetivo e prioridade

O repositório privado `jottacostta/especialista-direito-do-consumidor` está construindo um assistente de informação geral sobre direito do consumidor brasileiro. A solicitação mais recente prioriza primeiro a legislação do **Estado do Rio de Janeiro** e do **Município do Rio de Janeiro**, além das normas federais aplicáveis. O objetivo da coleta é criar um índice rastreável de atos normativos e links oficiais, não armazenar cópias integrais das leis.

## Estado atual da pesquisa

A pesquisa foi planejada em 16 frentes. A execução parou por insuficiência de créditos antes da conclusão: o workflow reportou 8 agentes concluídos e 8 falhas. No diretório existem 10 arquivos JSONL com 219 registros; por isso, não presuma que a quantidade de arquivos corresponda exatamente aos agentes concluídos. Uma verificação automática inicial encontrou JSON válido, os campos essenciais, status e URLs no formato esperado, além de seis duplicatas exatas. Isso **não** comprova vigência nem correção jurídica substantiva.

Arquivos presentes: `00-estado-rj.jsonl`, `01-municipio-rio-de-janeiro.jsonl`, `03-federal-consumidor-geral.jsonl`, `04-digital-dados-atendimento.jsonl`, `07-saude-planos-medicamentos.jsonl`, `10-seguranca-produtos-alimentos.jsonl`, `11-habitacao-educacao-veiculos.jsonl`, `12-estados-sudeste-sul.jsonl`, `14-estados-norte.jsonl` e `15-estados-centro-oeste-df.jsonl`.

Frentes sem arquivo de saída: `02-federal-fundamentais.jsonl`, `05-financeiro-credito-seguros.jsonl`, `06-telecom-postal.jsonl`, `08-energia-saneamento.jsonl`, `09-transporte-turismo.jsonl` e `13-estados-nordeste.jsonl`. As normas municipais fora da capital também não fizeram parte desta rodada.

As seis duplicatas detectadas estão entre estes pares de arquivo: Lei RJ 6.613/2013 (`00`/`04`); Lei RJ 8.265/2018 (`00`/`11`); Lei RJ 8.527/2019 (`00`/`04`); Leis municipais do Rio 6.309/2017 e 6.523/2019 (`01`/`04`); Lei municipal do Rio 7.384/2022 (`01`/`04`). Compare registros e fontes antes de remover ou combinar qualquer um.

## Retomada técnica

O trabalho está no branch `research/legislacao-consumidor-2026-10-31`, derivado do commit inicial `4bc9c26` em `main`. Primeiro confira `git status`, `git fetch --all --prune` e o estado do PR. Preserve os arquivos parciais. Execute `python3 scripts/validate_legislation.py`; resolva as seis duplicatas; depois rode `python3 scripts/validate_legislation.py --strict-duplicates`.

Complete as seis frentes ausentes, começando pelas normas federais fundamentais aplicáveis ao RJ. Em seguida, abra as fontes oficiais de cada registro e confirme número, ementa, território, vigência, alterações e URL. Corrija inconsistências somente com apoio da fonte oficial e deixe explícitas as lacunas. Atualize o inventário em `legislacao/README.md` e registre a data de verificação. Não chame o catálogo de exaustivo: leis municipais de outras cidades e possíveis atos setoriais não catalogados continuarão fora desta primeira rodada.

Depois da revisão, consolide os registros sem perder origem ou histórico, valide novamente, faça commits rastreáveis em branch e publique/atualize um PR. Não mescle para `main` sem autorização explícita da pessoa usuária. Não inclua tokens, dados pessoais ou credenciais.

## Acesso do ChatGPT

O repositório é privado. Para que uma sessão do ChatGPT consiga acessá-lo, a pessoa usuária precisa conectar/autorizar esse repositório no GitHub ou fornecer os arquivos por um canal permitido. Esta documentação não concede acesso nem aciona automaticamente outra conta. O saldo de créditos também não é monitorado por este repositório.
