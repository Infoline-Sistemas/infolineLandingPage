# Arquitetura do projeto

## 1. Objetivo da arquitetura

O projeto precisava atender a dois requisitos que parecem opostos:

1. entregar páginas finais simples, rápidas e fáceis de hospedar em qualquer servidor web;
2. evitar a manutenção manual de dezenas de arquivos HTML repetidos.

A solução adotada foi um **gerador estático próprio e pequeno**:

- a fonte é escrita em módulos JavaScript dentro de `tools/`;
- o build combina conteúdo, layout e componentes;
- o resultado é HTML, CSS e JavaScript puros na raiz;
- o servidor de produção recebe apenas arquivos estáticos.

Não há React, Vue, banco de dados, renderização no servidor ou dependência de Node.js em produção.

## 2. Fonte, geração e publicação

```text
tools/content.mjs ─────────────┐
tools/layout.mjs ──────────────┤
tools/head.mjs ────────────────┤
tools/pages/*.mjs ─────────────┼─> tools/build.mjs ─> *.html + sitemap.xml + robots.txt
assets/css/*.css ──────────────┤
assets/js/*.js ────────────────┤
assets/img/* ──────────────────┘
```

O build não copia CSS e JavaScript porque eles já estão no local público definitivo, `assets/`. Ele gera os HTMLs e atualiza `sitemap.xml` e `robots.txt`.

### Consequência prática

Se alguém editar `crm.html` e depois executar `node tools/build.mjs`, a edição feita no HTML será perdida. A mudança correta deve ser feita em `tools/pages/crm.mjs`, em `tools/content.mjs` ou no CSS/JS correspondente.

## 3. Camadas do projeto

### Conteúdo e configuração institucional

`tools/content.mjs` é a fonte única para:

- dados da empresa;
- grupos do portal;
- nomes, slugs e ícones dos módulos;
- títulos e descrições de SEO;
- textos funcionais;
- FAQs;
- relações comprovadas entre módulos;
- ordem em que os módulos são gerados.

`assets/js/config.js` é a configuração operacional do navegador:

- GTM e GA4;
- Meta Pixel;
- endpoint do formulário;
- e-mail de fallback;
- WhatsApp.

Esses dois arquivos têm responsabilidades diferentes. `content.mjs` participa do build; `config.js` é lido diretamente pelo navegador e pode receber IDs de produção sem regenerar os HTMLs.

### Estrutura compartilhada

`tools/head.mjs` monta metadados, canonical, ícones e dados estruturados.

`tools/layout.mjs` monta elementos presentes em várias páginas:

- cabeçalho;
- mega-menu;
- navegação mobile;
- breadcrumb;
- rodapé;
- CTA móvel;
- botão do WhatsApp.

`tools/lib.mjs` fornece helpers pequenos e seguros para:

- escapar texto antes de inseri-lo no HTML;
- renderizar ícones SVG;
- gerar `<picture>` com AVIF, WebP e `srcset`;
- criar URLs de WhatsApp;
- serializar JSON-LD.

### Templates de página

`tools/pages/` contém as funções que devolvem a página pronta para o build.

Existem três níveis:

1. páginas únicas, como home, soluções, carreiras e privacidade;
2. páginas por segmento, como indústria, importadores e atacado;
3. páginas de módulo, genéricas ou aprofundadas.

### Apresentação

O CSS é dividido por responsabilidade:

- `base.css`: tokens, reset, tipografia, containers e regras globais;
- `components.css`: cabeçalho, botões, cards e componentes reutilizados pelo site todo;
- `module.css`: base histórica das páginas de módulo;
- `module-system.css`: sistema visual dos módulos aprofundados;
- arquivos específicos: apenas a interface particular de cada página.

### Comportamento no navegador

Os arquivos em `assets/js/` usam JavaScript sem framework. Cada arquivo tem uma responsabilidade clara e é carregado com `defer` pelo shell do build.

## 4. Shell comum das páginas

`tools/build.mjs` envolve cada página em um shell único. Esse shell:

- define `lang="pt-BR"`;
- injeta os estilos específicos solicitados pelo template;
- acrescenta atributos de contexto ao `<body>`;
- carrega configuração, tracking, navegação, interações e formulários.

Os atributos do `<body>` são usados por métricas e podem apoiar CSS ou testes:

```html
<body
  data-page-type="module"
  data-module="crm"
  data-solution-group="vendas">
```

## 5. Por que não usar um HTML independente como fonte para cada página

Um conjunto de HTMLs completamente independentes causaria:

- cabeçalhos e rodapés diferentes entre páginas;
- links desatualizados em algum arquivo;
- metadados incompletos;
- correções mobile repetidas;
- alto risco de alterar uma cópia e esquecer outra;
- crescimento descontrolado de código duplicado.

O gerador mantém a publicação simples sem abrir mão de uma fonte organizada.

## 6. Arquivos gerados

São saídas do build:

- todos os `.html` da raiz;
- `sitemap.xml`;
- `robots.txt`.

Eles devem existir no pacote publicado, mas não devem ser tratados como a origem da mudança.

## 7. Diretórios auxiliares

### Pacotes duplicados por segmento

Os antigos diretórios `erp_industria`, `erp_importadores` e `erp_atacado_distribuicao` foram removidos. Eles duplicavam o site completo e não participavam do build nem da publicação. Não devem ser recriados: as páginas de segmento vivem na raiz e compartilham a mesma fonte.

### `.qa-*`, `.shot-*`, `.chrome-*`

São perfis, capturas e resíduos de testes locais. Eles não são referenciados pelo site e não devem ser enviados ao servidor público.

### `tools/source-images/`

Guarda imagens-fonte usadas para produzir variantes otimizadas. Não é necessário em produção, mas deve ser preservado no repositório de manutenção.

## 8. Decisões de longo prazo

- Continuar com saída estática enquanto o site não precisar de conteúdo autenticado ou edição em tempo real.
- Manter `content.mjs` como fonte funcional verificável.
- Extrair para a base comum qualquer padrão usado por três ou mais módulos.
- Evitar dependências externas quando CSS ou JavaScript nativo resolvem o problema com clareza.
- Não transformar os templates em um segundo framework complexo; as abstrações devem continuar pequenas e explícitas.
