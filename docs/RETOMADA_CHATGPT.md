# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-02. PR #4 foi mesclado por squash em `main` no commit `450bab5`. O repositório está público e o GitHub Pages está ativo. Confirme o SHA e o estado do CI novamente antes de qualquer mudança futura.

## Estado publicado

- Repositório: [jottacostta/especialista-direito-do-consumidor](https://github.com/jottacostta/especialista-direito-do-consumidor)
- Site: [https://jottacostta.github.io/especialista-direito-do-consumidor/](https://jottacostta.github.io/especialista-direito-do-consumidor/)
- Painel de testes: [https://jottacostta.github.io/especialista-direito-do-consumidor/testes/](https://jottacostta.github.io/especialista-direito-do-consumidor/testes/)
- Fonte Pages em Settings → Pages: **GitHub Actions**.
- Deploy confirmado: run [41516154912](https://github.com/jottacostta/especialista-direito-do-consumidor/actions/runs/41516154912), evento `workflow_dispatch`, `main` no SHA `450bab5de481c13e5b47b023bca8d55da92ac948`, conclusão `success`.
- Verificação HTTPS após o deploy: `/`, `/testes/`, `/data/cdc-guide.json` e `/data/test-report.json` responderam HTTP 200. O bundle publicado contém seis guias e o relatório mostra 13/13 testes aprovados.

O primeiro run de `push` à `main` falhou apenas na etapa Configure GitHub Pages porque Pages ainda não estava habilitado. Em seguida, foi selecionada a fonte **GitHub Actions** na tela Settings → Pages e o workflow foi executado manualmente; o run 41516154912 completou build e deploy. A configuração automática agora está ativa: push em `main` ou despacho manual valida, testa, constrói e tenta publicar o artefato. Pull requests validam sem publicar.

## Objetivo e decisão de produto

O projeto apoia gerentes e supervisores de supermercados na prevenção de perdas, conferência de discrepâncias e atendimento justo, sem presumir má-fé, avaliar caráter ou decidir culpa de consumidores.

A aplicação atual é uma consulta somente de leitura a seis resumos editoriais do Código de Defesa do Consumidor. A interface é HTML, CSS e JavaScript. Node.js é usado apenas para validação, build, testes e prévia local. Não há backend, formulário, autenticação, armazenamento, API ou coleta de incidentes.

A pessoa responsável autorizou tornar público o repositório CDC inteiro e a publicação estática semelhante ao EscalaDominical. Os arquivos Python e a configuração Vercel foram removidos da árvore atual, mas o histórico Git anterior ainda os contém. Não reescreva o histórico sem autorização específica.

## Arquitetura e validação

- `public/` contém o site; `data/cdc-guide.json` é gerado do registro federal do CDC e de seis guias editoriais.
- `scripts/catalog-data.mjs` valida o registro federal exato da Lei nº 8.078/1990, status, data, URLs oficiais e regras antes do build.
- `scripts/validate_legislation.mjs` valida os 16 índices JSONL e pode rejeitar duplicatas com `--strict-duplicates`.
- `scripts/run-tests.mjs` executa os casos JavaScript e gera o relatório que aparece no painel em `/testes/`.
- `scripts/build-pages.mjs` gera `dist/`; `scripts/serve-pages.mjs` serve apenas a prévia local em `127.0.0.1`.
- `.github/workflows/validate-catalog.yml` roda validação, testes e build; publica somente em `main` ou em `workflow_dispatch` na `main`, depois do sucesso.

Comandos principais:

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
npm run preview
```

## Limites legais, segurança e privacidade

O bundle contém seis resumos sobre preço/oferta; peso, medida e quantidade; validade/segurança; troca/desistência; atendimento/práticas comerciais; cobrança/pagamentos. Não são transcrições integrais nem pareceres. A data vem do catálogo e não se atualiza automaticamente. Os resumos precisam de revisão profissional jurídica e operacional. A auditoria anterior cobriu 39 atos selecionados do Estado e do Município do Rio de Janeiro, não toda a legislação aplicável.

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa automatizada. Não recomendar discriminação, busca, retenção, detenção, força, exposição pública ou retaliação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo; manter revisão humana e oportunidade de esclarecimento.

O repositório, a página e o relatório são públicos. Não incluir dados reais de clientes/trabalhadores, credenciais, registros de incidentes ou logs operacionais. A busca por padrões conhecidos de segredos/PII feita antes da publicação não substitui uma ferramenta completa; `gitleaks` não estava instalado. Se alguém identificar credenciais ou dados indevidos no histórico público, revogar/remediar com prioridade e seguir a política do GitHub.

## Próximas etapas

1. Obter revisão profissional dos seis guias do CDC e dos limites de uso antes de qualquer piloto.
2. Manter o relatório de testes limitado a dados sintéticos e verificar o CI do head atual em cada mudança.
3. Ampliar a legislação somente com fontes oficiais e mantendo cobertura, vigência e auditoria explicitamente delimitadas.
4. Qualquer mudança futura deve usar branch e PR; não fazer merge sem pedido explícito e checks verdes no head atual.
