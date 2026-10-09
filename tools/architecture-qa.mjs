import { existsSync, readFileSync } from 'node:fs';
import { dirname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

import { moduleOrder } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];
const expectedRenderers = [
  'pcpm', 'comercial', 'wms', 'compras', 'financeiro', 'custos', 'crm',
  'ecommerce', 'contabilidade', 'controladoria', 'rh', 'processos', 'whatsapp',
];
const pages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html',
];

function fail(message) {
  failures.push(message);
}

function attrs(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) result[match[1].toLowerCase()] = match[2] ?? match[3] ?? '';
  return result;
}

for (const required of [
  'tools/build.mjs', 'tools/content.mjs', 'tools/layout.mjs',
  'tools/pages/module.mjs', 'assets/css/module-system.css',
  'assets/js/navigation.js', 'assets/js/interactions.js', 'assets/js/forms.js',
  'assets/img/icons.svg',
]) {
  if (!existsSync(join(ROOT, required))) fail(`dependência essencial ausente: ${required}`);
}

const moduleSource = readFileSync(join(ROOT, 'tools/pages/module.mjs'), 'utf8');
const rendererBlock = moduleSource.match(/const customRenderers\s*=\s*\{([\s\S]*?)\n\};/)?.[1] || '';
const rendererKeys = Array.from(rendererBlock.matchAll(/^\s*([\w-]+)\s*:/gm), (match) => match[1]);
if (rendererKeys.join('|') !== expectedRenderers.join('|')) fail(`customRenderers divergente: ${rendererKeys.join(', ')}`);
if (moduleOrder.length !== expectedRenderers.length || expectedRenderers.some((key) => !moduleOrder.includes(key))) fail(`moduleOrder divergente dos 13 renderers premium: ${moduleOrder.join(', ')}`);

const sharedCss = readFileSync(join(ROOT, 'assets/css/module-system.css'), 'utf8');
const productPrefixes = expectedRenderers.flatMap((key) => {
  const aliases = { comercial: 'commercial', compras: 'purchases', financeiro: 'financial', contabilidade: 'accounting', controladoria: 'controllership', processos: 'processes', whatsapp: 'wapp' };
  return [key, aliases[key]].filter(Boolean);
});
for (const prefix of productPrefixes) {
  if (new RegExp(`\\.${prefix}-`, 'i').test(sharedCss)) fail(`module-system.css acoplado ao módulo específico: .${prefix}-*`);
}

const commonScripts = ['assets/js/config.js', 'assets/js/consent.js', 'assets/js/tracking.js', 'assets/js/navigation.js', 'assets/js/interactions.js'];
const formPages = new Set(['index.html', 'trabalhe-conosco.html']);
for (const page of pages) {
  const absolute = join(ROOT, page);
  if (!existsSync(absolute)) {
    fail(`página oficial ausente: ${page}`);
    continue;
  }
  const html = readFileSync(absolute, 'utf8');
  const tags = Array.from(html.matchAll(/<(?:script|link)\b[^>]*>/gi), (match) => ({ raw: match[0], attrs: attrs(match[0]) }));
  const scripts = tags.filter((tag) => /^<script/i.test(tag.raw) && tag.attrs.src).map((tag) => tag.attrs.src);
  const styles = tags.filter((tag) => /^<link/i.test(tag.raw) && tag.attrs.rel === 'stylesheet').map((tag) => tag.attrs.href);
  for (const script of commonScripts) if (!scripts.includes(script)) fail(`${page}: script compartilhado ausente: ${script}`);
  if (scripts.indexOf('assets/js/consent.js') > scripts.indexOf('assets/js/tracking.js')) fail(`${page}: consentimento precisa iniciar antes do tracking`);
  const hasForms = scripts.includes('assets/js/forms.js');
  if (hasForms !== formPages.has(page)) fail(`${page}: forms.js ${hasForms ? 'carregado sem necessidade' : 'ausente'}`);
  if (new Set(scripts).size !== scripts.length) fail(`${page}: script duplicado`);
  if (new Set(styles).size !== styles.length) fail(`${page}: stylesheet duplicado`);
}

const mjsFiles = [
  'tools/build.mjs', 'tools/head.mjs', 'tools/layout.mjs', 'tools/lib.mjs',
  'tools/mocks.mjs', ...expectedRenderers.map((key) => {
    const names = { comercial: 'commercial', compras: 'purchases', financeiro: 'financial', contabilidade: 'accounting', controladoria: 'controllership', processos: 'processes', whatsapp: 'whatsapp' };
    return `tools/pages/${names[key] || key}.mjs`;
  }),
];
for (const file of mjsFiles) {
  const absolute = join(ROOT, file);
  if (!existsSync(absolute)) continue;
  const source = readFileSync(absolute, 'utf8');
  for (const match of source.matchAll(/import[\s\S]*?from\s+['"]([^'"]+)['"]/g)) {
    if (!match[1].startsWith('.')) continue;
    const target = normalize(join(dirname(absolute), match[1]));
    if (!existsSync(target)) fail(`${file}: import local inexistente: ${match[1]}`);
  }
}

if (failures.length) {
  console.error(`QA de arquitetura falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de arquitetura ok: ${pages.length} páginas, ${rendererKeys.length} customRenderers, dependências compartilhadas e scripts condicionais validados.`);
