# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-01. A `main` já inclui o merge do PR #1. A aplicação está sendo trabalhada em `feature/prototipo-consulta-cdc`, criado sobre o commit `e727abf` de `origin/main`; conferir o estado Git e os PRs antes de continuar.

## Objetivo e estágio

O objetivo maior continua sendo apoiar gerentes e supervisores de supermercados na prevenção de perdas, conferência de discrepâncias e atendimento justo, sem presumir má-fé, avaliar caráter ou decidir culpa de consumidores. O repositório agora contém uma primeira **consulta informativa local ao CDC**, com frontend HTML/CSS/JavaScript e backend Python sem dependências externas.

Para testar localmente, na raiz do repositório:

```bash
python3 -m backend.server
```

Acesse `http://127.0.0.1:8000`. O backend apenas lê os índices JSONL do catálogo e `data/cdc_rules.json`; oferece `GET /api/health` e `GET /api/rules`. Não grava incidentes, não salva consultas, não coleta dados de clientes e escuta apenas em `127.0.0.1`. Isso não é um ambiente de produção.

## Integração com o CDC

A API procura exatamente um registro federal para a Lei nº 8.078/1990 no catálogo e requer status `vigente`, data ISO válida e fonte HTTPS. Se o registro estiver ausente, duplicado, malformado ou não satisfizer esses requisitos, o endpoint não serve os resumos. A interface mostra o status e a data de verificação vindos do próprio catálogo.

Há seis guias editoriais iniciais: preço/oferta; peso/quantidade; validade/segurança; troca/desistência; atendimento/práticas comerciais; cobrança/pagamentos. A organização usou como fonte oficial o texto atualizado da Câmara dos Deputados, mas os resumos ainda precisam de revisão profissional jurídica e operacional. Eles não cobrem todos os artigos, exceções, normas estaduais/municipais ou mudanças legais. Ver `docs/integracao-cdc.md`.

## Salvaguardas

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa automatizada. Não recomendar busca, retenção, detenção, força, exposição pública ou discriminação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo. Qualquer uso real deve passar por revisão jurídica, de privacidade e segurança.

## Catálogo

O catálogo preservado tem 229 registros em 16 arquivos, sem duplicatas na última validação. A auditoria anterior cobriu 39 atos selecionados do RJ, não todo o universo legal. Os resultados e referências estão em `docs/auditoria-rj-2026-11-01.md`; leia `legislacao/README.md` antes de alterar os índices.

## Comandos de validação

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile backend/catalog.py backend/server.py scripts/validate_legislation.py
node --check frontend/app.js
python3 scripts/validate_legislation.py --strict-duplicates
```

O workflow `.github/workflows/validate-catalog.yml` executa verificações locais reproduzíveis nos PRs. Não fazer push direto em `main` nem mesclar sem autorização explícita e checks obrigatórios aprovados no SHA atual.
