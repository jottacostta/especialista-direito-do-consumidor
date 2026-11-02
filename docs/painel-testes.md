# Painel estático de relatório de testes

O site contém um painel de relatório em `/testes/`. Ele exibe métricas, cada caso, camada, duração, detalhes de falha, saída textual e permite baixar o JSON. A página busca `data/test-report.json` no mesmo artefato Pages.

## Como o relatório é gerado

Os testes JavaScript rodam por `npm test`. O runner `scripts/run-tests.mjs` produz `test-results/latest.json`. `scripts/build-pages.mjs` incorpora esse arquivo em `dist/data/test-report.json`; o workflow do GitHub publica `dist/` somente depois de testes e validação do catálogo aprovados. O painel não executa testes no navegador. O link **Ver execução no GitHub Actions** abre a lista oficial de runs.

Como o repositório e o site são públicos, o relatório também é público. Ele deve conter somente nomes de testes, resultados e dados sintéticos; nunca inclua identificadores de clientes/trabalhadores, credenciais ou logs operacionais. Se o CI falhar, o workflow não implanta uma nova versão. O relatório da página pode então refletir a última versão aprovada, não a execução que falhou; abra o link do Actions para ver essa execução.

## Executar e pré-visualizar localmente

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
node scripts/serve-pages.mjs
```

A prévia fica em `http://127.0.0.1:4173/testes/`. O servidor Node local serve somente os arquivos estáticos gerados em `dist/`; não há API Python, endpoint de reexecução, cookies, armazenamento local ou coleta de dados.

O relatório mantém tracebacks completos em caso de falha. Como só um build aprovado pode ser publicado, tracebacks de falhas em execuções que não passam ficam na página do GitHub Actions daquela execução, não no Pages.
