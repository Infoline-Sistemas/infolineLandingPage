import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const rendererConfig = [
  { file: 'tools/pages/pcpm.mjs', prefix: 'pcpm', fiveSituations: true },
  { file: 'tools/pages/commercial.mjs', prefix: 'commercial', fiveSituations: false },
  { file: 'tools/pages/wms.mjs', prefix: 'wms', fiveSituations: false },
];

for (const config of rendererConfig) {
  const file = path.join(root, config.file);
  let source = fs.readFileSync(file, 'utf8');
  const p = config.prefix;
  const replacements = [
    [`mod-hero ${p}-hero`, `mod-hero module-system-hero ${p}-hero`],
    [`mod-hero-product ${p}-hero-product`, `mod-hero-product module-system-hero-product ${p}-hero-product`],
    [`${p}-intro reveal`, `module-system-intro ${p}-intro reveal`],
    [`${p}-bento reveal`, `module-system-bento ${p}-bento reveal`],
    [`${p}-cap-card ${p}-cap-card--`, `module-system-cap-card ${p}-cap-card ${p}-cap-card--`],
    [`${p}-cap-heading`, `module-system-cap-heading ${p}-cap-heading`],
    [`section--dark ${p}-flow-section`, `section--dark module-system-flow-section ${p}-flow-section`],
    [`${p}-flow reveal`, `module-system-flow ${p}-flow reveal`],
    [`${p}-flow-track`, `module-system-flow-track ${p}-flow-track`],
    [`${p}-flow-step`, `module-system-flow-step ${p}-flow-step`],
    [`${p}-flow-detail`, `module-system-flow-detail ${p}-flow-detail`],
    [`section ${p}-screen-section`, `section module-system-screen-section ${p}-screen-section`],
    [`${p}-screen-stage reveal`, `module-system-screen-stage ${p}-screen-stage reveal`],
    [`${p}-hotspot ${p}-hotspot--`, `module-system-hotspot module-system-hotspot--`],
    [`${p}-situations reveal`, `module-system-situations${config.fiveSituations ? ' module-system-situations--five' : ''} ${p}-situations reveal`],
    [`${p}-ecosystem reveal`, `module-system-ecosystem ${p}-ecosystem reveal`],
    [`${p}-eco-center`, `module-system-eco-center ${p}-eco-center`],
    [`${p}-eco-node`, `module-system-eco-node ${p}-eco-node`],
    [`data-${p === 'commercial' ? 'commercial' : p}-flow`, `data-${p === 'commercial' ? 'commercial' : p}-flow data-module-flow`],
  ];
  for (const [from, to] of replacements) source = source.split(from).join(to);
  fs.writeFileSync(file, source);
  console.log(`Generalizado: ${config.file}`);
}

const cssFile = path.join(root, 'assets/css/module-system.css');
let css = fs.readFileSync(cssFile, 'utf8');
const cssReplacements = [
  [':is(.pcpm-hero,.commercial-hero,.wms-hero)', '.module-system-hero'],
  [':is(.pcpm-hero-product,.commercial-hero-product,.wms-hero-product)', '.module-system-hero-product'],
  [':is(.pcpm-intro,.commercial-intro,.wms-intro)', '.module-system-intro'],
  [':is(.pcpm-bento,.commercial-bento,.wms-bento)', '.module-system-bento'],
  [':is(.pcpm-cap-card,.commercial-cap-card,.wms-cap-card)', '.module-system-cap-card'],
  [':is(.pcpm-cap-heading,.commercial-cap-heading,.wms-cap-heading)', '.module-system-cap-heading'],
  [':is(.pcpm-flow-section,.commercial-flow-section,.wms-flow-section)', '.module-system-flow-section'],
  [':is(.pcpm-flow,.commercial-flow,.wms-flow)', '.module-system-flow'],
  [':is(.pcpm-flow-track,.commercial-flow-track,.wms-flow-track)', '.module-system-flow-track'],
  [':is(.pcpm-flow-step,.commercial-flow-step,.wms-flow-step)', '.module-system-flow-step'],
  [':is(.pcpm-flow-detail,.commercial-flow-detail,.wms-flow-detail)', '.module-system-flow-detail'],
  [':is(.pcpm-screen-section,.commercial-screen-section,.wms-screen-section)', '.module-system-screen-section'],
  [':is(.pcpm-screen-stage,.commercial-screen-stage,.wms-screen-stage)', '.module-system-screen-stage'],
  [':is(.pcpm-hotspot,.commercial-hotspot,.wms-hotspot)', '.module-system-hotspot'],
  [':is(.pcpm-hotspot--1,.commercial-hotspot--1,.wms-hotspot--1)', '.module-system-hotspot--1'],
  [':is(.pcpm-hotspot--2,.commercial-hotspot--2,.wms-hotspot--2)', '.module-system-hotspot--2'],
  [':is(.pcpm-hotspot--3,.commercial-hotspot--3,.wms-hotspot--3)', '.module-system-hotspot--3'],
  [':is(.pcpm-hotspot--4,.commercial-hotspot--4,.wms-hotspot--4)', '.module-system-hotspot--4'],
  [':is(.pcpm-situations,.commercial-situations,.wms-situations)', '.module-system-situations'],
  ['.pcpm-situations article:nth-child(4)', '.module-system-situations--five article:nth-child(4)'],
  ['.pcpm-situations article:last-child', '.module-system-situations--five article:last-child'],
  [':is(.pcpm-ecosystem,.commercial-ecosystem,.wms-ecosystem)', '.module-system-ecosystem'],
  [':is(.pcpm-eco-center,.commercial-eco-center,.wms-eco-center)', '.module-system-eco-center'],
  [':is(.pcpm-eco-node,.commercial-eco-node,.wms-eco-node)', '.module-system-eco-node'],
  [':is(.pcpm-eco-center,.commercial-eco-center,.wms-eco-center,.pcpm-eco-node,.commercial-eco-node,.wms-eco-node)', ':is(.module-system-eco-center,.module-system-eco-node)'],
  [':is(.pcpm-flow-step,.commercial-flow-step,.wms-flow-step,.pcpm-eco-node,.commercial-eco-node,.wms-eco-node)', ':is(.module-system-flow-step,.module-system-eco-node)'],
];
for (const [from, to] of cssReplacements) css = css.split(from).join(to);
fs.writeFileSync(cssFile, css);
console.log('Generalizado: assets/css/module-system.css');
