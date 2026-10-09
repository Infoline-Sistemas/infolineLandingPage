import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';

const capabilities = [
  { key: 'pedido', icon: 'i-comercial', title: 'Pedido e negociação', text: 'Reúna cliente, itens, condição, disponibilidade e margem antes de confirmar a venda.', dominant: true },
  { key: 'preco', icon: 'i-custos', title: 'Formação de preço', text: 'Forme o preço com base no custo e na rentabilidade esperada.' },
  { key: 'margem', icon: 'i-financeiro', title: 'Margem', text: 'Saiba o resultado da negociação antes de liberar o pedido.' },
  { key: 'tabela', icon: 'i-grid', title: 'Tabelas de preços', text: 'Aplique regras e condições adequadas a cada operação comercial.' },
  { key: 'disponibilidade', icon: 'i-wms', title: 'Disponibilidade', text: 'Consulte saldo e comprometimento sem prometer o que não pode entregar.' },
  { key: 'carteira', icon: 'i-comercial', title: 'Carteira de pedidos', text: 'Enxergue o que está em análise, liberado ou já faturado.' },
  { key: 'comissoes', icon: 'i-crm', title: 'Comissões', text: 'Conecte representantes e regras comerciais às vendas realizadas.' },
  { key: 'faturamento', icon: 'i-contabilidade', title: 'Faturamento', text: 'Faça o pedido seguir para fiscal, estoque e financeiro sem redigitação.' },
];

const flow = [
  { label: 'Cliente', input: 'Cadastro, limite e histórico', control: 'Condição e política comercial', output: 'Contexto da negociação' },
  { label: 'Preço', input: 'Produto, cliente e condição', control: 'Tabela, descontos e margem', output: 'Preço para negociação' },
  { label: 'Pedido', input: 'Itens, quantidades e entrega', control: 'Aprovações e atendimento', output: 'Venda confirmada' },
  { label: 'Estoque', input: 'Pedido confirmado', control: 'Saldo, reserva e disponibilidade', output: 'Separação ou atendimento parcial' },
  { label: 'Faturamento', input: 'Pedido liberado', control: 'Documento, valores e condição', output: 'Fiscal, estoque e financeiro atualizados' },
];

const situations = [
  ['Dar um preço sem perder margem', 'O vendedor consulta tabela, custo, condição e margem antes de fechar a negociação.'],
  ['Há saldo, mas uma parte está comprometida', 'A disponibilidade ajuda a diferenciar estoque físico do que realmente pode atender o pedido.'],
  ['O desconto está fora da política', 'A negociação pode seguir para validação antes de comprometer preço e rentabilidade.'],
  ['O pedido será atendido parcialmente', 'Itens disponíveis e pendentes ficam claros para combinar a entrega com o cliente.'],
  ['Uma venda aguarda liberação', 'A carteira mostra onde o pedido está parado e o que precisa acontecer para ele avançar.'],
  ['O pedido foi faturado', 'A movimentação segue conectada ao estoque, ao fiscal e ao financeiro.'],
];

const connections = [
  { key: 'crm', eyebrow: 'Oportunidades', label: 'CRM', text: 'Histórico e oportunidades chegam à negociação com contexto.', x: 18, y: 24 },
  { key: 'wms', eyebrow: 'Disponibilidade', label: 'Estoque e WMS', text: 'Saldo, reserva, separação e expedição continuam conectados.', x: 82, y: 24 },
  { key: 'ecommerce', eyebrow: 'Canais digitais', label: 'E-commerce', text: 'Pedidos dos canais digitais entram no mesmo fluxo comercial.', x: 14, y: 66 },
  { key: 'contabilidade', eyebrow: 'Faturamento', label: 'Fiscal e Contábil', text: 'O faturamento gera os documentos e movimentos correspondentes.', x: 50, y: 82 },
  { key: 'financeiro', eyebrow: 'Recebimentos', label: 'Financeiro', text: 'Condições e parcelas seguem para contas a receber e caixa.', x: 86, y: 66 },
];

function capabilityVisual(key) {
  if (key === 'pedido') return `<div class="sales-mini-order"><div><small>Cliente</small><b>Distribuidora Alfa</b></div><div><small>Pedido</small><b>048521</b></div><div class="wide"><span>Valor do pedido</span><strong>R$ 48.720,00</strong><em>Margem 24,8%</em></div><footer><span>18 produtos</span><b>Pronto para faturar</b></footer></div>`;
  if (key === 'preco') return `<div class="sales-mini-price"><span><small>Custo</small><b>R$ 89,30</b></span><i>→</i><span><small>Margem desejada</small><b>28%</b></span><i>→</i><span class="hot"><small>Preço</small><b>R$ 124,03</b></span></div>`;
  if (key === 'margem') return `<div class="sales-mini-margin"><span>Venda <b>12.450</b></span><span>Custo <b>8.930</b></span><strong>Margem <b>28,3%</b></strong></div>`;
  if (key === 'tabela') return `<div class="sales-mini-tags"><span class="on">Atacado</span><span>Indústria</span><span>Revenda</span></div>`;
  if (key === 'disponibilidade') return `<div class="sales-mini-stock"><span>Estoque <b>240</b></span><span>Reservado <b>80</b></span><strong>Disponível <b>160</b></strong></div>`;
  if (key === 'carteira') return `<div class="sales-mini-pipeline"><span><i></i>Em análise <b>12</b></span><span><i></i>Liberados <b>28</b></span><span><i></i>Faturados <b>41</b></span></div>`;
  if (key === 'comissoes') return `<div class="sales-mini-commission"><i></i><span><b>R$ 8.420</b><small>comissão prevista</small></span></div>`;
  return `<div class="sales-mini-billing"><span class="done">${icon('i-check', 'i')}Pedido</span><i></i><span class="done">${icon('i-check', 'i')}Nota</span><i></i><span>${icon('i-financeiro', 'i')}Financeiro</span></div>`;
}

function heroProduct() {
  return `<div class="sales-order" aria-label="Exemplo ilustrativo de um pedido comercial pronto para faturar">
    <div class="sales-order-top"><span><i></i><i></i><i></i></span><b>Comercial</b><em>Pedido 048521</em></div>
    <div class="sales-order-body">
      <div class="sales-customer"><div><small>Cliente</small><strong>Distribuidora Alfa</strong></div><span>Pronto para faturar</span></div>
      <div class="sales-order-main"><div><small>Valor do pedido</small><b>R$ 48.720,00</b></div><div class="margin"><small>Margem</small><b>24,8%</b></div></div>
      <div class="sales-availability"><header><small>Disponibilidade</small><b>18 produtos consultados</b></header><span class="ok">${icon('i-check', 'i')}16 itens disponíveis</span><span class="wait">2 itens com atendimento parcial</span></div>
      <div class="sales-condition"><div><small>Condição</small><b>28 / 35 / 42 dias</b></div><span>3 parcelas</span></div>
    </div>
  </div>
  <div class="sales-float sales-float--margin">${icon('i-check', 'i')}<span><small>Margem dentro da política</small><b>24,8%</b></span></div>
  <div class="sales-float sales-float--stock">${icon('i-wms', 'i')}<span><small>Estoque consultado</small><b>18 produtos</b></span></div>
  <div class="sales-float sales-float--limit">${icon('i-financeiro', 'i')}<span><small>Limite do cliente</small><b>Disponível</b></span></div>`;
}

function salesScreen() {
  const rows = [
    ['Produto A', '10', 'R$ 1.240,00', '28,1%', 'Disponível', 'ok'],
    ['Produto B', '4', 'R$ 3.860,00', '24,6%', 'Disponível', 'ok'],
    ['Produto C', '25', 'R$ 620,00', '22,9%', 'Parcial', 'wait'],
    ['Produto D', '8', 'R$ 672,50', '23,2%', 'Disponível', 'ok'],
  ];
  return `<div class="sales-screen" role="img" aria-label="Exemplo ilustrativo da tela de pedido comercial">
    <div class="sales-screen-bar"><span><i></i><i></i><i></i></span><b>Comercial · Pedido de venda</b><em class="module-system-illustrative-label">Tela ilustrativa</em></div>
    <div class="sales-screen-body"><div class="sales-screen-toolbar"><span>Cliente · Distribuidora Alfa</span><span>Tabela · Atacado</span><b>Pedido 048521</b></div>
    <div class="sales-screen-kpis"><div><small>Total</small><b>R$ 48.720,00</b></div><div><small>Margem</small><b>24,8%</b></div><div><small>Condição</small><b>28 / 35 / 42</b></div></div>
    <div class="sales-screen-scroll"><div class="sales-screen-table"><div class="th"><span>Produto</span><span>Qtd.</span><span>Preço</span><span>Margem</span><span>Atendimento</span></div>${rows.map((r) => `<div class="tr"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span><b>${r[3]}</b></span><span class="${r[5]}">${r[4]}</span></div>`).join('')}</div></div>
    <footer><span>Limite disponível</span><span>18 produtos consultados</span><b>Pronto para faturar</b></footer></div>
  </div>`;
}

export function renderCommercial(m) {
  const headHtml = head({ title: m.seoTitle, description: m.seoDesc, path: `${m.slug}.html`, schemas: [orgSchema(), faqSchema(m.faq)] });
  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Soluções', href: 'solucoes.html' }, { label: 'Comercial' }]);
  const localNav = `<nav class="module-nav" aria-label="Nesta solução"><div class="container module-nav-inner"><span>Comercial</span><div><a href="#visao-geral">Visão geral</a><a href="#capacidades">Capacidades</a><a href="#fluxo">Fluxo</a><a href="#tela">Tela</a><a href="#situacoes">Situações</a><a href="#integracoes">Integrações</a><a href="#faq">FAQ</a></div></div></nav>`;
  const hero = `<section class="mod-hero module-system-hero commercial-hero"><div class="container mod-hero-inner"><div class="reveal"><span class="mod-hero-icon">${icon(m.icon, 'i i-lg')}</span><p class="kicker">${esc(m.kicker)}</p><h1>${esc(m.h1)}</h1><p class="lede">${esc(m.lead)}</p><div class="mod-hero-cta"><a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="mod_comercial_demo">Agendar uma demonstração</a><a class="text-link" href="#capacidades">Ver como a venda avança${icon('i-chevron-right', 'i')}</a></div><ul class="mod-hero-meta"><li>${icon('i-check', 'i i-sm')}Preço e margem antes de confirmar</li><li>${icon('i-grid', 'i i-sm')}Parte do ERP Infoline</li></ul></div><div class="mod-hero-product module-system-hero-product commercial-hero-product reveal"><span class="mod-product-label">Tela ilustrativa</span>${heroProduct()}<small>Representação ilustrativa. Nenhum dado real é exibido.</small></div></div></section>`;
  const capabilitiesSection = `<section class="section commercial-capabilities" id="visao-geral"><div class="container"><div class="module-system-intro commercial-intro reveal"><p class="kicker">Comercial na prática</p><h2>Negocie com contexto. Proteja a margem. Faça o pedido avançar.</h2><p>O Comercial reúne preço, condição, disponibilidade e regras da venda. O pedido deixa de ser um registro isolado e passa a conduzir estoque, faturamento e financeiro.</p></div><div id="capacidades" class="module-system-bento commercial-bento reveal">${capabilities.map((item) => `<article class="module-system-cap-card commercial-cap-card commercial-cap-card--${item.key}${item.dominant ? ' is-dominant' : ''}"><div class="module-system-cap-heading commercial-cap-heading"><span>${icon(item.icon, 'i')}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></div>${capabilityVisual(item.key)}</article>`).join('')}</div></div></section>`;
  const flowSection = `<section class="section section--dark module-system-flow-section commercial-flow-section" id="fluxo"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Da negociação ao faturamento</p><h2>Uma venda contínua, <span>com cada decisão no lugar certo.</span></h2><p class="lede">Passe por cada etapa para entender o que entra, o que o sistema controla e qual informação segue adiante.</p></div></div><div class="module-system-flow commercial-flow reveal" data-commercial-flow data-module-flow><div class="module-system-flow-track commercial-flow-track">${flow.map((step, index) => `<button type="button" class="module-system-flow-step commercial-flow-step${index === 0 ? ' is-active' : ''}" aria-pressed="${index === 0 ? 'true' : 'false'}" data-flow-input="${esc(step.input)}" data-flow-control="${esc(step.control)}" data-flow-output="${esc(step.output)}"><span>${index + 1}</span><b>${esc(step.label)}</b></button>`).join('')}</div><div class="module-system-flow-detail commercial-flow-detail" aria-live="polite"><div><small>Entra</small><b data-flow-detail="input">${esc(flow[0].input)}</b></div><div><small>O sistema controla</small><b data-flow-detail="control">${esc(flow[0].control)}</b></div><div><small>Segue para a próxima etapa</small><b data-flow-detail="output">${esc(flow[0].output)}</b></div></div></div></div></section>`;
  const screenSection = `<section class="section module-system-screen-section commercial-screen-section" id="tela"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Veja o produto</p><h2>Veja o pedido antes de ele virar faturamento.</h2><p class="lede">Itens, preço, margem, disponibilidade e condição comercial permanecem na mesma visão para a equipe decidir com segurança.</p></div></div><div class="module-system-screen-stage commercial-screen-stage reveal">${salesScreen()}<div class="module-system-hotspot module-system-hotspot--1"><i>1</i><span><b>Preço aplicado</b><small>Tabela e condição usadas na negociação.</small></span></div><div class="module-system-hotspot module-system-hotspot--2"><i>2</i><span><b>Margem protegida</b><small>Rentabilidade visível antes da liberação.</small></span></div><div class="module-system-hotspot module-system-hotspot--3"><i>3</i><span><b>Disponibilidade real</b><small>Saldo e comprometimento orientam o atendimento.</small></span></div><div class="module-system-hotspot module-system-hotspot--4"><i>4</i><span><b>Pedido pronto</b><small>Condição validada para seguir ao faturamento.</small></span></div></div></div></section>`;
  const situationsSection = `<section class="section section--mist" id="situacoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Onde esse controle faz diferença</p><h2>Situações comerciais que pedem resposta antes de confirmar a venda.</h2></div></div><div class="module-system-situations commercial-situations reveal">${situations.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></article>`).join('')}</div></div></section>`;
  const integrationSection = `<section class="section commercial-integration" id="integracoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">ERP integrado</p><h2>A venda movimenta a empresa inteira.</h2><p class="lede">O pedido nasce com contexto comercial e continua conectado a estoque, faturamento, documentos e recebimentos.</p></div></div><div class="module-system-ecosystem module-system-ecosystem--premium commercial-ecosystem reveal" data-eco-count="5"><div class="module-system-ecosystem-head"><span><i></i> Fluxo integrado</span><b>Da oportunidade ao recebimento</b></div><svg viewBox="0 0 900 560" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="module-eco-line" x1="0" x2="1"><stop offset="0" stop-color="#38c8ff"/><stop offset="1" stop-color="#4d7dff"/></linearGradient></defs><ellipse cx="450" cy="270" rx="270" ry="174"/><path d="M450 263 C355 210 275 155 162 134"/><path d="M450 263 C545 210 625 155 738 134"/><path d="M450 263 C342 285 252 330 126 370"/><path d="M450 263 C450 330 450 395 450 459"/><path d="M450 263 C558 285 648 330 774 370"/></svg><div class="module-system-eco-center commercial-eco-center"><span>${icon('i-comercial', 'i')}</span><small>Venda integrada</small><b>Comercial</b><em>Negociação e pedido</em></div>${connections.map((item) => { const mod = modules[item.key]; return `<a class="module-system-eco-node commercial-eco-node" style="--x:${item.x}%;--y:${item.y}%" href="${mod.slug}.html"><span>${icon(mod.icon, 'i')}</span><div><em>${esc(item.eyebrow)}</em><b>${esc(item.label)}</b><small>${esc(item.text)}</small></div>${icon('i-arrow-right', 'i module-system-ecosystem-arrow')}</a>`; }).join('')}</div></div></section>`;
  const faqSection = `<section class="section" id="faq"><div class="container" style="max-width:900px"><div class="section-head reveal" style="display:block"><p class="kicker">Perguntas frequentes</p><h2>Sobre o Comercial</h2></div><div class="faq-list reveal">${m.faq.map(([q, a], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(q)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(a)}</p></details>`).join('')}</div></div></section>`;
  const ctaSection = `<section class="section"><div class="container"><div class="cta-banner reveal"><h2>${esc(m.cta)}</h2><p>Veja preço, margem, disponibilidade e faturamento funcionando na rotina comercial da sua empresa.</p><div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="mod_comercial_bottom">Agendar demonstração</a><a class="button button-ghost-dark" href="solucoes.html">Ver outras soluções</a></div></div></div></section>`;
  const body = `${header({ current: m.slug, variant: 'internal' })}${bc}<main id="conteudo">${hero}${localNav}${capabilitiesSection}${flowSection}${screenSection}${situationsSection}${integrationSection}${faqSection}${ctaSection}</main>${footer()}`;
  return { headHtml, body, styles: ['module.css', 'module-system.css', 'commercial.css'], pageType: 'module', moduleKey: m.key, solutionGroup: m.group };
}
