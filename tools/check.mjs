import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const name of ['qa', 'assets-qa', 'orphans-qa', 'architecture-qa', 'factual-qa', 'seo-qa', 'tracking-qa', 'performance-qa']) {
  const result = spawnSync(process.execPath, [join(root, 'tools', name + '.mjs')], { cwd: root, stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status || 1);
}
