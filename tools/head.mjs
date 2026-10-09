import { esc, jsonLd, base } from './lib.mjs';
import { site } from './content.mjs';

const B = () => base();

export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.legalName,
    url: `${site.url}/`,
    logo: `${site.url}/assets/img/logo-mark.svg`,
    telephone: site.tel,
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.streetAddress,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    areaServed: site.areaServed,
    sameAs: [],
  };
}

export function softwareSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Infoline ERP',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    provider: { '@type': 'Organization', name: site.legalName, url: `${site.url}/` },
  };
}

export function faqSchema(pairs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pairs.map(([q, a]) => ({
      '@type': 'Question', name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

/**
 * head({ title, description, path, ogImage, schemas, noindex })
 * path: caminho relativo ao root, ex: '' (home) ou 'financeiro.html'
 */
export function head({ title, description, path = '', schemas = [], noindex = false, preload = [] }) {
  const url = `${site.url}/${path}`;
  return `<meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta http-equiv="Content-Security-Policy" content="script-src 'self' https://*.googletagmanager.com https://tagmanager.google.com https://*.google-analytics.com https://*.googleadservices.com https://*.doubleclick.net https://www.google.com https://connect.facebook.net">
  <meta name="description" content="${esc(description)}">
  <meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow'}">
  <meta name="theme-color" content="#0b3d91">
  <meta name="color-scheme" content="light">
  <link rel="canonical" href="${url}">
  <link rel="icon" href="${B()}favicon.svg" type="image/svg+xml">
  <link rel="icon" href="${B()}favicon-32.png" sizes="32x32" type="image/png">
  <link rel="apple-touch-icon" href="${B()}apple-touch-icon.png">
  <link rel="manifest" href="${B()}site.webmanifest">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="${esc(site.short)}">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${url}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <title>${esc(title)}</title>
  <link rel="preload" href="${B()}assets/css/base.css" as="style">
  <link rel="stylesheet" href="${B()}assets/css/base.css">
  <link rel="stylesheet" href="${B()}assets/css/components.css">
  <link rel="stylesheet" href="${B()}assets/css/consent.css">
  ${preload.map((p) => `<link rel="preload" as="image" href="${p.href}" imagesrcset="${p.srcset}" imagesizes="${p.sizes}" fetchpriority="high" type="image/avif">`).join('\n  ')}
  ${schemas.map((s) => jsonLd(s)).join('\n  ')}`;
}
