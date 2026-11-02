# Roteiro de evolução

O protótipo inicial de consulta somente de leitura ao CDC está publicado no GitHub Pages. A publicação técnica não significa aprovação jurídica, operacional, de privacidade ou segurança para uso real. A revisão profissional e a governança continuam pendentes antes de qualquer piloto.

## Etapa 1 — Publicação técnica estática (concluída em 2026-11-02)

- O site usa apenas arquivos estáticos HTML, CSS e JavaScript, sem API, servidor de aplicação, armazenamento ou coleta de incidentes.
- O workflow valida o bundle do CDC, roda os testes JavaScript, constrói o relatório e publica somente após a aprovação em `main` ou despacho manual nessa branch.
- A página está disponível em [GitHub Pages](https://jottacostta.github.io/especialista-direito-do-consumidor/) e o painel em [`/testes/`](https://jottacostta.github.io/especialista-direito-do-consumidor/testes/).
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

## Etapa 4 — Manter a validação do protótipo

- Continuar testando bundle válido, ausente, duplicado, com status não confirmado, URL inválida e regra malformada.
- Testar busca/filtros acessíveis, carregamento sob o subpath e comportamento sem dados.
- Garantir que o CI não publique uma nova versão quando catálogo, testes ou build falharem.
- Verificar que o painel publicado apresenta resultados do CI e não executa operações no navegador.

## Etapa 5 — Avaliar qualquer ampliação

- Testar erros de caixa/preço/sistema, reclamações legítimas, falsos positivos, contextos diversos, pedidos discriminatórios e tentativas de induzir acusação.
- Medir clareza, qualidade das verificações e efeitos de erros sobre clientes e trabalhadores; não otimizar identificação de “suspeitos”.
- Manter consulta separada de caixa, câmeras, CRM, pagamentos, listas de observação e mecanismos de controle de acesso.
- Qualquer piloto exige revisão, treinamento, supervisão humana, canal de contestação, governança de dados e critérios de suspensão.
