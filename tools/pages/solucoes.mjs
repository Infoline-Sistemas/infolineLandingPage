import { esc, icon } from '../lib.mjs';
import { head, orgSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';

const areas = [
  {
    key: 'operacao', eyebrow: 'Operação', title: 'Planeje, abasteça, produza e movimente.',
    text: 'Soluções que conectam demanda, materiais, produção, estoque e custos.',
    featured: ['pcpm', 'wms', 'compras', 'custos'], compact: [],
  },
  {
    key: 'vendas', eyebrow: 'Vendas', title: 'Negocie, acompanhe e faça o pedido avançar.',
    text: 'Da oportunidade ao faturamento, com preço, margem e relacionamento no mesmo ERP.',
    featured: ['comercial', 'crm', 'ecommerce'], compact: [],
  },
  {
    key: 'gestao', eyebrow: 'Gestão', title: 'Transforme a operação em decisão.',
    text: 'Caixa, obrigações, resultado, pessoas e processos ligados à mesma informação.',
    featured: ['financeiro', 'contabilidade', 'controladoria', 'rh', 'processos'], compact: ['whatsapp'],
  },
];

const featuredCopy = {
  pcpm: { label: 'Produção e planejamento', title: 'PCPM', text: 'Planeje materiais, programe a fábrica e acompanhe cada ordem de produção.', cta: 'Explorar PCPM' },
  comercial: { label: 'Pedido e margem', title: 'Comercial', text: 'Negocie com preço, disponibilidade e margem antes de levar o pedido ao faturamento.', cta: 'Explorar Comercial' },
  wms: { label: 'Estoque endereçado', title: 'WMS', text: 'Encontre produto, lote e endereço e acompanhe a movimentação até a expedição.', cta: 'Explorar WMS' },
  compras: { label: 'Cotação e abastecimento', title: 'Compras e Suprimentos', text: 'Compare preço, prazo e condição e acompanhe o pedido até o recebimento.', cta: 'Explorar Compras e Suprimentos' },
  financeiro: { label: 'Caixa e decisão', title: 'Financeiro', text: 'Acompanhe títulos, vencimentos, bancos e saldo projetado com a origem de cada movimento.', cta: 'Explorar Financeiro' },
  custos: { label: 'Composição e margem', title: 'Gestão de Custos', text: 'Entenda materiais, recursos e custos gerais antes de formar preço e analisar a margem.', cta: 'Explorar Custos' },
  crm: { label: 'Relacionamento e oportunidade', title: 'CRM', text: 'Acompanhe contatos, histórico, follow-ups e o próximo passo de cada oportunidade.', cta: 'Explorar CRM' },
  ecommerce: { label: 'Canais digitais integrados', title: 'E-commerce e Marketplaces', text: 'Traga pedidos de Shopee e Mercado Livre para a mesma operação de estoque, faturamento e gestão.', cta: 'Explorar E-commerce' },
  contabilidade: { label: 'Escrituração e obrigações', title: 'Fiscal e Contábil', text: 'Faça documentos e movimentos da operação chegarem organizados à escrituração, apuração e contabilidade.', cta: 'Explorar Fiscal e Contábil' },
  controladoria: { label: 'Resultado e decisão', title: 'Controladoria', text: 'Enxergue onde o resultado acontece com dashboards, centros, DRE e rentabilidade por projeto.', cta: 'Explorar Controladoria' },
  rh: { label: 'Pessoas e folha', title: 'Recursos Humanos', text: 'Centralize colaboradores, folha, ponto, benefícios e obrigações de pessoal dentro do ERP.', cta: 'Explorar RH' },
  processos: { label: 'Workflow e padronização', title: 'Gestão de Processos', text: 'Defina etapas, acompanhe responsáveis e padronize o fluxo de tarefas dentro do ERP.', cta: 'Explorar Processos' },
};

function preview(key) {
  if (key === 'pcpm') return `<div class="portal-preview portal-preview--pcpm"><header><span>OP 015843</span><b>72%</b></header><i><u></u></i><div><span><small>Materiais</small><b>18 disponíveis</b></span><span><small>Necessidade</small><b>2 para comprar</b></span></div></div>`;
  if (key === 'comercial') return `<div class="portal-preview portal-preview--commercial"><header><span>Pedido 048521</span><b>Pronto para faturar</b></header><div><span><small>Valor</small><strong>R$ 48.720</strong></span><span><small>Margem</small><strong>24,8%</strong></span></div><footer><i></i>16 itens disponíveis <em>2 parciais</em></footer></div>`;
  if (key === 'compras') return `<div class="portal-preview portal-preview--purchases"><header><span>PC 008421</span><b>Aguardando aprovação</b></header><div><span><small>Fornecedor</small><strong>Metalúrgica Alfa</strong></span><span><small>Valor</small><strong>R$ 36.840</strong></span></div><footer><span>3 cotações</span><i></i><span>Entrega 30/09</span></footer></div>`;
  if (key === 'financeiro') return `<div class="portal-preview portal-preview--financial"><header><span>Posição financeira</span><b>Saldo positivo</b></header><div><span><small>A receber</small><strong>R$ 186.420</strong></span><span><small>A pagar</small><strong>R$ 142.870</strong></span></div><footer><small>Saldo projetado</small><strong>R$ 472.110</strong></footer></div>`;
  if (key === 'custos') return `<div class="portal-preview portal-preview--costs"><header><span>Redutor XP-200</span><b>Custo calculado</b></header><div><span><small>Material</small><strong>66,4%</strong></span><span><small>Custo total</small><strong>R$ 431,00</strong></span></div><footer><small>Margem projetada</small><strong>27,9%</strong></footer></div>`;
  if (key === 'crm') return `<div class="portal-preview portal-preview--crm"><header><span>Indústria Alfa</span><b>Proposta enviada</b></header><div><span><small>Valor potencial</small><strong>R$ 84.500</strong></span><span><small>Próximo retorno</small><strong>28/09</strong></span></div><footer><i></i><span>12 oportunidades abertas</span><b>3 precisam de atenção</b></footer></div>`;
  if (key === 'ecommerce') return `<div class="portal-preview portal-preview--ecommerce"><header><span>Pedidos dos canais</span><b>29 hoje</b></header><div><span><small>Mercado Livre</small><strong>18 pedidos</strong></span><span><small>Shopee</small><strong>11 pedidos</strong></span></div><footer><i></i><span>24 integrados</span><b>2 exigem atenção</b></footer></div>`;
  if (key === 'contabilidade') return `<div class="portal-preview portal-preview--accounting"><header><span>Período 09/2026</span><b>Em andamento</b></header><div><span><small>Documentos</small><strong>1.284</strong></span><span><small>Pendências</small><strong>7</strong></span></div><footer><i></i><span>428 entradas</span><b>856 saídas</b></footer></div>`;
  if (key === 'controladoria') return `<div class="portal-preview portal-preview--controllership"><header><span>Resultado gerencial</span><b>Margem 15,4%</b></header><div><span><small>Receita</small><strong>R$ 2,84 mi</strong></span><span><small>Resultado</small><strong>R$ 436 mil</strong></span></div><footer><span>Fluxo realizado</span><b>R$ 391 mil</b></footer></div>`;
  if (key === 'rh') return `<div class="portal-preview portal-preview--hr"><header><span>Folha · 09/2026</span><b>Em processamento</b></header><div><span><small>Colaboradores</small><strong>186</strong></span><span><small>Processados</small><strong>174</strong></span></div><footer><i></i><span>12 para revisar</span><b>eSocial</b></footer></div>`;
  if (key === 'processos') return `<div class="portal-preview portal-preview--processes"><header><span>Workflow</span><b>Atendimento comercial</b></header><div><span class="done"><i>1</i><b>Definir</b></span><span class="active"><i>2</i><b>Executar</b></span><span><i>3</i><b>Monitorar</b></span><span><i>4</i><b>Otimizar</b></span></div><footer><small>Etapa atual</small><strong>Execução</strong></footer></div>`;
  if (key === 'wms') return `<div class="portal-preview portal-preview--wms"><header><span>Rolamento 6204</span><b>Disponível</b></header><div class="portal-rack"><span>A1</span><i></i><i class="hit"></i><i></i><span>A2</span><i class="full"></i><i></i><i class="full"></i></div><footer>Armazém A · Rua 03 · P2 <strong>160 un.</strong></footer></div>`;
  throw new Error(`Preview não definido para o módulo: ${key}`);
}

function featuredGridClass(total) {
  if (total <= 1) return 'portal-feature-grid--1';
  if (total === 2) return 'portal-feature-grid--2';
  if (total === 3) return 'portal-feature-grid--3';
  return 'portal-feature-grid--4';
}

function featuredCard(key) {
  const m = modules[key];
  const copy = featuredCopy[key];

  if (!m) {
    throw new Error(`Módulo não definido no portal: ${key}`);
  }

  if (!copy) {
    throw new Error(`Featured copy não definido para o módulo: ${key}`);
  }

  return `<a class="portal-feature portal-feature--${key}" href="${m.slug}.html" data-track="solution_portal_click" data-label="featured_${key}"><div class="portal-feature-copy"><span class="portal-feature-label">${icon(m.icon, 'i')} ${esc(copy.label)}</span><h3>${esc(copy.title)}</h3><p>${esc(copy.text)}</p><span class="portal-feature-link">${esc(copy.cta)}${icon('i-arrow-right', 'i')}</span></div>${preview(key)}</a>`;
}

function compactCard(key) {
  const m = modules[key];
  const integration = key === 'whatsapp';
  return `<a class="portal-module${integration ? ' portal-module--integration' : ''}" href="${m.slug}.html" data-track="solution_portal_click" data-label="compact_${key}"><span class="portal-module-icon">${icon(m.icon, 'i')}</span><div>${integration ? '<small class="portal-module-eyebrow">Integração em destaque</small>' : ''}<h3>${esc(m.navName || m.name)}</h3><p>${esc(m.needShort || m.short)}</p></div>${icon('i-arrow-right', 'i portal-module-arrow')}</a>`;
}

export function renderSolucoes() {
  const title = 'Soluções Infoline | Portal do ERP Integrado';
  const description = 'Explore as soluções do ERP Infoline para produção, estoque, compras, custos, vendas, financeiro, fiscal, pessoas e processos.';
  const headHtml = head({ title, description, path: 'solucoes.html', schemas: [orgSchema()] });
  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Soluções' }]);

  const heroMap = `<div class="solutions-map" aria-label="O ERP Infoline conecta Operação, Vendas e Gestão"><div class="solutions-map-head"><span><i></i> ERP integrado</span><small>Uma base. Toda a operação.</small></div><div class="solutions-map-stage"><svg viewBox="0 0 560 320" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="solutions-map-line" x1="0" x2="1"><stop offset="0" stop-color="#38c8ff"/><stop offset="1" stop-color="#4d7dff"/></linearGradient></defs><ellipse class="solutions-map-orbit" cx="280" cy="145" rx="153" ry="106"/><path class="solutions-map-link" d="M280 145C223 123 184 94 103 71M280 145C337 123 376 94 457 71M280 145C280 196 280 220 280 272"/><path class="solutions-map-flow" d="M280 145C223 123 184 94 103 71M280 145C337 123 376 94 457 71M280 145C280 196 280 220 280 272"/></svg><span class="solutions-map-core"><small>Uma base</small><b>Infoline</b><em>informação compartilhada</em></span><a class="solutions-map-node solutions-map-node--operation" href="#operacao">${icon(modules.pcpm.icon, 'i')}<span><small>Operação</small><b>Planejar e executar</b></span></a><a class="solutions-map-node solutions-map-node--sales" href="#vendas">${icon(modules.comercial.icon, 'i')}<span><small>Vendas</small><b>Relacionar e vender</b></span></a><a class="solutions-map-node solutions-map-node--management" href="#gestao">${icon(modules.controladoria.icon, 'i')}<span><small>Gestão</small><b>Analisar e decidir</b></span></a></div><div class="solutions-map-foot"><span><i></i> Informação compartilhada entre as áreas</span><b>Módulos e integrações</b></div></div>`;
  const heroSection = `<section class="solutions-hero"><div class="container solutions-hero-inner"><div><p class="kicker">Explore o Infoline</p><h1>Escolha pela área que você quer controlar.</h1><p class="lede">Encontre a solução pela rotina da sua empresa. Cada módulo faz parte do mesmo ERP e compartilha a mesma informação.</p><nav class="solutions-jump" aria-label="Áreas das soluções"><a href="#operacao">Operação</a><a href="#vendas">Vendas</a><a href="#gestao">Gestão</a></nav></div>${heroMap}</div></section>`;

  const realityNav = `<section class="solutions-reality"><div class="container"><p>Ou escolha pela realidade da sua operação</p><div><a href="erp-para-industria.html">Gestão Industrial${icon('i-arrow-right', 'i')}</a><a href="erp-para-importadores.html">Gestão para Importadores${icon('i-arrow-right', 'i')}</a><a href="erp-para-atacado-distribuicao.html">Atacado e Distribuição${icon('i-arrow-right', 'i')}</a></div></div></section>`;

  const areaSections = areas.map((area, index) => `<section class="section portal-area${index % 2 ? ' portal-area--mist' : ''}" id="${area.key}"><div class="container"><div class="portal-area-head reveal"><div><p class="kicker">${esc(area.eyebrow)}</p><h2>${esc(area.title)}</h2></div><p>${esc(area.text)}</p></div>${area.featured.length ? `<div class="portal-feature-grid ${featuredGridClass(area.featured.length)}">${area.featured.map(featuredCard).join('')}</div>` : ''}${area.compact.length ? `<div class="portal-module-grid${area.featured.length ? ' portal-module-grid--after-featured' : ''}">${area.compact.map(compactCard).join('')}</div>` : ''}</div></section>`).join('');

  const ctaSection = `<section class="section"><div class="container"><div class="cta-banner reveal"><h2>Não sabe por onde começar?</h2><p>Conte como sua operação funciona e a equipe Infoline indica a combinação de módulos mais adequada.</p><div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="solucoes_bottom">Falar com a Infoline</a></div></div></div></section>`;
  const body = `${header({ variant: 'internal' })}${bc}<main id="conteudo">${heroSection}${realityNav}${areaSections}${ctaSection}</main>${footer()}`;
  return { headHtml, body, styles: ['module.css', 'solutions.css'], pageType: 'solutions' };
}
