# Guia de produção — Site Infoline V4

Este documento orienta uma pessoa ou IA responsável por colocar o novo site institucional da Infoline em produção, substituindo com segurança o site que já existe.

## Hospedagem confirmada neste repositório

O domínio `infolinesystems.com.br` usa GitHub Pages, com publicação da raiz da branch `main` do repositório `Infoline-Sistemas/infolineLandingPage`. `CNAME` foi preservado. `_config.yml` exclui fontes, documentação, dependências e arquivos antigos do site da publicação. Não crie `.nojekyll` na raiz, pois ele desativa essas exclusões; o pacote isolado de `npm run package` pode utilizá-lo.

A integração V4 deve permanecer em branch nova baseada na `main` até a aprovação da entrega. A política `politicadeprivacidade.html` continua acessível, com conteúdo e canonical da nova política. Preserve `charlotte-paes-privacidade.html` e `tattooflow/`, presentes na `main` para aplicativos publicados.

O Web3Forms existente continua atendendo o formulário de demonstração. Não é necessário criar um endpoint próprio para preservar esse fluxo. IDs de métricas seguem vazios; cookies opcionais são controlados pelo banner e Consent Mode v2. Veja [a configuração específica e os testes](docs/11-INTEGRACAO-GITHUB-PAGES.md).

> Este guia não presume nenhum caminho absoluto. O diretório usado no desenvolvimento original não é o caminho do servidor de produção.
>
> Antes de qualquer operação, identificar e registrar separadamente `SOURCE_ROOT`, `PUBLIC_ROOT` e `RELEASE_DIR`. Não utilizar, copiar ou sobrescrever outro projeto.

Definições usadas neste documento:

- `SOURCE_ROOT`: cópia de trabalho que contém este arquivo, `tools/build.mjs` e `assets/`;
- `PUBLIC_ROOT`: document root atualmente servido pelo domínio oficial, descoberto na hospedagem;
- `RELEASE_DIR`: nova pasta isolada que receberá somente o pacote público antes da troca.

Esses três caminhos podem ser diferentes. Nunca inferir `PUBLIC_ROOT` a partir do caminho usado no desenvolvimento.

## 1. Objetivo e estado do projeto

O site é estático e utiliza somente HTML, CSS e JavaScript no navegador. Não exige Node.js, banco de dados, CMS ou framework no servidor público. Node.js é necessário apenas no ambiente de manutenção para gerar novamente os 20 HTMLs, o `sitemap.xml` e o `robots.txt`.

Páginas existentes:

- `index.html`;
- `erp-para-industria.html`, `erp-para-importadores.html` e `erp-para-atacado-distribuicao.html`;
- `pcpm.html`, `wms.html`, `compras.html` e `custos.html`;
- `comercial.html`, `crm.html` e `ecommerce.html`;
- `financeiro.html`, `contabilidade.html`, `controladoria.html`, `rh.html` e `gestao-processos.html`;
- `integracao-whatsapp.html`, `solucoes.html`, `trabalhe-conosco.html` e `politica-de-privacidade.html`.

## 2. Regras obrigatórias para qualquer IA

1. Localizar `SOURCE_ROOT` pela presença conjunta de `README-PRODUCAO.md`, `tools/build.mjs`, `tools/content.mjs` e `assets/`.
2. Resolver o caminho absoluto de `SOURCE_ROOT` e confirmar esses marcadores antes de escrever qualquer arquivo.
3. Descobrir `PUBLIC_ROOT` na configuração real da hospedagem; nunca adivinhar esse caminho.
4. Criar `RELEASE_DIR` fora de `PUBLIC_ROOT` ou como release isolada, conforme a hospedagem.
5. Não usar nem modificar outro projeto, pasta ou versão do site.
6. Não reconstruir o site do zero.
7. Não editar os HTMLs da raiz como fonte permanente. Eles são gerados e serão sobrescritos pelo build.
8. Alterar templates em `tools/pages/`, conteúdo em `tools/content.mjs` e estilos em `assets/css/`.
9. Manter `assets/css/module-system.css` como base compartilhada dos módulos premium.
10. Não duplicar a estrutura compartilhada nos CSSs específicos dos módulos.
11. Não inventar funcionalidades do ERP. `tools/content.mjs` é a principal referência factual.
12. Preservar URLs, identidade visual, acessibilidade, SEO, tracking e responsividade já validados.
13. Não apagar, limpar, mover ou sobrescrever `PUBLIC_ROOT` durante a preparação.
14. Não executar comandos destrutivos, recursivos ou de sincronização com exclusão antes de validar o caminho exato, realizar backup e obter autorização explícita.
15. Não substituir configurações do servidor sem inventariá-las e incluí-las no backup.
16. Não executar a troca definitiva sem backup recuperável e plano de rollback.

## 3. Mapa essencial dos arquivos

```text
infolinenovositev4/
├── assets/
│   ├── css/                 estilos públicos
│   ├── img/                 ícones e imagens públicas otimizadas
│   ├── js/
│   │   ├── config.js        IDs de métricas, endpoint e contatos
│   │   ├── tracking.js      eventos, UTMs, GTM/GA4 e Meta Pixel
│   │   ├── navigation.js    menus e navegação
│   │   ├── interactions.js  componentes interativos
│   │   └── forms.js         formulários e leads
│   └── images.manifest.json pipeline das imagens ativas
├── docs/                    documentação interna; não publicar
├── tools/
│   ├── build.mjs            gera o site público
│   ├── content.mjs          conteúdo factual central
│   ├── pages/               templates das páginas
│   ├── source-images/       imagens-fonte; não publicar
│   └── *-qa.mjs             testes automatizados
├── *.html                   páginas públicas geradas
├── sitemap.xml              gerado pelo build
├── robots.txt               gerado pelo build
└── manifest, favicons e ícones
```

Leia também `docs/01-ARQUITETURA.md`, `docs/02-MAPA-DE-ARQUIVOS.md`, `docs/06-BUILD-TESTES-E-PUBLICACAO.md` e `docs/08-MIGRACAO-DO-SITE-ATUAL.md`.

## 4. Levantamento antes de alterar produção

Não começar enviando arquivos. Primeiro registrar:

- provedor, painel e método de acesso da hospedagem;
- caminho atual do document root e tipo de servidor (Apache, Nginx, IIS ou outro);
- `.htaccess`, configuração do servidor, redirects e cabeçalhos atuais;
- CDN, proxy, regras de cache, certificado HTTPS, DNS e subdomínios;
- URLs atualmente indexadas;
- IDs atuais de GTM, GA4, Google Ads e Meta Pixel;
- verificações do Search Console/Bing;
- funcionamento e destino atual dos formulários;
- outros arquivos ou aplicações na mesma hospedagem;
- procedimento de backup e restauração.

Não modificar a infraestrutura dos sistemas ERP:

```text
https://erp.infolinesystems.app.br/InfolineV3.1/#/login
https://erp.infoline.app.br/InfolineV3/#/login
```

## 5. Integrações, métricas e anúncios

`assets/js/config.js` é o ponto único de configuração pública:

```javascript
window.INFOLINE_CONFIG = {
  gtmId: '',
  ga4Id: '',
  googleAdsId: '',
  metaPixelId: '',
  leadEndpoint: '',
  leadCcEmail: 'comercial@infolinesystems.com.br',
  whatsapp: '5541988538135',
};
```

- IDs vazios significam que nenhum dado é enviado a plataformas externas.
- Recomenda-se preencher `gtmId` e gerenciar GA4 e Google Ads pelo Google Tag Manager.
- No GTM, configurar GA4, Conversion Linker e conversões relevantes.
- `googleAdsId` está reservado, mas não inicializa Google Ads diretamente no código atual.
- Google AdSense não faz parte do projeto e não deve ser instalado sem decisão comercial expressa.
- Não ativar tags de marketing antes de definir consentimento, Consent Mode v2 e atualizar a política de privacidade.

Eventos disponíveis:

```text
page_view
module_view
solution_view
navigation_click
cta_click
whatsapp_click
solution_portal_click
form_start
form_submit
demo_request
lead_handoff
generate_lead
```

Para conversão confirmada de formulário, preferir `generate_lead`. `form_submit` representa somente uma tentativa válida.

Enquanto `leadEndpoint` estiver vazio, o formulário usa fallback por e-mail. Antes da produção definitiva, configurar e testar um endpoint HTTPS que aceite `POST` JSON, valide dados, restrinja CORS, proteja contra abuso e respeite a LGPD.

Nunca inserir tokens privados, senhas ou segredos em `config.js`, pois ele é público.

## 6. Build obrigatório

Pré-requisito: Node.js 18 ou superior. Não é necessário `npm install`.

```powershell
$SOURCE_ROOT = (Resolve-Path '.').Path
if (-not (Test-Path -LiteralPath (Join-Path $SOURCE_ROOT 'README-PRODUCAO.md')) -or
    -not (Test-Path -LiteralPath (Join-Path $SOURCE_ROOT 'tools\build.mjs')) -or
    -not (Test-Path -LiteralPath (Join-Path $SOURCE_ROOT 'assets'))) {
  throw 'Diretório atual não é uma SOURCE_ROOT válida.'
}
Set-Location -LiteralPath $SOURCE_ROOT
node tools/build.mjs
```

O build sobrescreve os HTMLs da raiz, o `sitemap.xml` e o `robots.txt`. Se uma mudança desaparecer após esse comando, ela foi feita no arquivo gerado em vez da fonte correta.

## 7. QA obrigatório

```powershell
node tools/qa.mjs
node tools/assets-qa.mjs
node tools/orphans-qa.mjs
node tools/architecture-qa.mjs
node tools/factual-qa.mjs
node tools/seo-qa.mjs
node tools/tracking-qa.mjs
node tools/performance-qa.mjs
```

Não publicar se algum comando falhar. Quando houver Chrome e CDP configurados, executar também os QAs de acessibilidade, sistema de módulos e matriz responsiva documentados em `docs/06-BUILD-TESTES-E-PUBLICACAO.md`.

Fazer inspeção manual em aproximadamente 1440 px, 1024 px e 390 px. Confirmar ausência de overflow global, sobreposições, cards cortados e falhas no menu mobile.

## 8. Pré-visualização local

```powershell
# Execute a partir da SOURCE_ROOT já validada na etapa de build.
python -m http.server 4175 --bind 0.0.0.0
```

Usar `http://127.0.0.1:4175/` na própria máquina ou `http://IP-LOCAL:4175/` na rede. Isso é somente teste local, não hospedagem de produção.

## 9. O que publicar

Publicar no document root somente:

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

Adicionar separadamente somente configurações do servidor e redirects aprovados.

## 10. O que não publicar

```text
tools/
docs/
README.md
README-PRODUCAO.md
tools/source-images/
backups/
.qa-*/
.shot-*/
.chrome-*/
```

Esses arquivos devem permanecer no repositório ou backup interno de manutenção.

## 11. Redirects e SEO

Antes da troca, mapear cada URL antiga para um destino novo coerente e usar HTTP 301 quando houver equivalente. Não redirecionar indiscriminadamente tudo para a home.

Verificar domínio HTTPS em `tools/content.mjs`, canonicals, `robots.txt`, `sitemap.xml`, Search Console, ausência de URLs de homologação e ausência de recursos HTTP em páginas HTTPS.

## 12. Estratégia segura de publicação

1. Congelar alterações paralelas.
2. Fazer backup integral e recuperável do site atual, inclusive arquivos ocultos e configuração do servidor.
3. Registrar como restaurar o backup.
4. Gerar o site e executar todos os QAs.
5. Publicar primeiro em homologação protegida.
6. Testar formulários, métricas, WhatsApp, “Sou cliente”, redirects e responsividade.
7. Enviar os arquivos públicos para uma nova pasta de release.
8. Aplicar configurações e redirects aprovados.
9. Trocar document root ou symlink de forma atômica, quando possível.
10. Invalidar cache de CDN/proxy.
11. Validar em janela anônima, desktop e celular.
12. Manter a release anterior intacta até a estabilização.

Se a hospedagem só permitir sobrescrever arquivos, fazer isso em horário de menor tráfego e manter o pacote anterior pronto para restauração.

## 13. Servidor recomendado

- HTTPS obrigatório com redirecionamento de HTTP;
- Brotli ou gzip para HTML, CSS, JS, SVG e JSON;
- HTML com cache curto/revalidação;
- CSS, JS e imagens com cache moderado, pois os nomes não usam hash;
- tipos MIME corretos para SVG, WebP, AVIF, webmanifest e XML;
- listagem de diretório desativada;
- cabeçalhos de segurança avaliados sem quebrar GTM, fontes ou formulários.

Não inventar `.htaccess` ou configuração Nginx sem identificar o servidor real.

## 14. Checklist pós-publicação

- [ ] Home e as 20 páginas respondem com HTTP 200 por HTTPS.
- [ ] CSS, JavaScript, imagens e `assets/img/icons.svg` carregam.
- [ ] Console sem erros relevantes.
- [ ] Menu desktop/mobile, FAQ e componentes interativos funcionam.
- [ ] Não existe rolagem horizontal global no mobile.
- [ ] “Sou cliente” abre corretamente V3.1 e V3.
- [ ] WhatsApp utiliza o número correto.
- [ ] Formulário testado de ponta a ponta com lead controlado.
- [ ] GTM/GA4 carregam somente com IDs e consentimento configurados.
- [ ] Eventos aparecem no Preview/DebugView.
- [ ] Conversões do Google Ads usam os eventos corretos.
- [ ] Nenhum dado pessoal é enviado ao `dataLayer`.
- [ ] Canonicals usam `https://infolinesystems.com.br`.
- [ ] `robots.txt`, `sitemap.xml` e redirects 301 funcionam.
- [ ] Sitemap enviado ao Search Console.
- [ ] Cache/CDN invalidado e logs sem aumento de 404/500.

## 15. Rollback

Restaurar a release anterior em caso de indisponibilidade, assets quebrados, perda de formulário, links do ERP incorretos, excesso de 404, falha HTTPS ou métricas/leads enviados ao destino errado.

O rollback deve restaurar a release anterior completa e suas configurações, não uma mistura parcial de arquivos.

## 16. Registro da publicação

```text
Data e horário:
Responsável técnico ou IA:
Hospedagem e document root:
Release publicada:
Local do backup anterior:
Procedimento de rollback testado:
Configuração do servidor preservada:
Redirects aplicados:
Endpoint de leads validado:
GTM/GA4/Google Ads validados:
Search Console atualizado:
Problemas encontrados:
Ações pendentes:
```

## 17. Critério de conclusão

A publicação só está concluída quando o site funciona por HTTPS em desktop e mobile, os acessos ao ERP permanecem corretos, leads e métricas foram validados, redirects e SEO foram conferidos, existe rollback funcional e o código-fonte completo ficou guardado fora do document root.
