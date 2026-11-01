# Roteiro de evolução

Existe um protótipo local somente de leitura para consultar resumos iniciais do CDC. Isso não significa aprovação jurídica, operacional, de privacidade ou de segurança para uso real. As etapas de validação de problema, revisão profissional e definição de governança continuam pendentes antes de qualquer piloto ou publicação.

## Etapa 1 — Validar problema e usuários

- Conversar com gerentes, supervisores, equipes operacionais, atendimento ao consumidor e profissionais de segurança para entender incidentes reais sem recolher identificadores de clientes.
- Confirmar que o problema prioritário é verificação de processo, prevenção de perdas e documentação, não classificação de pessoas.
- Revisar `docs/requisitos-produto.md` e aprovar os casos de uso e não objetivos.

## Etapa 2 — Revisão jurídica, privacidade e segurança

- Revisar CDC, LGPD, normas trabalhistas, políticas de segurança e regras locais com profissionais habilitados, usando fontes oficiais atuais.
- Revisar os seis guias do CDC e suas referências, especialmente condições, exceções, prazos e alternativas legais.
- Definir governança de incidentes, revisão humana, oportunidade de esclarecimento, acesso, retenção, exclusão, auditoria e resposta a incidentes de dados.
- Excluir do desenho score individual, listas negras, reconhecimento facial/biométrico, busca por imagem, monitoramento entre lojas e decisões adversas automáticas.
- Não iniciar piloto com dados reais antes de aprovar finalidade, necessidade, transparência, controles e avaliação profissional.

## Etapa 3 — Definir arquitetura

- Confirmar a interface planejada em HTML/CSS/JavaScript e backend Python; comparar frameworks somente após requisitos de autenticação, autorização, armazenamento e auditoria.
- Desenhar fluxo de verificação, registro factual, conversa respeitosa e encaminhamento.
- Definir ambiente, hospedagem e proteção de segredos. Nenhuma dessas decisões está tomada para uma versão operacional.

## Etapa 4 — Protótipo local com dados e regras limitados

- O protótipo atual contém uma busca somente de leitura no catálogo do CDC e não persiste consultas ou dados de incidentes.
- Testar usando regras editoriais curadas e registros do catálogo; não usar casos reais ou identificadores de consumidor.
- Separar a consulta de qualquer sistema de caixa, câmeras, CRM, pagamento, lista de observação ou mecanismo de controle de acesso.
- Não publicar nem disponibilizar na rede antes de desenhar autenticação, autorização, proteção de dados, auditoria e revisão profissional.

## Etapa 5 — Avaliação e eventual piloto limitado

- Testar erros de caixa/preço/sistema, reclamações legítimas, falsos positivos, contextos diversos, pedidos discriminatórios e tentativas de induzir acusação.
- Medir clareza, qualidade da documentação, consistência, taxa de encaminhamento e efeitos de erros sobre clientes e funcionários; não otimizar métrica de identificação de “suspeitos”.
- Fazer piloto restrito somente após aprovações, com supervisão humana, treinamento, auditoria, canal de contestação e critérios de suspensão.
- Suspender o piloto diante de profiling, exposição indevida, decisão adversa automática, vazamento ou acusações sem evidência.
