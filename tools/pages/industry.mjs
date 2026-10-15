import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';
import { heroMock, screenMock } from '../mocks.mjs';

const industryFaq = [
  ['Minha indústria ainda usa muitas planilhas. O Infoline pode centralizar esses processos?', 'Sim. O objetivo da gestão industrial é conectar planejamento, produção, materiais, estoque, compras, custos e demais áreas do ERP, reduzindo informações mantidas isoladamente entre setores.'],
  ['O Infoline atende empresas industriais?', 'Sim. A gestão industrial conecta planejamento, materiais, produção, estoque, compras, custos e as demais áreas administrativas no mesmo ERP.'],
  ['PCPM e MRP fazem parte da solução?', 'Sim. PCPM, MRP, estruturas de produto, ordens, carga de máquina e apontamentos são recursos técnicos usados para planejar e acompanhar a produção.'],
  ['É possível comparar o planejado com o realizado?', 'Sim. As ordens e os apontamentos permitem acompanhar quantidades planejadas, produzidas e pendentes, ajudando a identificar desvios durante a execução.'],
  ['A produção se conecta ao estoque e às compras?', 'Sim. A necessidade de materiais pode ser analisada junto da disponibilidade em estoque e das rotinas de compras, evitando informações isoladas entre as áreas.'],
];

const connected = [
  ['compras', 'Compras', 'Material necessário para manter a produção.'],
  ['wms', 'Estoque e WMS', 'Controle de materiais, armazenagem e disponibilidade para a operação.'],
  ['custos', 'Custos', 'Conheça melhor o custo de produzir cada item.'],
  ['comercial', 'Vendas', 'A demanda comercial ajudando a orientar o planejamento.'],
  ['financeiro', 'Financeiro', 'Compras, faturamento e compromissos financeiros conectados à operação.'],
];

export function renderIndustry() {
  const headHtml = head({
    title: 'ERP para Indústria: Produção, Estoque e Custos | Infoline',
    description: 'ERP para indústrias que conecta planejamento, materiais, produção, estoque, compras e custos para dar mais controle à rotina da fábrica.',
    path: 'erp-para-industria.html',
    schemas: [orgSchema(), faqSchema(industryFaq)],
  });

  const bc = breadcrumb([
    { label: 'Início', href: 'index.html' },
    { label: 'Soluções', href: 'solucoes.html' },
    { label: 'Gestão Industrial' },
  ]);

  const localNav = `
<nav class="module-nav" aria-label="Nesta solução">
  <div class="container module-nav-inner">
    <span>Gestão Industrial</span>
    <div>
      <a href="#visao-geral">Visão geral</a><a href="#como-funciona">Como funciona</a><a href="#recursos">Recursos</a><a href="#integracoes">Integrações</a><a href="#faq">FAQ</a>
    </div>
  </div>
</nav>`;

  const heroSection = `
<section class="mod-hero industry-hero">
  <div class="container mod-hero-inner">
    <div class="reveal">
      <span class="mod-hero-icon">${icon('i-pcpm', 'i i-lg')}</span>
      <p class="kicker">ERP para indústrias</p>
      <h1>Tenha sua fábrica sob controle, do planejamento ao produto acabado.</h1>
      <p class="lede">Planeje o que produzir, antecipe materiais e acompanhe a execução da fábrica sem depender de planilhas e informações espalhadas.</p>
      <div class="mod-hero-cta">
        <a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="industria_hero_demo">Agendar uma demonstração</a>
        <a class="button button-outline" href="#visao-geral">Conhecer a gestão industrial</a>
      </div>
      <ul class="mod-hero-meta industry-benefits" aria-label="Benefícios da gestão industrial">
        <li>${icon('i-check', 'i i-sm')}Planejamento integrado</li>
        <li>${icon('i-check', 'i i-sm')}Produção e materiais conectados</li>
        <li>${icon('i-check', 'i i-sm')}Informação atualizada para toda a operação</li>
      </ul>
      <p class="industry-proof">PCP <span>·</span> MRP <span>·</span> Produção <span>·</span> Estoque <span>·</span> Compras <span>·</span> Custos</p>
    </div>
    <div class="mod-hero-product reveal" role="img" aria-label="Representação ilustrativa do planejamento e acompanhamento da produção">
      <span class="mod-product-label">Operação industrial</span>${heroMock.pcpm()}<small>Representação ilustrativa. Nenhum dado real é exibido.</small>
    </div>
  </div>
</section>`;

  const overviewSection = `
<section class="section" id="visao-geral">
  <div class="container mod-overview industry-overview">
    <div class="mod-overview-text reveal">
      <p class="kicker">Controle antes do problema</p>
      <h2>Antecipe problemas antes que eles parem a produção.</h2>
      <p>Produção, estoque e compras trabalham com a mesma informação para que sua equipe enxergue necessidades, prioridades e possíveis faltas antes que elas afetem a fábrica.</p>
      <p>A Infoline conecta planejamento e execução para mostrar o que precisa ser feito, o que já está acontecendo e onde sua equipe precisa agir.</p>
    </div>
    <aside class="mod-aside reveal">
      <h3>Mais controle sobre a rotina da fábrica</h3>
      <ul class="feature-list">${['Saiba o que precisa entrar em produção','Antecipe o que precisa ser comprado','Acompanhe a produção em andamento','Padronize como cada produto é fabricado','Planeje máquinas e capacidade','Compare o planejado com o realizado'].map((item) => `<li>${icon('i-check', 'i')}<span>${esc(item)}</span></li>`).join('')}</ul>
    </aside>
  </div>
</section>`;

  const steps = [
    ['Defina como o produto é fabricado', 'Cadastre os materiais, etapas, processos e recursos necessários para produzir cada item.'],
    ['Saiba o que comprar e o que produzir', 'O sistema cruza a demanda com estoque, compras e produção para ajudar a identificar o que precisa ser comprado ou produzido.'],
    ['Organize o que entra em produção', 'Transforme a necessidade em ordens e acompanhe prioridades, produtos, quantidades e prazos.'],
    ['Planeje máquinas e capacidade', 'Distribua a produção considerando máquinas, capacidade e restrições do processo.'],
    ['Acompanhe a produção enquanto ela acontece', 'Registre o que foi produzido, identifique diferenças e saiba o que ainda falta concluir durante a execução.'],
  ];

  const processSection = `
<section class="section" id="como-funciona">
  <div class="container mod-action industry-process reveal">
    <div class="industry-process-head"><p class="kicker">Na prática</p><h2>Da necessidade à produção, sem perder informação pelo caminho.</h2><p class="lede">Cada etapa alimenta a seguinte para que o planejamento acompanhe a realidade da fábrica.</p></div>
    <div class="industry-steps">${steps.map((step, index) => `<article class="industry-step"><span class="mod-flow-num">${index + 1}</span><div><h3>${esc(step[0])}</h3><p>${esc(step[1])}</p></div></article>`).join('')}</div>
    <p class="industry-technical">Estrutura <span>·</span> MRP <span>·</span> Ordens de produção <span>·</span> Carga máquina <span>·</span> Apontamentos</p>
  </div>
</section>`;

  const screenSection = `
<section class="section section--mist" id="acompanhamento">
  <div class="container screen-section industry-screen">
    <div class="screen-section-text reveal"><p class="kicker">A operação em um só lugar</p><h2>Veja rapidamente o que está acontecendo na produção.</h2><p class="lede">Acompanhe o que foi planejado, o que já foi produzido e o que ainda precisa ser executado. Assim, a equipe consegue identificar prioridades e agir antes que um atraso comprometa a operação.</p></div>
    <div class="reveal">${screenMock('pcpm')}</div>
  </div>
</section>`;

  const capabilityGroups = [
    ['Planeje antes de produzir', [['Antecipe materiais e necessidades','Saiba o que será necessário para atender a produção e reduza decisões de última hora.'],['Organize prioridades','Organize o que deve entrar em produção e acompanhe suas prioridades.']]],
    ['Estruture sua fábrica', [['Padronize como cada produto é feito','Organize matérias-primas, componentes, versões, processos e etapas de fabricação.'],['Use melhor seus recursos','Planeje máquinas e capacidade conforme as necessidades da produção.']]],
    ['Acompanhe a execução', [['Saiba o que está acontecendo no chão de fábrica','Acompanhe quantidades planejadas, produzidas e pendentes.'],['Identifique desvios','Compare planejamento e execução para agir sobre atrasos, perdas e diferenças.']]],
  ];

  const capabilitiesSection = `
<section class="section" id="recursos"><div class="container">
  <div class="section-head reveal"><div class="section-head-text"><p class="kicker">Gestão industrial na prática</p><h2>Mais previsibilidade para a rotina da sua fábrica.</h2></div></div>
  <div class="industry-capabilities reveal">${capabilityGroups.map((group) => `<article class="industry-capability"><h3>${esc(group[0])}</h3>${group[1].map((item) => `<div><b>${esc(item[0])}</b><p>${esc(item[1])}</p></div>`).join('')}</article>`).join('')}</div>
  <div class="industry-technical-link reveal"><a class="text-link" href="pcpm.html">Ver todos os recursos técnicos do PCPM${icon('i-arrow-right', 'i')}</a></div>
</div></section>`;

  const integrationsSection = `
<section class="section section--mist" id="integracoes"><div class="container">
  <div class="section-head reveal industry-integrations-head"><div class="section-head-text"><p class="kicker">ERP integrado</p><h2>Produção não funciona isolada. <span>Seu ERP também não deveria.</span></h2><p class="lede">O planejamento industrial se conecta às demais áreas da empresa para que uma decisão na fábrica não dependa de informações espalhadas em sistemas diferentes.</p></div></div>
  <div class="related-grid industry-related reveal">${connected.map(([key, title, text]) => { const m = modules[key]; return `<a class="related-card" href="${m.slug}.html"><span class="related-card-ico">${icon(m.icon, 'i')}</span><div><b>${esc(title)}</b><span>${esc(text)}</span></div></a>`; }).join('')}</div>
</div></section>`;

  const faqSection = `
<section class="section" id="faq"><div class="container" style="max-width:900px;">
  <div class="section-head reveal" style="display:block;"><p class="kicker">Perguntas frequentes</p><h2>Sobre o ERP para indústrias</h2></div>
  <div class="faq-list reveal">${industryFaq.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(question)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(answer)}</p></details>`).join('')}</div>
</div></section>`;

  const ctaSection = `
<section class="section industry-final"><div class="container"><div class="cta-banner reveal">
  <h2>Quer enxergar sua produção inteira em um único lugar?</h2>
  <p>Conte como sua fábrica trabalha hoje e veja como a Infoline pode conectar planejamento, materiais, produção, estoque e gestão.</p>
  <div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="industria_bottom_demo">Agendar uma demonstração</a></div>
</div></div></section>`;

  const body = `${header({ current: 'erp-para-industria', variant: 'internal' })}${bc}<main id="conteudo">${heroSection}${localNav}${overviewSection}${processSection}${screenSection}${capabilitiesSection}${integrationsSection}${faqSection}${ctaSection}</main>${footer()}`;

  return { headHtml, body, styles: ['module.css', 'industry.css'], pageType: 'solution', solutionGroup: 'industria' };
}
