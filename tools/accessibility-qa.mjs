import http from 'node:http';

const port = process.argv[2] || '9343';
const pages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html',
];
const premiumPages = new Set([
  'pcpm.html', 'wms.html', 'compras.html', 'custos.html', 'comercial.html', 'crm.html',
  'ecommerce.html', 'financeiro.html', 'integracao-whatsapp.html', 'contabilidade.html',
  'controladoria.html', 'rh.html', 'gestao-processos.html',
]);

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

class Cdp {
  constructor(url) {
    this.id = 0;
    this.pending = new Map();
    this.socket = new WebSocket(url);
  }
  async open() {
    if (this.socket.readyState === WebSocket.OPEN) return;
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const entry = this.pending.get(message.id);
      if (!entry) return;
      this.pending.delete(message.id);
      if (message.error) entry.reject(new Error(message.error.message));
      else entry.resolve(message.result);
    });
  }
  call(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  async evaluate(expression) {
    const result = await this.call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
    return result.result.value;
  }
  close() { this.socket.close(); }
}

const failures = [];
const tabs = await getJson(`http://127.0.0.1:${port}/json`);
const tabFor = (page) => tabs.find((tab) => tab.type === 'page' && tab.url.endsWith(`/${page}`));

for (const page of pages) {
  const tab = tabFor(page);
  if (!tab) {
    failures.push(`${page}: aba não encontrada`);
    continue;
  }
  const cdp = new Cdp(tab.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 300));
  const result = JSON.parse(await cdp.evaluate(`JSON.stringify((() => {
    const issues = [];
    const headings = Array.from(document.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((h) => Number(h.tagName.slice(1)));
    for (let i = 1; i < headings.length; i += 1) if (headings[i] > headings[i - 1] + 1) issues.push('salto na hierarquia de headings');
    if (document.querySelectorAll('h1').length !== 1) issues.push('quantidade de H1 diferente de 1');
    if (document.querySelectorAll('main').length !== 1) issues.push('quantidade de main diferente de 1');
    if (document.querySelectorAll('header.site-header').length !== 1) issues.push('header principal ausente ou duplicado');
    if (document.querySelectorAll('footer.footer').length !== 1) issues.push('footer principal ausente ou duplicado');
    document.querySelectorAll('nav').forEach((nav) => {
      if (!(nav.getAttribute('aria-label') || nav.getAttribute('aria-labelledby'))) issues.push('nav sem nome acessível');
    });
    if (document.querySelector('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])')) issues.push('tabindex positivo');
    document.querySelectorAll('a[target="_blank"]').forEach((link) => {
      if (!(link.rel || '').split(/\\s+/).includes('noopener')) issues.push('target blank sem noopener');
    });
    document.querySelectorAll('button,a[href],summary').forEach((control) => {
      const name = (control.getAttribute('aria-label') || control.textContent || '').trim();
      if (!name) issues.push('controle sem nome acessível');
    });
    document.querySelectorAll('input:not([type="hidden"]),textarea,select').forEach((control) => {
      if (control.classList.contains('hp')) return;
      const labelled = control.labels?.length || control.getAttribute('aria-label') || control.getAttribute('aria-labelledby');
      if (!labelled) issues.push('campo sem label associado');
      if (control.required && !control.hasAttribute('aria-describedby')) issues.push('campo obrigatório sem descrição de erro associada');
    });
    document.querySelectorAll('img').forEach((image) => {
      if (!image.hasAttribute('alt')) issues.push('imagem sem atributo alt');
    });
    document.querySelectorAll('svg.i').forEach((svg) => {
      if (svg.getAttribute('aria-hidden') !== 'true' || svg.getAttribute('focusable') !== 'false') issues.push('ícone decorativo exposto à árvore acessível');
    });
    document.querySelectorAll('[aria-controls]').forEach((control) => {
      if (!document.getElementById(control.getAttribute('aria-controls'))) issues.push('aria-controls sem alvo');
    });
    document.querySelectorAll('[aria-expanded]').forEach((control) => {
      if (!/^(true|false)$/.test(control.getAttribute('aria-expanded'))) issues.push('aria-expanded inválido');
    });
    document.querySelectorAll('[aria-pressed]').forEach((control) => {
      if (!/^(true|false|mixed)$/.test(control.getAttribute('aria-pressed'))) issues.push('aria-pressed inválido');
    });
    const clientTrigger = document.querySelector('.client-combo-trigger');
    const clientPanel = document.querySelector('.client-combo-menu');
    if (clientTrigger && clientPanel) {
      if (clientTrigger.getAttribute('aria-controls') !== clientPanel.id) issues.push('Sou cliente sem relação disclosure/painel');
      if (clientTrigger.hasAttribute('aria-haspopup')) issues.push('Sou cliente anuncia popup sem implementar ARIA Menu');
      if (clientPanel.getAttribute('role') === 'menu' || clientPanel.querySelector('[role="menuitem"]')) issues.push('Sou cliente usa papéis de ARIA Menu em navegação por Tab');
    }
    document.querySelectorAll('.faq-item summary').forEach((summary) => {
      if (summary.tabIndex < 0) issues.push('FAQ fora da ordem de foco');
    });
    const mobileNav = document.querySelector('[data-mobile-nav]');
    if (mobileNav && !mobileNav.inert && !mobileNav.classList.contains('is-open')) issues.push('menu móvel fechado sem inert');
    const flow = document.querySelector('[data-module-flow]');
    if (flow) {
      if (!flow.querySelector('[aria-live]')) issues.push('fluxo sem aria-live');
      if (flow.querySelectorAll('.module-system-flow-step[aria-pressed="true"]').length !== 1) issues.push('fluxo sem etapa ativa única');
    }
    const product = document.querySelector('.module-system-hero-product');
    const screen = document.querySelector('.module-system-screen-stage');
    if (product && product.querySelector('.mod-product-label')?.textContent.trim() !== 'Tela ilustrativa') issues.push('hero sem selo ilustrativo padronizado');
    if (screen && screen.querySelector('.module-system-illustrative-label')?.textContent.trim() !== 'Tela ilustrativa') issues.push('tela principal sem selo ilustrativo padronizado');
    document.querySelectorAll('[data-form-status]').forEach((status) => {
      if (status.getAttribute('role') !== 'status' || status.getAttribute('aria-live') !== 'polite') issues.push('status de formulário sem região viva adequada');
    });
    return { issues, hasFlow: Boolean(flow), hasFaq: Boolean(document.querySelector('.faq-item summary')) };
  })())`));
  result.issues.forEach((issue) => failures.push(`${page}: ${issue}`));

  if (premiumPages.has(page)) {
    await cdp.call('Page.bringToFront');
    const before = JSON.parse(await cdp.evaluate(`JSON.stringify((() => {
      const flow = document.querySelector('[data-module-flow]');
      const steps = Array.from(flow?.querySelectorAll('.module-system-flow-step') || []);
      steps.forEach((item) => item.removeAttribute('data-qa-target'));
      const step = steps.find((item) => item.getAttribute('aria-pressed') === 'false');
      if (!step) return null;
      step.setAttribute('data-qa-target', '');
      window.__qaFlowClicks = 0;
      step.addEventListener('click', () => { window.__qaFlowClicks += 1; }, { once: true });
      const expected = { input: step.dataset.flowInput, control: step.dataset.flowControl, output: step.dataset.flowOutput };
      step.focus({ preventScroll: true });
      return {
        expected,
      };
    })())`));
    await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
    await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
    const after = JSON.parse(await cdp.evaluate(`JSON.stringify((() => {
      const flow = document.querySelector('[data-module-flow]');
      const step = flow?.querySelector('[data-qa-target]');
      return step ? {
        pressed: step.getAttribute('aria-pressed'),
        active: step.classList.contains('is-active'),
        focus: document.activeElement === step,
        input: flow.querySelector('[data-flow-detail="input"]').textContent,
        control: flow.querySelector('[data-flow-detail="control"]').textContent,
        output: flow.querySelector('[data-flow-detail="output"]').textContent,
        outline: parseFloat(getComputedStyle(step).outlineWidth) > 0,
        clicks: window.__qaFlowClicks,
      } : null;
    })())`));
    if (!before || !after || after.pressed !== 'true' || !after.active || !after.focus || !after.outline || after.clicks !== 1 || after.input !== before.expected.input || after.control !== before.expected.control || after.output !== before.expected.output) {
      failures.push(`${page}: fluxo não responde corretamente a Espaço/foco/ARIA (${JSON.stringify({ before, after, documentFocus: await cdp.evaluate('document.hasFocus()') })})`);
    }
  }

  if (result.hasFaq) {
    await cdp.call('Page.bringToFront');
    const faqBefore = await cdp.evaluate(`(() => { const summary = document.querySelector('.faq-item summary'); summary.focus(); return summary.parentElement.open; })()`);
    await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
    await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
    const faqAfter = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const summary = document.querySelector('.faq-item summary'); return { open: summary.parentElement.open, focus: document.activeElement === summary, outline: parseFloat(getComputedStyle(summary).outlineWidth) > 0 }; })())`));
    if (faqBefore === faqAfter.open || !faqAfter.focus || !faqAfter.outline) failures.push(`${page}: FAQ não responde corretamente a Espaço/foco`);
  }
  cdp.close();
}

const homeTab = tabFor('index.html');
if (homeTab) {
  const cdp = new Cdp(homeTab.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Page.bringToFront');
  await cdp.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 900));
  const menuInitial = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const nav = document.querySelector('[data-mobile-nav]'); const toggle = document.querySelector('[data-menu-toggle]'); window.__qaMenuKeys = []; window.__qaMenuClicks = 0; toggle.addEventListener('keydown', (event) => window.__qaMenuKeys.push(event.key)); toggle.addEventListener('click', () => { window.__qaMenuClicks += 1; }); toggle.focus(); return { inert: nav.inert, expanded: toggle.getAttribute('aria-expanded'), focus: document.activeElement === toggle, documentFocus: document.hasFocus() }; })())`));
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await new Promise((done) => setTimeout(done, 100));
  const menuOpen = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const nav = document.querySelector('[data-mobile-nav]'); const toggle = document.querySelector('[data-menu-toggle]'); return { inert: nav.inert, expanded: toggle.getAttribute('aria-expanded'), open: nav.classList.contains('is-open'), focusInside: nav.contains(document.activeElement), active: document.activeElement.className, scrollable: getComputedStyle(nav).overflowY === 'auto', keys: window.__qaMenuKeys, clicks: window.__qaMenuClicks }; })())`));
  const shiftTabToToggle = await cdp.evaluate(`(() => { const nav = document.querySelector('[data-mobile-nav]'); const toggle = document.querySelector('[data-menu-toggle]'); const first = nav.querySelector('summary,a,button'); return Boolean(toggle.compareDocumentPosition(first) & Node.DOCUMENT_POSITION_FOLLOWING); })()`);
  const trappedAtEnd = await cdp.evaluate(`(() => { const nav = document.querySelector('[data-mobile-nav]'); const toggle = document.querySelector('[data-menu-toggle]'); toggle.focus(); toggle.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })); return nav.contains(document.activeElement); })()`);
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  const menuClosed = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const nav = document.querySelector('[data-mobile-nav]'); const toggle = document.querySelector('[data-menu-toggle]'); return { inert: nav.inert, expanded: toggle.getAttribute('aria-expanded'), open: nav.classList.contains('is-open'), focus: document.activeElement === toggle, bodyOverflow: document.body.style.overflow }; })())`));
  if (!menuInitial.inert || menuInitial.expanded !== 'false' || menuOpen.inert || menuOpen.expanded !== 'true' || !menuOpen.open || !menuOpen.focusInside || !menuOpen.scrollable || !shiftTabToToggle || !trappedAtEnd || !menuClosed.inert || menuClosed.expanded !== 'false' || menuClosed.open || !menuClosed.focus || menuClosed.bodyOverflow) {
    failures.push(`index.html: menu móvel falhou em estado, foco, trap, Escape ou scroll interno (${JSON.stringify({ menuInitial, menuOpen, shiftTabToToggle, trappedAtEnd, menuClosed })})`);
  }

  await cdp.call('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 900));
  await cdp.evaluate(`document.querySelector('.nav-link--mega').focus()`);
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  const megaOpen = await cdp.evaluate(`document.querySelector('.nav-link--mega').getAttribute('aria-expanded') === 'true'`);
  await new Promise((done) => setTimeout(done, 50));
  const megaFocus = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const link = document.querySelector('.mega a[href]'); link.focus(); return { focused: document.activeElement === link, tabIndex: link.tabIndex, active: document.activeElement.className, expanded: document.querySelector('.nav-link--mega').getAttribute('aria-expanded') }; })())`));
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  const megaClosed = await cdp.evaluate(`document.querySelector('.nav-link--mega').getAttribute('aria-expanded') === 'false' && document.activeElement === document.querySelector('.nav-link--mega')`);
  if (!megaOpen || !megaFocus.focused || megaFocus.tabIndex < 0 || !megaClosed) failures.push(`index.html: mega menu falhou em Espaço, Tab, Escape ou ARIA (${JSON.stringify({ megaOpen, megaFocus, megaClosed })})`);

  await cdp.evaluate(`document.querySelector('.client-combo-trigger').focus()`);
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: ' ', code: 'Space', windowsVirtualKeyCode: 32, nativeVirtualKeyCode: 32 });
  const comboOpen = await cdp.evaluate(`document.querySelector('.client-combo-trigger').getAttribute('aria-expanded') === 'true'`);
  await cdp.call('Input.dispatchKeyEvent', { type: 'rawKeyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  await cdp.call('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27, nativeVirtualKeyCode: 27 });
  const comboClosed = await cdp.evaluate(`document.querySelector('.client-combo-trigger').getAttribute('aria-expanded') === 'false' && document.activeElement === document.querySelector('.client-combo-trigger')`);
  if (!comboOpen || !comboClosed) failures.push(`index.html: combo Sou cliente falhou em Espaço, Escape ou ARIA (${JSON.stringify({ comboOpen, comboClosed })})`);

  await cdp.call('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 900));
  const reduced = JSON.parse(await cdp.evaluate(`JSON.stringify({ matches: matchMedia('(prefers-reduced-motion: reduce)').matches, hiddenReveal: Array.from(document.querySelectorAll('.reveal')).filter((element) => { const style = getComputedStyle(element); return style.opacity === '0' || style.visibility === 'hidden'; }).length })`));
  if (!reduced.matches || reduced.hiddenReveal) failures.push('index.html: conteúdo reveal fica oculto com movimento reduzido');
  await cdp.call('Emulation.setEmulatedMedia', { features: [] });
  cdp.close();
}

const workTab = tabFor('trabalhe-conosco.html');
if (workTab) {
  const cdp = new Cdp(workTab.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Page.bringToFront');
  await cdp.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 900));
  const workForm = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const form = document.querySelector('[data-whatsapp-form]'); form.requestSubmit(); const first = form.querySelector('[required]'); return { invalid: first.getAttribute('aria-invalid'), described: Boolean(first.getAttribute('aria-describedby')), focus: document.activeElement === first, status: form.querySelector('[data-form-status]').classList.contains('is-visible') }; })())`));
  if (workForm.invalid !== 'true' || !workForm.described || !workForm.focus || !workForm.status) failures.push('trabalhe-conosco.html: validação acessível do formulário falhou');
  cdp.close();
}

if (homeTab) {
  const cdp = new Cdp(homeTab.webSocketDebuggerUrl);
  await cdp.open();
  await cdp.call('Page.bringToFront');
  await cdp.call('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: false });
  await cdp.call('Page.reload', { ignoreCache: true });
  await new Promise((done) => setTimeout(done, 900));
  const consent = JSON.parse(await cdp.evaluate(`JSON.stringify((() => { const form = document.querySelector('[data-lead-form]'); form.querySelector('[name="nome"]').value = 'Teste'; form.querySelector('[name="empresa"]').value = 'Empresa'; form.querySelector('[name="whatsapp"]').value = '(41) 99999-9999'; form.querySelector('[name="email"]').value = 'teste@example.com'; form.requestSubmit(); const input = form.querySelector('[name="consentimento"]'); return { invalid: input.getAttribute('aria-invalid'), described: Boolean(input.getAttribute('aria-describedby')), focus: document.activeElement === input, fieldError: input.closest('[data-field]').classList.contains('has-error') }; })())`));
  if (consent.invalid !== 'true' || !consent.described || !consent.focus || !consent.fieldError) failures.push('index.html: consentimento obrigatório não é validado de forma acessível');
  cdp.close();
}

if (failures.length) {
  console.error(`QA de acessibilidade falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de acessibilidade ok: ${pages.length} páginas, ${premiumPages.size} fluxos, menus, FAQ, formulários, ARIA, foco, headings e movimento reduzido.`);
