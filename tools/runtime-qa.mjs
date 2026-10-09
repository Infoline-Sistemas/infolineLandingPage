import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const { chromium } = createRequire(import.meta.url)(process.env.PLAYWRIGHT_MODULE || 'playwright');
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const origin = process.env.QA_SITE_URL || 'http://127.0.0.1:4175';
const output = join(root, '.qa-runtime');
mkdirSync(output, { recursive: true });
const pages = readdirSync(root).filter((name) => name.endsWith('.html') && name !== 'charlotte-paes-privacidade.html');
const config = readFileSync(join(root, 'assets/js/config.js'), 'utf8');
const browser = await chromium.launch({ channel: 'chrome', headless: true });
let checks = 0;
function check(value, message) { assert.ok(value, message); checks++; }
async function fixture(overrides = {}, saved = null) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const external = [];
  await context.route('**/assets/js/config.js', (route) => route.fulfill({ contentType: 'text/javascript', body: config + '\nObject.assign(window.INFOLINE_CONFIG, ' + JSON.stringify(overrides) + ');' }));
  await context.route(/https:\/\/(?:www\.googletagmanager\.com|connect\.facebook\.net)\//, (route) => { external.push(route.request().url()); return route.fulfill({ contentType: 'text/javascript', body: '' }); });
  if (saved) await context.addInitScript((data) => { localStorage.setItem('infoline_cookie_consent', JSON.stringify(data)); }, saved);
  const page = await context.newPage();
  return { context, page, external };
}
async function state(page) {
  return page.evaluate(() => ({ consent: window.infolineConsent.get(), campaign: window.infolineGetCampaignParams(), events: JSON.parse(JSON.stringify(window.dataLayer)), scripts: [...document.scripts].filter((s) => s.src.startsWith('https://')).map((s) => s.src), cookies: document.cookie }));
}
async function fillLead(page) {
  await page.locator('#c-nome').fill('Teste de integração');
  await page.locator('#c-empresa').fill('Empresa de teste');
  await page.locator('#c-whats').fill('41999999999');
  await page.locator('#c-email').fill('qa@example.invalid');
  await page.locator('#c-msg').fill('Solicitação usada somente em teste local');
  await page.locator('#form-contato [name="consentimento"]').check();
}
try {
  // Toda a navegação pública, assets e larguras documentadas.
  await Promise.all([1440, 1024, 390].map(async (width) => {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    const failed = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('response', (response) => { if (response.url().startsWith(origin) && response.status() >= 400) failed.push(response.url()); });
    for (const name of pages) {
      const response = await page.goto(origin + '/' + name, { waitUntil: 'networkidle' });
      check(response.status() === 200, name + ': HTTP 200');
      const dimensions = await page.evaluate(() => ({ inner: innerWidth, scroll: document.documentElement.scrollWidth }));
      check(dimensions.scroll <= dimensions.inner + 1, name + ': overflow em ' + width + 'px: ' + JSON.stringify(dimensions));
      check(await page.locator('[data-cookie-banner]').isVisible(), name + ': banner inicial');
      check(await page.locator('a[href="https://erp.infolinesystems.app.br/InfolineV3.1/#/login"]').count() > 0, name + ': acesso V3.1');
      if (name === 'index.html' && width !== 1024) await page.screenshot({ path: join(output, 'home-' + width + '.png') });
      if (name === 'pcpm.html' && width === 390) await page.screenshot({ path: join(output, 'pcpm-390.png') });
    }
    check(errors.length === 0, 'Erros de JavaScript: ' + errors.join(', '));
    check(failed.length === 0, 'Recursos quebrados: ' + failed.join(', '));
    if (width === 390) {
      await page.locator('[data-cookie-banner] [data-cookie-action="reject"]').click();
      await page.locator('[data-menu-toggle]').click();
      check(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded') === 'true', 'Menu mobile abre');
      await page.locator('[data-menu-toggle]').click();
      check(await page.locator('[data-menu-toggle]').getAttribute('aria-expanded') === 'false', 'Menu mobile fecha');
    }
    await context.close();
  }));
  console.log('Navegação e responsividade: 21 páginas em 1440, 1024 e 390px.');

  const tracking = await fixture({ gtmId: 'GTM-TEST123', metaPixelId: '123456789' });
  await tracking.page.goto(origin + '/index.html?utm_source=qa&gclid=ad-test');
  let cloudflareRequests = 0;
  await tracking.page.route('https://static.cloudflareinsights.com/**', (route) => { cloudflareRequests++; return route.fulfill({ body: '' }); });
  await tracking.page.evaluate(() => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.onload = script.onerror = resolve;
    document.head.appendChild(script);
  }));
  check(cloudflareRequests === 0, 'CSP bloqueia beacon automático do Cloudflare');
  await tracking.page.evaluate(() => { document.querySelector('script[src="https://static.cloudflareinsights.com/beacon.min.js"]').remove(); });
  let value = await state(tracking.page);
  check(tracking.external.length === 0 && value.scripts.length === 0, 'Nenhuma tag antes do consentimento');
  check(Object.keys(value.campaign).length === 0, 'Nenhuma campanha antes do consentimento');
  check(!value.events.some((event) => event.event === 'page_view'), 'Nenhum page_view antes do consentimento');
  check(value.events[0][0] === 'consent' && value.events[0][1] === 'default' && value.events[0][2].ad_user_data === 'denied', 'Consent Mode começa negado');
  await tracking.page.locator('[data-cookie-banner] [data-cookie-settings]').click();
  await tracking.page.locator('[data-cookie-analytics]').check();
  await tracking.page.locator('[data-cookie-action="save"]').click();
  value = await state(tracking.page);
  check(value.campaign.utm_source === 'qa' && !value.campaign.gclid, 'Estatísticas sem identificadores de anúncios');
  check(value.scripts.length === 1 && value.scripts[0].includes('gtm.js'), 'Só GTM com autorização de estatísticas');
  check(value.events.filter((event) => event.event === 'page_view').length === 1, 'Page view único após autorização');
  await tracking.page.goto(origin + '/politica-de-privacidade.html');
  check(!await tracking.page.locator('[data-cookie-banner]').isVisible(), 'Preferências persistem entre páginas');
  await tracking.page.locator('.footer [data-cookie-settings]').click();
  await tracking.page.locator('[data-cookie-marketing]').check();
  await tracking.page.locator('[data-cookie-action="save"]').click();
  value = await state(tracking.page);
  check(value.scripts.some((url) => url.includes('facebook')), 'Pixel apenas com publicidade');
  await tracking.page.evaluate(() => { document.cookie = '_ga=qa; path=/'; document.cookie = '_fbp=qa; path=/'; });
  await tracking.page.locator('.footer [data-cookie-settings]').click();
  await Promise.all([tracking.page.waitForEvent('load'), tracking.page.locator('[data-cookie-dialog] [data-cookie-action="reject"]').click()]);
  value = await state(tracking.page);
  check(value.scripts.length === 0 && !value.consent.analytics && !value.consent.marketing, 'Revogar recarrega sem tags');
  check(Object.keys(value.campaign).length === 0 && !/_ga=|_fbp=/.test(value.cookies), 'Revogar limpa campanha e cookies');
  await tracking.context.close();

  const expired = await fixture({ gtmId: 'GTM-TEST123' }, { version: 1, analytics: true, marketing: true, updatedAt: Date.now() - 181 * 86400000 });
  await expired.page.goto(origin + '/index.html');
  check(await expired.page.locator('[data-cookie-banner]').isVisible() && expired.external.length === 0, 'Consentimento expirado é solicitado novamente');
  await expired.context.close();
  const blocked = await fixture({ gtmId: 'GTM-TEST123' });
  await blocked.context.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage indisponível'); } }); });
  await blocked.page.goto(origin + '/index.html');
  await blocked.page.locator('[data-cookie-banner] [data-cookie-action="reject"]').click();
  check((await state(blocked.page)).consent.decided && blocked.external.length === 0, 'Navegação funciona com armazenamento bloqueado');
  await blocked.context.close();
  const ga = await fixture({ ga4Id: 'G-TEST123' });
  await ga.page.goto(origin + '/index.html');
  check(ga.external.length === 0, 'GA4 direto não carrega antes da escolha');
  await ga.page.locator('[data-cookie-banner] [data-cookie-action="accept"]').click();
  value = await state(ga.page);
  check(value.scripts.some((url) => url.includes('gtag/js')), 'GA4 direto carrega após autorização');
  check(value.events.some((event) => event[0] === 'event' && event[1] === 'page_view'), 'GA4 direto recebe eventos');
  await ga.context.close();
  console.log('Consentimento: recusa, categorias, persistência, expiração, revogação, armazenamento bloqueado e GA4/GTM.');

  // Interceptação evita enviar leads reais ou abrir conversas durante o QA.
  const lead = await fixture();
  let requests = 0;
  let lastBody = '';
  let success = false;
  await lead.context.route('https://api.web3forms.com/submit', (route) => { requests++; lastBody = route.request().postData() || ''; return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success }) }); });
  await lead.page.goto(origin + '/index.html?utm_source=unconsented&gclid=unconsented');
  await lead.page.locator('[data-cookie-banner] [data-cookie-action="reject"]').click();
  await lead.page.locator('#form-contato button[type="submit"]').click();
  check(requests === 0, 'Campos inválidos impedem envio');
  await fillLead(lead.page);
  await lead.page.locator('#form-contato button[type="submit"]').click();
  await lead.page.locator('.form-status--err').waitFor();
  check(requests === 1 && await lead.page.locator('#c-nome').inputValue() !== '', 'HTTP 200 com success false mantém dados e exibe erro');
  check(!lastBody.includes('unconsented') && !lastBody.includes('gclid'), 'Formulário funciona sem campanhas não consentidas');
  check(lastBody.includes('access_key') && lastBody.includes('qa@example.invalid'), 'Web3Forms recebe o payload esperado');
  success = true;
  await lead.page.locator('#form-contato button[type="submit"]').click();
  await lead.page.locator('.form-status--ok').waitFor();
  check(await lead.page.locator('#c-nome').inputValue() === '', 'Sucesso confirmado limpa formulário');
  check(!(await state(lead.page)).events.some((event) => event.event === 'generate_lead'), 'Recusa impede eventos mesmo no sucesso');
  await lead.page.locator('.footer [data-cookie-settings]').click();
  await lead.page.locator('[data-cookie-analytics]').check();
  await lead.page.locator('[data-cookie-action="save"]').click();
  await fillLead(lead.page);
  await lead.page.locator('#form-contato button[type="submit"]').click();
  await lead.page.locator('.form-status--ok').waitFor();
  value = await state(lead.page);
  check(value.events.filter((event) => event.event === 'generate_lead').length === 1, 'Conversão apenas no sucesso confirmado');
  check(!/qa@example|41999999999|Solicitação usada/.test(JSON.stringify(value.events)), 'Dados pessoais fora do dataLayer');
  await fillLead(lead.page);
  await lead.page.locator('#form-contato [name="website"]').fill('bot', { force: true });
  const previousRequests = requests;
  await lead.page.locator('#form-contato button[type="submit"]').click();
  await lead.page.waitForFunction(() => !document.querySelector('#form-contato button[type="submit"]').disabled);
  check(requests === previousRequests && (await state(lead.page)).events.filter((event) => event.event === 'generate_lead').length === 1, 'Honeypot não envia nem gera conversão');
  await lead.page.goto(origin + '/index.html#empresa');
  check(new URL(lead.page.url()).hash === '#quem-somos', 'Âncora antiga preservada');
  await lead.context.close();

  const careers = await fixture();
  await careers.context.addInitScript(() => { window.open = (url) => { window.__qaWhatsapp = url; return null; }; });
  await careers.page.goto(origin + '/trabalhe-conosco.html');
  await careers.page.locator('[data-cookie-banner] [data-cookie-action="reject"]').click();
  await careers.page.locator('#t-nome').fill('Candidatura teste');
  await careers.page.locator('#t-email').fill('qa@example.invalid');
  await careers.page.locator('#t-tel').fill('41999999999');
  await careers.page.locator('#t-area').selectOption({ index: 1 });
  await careers.page.locator('#t-exp').fill('Experiência usada somente no QA');
  await careers.page.locator('#career-form button[type="submit"]').click();
  check(!await careers.page.evaluate(() => window.__qaWhatsapp), 'Candidatura exige autorização de tratamento');
  await careers.page.locator('#career-form [name="consentimento"]').check();
  await careers.page.locator('#career-form button[type="submit"]').click();
  check((await careers.page.evaluate(() => window.__qaWhatsapp)).startsWith('https://wa.me/5541988538135?text='), 'Candidatura segue para WhatsApp correto');
  check(await careers.page.locator('.form-status--ok').isVisible(), 'Candidatura orienta confirmação no WhatsApp');
  await careers.context.close();
  for (const name of ['charlotte-paes-privacidade.html', 'tattooflow/index.html']) {
    if (readdirSync(root).includes(name.split('/')[0])) check((await fetch(origin + '/' + name)).status === 200, 'Política de aplicativo preservada: ' + name);
  }
  console.log('Formulários: validação, erro de negócio, sucesso, consentimento, proteção contra bot e candidatura. Nenhum lead real enviado.');
  console.log('QA de navegador ok: ' + checks + ' verificações. Capturas em ' + output);
} finally { await browser.close(); }
