# Roteiro de evolução

Há uma consulta informativa somente de leitura ao CDC em migração para HTML, CSS, JavaScript e GitHub Pages. Publicar a página não significa aprovação jurídica, operacional, de privacidade ou segurança para uso real. A validação profissional e a governança continuam pendentes antes de qualquer piloto.

## Etapa 1 — Fechar a migração técnica estática

- Manter o site como arquivos estáticos sem API, servidor de aplicação, armazenamento ou coleta de incidentes.
- Validar o bundle do CDC a partir do catálogo e gerar relatório de testes com JavaScript no CI.
- Confirmar caminho relativo correto no subpath GitHub Pages e revisar o artefato antes de publicar.
- Não adicionar dados reais, credenciais ou históricos operacionais ao repositório público.

## Etapa 2 — Validar problema e usuários

- Conversar com gerentes, supervisores, equipes operacionais, atendimento ao consumidor e profissionais de segurança para entender incidentes sem recolher identificadores de clientes.
- Confirmar que o problema prioritário é verificação de processo e atendimento justo, não classificação de pessoas.
- Revisar `docs/requisitos-produto.md` e aprovar casos de uso e não objetivos.

## Etapa 3 — Revisão jurídica, privacidade e segurança

- Revisar CDC, LGPD, normas trabalhistas, políticas de segurança e regras locais com profissionais habilitados, usando fontes oficiais atuais.
- Revisar os seis guias do CDC, especialmente requisitos, exceções, prazos e alternativas legais.
- Definir governança, revisão humana, oportunidade de esclarecimento, acesso, retenção, exclusão, auditoria e resposta a incidentes antes de qualquer fluxo com dados.
- Excluir score individual, lista negra, reconhecimento facial/biométrico, busca por imagem, monitoramento entre lojas e decisão adversa automática.
- Não iniciar piloto com dados reais antes de aprovar finalidade, necessidade, transparência, controles e avaliação profissional.

## Etapa 4 — Validar o protótipo de consulta

- Testar bundle válido, ausente, duplicado, com status não confirmado, URL inválida e regra malformada.
- Testar busca/filtros acessíveis, carregamento sob o subpath e comportamento sem dados.
- Garantir que o CI não publique um novo site quando catálogo, testes ou build falharem.
- Verificar que o painel publicado apresenta resultados do CI e não executa operações no navegador.

## Etapa 5 — Avaliar qualquer ampliação

- Testar erros de caixa/preço/sistema, reclamações legítimas, falsos positivos, contextos diversos, pedidos discriminatórios e tentativas de induzir acusação.
- Medir clareza, qualidade das verificações e efeitos de erros sobre clientes e trabalhadores; não otimizar identificação de “suspeitos”.
- Manter consulta separada de caixa, câmeras, CRM, pagamentos, listas de observação e mecanismos de controle de acesso.
- Qualquer piloto exige revisão, treinamento, supervisão humana, canal de contestação, governança de dados e critérios de suspensão.
