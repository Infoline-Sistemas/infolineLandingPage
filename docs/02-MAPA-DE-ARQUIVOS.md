# Mapa de arquivos

Este documento responde a duas perguntas: **onde devo alterar?** e **por que este arquivo existe?**

## 1. Raiz do projeto

| Arquivo ou pasta | Responsabilidade | Editar diretamente? |
|---|---|---|
| `README.md` | entrada para manutenção e documentação | sim |
| `docs/` | documentação técnica e operacional | sim |
| `tools/` | fonte do gerador, conteúdo e testes | sim |
| `assets/` | CSS, JS, ícones e imagens públicas | sim, com cuidado |
| `index.html` | home gerada | não |
| `solucoes.html` | portal de soluções gerado | não |
| `<modulo>.html` | página de módulo gerada | não |
| `erp-para-*.html` | páginas de segmento geradas | não |
| `trabalhe-conosco.html` | página gerada | não |
| `politica-de-privacidade.html` | página gerada | não |
| `sitemap.xml` | mapa de URLs gerado | não |
| `robots.txt` | regras para robôs geradas | não |
| `site.webmanifest` | manifesto e referências de ícones | sim, se necessário |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png` | identidade nos navegadores e dispositivos | substituir preservando uso e formato |
| `.qa-*`, `.shot-*`, `.chrome-*` | saídas e perfis locais de QA | não publicar |

## 2. `tools/`: fonte e geração

### `tools/build.mjs`

Ponto de entrada do build.

Ele:

- importa conteúdo e templates;
- gera todas as páginas da raiz;
- envolve cada página no mesmo shell;
- carrega CSS e JS comuns;
- preenche atributos `data-*` do `<body>`;
- gera `sitemap.xml` e `robots.txt`.

Use:

```powershell
node tools/build.mjs
```

### `tools/content.mjs`

Fonte única do conteúdo estruturado. Contém:

- `site`: dados institucionais e acessos do cliente;
- `groups`: agrupamentos usados no portal;
- `M.<chave>`: definição de cada módulo;
- `moduleOrder`: ordem de geração e navegação;
- `links`: relações comprovadas entre módulos;
- necessidades e conteúdos usados na home.

É o primeiro arquivo a consultar quando a mudança é textual ou funcional.

### `tools/lib.mjs`

Helpers de renderização. Existe para não repetir código e para manter segurança e desempenho.

- `esc()`: escapa texto inserido em HTML;
- `icon()`: referencia símbolos de `assets/img/icons.svg`;
- `logoMark()`: renderiza a marca;
- `pic()`: cria imagens responsivas com AVIF/WebP, dimensões e lazy loading;
- `waLink()`: cria link de WhatsApp;
- `jsonLd()`: serializa dados estruturados.

Texto vindo de conteúdo deve passar por `esc()` quando for colocado em HTML.

### `tools/head.mjs`

Centraliza o `<head>` e dados estruturados:

- título e descrição;
- canonical;
- Open Graph e Twitter Card;
- favicon e manifest;
- CSS global;
- Schema.org de organização, software, FAQ e breadcrumb.

Existe para impedir que uma página fique com SEO ou identidade técnica diferente das demais.

### `tools/layout.mjs`

Centraliza layout global:

- header e barra superior;
- mega-menu e navegação mobile;
- combo de acesso do cliente;
- breadcrumb;
- footer;
- WhatsApp flutuante;
- CTA móvel.

Alterações feitas aqui afetam todo o site após o build.

### `tools/mocks.mjs`

Representações visuais usadas pelos módulos genéricos e por seções históricas. Não representam dados reais. Os módulos aprofundados usam mockups próprios dentro de seus arquivos de página.

### `tools/images.py`

Processa imagens-fonte e produz variantes responsivas em AVIF e WebP. Também mantém coerência com `assets/images.manifest.json`.

Não é executado no carregamento do site. É uma ferramenta de preparação de assets.

### Scripts de consolidação

`consolidate-module-css.mjs` e `generalize-module-system.mjs` foram usados para migrar regras repetidas para a base comum. São ferramentas de manutenção/migração, não são executadas pelo build normal.

Não rode esses scripts automaticamente em produção. Revise o código e o diff antes de reutilizá-los em uma nova migração.

## 3. `tools/pages/`: templates

| Arquivo | Gera ou controla |
|---|---|
| `home.mjs` | `index.html` |
| `solucoes.mjs` | `solucoes.html` e distribuição entre cards ricos/compactos |
| `industry.mjs` | `erp-para-industria.html` |
| `sectors.mjs` | importadores e atacado/distribuição |
| `trabalhe.mjs` | `trabalhe-conosco.html` |
| `privacidade.mjs` | `politica-de-privacidade.html` |
| `module.mjs` | roteador de módulos e template genérico |
| `pcpm.mjs` | página aprofundada do PCPM |
| `wms.mjs` | página aprofundada do WMS |
| `purchases.mjs` | página aprofundada de Compras |
| `costs.mjs` | página aprofundada de Custos |
| `commercial.mjs` | página aprofundada do Comercial |
| `financial.mjs` | página aprofundada do Financeiro |
| `crm.mjs` | página aprofundada do CRM |

`module.mjs` decide se um módulo usa um renderer aprofundado ou o modelo genérico. Ao aprofundar um módulo novo, ele deve ser importado e roteado nesse arquivo.

## 4. `assets/css/`: estilos

### Camada global

| Arquivo | Por que existe |
|---|---|
| `base.css` | tokens, cores, fontes, reset, grid, containers e fundamentos responsivos |
| `components.css` | componentes globais: header, botões, cards, formulários, footer e utilitários |

### Páginas institucionais

| Arquivo | Uso |
|---|---|
| `home.css` | composição exclusiva da landing page |
| `industry.css` | páginas comerciais por segmento |
| `solutions.css` | portal de módulos, previews e cards ricos/compactos |

### Módulos

| Arquivo | Uso |
|---|---|
| `module.css` | estilos gerais/históricos de página de módulo |
| `module-system.css` | base compartilhada dos módulos aprofundados |
| `pcpm.css` | mockups e detalhes exclusivos do PCPM |
| `wms.css` | mockups e detalhes exclusivos do WMS |
| `purchases.css` | mockups e detalhes exclusivos de Compras |
| `costs.css` | mockups e detalhes exclusivos de Custos |
| `commercial.css` | mockups e detalhes exclusivos do Comercial |
| `financial.css` | mockups e detalhes exclusivos do Financeiro |
| `crm.css` | mockups e detalhes exclusivos do CRM |

Se uma regra descreve hero, bento, fluxo, tela, hotspot, situações ou ecossistema de forma genérica, ela pertence a `module-system.css`. Se descreve uma interface do produto — por exemplo `.crm-board` ou `.cost-breakdown` — pertence ao arquivo do módulo.

## 5. `assets/js/`: comportamento

| Arquivo | Responsabilidade |
|---|---|
| `config.js` | IDs de métricas, endpoint de lead, e-mail e WhatsApp |
| `tracking.js` | dataLayer, UTMs/click IDs, eventos e carregamento de GTM/GA4/Meta |
| `navigation.js` | header, mega-menu, menu mobile, acessibilidade de foco e CTA móvel |
| `interactions.js` | reveal, demonstrações da home, ecossistema e fluxo compartilhado dos módulos |
| `forms.js` | validação, envio de lead, fallback por e-mail e formulário de carreira |

Todos são JavaScript nativo e carregados com `defer`.

## 6. `assets/img/`: imagens e ícones

- `icons.svg`: sprite de ícones usado por `icon()`; prefira acrescentar símbolos aqui em vez de duplicar SVG inline.
- `logo-mark.svg`: marca isolada.
- `*-480`, `*-800`, `*-1200`, `*-1600`: variantes responsivas.
- `.avif`: formato mais eficiente para navegadores modernos.
- `.webp`: fallback amplo.

Os nomes-base das imagens são usados em `content.mjs` e passados para `pic()`.

## 7. Testes

### Estrutural

`tools/qa.mjs` percorre todos os HTMLs da raiz e valida referências, metadados e estrutura básica. Deve ser executado após todo build.

### Visual e comportamental

- `browser-qa.mjs`: métricas e screenshot de qualquer página aberta em Chrome com depuração remota;
- `home-qa.mjs`: seções e interações da home;
- `solutions-qa.mjs`: contagem e links do portal;
- `hero-overlap-qa.mjs`: detecta informativos sobrepondo o painel principal;
- `pcpm-qa.mjs`, `commercial-qa.mjs`, `wms-qa.mjs`, `purchases-qa.mjs`, `financial-qa.mjs`, `costs-qa.mjs`, `crm-qa.mjs`: regras específicas de cada módulo aprofundado.

Os testes específicos esperam uma sessão de Chrome aberta com `--remote-debugging-port`.

## 8. Como escolher o arquivo certo

| Mudança desejada | Arquivo inicial |
|---|---|
| telefone, e-mail, endereço, acessos do cliente | `tools/content.mjs` |
| GTM, GA4, Pixel, endpoint ou WhatsApp usado pelo JS | `assets/js/config.js` |
| título/descrição ou conteúdo de módulo | `tools/content.mjs` |
| layout da home | `tools/pages/home.mjs` + `home.css` |
| card do portal de soluções | `tools/pages/solucoes.mjs` + `solutions.css` |
| componente comum dos módulos | `module-system.css` e, se necessário, templates aprofundados |
| painel exclusivo de um módulo | `tools/pages/<modulo>.mjs` + `assets/css/<modulo>.css` |
| menu ou rodapé | `tools/layout.mjs` |
| SEO técnico | `tools/head.mjs` e `tools/content.mjs` |
| animação/interação compartilhada | `assets/js/interactions.js` |
| formulário | `assets/js/forms.js` e `config.js` |
