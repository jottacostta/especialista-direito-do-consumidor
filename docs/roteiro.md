# Roteiro de evolução

Este roteiro é preliminar e não implica que as etapas abaixo já estejam implementadas.

## Etapa 1 — Definição e validação

- Definir público, canais, casos de uso permitidos e fronteiras do produto.
- Obter revisão do escopo e do prompt-base por profissional habilitado no Brasil.
- Especificar como tratar urgência, prazos, documentos e encaminhamentos.

## Etapa 2 — Base de conhecimento verificável

- Selecionar fontes oficiais por tema e registrar URL, órgão, data de consulta e versão.
- Definir processo de revisão e atualização, inclusive para fontes alteradas ou removidas.
- Criar respostas com citações rastreáveis até a fonte, sem depender de memória do modelo.

## Etapa 3 — Protótipo técnico

- Escolher interface e modelo somente depois de definidos privacidade, custo e requisitos de qualidade.
- Implementar recuperação de fontes e separar conteúdo recuperado de instruções do sistema.
- Minimizar dados pessoais em entradas, logs e telemetria; documentar retenção e exclusão.

## Etapa 4 — Avaliação e piloto

- Testar citações, atualidade, perguntas de esclarecimento, incerteza, privacidade e encaminhamentos.
- Avaliar casos adversariais e cenários fora do escopo.
- Fazer piloto limitado, com supervisão humana e mecanismo claro para reportar erros.
- Suspender o uso se houver citações inventadas recorrentes ou falhas de proteção de dados.
