import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative } from 'node:path';
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
const direct = new Set();
const failures = [];

function walk(directory) {
  const result = [];
  for (const entry of readdirSync(directory)) {
    const absolute = join(directory, entry);
    if (statSync(absolute).isDirectory()) result.push(...walk(absolute));
    else result.push(absolute);
  }
  return result;
}

function addReference(reference, source = ROOT) {
  if (!reference || /^(?:[a-z]+:|\/\/|#)/i.test(reference)) return;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!clean) return;
  const resolved = normalize(join(source === ROOT ? ROOT : dirname(source), clean.replace(/^\//, '')));
  if (!resolved.startsWith(normalize(ROOT))) return;
  const rel = relative(ROOT, resolved).replace(/\\/g, '/');
  if (rel.startsWith('assets/')) direct.add(rel);
}

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  for (const tag of html.matchAll(/<[a-z][^>]*>/gi)) {
    const raw = tag[0];
    for (const attr of raw.matchAll(/(?:href|src)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)) addReference(attr[1] || attr[2]);
    for (const attr of raw.matchAll(/(?:srcset|imagesrcset)\s*=\s*(?:"([^"]+)"|'([^']+)')/gi)) {
      for (const candidate of (attr[1] || attr[2]).split(',')) addReference(candidate.trim().split(/\s+/)[0]);
    }
  }
}
for (const cssFile of readdirSync(join(ROOT, 'assets/css')).filter((name) => name.endsWith('.css'))) {
  const absolute = join(ROOT, 'assets/css', cssFile);
  const css = readFileSync(absolute, 'utf8');
  for (const match of css.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)\s]+))\)/g)) addReference(match[1] || match[2] || match[3], absolute);
}
const manifest = JSON.parse(readFileSync(join(ROOT, 'site.webmanifest'), 'utf8'));
for (const icon of manifest.icons || []) addReference(icon.src);
for (const required of ['assets/img/icons.svg', 'assets/img/logo-mark.svg']) direct.add(required);

const published = walk(join(ROOT, 'assets')).map((file) => relative(ROOT, file).replace(/\\/g, '/')).sort();
const initialCandidates = published.filter((file) => !direct.has(file));
const imageManifest = JSON.parse(readFileSync(join(ROOT, 'assets/images.manifest.json'), 'utf8'));
const imageFamilies = Object.entries(imageManifest).sort((a, b) => b[0].length - a[0].length);
const imagePipeline = readFileSync(join(ROOT, 'tools/images.py'), 'utf8');
const indirect = [];
const candidate = [];
const uncertain = [];

for (const file of initialCandidates) {
  if (file === 'assets/images.manifest.json') {
    indirect.push(file);
    continue;
  }
  if (file.startsWith('assets/img/')) {
    const name = file.slice('assets/img/'.length);
    const family = imageFamilies.find(([key, value]) => value.w.some((width) => name === `${key}-${width}.avif` || name === `${key}-${width}.webp`));
    if (family && imagePipeline.includes(`'${family[0]}'`)) indirect.push(file);
    else uncertain.push(file);
    continue;
  }
  candidate.push(file);
}

for (const file of [...direct, ...indirect]) if (!existsSync(join(ROOT, file))) failures.push(`referência classificada para arquivo inexistente: ${file}`);
if (direct.size + indirect.length + candidate.length + uncertain.length !== published.length) failures.push('classificação não cobre todos os assets publicados');

if (failures.length) {
  console.error(`QA de órfãos falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de órfãos ok: ${published.length} assets publicados.`);
console.log(`USADO ${direct.size}: referenciado diretamente por HTML, CSS ou manifest.`);
console.log(`INDIRETO ${indirect.length}: metadado ou variante preservada pelo pipeline de imagens.`);
console.log(`CANDIDATO ${candidate.length}: sem dependência comprovada; revisar manualmente antes de remover.`);
console.log(`INCERTO ${uncertain.length}: uso não demonstrado nem descartado; manter por segurança.`);
console.log(`Os ${initialCandidates.length} candidatos estáticos iniciais foram classificados; nenhuma remoção é automática.`);
if (candidate.length) candidate.forEach((file) => console.log(` - CANDIDATO ${file}`));
if (uncertain.length) uncertain.forEach((file) => console.log(` - INCERTO ${file}`));
