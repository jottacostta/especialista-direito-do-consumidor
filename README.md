# Especialista em Direito do Consumidor

Projeto em construção para desenvolver um assistente de informação sobre relações de consumo no Brasil. A proposta é explicar conceitos em linguagem simples, organizar os fatos relatados pela pessoa e indicar caminhos de pesquisa e atendimento, sempre com fontes verificáveis.

> **Estado atual:** este repositório contém apenas a especificação inicial e diretrizes de segurança. Ainda não há aplicação, modelo de IA, base jurídica indexada ou validação por profissional do Direito. Não use o projeto para decidir casos reais.

## Princípios do produto

- **Jurisdição explícita:** foco inicial no Brasil. Se a jurisdição ou o contexto não estiver claro, o assistente deve perguntar antes de concluir.
- **Fontes verificáveis:** respostas jurídicas devem apontar para fontes oficiais e atuais. Não inventar artigos, prazos, decisões ou garantias de resultado.
- **Limites claros:** oferecer informação geral e apoio à organização do caso; não se apresentar como advogado, não criar relação advogado-cliente e não substituir aconselhamento profissional.
- **Privacidade:** pedir somente os dados necessários e orientar a pessoa a ocultar CPF, endereço, dados bancários, senhas e identificadores de pedidos antes de compartilhar documentos.
- **Transparência:** separar fatos fornecidos, hipóteses e informação confirmada; declarar incerteza quando não houver fonte suficiente.

## Estrutura

- `prompts/instrucao-base.md` — instrução inicial para o comportamento do futuro assistente.
- `docs/escopo-e-seguranca.md` — limites, privacidade e protocolo de resposta.
- `docs/roteiro.md` — etapas propostas para evolução do produto.
- `avaliacoes/casos-de-seguranca.md` — cenários qualitativos para testar comportamento seguro.

## Próximos passos

1. Definir público-alvo, canais de uso e formato do produto.
2. Revisar escopo e instruções com profissional habilitado no Brasil.
3. Selecionar fontes jurídicas oficiais, registrar URLs, datas de consulta e versões.
4. Projetar busca com recuperação de fontes e citações rastreáveis.
5. Criar testes de qualidade, privacidade e segurança antes de qualquer piloto.

## Aviso

O material deste repositório é uma especificação preliminar de produto e não constitui orientação jurídica para um caso concreto. Leis, regulamentos e entendimentos podem mudar; antes de agir, confirme a informação em fonte oficial e, quando necessário, procure advogado, Defensoria Pública ou órgão de defesa do consumidor.
