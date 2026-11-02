# Consulta estática ao CDC e GitHub Pages

## Estado e arquitetura

A aplicação é uma consulta somente de leitura em HTML, CSS e JavaScript. O navegador baixa `data/cdc-guide.json` da mesma origem, valida o conteúdo e filtra seis guias localmente. Não há API, backend, banco de dados, login, chave de serviço ou coleta de incidentes. Node.js é usado somente para validar o catálogo, executar testes e montar/pré-visualizar o site; o artefato publicado é estático.

O endereço-alvo do site é `https://jottacostta.github.io/especialista-direito-do-consumidor/`. Ele só deve ser tratado como ativo depois da configuração do GitHub Pages e da confirmação do workflow de deploy. A publicação precisa incluir os arquivos de `public/`, o bundle validado do CDC, o painel em `/testes/` e o relatório JSON. As referências internas são relativas, para funcionar no subcaminho do site de projeto.

O modelo escolhido acompanha a parte estática do [EscalaDominical](https://github.com/jottacostta/EscalaDominical): seu README descreve páginas HTML/CSS/JavaScript publicadas em GitHub Pages, enquanto testes rodam em GitHub Actions. A documentação oficial informa que Pages hospeda conteúdo estático e não executa linguagens server-side como Python. Para um repositório de projeto, o endereço padrão usa `https://<usuário>.github.io/<repositório>/` [2] [3].

## Fonte e bundle legal

A fonte primária usada para organizar os resumos é o texto atualizado da Lei nº 8.078/1990 publicado pela Câmara dos Deputados [1]. O status, a URL e a data exibidos vêm do registro federal dessa lei em `legislacao/indices/02-federal-fundamentais.jsonl`. O CDC é federal; o site não combina automaticamente normas estaduais/municipais do Rio de Janeiro nem regulamentos setoriais.

`npm run build:pages` percorre os índices JSONL usando `scripts/catalog-data.mjs`. O build requer exatamente um registro correspondente à Lei nº 8.078/1990, jurisdição `federal`, território `BR`, status `vigente`, data ISO válida e fonte oficial HTTPS. Valida também os campos e as fontes complementares dos guias. Se houver registro ausente/duplicado, JSON inválido, status não confirmado, URL inválida ou regra incompleta, o build falha e não gera um bundle legal utilizável.

O site mostra seis resumos editoriais: preço e oferta; peso, medida e quantidade; validade e segurança; troca e desistência; atendimento e práticas comerciais; cobrança e pagamentos. Os resumos não são transcrições integrais nem pareceres. Os artigos citados são pontos de partida, não uma conclusão de incidência em um caso. O art. 49, por exemplo, trata de contratos fora do estabelecimento comercial e não deve ser generalizado a todas as compras presenciais. A aplicação não atualiza automaticamente mudanças legais; mostra a data de verificação gravada no catálogo.

## Build, testes e prévia local

Requer Node.js 22 ou superior; não há dependências npm externas.

```bash
npm test
npm run validate:catalog -- --strict-duplicates
npm run build:pages
node scripts/serve-pages.mjs
```

A prévia usa o servidor mínimo `scripts/serve-pages.mjs`, que escuta exclusivamente em `127.0.0.1:4173` e serve os arquivos já montados em `dist/`. Esse servidor não é usado no GitHub Pages e não faz processamento jurídico em tempo de requisição. O workflow do GitHub repete validação, testes e build nos pull requests; em push aprovado em `main`, publica o artefato estático pelo GitHub Actions.

## Limites e privacidade

A aplicação e o relatório do painel são públicos. Não envie para o site, catálogo, issues, commits ou relatório nomes, documentos, imagens, vídeos, pagamentos, biometria, dados sensíveis ou informações de crianças. O painel inclui somente testes sintéticos. O código do navegador não usa armazenamento local, cookies, serviços analíticos ou fontes externas. O serviço GitHub Pages pode registrar o endereço IP do visitante para fins de segurança, conforme sua documentação [2].

A tela não recebe relatos, não classifica consumidores, não infere intenção, não cria alertas sobre pessoas e não decide culpa ou medida adversa. Antes de atribuir causa a uma divergência, confira também caixa, etiqueta, cadastro, balança, equipamento, treinamento e processo da loja. Não use os resumos para negar direitos, cobrar valores ou encerrar reclamações sem revisão humana e profissional.

O catálogo é seletivo. A auditoria anterior cobriu 39 leis do Estado e do Município do Rio de Janeiro; isso não equivale à revisão de toda a legislação aplicável. Os resumos ainda precisam de revisão profissional jurídica e operacional. Não apresentar o protótipo como sistema operacional validado, assessoria jurídica ou garantia de vigência.

## Referências

[1]: https://www2.camara.leg.br/legin/fed/lei/1990/lei-8078-11-setembro-1990-365086-normaatualizada-pl.html "Lei nº 8.078 de 1990, texto atualizado"
[2]: https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages "Sobre GitHub Pages"
[3]: https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site "Criar um site do GitHub Pages"
