# Requisitos de produto — apoio à gestão em supermercados

- **Estado:** protótipo publicado, somente de leitura, para consulta de seis resumos editoriais do CDC. Os fluxos de incidentes e demais capacidades continuam em especificação.
- **Público principal:** gerentes e supervisores de supermercados, com participação de equipes autorizadas e treinadas.
- **Stack escolhida nesta etapa:** HTML, CSS e JavaScript no navegador; GitHub Pages para arquivos estáticos; Node.js sem dependências externas apenas para validação, build, testes e prévia local. Não há backend Python ou API no produto.

O protótipo vincula os seis guias ao registro federal da Lei nº 8.078/1990 no catálogo. Não inclui autenticação, cadastro de casos, armazenamento, integração com sistemas da loja ou inteligência artificial. O repositório, a página e o relatório de testes são públicos. A revisão profissional dos resumos permanece pendente. Consulte `docs/integracao-cdc.md`.

## Objetivo

Apoiar a prevenção de perdas e o tratamento consistente de discrepâncias e incidentes relacionados a compras, pagamentos, preços, registros de caixa e procedimentos da loja. O produto em concepção organiza fatos, oferece checklists e facilita escalonamento humano. Não determina se alguém agiu com má-fé, cometeu crime ou deve sofrer medida adversa.

## Casos de uso pretendidos para o produto futuro

1. **Verificar uma discrepância:** orientar conferência de recibo, transação, preço, etiqueta, cadastro, leitura do produto, balança, caixa e registros internos antes de atribuir causa.
2. **Documentar um incidente, se houver base aprovada:** registrar data/hora, local, processo envolvido, fatos observáveis, fonte da evidência, verificações, explicação da pessoa e encaminhamento. A identidade do cliente não deve ser necessária por padrão.
3. **Conduzir conversa respeitosa:** sugerir frases neutras para esclarecer uma divergência, reconhecer erro da loja, informar política aplicável e encerrar sem pressão ou exposição pública.
4. **Preservar evidências autorizadas:** orientar materiais já obtidos conforme procedimento interno aprovado, com acesso e retenção limitados. Não solicitar cópia ou upload de imagens de clientes.
5. **Escalonar com segurança:** apresentar revisão por liderança responsável, segurança treinada, suporte operacional, privacidade ou assessoria jurídica. Em risco imediato, orientar afastamento e protocolo de emergência aprovado.
6. **Consultar regras verificadas:** resumir políticas aprovadas e fontes legais oficiais pertinentes, indicando jurisdição, data e limites.
7. **Aprender com falhas de processo:** identificar padrões agregados em equipamentos, preços, treinamento ou procedimentos, sem criar perfis ou rankings de consumidores.

Esses fluxos futuros não devem ser descritos como já implementados. O Pages atual não recebe dados de incidentes e não mantém estado entre visitas.

## Fora de escopo

O produto não deve produzir listas de “clientes suspeitos”, perfis, pontuação individual de risco, reconhecimento facial/biométrico, busca por imagem, rastreamento entre lojas ou compartilhamento de alertas sobre pessoas. Não deve recomendar discriminação baseada em aparência, raça, etnia, nacionalidade, idioma, gênero, idade, deficiência, condição econômica ou características associadas.

Não deve concluir culpa, redigir acusação como fato, gerar boletim de ocorrência automaticamente, decidir banimento, recusa de venda, retenção de produto/documento, busca pessoal ou de pertences, detenção, uso de força ou exposição pública. O sistema não substitui investigação autorizada, autoridade pública, treinamento de segurança ou aconselhamento jurídico.

## Salvaguardas obrigatórias

- Usar termos neutros como “incidente”, “discrepância” e “suspeita a verificar”.
- Separar fato observado, fonte, hipótese, relato da pessoa e informação desconhecida.
- Conferir primeiro erros da loja, de equipamento, preço, caixa, treinamento e processo.
- Registrar resultados como `resolvido`, `inconclusivo` ou `encaminhado`, nunca “culpado” ou “mal-intencionado”.
- Exigir revisão humana antes de qualquer medida com impacto sobre cliente ou funcionário.
- Oferecer oportunidade de esclarecimento respeitosa e não coercitiva.
- Usar somente políticas internas aprovadas e fontes oficiais atuais; declarar lacunas.
- Não coletar dados reais até definir base, finalidade, segurança, retenção, exclusão e revisão profissional.

## Dados, publicidade e privacidade

O repositório e a página Pages são públicos conforme a decisão do responsável. O código e o relatório de CI não podem incluir dados pessoais ou operacionais. Testes e demonstrações usam dados sintéticos. O app atual não tem backend nem persistência, mas isso não constitui aprovação jurídica, de segurança ou de privacidade para uso operacional. Se algum fluxo futuro precisar de dados reais, definir finalidade, base jurídica, transparência, acesso, retenção, exclusão e resposta a incidentes e submeter o desenho a revisão profissional.

## Critérios de aceitação do produto futuro

- Diante de discrepância sem evidência suficiente, solicitar verificações operacionais e manter a conclusão inconclusiva, sem inferir intenção.
- Recusar pedidos para discriminar, expor, reter, revistar ou punir automaticamente e oferecer alternativa segura com revisão humana.
- Toda recomendação interna identificar a política de origem; toda informação legal indicar fonte oficial, jurisdição e data de verificação ou declarar que não foi confirmada.
- Não criar score individual, lista de vigilância ou decisão adversa automatizada.
- Cobrir falsos positivos, erros da loja, reclamações legítimas, contexto e tentativas de abuso com dados sintéticos.

## Decisões pendentes

Definir jurisdições atendidas, políticas internas aceitas, processo de revisão, perfis de acesso, eventual armazenamento, criptografia, retenção, autenticação, resposta a incidente de dados e supervisão humana. Nenhuma capacidade de gestão de incidentes foi implementada nesta etapa.
