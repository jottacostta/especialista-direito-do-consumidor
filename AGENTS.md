# Instruções para agentes de código e pesquisa

Leia `docs/RETOMADA_CHATGPT.md`, `docs/requisitos-produto.md` e `docs/escopo-e-seguranca.md` antes de continuar. Leia `docs/integracao-cdc.md` para alterar a consulta e `legislacao/README.md` antes de alterar qualquer índice legal.

## Produto e estágio

O repositório está migrando para uma aplicação estática de consulta informativa ao CDC, com HTML/CSS/JavaScript em `public/`. `scripts/build-pages.mjs` valida o registro do CDC e monta em `dist/` os arquivos publicados pelo GitHub Pages. `tools/test-dashboard/` é um painel estático para o relatório gerado pelo CI. O Node.js é ferramenta de validação, build e prévia local; não há backend de aplicação, armazenamento de incidentes ou endpoint de escrita. Não reintroduza Python, Vercel, API, autenticação improvisada ou dependência de serviço externo sem nova decisão do responsável. Não descreva o site como publicado até confirmar o deploy em Pages.

O repositório e o site devem ser públicos. Nunca adicionar dados reais de clientes ou trabalhadores, credenciais, segredos, históricos operacionais ou arquivos de RH. O relatório publicado também é público; mantenha-o limitado a casos de teste sintéticos e metadados técnicos necessários.

## Limites de segurança e justiça

Trate todo caso como incidente ou suspeita a verificar, nunca como prova de intenção criminosa. Baseie a assistência em fatos observáveis e registros verificáveis, e considere primeiro erro de caixa, cadastro, preço, leitura, processo, treinamento ou sistema. Não classifique uma pessoa como “mal-intencionada”, “ladra” ou “fraudadora”; não gere score individual, lista negra, vigilância entre lojas, reconhecimento facial/biométrico ou decisão automatizada adversa.

Não recomende discriminação, humilhação, ameaça, busca pessoal ou de pertences, retenção, detenção, força física, recusa retaliatória de venda/atendimento ou acusação pública. A decisão operacional cabe a pessoa responsável treinada, após revisão humana e oportunidade de esclarecimento respeitosa. Escale somente por procedimentos legais e de segurança definidos pela empresa.

Minimize dados. A consulta pública não deve coletar ou armazenar relatos de incidentes, nomes, documentos, imagens, biometria, características físicas, dados sensíveis, dados de pagamento ou dados de crianças. Use dados sintéticos nos testes. Qualquer coleta futura exige finalidade, necessidade, acesso limitado, retenção e exclusão definidos, controles de segurança e revisão profissional de privacidade e jurídica.

## Informação jurídica

A consulta é informativa, não é advogado nem parecer profissional. Não invente leis, artigos, datas, vigência, decisões ou links. Para afirmações jurídicas, use fonte oficial, informe a data de verificação e separe texto legal, resumo editorial, fato e hipótese. O build deve vincular os resumos ao registro federal exato do CDC e falhar se a fonte, o status ou a data não puderem ser confirmados. Os resumos requerem revisão profissional. A auditoria catalográfica é seletiva e não exaustiva.

## Dados legislativos

Siga o esquema de `legislacao/README.md`. Inclua atos normativos, não projetos de lei ou decisões individuais. Use links de fontes oficiais e registre a URL que sustenta o status quando ela for diferente da fonte do texto. Em consolidações, preserve fontes complementares em `related_source_urls`. Os status aceitos são `vigente`, `parcialmente_vigente`, `revogada`, `declarada_inconstitucional` e `nao_verificada`; invalidação judicial não é sinônimo de revogação formal.

## Fluxo Git, aplicação e validação

Trabalhe em branch de tarefa baseado no `main` atualizado. Não faça push direto em `main` nem mescle PR sem autorização explícita. Preserve alterações existentes. Use Node.js 22 ou superior e dependências padrão, sem CDNs. Antes do PR execute:

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
node --check public/app.js
node --check public/guide-core.js
node --check tools/test-dashboard/app.js
node --check scripts/serve-pages.mjs
git diff --check
```

O site deve funcionar sob o subcaminho do projeto (`/<nome-do-repositório>/`), não usar caminhos absolutos na raiz do domínio, renderizar texto não confiável com `textContent` e validar URLs HTTPS antes de criar links. O CI só deve publicar artefato produzido com testes e catálogo aprovados. Não declare conformidade legal, cobertura exaustiva ou segurança de produção sem revisão e evidência documentadas.
