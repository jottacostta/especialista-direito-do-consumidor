# Protótipo local e preparação para Vercel

## O que está implementado

A aplicação é uma consulta somente de leitura, com interface HTML/CSS/JavaScript e API Python. Ela apresenta seis guias temáticos para situações comuns em supermercados: preço e oferta; peso, medida e quantidade; validade e segurança do produto; troca e desistência; práticas comerciais e atendimento; cobrança e pagamentos.

Os textos são resumos editoriais, não transcrições integrais nem pareceres. As referências legais se vinculam à entrada federal da Lei nº 8.078/1990 no catálogo JSONL. A aplicação exige exatamente um registro com jurisdição `federal`, território `BR` e identificador correto; exige status `vigente`, URL oficial HTTPS e data de verificação válida. Se a entrada estiver ausente, duplicada, malformada ou não marcada como vigente, a API não exibe as orientações legais.

A fonte primária usada para organizar os resumos foi o texto atualizado da Lei nº 8.078/1990 publicado pela Câmara dos Deputados [1]. O registro do catálogo continua sendo a fonte de status, URL e data exibidos. O CDC é federal; o protótipo não combina automaticamente normas estaduais/municipais do RJ nem regulamentos setoriais.

## Executar localmente

Requer Python 3.10 ou superior. Não há dependências externas, banco de dados ou chave de API.

Na raiz do repositório:

```bash
python3 -m backend.server
```

Abra `http://127.0.0.1:8000`. Para outra porta:

```bash
python3 -m backend.server --port 8080
```

O servidor de desenvolvimento escuta somente em `127.0.0.1` e não deve ser exposto à rede. Interrompa com `Ctrl+C`.

## Endpoints

`GET /api/health` informa se o registro do CDC e as regras podem ser servidos. `GET /api/rules` devolve as regras, temas e proveniência da entrada do CDC. O endpoint também permite `q` e `category` como parâmetros opcionais; a interface atual baixa o conjunto uma vez e filtra os termos localmente no navegador.

O backend não implementa endpoints de gravação. Métodos de escrita são recusados. A aplicação não persiste consultas nem relatos. O protótipo local suprime logs de requisição.

## Deploy automático Vercel — preparação técnica

A Vercel executa handlers Python em funções e serve os arquivos de `public/` como assets estáticos. O protótipo usa `public/index.html`, `public/styles.css` e `public/app.js` para a interface. `api/rules.py` fornece `GET /api/rules`, e `api/health.py` fornece `GET /api/health`. Cada módulo expõe uma classe `handler` baseada em `BaseHTTPRequestHandler`, formato aceito para funções Python file-based da Vercel [2]. O `backend/server.py` continua servindo apenas a prévia local.

`vercel.json` inclui os índices JSONL e `data/cdc_rules.json` no bundle das funções e define cabeçalhos globais de segurança. O servidor não usa `requirements.txt`, banco de dados, variáveis secretas ou serviços externos. A Vercel documenta o diretório `public/` para assets e a configuração de cabeçalhos e arquivos incluídos [3] [4].

**A publicação ainda não foi ativada.** O conector Vercel disponível nesta sessão não tem nenhum team/workspace associado, e a instalação GitHub autorizada está restrita: o repositório privado não aparece na lista acessível ao Vercel. Portanto, ainda não existe projeto, URL nem deploy. Para destravar, a pessoa responsável precisa conectar um workspace Vercel e dar à integração GitHub acesso ao repositório `jottacostta/especialista-direito-do-consumidor`. A equipe precisa então confirmar a proteção de implantação no workspace. O PR #2 ainda não foi mesclado; nenhuma alteração foi feita em `main`.

A aplicação não tem login próprio. Uma implantação só deve ser chamada de “protegida” depois que o acesso da Vercel estiver configurado e testado com usuários autorizados. O protótipo não coleta incidentes nem dados de clientes, mas isso não equivale a autorização para uso operacional ou produção.

## Referências temáticas

Os guias citam os dispositivos usados como ponto de partida: arts. 4º, 6º, 8º, 18, 19, 26, 30, 31, 35, 39, 42, 49, 51 e 71 do CDC. As telas orientam conferências como correspondência entre produto, etiqueta, oferta e caixa; pesagem e tara; validade, lote e conservação; forma de contratação e política informada; e comprovantes e lançamentos de pagamento.

Os artigos são referências, não uma decisão sobre a incidência da lei em um caso. Por exemplo, o art. 49 diz respeito a contratos fora do estabelecimento comercial; não deve ser generalizado para toda compra presencial. O art. 35 trata das alternativas legais associadas ao descumprimento de oferta, mas sua aplicação depende da oferta e dos fatos. Devolução em dobro, prazos, vícios e exceções também dependem do texto integral e do contexto.

## Segurança, limites e próximos passos

O protótipo não recebe nem registra relatos de incidentes, nomes, identificadores, fotos, vídeos, cartões ou dados sensíveis. Não classifica consumidores, não infere intenção, não produz alertas sobre pessoas, não decide culpa e não determina medidas adversas. As frases sugeridas são exemplos neutros, não roteiros obrigatórios.

O catálogo é seletivo, e a data exibida é a data de verificação gravada no JSONL; ela não se atualiza automaticamente quando a lei muda. Os resumos precisam de revisão profissional jurídica e operacional. O conteúdo não cobre todos os direitos, normas estaduais/municipais, decisões judiciais, atos infralegais, políticas internas ou exceções. Não use o protótipo para negar direitos, cobrar valores ou encerrar reclamações sem revisão humana.

Para validar o código:

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile api/health.py api/rules.py backend/catalog.py backend/http_utils.py backend/server.py scripts/validate_legislation.py
node --check public/app.js
python3 scripts/validate_legislation.py --strict-duplicates
```

[1]: https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html "Lei nº 8.078 de 1990, texto atualizado"
[2]: https://vercel.com/docs/functions/runtimes/python/api-directory "Python Functions in the Vercel API directory"
[3]: https://vercel.com/docs/frameworks/backend/fastapi "Deploy a FastAPI app on Vercel"
[4]: https://vercel.com/docs/project-configuration/vercel-json "Vercel project configuration"
