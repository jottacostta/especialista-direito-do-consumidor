# Instruções para agentes de código e pesquisa

Leia `docs/RETOMADA_CHATGPT.md`, `docs/requisitos-produto.md` e `docs/escopo-e-seguranca.md` antes de continuar. Leia `docs/integracao-cdc.md` para alterar a consulta e `legislacao/README.md` antes de alterar qualquer índice legal.

## Produto e estágio

O repositório contém um protótipo web de consulta informativa ao CDC: frontend HTML/CSS/JavaScript em `public/`, API local Python em `backend/` e entrypoints file-based para Vercel em `api/`. O Vercel deploy ainda não foi criado: requer workspace/team acessível, autorização GitHub para o repo privado, proteção de implantação verificada e merge autorizado do PR. Não descreva a aplicação como publicada ou pronta para produção.

## Limites de segurança e justiça

Trate todo caso como incidente ou suspeita a verificar, nunca como prova de intenção criminosa. Baseie a assistência em fatos observáveis e registros verificáveis, e considere primeiro erro de caixa, cadastro, preço, leitura, processo, treinamento ou sistema. Não classifique uma pessoa como “mal-intencionada”, “ladra” ou “fraudadora”; não gere score individual, lista negra, vigilância entre lojas, reconhecimento facial/biométrico ou decisão automatizada adversa.

Não recomende discriminação, humilhação, ameaça, busca pessoal ou de pertences, retenção, detenção, força física, recusa retaliatória de venda/atendimento ou acusação pública. A decisão operacional cabe a pessoa responsável treinada, após revisão humana e oportunidade de esclarecimento respeitosa. Escale somente por procedimentos legais e de segurança definidos pela empresa.

Minimize dados. O protótipo de consulta não deve coletar ou armazenar relatos de incidentes, nomes, documento, imagem, biometria, características físicas, dados sensíveis, dados de pagamento ou dados de crianças. Use dados sintéticos nos testes. Qualquer coleta real futura exige finalidade, necessidade, acesso limitado, retenção e exclusão definidos, controles de segurança e revisão profissional de privacidade e jurídica.

## Informação jurídica

A consulta é informativa, não é advogado nem parecer profissional. Não invente leis, artigos, datas, vigência, decisões ou links. Para afirmações jurídicas, use fonte oficial, informe a data de verificação e separe texto legal, resumo editorial, fato e hipótese. A API deve vincular o CDC ao registro federal exato do catálogo e não servir regras se essa fonte não puder ser confirmada. Os resumos requerem revisão profissional. A auditoria catalográfica é seletiva e não exaustiva.

## Dados legislativos

Siga o esquema de `legislacao/README.md`. Inclua atos normativos, não projetos de lei ou decisões individuais. Use links de fontes oficiais e registre a URL que sustenta o status quando ela for diferente da fonte do texto. Em consolidações, preserve fontes complementares em `related_source_urls`. Os status aceitos são `vigente`, `parcialmente_vigente`, `revogada`, `declarada_inconstitucional` e `nao_verificada`; invalidação judicial não é sinônimo de revogação formal.

## Fluxo Git, aplicação e validação

Trabalhe em branch de tarefa baseado no `main` atualizado. Não faça push direto em `main` nem mescle PR sem autorização explícita. Preserve alterações existentes. Para os índices, execute `python3 scripts/validate_legislation.py` e `python3 scripts/validate_legislation.py --strict-duplicates`. Para a aplicação, execute `python3 -m unittest discover -s tests -v`, `python3 -m py_compile api/health.py api/rules.py backend/catalog.py backend/http_utils.py backend/server.py` e `node --check public/app.js`. Valide também `vercel.json` como JSON e confira que `includeFiles` inclui os dados legislativos exigidos. Não declare conformidade legal, cobertura exaustiva ou segurança de produção sem revisão e evidência documentadas.
