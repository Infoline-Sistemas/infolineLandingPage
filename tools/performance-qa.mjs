import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html',
];
const baseline = { htmlBytes: 801026, cssBytes: 253029, jsBytes: 41533, assetFiles: 152, scriptReferences: 100 };
const failures = [];

function filesIn(directory, extension) {
  return readdirSync(directory).filter((name) => name.endsWith(extension)).map((name) => join(directory, name));
}

const cssFiles = filesIn(join(ROOT, 'assets/css'), '.css');
const jsFiles = filesIn(join(ROOT, 'assets/js'), '.js');
const htmlSizes = pages.map((page) => ({ page, bytes: statSync(join(ROOT, page)).size }));
const cssBytes = cssFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const jsBytes = jsFiles.reduce((sum, file) => sum + statSync(file).size, 0);
const htmlBytes = htmlSizes.reduce((sum, item) => sum + item.bytes, 0);
let scriptReferences = 0;
let stylesheetReferences = 0;
let formsRequestsAvoided = 0;
let maxLoadedCss = { page: '', bytes: 0 };
let maxLoadedJs = { page: '', bytes: 0 };

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const styles = Array.from(html.matchAll(/<link\s+rel="stylesheet"\s+href="([^"]+)"/g), (match) => match[1]);
  const scripts = Array.from(html.matchAll(/<script\s+src="([^"]+)"([^>]*)>/g), (match) => ({ src: match[1], attrs: match[2] }));
  const hasForm = /<form\b/i.test(html);
  const hasFormsScript = scripts.some((script) => script.src === 'assets/js/forms.js');
  scriptReferences += scripts.length;
  stylesheetReferences += styles.length;
  if (hasForm !== hasFormsScript) failures.push(`${page}: forms.js ${hasForm ? 'ausente apesar de existir formulário' : 'carregado sem formulário'}`);
  if (!hasForm && !hasFormsScript) formsRequestsAvoided += 1;
  if (new Set(styles).size !== styles.length) failures.push(`${page}: stylesheet duplicado`);
  if (new Set(scripts.map((script) => script.src)).size !== scripts.length) failures.push(`${page}: script duplicado`);
  const head = html.match(/<head>([\s\S]*?)<\/head>/i)?.[1] || '';
  if (/<script\s+src=/i.test(head)) failures.push(`${page}: script externo bloqueante dentro do head`);
  const loadedCss = styles.reduce((sum, path) => sum + statSync(join(ROOT, path)).size, 0);
  const loadedJs = scripts.reduce((sum, script) => sum + statSync(join(ROOT, script.src)).size, 0);
  if (loadedCss > maxLoadedCss.bytes) maxLoadedCss = { page, bytes: loadedCss };
  if (loadedJs > maxLoadedJs.bytes) maxLoadedJs = { page, bytes: loadedJs };
}

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) result.push(...walk(absolute));
    else result.push(absolute);
  }
  return result;
}
const assets = walk(join(ROOT, 'assets'));
const largestAssets = assets
  .map((file) => ({ file: file.slice(ROOT.length + 1).replace(/\\/g, '/'), bytes: statSync(file).size }))
  .sort((a, b) => b.bytes - a.bytes)
  .slice(0, 5);

if (failures.length) {
  console.error(`QA de performance falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

const result = {
  pages: pages.length,
  html: { before: baseline.htmlBytes, after: htmlBytes, delta: htmlBytes - baseline.htmlBytes, smallest: [...htmlSizes].sort((a, b) => a.bytes - b.bytes)[0], largest: [...htmlSizes].sort((a, b) => b.bytes - a.bytes)[0] },
  css: { sourceBytesBefore: baseline.cssBytes, sourceBytesAfter: cssBytes, stylesheetReferences, largestColdPage: maxLoadedCss },
  js: { sourceBytesBefore: baseline.jsBytes, sourceBytesAfter: jsBytes, scriptReferencesBefore: baseline.scriptReferences, scriptReferencesAfter: scriptReferences, requestsAvoided: baseline.scriptReferences - scriptReferences, largestColdPage: maxLoadedJs },
  assets: { before: baseline.assetFiles, after: assets.length, largest: largestAssets },
  formsRequestsAvoided,
};
console.log(`QA de performance ok: baseline reproduzível para ${pages.length} páginas, sem scripts/CSS duplicados ou forms.js desnecessário.`);
console.log(JSON.stringify(result, null, 2));
