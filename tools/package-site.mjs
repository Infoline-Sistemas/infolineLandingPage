import { readdirSync, mkdirSync, cpSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
// Uma pasta nova por execução evita misturar arquivos de releases anteriores.
const release = join(root, 'dist', 'site-' + new Date().toISOString().replace(/[:.]/g, '-'));
mkdirSync(release, { recursive: true });
const files = readdirSync(root).filter((name) => name.endsWith('.html')).concat(['assets', 'favicon.svg', 'favicon-32.png', 'apple-touch-icon.png', 'icon-192.png', 'site.webmanifest', 'sitemap.xml', 'robots.txt', 'CNAME']);
if (existsSync(join(root, 'tattooflow'))) files.push('tattooflow');
for (const name of files) { if (!existsSync(join(root, name))) throw new Error('Arquivo público ausente: ' + name); cpSync(join(root, name), join(release, name), { recursive: true }); }
writeFileSync(join(release, '.nojekyll'), '');
console.log('Pacote público: ' + release);
