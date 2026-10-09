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
  'politica-de-privacidade.html', 'politicadeprivacidade.html',
];
const failures = [];
const referenced = new Set();
let localReferences = 0;

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) result[match[1].toLowerCase()] = match[3] ?? match[4] ?? '';
  return result;
}

function localPath(reference, source = '') {
  if (!reference || /^(?:[a-z]+:|\/\/|#)/i.test(reference)) return null;
  const clean = decodeURIComponent(reference.split(/[?#]/)[0]);
  if (!clean) return null;
  const base = source ? dirname(source) : ROOT;
  const resolved = normalize(join(base, clean.replace(/^\//, '')));
  if (!resolved.startsWith(normalize(ROOT))) return null;
  return resolved;
}

function verify(reference, owner, source = '') {
  const resolved = localPath(reference, source);
  if (!resolved) return;
  localReferences += 1;
  referenced.add(relative(ROOT, resolved).replace(/\\/g, '/'));
  if (!existsSync(resolved)) failures.push(`${owner}: referência local inexistente: ${reference}`);
}

const spritePath = join(ROOT, 'assets/img/icons.svg');
const sprite = readFileSync(spritePath, 'utf8');
const spriteIds = new Set(Array.from(sprite.matchAll(/<symbol\b[^>]*id="([^"]+)"/g), (match) => match[1]));

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const stylesheetRefs = [];
  const scriptRefs = [];
  const tags = Array.from(html.matchAll(/<[a-z][^>]*>/gi), (match) => ({ raw: match[0], attrs: attributes(match[0]) }));
  for (const tag of tags) {
    if (tag.attrs.href) {
      verify(tag.attrs.href, page);
      if ((tag.attrs.rel || '').split(/\s+/).includes('stylesheet')) stylesheetRefs.push(tag.attrs.href);
    }
    if (tag.attrs.src) {
      verify(tag.attrs.src, page);
      if (/^<script\b/i.test(tag.raw)) scriptRefs.push(tag.attrs.src);
    }
    if (tag.attrs.srcset) {
      for (const candidate of tag.attrs.srcset.split(',')) verify(candidate.trim().split(/\s+/)[0], page);
    }
    if (/^<use\b/i.test(tag.raw) && tag.attrs.href) {
      const [file, id] = tag.attrs.href.split('#');
      verify(file, page);
      if (file.endsWith('icons.svg') && (!id || !spriteIds.has(id))) failures.push(`${page}: símbolo inexistente no sprite: ${tag.attrs.href}`);
    }
  }
  const duplicateStyles = stylesheetRefs.filter((ref, index) => stylesheetRefs.indexOf(ref) !== index);
  const duplicateScripts = scriptRefs.filter((ref, index) => scriptRefs.indexOf(ref) !== index);
  if (duplicateStyles.length) failures.push(`${page}: stylesheet duplicado: ${[...new Set(duplicateStyles)].join(', ')}`);
  if (duplicateScripts.length) failures.push(`${page}: script duplicado: ${[...new Set(duplicateScripts)].join(', ')}`);

  for (const preload of tags.filter((tag) => (tag.attrs.rel || '').split(/\s+/).includes('preload'))) {
    verify(preload.attrs.href, `${page} preload`);
    if (preload.attrs.as === 'style' && !stylesheetRefs.includes(preload.attrs.href)) failures.push(`${page}: preload de CSS sem stylesheet correspondente: ${preload.attrs.href}`);
    if (preload.attrs.imagesrcset) for (const candidate of preload.attrs.imagesrcset.split(',')) verify(candidate.trim().split(/\s+/)[0], `${page} preload`);
  }
}

for (const cssFile of readdirSync(join(ROOT, 'assets/css')).filter((name) => name.endsWith('.css'))) {
  const absolute = join(ROOT, 'assets/css', cssFile);
  const css = readFileSync(absolute, 'utf8');
  for (const match of css.matchAll(/url\((?:"([^"]+)"|'([^']+)'|([^)'"\s]+))\)/g)) verify(match[1] || match[2] || match[3], `assets/css/${cssFile}`, absolute);
}

for (const required of ['favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'site.webmanifest', 'assets/img/icons.svg', 'assets/img/logo-mark.svg']) verify(required, 'arquivos globais');

let manifest;
try {
  manifest = JSON.parse(readFileSync(join(ROOT, 'site.webmanifest'), 'utf8'));
} catch (error) {
  failures.push(`site.webmanifest inválido: ${error.message}`);
}
if (manifest) {
  verify(manifest.start_url, 'site.webmanifest');
  for (const icon of manifest.icons || []) verify(icon.src, 'site.webmanifest');
  if (!manifest.name || !manifest.short_name || !manifest.theme_color) failures.push('site.webmanifest sem campos básicos');
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
const publishedAssets = walk(join(ROOT, 'assets')).map((file) => relative(ROOT, file).replace(/\\/g, '/'));
const orphanCandidates = publishedAssets.filter((file) => !referenced.has(file));

if (failures.length) {
  console.error(`QA de assets falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de assets ok: ${pages.length} páginas, ${localReferences} referências locais, manifest, favicons e ${spriteIds.size} símbolos do sprite validados.`);
console.log(`Inventário: ${publishedAssets.length} assets publicados; ${orphanCandidates.length} candidatos a órfãos registrados para Sprint 4, sem remoção automática.`);
