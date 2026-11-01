# Guia de atendimento e consulta ao CDC para supermercados

Repositório privado com um protótipo informativo para apoiar gerentes na consulta de regras do Código de Defesa do Consumidor em situações comuns de supermercado. A interface usa HTML/CSS/JavaScript e conversa com uma API Python que vincula os resumos ao catálogo legislativo do projeto.

> **Escopo:** consulta somente de leitura. O protótipo não registra incidentes, não coleta dados de clientes, não conclui má-fé ou culpa e não substitui revisão humana ou orientação jurídica.

## Executar localmente

Requer Python 3.10 ou superior. O servidor local e as funções HTTP usam a biblioteca padrão; não há banco de dados nem chave de API.

```bash
python3 -m backend.server
```

Acesse `http://127.0.0.1:8000`. Para outra porta, use `python3 -m backend.server --port 8080`. O servidor de desenvolvimento só escuta em `127.0.0.1`; encerre com `Ctrl+C`.

## Como funciona

A interface permite pesquisar e filtrar guias sobre preço e oferta, peso/quantidade, validade e segurança de produtos, troca/desistência, práticas comerciais/atendimento e cobrança/pagamentos. A API Python valida e lê a entrada federal da Lei nº 8.078/1990 no catálogo JSONL antes de fornecer as regras. O status e a data mostrados são os que estão registrados no catálogo e não se atualizam automaticamente.

A aplicação falha de forma fechada: não serve o guia se encontrar entrada ausente ou duplicada, JSON malformado, fonte não HTTPS ou status diferente de `vigente`. Não possui rotas para gravar dados, não salva buscas e não registra consultas na camada da aplicação. Os resumos são uma camada editorial limitada; veja [`docs/integracao-cdc.md`](docs/integracao-cdc.md).

## Vercel

A branch contém configuração preparada para o modelo file-based da Vercel: `public/` contém os arquivos estáticos e `api/health.py` e `api/rules.py` são os handlers Python para as rotas da API. `vercel.json` declara os arquivos JSON de que as funções precisam e os cabeçalhos de segurança. O servidor `backend.server` continua sendo apenas para execução local.

**Ainda não há deploy ativo.** Para ativar o deploy automático a partir do GitHub, o workspace Vercel precisa ter acesso ao repositório privado e a proteção de implantação precisa ser configurada e verificada. O PR com a aplicação ainda precisa ser mesclado em `main` com autorização explícita da pessoa responsável. Não publicar nem tratar a aplicação como pronta para produção enquanto isso estiver pendente.

## Verificações

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile api/health.py api/rules.py backend/catalog.py backend/http_utils.py backend/server.py scripts/validate_legislation.py
node --check public/app.js
python3 scripts/validate_legislation.py --strict-duplicates
```

O workflow do GitHub executa essas verificações em Pull Requests.

## Catálogo legislativo

`legislacao/` contém 229 registros preliminares em 16 índices JSONL, sem duplicatas na última validação. O levantamento é seletivo, não exaustivo e não equivale à confirmação profissional da vigência de cada ato. A auditoria do Rio de Janeiro está em [`docs/auditoria-rj-2026-11-01.md`](docs/auditoria-rj-2026-11-01.md).

## Documentação

- [`docs/integracao-cdc.md`](docs/integracao-cdc.md) — execução local, estrutura Vercel, fontes e limites.
- [`docs/requisitos-produto.md`](docs/requisitos-produto.md) — escopo maior do produto e itens ainda não implementados.
- [`docs/escopo-e-seguranca.md`](docs/escopo-e-seguranca.md) — salvaguardas, privacidade e segurança.
- [`docs/roteiro.md`](docs/roteiro.md) — próximos passos de revisão e validação.
- [`docs/RETOMADA_CHATGPT.md`](docs/RETOMADA_CHATGPT.md) — estado técnico e continuidade.
- [`legislacao/`](legislacao/) — catálogo legal e fontes oficiais.

## Próximas revisões

Revisar os resumos com profissional habilitado em direito do consumidor e responsáveis por operação e privacidade. Antes de qualquer publicação ou uso real, verificar autenticação e proteção, segurança, governança, retenção e resposta a incidentes. Essas capacidades não fazem parte do protótipo.
