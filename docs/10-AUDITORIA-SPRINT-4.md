# Auditoria de arquitetura e regressão final — Sprint 4

Data da auditoria: **01/10/2026**.

Escopo: projeto oficial `C:\infolinenovositev4`, sem uso ou comparação com qualquer V5.

## 1. Resultado

A arquitetura existente foi preservada. O site continua sendo gerado por `tools/build.mjs`, com conteúdo em `tools/content.mjs`, layout compartilhado em `tools/layout.mjs`, renderers em `tools/pages/`, 13 módulos registrados em `customRenderers` e base visual em `assets/css/module-system.css`.

Não houve redesign, alteração de copy, números, integrações, nomenclaturas, CTAs, breadcrumbs, SEO, tracking, ARIA, formulários ou comportamento responsivo. Os 20 HTMLs, `sitemap.xml` e `robots.txt` foram reproduzidos com o mesmo SHA-256 da baseline anterior à limpeza.

## 2. Código morto removido

### Imports estáticos

Foram removidos quatro identificadores importados que não possuíam leitura fora da própria declaração:

| Arquivo | Removido | Evidência |
|---|---|---|
| `tools/build.mjs` | `mkdirSync`, `existsSync` | busca no arquivo encontrou somente a linha de import; build e sintaxe passaram após a remoção |
| `tools/pages/home.mjs` | `heroMock` | busca no arquivo encontrou somente a linha de import; a home utiliza `heroPanel` e `demoScreen` |
| `tools/pages/trabalhe.mjs` | `esc` | busca no arquivo encontrou somente a linha de import; a página utiliza `icon` |

### CSS sem efeito

Foram removidas sete media queries vazias, sem selector e sem declaração:

- `assets/css/commercial.css`;
- `assets/css/costs.css`;
- `assets/css/crm.css`;
- `assets/css/ecommerce.css`;
- `assets/css/financial.css`;
- `assets/css/purchases.css`;
- `assets/css/wms.css`.

Essas remoções reduziram o CSS de **253.029** para **252.740 bytes**. O comportamento de movimento reduzido permanece centralizado nas regras compartilhadas reais de `base.css`, `components.css` e `module-system.css`.

### Assets comprovadamente órfãos

Foram removidas 16 variantes de imagem, em dois lotes. As buscas cobriram os 20 HTMLs, CSS, JavaScript, `.mjs`, conteúdo, renderers, home, Portal Soluções, páginas setoriais, manifest e pipeline de imagens. As famílias apareciam somente como jobs antigos de `tools/images.py` e entradas de `assets/images.manifest.json`; ambos foram atualizados para impedir regeneração.

| Família | Arquivos | Bytes removidos |
|---|---:|---:|
| `hero-operacao-*` e `hero-operacao-m-*` | 12 | 392.731 |
| `mod-logistica-*` | 4 | 166.669 |
| **Total** | **16** | **559.400** |

Arquivos removidos:

- `assets/img/hero-operacao-480.avif` — 12.102 bytes;
- `assets/img/hero-operacao-480.webp` — 16.894 bytes;
- `assets/img/hero-operacao-800.avif` — 20.532 bytes;
- `assets/img/hero-operacao-800.webp` — 30.944 bytes;
- `assets/img/hero-operacao-1200.avif` — 30.617 bytes;
- `assets/img/hero-operacao-1200.webp` — 50.014 bytes;
- `assets/img/hero-operacao-1600.avif` — 40.193 bytes;
- `assets/img/hero-operacao-1600.webp` — 69.150 bytes;
- `assets/img/hero-operacao-m-480.avif` — 18.273 bytes;
- `assets/img/hero-operacao-m-480.webp` — 28.470 bytes;
- `assets/img/hero-operacao-m-753.avif` — 27.632 bytes;
- `assets/img/hero-operacao-m-753.webp` — 47.910 bytes;
- `assets/img/mod-logistica-480.avif` — 23.622 bytes;
- `assets/img/mod-logistica-480.webp` — 34.066 bytes;
- `assets/img/mod-logistica-800.avif` — 42.351 bytes;
- `assets/img/mod-logistica-800.webp` — 66.630 bytes.

## 3. Classificação dos 101 candidatos iniciais

O novo `tools/orphans-qa.mjs` separa referência direta de dependência indireta do pipeline.

| Classificação final | Quantidade | Decisão |
|---|---:|---|
| Usados diretamente | 51 | mantidos |
| Órfãos comprovados | 16 | removidos |
| Uso indireto após a limpeza | 85 | mantidos |
| Uso incerto | 0 | — |
| Candidatos sem classificação | 0 | — |

Os 85 itens restantes são o manifesto de imagens e variantes ligadas a famílias ainda declaradas no conteúdo/fallback e no pipeline atual. Não foram tratados como código morto.

## 4. Itens avaliados e mantidos

- `heroMock`, `screenMock` e o renderer genérico: possuem consumidores reais na home, no PCPM, nas páginas setoriais ou funcionam como fallback atual do gerador.
- `tools/consolidate-module-css.mjs` e `tools/generalize-module-system.mjs`: são ferramentas de manutenção/migração documentadas, não código de produção abandonado.
- `moduleBySlug`, `needs`, `differentials` e outros dados factuais não renderizados: preservados conforme a regra de não aplicar limpeza agressiva a `content.mjs`.
- 85 assets de uso indireto: preservados pelo conteúdo, fallback ou pipeline de imagens.
- 11 ocorrências de `!important`: mantidas porque atendem redução de movimento, contraste ou posicionamentos responsivos específicos.
- regras de `overflow`, `min-width`, contenção e breakpoints: mantidas; a matriz responsiva depende delas e não há prova segura de redundância.
- `module-system.css`: permaneceu genérico e sem seletores de módulos específicos.
- CSS próprio dos módulos: permaneceu responsável pelas representações específicas de cada produto.

Não existe declaração explícita `transition: all` nos CSSs publicados. As transições explícitas já nomeiam as propriedades animadas.

## 5. Centralizações

Nenhuma centralização adicional foi realizada. Hero, bento, fluxo, tela, hotspots, situações e ecossistema já estão na base conceitual compartilhada. As semelhanças remanescentes entre barras e painéis de telas representam interfaces distintas e exigiriam novas exceções se fossem fundidas.

Também foi rejeitada a ideia de remover o renderer genérico ou os mocks antigos: eles continuam acessíveis por páginas e fallbacks reais.

## 6. Guardrails adicionados

- `tools/architecture-qa.mjs`: valida as 20 páginas, os 13 `customRenderers`, dependências essenciais, imports locais, scripts compartilhados e carregamento condicional de `forms.js`.
- `tools/orphans-qa.mjs`: classifica assets como `USADO`, `INDIRETO`, `CANDIDATO` ou `INCERTO` e nunca apaga arquivos automaticamente.

## 7. Antes e depois

Métrica de arquivos: conjunto oficial excluindo `alterados`, `alterados.rar` e `experimentos`.

| Métrica | Antes | Depois |
|---|---:|---:|
| Arquivos | 243 | 230 |
| Assets publicados | 152 | 136 |
| CSS bytes | 253.029 | 252.740 |
| JS bytes | 41.533 | 41.533 |
| MJS bytes | 543.653 | 553.703 |
| HTML bytes | 801.287 | 801.287 |
| Candidatos órfãos estáticos | 101 | 85 |
| Órfãos comprovados | 0 | 16 removidos |
| Referências de scripts nos HTMLs | 82 | 82 |

O crescimento em `.mjs` corresponde exclusivamente aos dois guardrails novos de QA. Não aumenta o JavaScript publicado nem as requisições do navegador.

## 8. Regressão executada

- sintaxe de todos os `.mjs`;
- build das 20 páginas;
- QA estrutural;
- QA factual;
- QA de arquitetura;
- QA de órfãos;
- QA do sistema de módulos: 13 páginas premium;
- QA de acessibilidade: 20 páginas e 13 fluxos;
- QA de SEO;
- QA de tracking, inclusive formulários em navegador e ausência de PII;
- QA de assets;
- QA de performance;
- home, Portal Soluções e sobreposição de heroes;
- PCPM, Comercial, WMS, Compras, Financeiro, Custos e CRM;
- matriz de navegador: **20 páginas × 38 viewports = 760 cenários**;
- desktop, mobile e equivalente a zoom de 200%;
- zero overflow horizontal global;
- zero imagens quebradas;
- inspeção visual representativa da home, Portal Soluções e módulo premium em mobile.

## 9. Resultado da regressão

Foram preservados individualmente:

- home;
- Portal Soluções com Operação 4, Vendas 3, Gestão 5 e WhatsApp compacto;
- 13 módulos premium e fluxos;
- três páginas setoriais;
- Trabalhe Conosco e seus formulários;
- Política de Privacidade;
- menus desktop/mobile, mega-menu e disclosure “Sou cliente”;
- FAQs, foco, ARIA e movimento reduzido;
- tracking e taxonomia de eventos;
- metadata, canonical, schemas, sitemap e robots;
- links internos e referências de assets.

## 10. Observações para Sprint 5

Nenhuma decisão comercial da home foi reaberta. A auditoria não encontrou problema arquitetural que exija alteração da home na Sprint 5. Qualquer revisão futura deve permanecer restrita ao escopo comercial aprovado para essa sprint.
