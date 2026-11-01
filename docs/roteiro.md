# Roteiro de evolução

Este roteiro é preliminar. Nenhuma etapa de aplicação foi implementada; não começar código antes da aprovação dos requisitos, limites e decisões de dados.

## Etapa 1 — Validar problema e usuários

- Conversar com gerentes, supervisores, equipes operacionais, atendimento ao consumidor e profissionais de segurança para entender incidentes reais sem recolher identificadores de clientes.
- Confirmar que o problema prioritário é verificação de processo, prevenção de perdas e documentação, não classificação de pessoas.
- Revisar `docs/requisitos-produto.md` e aprovar os casos de uso e não objetivos.

## Etapa 2 — Revisão jurídica, privacidade e segurança

- Revisar CDC, LGPD, normas trabalhistas, políticas de segurança e regras locais com profissionais habilitados, usando fontes oficiais atuais.
- Definir governança de incidentes, revisão humana, oportunidade de esclarecimento, acesso, retenção, exclusão, auditoria e resposta a incidentes de dados.
- Excluir do desenho score individual, listas negras, reconhecimento facial/biométrico, busca por imagem, monitoramento entre lojas e decisões adversas automáticas.
- Não iniciar piloto com dados reais antes de aprovar finalidade, necessidade, transparência, controles e avaliação profissional.

## Etapa 3 — Definir arquitetura

- Confirmar a interface planejada em HTML/CSS/JavaScript e backend Python; comparar frameworks somente após requisitos de autenticação, autorização, armazenamento e auditoria.
- Desenhar fluxo de verificação, registro factual, conversa respeitosa e encaminhamento.
- Definir ambiente, hospedagem e proteção de segredos. Nenhuma dessas decisões está tomada.

## Etapa 4 — Protótipo com dados sintéticos

- Implementar somente depois da aprovação das etapas anteriores.
- Usar exemplos fictícios, sem nome, imagem, documento ou histórico de cliente real.
- Separar assistente informativo de qualquer sistema de caixa, câmeras, CRM, pagamento, lista de observação ou mecanismo de controle de acesso.

## Etapa 5 — Avaliação e piloto limitado

- Testar erros de caixa/preço/sistema, reclamações legítimas, falsos positivos, contextos diversos, pedidos discriminatórios e tentativas de induzir acusação.
- Medir clareza, qualidade da documentação, consistência, taxa de encaminhamento e efeitos de erros sobre clientes e funcionários; não otimizar uma métrica de identificação de “suspeitos”.
- Fazer piloto restrito, com supervisão humana, treinamento, auditoria, canal de contestação e critérios de suspensão.
- Suspender o piloto diante de profiling, exposição indevida, decisão adversa automática, vazamento ou acusações sem evidência.
