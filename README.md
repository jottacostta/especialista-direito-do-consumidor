# Assistente de Apoio à Gestão de Incidentes em Supermercados

Projeto em fase de especificação para apoiar gerentes de supermercados na prevenção de perdas, verificação de discrepâncias e tratamento respeitoso de incidentes envolvendo consumidores. O nome de trabalho do produto ainda pode mudar; o nome do repositório não foi alterado.

> **Estado atual:** há documentação de produto e um catálogo legal preliminar. A aplicação ainda não existe. O catálogo inclui uma auditoria de 39 leis estaduais e municipais do Rio de Janeiro, mas não é exaustivo nem constitui validação jurídica para uso operacional.

## Princípios do produto

- **Fatos antes de conclusões:** registrar comportamentos e discrepâncias observáveis; não presumir intenção nem chamar clientes de criminosos.
- **Prevenção justa:** verificar primeiro erros de sistema, caixa, cadastro, preço, leitura, treinamento ou processo; aplicar procedimentos iguais a todas as pessoas.
- **Revisão humana:** não automatizar acusação, busca, retenção, recusa de serviço, banimento ou chamada às autoridades.
- **Privacidade:** coletar o mínimo necessário; não criar score de clientes, listas negras, reconhecimento facial/biométrico ou rastreamento entre lojas.
- **Fontes confiáveis:** quando tratar de direitos do consumidor ou obrigações legais, usar fontes oficiais e declarar incertezas.

## Escopo técnico planejado

A interface futura poderá usar HTML, CSS e JavaScript, com backend Python. Framework, armazenamento, autenticação e hospedagem ainda precisam ser definidos após a revisão dos requisitos de segurança e privacidade. Não há código de aplicação neste branch.

## Documentos

- `docs/requisitos-produto.md` — público, casos de uso, limites e decisões pendentes.
- `docs/escopo-e-seguranca.md` — regras de tratamento de incidentes, privacidade e salvaguardas.
- `prompts/instrucao-base.md` — comportamento esperado do assistente futuro.
- `docs/roteiro.md` — etapas para validação antes de qualquer implementação.
- `docs/RETOMADA_CHATGPT.md` — estado do repositório e contexto de continuidade.
- `docs/auditoria-rj-2026-11-01.md` — auditoria e fontes das 39 leis do RJ selecionadas.
- `legislacao/` — catálogo de legislação e URLs oficiais.
- `scripts/validate_legislation.py` — validação local dos índices legais.

## Próximo passo

Revisar os casos de uso, as salvaguardas e as decisões pendentes com pessoas responsáveis por operação, segurança, privacidade e aconselhamento jurídico no Brasil. Só depois dessa revisão definir requisitos técnicos detalhados e iniciar o protótipo, usando exclusivamente dados sintéticos durante o desenvolvimento.

## Aviso

O projeto é uma especificação preliminar. Não substitui políticas internas aprovadas, profissionais de segurança, aconselhamento jurídico ou procedimentos de emergência. O sistema futuro deve apoiar decisões humanas justas; não deve determinar culpa ou intenção de consumidores.
