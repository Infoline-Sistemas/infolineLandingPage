import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { groups, links, modules, moduleOrder, site } from './content.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const fail = (scope, message) => errors.push(`${scope}: ${message}`);
const count = (text, value) => text.split(value).length - 1;
const premiumFiles = {
  pcpm: 'pcpm.mjs', wms: 'wms.mjs', compras: 'purchases.mjs', custos: 'costs.mjs',
  comercial: 'commercial.mjs', crm: 'crm.mjs', ecommerce: 'ecommerce.mjs',
  financeiro: 'financial.mjs', contabilidade: 'accounting.mjs',
  controladoria: 'controllership.mjs',
};

const expectedClientAccess = [
  { label: 'Versão atual', cta: 'Acessar V3.1', url: 'https://erp.infolinesystems.app.br/InfolineV3.1/#/login' },
  { label: 'Versão anterior', cta: 'Acessar V3', url: 'https://erp.infoline.app.br/InfolineV3/#/login' },
];
if (JSON.stringify(site.clientAccess) !== JSON.stringify(expectedClientAccess)) {
  fail('Sou cliente', 'endereços oficiais de login da V3.1 ou V3 estão incorretos');
}

// Taxonomia central: chaves, slugs, grupos e integrações devem apontar para módulos reais.
if (new Set(moduleOrder).size !== moduleOrder.length) fail('content.mjs', 'moduleOrder contém chaves duplicadas');
const slugs = moduleOrder.map((key) => modules[key]?.slug);
if (slugs.some((slug) => !slug)) fail('content.mjs', 'módulo sem slug');
if (new Set(slugs).size !== slugs.length) fail('content.mjs', 'slugs de módulos duplicados');

const groupMembership = new Map(moduleOrder.map((key) => [key, 0]));
for (const group of groups) {
  for (const key of group.modules) {
    if (!modules[key]) fail(`grupo ${group.key}`, `módulo inexistente: ${key}`);
    else groupMembership.set(key, (groupMembership.get(key) || 0) + 1);
  }
}
for (const [key, memberships] of groupMembership) {
  if (memberships !== 1) fail(`módulo ${key}`, `deve pertencer a exatamente um grupo; encontrado ${memberships}`);
  if (!groups.some((group) => group.key === modules[key].group)) fail(`módulo ${key}`, `grupo declarado inexistente: ${modules[key].group}`);
}

const edge = (a, b) => [a, b].sort().join('|');
const officialEdges = new Set();
const directedEdges = new Set();
for (const [from, to] of links) {
  if (!modules[from]) fail('links', `origem inexistente: ${from}`);
  if (!modules[to]) fail('links', `destino inexistente: ${to}`);
  const directedId = `${from}|${to}`;
  if (directedEdges.has(directedId)) fail('links', `integração direcionada duplicada: ${directedId}`);
  directedEdges.add(directedId);
  const id = edge(from, to);
  officialEdges.add(id);
}

// Ecossistemas premium que usam o array compartilhado de conexões.
for (const [sourceKey, filename] of Object.entries(premiumFiles)) {
  const source = read(`tools/pages/${filename}`);
  const block = source.match(/const connections = \[([\s\S]*?)\n\];/);
  if (!block) {
    fail(filename, 'array connections não encontrado');
    continue;
  }
  const targets = [...block[1].matchAll(/key:\s*'([^']+)'/g)].map((match) => match[1]);
  if (!targets.length) fail(filename, 'ecossistema sem conexões');
  const ecosystemSvg = source.match(/module-system-ecosystem[\s\S]*?<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || '';
  const svgConnectorCount = (ecosystemSvg.match(/<path\b/g) || []).length;
  const htmlConnectorCount = (source.match(/class="[^"]*ecosystem-bridge[^"]*"/g) || []).length;
  const connectorCount = svgConnectorCount + htmlConnectorCount;
  if (connectorCount !== targets.length) fail(filename, `diagrama tem ${connectorCount} conectores para ${targets.length} integrações`);
  for (const target of targets) {
    if (!modules[target]) fail(filename, `conexão aponta para módulo inexistente: ${target}`);
    else if (!officialEdges.has(edge(sourceKey, target))) fail(filename, `integração ${sourceKey} ↔ ${target} não comprovada em content.mjs`);
  }
}

for (const [source, target] of [['rh', 'contabilidade'], ['processos', 'crm'], ['whatsapp', 'financeiro']]) {
  if (!officialEdges.has(edge(source, target))) fail('integrações especializadas', `integração esperada ausente: ${source} ↔ ${target}`);
}

// Navegação gerada: breadcrumb canônico, portal completo e mega menu sem a integração especializada.
for (const key of moduleOrder) {
  const module = modules[key];
  const html = read(`${module.slug}.html`);
  const breadcrumb = html.match(/<nav class="breadcrumb"[\s\S]*?<\/nav>/)?.[0] || '';
  const localNav = html.match(/<nav class="module-nav"[\s\S]*?<\/nav>/)?.[0] || '';
  const canonicalName = module.navName || module.name;
  if (!breadcrumb.includes('<a href="solucoes.html">Soluções</a>')) fail(`${module.slug}.html`, 'breadcrumb não passa pelo Portal Soluções');
  if (!breadcrumb.includes(`<li aria-current="page">${canonicalName}</li>`)) fail(`${module.slug}.html`, `breadcrumb não usa nome canônico: ${canonicalName}`);
  if (!localNav.includes(`<span>${canonicalName}</span>`)) fail(`${module.slug}.html`, `navegação local não usa nome canônico: ${canonicalName}`);
}

const portal = read('solucoes.html');
const portalMain = portal.match(/<main id="conteudo">([\s\S]*?)<\/main>/)?.[1] || '';
for (const key of moduleOrder) {
  const module = modules[key];
  const occurrences = count(portalMain, `href="${module.slug}.html"`);
  if (occurrences !== 1) fail('solucoes.html', `${module.slug}.html deve aparecer uma vez no portal; encontrado ${occurrences}`);
}
if (!/class="portal-module portal-module--integration" href="integracao-whatsapp\.html"/.test(portalMain)) fail('solucoes.html', 'WhatsApp não está identificado como integração especializada');
if (/class="portal-feature[^\"]*" href="integracao-whatsapp\.html"/.test(portalMain)) fail('solucoes.html', 'WhatsApp não deve aparecer como módulo principal destacado');

const home = read('index.html');
const header = home.match(/<header class="site-header"[\s\S]*?<\/header>/)?.[0] || '';
for (const key of moduleOrder.filter((item) => item !== 'whatsapp')) {
  const module = modules[key];
  const label = module.navName || module.name;
  if (!header.includes(`href="${module.slug}.html"`) || !header.includes(`<span>${label}</span>`)) {
    fail('mega menu', `módulo ausente ou com nome divergente: ${label}`);
  }
}
if (header.includes('integracao-whatsapp.html')) fail('mega menu', 'WhatsApp deve permanecer fora da lista de módulos principais');
if (!home.includes('Atendimento em todo o Brasil')) fail('cabeçalho', 'cobertura nacional ausente da barra superior');

// Um link cujo texto é exatamente o nome canônico de um módulo deve levar à página desse módulo.
for (const page of fs.readdirSync(root).filter((name) => name.endsWith('.html'))) {
  const html = read(page);
  for (const anchor of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
    const href = anchor[1].split('#')[0];
    const text = anchor[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    for (const key of moduleOrder) {
      const module = modules[key];
      const canonicalName = module.navName || module.name;
      if (text === canonicalName && href !== `${module.slug}.html`) {
        fail(page, `link "${canonicalName}" aponta para ${anchor[1]}, esperado ${module.slug}.html`);
      }
    }
  }
}

// Termos que já foram substituídos por nomenclatura canônica ou conteúdo comprovado.
const staleTerms = [
  'Consulta de Producao', 'Gerenciador Ecommercer', 'Resultado por Grupo de Contabilizacao',
  '>Beneficios<', 'Ocorrencias de Exposições', 'Fiscal e contábil', 'Plataforma 100% web',
  'Ver todas por necessidade', 'Soluções por necessidade', "'DUIMP'",
];
const factualCorpus = [read('tools/content.mjs'), read('tools/layout.mjs'), read('tools/pages/home.mjs'), read('tools/pages/sectors.mjs'), home, portal].join('\n');
for (const term of staleTerms) if (factualCorpus.includes(term)) fail('nomenclatura', `termo antigo encontrado: ${term}`);

// O pedido prepara e conecta o faturamento, mas não emite a nota fiscal automaticamente.
const fiscalClaimCorpus = [read('tools/content.mjs'), read('index.html'), read('comercial.html')].join('\n');
const misleadingFiscalClaims = [
  'O Infoline gera as notas fiscais?',
  'Geração das notas fiscais correspondentes',
  'gera as notas fiscais correspondentes',
];
for (const claim of misleadingFiscalClaims) {
  if (fiscalClaimCorpus.includes(claim)) fail('faturamento', `afirmação sugere emissão fiscal automática: ${claim}`);
}
if (!fiscalClaimCorpus.includes('onde a emissão da nota fiscal pode ser realizada')) {
  fail('faturamento', 'FAQ do Comercial não esclarece que a emissão da nota fiscal pode ser realizada na rotina de faturamento');
}

// Consistência matemática dos principais mocks comerciais e gerenciais.
const commercial = read('tools/pages/commercial.mjs');
const salesRows = [...(commercial.match(/function salesScreen\(\) \{[\s\S]*?const rows = \[([\s\S]*?)\n  \];/)?.[1] || '').matchAll(/\['[^']+',\s*'(\d+)',\s*'R\$ ([\d.]+,\d{2})',\s*'([\d,]+)%'/g)]
  .map((match) => ({ quantity: Number(match[1]), unit: Number(match[2].replaceAll('.', '').replace(',', '.')), margin: Number(match[3].replace(',', '.')) }));
if (salesRows.length !== 4) fail('comercial', `esperadas 4 linhas de pedido; encontradas ${salesRows.length}`);
else {
  const total = salesRows.reduce((sum, row) => sum + row.quantity * row.unit, 0);
  const weightedMargin = salesRows.reduce((sum, row) => sum + row.quantity * row.unit * row.margin, 0) / total;
  if (Math.abs(total - 48720) > 0.001) fail('comercial', `itens somam R$ ${total.toFixed(2)}, não R$ 48.720,00`);
  if (weightedMargin.toFixed(1) !== '24.8') fail('comercial', `margem ponderada é ${weightedMargin.toFixed(1)}%, não 24,8%`);
}

const assertions = [
  ['processos', 'tools/pages/processes.mjs', ['<small>Ativos</small><b>11</b>', '<small>Em execução</small><b>8</b>', '<small>Aguardando</small><b>3</b>']],
  ['crm', 'tools/pages/crm.mjs', ['<small>Contato</small><b>4</b>', '<small>Qualificação</small><b>3</b>', '<small>Proposta</small><b>3</b>', '<small>Negociação</small><b>2</b>', '12 oportunidades abertas']],
  ['ecommerce', 'tools/pages/ecommerce.mjs', ['Pedidos de hoje</span><b>29</b>', '<small>Mercado Livre</small><b>18</b>', '<small>Shopee</small><b>11</b>', '<b>Integrados</b><em>24</em>', '<b>Aguardando</b><em>3</em>', '<b>Atenção</b><em>2</em>']],
  ['contabilidade', 'tools/pages/accounting.mjs', ['<small>Documentos</small><b>1.284</b>', '<small>Entradas</small><b>428</b>', '<small>Saídas</small><b>856</b>', '1.277 processados', '7 pendências']],
  ['financeiro', 'tools/pages/financial.mjs', ['R$ 428.560', 'R$ 186.420', 'R$ 142.870', 'R$ 43.550', 'R$ 472.110']],
  ['custos', 'tools/pages/costs.mjs', ['Material</small><b>66,4%</b>', 'Máquina</small><b>17,4%</b>', 'Mão de obra</small><b>11,9%</b>', 'Outros</small><b>4,3%</b>', 'R$ 431,00', 'R$ 598,00']],
  ['rh', 'tools/pages/hr.mjs', ['<small>Colaboradores</small><b>186</b>', '<small>Processados</small><b>174</b>', '<small>Em revisão</small><b>12</b>', '93,5%']],
  ['controladoria', 'tools/pages/controllership.mjs', ['R$ 2.840.000', 'R$ 1.720.000', 'R$ 684.000', 'R$ 436.000', 'Margem 15,4%']],
];
for (const [scope, file, snippets] of assertions) {
  const source = read(file);
  for (const snippet of snippets) if (!source.includes(snippet)) fail(scope, `referência factual esperada ausente: ${snippet}`);
}

if (errors.length) {
  console.error(`QA factual falhou com ${errors.length} problema(s):`);
  errors.forEach((error) => console.error(` - ${error}`));
  process.exit(1);
}

console.log(`QA factual ok: ${moduleOrder.length} módulos, taxonomia, integrações, navegação, nomenclaturas e números validados.`);
