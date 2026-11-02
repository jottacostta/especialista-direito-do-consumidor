# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-02. A base remota `main` estava em `c886f96` após o merge do painel local de testes no PR #3. A migração de stack está na branch local `feature/github-pages-static`, criada a partir desse commit. No momento desta atualização, as mudanças ainda não foram commitadas/enviadas e não há PR novo.

## Objetivo e decisão atual

O projeto visa apoiar gerentes e supervisores de supermercados na prevenção de perdas, conferência de discrepâncias e atendimento justo, sem presumir má-fé, avaliar caráter ou decidir culpa de consumidores.

A pessoa responsável autorizou tornar público o repositório CDC inteiro e pediu uma aplicação no modelo estático do EscalaDominical. Também decidiu deixar de desenvolver em Python e concentrar o protótipo em HTML, CSS e JavaScript. O trabalho remove os arquivos Python de aplicação, testes e validação da árvore atual, bem como `vercel.json`; a história Git anterior ainda contém o protótipo Python. Não reescreva o histórico para removê-lo sem autorização específica.

## Implementação preparada nesta branch

- A interface HTML/CSS/JavaScript fica em `public/`, usa caminhos relativos e carrega `data/cdc-guide.json` da mesma origem.
- `scripts/catalog-data.mjs` valida a presença exata de um registro federal da Lei nº 8.078/1990, status `vigente`, data e fontes HTTPS e regras editoriais antes de criar o bundle.
- `scripts/validate_legislation.mjs` substitui o validador Python mantendo o schema e a opção `--strict-duplicates`.
- `scripts/run-tests.mjs` executa casos JavaScript e gera `test-results/latest.json`; `scripts/build-pages.mjs` compõe `dist/` com o site e o painel `/testes/`.
- `tools/test-dashboard/` é um visualizador público e estático. Não roda testes sob demanda; aponta ao GitHub Actions. O CI não publica novo Pages quando testes ou catálogo falham.
- `.github/workflows/validate-catalog.yml` testa pull requests e prepara deploy automático pelo GitHub Pages em push aprovado na `main`.
- O servidor Node em `scripts/serve-pages.mjs` é apenas uma prévia estática local em `127.0.0.1`; não é backend de produção.

URL-alvo depois de habilitar Pages: `https://jottacostta.github.io/especialista-direito-do-consumidor/`. Painel: `/testes/`. Ainda não foi confirmado nenhum deploy. O repositório continuava privado na última inspeção, e a API de Pages retornou 403 para o conector; não afirme que o site está ativo. Após a integração aprovada, a pessoa responsável autorizou tornar o repositório público. Pode ser necessário habilitar em Settings → Pages → Build and deployment → Source: GitHub Actions; se a API do conector continuar sem permissão, pedir que o responsável faça esse ajuste.

## Validações executadas na branch

- `npm test` — 13/13 casos aprovados, cobrindo busca, validação do bundle, schema JSONL, duplicatas, build Pages e prévia HTTP.
- `npm run validate:catalog -- --strict-duplicates` — 16 arquivos JSONL e 229 registros, sem duplicatas; isso é validação estrutural, não auditoria jurídica automática.
- `npm run build:pages` — gerou `dist/` com seis guias e relatório de 13/13 testes.
- Smoke HTTP — homepage, assets CSS/JS, bundle CDC, painel, relatório JSON e rotas estáticas responderam; POST recusado com 405.
- `node --check` e `git diff --check` — aprovados.
- Antes da migração, uma busca por padrões conhecidos de chaves, CPF, email e nomes de arquivos sensíveis não encontrou ocorrências no snapshot nem nos 14 commits alcançáveis da base. `gitleaks` não estava instalado; a busca por padrões não é uma garantia de ausência de todo dado sensível. Repetir revisão de exposição dos novos arquivos antes de tornar o repo público.

## CDC e salvaguardas

O bundle usa um registro federal do CDC e seis guias editoriais: preço/oferta; peso/quantidade; validade/segurança; troca/desistência; atendimento/práticas comerciais; cobrança/pagamentos. Os resumos ainda precisam de revisão profissional jurídica e operacional; não cobrem todos os artigos, exceções, normas estaduais/municipais ou mudanças legais. A auditoria anterior cobriu 39 atos selecionados do RJ, não todo o universo legal.

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa automatizada. Não recomendar busca, retenção, detenção, força, exposição pública ou discriminação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo. Qualquer uso real exige revisão jurídica, de privacidade e segurança.

O site e o relatório de testes serão públicos. Não incluir dados reais de clientes/trabalhadores, credenciais, registros de incidentes ou logs operacionais. A aplicação não tem backend, autenticação, formulário, armazenamento local, cookies ou analytics.

## Próximas etapas

1. Revisar `git diff` completo e conferir que não restam comandos de execução ou dependências do runtime anterior nas instruções ativas; menções históricas ficam restritas a este handoff.
2. Repetir testes, build, smoke HTTP e varredura de segredos/dados pessoais no conjunto final.
3. Stagear somente a migração, commitar com assinatura Manus e publicar um PR contra `main`.
4. Aguardar CI verde no SHA exato. Não mesclar sem autorização explícita de merge, conforme o fluxo do repositório.
5. Depois do merge, mudar a visibilidade do repositório para público (autorizado), habilitar GitHub Pages com fonte GitHub Actions, acompanhar deploy e confirmar a URL antes de chamá-la ativa.
6. Atualizar este arquivo e o README quando o deploy real e o estado público forem confirmados.

Comandos principais:

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
node scripts/serve-pages.mjs
```
