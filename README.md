# Guia do CDC para supermercados

Aplicação informativa para gerentes e supervisores consultarem referências iniciais do Código de Defesa do Consumidor em situações comuns de supermercado. A interface é feita em HTML, CSS e JavaScript e foi preparada para publicação estática no GitHub Pages; Node.js é usado apenas para validação, build e testes. Não há backend Python.

> **Estado:** a migração para GitHub Pages está em revisão. O site somente estará disponível no endereço-alvo após a publicação ser habilitada e o workflow de deploy terminar com sucesso: `https://jottacostta.github.io/especialista-direito-do-consumidor/`.

A consulta é somente de leitura. Não registra incidentes, não recebe relatos, não armazena buscas, não identifica clientes, não conclui má-fé ou culpa e não substitui revisão humana ou orientação jurídica. A página publicada será pública.

## O que contém

A tela apresenta seis guias editoriais sobre preço e oferta; peso, medida e quantidade; validade e segurança; troca e desistência; atendimento e práticas comerciais; cobrança e pagamentos. Durante o build, JavaScript confere o registro federal da Lei nº 8.078/1990 no catálogo e gera um bundle JSON estático. O navegador valida esse bundle e pesquisa os temas localmente. A data exibida é a data registrada no catálogo; não se atualiza automaticamente quando a legislação muda.

O painel de testes fica em `/testes/`. A suíte roda no CI e gera um relatório JSON público, exibido pelo painel após o build aprovado. A página não executa testes sob demanda; ela aponta para a execução do GitHub Actions.

## Desenvolvimento e validação

Requer Node.js 22 ou superior. Não há dependências npm externas.

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
node scripts/serve-pages.mjs
```

A prévia local abre em `http://127.0.0.1:4173`. O servidor Node é somente uma ferramenta de desenvolvimento para servir arquivos estáticos e não faz parte do site publicado. Para automatizar testes, validação, build e prévia numa única sequência, use `npm run preview`.

O workflow valida o catálogo, roda os testes JavaScript, monta o artefato estático e publica Pages após um push aprovado em `main`. Pull requests executam validações sem publicar a página.

## Catálogo e limites jurídicos

`legislacao/` contém 229 registros preliminares em 16 índices JSONL, sem duplicatas na última validação. O site usa somente o registro do CDC e os seis resumos editoriais; o restante do catálogo não é apresentado pela aplicação. O levantamento é seletivo e não exaustivo. Os resumos ainda precisam de revisão profissional jurídica e operacional; a auditoria do Rio de Janeiro cobriu 39 atos selecionados, não todo o universo legal.

O produto não classifica consumidores, não cria lista de suspeitos, score individual ou alerta entre lojas e não recomenda discriminação, busca, retenção, detenção, força, exposição pública ou recusa automática de atendimento. Confira erros de caixa, cadastro, preço, balança, sistema e processo antes de atribuir causa. Não use a tela para negar direitos, cobrar valores ou encerrar reclamações sem revisão humana.

## Documentação

- [`docs/integracao-cdc.md`](docs/integracao-cdc.md) — bundle estático, GitHub Pages, fonte legal e limites.
- [`docs/painel-testes.md`](docs/painel-testes.md) — relatório estático e execuções de CI.
- [`docs/requisitos-produto.md`](docs/requisitos-produto.md) — público, casos de uso e capacidades ainda não implementadas.
- [`docs/escopo-e-seguranca.md`](docs/escopo-e-seguranca.md) — salvaguardas, privacidade e estágio.
- [`docs/roteiro.md`](docs/roteiro.md) — próximos passos de revisão e validação.
- [`docs/RETOMADA_CHATGPT.md`](docs/RETOMADA_CHATGPT.md) — estado de continuidade.
- [`legislacao/`](legislacao/) — catálogo legal seletivo e fontes oficiais.
