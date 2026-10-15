import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const preservedPages = new Set(['charlotte-paes-privacidade.html']);
const pages = fs.readdirSync(root).filter((name) => name.endsWith('.html') && !preservedPages.has(name)).sort();
const errors = [];
const expectedPages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html', 'politicadeprivacidade.html',
].sort();
const premiumPages = new Set([
  'pcpm.html', 'wms.html', 'compras.html', 'custos.html', 'comercial.html',
  'crm.html', 'ecommerce.html', 'financeiro.html', 'integracao-whatsapp.html',
  'contabilidade.html', 'controladoria.html', 'rh.html', 'gestao-processos.html',
]);

function fail(page, message) {
  errors.push(`${page}: ${message}`);
}

if (pages.join('|') !== expectedPages.join('|')) {
  fail('site', `esperadas ${expectedPages.length} páginas oficiais; encontradas: ${pages.join(', ')}`);
}

for (const page of pages) {
  const file = path.join(root, page);
  const html = fs.readFileSync(file, 'utf8');
  const h1s = html.match(/<h1\b/gi) || [];
  if (h1s.length !== 1) fail(page, `esperado 1 H1; encontrado ${h1s.length}`);
  if (!/<title>[^<]{10,}<\/title>/i.test(html)) fail(page, 'title ausente ou muito curto');
  if (!/<meta\s+name="description"\s+content="[^"]{40,}"/i.test(html)) fail(page, 'meta description ausente ou curta');
  if (!/<link\s+rel="canonical"\s+href="https:\/\/infolinesystems\.com\.br\/[^"]*"/i.test(html)) fail(page, 'canonical ausente ou inválida');
  if (/onsubmit\s*=/i.test(html)) fail(page, 'onsubmit inline encontrado');
  if (/og-cover\.png/i.test(html)) fail(page, 'referência ao og-cover inexistente');

  const ids = [...html.matchAll(/\bid="([^"]+)"/gi)].map((match) => match[1]);
  const idSet = new Set();
  for (const id of ids) {
    if (idSet.has(id)) fail(page, `ID duplicado: ${id}`);
    idSet.add(id);
  }

  const internalAnchors = [...html.matchAll(/\bhref="#([^"]+)"/gi)].map((match) => match[1]);
  for (const target of internalAnchors) {
    if (!idSet.has(target)) fail(page, `âncora interna sem destino: #${target}`);
  }

  const ariaControls = [...html.matchAll(/\baria-controls="([^"]+)"/gi)]
    .flatMap((match) => match[1].split(/\s+/).filter(Boolean));
  for (const target of ariaControls) {
    if (!idSet.has(target)) fail(page, `aria-controls sem destino: ${target}`);
  }

  if (premiumPages.has(page)) {
    if (!html.includes('<span class="mod-product-label">Tela ilustrativa</span>')) {
      fail(page, 'hero premium sem identificação visual de tela ilustrativa');
    }
    if (!html.includes('Representação ilustrativa. Nenhum dado real é exibido.')) {
      fail(page, 'aviso sobre dados ilustrativos ausente');
    }
  }

  const refs = [...html.matchAll(/\b(?:href|src)="([^"]+)"/gi)].map((m) => m[1]);
  for (const ref of refs) {
    if (!ref || /^(?:#|https?:|mailto:|tel:|data:|javascript:)/i.test(ref)) continue;
    const clean = decodeURIComponent(ref.split('#')[0].split('?')[0]);
    if (!clean) continue;
    const target = path.resolve(path.dirname(file), clean.replace(/^\//, ''));
    if (!fs.existsSync(target)) fail(page, `referência local inexistente: ${ref}`);
  }
}

const appsPolicy = fs.readFileSync(path.join(root, 'politicadeprivacidade.html'), 'utf8');
const originalPolicy = fs.readFileSync(path.join(root, 'tools/policies/apps-infoline.html'), 'utf8');
const policyText = (html) => (html.match(/<section\b[^>]*\bid="politica"[^>]*>([\s\S]*?)<\/section>/)?.[1] || '')
  .replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
if (!policyText(originalPolicy) || policyText(appsPolicy) !== policyText(originalPolicy)) {
  fail('politicadeprivacidade.html', 'a URL original precisa preservar todo o texto da política dos apps');
}
if (!appsPolicy.includes('https://infolinesystems.com.br/politicadeprivacidade.html')) {
  fail('politicadeprivacidade.html', 'canonical própria da política dos apps ausente');
}

for (const js of fs.readdirSync(path.join(root, 'assets', 'js')).filter((name) => name.endsWith('.js'))) {
  const text = fs.readFileSync(path.join(root, 'assets', 'js', js), 'utf8');
  if (/console\.(?:log|info)\s*\(/.test(text)) fail(`assets/js/${js}`, 'console de depuração encontrado');
}

if (errors.length) {
  console.error(`QA falhou com ${errors.length} problema(s):`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

console.log(`QA ok: ${pages.length} páginas, estrutura, metadados e referências locais validados.`);
