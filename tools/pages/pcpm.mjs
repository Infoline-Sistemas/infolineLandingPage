import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';
import { screenMock } from '../mocks.mjs';

const capabilities = [
  { key: 'mrp', icon: 'i-pcpm', title: 'Planejamento e MRP', text: 'Saiba o que precisa ser comprado ou produzido antes de liberar a fábrica.', dominant: true },
  { key: 'ordens', icon: 'i-grid', title: 'Ordens de produção', text: 'Organize o que entra em produção e acompanhe cada OP.' },
  { key: 'materiais', icon: 'i-compras', title: 'Materiais', text: 'Compare necessidade, disponibilidade e saldo comprometido.' },
  { key: 'engenharia', icon: 'i-processos', title: 'Engenharia', text: 'Estruture produtos, versões, processos e roteiros de fabricação.' },
  { key: 'capacidade', icon: 'i-pcpm', title: 'Capacidade', text: 'Planeje máquinas e restrições antes de programar a produção.' },
  { key: 'apontamentos', icon: 'i-check', title: 'Apontamentos', text: 'Compare o planejado, o produzido e o saldo que falta executar.' },
  { key: 'custos', icon: 'i-custos', title: 'Custos', text: 'Leve estrutura, máquinas e execução para a análise do custo industrial.' },
];

const flow = [
  { label: 'Demanda', input: 'Previsões e pedidos', control: 'Prioridades e prazos', output: 'Sinal para o planejamento' },
  { label: 'MRP', input: 'Demanda e estruturas', control: 'Necessidade líquida', output: 'Comprar ou produzir' },
  { label: 'Materiais', input: 'Estoque e reservas', control: 'Disponibilidade real', output: 'Liberação ou compra' },
  { label: 'Ordem', input: 'Material e capacidade', control: 'Quantidades, máquinas e datas', output: 'Produção programada' },
  { label: 'Apontamento', input: 'Execução da fábrica', control: 'Produzido, desvios e saldo', output: 'Estoque e gestão atualizados' },
];

const situations = [
  ['Falta matéria-prima para iniciar uma OP', 'O MRP evidencia a necessidade antes da liberação e ajuda a direcionar o que precisa ser comprado.'],
  ['A previsão comercial mudou', 'O planejamento pode ser revisto com a nova demanda antes de comprometer materiais e capacidade.'],
  ['Existe saldo, mas o material já está comprometido', 'A análise considera disponibilidade e necessidade para evitar decisões baseadas apenas no saldo físico.'],
  ['Uma ordem está atrasando', 'Datas, situação, máquina e saldo a produzir ficam reunidos para a equipe agir sobre a pendência.'],
  ['A produção terminou apenas uma parte', 'O apontamento registra o produzido e mantém visível a quantidade que ainda precisa ser executada.'],
];

const connections = [
  { key: 'compras', label: 'Compras', text: 'Necessidades de materiais mostram o que precisa ser comprado.', x: 17, y: 18 },
  { key: 'custos', label: 'Gestão de Custos', text: 'Estruturas, máquinas e execução apoiam o custo industrial.', x: 83, y: 18 },
];

function capabilityVisual(key) {
  if (key === 'mrp') return `<div class="pcpm-mini-mrp"><div><small>Demanda</small><b>1.200 un.</b></div><span>−</span><div><small>Disponível</small><b>864 un.</b></div><span>=</span><div class="warn"><small>Necessidade</small><b>336 un.</b></div></div>`;
  if (key === 'ordens') return `<div class="pcpm-mini-orders"><span><b>OP 015843</b><i style="--p:72%"></i><small>72%</small></span><span><b>OP 015844</b><i style="--p:38%"></i><small>38%</small></span></div>`;
  if (key === 'materiais') return `<div class="pcpm-mini-stock"><i style="--h:82%"></i><i style="--h:56%"></i><i class="warn" style="--h:24%"></i><i style="--h:68%"></i></div>`;
  if (key === 'engenharia') return `<div class="pcpm-mini-tree"><b>Produto</b><span></span><em>Componentes</em><em>Roteiro</em></div>`;
  if (key === 'capacidade') return `<div class="pcpm-mini-capacity"><span>Máq. 01<i style="--w:86%"></i></span><span>Máq. 02<i style="--w:62%"></i></span><span>Máq. 03<i style="--w:38%"></i></span></div>`;
  if (key === 'apontamentos') return `<div class="pcpm-mini-progress"><span>864</span><i></i><small>de 1.200 produzidas</small></div>`;
  return `<div class="pcpm-mini-cost"><span>Material</span><span>Máquina</span><span>Mão de obra</span></div>`;
}

function heroProduct() {
  return `<div class="pcpm-product" aria-label="Exemplo ilustrativo de acompanhamento de uma ordem de produção">
    <div class="pcpm-product-top"><span><i></i><i></i><i></i></span><b>PCPM</b><em>Hoje</em></div>
    <div class="pcpm-product-body">
      <div class="pcpm-op-head"><div><small>Ordem de produção</small><strong>OP 015843</strong></div><span>Em andamento</span></div>
      <div class="pcpm-op-progress"><i style="--progress:72%"></i></div>
      <div class="pcpm-op-progress-label"><span>72% concluída</span><span>Saldo: 336 un.</span></div>
      <div class="pcpm-product-kpis"><div><small>Materiais disponíveis</small><b>18</b></div><div class="warn"><small>Necessidade de compra</small><b>2 itens</b></div><div><small>Previsto</small><b>1.200 un.</b></div><div><small>Produzido</small><b>864 un.</b></div></div>
      <div class="pcpm-next"><span>${icon('i-chevron-right', 'i')}</span><div><small>Próxima etapa</small><b>Acabamento</b></div><em>Previsão 28/09</em></div>
    </div>
  </div>
  <div class="pcpm-float pcpm-float--available">${icon('i-check', 'i')}<span><small>Material disponível</small><b>Produção liberada</b></span></div>
  <div class="pcpm-float pcpm-float--purchase">${icon('i-compras', 'i')}<span><small>Necessidade de compra</small><b>2 itens</b></span></div>
  <div class="pcpm-float pcpm-float--date">${icon('i-pcpm', 'i')}<span><small>Previsão de conclusão</small><b>28/09</b></span></div>`;
}

export function renderPcpm(m) {
  const headHtml = head({ title: m.seoTitle, description: m.seoDesc, path: `${m.slug}.html`, schemas: [orgSchema(), faqSchema(m.faq)] });
  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Soluções', href: 'solucoes.html' }, { label: 'PCPM' }]);
  const localNav = `<nav class="module-nav" aria-label="Nesta solução"><div class="container module-nav-inner"><span>PCPM</span><div><a href="#visao-geral">Visão geral</a><a href="#capacidades">Capacidades</a><a href="#fluxo">Fluxo</a><a href="#tela">Tela</a><a href="#situacoes">Situações</a><a href="#integracoes">Integrações</a><a href="#faq">FAQ</a></div></div></nav>`;

  const hero = `<section class="mod-hero module-system-hero pcpm-hero"><div class="container mod-hero-inner"><div class="reveal"><span class="mod-hero-icon">${icon(m.icon, 'i i-lg')}</span><p class="kicker">${esc(m.kicker)}</p><h1>${esc(m.h1)}</h1><p class="lede">${esc(m.lead)}</p><div class="mod-hero-cta"><a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="mod_pcpm_demo">Agendar uma demonstração</a><a class="text-link" href="erp-para-industria.html">Conhecer gestão industrial${icon('i-chevron-right', 'i')}</a></div><ul class="mod-hero-meta"><li>${icon('i-check', 'i i-sm')}Planejamento e execução conectados</li><li>${icon('i-grid', 'i i-sm')}Parte do ERP Infoline</li></ul></div><div class="mod-hero-product module-system-hero-product pcpm-hero-product reveal"><span class="mod-product-label">Tela ilustrativa</span>${heroProduct()}<small>Representação ilustrativa. Nenhum dado real é exibido.</small></div></div></section>`;

  const capabilitiesSection = `<section class="section pcpm-capabilities" id="visao-geral"><div class="container"><div class="module-system-intro pcpm-intro reveal"><p class="kicker">PCPM na prática</p><h2>Planeje o que produzir. Saiba o que falta. Acompanhe o que está acontecendo.</h2><p>A engenharia estrutura produtos e processos. O MRP calcula necessidades. A programação organiza materiais, máquinas e ordens. Os apontamentos mostram o que já foi produzido e o saldo que ainda precisa ser executado.</p></div><div id="capacidades" class="module-system-bento pcpm-bento reveal">${capabilities.map((item) => `<article class="module-system-cap-card pcpm-cap-card pcpm-cap-card--${item.key}${item.dominant ? ' is-dominant' : ''}"><div class="module-system-cap-heading pcpm-cap-heading"><span>${icon(item.icon, 'i')}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></div></div>${capabilityVisual(item.key)}</article>`).join('')}</div></div></section>`;

  const flowSection = `<section class="section section--dark module-system-flow-section pcpm-flow-section" id="fluxo"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Do planejamento ao apontamento</p><h2>Uma linha operacional contínua, <span>sem perder o contexto.</span></h2><p class="lede">Passe por cada etapa para ver o que entra, o que o sistema controla e qual informação segue adiante.</p></div></div><div class="module-system-flow pcpm-flow reveal" data-pcpm-flow data-module-flow><div class="module-system-flow-track pcpm-flow-track">${flow.map((step, index) => `<button type="button" class="module-system-flow-step pcpm-flow-step${index === 0 ? ' is-active' : ''}" aria-pressed="${index === 0 ? 'true' : 'false'}" data-flow-input="${esc(step.input)}" data-flow-control="${esc(step.control)}" data-flow-output="${esc(step.output)}"><span>${index + 1}</span><b>${esc(step.label)}</b></button>`).join('')}</div><div class="module-system-flow-detail pcpm-flow-detail" aria-live="polite"><div><small>Entra</small><b data-flow-detail="input">${esc(flow[0].input)}</b></div><div><small>O sistema controla</small><b data-flow-detail="control">${esc(flow[0].control)}</b></div><div><small>Segue para a próxima etapa</small><b data-flow-detail="output">${esc(flow[0].output)}</b></div></div></div></div></section>`;

  const screenSection = `<section class="section module-system-screen-section pcpm-screen-section" id="tela"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Veja o produto</p><h2>Acompanhe cada ordem com o planejado, o produzido e o saldo na mesma visão.</h2><p class="lede">A tela reúne período, máquina, datas, quantidades e situação para transformar o planejamento em acompanhamento diário.</p></div></div><div class="module-system-screen-stage pcpm-screen-stage reveal">${screenMock('pcpm', m.action.screen)}<div class="module-system-hotspot module-system-hotspot--1"><i>1</i><span><b>Necessidade calculada</b><small>O MRP mostra o que precisa ser atendido.</small></span></div><div class="module-system-hotspot module-system-hotspot--2"><i>2</i><span><b>Saldo disponível</b><small>Materiais e reservas apoiam a decisão.</small></span></div><div class="module-system-hotspot module-system-hotspot--3"><i>3</i><span><b>Ordem em andamento</b><small>Situação, máquina e datas ficam visíveis.</small></span></div><div class="module-system-hotspot module-system-hotspot--4"><i>4</i><span><b>Quantidade produzida</b><small>Produzido e saldo aparecem lado a lado.</small></span></div></div></div></section>`;

  const situationsSection = `<section class="section section--mist" id="situacoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">Onde esse controle faz diferença</p><h2>Situações reais que deixam de depender de conferências espalhadas.</h2></div></div><div class="module-system-situations module-system-situations--five pcpm-situations reveal">${situations.map((item, index) => `<article><span>0${index + 1}</span><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></article>`).join('')}</div></div></section>`;

  const integrationCard = (item, eyebrow) => { const mod = modules[item.key]; return `<a class="module-system-eco-node pcpm-eco-node pcpm-eco-node--${item.key}" href="${mod.slug}.html"><span>${icon(mod.icon, 'i')}</span><div><em>${esc(eyebrow)}</em><b>${esc(item.label)}</b><small>${esc(item.text)}</small></div>${icon('i-arrow-right', 'i pcpm-eco-arrow')}</a>`; };
  const integrationSection = `<section class="section pcpm-integration" id="integracoes"><div class="container"><div class="section-head reveal"><div class="section-head-text"><p class="kicker">ERP integrado</p><h2>O PCPM não trabalha sozinho.</h2><p class="lede">A produção ganha contexto quando necessidades de materiais e custos continuam conectados às demais áreas.</p></div></div><div class="module-system-ecosystem pcpm-ecosystem reveal"><div class="pcpm-ecosystem-top"><span><i></i> Fluxo integrado</span><b>Da necessidade ao custo industrial</b></div><div class="pcpm-ecosystem-flow">${integrationCard(connections[0], 'Abastecimento')}<div class="pcpm-ecosystem-bridge pcpm-ecosystem-bridge--materials"><span>Necessidade de materiais</span><i></i></div><div class="module-system-eco-center pcpm-eco-center"><span>${icon('i-pcpm', 'i')}</span><small>Planejamento</small><b>PCPM</b><em>Produção sob controle</em></div><div class="pcpm-ecosystem-bridge pcpm-ecosystem-bridge--costs"><span>Estrutura e execução</span><i></i></div>${integrationCard(connections[1], 'Formação econômica')}</div><div class="pcpm-ecosystem-foot"><span>Compras abastecem o planejamento</span><i></i><span>A execução apoia o custo industrial</span></div></div></div></section>`;

  const faqSection = `<section class="section" id="faq"><div class="container" style="max-width:900px"><div class="section-head reveal" style="display:block"><p class="kicker">Perguntas frequentes</p><h2>Sobre o PCPM</h2></div><div class="faq-list reveal">${m.faq.map(([q, a], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(q)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(a)}</p></details>`).join('')}</div></div></section>`;
  const ctaSection = `<section class="section"><div class="container"><div class="cta-banner reveal"><h2>${esc(m.cta)}</h2><p>Veja o PCPM aplicado à rotina da sua fábrica, do cálculo de materiais ao acompanhamento das ordens.</p><div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="mod_pcpm_bottom">Agendar demonstração</a><a class="button button-ghost-dark" href="erp-para-industria.html">Voltar para Gestão Industrial</a></div></div></div></section>`;
  const body = `${header({ current: m.slug, variant: 'internal' })}${bc}<main id="conteudo">${hero}${localNav}${capabilitiesSection}${flowSection}${screenSection}${situationsSection}${integrationSection}${faqSection}${ctaSection}</main>${footer()}`;
  return { headHtml, body, styles: ['module.css', 'module-system.css', 'pcpm.css'], pageType: 'module', moduleKey: m.key, solutionGroup: m.group };
}
