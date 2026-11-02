# Contribuindo

O projeto é público e está em desenvolvimento. O protótipo atual é uma consulta estática ao CDC feita em HTML, CSS e JavaScript. Node.js é usado para testes, validação e build. Propostas devem explicar o problema operacional, as pessoas afetadas, a fonte verificável e como evitar falsos positivos ou impactos indevidos sobre clientes e trabalhadores.

- Nunca inclua nomes, CPF, documentos, imagens, vídeos, dados de pagamento, biometria, dados sensíveis, dados de crianças, credenciais, segredos ou registros reais de incidentes em issues, commits, prompts, logs, testes, relatório público ou exemplos. Use somente dados sintéticos.
- Não proponha score individual, perfil de consumidor, lista negra, reconhecimento facial/biométrico, vigilância entre lojas ou decisão adversa automatizada.
- Registre fatos observáveis e suas fontes; não trate suspeita, erro de transação ou alerta de sistema como prova de intenção ou culpa.
- Não incentive discriminação, ameaça, busca, retenção, detenção, força física, exposição pública ou recusa retaliatória de venda/atendimento.
- Não acrescente citações legais ou prazos sem fonte primária verificável e data de consulta.
- Identifique claramente conteúdo preliminar que ainda exige revisão profissional jurídica, operacional ou de privacidade.
- Não descreva comportamento planejado como funcionalidade já implementada.
- Mantenha o frontend compatível com o subpath `/<repositório>/` do GitHub Pages. Evite caminhos absolutos na raiz, APIs, armazenamento no navegador, serviços externos e dependências CDN.

Antes de enviar um PR, execute `npm test`, `npm run validate:catalog -- --strict-duplicates`, `npm run build:pages`, `node --check` nos arquivos JavaScript alterados e `git diff --check`. O relatório e a página serão públicos; confirme que mudanças não incluem dados pessoais, segredos ou logs locais.
