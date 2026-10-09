// Helpers de renderização (HTML estático)
let BASE = '';
export const setBase = (b) => { BASE = b; };
export const base = () => BASE;

export const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const icon = (id, cls = 'i') =>
  `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="${BASE}assets/img/icons.svg#${id}"></use></svg>`;

export const logoMark = (cls = 'brand-mark') =>
  `<svg class="${cls}" width="40" height="40" viewBox="0 0 43 43" aria-hidden="true" focusable="false"><use href="${BASE}assets/img/icons.svg#logo-mark"></use></svg>`;

/**
 * <picture> com AVIF + WebP, srcset/sizes e dimensões explícitas (evita CLS).
 * img:    nome-base em assets/img (ex.: 'mod-pcpm')  → mod-pcpm-800.avif ...
 * ratio:  [largura, altura] do arquivo de origem
 */
export function pic({ img, ratio, widths, alt, sizes, cls = '', eager = false, fetchpriority, pick = 800 }) {
  const [w, h] = ratio;
  const set = (ext) => widths.map((x) => `${BASE}assets/img/${img}-${x}.${ext} ${x}w`).join(', ');
  const fallbackW = widths.includes(pick) ? pick : widths[widths.length - 1];
  const fh = Math.round((h * fallbackW) / w);
  return `<picture><source type="image/avif" srcset="${set('avif')}" sizes="${sizes}"><source type="image/webp" srcset="${set('webp')}" sizes="${sizes}"><img${cls ? ` class="${cls}"` : ''} src="${BASE}assets/img/${img}-${fallbackW}.webp" width="${fallbackW}" height="${fh}" alt="${esc(alt)}" ${eager ? 'decoding="async"' : 'loading="lazy" decoding="async"'}${fetchpriority ? ` fetchpriority="${fetchpriority}"` : ''}></picture>`;
}

export const waLink = (site, text) =>
  `https://wa.me/${site.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

export const jsonLd = (obj) =>
  `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, '\\u003c')}</script>`;
