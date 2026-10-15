import { readFileSync } from 'node:fs';
import { head } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';

export function renderPrivacidadeApps() {
  // Conteúdo original da main; apenas a estrutura e as classes são adaptadas.
  const source = readFileSync(new URL('../policies/apps-infoline.html', import.meta.url), 'utf8');
  const policy = source
    .replace(/^<section\b[^>]*>/, '<section id="politica" class="container apps-policy">')
    .replace(/<h2\b[^>]*>/g, '<h1>')
    .replace(/<\/h2>/g, '</h1>')
    .replace(/<h3\b[^>]*>/g, '<h2>')
    .replace(/<\/h3>/g, '</h2>')
    .replace(/<p\b[^>]*>/g, '<p class="body-text">')
    .replace(/ class="text-blue-600 underline"/g, '');
  const headHtml = head({
    title: 'Política de Privacidade dos Apps Infoline',
    description: 'Política de privacidade dos aplicativos Infoline: coleta e uso de informações, consentimento, serviços de terceiros, segurança e canais de contato.',
    path: 'politicadeprivacidade.html',
  });
  const body = `
${header({ variant: 'internal' })}
${breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Privacidade dos apps' }])}
<main id="conteudo" class="section">
${policy}
</main>
${footer()}`;
  return { headHtml, body, styles: ['privacy.css'], pageType: 'app-privacy' };
}
