# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-02. A base `main` parte de `c886f96`. A migração está na branch remota `feature/github-pages-static`. PR #4 está aberto: https://github.com/jottacostta/especialista-direito-do-consumidor/pull/4. Sempre confirme o head SHA atual antes de agir.

## Objetivo e decisão atual

O projeto visa apoiar gerentes e supervisores de supermercados na prevenção de perdas, conferência de discrepâncias e atendimento justo, sem presumir má-fé, avaliar caráter ou decidir culpa de consumidores.

A pessoa responsável autorizou tornar público o repositório CDC inteiro e pediu uma aplicação no modelo estático do EscalaDominical. Também decidiu deixar de desenvolver em Python e concentrar o protótipo em HTML, CSS e JavaScript. O PR remove os arquivos Python de aplicação, testes e validação da árvore atual, bem como `vercel.json`; a história Git anterior ainda contém o protótipo Python. Não reescreva o histórico para removê-lo sem autorização específica.

## Implementação no PR #4

- A interface HTML/CSS/JavaScript fica em `public/`, usa caminhos relativos e carrega `data/cdc-guide.json` da mesma origem.
- `scripts/catalog-data.mjs` valida a presença exata de um registro federal da Lei nº 8.078/1990, status `vigente`, data e fontes HTTPS e regras editoriais antes de criar o bundle.
- `scripts/validate_legislation.mjs` substitui o validador Python mantendo o schema e a opção `--strict-duplicates`.
- `scripts/run-tests.mjs` executa casos JavaScript e gera `test-results/latest.json`; `scripts/build-pages.mjs` compõe `dist/` com o site e o painel `/testes/`.
- `tools/test-dashboard/` é um visualizador público e estático. Não roda testes sob demanda; aponta ao GitHub Actions. O CI não publica novo Pages quando testes ou catálogo falham.
- `.github/workflows/validate-catalog.yml` testa pull requests e prepara deploy automático pelo GitHub Pages após aprovação em `main` ou despacho manual nessa branch.
- O servidor Node em `scripts/serve-pages.mjs` é apenas uma prévia estática local em `127.0.0.1`; não é backend de produção.

URL-alvo após habilitar Pages: `https://jottacostta.github.io/especialista-direito-do-consumidor/`. Painel: `/testes/`. Nenhum deploy foi confirmado. O repositório ainda está privado na última inspeção, e a API de Pages retornou 403 ao conector; não afirme que o site está ativo. A pessoa responsável autorizou tornar o repositório público após a revisão. Pode ser necessário habilitar em Settings → Pages → Build and deployment → Source: GitHub Actions; se a API do conector continuar sem permissão, pedir que o responsável faça esse ajuste.

## Validações locais e estado do CI

- `npm test` — 13/13 casos aprovados, incluindo busca, validação do bundle, schema JSONL, duplicatas, build Pages e prévia HTTP.
- `npm run validate:catalog -- --strict-duplicates` — 16 arquivos JSONL e 229 registros, sem duplicatas; isso é validação estrutural, não auditoria jurídica automática.
- `npm run build:pages` — gerou `dist/` com seis guias e relatório de 13/13 testes.
- Smoke HTTP — homepage, assets CSS/JS, bundle CDC, painel, relatório JSON e rotas estáticas responderam; POST recusado com 405; a suíte testa traversal e symlink externo.
- `node --check` e `git diff --check` locais — aprovados.
- CI inicial do PR #4 no SHA `20564e7` falhou exclusivamente em `Check diff formatting`: `actions/checkout` usou histórico raso e a base não estava disponível para `git diff BASE...HEAD`. Build, testes e upload passaram; deploy foi corretamente ignorado no PR. O workflow foi corrigido com `fetch-depth: 0`. O run `41513072342` passou no SHA `e5fc938`; este handoff adiciona outro commit documental, então confira um check verde no head atual antes de qualquer merge.
- Uma busca limitada por padrões conhecidos de chaves, CPF, e-mail e nomes de arquivos sensíveis não encontrou ocorrências no snapshot da mudança. `gitleaks` não estava instalado; essa busca não garante ausência de todo dado sensível. Repetir revisão dos arquivos do PR antes de tornar o repo público.

## CDC e salvaguardas

O bundle usa um registro federal do CDC e seis guias editoriais: preço/oferta; peso/quantidade; validade/segurança; troca/desistência; atendimento/práticas comerciais; cobrança/pagamentos. Os resumos ainda precisam de revisão profissional jurídica e operacional; não cobrem todos os artigos, exceções, normas estaduais/municipais ou mudanças legais. A auditoria anterior cobriu 39 atos selecionados do RJ, não todo o universo legal.

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa automatizada. Não recomendar busca, retenção, detenção, força, exposição pública ou discriminação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo. Qualquer uso real exige revisão jurídica, de privacidade e segurança.

O site e o relatório de testes serão públicos. Não incluir dados reais de clientes/trabalhadores, credenciais, registros de incidentes ou logs operacionais. A aplicação não tem backend, autenticação, formulário, armazenamento local, cookies ou analytics.

## Próximas etapas

1. Verificar o commit documental e o resultado do CI disparado para o head atual do PR #4.
2. Atualizar o corpo do PR para registrar o SHA e os checks verdes atuais.
3. Não mesclar sem pedido explícito de merge e checks obrigatórios aprovados.
4. Após o merge, mudar a visibilidade do repositório para público (autorizado), habilitar Pages com fonte GitHub Actions, acompanhar o deploy e confirmar a URL antes de chamá-la ativa.
5. Atualizar README e esta passagem de bastão depois de confirmar a publicação real.

Comandos principais:

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
npm run preview
```
