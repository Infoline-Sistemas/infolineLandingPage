import { readFileSync } from 'node:fs';
import http from 'node:http';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const browserPort = process.argv[2] || '';
const pages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html',
];
const knownMarkupEvents = new Set(['cta_click', 'solution_portal_click', 'whatsapp_click']);
const expectedRuntimeEvents = ['page_view', 'module_view', 'solution_view', 'navigation_click', 'form_start', 'form_submit', 'demo_request', 'generate_lead', 'lead_handoff'];
const failures = [];
const inventory = new Map();
const seenLabels = new Set();
let trackedElements = 0;
let whatsappLinks = 0;

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
    await new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(message.error.message));
      else pending.resolve(message.result);
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

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) result[match[1].toLowerCase()] = match[3] ?? match[4] ?? '';
  return result;
}

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const tracked = Array.from(html.matchAll(/<[a-z][^>]*\sdata-track="[^"]+"[^>]*>/gi), (match) => ({ raw: match[0], attrs: attributes(match[0]) }));
  trackedElements += tracked.length;
  for (const element of tracked) {
    const event = element.attrs['data-track'] || '';
    const label = element.attrs['data-label'] || '';
    inventory.set(event, (inventory.get(event) || 0) + 1);
    if (!/^[a-z][a-z0-9_]*$/.test(event)) failures.push(`${page}: data-track inválido: ${event || '(vazio)'}`);
    if (!knownMarkupEvents.has(event)) failures.push(`${page}: evento de markup desconhecido: ${event}`);
    if (!label) failures.push(`${page}: ${event} sem data-label`);
    if (label && !/^[a-z0-9_]+$/.test(label)) failures.push(`${page}: data-label fora da taxonomia estável: ${label}`);
    if (/@|\b\d{8,}\b/.test(label)) failures.push(`${page}: possível PII em data-label: ${label}`);
    const key = `${page}|${event}|${label}`;
    if (label && seenLabels.has(key)) failures.push(`${page}: label duplicado e indistinguível em ${event}: ${label}`);
    seenLabels.add(key);

    if (event === 'whatsapp_click') {
      whatsappLinks += 1;
      const rel = (element.attrs.rel || '').split(/\s+/);
      if (element.attrs.href !== `https://wa.me/${site.whatsapp}`) failures.push(`${page}: WhatsApp com destino divergente`);
      if (element.attrs.target !== '_blank' || !rel.includes('noopener')) failures.push(`${page}: WhatsApp sem target blank/noopener`);
    }
  }

  const forms = Array.from(html.matchAll(/<form\b[^>]*>/gi), (match) => ({ raw: match[0], attrs: attributes(match[0]) }));
  forms.forEach((form) => {
    if (!form.attrs.id) failures.push(`${page}: formulário sem id estável`);
    if (!/\sdata-(?:lead|whatsapp)-form(?:\s|>)/i.test(form.raw)) failures.push(`${page}: formulário fora dos fluxos de tracking conhecidos`);
  });
}

const trackingSource = readFileSync(join(ROOT, 'assets/js/tracking.js'), 'utf8');
const formsSource = readFileSync(join(ROOT, 'assets/js/forms.js'), 'utf8');
const combinedSource = `${trackingSource}\n${formsSource}`;
for (const event of expectedRuntimeEvents) {
  const pattern = new RegExp(`(?:pushEvent|infolineTrack)\\(['"]${event}['"]`);
  if (!pattern.test(combinedSource)) failures.push(`evento essencial ausente no runtime: ${event}`);
}
if (!/el\.getAttribute\('data-label'\)\s*\|\|/.test(trackingSource)) failures.push('tracking de clique não prioriza data-label estável');
if (!/form\.dataset\.startTracked/.test(formsSource)) failures.push('form_start sem trava de disparo único');
if ((formsSource.match(/infolineTrack\('form_start'/g) || []).length !== 2) failures.push('form_start deve existir uma vez por cada controlador de formulário');
if (!/if \(!res\.ok\) throw[\s\S]*return \{ ok: true \};/.test(formsSource)) failures.push('sucesso do endpoint não está condicionado a resposta HTTP válida');
if (!/r\.fallback === 'mailto'[\s\S]*lead_handoff[\s\S]*else[\s\S]*generate_lead/.test(formsSource)) failures.push('fallback e generate_lead não estão claramente separados');

for (const call of combinedSource.matchAll(/(?:pushEvent|infolineTrack)\([^;]+\);/g)) {
  const payload = call[0];
  if (/\b(?:nome|name|email|e-mail|telefone|phone|mensagem|message)\s*:/.test(payload)) failures.push(`possível PII em payload de analytics: ${payload.slice(0, 140)}`);
}

if (browserPort) {
  const tabs = await getJson(`http://127.0.0.1:${browserPort}/json`);
  async function formRuntime(page, selector, mode) {
    const tab = tabs.find((item) => item.type === 'page' && item.url.endsWith(`/${page}`));
    if (!tab) throw new Error(`${page}: aba não encontrada para QA de tracking`);
    const cdp = new Cdp(tab.webSocketDebuggerUrl);
    await cdp.open();
    await cdp.call('Page.bringToFront');
    await cdp.call('Page.reload', { ignoreCache: true });
    await new Promise((done) => setTimeout(done, 700));
    const result = JSON.parse(await cdp.evaluate(`(async () => {
      window.infolineConsent.save({ analytics: true, marketing: false });
      window.dataLayer = [];
      const form = document.querySelector(${JSON.stringify(selector)});
      const required = Array.from(form.querySelectorAll('[required]'));
      required.forEach((control) => {
        if (control.type === 'checkbox') control.checked = true;
        else if (control.tagName === 'SELECT') control.selectedIndex = 1;
        else if (control.type === 'email') control.value = 'qa@example.invalid';
        else if (control.type === 'tel') control.value = '41999999999';
        else control.value = 'Valor QA sem dado real';
        control.dispatchEvent(new Event('input', { bubbles: true }));
        control.dispatchEvent(new Event('change', { bubbles: true }));
      });
      required[0].focus();
      required[1].focus();
      ${mode === 'endpoint' ? `window.INFOLINE_CONFIG.leadEndpoint = '/qa-endpoint'; window.fetch = async () => ({ ok: true, status: 200, headers: { get: () => 'application/json' }, json: async () => ({ success: true }) });` : `window.__qaOpened = ''; window.open = (url) => { window.__qaOpened = url; return null; };`}
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await new Promise((done) => setTimeout(done, 120));
      return JSON.stringify({ events: window.dataLayer, opened: window.__qaOpened || '', serialized: JSON.stringify(window.dataLayer) });
    })()`));
    cdp.close();
    return result;
  }

  const home = await formRuntime('index.html', '#form-contato', 'endpoint');
  const homeCounts = Object.fromEntries(['form_start', 'form_submit', 'demo_request', 'generate_lead', 'lead_handoff'].map((event) => [event, home.events.filter((item) => item.event === event).length]));
  if (homeCounts.form_start !== 1 || homeCounts.form_submit !== 1 || homeCounts.demo_request !== 1 || homeCounts.generate_lead !== 1 || homeCounts.lead_handoff !== 0) failures.push(`index.html: sequência de tracking do formulário incorreta: ${JSON.stringify(homeCounts)}`);
  if (/qa@example\.invalid|41999999999|Valor QA/.test(home.serialized)) failures.push('index.html: valores do formulário vazaram para o dataLayer');

  const career = await formRuntime('trabalhe-conosco.html', '#career-form', 'whatsapp');
  const careerCounts = Object.fromEntries(['form_start', 'form_submit', 'generate_lead', 'lead_handoff'].map((event) => [event, career.events.filter((item) => item.event === event).length]));
  const handoff = career.events.find((item) => item.event === 'lead_handoff');
  if (careerCounts.form_start !== 1 || careerCounts.form_submit !== 1 || careerCounts.generate_lead !== 0 || careerCounts.lead_handoff !== 1 || handoff?.channel !== 'whatsapp' || !career.opened.startsWith(`https://wa.me/${site.whatsapp}?text=`)) failures.push(`trabalhe-conosco.html: sequência de handoff incorreta: ${JSON.stringify({ careerCounts, handoff, opened: career.opened })}`);
  if (/qa@example\.invalid|41999999999|Valor QA/.test(career.serialized)) failures.push('trabalhe-conosco.html: valores do formulário vazaram para o dataLayer');
}

if (failures.length) {
  console.error(`QA de tracking falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de tracking ok: ${pages.length} páginas, ${trackedElements} ações no markup e ${whatsappLinks} links de WhatsApp validados, sem PII${browserPort ? '; formulários confirmados em navegador' : ''}.`);
console.log(`Inventário: ${Array.from(inventory).map(([event, count]) => `${event}=${count}`).join(', ')}; runtime=${expectedRuntimeEvents.join(', ')}.`);
