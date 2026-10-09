#!/usr/bin/env node
/**
 * tools/build.mjs
 * Gera o site estático em HTML/CSS/JS puro a partir dos templates em tools/pages.
 * Uso: node tools/build.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { setBase } from './lib.mjs';
import { site, modules, moduleOrder } from './content.mjs';
import { renderHome } from './pages/home.mjs';
import { renderIndustry } from './pages/industry.mjs';
import { renderImporters, renderWholesale } from './pages/sectors.mjs';
import { renderModule } from './pages/module.mjs';
import { renderSolucoes } from './pages/solucoes.mjs';
import { renderTrabalhe } from './pages/trabalhe.mjs';
import { renderPrivacidade } from './pages/privacidade.mjs';
import { renderPrivacidadeApps } from './pages/privacidade-apps.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..'); // /home/claude/site

setBase(''); // todas as páginas vivem na raiz do domínio

function shell({ headHtml, body, styles = [], pageType = 'page', moduleKey = '', solutionGroup = '' }) {
  const bodyAttrs = [
    `data-page-type="${pageType}"`,
    moduleKey ? `data-module="${moduleKey}"` : '',
    solutionGroup ? `data-solution-group="${solutionGroup}"` : '',
  ].filter(Boolean).join(' ');
  const hasForm = /<form\b/i.test(body);
  return `<!doctype html>
<html lang="pt-BR">
<head>
${headHtml}
${styles.map((name) => `<link rel="stylesheet" href="assets/css/${name}">`).join('\n')}
</head>
<body ${bodyAttrs}>
${body}
<script src="assets/js/config.js"></script>
<script src="assets/js/consent.js" defer></script>
<script src="assets/js/tracking.js" defer></script>
<script src="assets/js/navigation.js" defer></script>
<script src="assets/js/interactions.js" defer></script>
${hasForm ? '<script src="assets/js/forms.js" defer></script>' : ''}
</body>
</html>`;
}

function write(name, page) {
  const html = shell(page).replace(/[ \t]+$/gm, '');
  writeFileSync(join(ROOT, name), html, 'utf-8');
  return html.length;
}

const pages = [];

// Home
pages.push(['index.html', renderHome()]);

// Solução comercial para indústrias
pages.push(['erp-para-industria.html', renderIndustry()]);
pages.push(['erp-para-importadores.html', renderImporters()]);
pages.push(['erp-para-atacado-distribuicao.html', renderWholesale()]);

// Módulos
moduleOrder.forEach((key) => {
  const m = modules[key];
  pages.push([`${m.slug}.html`, renderModule(m)]);
});

// Hub, carreiras, privacidade
pages.push(['solucoes.html', renderSolucoes()]);
pages.push(['trabalhe-conosco.html', renderTrabalhe()]);
pages.push(['politica-de-privacidade.html', renderPrivacidade()]);
pages.push(['politicadeprivacidade.html', renderPrivacidadeApps()]);

let totalBytes = 0;
for (const [name, page] of pages) {
  totalBytes += write(name, page);
}

// ---------------------------------------------------------------------------
// sitemap.xml
// ---------------------------------------------------------------------------
const urls = pages.map(([name]) => name);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${site.url}/${u === 'index.html' ? '' : u}</loc>
    <lastmod>${site.sitemapLastmod}</lastmod>
    <changefreq>${u === 'index.html' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${u === 'index.html' ? '1.0' : u.startsWith('politica') ? '0.2' : '0.8'}</priority>
  </url>`).join('\n')}
</urlset>
`;
writeFileSync(join(ROOT, 'sitemap.xml'), sitemap, 'utf-8');

// ---------------------------------------------------------------------------
// robots.txt
// ---------------------------------------------------------------------------
const robots = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;
writeFileSync(join(ROOT, 'robots.txt'), robots, 'utf-8');

console.log(`Build ok: ${pages.length} páginas, ${(totalBytes / 1024).toFixed(0)} KB de HTML.`);
pages.forEach(([n]) => console.log(' -', n));
