# Retomada do projeto — para ChatGPT

Atualizado em 2026-10-31. Este documento resume o estado de trabalho para que outra sessão possa continuar sem depender do histórico desta conversa.

## Objetivo e prioridade

O repositório privado `jottacostta/especialista-direito-do-consumidor` está construindo um assistente de informação geral sobre direito do consumidor brasileiro. A prioridade foi o Estado do Rio de Janeiro e o Município do Rio de Janeiro, junto com as normas federais aplicáveis. A coleta cria um índice rastreável de atos normativos e links oficiais; não armazena cópias integrais das leis.

## Estado atual da coleta

A primeira rodada planejou 16 frentes. O workflow inicial concluiu 8 e falhou em 8 por insuficiência de créditos. Uma nova rodada focada nas oito pendências foi concluída e seus arquivos foram integrados ao branch. Existem agora 16 arquivos JSONL com 247 registros no total. Os oito arquivos novos acrescentaram 69 registros; os índices regionais do Sudeste/Sul e do Norte foram substituídos por versões revistas que preservam apenas itens incluídos pelos pesquisadores após sua checagem em fontes oficiais.

A contagem é por linha, não por norma única. O workflow reportou 14 chaves normativas repetidas entre arquivos. Parte são normas federais transversais intencionalmente listadas em mais de uma área; as demais são leis do RJ repetidas entre o arquivo territorial e os arquivos temáticos. Antes de ingerir como uma base única, decida se vai manter índices por domínio com sobreposição ou produzir um catálogo canônico deduplicado que reúna tags, fontes e notas sem perder evidências.

A validação local (`python3 scripts/validate_legislation.py`) passou estruturalmente e listou 14 duplicatas. Ela verifica JSONL, campos, datas e esquema básico de URLs, mas não abre os links nem confirma a vigência ou a correção jurídica. Os agentes relataram que consultaram fontes oficiais, mas o agente pai ainda não fez revisão substantiva independente. Vários registros estão marcados `nao_verificada` e as coletas estaduais são explicitamente parciais.

## Áreas cobertas e ressalvas

Os 16 índices cobrem: normas próprias do Estado e da capital do Rio de Janeiro; normas federais fundamentais e gerais; comércio digital e dados; finanças, telecomunicações e postal; saúde; energia e saneamento; transporte e turismo; segurança de produtos e alimentos; habitação, educação e veículos; e recortes estaduais das regiões Sudeste/Sul, Nordeste, Norte e Centro-Oeste/DF.

A abrangência não é exaustiva. Os estados do Sudeste/Sul, Nordeste e Norte tiveram levantamentos seletivos, com lacunas explícitas nos próprios arquivos. A legislação municipal fora da capital não foi coberta. Também não se pretende incluir todos os atos infralegais setoriais, normas posteriores ou materiais sem força normativa.

## Próximos passos

1. Conferir a contagem e executar `python3 scripts/validate_legislation.py`; inspecionar as 14 duplicatas. Depois da decisão de deduplicação, executar `python3 scripts/validate_legislation.py --strict-duplicates` ou adaptar o validador para o modelo de índices por domínio escolhido.
2. Revisar amostras e depois cada registro nas fontes oficiais: número, ementa, território, vigência, alterações e URL. Use `nao_verificada` quando a fonte não permitir confirmar o estado atual. Não trate a verificação automatizada como validação jurídica.
3. Expandir a coleta estadual seletiva e pesquisar legislação municipal de outros municípios somente se o escopo for ampliado.
4. Atualizar este documento e o inventário após cada etapa de revisão. Manter commits e pushes incrementais para preservar o checkpoint se uma execução for interrompida.
5. Atualizar o PR em rascunho com os resultados e testes; não mesclar para `main` sem autorização explícita da pessoa usuária.

## Branch, PR e acesso

O trabalho está no branch `research/legislacao-consumidor-2026-10-31`, baseado no commit inicial `4bc9c26` em `main`. O PR em rascunho é [#1](https://github.com/jottacostta/especialista-direito-do-consumidor/pull/1); `main` não foi alterada nem houve merge. Antes de continuar, confira `git status`, `git fetch --all --prune` e o estado do PR.

O repositório é privado. Para que uma sessão do ChatGPT consiga acessá-lo, a pessoa usuária precisa autorizar esse repositório no GitHub ou fornecer os arquivos por um canal permitido. Este documento não concede acesso nem inicia outra conta. O saldo de créditos não é monitorado pelo repositório.
