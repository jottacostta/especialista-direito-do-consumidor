# Catálogo de legislação

Esta pasta reúne **índices de normas e links oficiais**, não cópias integrais dos textos legais. O objetivo é permitir consulta e atualização rastreáveis sem transformar o repositório em uma coleção de versões possivelmente desatualizadas.

## Prioridade e escopo

A coleta começou pelo **Estado do Rio de Janeiro** e pelo **Município do Rio de Janeiro**, junto com normas federais aplicáveis, e depois foi ampliada às principais áreas setoriais e às demais unidades da Federação. O catálogo é um levantamento inicial, não exaustivo. Leis municipais de outras cidades, atos infralegais não encontrados e normas setoriais posteriores ainda podem estar ausentes.

Inclua apenas atos normativos publicados por fonte oficial competente. Para cada registro, prefira o texto consolidado vigente. Se só for possível localizar a publicação original, registre isso em `notes` e não presuma vigência atual. Uma norma revogada ou parcialmente revogada pode ser incluída quando isso for confirmado em fonte oficial, registrando a situação e a evidência.

## Formato dos arquivos

Cada arquivo `indices/*.jsonl` contém um objeto JSON por linha, sem comentários ou cabeçalho. Use estes campos em todos os registros:

```json
{"jurisdiction":"federal|state|district|municipal","territory":"BR, sigla da UF ou código UF/município","kind":"tipo do ato","identifier":"identificação oficial","title":"ementa ou título curto","enacted_date":"AAAA-MM-DD ou vazio se não confirmado","status":"vigente|parcialmente_vigente|revogada|declarada_inconstitucional|nao_verificada","consumer_relevance":"relação objetiva com direitos do consumidor","official_source_url":"URL de fonte oficial","official_source_org":"órgão ou diário oficial","status_basis_url":"URL oficial que sustenta o status, se diferente","verification_date":"AAAA-MM-DD","tags":["tema"],"notes":"limites, alterações ou lacunas relevantes"}
```

`related_source_urls` é um campo opcional em forma de lista de URLs HTTP/HTTPS para fontes oficiais complementares reunidas durante uma consolidação. Mantenha a fonte principal em `official_source_url` e a fonte que fundamenta o status em `status_basis_url`. `declarada_inconstitucional` representa invalidação judicial e não é sinônimo de revogação formal; `parcialmente_vigente` é adequado quando a decisão judicial invalida apenas dispositivos determinados.

Use `BR` para normas federais, a sigla da UF para normas estaduais e `RJ/Rio de Janeiro` para normas municipais da capital. Não invente datas, ementas ou status. Quando o portal oficial não permitir confirmar a situação, use `nao_verificada` e explique o que falta em `notes`. Preserve URLs completas e estáveis, sem links de mecanismos de busca.

## Inventário em 2026-11-01

Há **229 registros em 16 arquivos**, com uma ocorrência por chave normativa (`jurisdiction`, `territory`, `identifier`). A auditoria e a consolidação removeram 18 cópias em 14 grupos de duplicatas; tags, fontes oficiais adicionais e contexto relevante foram preservados nos registros canônicos. Essa contagem não significa que todas as leis do catálogo tenham sido verificadas juridicamente.

| Arquivo | Cobertura | Registros |
|---|---|---:|
| `00-estado-rj.jsonl` | Estado do Rio de Janeiro | 25 |
| `01-municipio-rio-de-janeiro.jsonl` | Município do Rio de Janeiro | 14 |
| `02-federal-fundamentais.jsonl` | Normas federais fundamentais e tutela/processo coletivo | 11 |
| `03-federal-consumidor-geral.jsonl` | Leis e decretos federais gerais de consumo | 13 |
| `04-digital-dados-atendimento.jsonl` | Comércio digital, dados, plataformas e atendimento | 13 |
| `05-financeiro-credito-seguros.jsonl` | Crédito, bancos, pagamentos, cobrança e seguros | 4 |
| `06-telecom-postal.jsonl` | Telecomunicações e serviços postais | 4 |
| `07-saude-planos-medicamentos.jsonl` | Saúde, planos, medicamentos e dispositivos | 25 |
| `08-energia-saneamento.jsonl` | Energia, combustíveis, água e saneamento | 13 |
| `09-transporte-turismo.jsonl` | Transporte de passageiros e turismo | 9 |
| `10-seguranca-produtos-alimentos.jsonl` | Segurança de produtos, alimentos, metrologia e recalls | 26 |
| `11-habitacao-educacao-veiculos.jsonl` | Habitação, educação, veículos e serviços | 21 |
| `12-estados-sudeste-sul.jsonl` | SP, MG, ES, PR, SC e RS | 7 |
| `13-estados-nordeste.jsonl` | Estados do Nordeste | 8 |
| `14-estados-norte.jsonl` | Estados do Norte | 8 |
| `15-estados-centro-oeste-df.jsonl` | GO, MT, MS e Distrito Federal | 28 |

A auditoria com data de corte em 2026-11-01 cobriu 39 leis do RJ: 25 com status recomendado `vigente`, 6 `declarada_inconstitucional`, 2 `parcialmente_vigente` e 6 `nao_verificada`. Os resultados da revisão — 15 confirmados, 22 corrigidos e 2 não verificados — e as fontes por ato estão no [relatório da auditoria](../docs/auditoria-rj-2026-11-01.md). `nao_verificada` significa insuficiência de confirmação oficial do estado atual, não revogação.

As coletas regionais são seletivas: por exemplo, os índices de Nordeste, Norte e Sudeste/Sul não cobrem todo ato estadual ou municipal. Consulte `docs/RETOMADA_CHATGPT.md` para o estado detalhado, as ressalvas e as tarefas de revisão.
