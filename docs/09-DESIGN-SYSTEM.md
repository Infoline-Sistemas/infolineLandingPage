# Design system

## 1. Objetivo

O design system mantém o portal reconhecível como uma única experiência Infoline. Ele não tenta transformar todo conteúdo em componentes idênticos; ele padroniza a estrutura e permite que cada área mostre dados diferentes.

## 2. Tokens globais

Os tokens ficam em `:root` dentro de `assets/css/base.css`.

### Cor

| Token | Uso |
|---|---|
| `--ink`, `--ink-2` | texto principal e superfícies escuras |
| `--navy`, `--navy-deep` | identidade institucional escura |
| `--blue`, `--blue-2` | ação, navegação e destaque estrutural |
| `--blue-light` | fundos leves ligados ao azul |
| `--cyan`, `--cyan-dim` | destaque informativo em fundos escuros |
| `--slate*` | texto secundário |
| `--line*` | bordas e divisores |
| `--mist*` | fundos de seção |
| `--paper` | superfície branca |
| `--surface-dark*` | seções e painéis escuros |

### Estados

| Token | Significado |
|---|---|
| `--ok`, `--ok-bg` | concluído, disponível, positivo |
| `--run`, `--run-bg` | em andamento, ativo |
| `--wait`, `--wait-bg` | aguardando, parcial, atenção |
| `--err`, `--err-bg` | erro, bloqueio, divergência |

Use cor de estado somente quando ela comunicar significado. Não escolha estado apenas por estética.

### Tipografia

O projeto usa a família Segoe UI disponível no sistema, com fallbacks nativos. Isso evita download de fonte e melhora velocidade.

- `--font-display`: títulos, números e destaques;
- `--font-body`: parágrafos, controles e navegação.

Os títulos usam `clamp()` para escalar entre mobile e desktop.

### Forma e profundidade

- `--radius-lg`, `--radius-md`, `--radius-sm`, `--radius-pill`;
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`.

Não crie novos raios e sombras em cada card sem necessidade. Reutilize tokens ou justifique a exceção na representação específica.

### Layout

- `--container: 1320px` limita a largura do conteúdo;
- `--gutter` controla margens laterais fluidas;
- `--pad-section` e `--pad-section-sm` controlam ritmo vertical;
- `--header-h` é usado por scroll e navegação sticky.

## 3. Hierarquia visual

### Kicker

Identifica contexto antes do título. Deve ser curto e não repetir o H1.

### H1

Expressa a principal promessa da página. Uma página deve ter um H1 claro.

### Lede

Explica a promessa em linguagem direta. Evite parágrafos técnicos longos no hero.

### Seções

Cada seção deve responder uma pergunta do visitante. Alternância de fundo é usada para organizar a leitura, não como decoração aleatória.

## 4. Botões e links

- `.button-primary`: ação principal;
- `.button-outline`: ação secundária em fundo claro;
- `.button-light`: ação principal sobre fundo escuro;
- `.button-ghost-dark`: ação secundária sobre fundo escuro;
- `.text-link`: exploração ou aprofundamento.

Uma área não deve exibir várias ações com o mesmo peso. “Agendar demonstração” normalmente é primária; “ver detalhes” é link ou ação secundária.

## 5. Ícones

Os ícones são símbolos de `assets/img/icons.svg` e usam `currentColor`.

Vantagens:

- consistência de traço;
- carregamento de um único arquivo;
- mudança de cor via CSS;
- ausência de bibliotecas externas;
- reaproveitamento por `icon()`.

Antes de adicionar um ícone, confirme se um símbolo existente já comunica o conceito.

## 6. Imagens

O helper `pic()` entrega:

- AVIF;
- WebP;
- `srcset`;
- `sizes`;
- largura e altura explícitas;
- lazy loading, salvo quando a imagem é prioritária.

Isso reduz peso e evita mudança de layout durante o carregamento.

As imagens devem parecer reais, vivas e plausíveis. Evite pessoas, máquinas, mãos, telas ou ambientes com anomalias visuais típicas de geração artificial.

## 7. Responsividade

O projeto usa breakpoints locais conforme o componente, com pontos recorrentes próximos de:

- 1080 px: grids complexos viram uma coluna ou duas colunas;
- 760/700 px: composição mobile, menu e fluxos verticais;
- 430/420 px: ajustes para telas estreitas.

O comportamento é mais importante que o número exato:

- página nunca deve criar overflow horizontal;
- tabelas/pipelines largos podem ter scroll interno explícito;
- informativos flutuantes viram blocos estáticos;
- fluxo horizontal vira sequência vertical;
- hotspots deixam de ser absolutos;
- textos e CTAs permanecem legíveis.

## 8. Movimento

As animações são curtas e funcionais. O projeto evita parallax pesado, partículas e transformações que distorçam imagens.

`prefers-reduced-motion: reduce` reduz animações, transições e rolagem suave.

Ao criar uma interação:

- não dependa apenas de hover;
- ofereça foco e clique;
- evite movimentar conteúdo durante a leitura;
- não use animação para esconder atraso;
- confirme desempenho em computador intermediário e celular.

## 9. Acessibilidade

Elementos já previstos:

- skip link;
- foco visível;
- landmarks e labels;
- botões reais em interações;
- `aria-expanded` em menus;
- `aria-pressed` nos fluxos;
- `aria-live` em detalhes atualizados;
- controle de foco no menu mobile;
- fechamento por Escape;
- textos alternativos;
- redução de movimento.

Ao alterar um componente, preserve esses comportamentos. Não troque um `<button>` por `<div>` apenas para facilitar estilo.

## 10. Regras dos cards de portal

### Card rico

Usado para módulo aprofundado. Contém:

- label funcional;
- título;
- benefício;
- CTA;
- mini preview coerente com a página de destino.

### Card compacto

Usado para módulo ainda no template genérico. Mantém acesso e contexto sem prometer uma experiência aprofundada inexistente.

Quando um módulo for modernizado, ele deve migrar de compacto para rico em `tools/pages/solucoes.mjs`.

## 11. Critério para novo componente

Antes de criar, pergunte:

1. já existe algo equivalente em `components.css`?
2. será usado em três ou mais lugares?
3. é uma variação real ou apenas uma diferença de espaçamento?
4. pertence ao sistema comum ou à visualização de um módulo?
5. funciona sem hover e com movimento reduzido?

Se a resposta indicar uso amplo, crie uma classe compartilhada. Se for uma representação exclusiva, mantenha-a no CSS da página.
