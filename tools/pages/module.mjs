import { esc, icon, pic } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { groups, modules, relatedOf } from '../content.mjs';
import { heroMock, screenMock } from '../mocks.mjs';
import { renderPcpm } from './pcpm.mjs';
import { renderCommercial } from './commercial.mjs';
import { renderWms } from './wms.mjs';
import { renderPurchases } from './purchases.mjs';
import { renderFinancial } from './financial.mjs';
import { renderCosts } from './costs.mjs';
import { renderCrm } from './crm.mjs';
import { renderEcommerce } from './ecommerce.mjs';
import { renderAccounting } from './accounting.mjs';
import { renderControllership } from './controllership.mjs';
import { renderHr } from './hr.mjs';
import { renderProcesses } from './processes.mjs';
import { renderWhatsapp } from './whatsapp.mjs';

const customRenderers = {
  pcpm: renderPcpm,
  comercial: renderCommercial,
  wms: renderWms,
  compras: renderPurchases,
  financeiro: renderFinancial,
  custos: renderCosts,
  crm: renderCrm,
  ecommerce: renderEcommerce,
  contabilidade: renderAccounting,
  controladoria: renderControllership,
  rh: renderHr,
  processos: renderProcesses,
  whatsapp: renderWhatsapp,
};

export function renderModule(m) {
  const customRenderer = customRenderers[m.key];
  if (customRenderer) return customRenderer(m);
  const group = groups.find((g) => g.key === m.group);
  const parentSolution = {
    pcpm: { label: 'Gestão Industrial', href: 'erp-para-industria.html' },
    compras: { label: 'Gestão para Importadores', href: 'erp-para-importadores.html' },
    wms: { label: 'Atacado e Distribuição', href: 'erp-para-atacado-distribuicao.html' },
  }[m.key];
  const headHtml = head({
    title: m.seoTitle, description: m.seoDesc, path: `${m.slug}.html`,
    schemas: [orgSchema(), faqSchema(m.faq)],
  });

  const bc = breadcrumb(parentSolution ? [
    { label: 'Início', href: 'index.html' },
    { label: parentSolution.label, href: parentSolution.href },
    { label: m.navName || m.name },
  ] : [
    { label: 'Início', href: 'index.html' },
    { label: group.name, href: `index.html#area-${group.key}` },
    { label: m.navName || m.name },
  ]);

  const localNav = `
<nav class="module-nav" aria-label="Nesta solução">
  <div class="container module-nav-inner">
    <span>${esc(m.navName || m.name)}</span>
    <div>
      <a href="#visao-geral">Visão geral</a>
      <a href="#na-pratica">Na prática</a>
      ${m.catalogTitle ? '<a href="#recursos">Recursos</a>' : ''}
      ${relatedOf(m.key).length ? '<a href="#integracoes">Integrações</a>' : ''}
      <a href="#faq">FAQ</a>
    </div>
  </div>
</nav>`;

  const heroSection = `
<section class="mod-hero">
  <div class="container mod-hero-inner">
    <div class="reveal">
      <span class="mod-hero-icon">${icon(m.icon, 'i i-lg')}</span>
      <p class="kicker">${esc(m.kicker)}</p>
      <h1>${esc(m.h1)}</h1>
      <p class="lede">${esc(m.lead)}</p>
      <div class="mod-hero-cta">
        <a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="mod_${m.key}_demo">Agendar uma demonstração</a>
        <a class="text-link" href="${parentSolution ? parentSolution.href : '#visao-geral'}">${parentSolution ? `Conhecer ${parentSolution.label.toLowerCase()}` : 'Ver o que o módulo faz'}${icon('i-chevron-right', 'i')}</a>
      </div>
      <ul class="mod-hero-meta" aria-label="Informações da solução">
        <li>${icon('i-check', 'i i-sm')}Parte do ERP integrado</li>
        <li>${icon('i-grid', 'i i-sm')}${esc(group.name)}</li>
      </ul>
    </div>
    <div class="mod-hero-product reveal" role="img" aria-label="Representação ilustrativa do módulo ${esc(m.navName || m.name)}">
      <span class="mod-product-label">Tela ilustrativa</span>
      ${heroMock[m.hero] ? heroMock[m.hero]() : ''}
      <small>Representação ilustrativa. Nenhum dado real é exibido.</small>
    </div>
  </div>
</section>`;

  const overviewSection = `
<section class="section" id="visao-geral">
  <div class="container mod-overview">
    <div class="mod-overview-text reveal">
      <p class="kicker">Visão geral</p>
      ${m.overview.map((p) => `<p>${esc(p)}</p>`).join('')}
      <figure class="mod-context-photo">
        ${pic({ img: m.photo.img, ratio: m.photo.ratio, widths: [480, 800, 1200], alt: m.photo.alt, sizes: '(max-width: 1080px) 92vw, 760px' })}
        <figcaption>O módulo conecta essa rotina às demais áreas do ERP Infoline.</figcaption>
      </figure>
    </div>
    <aside class="mod-aside reveal">
      <h3>O que o módulo cobre</h3>
      <ul class="feature-list">
        ${m.features.map((f) => `<li>${icon('i-check', 'i')}<span>${esc(f)}</span></li>`).join('')}
      </ul>
    </aside>
  </div>
</section>`;

  const stepsHtml = (m.action.steps || []).map((s, i) => `
    <div class="mod-flow-step">
      <span class="mod-flow-num">${i + 1}</span>
      <div><b>${esc(s[0])}</b><p>${esc(s[1])}</p></div>
    </div>`).join('');

  const chipsHtml = m.action.chips
    ? `<div class="mod-chips-cloud">${m.action.chips.map((c) => `<span class="m-chip blue">${esc(c)}</span>`).join('')}</div>`
    : '';

  const actionSection = `
<section class="section" id="na-pratica">
  <div class="container mod-action reveal">
    <div class="mod-action-layout">
      <div>
        <h2>${esc(m.action.title)}</h2>
        <p class="lede" style="margin:14px 0 22px;">${esc(m.action.text)}</p>
        ${stepsHtml ? `<div class="mod-action-steps">${stepsHtml}</div>` : ''}
        ${chipsHtml}
      </div>
      <div>${heroMock[m.hero] ? heroMock[m.hero]() : ''}</div>
    </div>
    ${m.action.impact ? `
    <div style="margin-top:36px;">
      ${m.action.impactTitle ? `<h3 style="color:#fff; margin-bottom:16px;">${esc(m.action.impactTitle)}</h3>` : ''}
      <div class="impact-grid">
        ${m.action.impact.map((it) => `<div class="impact-item"><b>${esc(it[0])}</b><p>${esc(it[1])}</p></div>`).join('')}
      </div>
    </div>` : ''}
  </div>
</section>`;

  const screenSection = m.action.screen ? `
<section class="section section--mist" id="tela">
  <div class="container screen-section">
    <div class="screen-section-text reveal">
      <p class="kicker">Exemplo de tela</p>
      <h2>${esc(m.action.screen.title)}</h2>
      <p class="lede">${esc(m.action.screen.text)}</p>
    </div>
    <div class="reveal">${screenMock(m.action.screen.kind, m.action.screen)}</div>
  </div>
</section>` : '';

  const catalogSection = m.catalogTitle ? `
<section class="section" id="recursos">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="kicker">Dentro do ${esc(m.navName || m.name)}</p>
        <h2>${esc(m.catalogTitle)}</h2>
      </div>
    </div>
    <div class="catalog-grid reveal">
      ${m.groups.map((g) => `
      <div class="catalog-col">
        <h3>${esc(g[0])}</h3>
        <ul>${g[1].map((item) => `<li>${esc(item)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>
</section>` : '';

  const related = relatedOf(m.key);
  const relatedSection = related.length ? `
<section class="section section--mist" id="integracoes">
  <div class="container">
    <div class="section-head reveal" style="display:block;">
      <p class="kicker">Conecta com</p>
      <h2>Este módulo <span>não trabalha sozinho.</span></h2>
    </div>
    <div class="related-grid reveal">
      ${related.map((r) => { const rm = modules[r.key]; return `
      <a class="related-card" href="${rm.slug}.html">
        <span class="related-card-ico">${icon(rm.icon, 'i')}</span>
        <div><b>${esc(rm.navName || rm.name)}</b><span>${esc(r.label)}</span></div>
      </a>`; }).join('')}
    </div>
  </div>
</section>` : '';

  const faqSection = `
<section class="section" id="faq">
  <div class="container" style="max-width:900px;">
    <div class="section-head reveal" style="display:block;">
      <p class="kicker">Perguntas frequentes</p>
      <h2>Sobre o ${esc(m.navName || m.name)}</h2>
    </div>
    <div class="faq-list reveal">
      ${m.faq.map(([q, a], i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary>${esc(q)}${icon('i-plus', 'i')}</summary>
        <p class="faq-item-a">${esc(a)}</p>
      </details>`).join('')}
    </div>
  </div>
</section>`;

  const ctaSection = `
<section class="section">
  <div class="container">
    <div class="cta-banner reveal">
      <h2>${esc(m.cta)}</h2>
      <p>Um especialista apresenta o ${esc(m.navName || m.name)} aplicado à realidade da sua empresa.</p>
      <div class="cta-banner-actions">
        <a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="mod_${m.key}_bottom">Agendar demonstração</a>
        <a class="button button-ghost-dark" href="solucoes.html">Ver outras soluções</a>
      </div>
    </div>
  </div>
</section>`;

  const body = `
${header({ current: m.slug, variant: 'internal' })}
${bc}
<main id="conteudo">
  ${heroSection}
  ${localNav}
  ${overviewSection}
  ${actionSection}
  ${screenSection}
  ${catalogSection}
  ${relatedSection}
  ${faqSection}
  ${ctaSection}
</main>
${footer()}`;

  return {
    headHtml,
    body,
    styles: ['module.css'],
    pageType: 'module',
    moduleKey: m.key,
    solutionGroup: m.group,
  };
}
