import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = [
  ['pcpm', 'assets/css/pcpm.css'],
  ['commercial', 'assets/css/commercial.css'],
  ['wms', 'assets/css/wms.css'],
];

function sharedSelector(part, prefix, body) {
  const p = `.${prefix}`;
  if (part === `${p}-hero` || part === `${p}-hero .mod-hero-inner` || part === `${p}-hero h1`) return true;
  if (part === `${p}-hero-product`) return !/display\s*:\s*grid|grid-template/.test(body);
  if (part.startsWith(`${p}-intro`) || part === `${p}-bento`) return true;
  if (part === `${p}-cap-card` || part === `${p}-cap-card.is-dominant` || part.startsWith(`${p}-cap-heading`) || part.startsWith(`.is-dominant ${p}-cap-heading`)) return true;
  if (part.startsWith(`${p}-flow`)) return true;
  if (part.startsWith(`${p}-screen-section`) || part === `${p}-screen-stage`) return true;
  if (part.startsWith(`${p}-hotspot`) || part.startsWith(`${p}-situations`)) return true;
  if (part.startsWith(`${p}-ecosystem`) || part.startsWith(`${p}-eco-center`) || part.startsWith(`${p}-eco-node`)) return true;
  return false;
}

for (const [prefix, relative] of files) {
  const file = path.join(root, relative);
  const source = fs.readFileSync(file, 'utf8');
  let removed = 0;
  const output = source.replace(/([^{}]+)\{([^{}]*)\}/g, (rule, selector, body) => {
    const withoutComments = selector.replace(/\/\*[\s\S]*?\*\//g, '').trim();
    if (!withoutComments || withoutComments.startsWith('@')) return rule;
    const parts = withoutComments.split(',').map((part) => part.trim());
    if (!parts.every((part) => sharedSelector(part, prefix, body))) return rule;
    removed += 1;
    const comments = selector.match(/\/\*[\s\S]*?\*\//g);
    return comments ? `${comments.join('\n')}\n` : '';
  });
  fs.writeFileSync(file, output.replace(/\n{3,}/g, '\n\n').trimEnd() + '\n');
  console.log(`${relative}: ${removed} regras compartilhadas removidas`);
}
