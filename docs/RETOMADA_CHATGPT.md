# Retomada do projeto — para ChatGPT

Atualizado em 2026-11-01. Este documento resume o estado do trabalho e registra que o escopo de produto foi atualizado; nenhuma aplicação foi codificada.

## Objetivo atual

O projeto está sendo especificado como uma aplicação web para apoiar gerentes e supervisores de supermercados na prevenção de perdas, verificação de discrepâncias e documentação de incidentes. A assistência deve se basear em fatos observáveis, processos consistentes e revisão humana. Não deve presumir má-fé, avaliar caráter ou decidir culpa de consumidores.

A stack pretendida é HTML/CSS/JavaScript no frontend e Python no backend. Framework, banco de dados, hospedagem, autenticação e política de retenção seguem pendentes. Nenhum código de aplicação foi iniciado. Ver `docs/requisitos-produto.md`, `docs/escopo-e-seguranca.md` e `prompts/instrucao-base.md`.

## Limites essenciais

Não implementar score individual, perfil por características pessoais, lista negra, reconhecimento facial/biométrico, rastreamento entre lojas, acusação automática, banimento ou recusa de atendimento automatizados. Não recomendar busca pessoal/de pertences, retenção, detenção, força, exposição pública ou discriminação. Verificar primeiro erros de caixa, cadastro, preço, leitura, treinamento, equipamento e processo.

O desenvolvimento inicial deve usar dados sintéticos. Nenhuma informação identificável, imagem, vídeo, biometria, dado sensível, pagamento ou dado de criança deve ser colocada em prompts, testes, exemplos ou logs. Uso futuro de dados reais requer definição e revisão profissional de finalidade, necessidade, acesso, base jurídica, retenção, exclusão e segurança. A especificação não atesta conformidade com a LGPD nem fornece parecer jurídico.

## Catálogo jurídico já realizado

Os 39 atos do RJ no escopo anterior foram auditados com data de corte em 2026-11-01: 25 têm status recomendado `vigente`, 6 `declarada_inconstitucional`, 2 `parcialmente_vigente` e 6 `nao_verificada`. O workflow entregou 38 resultados estruturados. A Lei municipal nº 7.023/2021 teve falha de submissão JSON, mas deixou memorando individual com referências oficiais do Diário Oficial, da Câmara e do TJRJ; o memorando foi revisado, e o registro foi atualizado para `parcialmente_vigente`. Os detalhes estão em `docs/auditoria-rj-2026-11-01.md`.

A deduplicação consolidou 14 grupos e removeu 18 cópias secundárias, preservando tags, fontes e contexto. O catálogo tem 229 registros em 16 arquivos, sem chave repetida por `jurisdiction`, `territory` e `identifier`. O levantamento é seletivo e não exaustivo. `nao_verificada` significa que o status atual não foi confirmado, não que a lei foi revogada.

## Próximos passos

Revisar os requisitos com gerentes, equipes operacionais, atendimento, segurança, privacidade e profissionais jurídicos no Brasil. Aprovar políticas de incidente e salvaguardas antes de escolher frameworks ou começar código. Se houver implementação depois, trabalhar primeiro com dados sintéticos e desenho de segurança revisado.

## GitHub e continuidade

O branch atual é `research/legislacao-consumidor-2026-10-31`; o PR #1 está aberto e em rascunho: https://github.com/jottacostta/especialista-direito-do-consumidor/pull/1. `main` permanece intacta. Antes de continuar, conferir `git status`, fazer `git fetch --all --prune` e verificar o head e checks do PR. Não fazer merge sem autorização explícita da pessoa usuária.

O repositório é privado. A sessão do ChatGPT precisa de autorização no GitHub ou de arquivos fornecidos por canal permitido para ler o conteúdo remoto. O saldo de créditos não é monitorado pelo repositório.
