import { esc, icon, pic, waLink } from '../lib.mjs';
import { head, orgSchema, softwareSchema, faqSchema } from '../head.mjs';
import { header, footer } from '../layout.mjs';
import { site, modules, demos, homeFaq, facts, differentials } from '../content.mjs';
import { heroPanel, demoScreen } from '../mocks.mjs';

const portalNeeds = [
  { title: 'Planejar melhor a produção', text: 'Saiba o que produzir, o que comprar e acompanhe o que acontece na fábrica.', cta: 'Resolver problemas de produção', icon: 'i-pcpm', href: 'pcpm.html' },
  { title: 'Organizar estoque e expedição', text: 'Encontre produtos, agilize a separação e tenha mais controle da operação.', cta: 'Melhorar estoque e expedição', icon: 'i-wms', href: 'wms.html' },
  { title: 'Vender com mais controle', text: 'Conecte preço, pedido, estoque, faturamento e financeiro.', cta: 'Melhorar a operação comercial', icon: 'i-comercial', href: 'comercial.html' },
  { title: 'Ter o financeiro conectado à operação', text: 'Acompanhe compromissos, recebimentos e caixa sem depender de controles separados.', cta: 'Melhorar a gestão financeira', icon: 'i-financeiro', href: 'financeiro.html' },
];

const ecosystemAreas = [
  { module: 'comercial', label: 'Vendas', title: 'Pedido confirmado', flow: 'Estoque, faturamento e caixa foram atualizados.' },
  { module: 'pcpm', label: 'Produção', title: 'Produção liberada', flow: 'Materiais e capacidade foram validados.' },
  { module: 'wms', label: 'Estoque e Logística', title: 'Saldo atualizado', flow: 'Localização e disponibilidade ficaram visíveis.' },
  { module: 'compras', label: 'Compras', title: 'Compra aprovada', flow: 'Fornecedor, condição e prazo foram registrados.' },
  { module: 'custos', label: 'Custos e Margem', title: 'Margem calculada', flow: 'O custo real foi refletido no preço de venda.' },
  { module: 'financeiro', label: 'Financeiro', title: 'Caixa projetado', flow: 'O impacto financeiro apareceu antes da decisão.' },
  { module: 'contabilidade', label: 'Fiscal e Contábil', title: 'Documento integrado', flow: 'O movimento fiscal e contábil foi registrado.' },
  { module: 'rh', label: 'Pessoas', title: 'Rotina de pessoas organizada', flow: 'Folha, jornada e obrigações ficaram no mesmo ambiente.' },
];

export function renderHome() {
  const title = 'Infoline | ERP Online Integrado para Indústria e Gestão Empresarial';
  const description = 'ERP online integrado da Infoline para indústrias, importadores, atacadistas e empresas que precisam conectar toda a operação. Atendimento em todo o Brasil.';

  const headHtml = head({
    title, description, path: '',
    schemas: [orgSchema(), softwareSchema(), faqSchema(homeFaq)],
  });

  // -- HERO ------------------------------------------------------------
  const hero = `
<section class="hero">
  <div class="hero-glow hero-glow-a" aria-hidden="true"></div>
  <div class="hero-glow hero-glow-b" aria-hidden="true"></div>
  <div class="hero-inner">
    <div class="hero-copy">
      <span class="hero-badge">${icon('i-grid', 'i i-sm')}ERP para indústrias, importadores e atacadistas</span>
      <h1>Da fábrica ao financeiro, <em>tudo conectado.</em></h1>
      <p class="lede">ERP online que integra produção, estoque, compras, vendas, financeiro, fiscal e pessoas em uma única plataforma web — para você decidir com a operação inteira à vista, não em módulos isolados.</p>
      <div class="hero-cta">
        <a class="button button-primary" href="#contato" data-track="cta_click" data-label="hero_demo">Agendar uma demonstração</a>
        <a class="button button-ghost-dark" href="#solucoes">Explorar soluções</a>
      </div>
      <div class="hero-trust">
        <span>${icon('i-check', 'i')}Desde 2001</span>
        <span>${icon('i-check', 'i')}Plataforma web</span>
        <span>${icon('i-check', 'i')}Atendimento em todo o Brasil</span>
      </div>
    </div>
    <div class="hero-visual">
      ${heroPanel()}
    </div>
  </div>
</section>
<div class="facts-bar">
  <ul class="facts-grid">
    ${facts.map((f) => `<li><b>${esc(f.k)}</b><span>${esc(f.v)}</span></li>`).join('')}
  </ul>
</div>
<nav class="portal-index" aria-label="Navegar pela página">
  <div class="portal-index-inner">
    <span>Encontre seu caminho</span>
    <a href="#solucoes">Por realidade da empresa${icon('i-chevron-right', 'i i-xs')}</a>
    <a href="#necessidades">Por necessidade${icon('i-chevron-right', 'i i-xs')}</a>
    <a href="#em-acao">Ver o ERP em ação${icon('i-chevron-right', 'i i-xs')}</a>
    <a href="#contato">Agendar demonstração${icon('i-chevron-right', 'i i-xs')}</a>
  </div>
</nav>`;

  // -- PORTAS DE ENTRADA POR REALIDADE -----------------------------------
  const solucoes = `
<section class="section reality-section" id="solucoes">
  <div class="container">
    <div class="section-head reality-head reveal">
      <div class="section-head-text">
        <p class="kicker">Soluções por realidade</p>
        <h2>Qual é a realidade <span>da sua empresa?</span></h2>
        <p class="lede">Soluções pensadas para operações que precisam de controle, integração e informação para crescer.</p>
      </div>
    </div>
    <div class="reality-grid reveal">
      <a class="reality-card reality-card--industrial" href="erp-para-industria.html" aria-label="Conheça a solução para indústrias">
        ${pic({ img:'reality-industrial-v2', ratio:[1122,1402], widths:[480,800,1100], alt:'Supervisor acompanhando a produção em uma indústria', sizes:'(max-width:640px) 82vw, (max-width:1080px) 50vw, 25vw' })}
        <span class="reality-card-wash" aria-hidden="true"></span>
        <span class="reality-card-content">
          <span class="reality-card-eyebrow">Para indústrias</span>
          <strong>Gestão Industrial</strong>
          <span class="reality-card-copy">Produção sob controle, sem depender de planilhas.</span>
          <span class="reality-card-cta">Conheça a solução para indústrias${icon('i-arrow-right','i')}</span>
        </span>
      </a>
      <a class="reality-card reality-card--importadores" href="erp-para-importadores.html" aria-label="Conheça a solução para importadores">
        ${pic({ img:'reality-importadores-v2', ratio:[1122,1402], widths:[480,800,1100], alt:'Equipe de importação conferindo documentos de uma carga', sizes:'(max-width:640px) 82vw, (max-width:1080px) 50vw, 25vw' })}
        <span class="reality-card-wash" aria-hidden="true"></span>
        <span class="reality-card-content">
          <span class="reality-card-eyebrow">Para importadores</span>
          <strong>Gestão para Importadores</strong>
          <span class="reality-card-copy">Menos retrabalho na entrada. Mais controle da operação.</span>
          <span class="reality-card-cta">Conheça a solução para importadores${icon('i-arrow-right','i')}</span>
        </span>
      </a>
      <a class="reality-card reality-card--atacado" href="erp-para-atacado-distribuicao.html" aria-label="Conheça a solução para atacado e distribuição">
        ${pic({ img:'reality-atacado-v2', ratio:[1122,1402], widths:[480,800,1100], alt:'Equipe separando pedidos em um centro de distribuição', sizes:'(max-width:640px) 82vw, (max-width:1080px) 50vw, 25vw' })}
        <span class="reality-card-wash" aria-hidden="true"></span>
        <span class="reality-card-content">
          <span class="reality-card-eyebrow">Para atacadistas e distribuidores</span>
          <strong>Atacado e Distribuição</strong>
          <span class="reality-card-copy">Mais controle da venda até a expedição.</span>
          <span class="reality-card-cta">Conheça a solução para atacado${icon('i-arrow-right','i')}</span>
        </span>
      </a>
      <a class="reality-card reality-card--empresarial" href="solucoes.html" aria-label="Conheça o Infoline ERP para gestão empresarial">
        ${pic({ img:'reality-empresarial-v2', ratio:[1122,1402], widths:[480,800,1100], alt:'Gestores analisando juntos as informações da empresa', sizes:'(max-width:640px) 82vw, (max-width:1080px) 50vw, 25vw' })}
        <span class="reality-card-wash" aria-hidden="true"></span>
        <span class="reality-card-content">
          <span class="reality-card-eyebrow">Para toda a empresa</span>
          <strong>Gestão Empresarial</strong>
          <span class="reality-card-copy">Toda a empresa trabalhando com a mesma informação.</span>
          <span class="reality-card-cta">Conheça o Infoline ERP${icon('i-arrow-right','i')}</span>
        </span>
      </a>
    </div>
  </div>
</section>`;

  // -- NAVEGAR POR NECESSIDADE (amostra na home, hub completo em solucoes.html) --
  const necessidade = `
<section class="section section--mist" id="necessidades">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="kicker">Por necessidade</p>
        <h2>O que você quer <span>melhorar</span> na operação?</h2>
        <p class="lede">Se preferir começar pelo problema em vez do módulo, escolha a necessidade mais urgente da operação.</p>
      </div>
    </div>
    <div class="need-grid need-grid--portal">
      ${portalNeeds.map((need) => `
      <a class="need-card need-card--portal reveal" href="${need.href}">
        <div class="need-card-top">
          <span class="need-card-icon">${icon(need.icon, 'i')}</span>
          <p class="need-card-q">${esc(need.title)}</p>
        </div>
        <p class="need-card-outcome">${esc(need.text)}</p>
        <span class="need-card-link">${esc(need.cta)}${icon('i-arrow-right', 'i')}</span>
      </a>`).join('')}
    </div>
    <div style="text-align:center; margin-top:32px;">
      <a class="text-link" href="solucoes.html">${icon('i-grid', 'i')}Ver todas as necessidades${icon('i-arrow-right', 'i')}</a>
    </div>
  </div>
</section>`;

  // -- VEJA O INFOLINE EM AÇÃO --------------------------------------------
  const emAcao = `
<section class="section" id="em-acao">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="kicker">Veja o Infoline em ação</p>
        <h2>Um fluxo real, <span>do início ao fim.</span></h2>
        <p class="lede">Representações baseadas nas telas do sistema. Escolha um fluxo e acompanhe cada etapa.</p>
      </div>
    </div>
    <div class="demo-shell reveal" data-demo>
      <div class="demo-tabs" role="tablist" aria-label="Fluxos do Infoline">
        ${demos.map((d, i) => `<button class="demo-tab" role="tab" data-demo-tab="${d.key}" aria-selected="${i === 0 ? 'true' : 'false'}">${esc(d.tab)}</button>`).join('')}
      </div>
      <div class="demo-panels" style="margin-top:26px;">
        ${demos.map((d) => `
        <div class="demo-panel" data-panel="${d.key}">
          <div class="demo-layout">
            <div>
              <h3 style="margin-bottom:16px;">${esc(d.title)}</h3>
              <div class="demo-steps">
                ${d.steps.map((s, i) => `
                <div class="demo-step" data-step-index="${i}">
                  <span class="demo-step-num">${i + 1}</span>
                  <div class="demo-step-text"><b>${esc(s[0])}</b><p>${esc(s[1])}</p></div>
                </div>`).join('')}
              </div>
              <a class="text-link" style="margin-top:18px;" href="${modules[d.module].slug}.html">Ver o módulo ${esc(modules[d.module].navName || modules[d.module].name)}${icon('i-arrow-right', 'i')}</a>
            </div>
            <div>${demoScreen[d.key] ? demoScreen[d.key]() : ''}</div>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </div>
</section>`;

  // -- ECOSSISTEMA INTEGRADO ----------------------------------------------
  const ecossistema = `
<section class="section eco-section" id="integracao">
  <div class="container">
    <div class="ecosystem" data-saturn-scene>
      <div class="eco-copy reveal">
        <p class="kicker">Um único ERP</p>
        <h2>Todas as soluções <span>na mesma órbita.</span></h2>
        <p class="lede">Cada área tem seu próprio movimento, mas todas compartilham a mesma base e alimentam a próxima decisão.</p>
        <p class="eco-copy-note"><i></i>O planeta representa o ERP Infoline. Passe sobre uma área para acompanhar um acontecimento real.</p>
      </div>
      <div class="eco-stage reveal">
        <canvas class="eco-canvas" aria-hidden="true"></canvas>
        ${ecosystemAreas.map((area, i) => { const m = modules[area.module]; return `<a class="eco-solution" href="${m.slug}.html" aria-label="Conhecer ${esc(area.label)}" data-eco-index="${i}" data-eco-title="${esc(area.title)}" data-eco-flow="${esc(area.flow)}"><span>${esc(area.label)}</span></a>`; }).join('')}
        <div class="eco-event" data-eco-event aria-live="polite"><i></i><span><b data-eco-title>Operação conectada</b><small data-eco-flow>Passe sobre uma área para acompanhar um acontecimento.</small></span></div>
        <span class="eco-gesture" aria-hidden="true"><i></i>Mova o cursor</span>
      </div>
    </div>
  </div>
</section>`;

  // -- DIFERENCIAIS ---------------------------------------------------------
  const diferenciais = `
<section class="section" id="por-que">
  <div class="container">
    <div class="section-head reveal">
      <div class="section-head-text">
        <p class="kicker">Por que a Infoline</p>
        <h2>O que muda quando <span>tudo trabalha junto.</span></h2>
      </div>
    </div>
    <div class="diff-grid reveal">
      ${differentials.map((d) => `
      <div class="diff-item">
        <span class="diff-item-icon">${icon(d.module ? modules[d.module].icon : 'i-grid', 'i')}</span>
        <h3>${esc(d.title)}</h3>
        <p>${esc(d.text)}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;

  // -- QUEM SOMOS -----------------------------------------------------------
  const quemSomos = `
<section class="section section--mist" id="quem-somos">
  <div class="container about-grid">
    <div class="reveal">
      <span class="about-badge"><b>${site.since}</b><span>Desde ${site.since}</span></span>
      <h2>Experiência para entender o negócio. Tecnologia para fazê-lo evoluir.</h2>
      <p class="body-text">Desde ${site.since}, a Infoline desenvolve soluções de software para empresas em todo o Brasil. O ERP integra as áreas do negócio em uma plataforma web, conectando operação, gestão e decisões.</p>
      <div class="hero-cta" style="margin-top:24px;">
        <a class="button button-outline" href="trabalhe-conosco.html">Trabalhe conosco</a>
      </div>
    </div>
    <div class="about-timeline reveal">
      <div class="about-row"><span class="about-row-mark">${icon('i-check', 'i')}</span><div><h3>Plataforma web própria</h3><p>ERP desenvolvido pela Infoline em plataforma web.</p></div></div>
      <div class="about-row"><span class="about-row-mark">${icon('i-grid', 'i')}</span><div><h3>Uma operação integrada</h3><p>Um mesmo cadastro de cliente, produto e financeiro acompanha os processos de toda a empresa.</p></div></div>
      <div class="about-row"><span class="about-row-mark">${icon('i-pin', 'i')}</span><div><h3>Atendimento em todo o Brasil</h3><p>Sede em Curitiba/PR e atendimento a empresas em diferentes regiões do país.</p></div></div>
    </div>
  </div>
</section>`;

  // -- FAQ ---------------------------------------------------------------
  const faq = `
<section class="section">
  <div class="container" style="max-width:900px;">
    <div class="section-head reveal" style="display:block;">
      <p class="kicker">Perguntas frequentes</p>
      <h2>Antes de <span>agendar a demonstração.</span></h2>
    </div>
    <div class="faq-list reveal">
      ${homeFaq.map(([q, a], i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary>${esc(q)}${icon('i-plus', 'i')}</summary>
        <p class="faq-item-a">${esc(a)}</p>
      </details>`).join('')}
    </div>
  </div>
</section>`;

  // -- CONTATO -------------------------------------------------------------
  const contato = `
<section class="section section--dark" id="contato">
  <div class="container contact-grid">
    <div class="contact-side reveal">
      <p class="kicker">Entre em contato</p>
      <h2>Vamos conversar sobre a operação da sua empresa?</h2>
      <p class="lede">Conte um pouco sobre o que você precisa. A equipe Infoline apresenta as soluções disponíveis para o seu caso.</p>
      <div class="contact-points">
        <div class="contact-point"><span class="contact-point-ico">${icon('i-whatsapp', 'i')}</span><div><b>WhatsApp</b><a href="${waLink(site)}" target="_blank" rel="noopener" data-track="whatsapp_click" data-label="home_contact_whatsapp">${esc(site.whatsappDisplay)}</a></div></div>
        <div class="contact-point"><span class="contact-point-ico">${icon('i-phone', 'i')}</span><div><b>Telefone</b><a href="tel:${site.tel}">${esc(site.phoneDisplay)}</a></div></div>
        <div class="contact-point"><span class="contact-point-ico">${icon('i-mail', 'i')}</span><div><b>E-mail</b><a href="mailto:${site.email}">${esc(site.email)}</a></div></div>
        <div class="contact-point"><span class="contact-point-ico">${icon('i-pin', 'i')}</span><div><b>Onde estamos</b><p>${esc(site.address.city)}/${esc(site.address.region)}, Brasil</p></div></div>
      </div>
    </div>
    <form class="contact-form reveal" id="form-contato" data-lead-form novalidate>
      <h3>Solicitar uma demonstração</h3>
      <input class="hp" type="text" name="website" tabindex="-1" autocomplete="off" aria-hidden="true">
      <div class="field" data-field>
        <label for="c-nome">Nome</label>
        <input id="c-nome" name="nome" type="text" placeholder="Seu nome completo" required autocomplete="name">
        <span class="field-error">Informe seu nome.</span>
      </div>
      <div class="field" data-field>
        <label for="c-empresa">Empresa</label>
        <input id="c-empresa" name="empresa" type="text" placeholder="Nome da empresa" required autocomplete="organization">
        <span class="field-error">Informe o nome da empresa.</span>
      </div>
      <div class="field" data-field>
        <label for="c-whats">WhatsApp</label>
        <input id="c-whats" name="whatsapp" type="tel" placeholder="(00) 00000-0000" required autocomplete="tel">
        <span class="field-error">Informe um número válido.</span>
      </div>
      <div class="field" data-field>
        <label for="c-email">E-mail</label>
        <input id="c-email" name="email" type="email" placeholder="voce@empresa.com.br" required autocomplete="email">
        <span class="field-error">Informe um e-mail válido.</span>
      </div>
      <div class="field field-full" data-field>
        <label for="c-msg">O que você precisa melhorar na operação?</label>
        <textarea id="c-msg" name="mensagem" rows="3" placeholder="Conte um pouco sobre sua empresa e o que você busca"></textarea>
      </div>
      <label class="consent field-full" data-field><input type="checkbox" name="consentimento" required><span>Concordo em ser contatado pela Infoline com base nesta solicitação, conforme a <a href="politica-de-privacidade.html">política de privacidade</a>.<span class="field-error">Confirme o consentimento para continuar.</span></span></label>
      <div class="form-status field-full" data-form-status role="status" aria-live="polite" aria-atomic="true"></div>
      <button class="button button-primary button-block field-full" type="submit">Agendar demonstração</button>
    </form>
  </div>
</section>`;

  const body = `
${header({ variant: 'home' })}
<main id="conteudo">
  ${hero}
  ${solucoes}
  ${necessidade}
  ${ecossistema}
  ${emAcao}
  ${diferenciais}
  ${quemSomos}
  ${faq}
  ${contato}
</main>
${footer()}`;

  return { headHtml, body, styles: ['home.css'], pageType: 'home' };
}
