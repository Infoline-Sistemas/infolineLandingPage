import { esc, icon, logoMark, waLink, base } from './lib.mjs';
import { site, modules, moduleOrder } from './content.mjs';

const B = () => base();

const sectorPages = [
  { slug: 'erp-para-industria', label: 'Gestão Industrial', icon: 'i-pcpm' },
  { slug: 'erp-para-importadores', label: 'Gestão para Importadores', icon: 'i-compras' },
  { slug: 'erp-para-atacado-distribuicao', label: 'Atacado e Distribuição', icon: 'i-comercial' },
];

const modulePages = (keys) => keys.map((key) => {
  const module = modules[key];
  return { slug: module.slug, label: module.navName || module.name, icon: module.icon };
});

const navGroups = [
  { name: 'Por segmento', blurb: 'Comece pela realidade da sua empresa e depois aprofunde os recursos.', links: sectorPages },
  { name: 'Operação', blurb: 'Planejamento, estoque, compras e custos trabalhando no mesmo fluxo.', links: modulePages(['pcpm', 'wms', 'compras', 'custos']) },
  { name: 'Vendas', blurb: 'Comercial, relacionamento e canais digitais conectados à operação.', links: modulePages(['comercial', 'crm', 'ecommerce']) },
  { name: 'Gestão', blurb: 'Informação financeira, fiscal, contábil, gerencial e de pessoas.', links: modulePages(['financeiro', 'contabilidade', 'controladoria', 'rh', 'processos']) },
];

const navLinks = (links, current = '') => links
  .map((page) => `<li><a href="${B()}${page.slug}.html" data-nav-link${current === page.slug ? ' aria-current="page"' : ''}>${icon(page.icon, 'i i-sm')}<span>${esc(page.label)}</span></a></li>`)
  .join('');

// ---------------------------------------------------------------------------
// MEGA MENU (desktop) — agrupado por área, com "Navegar por necessidade"
// ---------------------------------------------------------------------------
function megaMenu(current) {
  const col = (g) => `
    <div class="mega-col">
      <p class="mega-col-title">${esc(g.name)}</p>
      <p class="mega-col-copy">${esc(g.blurb)}</p>
      <ul>${navLinks(g.links, current)}</ul>
    </div>`;
  return `
  <div class="mega" id="mega-solucoes">
    <div class="mega-inner">
      <div class="mega-groups">${navGroups.map(col).join('')}</div>
      <div class="mega-side">
        <p class="mega-col-title">Explore o Infoline</p>
        <p class="mega-side-text">Não sabe por onde começar? Veja soluções pelo problema que você quer resolver.</p>
        <a class="mega-side-link" href="${B()}solucoes.html" data-nav-link>${icon('i-grid', 'i i-sm')}<span>Ver todas as soluções</span>${icon('i-arrow-right', 'i i-sm')}</a>
        <a class="mega-side-link" href="${B()}index.html#em-acao" data-nav-link>${icon('i-pcpm', 'i i-sm')}<span>Veja o Infoline em ação</span>${icon('i-arrow-right', 'i i-sm')}</a>
      </div>
    </div>
  </div>`;
}

function clientCombo(idSuffix = '') {
  const menuId = `client-combo-menu${idSuffix}`;
  return `<div class="client-combo" id="client-combo${idSuffix}">
    <button class="client-combo-trigger" type="button" aria-expanded="false" aria-controls="${menuId}">${icon('i-user', 'i i-sm')}<span>Sou cliente</span>${icon('i-chevron-down', 'i i-xs')}</button>
    <div class="client-combo-menu" id="${menuId}">
      ${site.clientAccess.map((c) => `<a href="${esc(c.url)}" target="_blank" rel="noopener"><span>${esc(c.label)}</span><strong>${esc(c.cta)} ${icon('i-external', 'i i-xs')}</strong></a>`).join('')}
    </div>
  </div>`;
}

export function header({ current = '', variant = 'home' } = {}) {
  const isHome = variant === 'home';
  return `
<a class="skip-link" href="#conteudo">Pular para o conteúdo</a>
<div class="portal-bar">
  <div class="portal-bar-inner">
    <p>ERP online integrado <span>·</span> Desde ${site.since} <span>·</span> Atendimento em todo o Brasil</p>
    <nav aria-label="Acessos rápidos">
      <a href="${B()}index.html#em-acao" data-nav-link>Ver o Infoline em ação</a>
      <a href="${B()}solucoes.html" data-nav-link>Explorar soluções</a>
    </nav>
  </div>
</div>
<header class="site-header${isHome ? '' : ' site-header--internal'}" id="topo" data-header>
  <div class="site-header-inner">
    <a class="brand" href="${B()}index.html" data-nav-link aria-label="Infoline, página inicial">
      ${logoMark()}
      <span class="brand-text">Infoline<small>Gestão empresarial</small></span>
    </a>
    <nav class="desktop-nav" aria-label="Navegação principal">
      <div class="nav-item has-mega" data-mega="solucoes">
        <button class="nav-link nav-link--mega" type="button" aria-expanded="false" aria-controls="mega-solucoes">Soluções${icon('i-chevron-down', 'i i-xs')}</button>
        ${megaMenu(current)}
      </div>
      <a class="nav-link" href="${B()}index.html#por-que" data-nav-link>Por que a Infoline</a>
      <a class="nav-link" href="${B()}index.html#quem-somos" data-nav-link>A Infoline</a>
      <a class="nav-link" href="${B()}trabalhe-conosco.html" data-nav-link>Trabalhe conosco</a>
      ${clientCombo()}
      <a class="nav-cta" href="${B()}index.html#contato" data-track="cta_click" data-label="header_demo">Agendar demonstração</a>
    </nav>
    <button class="menu-button" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu-toggle>
      ${icon('i-menu', 'i menu-open')}${icon('i-close', 'i menu-close')}
      <span>Menu</span>
    </button>
  </div>
</header>

<nav class="mobile-nav" id="mobile-nav" aria-label="Navegação móvel" data-mobile-nav inert>
  <div class="mobile-nav-inner">
    <p class="mobile-nav-title">Soluções</p>
    <div class="mobile-nav-groups">
      ${navGroups.map((g) => `
      <details class="mobile-group">
        <summary>${esc(g.name)}${icon('i-chevron-down', 'i i-xs')}</summary>
        <ul>${navLinks(g.links, current)}</ul>
      </details>`).join('')}
    </div>
    <a class="mobile-nav-link" href="${B()}solucoes.html" data-nav-link>${icon('i-grid', 'i i-sm')}<span>Ver todas as soluções</span></a>
    <hr class="mobile-nav-sep">
    <a class="mobile-nav-link" href="${B()}index.html#por-que" data-nav-link>Por que a Infoline</a>
    <a class="mobile-nav-link" href="${B()}index.html#quem-somos" data-nav-link>A Infoline</a>
    <a class="mobile-nav-link" href="${B()}trabalhe-conosco.html" data-nav-link>Trabalhe conosco</a>
    <hr class="mobile-nav-sep">
    <p class="mobile-nav-title">Sou cliente</p>
    ${site.clientAccess.map((c) => `<a class="mobile-nav-link" href="${esc(c.url)}" target="_blank" rel="noopener"><span>${esc(c.label)} · ${esc(c.cta)}</span>${icon('i-external', 'i i-xs')}</a>`).join('')}
    <a class="button button-primary mobile-nav-cta" href="${B()}index.html#contato" data-track="cta_click" data-label="mobile_menu_demo">Agendar demonstração</a>
  </div>
</nav>
<div class="nav-scrim" data-nav-scrim></div>`;
}

export function breadcrumb(items) {
  // items: [{label, href?}]  — último item é a página atual (sem href)
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.label,
      ...(it.href ? { item: it.href === 'index.html' ? `${site.url}/` : `${site.url}/${it.href}` } : {}),
    })),
  };
  return `
<nav class="breadcrumb" aria-label="Trilha de navegação">
  <ol>
    ${items.map((it, i) => it.href
      ? `<li><a href="${B()}${it.href}">${esc(it.label)}</a></li>`
      : `<li aria-current="page">${esc(it.label)}</li>`).join('<li class="bc-sep" aria-hidden="true">/</li>')}
  </ol>
</nav>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
}

export function footer() {
  const half = Math.ceil(moduleOrder.length / 2);
  const colA = moduleOrder.slice(0, half);
  const colB = moduleOrder.slice(half);
  const modLink = (k) => { const m = modules[k]; return `<li><a href="${B()}${m.slug}.html" data-nav-link>${esc(m.navName || m.name)}</a></li>`; };
  return `
<footer class="footer">
  <div class="footer-top">
    <div class="footer-brand">
      <a class="brand" href="${B()}index.html" aria-label="Infoline, página inicial">${logoMark('brand-mark brand-mark--footer')}<span class="brand-text">Infoline<small>Gestão empresarial</small></span></a>
      <p>ERP online integrado, desde ${site.since}. Produção, estoque, compras, vendas, financeiro e gestão de pessoas em uma plataforma web.</p>
      <div class="footer-contact">
        <a href="tel:${site.tel}">${icon('i-phone', 'i i-sm')}<span>${site.phoneDisplay}</span></a>
        <a href="mailto:${site.email}">${icon('i-mail', 'i i-sm')}<span>${site.email}</span></a>
        <a href="${site.mapsUrl}" target="_blank" rel="noopener">${icon('i-pin', 'i i-sm')}<span>${esc(site.address.city)}, ${esc(site.address.region)}</span></a>
      </div>
    </div>
    <nav class="footer-col" aria-label="Soluções (1)"><p>Soluções</p><ul>${sectorPages.map((page) => `<li><a href="${B()}${page.slug}.html">${esc(page.label)}</a></li>`).join('')}${colA.map(modLink).join('')}</ul></nav>
    <nav class="footer-col" aria-label="Soluções (2)"><p>&nbsp;</p><ul>${colB.map(modLink).join('')}</ul></nav>
    <nav class="footer-col" aria-label="Infoline">
      <p>Infoline</p>
      <ul>
        <li><a href="${B()}index.html#quem-somos">Quem somos</a></li>
        <li><a href="${B()}index.html#por-que">Por que a Infoline</a></li>
        <li><a href="${B()}solucoes.html">Todas as soluções</a></li>
        <li><a href="${B()}trabalhe-conosco.html">Trabalhe conosco</a></li>
        <li><a href="${B()}index.html#contato">Fale com a Infoline</a></li>
        <li><a href="${B()}politica-de-privacidade.html">Política de privacidade</a></li>
        <li><button type="button" class="cookie-settings-link" data-cookie-settings>Preferências de cookies</button></li>
      </ul>
    </nav>
  </div>
  <div class="footer-bottom">
    <p>${esc(site.legalName)} · ${esc(site.address.city)}/${esc(site.address.region)}, Brasil</p>
    <p>© ${site.year} Infoline. Todos os direitos reservados.</p>
  </div>
</footer>
<a class="whatsapp-float" href="${waLink(site)}" target="_blank" rel="noopener" data-track="whatsapp_click" data-label="floating_whatsapp" aria-label="Falar com a Infoline pelo WhatsApp">
  ${icon('i-whatsapp')}
  <span class="whatsapp-float-copy"><b>Fale com a Infoline</b><small>Estamos no WhatsApp</small></span>
</a>
<div class="mobile-cta-bar" data-mobile-cta>
  <a class="button button-primary" href="${B()}index.html#contato" data-track="cta_click" data-label="mobile_bar_demo">Agendar demonstração</a>
  <a class="mobile-cta-wa" href="${waLink(site)}" target="_blank" rel="noopener" data-track="whatsapp_click" data-label="mobile_bar_whatsapp" aria-label="WhatsApp">${icon('i-whatsapp')}</a>
</div>
<section class="cookie-banner" data-cookie-banner aria-labelledby="cookie-banner-title" hidden>
  <div class="cookie-banner-copy">
    <h2 id="cookie-banner-title">Sua escolha de privacidade</h2>
    <p>Usamos armazenamento necessário para lembrar suas preferências. Estatísticas e publicidade só são ativadas com sua autorização. Você pode mudar sua escolha no rodapé. <a href="${B()}politica-de-privacidade.html">Leia a política de privacidade</a>.</p>
  </div>
  <div class="cookie-actions">
    <button type="button" data-cookie-action="reject">Rejeitar opcionais</button>
    <button type="button" data-cookie-settings>Personalizar</button>
    <button type="button" data-cookie-action="accept">Aceitar todos</button>
  </div>
</section>
<dialog class="cookie-dialog" data-cookie-dialog aria-labelledby="cookie-dialog-title">
  <div class="cookie-dialog-header">
    <h2 id="cookie-dialog-title">Preferências de cookies</h2>
    <button type="button" data-cookie-close aria-label="Fechar preferências de cookies">×</button>
  </div>
  <p>Escolha quais finalidades autorizar. Recusar cookies opcionais não impede a navegação nem o envio do formulário.</p>
  <div class="cookie-option"><strong>Necessários — sempre ativos</strong><p>Guardam esta escolha de privacidade por até 180 dias.</p></div>
  <label class="cookie-option"><input type="checkbox" data-cookie-analytics><span><strong>Estatísticas</strong><small>Permitem medir visitas e guardar a origem da campanha por até 90 dias, quando as ferramentas estiverem configuradas.</small></span></label>
  <label class="cookie-option"><input type="checkbox" data-cookie-marketing><span><strong>Publicidade</strong><small>Permitem medir conversões e guardar identificadores de anúncios por até 90 dias, quando as ferramentas estiverem configuradas.</small></span></label>
  <a href="${B()}politica-de-privacidade.html">Consultar a política de privacidade</a>
  <div class="cookie-actions">
    <button type="button" data-cookie-action="reject">Rejeitar opcionais</button>
    <button type="button" data-cookie-action="save">Salvar preferências</button>
    <button type="button" data-cookie-action="accept">Aceitar todos</button>
  </div>
</dialog>`;
}
