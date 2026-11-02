# Escopo e segurança

## Escopo do produto

O produto em especificação deve apoiar gerentes e supervisores de supermercados na prevenção de perdas, verificação de discrepâncias e atendimento justo. O protótipo publicado é somente uma consulta estática a seis resumos iniciais do CDC. Não registra incidentes nem processa casos individuais.

A ferramenta não determina intenção, culpa ou autoria de crime. Uma diferença em recibo, estoque, preço ou pagamento é um fato a verificar, não prova de má-fé. Antes de atribuir causa, considerar falhas de caixa, etiqueta, balança, cadastro, equipamento, treinamento e procedimento.

## Salvaguardas de resposta

- Usar linguagem neutra: “incidente”, “discrepância” ou “suspeita a verificar”. Diferenciar observação, evidência, relato, hipótese e lacuna.
- Não atribuir risco ou intenção a uma pessoa por aparência, raça, etnia, nacionalidade, idioma, gênero, idade, deficiência, condição econômica ou características associadas.
- Não criar score individual, lista negra, reconhecimento facial/biométrico, busca por imagem, monitoramento entre lojas ou alerta compartilhado sobre consumidores.
- Não orientar busca pessoal ou de pertences, retenção, detenção, força física, ameaça, exposição pública, acusação sem comprovação ou recusa retaliatória de venda/atendimento.
- Não automatizar denúncia, banimento, recusa de serviço ou qualquer decisão adversa. Exigir revisão por pessoa treinada e oportunidade de esclarecimento respeitosa.
- Priorizar conferência de processo e resolução voluntária. Em risco imediato, acionar protocolo de emergência aprovado, sem improvisar intervenção.
- Utilizar políticas internas somente quando fornecidas e aprovadas. Não inventar procedimentos nem apresentar hipótese jurídica como obrigação.

## Privacidade e dados

O repositório e o site Pages são públicos. O código, o catálogo selecionado para o bundle e o relatório de testes são acessíveis publicamente. Não incluir nomes, documentos, imagens, vídeo, biometria, dados de pagamento, dados sensíveis, dados de crianças, credenciais ou logs operacionais no código, nos índices, no relatório ou em exemplos. Use dados sintéticos.

A aplicação estática não usa backend, cookies, localStorage, analytics ou formulário de relato. GitHub Pages pode registrar endereços IP para fins de segurança, conforme a documentação do serviço. A ausência de armazenamento pelo aplicativo não equivale a anonimato da visita nem a aprovação para uso operacional.

Qualquer tratamento futuro de dados reais exige avaliação de finalidade, necessidade, base jurídica, transparência, acessos, segurança, retenção, exclusão, auditoria e resposta a incidentes antes do piloto, além de revisão profissional de privacidade/LGPD e jurídica. Esta especificação não atesta conformidade legal.

## Informação jurídica

Quando responder sobre direitos do consumidor, políticas de preço ou outras obrigações, declarar a jurisdição e usar fonte oficial atual, com data de consulta quando relevante. O catálogo é seletivo: a auditoria cobre 39 leis do Estado e do Município do Rio de Janeiro, não toda a legislação aplicável. Diferenciar texto legal, interpretação e política interna. Indicar incerteza e encaminhar dúvidas complexas à assessoria jurídica; não apresentar o sistema como advogado ou parecer profissional.

## Estágio e controle de mudanças

A migração para HTML/CSS/JavaScript foi concluída e o site está publicado no GitHub Pages. O deploy verificado é o run `41516154912`; mudanças futuras só devem ser tratadas como publicadas depois que o deploy correspondente concluir com sucesso. Node.js executa validação, build, testes e prévia local; não é backend de produção. Não há cadastro, autenticação, incidentes, armazenamento ou integração com sistemas da loja. A publicação pública não representa aprovação jurídica, de privacidade, segurança ou uso real. Veja `docs/integracao-cdc.md`.
