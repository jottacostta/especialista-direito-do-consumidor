# Catálogo de legislação

Esta pasta reúne **índices de normas e links oficiais**, não cópias integrais dos textos legais. O objetivo é permitir consulta e atualização rastreáveis sem transformar o repositório em uma coleção de versões possivelmente desatualizadas.

## Prioridade e escopo

A coleta começou pelo **Estado do Rio de Janeiro** e pelo **Município do Rio de Janeiro**, junto com normas federais aplicáveis, e depois foi ampliada às principais áreas setoriais e às demais unidades da Federação. O catálogo é um levantamento inicial, não exaustivo. Leis municipais de outras cidades, atos infralegais não encontrados e normas setoriais posteriores ainda podem estar ausentes.

Inclua apenas atos normativos publicados por fonte oficial competente. Para cada registro, prefira o texto consolidado vigente. Se só for possível localizar a publicação original, registre isso em `notes` e não presuma vigência atual. Uma norma revogada ou parcialmente revogada pode ser incluída quando isso for confirmado em fonte oficial, registrando a situação e a evidência.

## Formato dos arquivos

Cada arquivo `indices/*.jsonl` contém um objeto JSON por linha, sem comentários ou cabeçalho. Use estes campos em todos os registros:

```json
{"jurisdiction":"federal|state|district|municipal","territory":"BR, sigla da UF ou código UF/município","kind":"tipo do ato","identifier":"identificação oficial","title":"ementa ou título curto","enacted_date":"AAAA-MM-DD ou vazio se não confirmado","status":"vigente|parcialmente_vigente|revogada|nao_verificada","consumer_relevance":"relação objetiva com direitos do consumidor","official_source_url":"URL de fonte oficial","official_source_org":"órgão ou diário oficial","status_basis_url":"URL oficial que sustenta o status, se diferente","verification_date":"AAAA-MM-DD","tags":["tema"],"notes":"limites, alterações ou lacunas relevantes"}
```

Use `BR` para normas federais, a sigla da UF para normas estaduais e `RJ/Rio de Janeiro` para normas municipais da capital. Não invente datas, ementas ou status. Quando o portal oficial não permitir confirmar a situação, use `nao_verificada` e explique o que falta em `notes`. Preserve URLs completas e estáveis, sem links de mecanismos de busca.

## Inventário em 2026-10-31

Os números abaixo são registros por arquivo; uma mesma norma pode aparecer em mais de uma área temática. Há 247 registros em 16 arquivos. A validação estrutural sinalizou 14 chaves normativas repetidas; revise a lista antes de ingerir os arquivos em uma base de busca. Essa contagem não significa 247 normas únicas nem confirmação independente de vigência.

| Arquivo | Cobertura | Registros |
|---|---|---:|
| `00-estado-rj.jsonl` | Estado do Rio de Janeiro | 25 |
| `01-municipio-rio-de-janeiro.jsonl` | Município do Rio de Janeiro | 14 |
| `02-federal-fundamentais.jsonl` | Normas federais fundamentais e tutela/processo coletivo | 11 |
| `03-federal-consumidor-geral.jsonl` | Leis e decretos federais gerais de consumo | 20 |
| `04-digital-dados-atendimento.jsonl` | Comércio digital, dados, plataformas e atendimento | 18 |
| `05-financeiro-credito-seguros.jsonl` | Crédito, bancos, pagamentos, cobrança e seguros | 6 |
| `06-telecom-postal.jsonl` | Telecomunicações e serviços postais | 6 |
| `07-saude-planos-medicamentos.jsonl` | Saúde, planos, medicamentos e dispositivos | 25 |
| `08-energia-saneamento.jsonl` | Energia, combustíveis, água e saneamento | 13 |
| `09-transporte-turismo.jsonl` | Transporte de passageiros e turismo | 10 |
| `10-seguranca-produtos-alimentos.jsonl` | Segurança de produtos, alimentos, metrologia e recalls | 26 |
| `11-habitacao-educacao-veiculos.jsonl` | Habitação, educação, veículos e serviços | 22 |
| `12-estados-sudeste-sul.jsonl` | SP, MG, ES, PR, SC e RS | 7 |
| `13-estados-nordeste.jsonl` | Estados do Nordeste | 8 |
| `14-estados-norte.jsonl` | Estados do Norte | 8 |
| `15-estados-centro-oeste-df.jsonl` | GO, MT, MS e Distrito Federal | 28 |

As coletas regionais são seletivas: por exemplo, os índices de Nordeste, Norte e Sudeste/Sul não cobrem todo ato estadual ou municipal. Consulte `docs/RETOMADA_CHATGPT.md` para o estado detalhado, as duplicatas detectadas e as tarefas de revisão.
