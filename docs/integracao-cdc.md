# Protótipo local de consulta ao CDC

## O que está implementado

A aplicação é uma consulta local, somente de leitura, com interface em HTML/CSS/JavaScript e API em Python da biblioteca padrão. Ela apresenta seis guias temáticos para situações comuns em supermercados: preço e oferta; peso, medida e quantidade; validade e segurança do produto; troca e desistência; práticas comerciais e atendimento; cobrança e pagamentos.

Os textos dos guias são resumos editoriais, não transcrições integrais nem pareceres. As referências legais se vinculam à entrada federal da Lei nº 8.078/1990 no catálogo JSONL. A aplicação procura exatamente uma entrada com jurisdição `federal`, território `BR` e identificador da Lei nº 8.078/1990; exige status `vigente`, URL oficial HTTPS e data de verificação válida. Se a entrada estiver ausente, duplicada, malformada ou não marcada como vigente, a API não exibe as orientações legais.

A fonte primária consultada para organizar os resumos foi o texto atualizado da Lei nº 8.078/1990 publicado pela Câmara dos Deputados [1]. O registro do catálogo permanece a autoridade para os dados exibidos de título, status, fonte e data de verificação. O CDC é uma lei federal; o protótipo não combina automaticamente normas estaduais/municipais do RJ nem regulamentos setoriais.

## Iniciar no computador

Requer Python 3.10 ou superior e Node.js somente para a verificação de sintaxe JavaScript. A aplicação não instala pacotes Python, não usa banco de dados e não requer chave de API.

Na raiz do repositório:

```bash
python3 -m backend.server
```

Abra `http://127.0.0.1:8000` no navegador. Para escolher outra porta:

```bash
python3 -m backend.server --port 8080
```

O servidor escuta apenas no loopback `127.0.0.1`; não foi projetado para ser acessado pela rede, publicado ou usado em produção. Interrompa com `Ctrl+C`.

## API local

- `GET /api/health` informa se o registro do CDC e as regras editoriais podem ser servidos.
- `GET /api/rules` devolve regras, temas e a proveniência do CDC usada na tela.
- `GET /api/rules?q=pre%C3%A7o` pesquisa texto das regras sem sensibilidade a maiúsculas ou acentos.
- `GET /api/rules?category=Preço%20e%20oferta` filtra um tema.

A interface pesquisa no conjunto carregado pelo navegador. O backend não implementa endpoints de gravação, e métodos de escrita são recusados. O servidor não mantém histórico e desativa logs de requisições, inclusive termos digitados. Não há autenticação porque o protótipo deve ficar restrito ao computador local; isso não é um controle suficiente para publicação ou compartilhamento em rede.

## Referências temáticas

Os resumos citam os dispositivos usados como ponto de partida: arts. 4º, 6º, 8º, 18, 19, 26, 30, 31, 35, 39, 42, 49, 51 e 71 do CDC. As telas orientam conferências como correspondência entre produto, etiqueta, oferta e caixa; pesagem e tara; validade, lote e conservação; forma de contratação e política informada; e comprovantes e lançamentos de pagamento.

Os artigos aparecem como referências, não como decisão sobre a incidência da lei em um caso. Por exemplo, o art. 49 diz respeito a contratos fora do estabelecimento comercial; não deve ser generalizado para toda compra feita presencialmente. O art. 35 trata das alternativas legais associadas ao descumprimento de oferta, mas a aplicação depende da oferta e dos fatos. Devolução em dobro, prazos, vícios e exceções também precisam ser avaliados conforme o texto integral e o contexto.

## Segurança, limites e próximos passos

O protótipo não recebe nem registra relatos de incidentes, nomes, identificadores, fotos, vídeos, cartões ou dados sensíveis. Não classifica consumidores, não infere intenção, não produz alertas sobre pessoas, não decide culpa e não determina medidas adversas. As frases sugeridas são exemplos neutros de comunicação, não roteiros obrigatórios.

O catálogo é seletivo, e a data apresentada é a data de verificação que consta no JSONL; ela não se atualiza automaticamente quando a lei muda. As regras precisam de revisão profissional jurídica e operacional antes de orientar atendimento real. O conteúdo não cobre todos os direitos, normas estaduais/municipais, decisões judiciais, atos infralegais, políticas internas nem exceções. Não usar o protótipo para negar direitos, cobrar valores ou encerrar reclamações sem revisão humana.

Para validar o código localmente:

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile backend/catalog.py backend/server.py scripts/validate_legislation.py
node --check frontend/app.js
python3 scripts/validate_legislation.py --strict-duplicates
```

[1]: https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html "Lei nº 8.078 de 1990, texto atualizado"
