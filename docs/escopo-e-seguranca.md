# Escopo e segurança

## Escopo do produto

O produto em especificação deve apoiar gerentes e supervisores de supermercados na prevenção de perdas, verificação de discrepâncias e documentação de incidentes. Pode ajudar a conferir registros de compra e processos da loja, preparar uma conversa respeitosa e indicar quando encaminhar o caso a uma pessoa responsável.

A ferramenta não determina intenção, culpa ou autoria de crime. Uma diferença em recibo, estoque, preço ou pagamento é um fato a verificar, não prova de má-fé. Antes de atribuir causa, considerar falhas de caixa, etiqueta, balança, cadastro, equipamento, treinamento e procedimento.

## Salvaguardas de resposta

- Usar linguagem neutra: “incidente”, “discrepância” ou “suspeita a verificar”. Diferenciar observação, evidência, relato, hipótese e lacuna.
- Não atribuir risco ou intenção a uma pessoa por aparência, raça, etnia, nacionalidade, idioma, gênero, idade, deficiência, condição econômica ou características associadas.
- Não criar score individual, lista negra, reconhecimento facial/biométrico, busca por imagem, monitoramento entre lojas ou alerta compartilhado sobre consumidores.
- Não orientar busca pessoal ou de pertences, retenção, detenção, força física, ameaça, exposição pública, acusação sem comprovação ou recusa retaliatória de venda/atendimento.
- Não automatizar denúncia, banimento, recusa de serviço ou qualquer decisão adversa. Exigir revisão por pessoa treinada e oportunidade de esclarecimento respeitosa.
- Priorizar conferência de processo e resolução voluntária. Em risco imediato à segurança, orientar afastamento e acionamento do protocolo de emergência aprovado pela empresa, sem improvisar intervenção.
- Utilizar políticas internas somente quando fornecidas e aprovadas. Não inventar procedimentos nem apresentar hipótese jurídica como obrigação.

## Privacidade e dados

O desenvolvimento inicial deve usar dados sintéticos. O assistente não deve receber nomes, documentos, imagens, vídeo, biometria, dados de pagamento, dados sensíveis ou informações de crianças. Não inserir gravações de clientes em prompts ou exemplos. Se, no futuro, uma funcionalidade precisar de dados reais, a equipe deverá justificar finalidade e necessidade, definir base jurídica e transparência, limitar acessos, proteger logs, determinar retenção e exclusão e estabelecer auditoria e resposta a incidentes antes do piloto.

Qualquer tratamento real deve passar por revisão profissional de privacidade/LGPD e jurídica. Esta especificação não atesta conformidade legal. Configurações de retenção, permissões, criptografia e hospedagem permanecem pendentes.

## Informação jurídica

Quando responder sobre direitos do consumidor, políticas de preço ou outras obrigações, declarar a jurisdição e usar fonte oficial atual, com data de consulta quando relevante. O catálogo existente é seletivo: sua auditoria cobre 39 leis do Estado e do Município do Rio de Janeiro, não toda a legislação aplicável. Diferenciar texto legal, interpretação e política interna. Indicar incerteza e encaminhar dúvidas complexas à assessoria jurídica; não apresentar o sistema como advogado ou parecer profissional.

## Estágio e controle de mudanças

O repositório contém um protótipo local somente de leitura para consultar resumos editoriais do CDC vinculados ao catálogo, com interface HTML/CSS/JavaScript e API Python da biblioteca padrão. Não inclui registro de incidentes, autenticação, persistência ou publicação; escuta apenas no loopback. Frameworks, dados e hospedagem para uma versão operacional não foram escolhidos. A existência do protótipo não representa aprovação jurídica, de privacidade ou segurança para uso real. Veja `docs/integracao-cdc.md`.
