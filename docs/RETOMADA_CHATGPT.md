# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-01. A `main` contém o merge do PR #1. A aplicação está no PR #2: https://github.com/jottacostta/especialista-direito-do-consumidor/pull/2, branch `feature/prototipo-consulta-cdc` sobre `main`. O commit anterior (`910b3e9`) tinha CI verde; confirmar o head e CI novamente após alterações desta preparação Vercel.

## Objetivo e estado técnico

O projeto visa apoiar gerentes e supervisores de supermercados na prevenção de perdas, conferência de discrepâncias e atendimento justo, sem presumir má-fé, avaliar caráter ou decidir culpa de consumidores.

Há um protótipo de consulta somente de leitura em HTML/CSS/JavaScript e Python. A interface canônica está em `public/`. `backend/server.py` inicia um servidor local somente em `127.0.0.1`. Para testar localmente:

```bash
python3 -m backend.server
```

Acesse `http://127.0.0.1:8000`. O protótipo não grava incidentes, não salva consultas nem coleta dados de clientes. A API oferece `GET /api/health` e `GET /api/rules`.

## Preparação para Vercel

O diretório `api/` contém handlers Python file-based para `/api/health` e `/api/rules`; `vercel.json` inclui os índices JSONL e as regras JSON no bundle e aplica cabeçalhos globais de segurança. A documentação oficial consultada informa que funções Python em `api/` podem expor uma classe `handler` baseada em `BaseHTTPRequestHandler`, e que `public/` serve assets estáticos. Ver `docs/integracao-cdc.md`.

Nenhum projeto Vercel ou URL foi criado. Na integração conectada, o GitHub namespace `jottacostta` está marcado como acesso restrito, a busca Vercel do repo retorna lista vazia e `list_teams` não encontrou workspaces. O Vercel não está autorizado para ler este repo privado. A tentativa de relogin mostrou que o servidor Vercel já está autenticado e não abriu nova autorização. Para continuar, a pessoa responsável deve conectar/criar um workspace Vercel e dar à GitHub App do Vercel acesso ao repositório `jottacostta/especialista-direito-do-consumidor`; depois informar o slug do workspace. Verificar a configuração de Deployment Protection nesse workspace antes de chamar o deploy de protegido.

O PR #2 ainda não foi mesclado em `main`. A pessoa usuária escolheu “Python + Vercel protegido”, mas não escreveu a autorização explícita de merge. Não mesclar até receber a autorização literal “Autorizo mesclar o PR #2”. Só depois de o workspace/repo estarem acessíveis e a proteção revisada pode ser criado o projeto Vercel para deploy automático a partir do GitHub.

## Integração com o CDC e salvaguardas

A API procura exatamente um registro federal para a Lei nº 8.078/1990 no catálogo e requer status `vigente`, data ISO válida e fonte HTTPS. Se não confirmar a origem, não serve os resumos. A interface mostra o status e a data de verificação gravados no JSONL.

Há seis guias editoriais iniciais: preço/oferta; peso/quantidade; validade/segurança; troca/desistência; atendimento/práticas comerciais; cobrança/pagamentos. Os resumos ainda precisam de revisão profissional jurídica e operacional. Não cobrem todos os artigos, exceções, normas estaduais/municipais ou mudanças legais.

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa automatizada. Não recomendar busca, retenção, detenção, força, exposição pública ou discriminação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo. Qualquer uso real exige revisão jurídica, de privacidade e segurança.

## Catálogo e validação

O catálogo tem 229 registros em 16 arquivos, sem duplicatas na última validação. A auditoria anterior cobriu 39 atos selecionados do RJ, não todo o universo legal.

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile api/health.py api/rules.py backend/catalog.py backend/http_utils.py backend/server.py scripts/validate_legislation.py
node --check public/app.js
python3 scripts/validate_legislation.py --strict-duplicates
```

Não fazer push direto em `main` nem mesclar sem autorização explícita e checks obrigatórios verdes no SHA atual. O protótipo e as funções Vercel não foram aprovados para produção.
