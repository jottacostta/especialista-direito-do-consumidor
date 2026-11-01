# Instruções para agentes de código e pesquisa

Leia `docs/RETOMADA_CHATGPT.md`, `docs/requisitos-produto.md` e `docs/escopo-e-seguranca.md` antes de continuar. Leia `legislacao/README.md` antes de alterar qualquer índice legal.

## Produto e estágio

O produto em especificação é uma aplicação web de apoio a gerentes de supermercado para prevenção de perdas, registro factual de incidentes e atendimento consistente. A interface prevista é HTML/CSS/JavaScript, com backend Python; a aplicação ainda não foi implementada. Não descreva comportamento planejado como funcionalidade existente.

## Limites de segurança e justiça

Trate todo caso como incidente ou suspeita a verificar, nunca como prova de intenção criminosa. Baseie a assistência em fatos observáveis e registros verificáveis, e considere primeiro erro de caixa, cadastro, preço, leitura, processo, treinamento ou sistema. Não classifique uma pessoa como “mal-intencionada”, “ladra” ou “fraudadora”; não gere score individual, lista negra, vigilância entre lojas, reconhecimento facial/biométrico ou decisão automatizada adversa.

Não recomende discriminação, humilhação, ameaça, busca pessoal ou de pertences, retenção, detenção, força física, recusa retaliatória de venda/atendimento ou acusação pública. A decisão operacional cabe a pessoa responsável treinada, após revisão humana e oportunidade de esclarecimento respeitosa. Escale somente por procedimentos legais e de segurança definidos pela empresa.

Minimize dados. Não solicite ou armazene por padrão nome, documento, imagem, biometria, características físicas, dados sensíveis, dados de pagamento ou dados de crianças. Use dados sintéticos nos exemplos e testes. Qualquer coleta real exige finalidade, necessidade, acesso limitado, retenção e exclusão definidos, controles de segurança e revisão profissional de privacidade e jurídica.

## Informação jurídica

Apoie a gestão sem retirar direitos das pessoas consumidoras. Não apresente o sistema como advogado ou parecer profissional. Não invente leis, artigos, datas, vigência, decisões ou links. Para afirmações jurídicas, use fonte oficial, informe a data de consulta quando relevante e separe fato, hipótese e lacuna. A auditoria catalográfica existente é seletiva e não exaustiva.

## Dados legislativos

Siga o esquema de `legislacao/README.md`. Inclua atos normativos, não projetos de lei ou decisões individuais. Use links de fontes oficiais e registre a URL que sustenta o status quando ela for diferente da fonte do texto. Em consolidações, preserve fontes complementares em `related_source_urls`. Os status aceitos são `vigente`, `parcialmente_vigente`, `revogada`, `declarada_inconstitucional` e `nao_verificada`; invalidação judicial não é sinônimo de revogação formal.

## Fluxo Git e validação

Trabalhe em branch de tarefa baseado no `main` atualizado. Não faça push direto em `main` nem mescle PR sem autorização explícita. Preserve alterações existentes. Para os índices, execute `python3 scripts/validate_legislation.py` e `python3 scripts/validate_legislation.py --strict-duplicates`. Não declare conformidade legal, cobertura exaustiva ou segurança de produção sem revisão e evidência documentadas.
