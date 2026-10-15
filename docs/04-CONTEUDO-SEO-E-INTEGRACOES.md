# Conteúdo, SEO e integrações

## 1. Princípio editorial

O site deve comunicar o produto real. A regra registrada em `tools/content.mjs` é:

> Nada pode ser inventado; cada afirmação precisa ter origem verificável no site anterior, nos arquivos do projeto, em documentação do ERP ou em confirmação da equipe Infoline.

Uma interface ilustrativa pode usar nomes e valores fictícios para demonstrar uma situação, mas a capacidade que ela representa precisa existir no produto.

## 2. Onde atualizar dados institucionais

No início de `tools/content.mjs`, o objeto `site` contém:

- nome e razão social;
- domínio oficial;
- ano de fundação;
- cobertura geográfica;
- telefone e WhatsApp;
- e-mail;
- cidade e estado;
- links de acesso às versões do ERP;
- `buildDate` e ano do copyright.

### Campos duplicados por finalidade

Alguns dados aparecem em mais de um formato:

- `phone`: formato legível internacional;
- `phoneDisplay`: formato exibido;
- `tel`: formato usado em `tel:`;
- `whatsapp`: apenas dígitos no padrão E.164;
- `whatsappDisplay`: formato humano.

Atualize todos os formatos relacionados para não deixar rodapé, link e Schema.org inconsistentes.

`assets/js/config.js` também possui `whatsapp` e `leadCcEmail`, porque esses valores são usados pelo JavaScript do navegador. Ao alterar contato comercial, revise os dois arquivos.

## 3. Modelo de um módulo

Cada entrada `M.<chave>` em `content.mjs` possui campos como:

| Campo | Finalidade |
|---|---|
| `key` | identificador interno estável |
| `slug` | nome do arquivo/URL |
| `name` | nome completo |
| `navName` | nome curto na navegação, quando necessário |
| `icon` | símbolo existente em `icons.svg` |
| `group` | agrupamento do portal |
| `short` | resumo geral |
| `needShort` | resumo orientado à necessidade |
| `kicker` | identificação curta do hero |
| `seoTitle` | `<title>` da página |
| `seoDesc` | meta description |
| `h1` | título principal do módulo genérico |
| `lead` | introdução |
| `overview` | explicação mais aprofundada |
| `features` | capacidades comprovadas |
| `groups` | catálogo funcional por tema |
| `photo` | imagem, proporção e texto alternativo |
| `action` | demonstração do funcionamento |
| `faq` | perguntas e respostas visíveis e em JSON-LD |
| `cta` | chamada final |

Os módulos aprofundados podem substituir a redação visual de algumas seções dentro de `tools/pages/<modulo>.mjs`, mas devem continuar usando metadados e FAQ de `content.mjs` sempre que possível.

## 4. Como escrever o conteúdo

### Home

A home responde “o que eu ganho?” e “qual realidade se parece com a minha?”. Evite transformá-la em catálogo técnico.

### Página por segmento

Explica como o ERP atende uma realidade: indústria, importação ou atacado/distribuição. Pode combinar módulos, mas não deve prometer especialização que o produto não sustenta.

### Portal de soluções

Ajuda o visitante a escolher uma área. Cards ricos representam módulos já aprofundados; cards compactos mantêm acesso aos demais sem fingir que todos estão no mesmo estágio visual.

### Página de módulo

Responde “como o Infoline faz?”. Aqui entram termos funcionais, telas ilustrativas, fluxos e relações com outras áreas.

## 5. SEO por página

`tools/head.mjs` gera automaticamente:

- `<title>`;
- meta description;
- robots;
- canonical;
- Open Graph;
- Twitter Card;
- ícones;
- JSON-LD solicitado pelo template.

### Regras para títulos

- descreva claramente a solução;
- inclua “Infoline” quando fizer sentido comercial;
- evite títulos idênticos;
- mantenha o assunto principal no começo;
- não use uma lista longa de palavras-chave.

### Regras para descrições

- explique benefício e escopo;
- use linguagem natural;
- não prometa recursos ausentes;
- evite repetir a mesma descrição em módulos diferentes.

### Canonical e domínio

O canonical é montado a partir de `site.url` e do caminho da página. Antes de publicar em um domínio diferente, ajuste `site.url` e execute o build.

## 6. Dados estruturados

O projeto pode gerar:

- `Organization` para a empresa;
- `SoftwareApplication` para o ERP;
- `FAQPage` para FAQs;
- `BreadcrumbList` para navegação hierárquica.

Não insira endereço completo, redes sociais ou outros dados em Schema.org sem confirmação.

As FAQs visíveis e o `FAQPage` vêm da mesma matriz em `content.mjs`; isso reduz divergência entre conteúdo humano e estruturado.

## 7. Sitemap e data de atualização

`tools/build.mjs` gera `sitemap.xml` com todas as páginas produzidas.

O campo `<lastmod>` usa `site.buildDate`. Portanto, antes de uma publicação relevante:

1. atualize `site.buildDate` no formato `AAAA-MM-DD`;
2. confirme `site.year` para o rodapé;
3. execute o build;
4. confira `sitemap.xml`.

## 8. Relações entre módulos

As ligações do ecossistema são definidas em `links` dentro de `tools/content.mjs`.

Formato:

```js
['crm', 'comercial', 'Relacionamento conectado ao comercial']
```

`relatedOf(key)` lê essas relações nos dois sentidos e evita duplicações.

### Regra de inclusão

Uma conexão só deve ser adicionada quando houver base funcional real. Não conecte todos os módulos apenas para deixar o desenho cheio.

Exemplos comprovados atualmente:

- PCPM gera necessidade para Compras;
- Compras atualiza WMS e gera impacto financeiro;
- Comercial conecta pedido a WMS, Financeiro e Contábil/Fiscal;
- Custos conecta estrutura produtiva, formação de preço e Controladoria;
- CRM conecta relacionamento ao Comercial e workflows a Processos;
- E-commerce conecta pedidos ao Comercial, consulta de estoque ao WMS e repasses ao Financeiro.

### Direção da frase

O terceiro campo deve explicar a informação compartilhada, não apenas repetir “integração”. Prefira:

```text
Necessidade de materiais
Entrada de materiais atualiza o estoque
Relacionamento conectado ao comercial
```

Evite:

```text
Integra com Compras
Módulos conectados
Integração total
```

## 9. Imagens e texto alternativo

As referências de imagens em `content.mjs` incluem:

- nome-base;
- proporção original;
- larguras disponíveis;
- texto alternativo.

O texto alternativo deve descrever o que a imagem comunica, sem começar com “imagem de”. Imagens puramente decorativas podem usar outra estratégia, mas fotos de contexto devem ter `alt` útil.

Ao substituir uma imagem:

1. preserve ou atualize a proporção;
2. gere todas as larguras necessárias;
3. gere AVIF e WebP;
4. atualize o manifest;
5. revise o recorte no desktop e no mobile;
6. atualize o `alt` se a cena mudou.

## 10. Conteúdo de telas ilustrativas

Os painéis do site são representações, não capturas literais do ERP. Eles devem:

- usar situações plausíveis;
- declarar que os dados são ilustrativos;
- evitar nomes de clientes reais;
- evitar valores confidenciais;
- representar somente rotinas existentes;
- privilegiar legibilidade comercial sobre reprodução pixel a pixel do sistema.

## 11. Revisão antes de publicar conteúdo

- O benefício está claro antes da lista técnica?
- A capacidade existe no produto?
- O termo usado é compreensível para o público?
- O mesmo conceito usa o mesmo nome em todas as páginas?
- Título, descrição, H1 e texto da página estão coerentes?
- As integrações exibidas são reais?
- Nomes e valores do mockup são fictícios?
- A data do sitemap foi atualizada?
- O build e o QA foram executados?
