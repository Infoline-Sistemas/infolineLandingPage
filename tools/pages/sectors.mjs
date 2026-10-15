import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';
import { modules } from '../content.mjs';
import { heroMock, screenMock } from '../mocks.mjs';

function dotList(items) {
  return items.map((item, index) => `${index ? '<span>·</span>' : ''}${esc(item)}`).join('');
}

function renderSectorPage(config) {
  const headHtml = head({
    title: config.seoTitle,
    description: config.seoDescription,
    path: `${config.slug}.html`,
    schemas: [orgSchema(), faqSchema(config.faq)],
  });

  const bc = breadcrumb([
    { label: 'Início', href: 'index.html' },
    { label: 'Soluções', href: 'solucoes.html' },
    { label: config.name },
  ]);

  const localNav = `
<nav class="module-nav" aria-label="Nesta solução"><div class="container module-nav-inner">
  <span>${esc(config.name)}</span>
  <div><a href="#visao-geral">Visão geral</a><a href="#como-funciona">Como funciona</a><a href="#recursos">Recursos</a><a href="#integracoes">Integrações</a><a href="#faq">FAQ</a></div>
</div></nav>`;

  const heroSection = `
<section class="mod-hero industry-hero sector-hero"><div class="container mod-hero-inner">
  <div class="reveal">
    <span class="mod-hero-icon">${icon(config.icon, 'i i-lg')}</span>
    <p class="kicker">${esc(config.kicker)}</p>
    <h1>${esc(config.h1)}</h1>
    <p class="lede">${esc(config.lead)}</p>
    <div class="mod-hero-cta">
      <a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="${config.key}_hero_demo">Agendar uma demonstração</a>
      <a class="button button-outline" href="#visao-geral">Conhecer a solução</a>
    </div>
    <ul class="mod-hero-meta industry-benefits" aria-label="Benefícios da solução">${config.benefits.map((item) => `<li>${icon('i-check', 'i i-sm')}${esc(item)}</li>`).join('')}</ul>
    ${config.proof?.length ? `<p class="industry-proof">${dotList(config.proof)}</p>` : ''}
  </div>
  <div class="mod-hero-product reveal" role="img" aria-label="${esc(config.productAria)}">
    <span class="mod-product-label">${esc(config.productLabel)}</span>${heroMock[config.hero]()}<small>Representação ilustrativa. Nenhum dado real é exibido.</small>
  </div>
</div></section>`;

  const overviewSection = `
<section class="section" id="visao-geral"><div class="container mod-overview industry-overview">
  <div class="mod-overview-text reveal"><p class="kicker">${esc(config.overviewKicker)}</p><h2>${esc(config.overviewTitle)}</h2>${config.overview.map((text) => `<p>${esc(text)}</p>`).join('')}</div>
  <aside class="mod-aside reveal"><h3>${esc(config.featureTitle)}</h3><ul class="feature-list">${config.features.map((item) => `<li>${icon('i-check', 'i')}<span>${esc(item)}</span></li>`).join('')}</ul></aside>
</div></section>`;

  const processSection = `
<section class="section" id="como-funciona"><div class="container mod-action industry-process reveal">
  <div class="industry-process-head"><p class="kicker">Na prática</p><h2>${esc(config.processTitle)}</h2><p class="lede">${esc(config.processLead)}</p></div>
  <div class="industry-steps">${config.steps.map((step, index) => `<article class="industry-step"><span class="mod-flow-num">${index + 1}</span><div><h3>${esc(step[0])}</h3><p>${esc(step[1])}</p></div></article>`).join('')}</div>
  <p class="industry-technical">${dotList(config.technical)}</p>
</div></section>`;

  const screenVisual = config.screenKind
    ? screenMock(config.screenKind, config.screenData)
    : heroMock[config.screenHero || config.hero]();
  const screenSection = `
<section class="section section--mist" id="acompanhamento"><div class="container screen-section industry-screen">
  <div class="screen-section-text reveal"><p class="kicker">${esc(config.screenKicker)}</p><h2>${esc(config.screenTitle)}</h2><p class="lede">${esc(config.screenText)}</p></div>
  <div class="reveal">${screenVisual}</div>
</div></section>`;

  const capabilitiesSection = `
<section class="section" id="recursos"><div class="container">
  <div class="section-head reveal"><div class="section-head-text"><p class="kicker">${esc(config.capabilityKicker)}</p><h2>${esc(config.capabilityTitle)}</h2></div></div>
  <div class="industry-capabilities reveal">${config.capabilityGroups.map((group) => `<article class="industry-capability"><h3>${esc(group[0])}</h3>${group[1].map((item) => `<div><b>${esc(item[0])}</b><p>${esc(item[1])}</p></div>`).join('')}</article>`).join('')}</div>
  <div class="industry-technical-link reveal"><a class="text-link" href="${config.technicalHref}">${esc(config.technicalLabel)}${icon('i-arrow-right', 'i')}</a></div>
</div></section>`;

  const integrationsSection = `
<section class="section section--mist" id="integracoes"><div class="container">
  <div class="section-head reveal industry-integrations-head"><div class="section-head-text"><p class="kicker">ERP integrado</p><h2>${esc(config.integrationTitle)}</h2><p class="lede">${esc(config.integrationText)}</p></div></div>
  <div class="related-grid industry-related reveal">${config.connected.map(([key, title, text]) => { const m = modules[key]; return `<a class="related-card" href="${m.slug}.html"><span class="related-card-ico">${icon(m.icon, 'i')}</span><div><b>${esc(title)}</b><span>${esc(text)}</span></div></a>`; }).join('')}</div>
</div></section>`;

  const faqSection = `
<section class="section" id="faq"><div class="container" style="max-width:900px;">
  <div class="section-head reveal" style="display:block;"><p class="kicker">Perguntas frequentes</p><h2>${esc(config.faqTitle)}</h2></div>
  <div class="faq-list reveal">${config.faq.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(question)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(answer)}</p></details>`).join('')}</div>
</div></section>`;

  const ctaSection = `
<section class="section industry-final"><div class="container"><div class="cta-banner reveal">
  <h2>${esc(config.ctaTitle)}</h2><p>${esc(config.ctaText)}</p>
  <div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="${config.key}_bottom_demo">Agendar uma demonstração</a></div>
</div></div></section>`;

  const body = `${header({ current: config.slug, variant: 'internal' })}${bc}<main id="conteudo">${heroSection}${localNav}${overviewSection}${processSection}${screenSection}${capabilitiesSection}${integrationsSection}${faqSection}${ctaSection}</main>${footer()}`;
  return { headHtml, body, styles: ['module.css', 'industry.css'], pageType: 'solution', solutionGroup: config.group };
}

const importerConfig = {
  key: 'importadores', slug: 'erp-para-importadores', name: 'Gestão para Importadores', group: 'industria', icon: 'i-compras',
  seoTitle: 'ERP para Importadores: Entrada, Estoque e Custos | Infoline',
  seoDescription: 'ERP para importadores que conecta pedidos, documentos fiscais, entrada de mercadorias, estoque, custos e financeiro em uma única operação.',
  kicker: 'ERP para importadores',
  h1: 'Mais agilidade na entrada das mercadorias. Menos retrabalho na sua operação.',
  lead: 'Organize a entrada das mercadorias e mantenha estoque, fiscal e financeiro conectados sem repetir informações entre os setores.',
  benefits: ['Entrada de mercadorias organizada', 'Menos digitação e retrabalho', 'Estoque, custos e financeiro conectados'],
  proof: [],
  hero: 'compras', productLabel: 'Entrada de mercadorias', productAria: 'Representação ilustrativa do fluxo de compra e recebimento de mercadorias',
  overviewKicker: 'Da chegada ao controle',
  overviewTitle: 'A mercadoria chegou. A informação não deveria ficar para trás.',
  overview: [
    'Quando a mercadoria chega, sua equipe não deveria precisar reconstruir toda a operação em planilhas ou digitar novamente informações que já existem.',
    'A Infoline conecta a entrada ao estoque, fiscal e financeiro para que cada área receba a informação necessária sem começar o processo do zero.',
  ],
  featureTitle: 'Mais controle sobre cada entrada',
  features: ['Saiba o que ainda está pendente de recebimento', 'Encontre as informações da entrada em um único processo', 'Evite redigitar dados que já estão nos documentos da importação', 'Atualize o estoque a partir do recebimento', 'Leve a entrada para fiscal e financeiro sem controles paralelos', 'Consulte compras e recebimentos pendentes'],
  processTitle: 'Da compra à entrada, sem reconstruir a informação no caminho.',
  processLead: 'Cada etapa mantém o próximo setor informado para que a mercadoria avance com menos trabalho manual.',
  steps: [
    ['Prepare a chegada', 'Tenha fornecedor, produtos, quantidades e condições organizados antes da mercadoria chegar.'],
    ['Reduza o preenchimento manual', 'Use os dados disponíveis nos documentos para reduzir preenchimento manual e preparar a entrada.'],
    ['Confirme o recebimento', 'Confirme o recebimento e leve a operação para a nota fiscal sem reconstruir tudo manualmente.'],
    ['Atualize a posição real', 'A mercadoria recebida passa a fazer parte da posição real da empresa.'],
    ['Conecte as demais áreas', 'A entrada gera os reflexos necessários para que outras áreas continuem a operação.'],
  ],
  technical: ['DI', 'XML', 'Nota Fiscal', 'Estoque', 'Financeiro'],
  screenKicker: 'Entrada sem retrabalho', screenTitle: 'A informação já existe. Sua equipe não deveria precisar digitá-la novamente.',
  screenText: 'O Infoline aproveita informações do processo de entrada para reduzir digitação manual e conectar o recebimento às demais áreas da empresa.', screenHero: 'compras',
  capabilityKicker: 'Gestão para importadores', capabilityTitle: 'Controle antes, durante e depois da chegada da mercadoria.',
  capabilityGroups: [
    ['Antes da chegada', [['Organize pedidos e fornecedores', 'Mantenha o que foi comprado, prazos e condições reunidos no mesmo fluxo.'], ['Acompanhe o que ainda está pendente de recebimento', 'Consulte compras em aberto e prepare a operação para a chegada das mercadorias.']]],
    ['Na entrada', [['Centralize documentos', 'Trabalhe com XML, documentos fiscais e informações da importação sem controles espalhados.'], ['Reduza redigitação', 'Aproveite os dados do processo para tornar a entrada mais ágil e consistente.']]],
    ['Depois do recebimento', [['Atualize a disponibilidade', 'A entrada mantém o estoque conectado ao que foi efetivamente recebido.'], ['Mantenha as áreas conectadas', 'Custos, fiscal, contábil e financeiro seguem a mesma operação sem controles paralelos.']]],
  ],
  technicalHref: 'compras.html', technicalLabel: 'Ver os recursos técnicos de Compras e Suprimentos',
  integrationTitle: 'A importação não termina na chegada. O ERP precisa acompanhar tudo que vem depois.',
  integrationText: 'O recebimento conecta os documentos da entrada às áreas que precisam atualizar estoque, custos, obrigações e compromissos financeiros.',
  connected: [['compras','Compras','Pedidos, fornecedores e recebimentos no mesmo fluxo.'],['contabilidade','Fiscal e Contábil','Documentos e impactos da entrada organizados para a gestão.'],['wms','Estoque e WMS','Mercadoria recebida disponível e localizada para a operação.'],['custos','Custos','Custos e impacto da entrada sobre cada item.'],['financeiro','Financeiro','Compromissos da compra conectados à gestão financeira.']],
  faqTitle: 'Sobre o ERP para importadores',
  faq: [
    ['Minha empresa ainda controla importações em várias planilhas. O Infoline pode centralizar a operação?', 'Sim. A proposta é conectar pedidos, documentos, recebimentos, estoque, custos, fiscal e financeiro para reduzir informações mantidas separadamente entre setores.'],
    ['O sistema trabalha com XML de NF-e e CT-e?', 'Sim. O Infoline pode localizar documentos fiscais emitidos para a empresa, consultar pela chave de acesso, importar XML de NF-e e também importar CT-e por XML.'],
    ['A entrada atualiza estoque e financeiro?', 'Sim. O recebimento mantém o estoque atualizado e pode refletir os impactos fiscal, contábil, patrimonial e financeiro da operação.'],
    ['O Infoline ajuda a reduzir a digitação manual na entrada?', 'Sim. O Infoline aproveita informações disponíveis nos documentos da operação para reduzir redigitação e facilitar a continuidade do processo de entrada.'],
  ],
  ctaTitle: 'Quer ganhar agilidade da compra à entrada da mercadoria?',
  ctaText: 'Conte como sua operação de importação funciona hoje e veja como a Infoline pode conectar documentos, recebimento, estoque, custos e gestão.',
};

const wholesaleConfig = {
  key: 'atacado', slug: 'erp-para-atacado-distribuicao', name: 'Atacado e Distribuição', group: 'vendas', icon: 'i-comercial',
  seoTitle: 'ERP para Atacado e Distribuição: Venda à Expedição | Infoline',
  seoDescription: 'ERP para atacadistas e distribuidores que conecta preços, representantes, pedidos, estoque, separação, expedição e financeiro.',
  kicker: 'ERP para atacado e distribuição',
  h1: 'Venda com controle de margem e leve cada pedido até a expedição sem perder informação pelo caminho.',
  lead: 'Preço, pedido, estoque e expedição trabalhando no mesmo fluxo para que sua equipe venda sem perder o controle do que acontece depois.',
  benefits: ['Mais controle sobre a margem', 'Pedido conectado ao estoque', 'Separação e expedição organizadas'],
  proof: ['Preços', 'Representantes', 'Pedidos', 'Estoque', 'Separação', 'Expedição', 'Financeiro'],
  hero: 'comercial', productLabel: 'Do pedido à expedição', productAria: 'Representação ilustrativa de um pedido de venda conectado às demais áreas',
  overviewKicker: 'Venda que segue o fluxo',
  overviewTitle: 'Evite que o pedido pare entre a venda e a expedição.',
  overview: [
    'Preço, pedido, disponibilidade e separação trabalham com a mesma informação para que a equipe comercial não dependa de conferências manuais com o estoque.',
    'A Infoline conecta a venda à operação logística e ao financeiro para mostrar o que foi vendido, o que precisa ser separado e o que já pode seguir para o cliente.',
  ],
  featureTitle: 'Mais controle da venda à expedição',
  features: ['Defina preços com atenção à margem', 'Organize pedidos e condições comerciais', 'Consulte a disponibilidade dos produtos', 'Acompanhe separação e conferência', 'Monte cargas e romaneios', 'Conecte faturamento e financeiro'],
  processTitle: 'Do preço à expedição, com o pedido seguindo a mesma informação.',
  processLead: 'O fluxo comercial avança para estoque e logística sem depender de planilhas ou repasses manuais entre equipes.',
  steps: [
    ['Venda sabendo onde está sua margem', 'Use tabelas e condições comerciais adequadas para cada negociação.'],
    ['Registre o pedido uma única vez', 'Produtos, quantidades e condições seguem para as próximas etapas da operação.'],
    ['Saiba o que pode ser atendido antes de prometer ao cliente', 'A equipe enxerga o que pode ser atendido e o que precisa ser preparado.'],
    ['Separe e confira os produtos', 'Organize picking, packing e identificação dos volumes antes da saída.'],
    ['Monte a carga e siga para o faturamento', 'Reúna pedidos, romaneios e expedição no fluxo que conclui a venda.'],
  ],
  technical: ['Formação de preço', 'WMS', 'Picking', 'Packing', 'Cargas', 'Romaneio'],
  screenKicker: 'Expedição sob controle', screenTitle: 'Saiba quais pedidos estão prontos para avançar.',
  screenText: 'Acompanhe cargas, pedidos vinculados, volumes e situação da operação para agir antes que uma pendência atrase a expedição.',
  screenKind: 'wms', screenData: { columns: ['Nº da carga','Pedidos','Volume','Situação'], rows: [['3227','01','2.100','Faturada'],['3228','06','0','Em montagem'],['3229','11','0','Em montagem']] },
  capabilityKicker: 'Gestão para atacadistas', capabilityTitle: 'Venda, margem e expedição trabalhando no mesmo fluxo.',
  capabilityGroups: [
    ['Venda com mais controle', [['Organize preços e condições', 'Trabalhe tabelas, negociações e pedidos de forma consistente.'], ['Acompanhe representantes e clientes', 'Mantenha a rotina comercial conectada ao histórico e aos pedidos.']]],
    ['Proteja a operação', [['Consulte estoque e disponibilidade', 'Saiba o que pode ser atendido antes de confirmar o pedido.'], ['Separe com menos erro', 'Organize picking, conferência, packing e identificação dos volumes.']]],
    ['Agilize a expedição', [['Monte cargas e romaneios', 'Agrupe pedidos e acompanhe a situação de cada carga.'], ['Conecte faturamento e financeiro', 'Ao faturar, mantenha estoque e financeiro atualizados no mesmo fluxo.']]],
  ],
  technicalHref: 'wms.html', technicalLabel: 'Ver os recursos técnicos de WMS e expedição',
  integrationTitle: 'A venda não termina no pedido. A operação precisa seguir conectada até a expedição.',
  integrationText: 'Comercial, estoque, logística, faturamento e financeiro trabalham sobre o mesmo fluxo para reduzir esperas, conferências manuais e perda de informação.',
  connected: [['comercial','Comercial','Preço, cliente e pedido organizados desde a negociação.'],['custos','Custos e margem','Conheça melhor o custo e proteja a rentabilidade da venda.'],['wms','Estoque e WMS','Disponibilidade, separação, conferência e expedição.'],['financeiro','Financeiro','Faturamento e recebimentos conectados ao pedido.'],['contabilidade','Fiscal e Contábil','Documentos e obrigações gerados a partir da operação.']],
  faqTitle: 'Sobre o ERP para atacado e distribuição',
  faq: [
    ['Minha distribuidora usa planilhas entre vendas e estoque. O Infoline pode integrar o fluxo?', 'Sim. A proposta é conectar preços, pedidos, disponibilidade, separação, expedição, faturamento e financeiro para reduzir controles paralelos.'],
    ['O pedido de venda atualiza outras áreas?', 'Sim. O fluxo comercial pode atualizar o estoque e seguir para faturamento, documentos fiscais e financeiro dentro do ERP.'],
    ['O sistema ajuda na separação e expedição?', 'Sim. O WMS inclui endereçamento, pedido de separação, packing, montagem de cargas, romaneio, etiquetas e leitura por código de barras.'],
    ['É possível trabalhar preço e margem?', 'Sim. As áreas de custos e comercial apoiam formação de preço, tabelas e análises de rentabilidade ligadas à venda.'],
  ],
  ctaTitle: 'Quer fazer o pedido avançar da venda à expedição com mais controle?',
  ctaText: 'Conte como sua operação funciona hoje e veja como a Infoline pode conectar preços, pedidos, estoque, separação, expedição e gestão.',
};

export const renderImporters = () => renderSectorPage(importerConfig);
export const renderWholesale = () => renderSectorPage(wholesaleConfig);
