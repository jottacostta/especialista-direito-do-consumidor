# Especialista em Direito do Consumidor

Projeto em construção para desenvolver um assistente de informação sobre relações de consumo no Brasil. A proposta é explicar conceitos em linguagem simples, organizar os fatos relatados pela pessoa e indicar caminhos de pesquisa e atendimento, sempre com fontes verificáveis.

> **Estado atual:** especificação documental e catálogo preliminar de normas. Foi concluída uma auditoria de 39 leis estaduais e municipais do Rio de Janeiro, mas o catálogo não é exaustivo e ainda requer conferência contínua e revisão jurídica profissional. Não há aplicação, modelo de IA ou base legal validada para uso em casos reais.

## Princípios do produto

- **Jurisdição explícita:** foco inicial no Brasil, com prioridade para o Estado e o Município do Rio de Janeiro. Se a jurisdição ou o contexto não estiver claro, o assistente deve perguntar antes de concluir.
- **Fontes verificáveis:** respostas jurídicas devem apontar para fontes oficiais e atuais. Não inventar artigos, prazos, decisões ou garantias de resultado.
- **Limites claros:** oferecer informação geral e apoio à organização do caso; não se apresentar como advogado, não criar relação advogado-cliente e não substituir aconselhamento profissional.
- **Privacidade:** pedir somente os dados necessários e orientar a pessoa a ocultar CPF, endereço, dados bancários, senhas e identificadores de pedidos antes de compartilhar documentos.
- **Transparência:** separar fatos fornecidos, hipóteses e informação confirmada; declarar incerteza quando não houver fonte suficiente.

## Estrutura

- `AGENTS.md` — regras de continuidade para ChatGPT e outros agentes de pesquisa/código.
- `docs/RETOMADA_CHATGPT.md` — estado atual, lacunas e instruções para retomar o trabalho.
- `docs/auditoria-rj-2026-11-01.md` — conclusões e referências da auditoria das 39 leis do RJ.
- `prompts/instrucao-base.md` — instrução inicial para o comportamento do futuro assistente.
- `docs/escopo-e-seguranca.md` — limites, privacidade e protocolo de resposta.
- `docs/roteiro.md` — etapas propostas para evolução do produto.
- `avaliacoes/casos-de-seguranca.md` — cenários qualitativos para testar comportamento seguro.
- `legislacao/` — catálogo estruturado de normas e links de fontes oficiais.
- `scripts/validate_legislation.py` — verificação local do formato e de duplicatas no catálogo.

## Próximos passos

Consulte `docs/RETOMADA_CHATGPT.md` e `legislacao/README.md` para as contagens e limitações. O catálogo foi deduplicado por chave normativa e passou pelo validador em modo estrito. As coletas fora do RJ continuam seletivas; antes de ampliar o catálogo, confira as fontes oficiais e obtenha revisão de profissional habilitado no Brasil, especialmente antes de usar o conteúdo em um protótipo.

## Aviso

O material deste repositório é uma especificação preliminar de produto e um índice de pesquisa em andamento. Não constitui orientação jurídica para um caso concreto. Leis, regulamentos e entendimentos podem mudar; antes de agir, confirme a informação em fonte oficial e, quando necessário, procure advogado, Defensoria Pública ou órgão de defesa do consumidor.
