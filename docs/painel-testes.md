# Painel local de testes

O projeto inclui um painel de desenvolvimento separado da aplicação de consulta do CDC. Ele apresenta o resultado de cada caso unittest, sua camada, duração, identificador e traceback completo quando há falha. Também mostra o log original do runner, permite filtrar os resultados e baixar o relatório JSON.

## Iniciar

Na raiz do repositório, execute:

```bash
python3 -m backend.test_dashboard
```

O servidor executa a suíte uma vez ao iniciar e mostra o relatório em `http://127.0.0.1:8765`. Use o botão **Executar novamente** para gerar um relatório atualizado. Para usar outra porta:

```bash
python3 -m backend.test_dashboard --port 8766
```

Encerre com `Ctrl+C`. Não é necessário instalar dependências: o painel usa Python padrão e arquivos HTML/CSS/JavaScript locais.

## Escopo e privacidade

O servidor se vincula exclusivamente a `127.0.0.1`, valida host/origem local, não registra requisições e não persiste o relatório em disco. O relatório fica apenas na memória do processo; o download JSON ocorre somente quando alguém o solicita no navegador. Tracebacks podem conter caminhos locais e mensagens de erro, portanto o painel não serve arquivos do repositório nem se destina à publicação ou compartilhamento em rede.

A interface fica em `tools/test-dashboard/`, fora de `public/`; o servidor principal do CDC e os handlers da Vercel não a incluem no deploy. Ela mostra o resultado da suíte local, não substitui os resultados de CI do GitHub.

## Camadas exibidas

Os testes são agrupados por sua origem: validação unitária do catálogo CDC, integração HTTP da API local e dos handlers Vercel, além dos testes do próprio painel. O filtro de busca aceita nome, módulo, classe ou grupo. O log bruto do `unittest` permanece disponível ao final da página.

## Validação

```bash
python3 -m unittest discover -s tests -v
python3 -m py_compile backend/test_dashboard.py
node --check tools/test-dashboard/app.js
```
