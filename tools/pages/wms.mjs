import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';

const capabilities = [
  { key: 'posicao', icon: 'i-wms', title: 'Posição de estoque', text: 'Encontre produto, saldo, lote e endereço em uma visão operacional.', dominant: true },
  { key: 'enderecamento', icon: 'i-grid', title: 'Endereçamento', text: 'Organize armazém, rua, prateleira e demais níveis de localização.' },
  { key: 'lotes', icon: 'i-processos', title: 'Lotes', text: 'Mantenha origem, movimentação e saldo rastreáveis por lote.' },
  { key: 'separacao', icon: 'i-check', title: 'Separação', text: 'Conduza reservas, leitura e conferência dos itens do pedido.' },
  { key: 'movimentacoes', icon: 'i-compras', title: 'Movimentações', text: 'Registre entradas, saídas e transferências entre locais.' },
  { key: 'inventario', icon: 'i-custos', title: 'Inventário', text: 'Compare o estoque contado com o sistema e trate divergências.' },
  { key: 'expedicao', icon: 'i-comercial', title: 'Expedição', text: 'Reúna packing, volumes, cargas, romaneio e faturamento.' },
  { key: 'rastreabilidade', icon: 'i-processos', title: 'Rastreabilidade', text: 'Saiba por onde cada item passou, do recebimento à saída.' },
];

const flow = [
  { label: 'Recebimento', input: 'Produto, lote e quantidade', control: 'Conferência e identificação', output: 'Item disponível para guardar' },
  { label: 'Endereçamento', input: 'Item recebido', control: 'Armazém, rua e prateleira', output: 'Localização confirmada' },
  { label: 'Estoque', input: 'Saldo por endereço', control: 'Reserva, lote e movimentação', output: 'Disponibilidade confiável' },
  { label: 'Separação', input: 'Pedido e reserva', control: 'Coleta, leitura e packing', output: 'Volumes conferidos' },
  { label: 'Expedição', input: 'Volumes e pedidos', control: 'Carga, romaneio e situação', output: 'Saída e faturamento conectados' },
];

const situations = [
  ['O produto está no estoque, mas em qual local?', 'A posição reúne armazém, rua e prateleira para orientar a movimentação sem busca manual.'],
  ['É preciso separar o lote correto', 'Lote, saldo e endereço acompanham o item para preservar a rastreabilidade.'],
  ['A contagem física divergiu do sistema', 'O inventário registra a contagem e evidencia a diferença que precisa ser tratada.'],
  ['Uma separação ainda está pendente', 'Itens coletados e faltantes permanecem visíveis até a conferência do pedido.'],
  ['O saldo precisa mudar de local', 'A transferência registra origem, destino, quantidade e responsável pela movimentação.'],
  ['O pedido está pronto para sair', 'Volumes, carga, romaneio e faturamento avançam no mesmo fluxo operacional.'],
];

const connections = [
  { key: 'compras', eyebrow: 'Recebimento', label: 'Compras', text: 'O recebimento alimenta localização, lote e saldo do estoque.', x: 18, y: 27 },
  { key: 'comercial', eyebrow: 'Pedidos e reservas', label: 'Comercial', text: 'Pedidos e reservas orientam separação e atendimento.', x: 82, y: 27 },
  { key: 'ecommerce', eyebrow: 'Canais digitais', label: 'E-commerce e Marketplaces', text: 'A consulta de estoque mantém os canais digitais conectados à disponibilidade.', x: 50, y: 78 },
];

function capabilityVisual(key) {
  if (key === 'posicao') return `<div class="wms-mini-position"><div class="wms-mini-rack"><span>A1</span><i class="full"></i><i></i><i class="hit"></i><span>A2</span><i></i><i class="full"></i><i></i><span>A3</span><i class="full"></i><i></i><i class="full"></i></div><div class="wms-mini-summary"><small>Produto</small><b>Rolamento 6204</b><span>Armazém A · Rua 03 · P2</span><strong>240 un.</strong></div></div>`;
  if (key === 'enderecamento') return `<div class="wms-mini-address"><span>Armazém A</span><i>›</i><span>Rua 03</span><i>›</i><b>P2</b></div>`;
  if (key === 'lotes') return `<div class="wms-mini-lots"><span><i style="--w:78%"></i><b>LT-0926</b><small>180 un.</small></span><span><i style="--w:34%"></i><b>LT-0826</b><small>60 un.</small></span></div>`;
  if (key === 'separacao') return `<div class="wms-mini-pick"><span class="done">${icon('i-check', 'i')}Produto A <b>2/2</b></span><span class="done">${icon('i-check', 'i')}Produto B <b>1/1</b></span><span>${icon('i-wms', 'i')}Produto C <b>3/4</b></span></div>`;
  if (key === 'movimentacoes') return `<div class="wms-mini-move"><span>Rua 01</span><i>→</i><b>Rua 03 · P2</b></div>`;
  if (key === 'inventario') return `<div class="wms-mini-count"><span><small>Sistema</small><b>240</b></span><span><small>Contado</small><b>238</b></span><strong><small>Diferença</small><b>−2</b></strong></div>`;
  if (key === 'expedicao') return `<div class="wms-mini-ship"><div><small>Carga</small><b>3228</b></div><span><i style="--w:82%"></i><small>18 de 20 volumes</small></span><em>Em montagem</em></div>`;
  return `<div class="wms-mini-trace"><span class="done">Recebido</span><i></i><span class="done">Guardado</span><i></i><span>Separado</span></div>`;
}

function heroProduct() {
  return `<div class="wms-stock-card" aria-label="Exemplo ilustrativo de posição de estoque endereçada">
    <div class="wms-stock-top"><span><i></i><i></i><i></i></span><b>WMS</b><em>Posição de estoque</em></div>
    <div class="wms-stock-body">
      <div class="wms-product-head"><div><small>Produto</small><strong>Rolamento 6204</strong></div><span>Disponível</span></div>
      <div class="wms-location"><small>Endereço atual</small><div><b>Armazém A</b><i>›</i><b>Rua 03</b><i>›</i><strong>Prateleira 2</strong></div></div>
      <div class="wms-stock-kpis"><div><small>Lote</small><b>LT-0926</b></div><div><small>Quantidade</small><b>240 un.</b></div><div><small>Reservado</small><b>80 un.</b></div><div class="available"><small>Disponível</small><b>160 un.</b></div></div>
      <div class="wms-next"><span>${icon('i-wms', 'i')}</span><div><small>Próxima movimentação</small><b>Separação · Pedido 048521</b></div><em>Rua 03 · P2</em></div>
    </div>
  </div>
  <div class="wms-float wms-float--address">${icon('i-check', 'i')}<span><small>Endereço confirmado</small><b>Armazém A · Rua 03 · P2</b></span></div>
  <div class="wms-float wms-float--lot">${icon('i-processos', 'i')}<span><small>Lote rastreável</small><b>LT-0926</b></span></div>
  <div class="wms-float wms-float--pick">${icon('i-wms', 'i')}<span><small>Separação</small><b>18 de 20 volumes</b></span></div>`;
}

function warehouseScreen() {
  const rows = [
    ['Rolamento 6204', 'Armazém A · R03 · P2', 'LT-0926', '240', '80', '160', 'Disponível', 'ok'],
    ['Engrenagem 18D', 'Armazém A · R01 · P3', 'LT-0826', '96', '40', '56', 'Disponível', 'ok'],
    ['Correia AX-42', 'Armazém B · R04 · P1', 'LT-0726', '32', '30', '2', 'Atenção', 'wait'],
    ['Motor 2CV', 'Recebimento', 'LT-1026', '12', '0', '12', 'A endereçar', 'run'],
  ];
  return `<div class="wms-screen" role="img" aria-label="Exemplo ilustrativo da posição de estoque por produto, local e lote">
    <div class="wms-screen-bar"><span><i></i><i></i><i></i></span><b>WMS · Posição de estoque</b><em class="module-system-illustrative-label">Tela ilustrativa</em></div>
    <div class="wms-screen-body"><div class="wms-screen-toolbar"><span>Armazém · Todos</span><span>Produto ou lote</span><b>Consultar posição</b></div>
    <div class="wms-screen-kpis"><div><small>Itens localizados</small><b>1.284</b></div><div><small>Reservas</small><b>318</b></div><div><small>A endereçar</small><b>12</b></div></div>
    <div class="wms-screen-scroll"><div class="wms-screen-table"><div class="th"><span>Produto</span><span>Endereço</span><span>Lote</span><span>Saldo</span><span>Reservado</span><span>Disponível</span><span>Situação</span></div>${rows.map((r) => `<div class="tr"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span><span><b>${r[5]}</b></span><span class="${r[7]}">${r[6]}</span></div>`).join('')}</div></div>
    <footer><span>Última movimentação · hoje 10:42</span><b>Leitura por código de barras disponível</b></footer></div>
  </div>`;
}

export function renderWms(m) {
  const headHtml = head({ title: m.seoTitle, description: m.seoDesc, path: `${m.slug}.html`, schemas: [orgSchema(), faqSchema(m.faq)] });
  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Soluções', href: 'solucoes.html' }, { label: 'WMS' }]);
  const localNav = `<nav class="module-nav" aria-label="Nesta solução"><div class="container module-nav-inner"><span>WMS</span><div><a href="#visao-geral">Visão geral</a><a href="#capacidades">Capacidades</a><a href="#fluxo">Fluxo</a><a href="#tela">Tela</a><a href="#situacoes">Situações</a><a href="#integracoes">Integrações</a><a href="#faq">FAQ</a></div></div></nav>`;
  const hero = `<section class="mod-hero module-system-hero wms-hero"><div class="container mod-hero-inner"><div class="reveal"><span class="mod-hero-icon">${icon(m.icon, 'i i-lg')}</span><p class="kicker">${esc(m.kicker)}</p><h1>${esc(m.h1)}</h1><p class="lede">${esc(m.lead)}</p><div class="mod-hero-cta"><a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="mod_wms_demo">Agendar uma demonstração</a><a class="text-link" href="#capacidades">Ver como o estoque se movimenta${icon('i-chevron-right', 'i')}</a></div><ul class="mod-hero-meta"><li>${icon('i-check', 'i i-sm')}Localização e lote rastreáveis</li><li>${icon('i-grid', 'i i-sm')}Parte do ERP Infoline</li></ul></div><div class="mod-hero-product module-system-hero-product wms-hero-product reveal"><span class="mod-product-label">Tela ilustrativa</span>${heroProduct()}<small>Representação ilustrativa. Nenhum dado real é exibido.</small></div></div></section>`;
  const capabilitiesSection = `<section class="section wms-capabilities" id="visao-geral"><div class="container"><div class="module-system-intro wms-intro reveal"><p class="kicker">WMS na prática</p><h2>Encontre cada item. Movimente com confiança. Expeda sem perder o rastro.</h2><p>O WMS transforma saldo em posição operacional: produto, lote, endereço, reserva e movimentação acompanham o item do recebimento à expedição.</p></div><div id="capacidades" class="module-system-bento wms-bento reveal">${capabilities.map((item) => `<article class="module-system-cap-card wms-cap-card wms-cap-card--${item.key}${item.dominant ? ' is-dominant' : ''}"><div class="module-system-cap-heading wms-cap-heading"><span>${icon(item.icon, 'i')}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></div>${capabilityVisual(item.key)}</article>`).join('')}</div></div></section>`;
  const flowSection = `<section class="section section--dark module-system-flow-section wms-flow-section" id="fluxo"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Do recebimento à expedição</p><h2>O estoque se move, <span>mas a informação não se perde.</span></h2><p class="lede">Passe por cada etapa para ver o que entra, o que o sistema controla e qual informação segue adiante.</p></div></div><div class="module-system-flow wms-flow reveal" data-wms-flow data-module-flow><div class="module-system-flow-track wms-flow-track">${flow.map((step, index) => `<button type="button" class="module-system-flow-step wms-flow-step${index === 0 ? ' is-active' : ''}" aria-pressed="${index === 0 ? 'true' : 'false'}" data-flow-input="${esc(step.input)}" data-flow-control="${esc(step.control)}" data-flow-output="${esc(step.output)}"><span>${index + 1}</span><b>${esc(step.label)}</b></button>`).join('')}</div><div class="module-system-flow-detail wms-flow-detail" aria-live="polite"><div><small>Entra</small><b data-flow-detail="input">${esc(flow[0].input)}</b></div><div><small>O sistema controla</small><b data-flow-detail="control">${esc(flow[0].control)}</b></div><div><small>Segue para a próxima etapa</small><b data-flow-detail="output">${esc(flow[0].output)}</b></div></div></div></div></section>`;
  const screenSection = `<section class="section module-system-screen-section wms-screen-section" id="tela"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Veja o produto</p><h2>Veja onde está o estoque e o que precisa ser movimentado.</h2><p class="lede">Produto, local, lote, saldo, reserva e disponibilidade permanecem juntos para orientar a rotina do armazém.</p></div></div><div class="module-system-screen-stage wms-screen-stage reveal">${warehouseScreen()}<div class="module-system-hotspot module-system-hotspot--1"><i>1</i><span><b>Produto localizado</b><small>Descrição e identificação permanecem visíveis.</small></span></div><div class="module-system-hotspot module-system-hotspot--2"><i>2</i><span><b>Endereço completo</b><small>Armazém, rua e prateleira orientam a busca.</small></span></div><div class="module-system-hotspot module-system-hotspot--3"><i>3</i><span><b>Lote rastreável</b><small>O saldo pode ser acompanhado por lote.</small></span></div><div class="module-system-hotspot module-system-hotspot--4"><i>4</i><span><b>Disponibilidade real</b><small>Saldo e reservas mostram o que pode ser atendido.</small></span></div></div></div></section>`;
  const situationsSection = `<section class="section section--mist" id="situacoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Onde esse controle faz diferença</p><h2>Situações do armazém que pedem localização e rastreabilidade.</h2></div></div><div class="module-system-situations wms-situations reveal">${situations.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></article>`).join('')}</div></div></section>`;
  const integrationSection = `<section class="section wms-integration" id="integracoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">ERP integrado</p><h2>O estoque conecta entrada, operação e saída.</h2><p class="lede">Recebimentos, pedidos e canais digitais continuam ligados à mesma posição de estoque.</p></div></div><div class="module-system-ecosystem module-system-ecosystem--premium wms-ecosystem reveal" data-eco-count="3"><div class="module-system-ecosystem-head"><span><i></i> Fluxo integrado</span><b>Da entrada à saída</b></div><svg viewBox="0 0 900 560" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="module-eco-line" x1="0" x2="1"><stop offset="0" stop-color="#38c8ff"/><stop offset="1" stop-color="#4d7dff"/></linearGradient></defs><ellipse cx="450" cy="270" rx="270" ry="174"/><path d="M450 263 C355 225 270 180 162 151"/><path d="M450 263 C545 225 630 180 738 151"/><path d="M450 263 C450 330 450 382 450 437"/></svg><div class="module-system-eco-center wms-eco-center"><span>${icon('i-wms', 'i')}</span><small>Operação logística</small><b>WMS</b><em>Estoque disponível</em></div>${connections.map((item) => { const mod = modules[item.key]; return `<a class="module-system-eco-node wms-eco-node" style="--x:${item.x}%;--y:${item.y}%" href="${mod.slug}.html"><span>${icon(mod.icon, 'i')}</span><div><em>${esc(item.eyebrow)}</em><b>${esc(item.label)}</b><small>${esc(item.text)}</small></div>${icon('i-arrow-right', 'i module-system-ecosystem-arrow')}</a>`; }).join('')}</div></div></section>`;
  const faqSection = `<section class="section" id="faq"><div class="container" style="max-width:900px"><div class="section-head reveal" style="display:block"><p class="kicker">Perguntas frequentes</p><h2>Sobre o WMS</h2></div><div class="faq-list reveal">${m.faq.map(([q, a], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(q)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(a)}</p></details>`).join('')}</div></div></section>`;
  const ctaSection = `<section class="section"><div class="container"><div class="cta-banner reveal"><h2>${esc(m.cta)}</h2><p>Veja localização, lote, separação e expedição funcionando na rotina do seu armazém.</p><div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="mod_wms_bottom">Agendar demonstração</a><a class="button button-ghost-dark" href="erp-para-atacado-distribuicao.html">Voltar para Atacado e Distribuição</a></div></div></div></section>`;
  const body = `${header({ current: m.slug, variant: 'internal' })}${bc}<main id="conteudo">${hero}${localNav}${capabilitiesSection}${flowSection}${screenSection}${situationsSection}${integrationSection}${faqSection}${ctaSection}</main>${footer()}`;
  return { headHtml, body, styles: ['module.css', 'module-system.css', 'wms.css'], pageType: 'module', moduleKey: m.key, solutionGroup: m.group };
}
