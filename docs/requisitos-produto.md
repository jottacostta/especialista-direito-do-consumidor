# Requisitos de produto — apoio à gestão de incidentes em supermercados

- **Estado:** especificação preliminar; nenhum código de aplicação foi iniciado.
- **Público principal:** gerentes e supervisores de supermercados, com participação de equipes autorizadas e treinadas.
- **Stack pretendida:** frontend HTML/CSS/JavaScript e backend Python; framework e infraestrutura ainda não definidos.

## Objetivo

Apoiar a prevenção de perdas e o tratamento consistente de discrepâncias e incidentes relacionados a compras, pagamentos, preços, registros de caixa e procedimentos da loja. O produto organiza fatos, oferece checklists e facilita escalonamento humano. Não determina se alguém agiu com má-fé, cometeu crime ou deve sofrer uma medida adversa.

## Casos de uso pretendidos

1. **Verificar uma discrepância:** orientar a conferência de recibo, transação, preço, etiqueta, cadastro, leitura do produto, balança, caixa e registros internos antes de atribuir causa.
2. **Documentar um incidente:** registrar data/hora, local, processo envolvido, fatos observáveis, fonte da evidência, verificações já feitas, explicação oferecida pela pessoa e encaminhamento. A identidade do cliente não deve ser necessária por padrão.
3. **Conduzir conversa respeitosa:** sugerir frases neutras para esclarecer uma divergência, reconhecer erro da loja, informar política aplicável e encerrar sem pressão ou exposição pública.
4. **Preservar evidências autorizadas:** orientar a registrar metadados e manter materiais já obtidos conforme procedimento interno aprovado, com acesso e retenção limitados. Não solicitar que o gerente copie, divulgue ou carregue imagens de clientes no assistente.
5. **Escalonar com segurança:** apresentar caminhos de revisão pelo gerente responsável, segurança treinada, suporte operacional, privacidade ou assessoria jurídica. Em risco imediato à segurança, orientar afastamento e acionamento do protocolo de emergência da empresa.
6. **Consultar regras verificadas:** resumir políticas internas fornecidas e fontes legais oficiais pertinentes, indicando jurisdição, data de consulta e limites. Não inventar política, obrigação ou consequência.
7. **Aprender com falhas de processo:** identificar padrões agregados de erro em equipamentos, preços, treinamento ou procedimentos, sem criar perfis ou rankings de consumidores.

## Fora de escopo

O produto não deve produzir listas de “clientes suspeitos”, perfis, pontuação individual de risco, reconhecimento facial ou biométrico, busca por imagem, rastreamento entre lojas ou compartilhamento de alertas sobre pessoas. Não deve recomendar discriminação baseada em aparência, raça, etnia, nacionalidade, idioma, gênero, idade, deficiência, condição econômica ou características associadas.

Não deve concluir culpa, redigir acusação como fato, gerar boletim de ocorrência automaticamente, decidir banimento, recusa de venda, retenção de produto/documento, busca pessoal ou de pertences, detenção, uso de força ou exposição pública. O sistema não substitui investigação autorizada, autoridade pública, treinamento de segurança ou aconselhamento jurídico.

## Salvaguardas obrigatórias

- Usar termos neutros como “incidente”, “discrepância” e “suspeita a verificar”.
- Separar fato observado, fonte, hipótese, relato da pessoa e informação ainda desconhecida.
- Mandar conferir primeiro erros da loja, de equipamento, preço, caixa, treinamento e processo.
- Registrar resultados como `resolvido`, `inconclusivo` ou `encaminhado`, nunca “culpado” ou “mal-intencionado”.
- Exigir revisão humana antes de qualquer medida com impacto sobre cliente ou funcionário.
- Oferecer oportunidade de esclarecimento respeitosa e não coercitiva.
- Usar somente políticas internas aprovadas e fontes oficiais atuais; declarar lacunas.
- Permitir correção de registros e trilha de auditoria de alterações, segundo regras que ainda precisam de revisão jurídica e de privacidade.

## Dados e privacidade

O protótipo deve usar dados sintéticos. Não incluir nomes, CPF, documentos, fotos, vídeo, dados biométricos, pagamento, dados sensíveis ou informações de crianças em prompts, testes, logs ou exemplos. Se uma operação futura demonstrar necessidade de dados reais, definir antes a finalidade, a base jurídica, os avisos aplicáveis, os perfis de acesso, segurança, retenção, exclusão, atendimento a direitos e resposta a incidentes. Submeter o desenho à revisão profissional de LGPD/privacidade e jurídica; esta especificação não declara conformidade legal.

## Critérios de aceitação do futuro protótipo

- Dada uma discrepância sem evidência suficiente, o sistema solicita verificações operacionais e classifica o caso como inconclusivo, sem inferir intenção.
- Diante de pedido para discriminar, expor, reter, revistar ou punir automaticamente um cliente, recusa essa ação e oferece alternativa segura baseada em política e revisão humana.
- Toda recomendação de procedimento interno identifica a política de origem; toda informação legal tem fonte oficial, jurisdição e data de verificação ou declara que não foi confirmada.
- Nenhum fluxo cria score individual, lista de vigilância ou decisão adversa automatizada.
- Os testes usam dados sintéticos e cobrem falsos positivos, erros da própria loja, reclamações legítimas, diferenças de contexto e tentativas de abuso da ferramenta.

## Decisões pendentes

Definir jurisdições atendidas, políticas internas aceitas, processo de revisão, perfis de acesso, armazenamento, criptografia, retenção, autenticação, hospedagem, resposta a incidente de dados e supervisão humana. Também falta decidir qual framework Python será usado. Nenhuma dessas escolhas deve ser tratada como implementada.
