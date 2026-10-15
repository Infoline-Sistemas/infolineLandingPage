# Sistema compartilhado de módulos

## 1. A decisão central

Os módulos pertencem ao mesmo ERP Infoline. Eles devem ter personalidades funcionais diferentes, mas a mesma identidade de produto.

O visitante deve perceber:

- PCPM como planejamento e produção;
- WMS como estoque e logística;
- Compras como necessidade, cotação e fornecedor;
- Custos como composição, preço e margem;
- Comercial como pedido, disponibilidade e faturamento;
- Financeiro como títulos, vencimentos e caixa;
- CRM como relacionamento, oportunidade e próximo passo.

Essa diferenciação vem dos **dados, componentes e fluxos exibidos**, não de uma cor estrutural diferente para cada página.

## 2. Por que não existe um sistema visual independente para cada módulo

Se cada módulo recriasse hero, cards, fluxo, tela e responsividade, o projeto teria rapidamente:

- centenas de regras duplicadas;
- breakpoints diferentes para o mesmo componente;
- espaçamentos e tipografias inconsistentes;
- bugs corrigidos em uma página e mantidos em outras;
- aparência de produtos adquiridos de empresas diferentes;
- custo crescente para modernizar os módulos restantes.

Por isso a estrutura compartilhada está em:

```text
assets/css/module-system.css
assets/js/interactions.js
```

E a representação de cada módulo está em:

```text
tools/pages/<modulo>.mjs
assets/css/<modulo>.css
```

## 3. Divisão correta de responsabilidades

### Pertence a `module-system.css`

- grid e tipografia do hero aprofundado;
- área escura da representação do produto;
- introdução da seção de capacidades;
- grid bento e card dominante;
- trilha de cinco etapas;
- painel “Entra / O sistema controla / Segue”;
- palco da tela principal;
- hotspots numerados;
- grade de situações reais;
- diagrama de ecossistema;
- comportamento responsivo desses componentes;
- regras de redução de movimento.

As classes públicas dessa base começam com `module-system-`:

```text
.module-system-hero
.module-system-hero-product
.module-system-intro
.module-system-bento
.module-system-cap-card
.module-system-cap-heading
.module-system-flow-section
.module-system-flow
.module-system-flow-track
.module-system-flow-step
.module-system-flow-detail
.module-system-screen-section
.module-system-screen-stage
.module-system-hotspot
.module-system-situations
.module-system-ecosystem
.module-system-eco-center
.module-system-eco-node
```

### Pertence ao CSS específico

Somente o que representa visualmente aquela área do ERP.

Exemplos:

- `pcpm.css`: ordem de produção, MRP, progresso e materiais;
- `wms.css`: posição de estoque, endereço, lote, racks e expedição;
- `purchases.css`: pedido de compra, fornecedor, cotação e comparação;
- `costs.css`: composição, materiais, máquina, mão de obra e margem;
- `commercial.css`: pedido, disponibilidade, preço e faturamento;
- `financial.css`: posição financeira, títulos, bancos e fluxo de caixa;
- `crm.css`: oportunidade, pipeline, histórico e atividades.

Uma regra como `.crm-board` é específica. Uma regra como “todos os fluxos têm cinco colunas no desktop e viram sequência vertical no celular” é compartilhada.

## 4. Composição obrigatória de um módulo aprofundado

Os módulos aprofundados atuais seguem esta sequência:

1. breadcrumb;
2. hero com proposta de valor e uma representação do produto;
3. navegação local;
4. introdução e bento de capacidades;
5. fluxo interativo;
6. tela principal com hotspots;
7. situações reais;
8. ecossistema de integrações comprovadas;
9. FAQ;
10. CTA final.

Essa ordem cria uma narrativa:

```text
benefício → capacidades → processo → produto → problemas resolvidos → integração → contato
```

Ela pode ser ajustada se houver uma razão comercial clara, mas não deve ser alterada apenas para “deixar uma página diferente”.

## 5. Duas classes por componente

O HTML combina uma classe genérica com uma específica:

```html
<section class="mod-hero module-system-hero crm-hero">
  ...
  <div class="mod-hero-product module-system-hero-product crm-hero-product">
```

Isso permite:

- `module-system-hero` definir o comportamento comum;
- `crm-hero` servir como gancho pontual, quando o CRM realmente precisar de uma diferença;
- QA localizar um módulo sem acoplar a base genérica a nomes específicos.

Não acrescente todos os módulos em seletores como:

```css
:is(.pcpm-hero, .wms-hero, .crm-hero, ...)
```

Se a regra é comum, use `.module-system-hero`.

## 6. Cor e identidade

### Cor estrutural

Azul é a linguagem principal da Infoline:

- navegação;
- fundos de produto;
- bordas e destaques;
- CTAs;
- elementos de conexão;
- cards dominantes.

### Cores semânticas

Cores adicionais têm significado operacional:

- verde: disponível, aprovado, concluído ou positivo;
- amarelo: atenção, parcial, aguardando ou vencimento próximo;
- vermelho: bloqueio, divergência, atraso crítico ou erro;
- ciano: destaque informativo sobre fundo azul.

Não use verde, laranja, roxo ou amarelo como “marca” completa de um módulo.

## 7. Fluxo interativo compartilhado

O template cria botões com os dados da etapa:

```html
<button
  class="module-system-flow-step crm-flow-step"
  data-flow-input="Necessidade e potencial"
  data-flow-control="Etapa e responsável"
  data-flow-output="Negócio acompanhado">
```

`assets/js/interactions.js` procura `[data-module-flow]` e atualiza os três campos de detalhe. Um único controlador atende todos os módulos.

Ao criar um fluxo novo:

- mantenha os atributos `data-flow-input`, `data-flow-control` e `data-flow-output`;
- use botão real para permitir teclado;
- atualize `aria-pressed` pelo controlador existente;
- não crie outro JavaScript apenas para trocar três textos.

## 8. Informativos do hero

Os pequenos informativos do hero devem ficar fora do painel principal, sem cobrir dados. Cada módulo possui nomes específicos, como `.crm-note` ou `.cost-note`, mas a composição segue a mesma regra:

- painel central com margem inferior suficiente;
- informativos posicionados na área livre inferior;
- no mobile, posicionamento volta a ser estático;
- `hero-overlap-qa.mjs` verifica colisão real por coordenadas.

Nunca resolva uma sobreposição apenas elevando o `z-index`: isso esconde o problema e mantém a informação cobrindo a tela.

## 9. Módulos aprofundados e genéricos

### Aprofundados

No estado atual:

- PCPM;
- WMS;
- Compras;
- Gestão de Custos;
- Comercial;
- Financeiro;
- CRM.

Esses módulos têm renderer e CSS específicos e usam `module-system.css`.

### Genéricos

Os demais continuam sendo renderizados pela parte genérica de `tools/pages/module.mjs`. Eles usam o conteúdo de `content.mjs`, mocks comuns e `module.css`.

Um módulo genérico não está “quebrado”; ele apenas ainda não recebeu o nível de narrativa e demonstração visual dos aprofundados.

## 10. Como aprofundar um módulo novo

Exemplo hipotético: E-commerce.

### Etapa 1 — verificar o produto real

Leia a entrada `M.ecommerce` em `tools/content.mjs` e as fontes que sustentam cada afirmação. Não crie recursos apenas para preencher o layout.

Defina:

- pergunta que a página deve responder imediatamente;
- objeto principal do hero;
- oito capacidades reais;
- fluxo de cinco etapas;
- tela principal;
- seis situações reais;
- integrações comprovadas.

### Etapa 2 — criar o renderer

Crie:

```text
tools/pages/ecommerce.mjs
```

Use um módulo aprofundado existente como referência estrutural. Preserve as classes `module-system-*` e crie classes `ecommerce-*` somente para componentes particulares.

### Etapa 3 — registrar no roteador

Em `tools/pages/module.mjs`:

```js
import { renderEcommerce } from './ecommerce.mjs';

// dentro de renderModule(m)
if (m.key === 'ecommerce') return renderEcommerce(m);
```

### Etapa 4 — criar o CSS específico

Crie:

```text
assets/css/ecommerce.css
```

O renderer deve devolver:

```js
styles: ['module.css', 'module-system.css', 'ecommerce.css']
```

Não copie `module-system.css` para o novo arquivo.

### Etapa 5 — atualizar o portal

Em `tools/pages/solucoes.mjs`:

- mova `ecommerce` de `compact` para `featured`;
- acrescente `featuredCopy.ecommerce`;
- crie `preview('ecommerce')`;
- confirme que o grid continua equilibrado.

### Etapa 6 — criar QA

Crie `tools/ecommerce-qa.mjs` verificando ao menos:

- oito cards de capacidades;
- cinco etapas do fluxo;
- quatro hotspots;
- seis situações;
- número esperado de integrações;
- interação do fluxo;
- ausência de overflow horizontal;
- scroll interno da tela no mobile, se necessário.

Acrescente o hero em `hero-overlap-qa.mjs` quando houver informativos flutuantes.

### Etapa 7 — gerar e validar

```powershell
node tools/build.mjs
node tools/qa.mjs
```

Depois execute QA visual em desktop e mobile.

## 11. Quando alterar a base compartilhada

Altere `module-system.css` quando:

- a melhoria deve aparecer em todos os módulos aprofundados;
- o bug existe no componente comum;
- um novo módulo revela uma limitação estrutural real;
- a regra pode ser expressa sem conhecer o nome do módulo.

Antes de concluir, revise PCPM, WMS, Compras, Custos, Comercial, Financeiro e CRM. Uma alteração comum pode resolver sete páginas ou quebrar sete páginas.

## 12. Quando não alterar a base

Não coloque na base:

- nomes de produtos ou etapas específicas;
- layout interno de uma cotação, OP ou oportunidade;
- classes com prefixo de módulo;
- cores temáticas exclusivas;
- ajustes que só corrigem uma representação particular.

## 13. Critério de qualidade

Um módulo novo está pronto quando:

- parece outra área do mesmo ERP;
- a personalidade vem de seu conteúdo real;
- não duplica o sistema compartilhado;
- funciona com teclado e redução de movimento;
- não tem sobreposição ou overflow em desktop/mobile;
- aparece corretamente no portal e na navegação;
- passa no build, QA estrutural e QA visual.
