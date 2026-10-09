import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { site } from './content.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const pages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html',
];

const failures = [];
const titles = new Map();
const descriptions = new Map();
let socialImageCount = 0;

function attributes(tag) {
  const result = {};
  for (const match of tag.matchAll(/([:\w-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
    result[match[1].toLowerCase()] = match[3] ?? match[4] ?? '';
  }
  return result;
}

function tagList(html, tagName) {
  return Array.from(html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, 'gi')), (match) => ({ raw: match[0], attrs: attributes(match[0]) }));
}

function decodeHtml(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function text(value) {
  return decodeHtml(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
}

function meta(tags, key, value) {
  return tags.filter((tag) => tag.attrs[key] === value);
}

function expectedUrl(page) {
  return `${site.url}/${page === 'index.html' ? '' : page}`;
}

function visibleFaq(html) {
  return Array.from(html.matchAll(/<details\b[^>]*class="[^"]*\bfaq-item\b[^"]*"[^>]*>([\s\S]*?)<\/details>/gi), (match) => {
    const block = match[1];
    const question = block.match(/<summary\b[^>]*>([\s\S]*?)<\/summary>/i)?.[1] || '';
    const answer = block.match(/<p\b[^>]*class="[^"]*\bfaq-item-a\b[^"]*"[^>]*>([\s\S]*?)<\/p>/i)?.[1] || '';
    return [text(question), text(answer)];
  });
}

function visibleBreadcrumb(html) {
  const block = html.match(/<nav\b[^>]*class="[^"]*\bbreadcrumb\b[^"]*"[^>]*>([\s\S]*?)<\/nav>/i)?.[1];
  if (!block) return [];
  return Array.from(block.matchAll(/<li\b([^>]*)>([\s\S]*?)<\/li>/gi))
    .map((match) => ({ attrs: attributes(`<li ${match[1]}>`), body: match[2] }))
    .filter((item) => item.attrs['aria-hidden'] !== 'true' && !/(^|\s)bc-sep(\s|$)/.test(item.attrs.class || ''))
    .map((item) => ({
      name: text(item.body),
      href: item.body.match(/<a\b[^>]*href="([^"]+)"/i)?.[1] || '',
    }));
}

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), 'utf8');
  const pageFailures = [];
  const titleMatches = Array.from(html.matchAll(/<title>([\s\S]*?)<\/title>/gi));
  const metas = tagList(html, 'meta');
  const links = tagList(html, 'link');
  const title = text(titleMatches[0]?.[1] || '');
  const descriptionTags = meta(metas, 'name', 'description');
  const robotsTags = meta(metas, 'name', 'robots');
  const canonicalTags = links.filter((link) => link.attrs.rel === 'canonical');
  const description = descriptionTags[0]?.attrs.content || '';
  const canonical = canonicalTags[0]?.attrs.href || '';
  const expected = expectedUrl(page);

  if (titleMatches.length !== 1 || !title) pageFailures.push('deve possuir exatamente um title não vazio');
  if (descriptionTags.length !== 1 || !description) pageFailures.push('deve possuir exatamente uma meta description não vazia');
  if (robotsTags.length !== 1 || robotsTags[0].attrs.content !== 'index,follow') pageFailures.push('robots ausente, duplicado ou diferente de index,follow');
  if (canonicalTags.length !== 1 || canonical !== expected || !canonical.startsWith('https://') || /[?#]/.test(canonical)) pageFailures.push(`canonical inválido: ${canonical || '(ausente)'}`);
  if (!/<html\s+lang="pt-BR">/i.test(html)) pageFailures.push('html lang diferente de pt-BR');
  if (meta(metas, 'name', 'viewport').length !== 1) pageFailures.push('viewport ausente ou duplicado');
  if (meta(metas, 'name', 'theme-color')[0]?.attrs.content !== '#0b3d91') pageFailures.push('theme-color inconsistente');
  if (meta(metas, 'name', 'color-scheme')[0]?.attrs.content !== 'light') pageFailures.push('color-scheme inconsistente');

  const requiredOg = { type: 'website', site_name: site.short, locale: 'pt_BR', title, description, url: canonical };
  for (const [property, value] of Object.entries(requiredOg)) {
    const matches = meta(metas, 'property', `og:${property}`);
    if (matches.length !== 1 || matches[0].attrs.content !== value) pageFailures.push(`og:${property} ausente, duplicado ou incoerente`);
  }
  socialImageCount += meta(metas, 'property', 'og:image').length;
  const requiredTwitter = { card: 'summary', title, description };
  for (const [name, value] of Object.entries(requiredTwitter)) {
    const matches = meta(metas, 'name', `twitter:${name}`);
    if (matches.length !== 1 || matches[0].attrs.content !== value) pageFailures.push(`twitter:${name} ausente, duplicado ou incoerente`);
  }

  const iconChecks = [
    links.filter((link) => link.attrs.rel === 'icon' && link.attrs.type === 'image/svg+xml'),
    links.filter((link) => link.attrs.rel === 'icon' && link.attrs.sizes === '32x32'),
    links.filter((link) => link.attrs.rel === 'apple-touch-icon'),
    links.filter((link) => link.attrs.rel === 'manifest'),
  ];
  if (iconChecks.some((matches) => matches.length !== 1)) pageFailures.push('favicon, apple touch icon ou manifest ausente/duplicado');

  const schemaBlocks = Array.from(html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi), (match) => match[1].trim());
  const schemas = [];
  const serialized = new Set();
  for (const raw of schemaBlocks) {
    try {
      const schema = JSON.parse(raw);
      if (!schema || typeof schema !== 'object' || !schema['@type']) pageFailures.push('JSON-LD vazio ou sem @type');
      const stable = JSON.stringify(schema);
      if (serialized.has(stable)) pageFailures.push(`schema duplicado: ${schema['@type'] || 'sem tipo'}`);
      serialized.add(stable);
      schemas.push(schema);
    } catch (error) {
      pageFailures.push(`JSON-LD inválido: ${error.message}`);
    }
  }

  for (const organization of schemas.filter((schema) => schema['@type'] === 'Organization')) {
    if (organization.name !== site.legalName || organization.url !== `${site.url}/` || organization.logo !== `${site.url}/assets/img/logo-mark.svg`) pageFailures.push('Organization com nome, URL ou logo inconsistente');
    if (organization.telephone !== site.tel || organization.email !== site.email) pageFailures.push('Organization com contato inconsistente');
    if (organization.address?.addressCountry !== site.address.country || organization.address?.addressLocality !== site.address.city) pageFailures.push('Organization com endereço inconsistente');
    if (!Array.isArray(organization.areaServed) || organization.areaServed.join('|') !== site.areaServed.join('|')) pageFailures.push('Organization com areaServed inconsistente');
    if (!Array.isArray(organization.sameAs) || organization.sameAs.some((url) => !/^https:\/\//.test(url))) pageFailures.push('Organization com sameAs inválido');
  }

  for (const software of schemas.filter((schema) => schema['@type'] === 'SoftwareApplication')) {
    if (software.name !== 'Infoline ERP' || software.applicationCategory !== 'BusinessApplication' || software.operatingSystem !== 'Web') pageFailures.push('SoftwareApplication inconsistente');
    if (['offers', 'aggregateRating', 'review', 'softwareVersion'].some((key) => key in software)) pageFailures.push('SoftwareApplication contém propriedade comercial não comprovada');
  }

  const faq = visibleFaq(html);
  const faqSchemas = schemas.filter((schema) => schema['@type'] === 'FAQPage');
  if (faq.length && faqSchemas.length !== 1) pageFailures.push('FAQ visível sem um único FAQPage');
  if (!faq.length && faqSchemas.length) pageFailures.push('FAQPage sem FAQ visível');
  if (faq.length && faqSchemas.length === 1) {
    const structured = (faqSchemas[0].mainEntity || []).map((item) => [text(item.name || ''), text(item.acceptedAnswer?.text || '')]);
    if (JSON.stringify(structured) !== JSON.stringify(faq)) pageFailures.push('FAQPage diverge da FAQ visível');
  }

  const breadcrumb = visibleBreadcrumb(html);
  const breadcrumbSchemas = schemas.filter((schema) => schema['@type'] === 'BreadcrumbList');
  if (breadcrumb.length && breadcrumbSchemas.length !== 1) pageFailures.push('breadcrumb visual sem um único BreadcrumbList');
  if (!breadcrumb.length && breadcrumbSchemas.length) pageFailures.push('BreadcrumbList sem breadcrumb visual');
  if (breadcrumb.length && breadcrumbSchemas.length === 1) {
    const items = breadcrumbSchemas[0].itemListElement || [];
    if (items.length !== breadcrumb.length) pageFailures.push('BreadcrumbList com quantidade diferente do breadcrumb visual');
    breadcrumb.forEach((visible, index) => {
      const structured = items[index] || {};
      if (structured.position !== index + 1 || text(structured.name || '') !== visible.name) pageFailures.push(`BreadcrumbList divergente na posição ${index + 1}`);
      if (visible.href) {
        const expectedItem = visible.href === 'index.html' ? `${site.url}/` : new URL(visible.href, `${site.url}/`).href;
        if (structured.item !== expectedItem) pageFailures.push(`URL incorreta no BreadcrumbList: ${structured.item || '(ausente)'}`);
      }
    });
  }

  if (title) {
    const list = titles.get(title) || [];
    list.push(page);
    titles.set(title, list);
  }
  if (description) {
    const list = descriptions.get(description) || [];
    list.push(page);
    descriptions.set(description, list);
  }
  pageFailures.forEach((problem) => failures.push(`${page}: ${problem}`));
}

for (const [title, matches] of titles) if (matches.length > 1) failures.push(`title duplicado em ${matches.join(', ')}: ${title}`);
for (const [description, matches] of descriptions) if (matches.length > 1) failures.push(`description duplicada em ${matches.join(', ')}: ${description}`);

const sitemap = readFileSync(join(ROOT, 'sitemap.xml'), 'utf8');
const sitemapUrls = Array.from(sitemap.matchAll(/<loc>(.*?)<\/loc>/g), (match) => match[1]);
const sitemapDates = Array.from(sitemap.matchAll(/<lastmod>(.*?)<\/lastmod>/g), (match) => match[1]);
const expectedUrls = pages.map(expectedUrl);
if (JSON.stringify(sitemapUrls) !== JSON.stringify(expectedUrls)) failures.push('sitemap.xml não corresponde às 20 canonicals na ordem do build');
if (sitemapDates.length !== pages.length || sitemapDates.some((date) => date !== site.sitemapLastmod || !/^\d{4}-\d{2}-\d{2}$/.test(date))) failures.push('sitemap.xml possui lastmod ausente, inválido ou desatualizado');
const robots = readFileSync(join(ROOT, 'robots.txt'), 'utf8');
if (!/^User-agent: \*$/m.test(robots) || !/^Allow: \/$/m.test(robots) || !new RegExp(`^Sitemap: ${site.url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\/sitemap\\.xml$`, 'm').test(robots)) failures.push('robots.txt inconsistente');

if (failures.length) {
  console.error(`QA de SEO falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA de SEO ok: ${pages.length} páginas, metadata, canonicals, OG/Twitter, JSON-LD, FAQ, breadcrumbs, sitemap e robots validados.`);
console.log(`Informativo: og:image/twitter:image presentes em ${socialImageCount} página(s); ausência mantida por não existir asset social oficial aprovado.`);
