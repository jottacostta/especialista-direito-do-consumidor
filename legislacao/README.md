# Catálogo de legislação

Esta pasta reúne **índices de normas e links oficiais**, não cópias integrais dos textos legais. O objetivo é permitir consulta e atualização rastreáveis sem transformar o repositório em uma coleção de versões possivelmente desatualizadas.

## Prioridade e escopo

A primeira etapa prioriza o **Estado do Rio de Janeiro** e o **Município do Rio de Janeiro**, incluindo suas normas próprias de proteção e defesa do consumidor e atos oficiais de órgãos locais. Também mapeia normas federais aplicáveis a esses territórios. Em seguida, a coleta se expande às demais unidades da Federação e aos principais setores regulados em âmbito nacional.

O escopo desta rodada inclui normas federais de alcance geral e setorial, atos normativos de reguladores federais relevantes a relações de consumo e legislação estadual, distrital e municipal do Rio de Janeiro. Leis municipais de outras cidades, jurisprudência, decisões administrativas individuais, manuais e guias sem força normativa ficam fora do índice principal; poderão ser mapeados em etapas separadas.

Inclua apenas atos normativos publicados por fonte oficial competente. Para cada registro, prefira o texto consolidado vigente. Se só for possível localizar uma publicação original, registre isso em `notes` e não presuma vigência atual. Uma norma revogada ou parcialmente revogada pode ser incluída quando isso for confirmado em fonte oficial, registrando a situação e a evidência.

## Formato dos arquivos

Cada arquivo `indices/*.jsonl` contém um objeto JSON por linha, sem comentários ou cabeçalho. Use estes campos em todos os registros:

```json
{"jurisdiction":"federal|state|district|municipal","territory":"BR, sigla da UF ou código UF/município","kind":"tipo do ato","identifier":"identificação oficial","title":"ementa ou título curto","enacted_date":"AAAA-MM-DD ou vazio se não confirmado","status":"vigente|parcialmente_vigente|revogada|nao_verificada","consumer_relevance":"relação objetiva com direitos do consumidor","official_source_url":"URL de fonte oficial","official_source_org":"órgão ou diário oficial","status_basis_url":"URL oficial que sustenta o status, se diferente","verification_date":"AAAA-MM-DD","tags":["tema"],"notes":"limites, alterações ou lacunas relevantes"}
```

Use `BR` para normas federais, a sigla da UF para normas estaduais e `RJ/Rio de Janeiro` para normas municipais da capital. Não invente datas, ementas ou status. Quando o portal oficial não permitir confirmar a situação, use `nao_verificada` e explique o que falta em `notes`. Remova duplicatas dentro de cada arquivo e registre alterações relevantes sem tentar reconstruir histórico que a fonte não comprove. Preserve URLs completas e estáveis, sem links de mecanismos de busca.

## Inventário

Os arquivos por área, unidade federativa e município serão listados aqui após a coleta e consolidação. A data de verificação deve ser registrada por norma. A cobertura desta rodada não deve ser anunciada como exaustiva, sobretudo em nível municipal e em atos regulatórios alterados com frequência.
