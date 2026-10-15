# Build, testes e publicação

## 1. O que é necessário

### Para gerar o site

- Node.js 18 ou superior;
- acesso de escrita à pasta do projeto.

Não é necessário `npm install` para o build atual.

### Para QA visual automatizado

- Node.js 22 ou superior;
- Google Chrome;
- servidor HTTP local;
- uma instância do Chrome com depuração remota.

## 2. Build

Na raiz do projeto:

```powershell
Set-Location C:\infolinenovositev4
node tools/build.mjs
```

O comando deve terminar informando a quantidade de páginas geradas.

Ele sobrescreve:

- HTMLs da raiz;
- `sitemap.xml`;
- `robots.txt`.

Por isso alterações nesses arquivos precisam existir nos templates antes do build.

## 3. QA estrutural obrigatório

```powershell
node tools/qa.mjs
```

O resultado esperado é semelhante a:

```text
QA ok: 21 páginas, metadados e referências locais validados.
```

O número pode crescer quando novas páginas forem adicionadas. Não fixe a documentação à contagem atual como se ela fosse permanente.

## 4. Servidor de pré-visualização

Uma opção simples, caso Python esteja instalado:

```powershell
Set-Location C:\infolinenovositev4
python -m http.server 4175 --bind 0.0.0.0
```

Acesse:

```text
http://127.0.0.1:4175/
```

Para outro dispositivo na mesma rede:

```text
http://IPV4-DO-COMPUTADOR:4175/
```

O firewall do Windows precisa permitir a porta e os dispositivos precisam estar na mesma rede.

## 5. QA visual manual

Confira ao menos estas larguras:

- desktop amplo: aproximadamente 1440 px;
- notebook/tablet: aproximadamente 1024 px;
- mobile: 390 a 500 px.

Em cada página relevante, confirme:

- header e navegação;
- quebra do H1;
- CTA visível;
- hero sem elementos cobrindo a tela ilustrativa;
- cards sem corte;
- fluxo utilizável por mouse e teclado;
- tela com scroll interno no mobile, quando necessário;
- hotspots legíveis;
- links do ecossistema;
- FAQ;
- botão flutuante e barra móvel;
- ausência de rolagem horizontal da página.

## 6. Chrome com depuração remota

Exemplo para PCPM:

```powershell
$chrome = 'C:\Program Files\Google\Chrome\Application\chrome.exe'

Start-Process -FilePath $chrome `
  -ArgumentList @(
    '--headless=new',
    '--remote-debugging-port=9224',
    '--user-data-dir=C:\temp\infoline-qa-pcpm',
    '--window-size=1440,1200',
    'http://127.0.0.1:4175/pcpm.html'
  ) `
  -WindowStyle Hidden
```

Depois:

```powershell
node tools/pcpm-qa.mjs 9224
node tools/browser-qa.mjs 9224 pcpm 0 0 C:\temp\pcpm-desktop.png
node tools/browser-qa.mjs 9224 pcpm 500 900 C:\temp\pcpm-mobile.png
```

Use uma porta e uma pasta de perfil diferentes para cada sessão simultânea.

## 7. Testes disponíveis

| Script | Uso principal |
|---|---|
| `qa.mjs` | todos os HTMLs, metadados e referências |
| `factual-qa.mjs` | taxonomia, nomenclaturas, integrações e números aprovados |
| `architecture-qa.mjs` | 21 páginas, 13 `customRenderers` e dependências compartilhadas essenciais |
| `orphans-qa.mjs` | classificação conservadora dos assets em usado, indireto, candidato e incerto |
| `accessibility-qa.mjs` | menus, formulários, ARIA, foco, FAQ e fluxos dos módulos |
| `module-system-qa.mjs` | estrutura compartilhada e interação dos 13 módulos premium |
| `browser-matrix-qa.mjs` | matriz responsiva completa, overflow, cortes, colisões e imagens quebradas |
| `seo-qa.mjs` | metadata, canonical, schemas, sitemap e robots |
| `tracking-qa.mjs` | eventos, labels, formulários e ausência de PII |
| `assets-qa.mjs` | referências locais, manifest, favicons e sprite de ícones |
| `performance-qa.mjs` | baseline de HTML, CSS, JavaScript e requisições |
| `browser-qa.mjs` | viewport, overflow, grid e captura |
| `home-qa.mjs` | estrutura e interações da home |
| `solutions-qa.mjs` | cards, áreas e links do portal |
| `hero-overlap-qa.mjs` | colisões entre painel e informativos |
| `pcpm-qa.mjs` | PCPM aprofundado |
| `commercial-qa.mjs` | Comercial aprofundado |
| `wms-qa.mjs` | WMS aprofundado |
| `purchases-qa.mjs` | Compras aprofundado |
| `financial-qa.mjs` | Financeiro aprofundado |
| `costs-qa.mjs` | Custos aprofundado |
| `crm-qa.mjs` | CRM aprofundado |

## 8. O que deve ser publicado

O servidor público precisa somente dos arquivos executados pelo navegador:

```text
*.html
assets/
favicon.svg
favicon-32.png
apple-touch-icon.png
icon-192.png
site.webmanifest
sitemap.xml
robots.txt
```

Se o servidor já possui arquivos de configuração, como `.htaccess`, regras de redirecionamento ou validações de domínio, preserve-os e revise-os separadamente.

## 9. O que não deve ser publicado

```text
tools/
docs/
README.md
.qa-*/
.shot-*/
.chrome-*/
tools/source-images/
```

Manter `tools/` e `docs/` fora do document root reduz exposição desnecessária. Eles devem permanecer no repositório interno ou backup de manutenção.

## 10. Estratégia segura de publicação

1. faça backup recuperável da versão pública atual;
2. gere o site localmente;
3. execute QA estrutural e visual;
4. publique primeiro em homologação ou subdomínio protegido;
5. valide canonical, formulários, métricas e links externos;
6. prepare os redirecionamentos das URLs antigas;
7. envie o conjunto público para uma nova pasta de release;
8. altere o document root ou faça a troca de release de forma atômica, se a hospedagem permitir;
9. valide produção em janela anônima e no celular;
10. mantenha o backup até confirmar indexação, leads e métricas.

Evite apagar a versão atual antes de a nova estar validada e recuperável.

## 11. Cache

Os nomes dos CSS e JS são estáveis. Se a hospedagem ou CDN usar cache longo, uma atualização pode demorar a aparecer.

Recomendações:

- HTML: cache curto ou revalidação;
- CSS/JS/imagens: cache moderado enquanto não houver nomes versionados;
- após publicação: invalide o cache da CDN/proxy;
- teste em janela anônima;
- se o projeto passar a usar cache imutável, implemente fingerprint/hash de assets no build.

Não use apenas `?v=` manual em alguns links; isso tende a ficar inconsistente. Se versionamento for necessário, automatize no gerador.

## 12. Validação pós-publicação

- home responde por HTTPS;
- todos os HTMLs principais retornam 200;
- imagens e `icons.svg` carregam;
- menu desktop e mobile funcionam;
- links “Sou cliente” apontam para os sistemas corretos;
- WhatsApp abre o número correto;
- formulário envia ao endpoint ou informa claramente o fallback;
- GTM/GA4/Meta aparecem somente se configurados;
- canonical usa o domínio final;
- `robots.txt` e `sitemap.xml` estão acessíveis;
- URLs antigas importantes redirecionam com 301;
- não há recursos mistos HTTP em páginas HTTPS;
- console do navegador não apresenta erros relevantes.

## 13. Rollback

Antes da troca, registre:

- caminho da versão anterior;
- data e responsável pela publicação;
- configuração do servidor preservada;
- forma de restaurar o document root ou pacote anterior.

Se uma falha crítica aparecer — formulário indisponível, páginas 404, acesso do cliente incorreto ou perda de tracking — restaure a release anterior e investigue fora de produção.
