// =============================================================================
// CONTEÚDO DO SITE INFOLINE  —  fonte única para o gerador (tools/build.mjs)
// Regra: nada aqui pode ser inventado. Cada afirmação vem de:
//   (a) site público atual (infolinesystems.com.br)  (b) arquivos do projeto
// =============================================================================

export const site = {
  name: 'Infoline Sistemas de Gestão Empresarial',
  legalName: 'Infoline Sistemas de Gestão Empresarial Ltda',
  short: 'Infoline',
  url: 'https://infolinesystems.com.br',
  since: 2001,
  areaServed: ['Brasil'],
  phone: '+55 41 3014-0075',
  phoneDisplay: '(41) 3014-0075',
  tel: '+554130140075',
  whatsapp: '5541988538135',
  whatsappDisplay: '(41) 98853-8135',
  email: 'comercial@infolinesystems.com.br',
  // Endereço preservado do site anterior e da política dos aplicativos.
  address: {
    streetAddress: 'Avenida República Argentina, 2403, cj. 86',
    postalCode: '80610-260',
    city: 'Curitiba',
    region: 'PR',
    country: 'BR',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Avenida+Rep%C3%BAblica+Argentina+2403,+Curitiba,+PR,+80610-260',
  clientAccess: [
    { label: 'Versão atual', cta: 'Acessar V3.1', url: 'https://erp.infolinesystems.app.br/InfolineV3.1/#/login' },
    { label: 'Versão anterior', cta: 'Acessar V3', url: 'https://erp.infoline.app.br/InfolineV3/#/login' },
  ],
  buildDate: '2026-10-09',
  sitemapLastmod: '2026-10-09',
  year: 2026,
};

// ---------------------------------------------------------------------------
// GRUPOS (hierarquia do portal)
// ---------------------------------------------------------------------------
export const groups = [
  {
    key: 'industria',
    name: 'Indústria e operação',
    blurb: 'Do planejamento da fábrica à expedição do armazém, passando por compras e custos.',
    modules: ['pcpm', 'wms', 'compras', 'custos'],
    cover: { img: 'industrial', ratio: [1254, 1254], widths: [480, 800, 1200], alt: 'Linha de produção industrial com máquinas e esteiras iluminadas' },
  },
  {
    key: 'vendas',
    name: 'Vendas e relacionamento',
    blurb: 'Do primeiro contato ao pedido faturado, no balcão ou nos marketplaces.',
    modules: ['comercial', 'crm', 'ecommerce'],
    cover: { img: 'mod-comercial', ratio: [1672, 941], widths: [480, 800, 1200], alt: 'Vendedora apresenta um catálogo a um cliente enquanto um notebook exibe o pedido' },
  },
  {
    key: 'financas',
    name: 'Finanças e controle',
    blurb: 'Caixa, cobrança, obrigações fiscais e resultado da operação.',
    modules: ['financeiro', 'whatsapp', 'contabilidade', 'controladoria'],
    cover: { img: 'mod-financeiro', ratio: [1672, 941], widths: [480, 800, 1200], alt: 'Gestor financeiro analisa relatórios com gráficos de fluxo de caixa no monitor' },
  },
  {
    key: 'pessoas',
    name: 'Pessoas e processos',
    blurb: 'Folha, ponto e fluxos de trabalho padronizados entre as áreas.',
    modules: ['rh', 'processos'],
    cover: { img: 'mod-rh', ratio: [1672, 941], widths: [480, 800, 1200], alt: 'Equipe de RH reunida em torno de um notebook em um escritório claro' },
  },
];

// ---------------------------------------------------------------------------
// MÓDULOS  (textos de overview/features/groups migrados dos arquivos do projeto)
// ---------------------------------------------------------------------------
const M = {};

M.pcpm = {
  key: 'pcpm', slug: 'pcpm', name: 'PCPM', icon: 'i-pcpm', group: 'industria',
  short: 'Planejamento e controle da produção com MRP e ordens acompanháveis.',
  needShort: 'MRP, ordens e apontamentos de produção',
  kicker: 'PCPM e MRP',
  seoTitle: 'PCPM e MRP para Indústria | Infoline',
  seoDesc: 'PCPM e MRP para indústria: estrutura de produtos, roteiros, carga de máquina, ordens de produção e apontamentos integrados ao ERP Infoline.',
  h1: 'PCPM e MRP: planeje materiais, programe a fábrica e acompanhe cada ordem de produção.',
  lead: 'O PCPM conecta a estrutura do produto, os processos, o MRP e a programação da produção. Na prática, permite comparar o que foi planejado com o que já foi produzido e identificar o saldo que ainda precisa ser executado.',
  overview: [
    'A Área Industrial PCPM integra as etapas do processo produtivo para aumentar a eficiência, o controle e a previsibilidade da operação. A engenharia estrutura produtos e processos, formando a base do planejamento de materiais e recursos.',
    'Com controle de produção, cálculo de carga máquina e MRP II, o módulo apoia a alocação dos recursos fabris e o acompanhamento das ordens em tempo real, conectando o planejamento industrial aos demais setores da empresa.',
  ],
  features: ['MRP para calcular necessidades de materiais', 'Estrutura de produtos e processos', 'Roteiros de produção', 'Carga e restrições de máquina', 'Ordens planejadas, firmadas e encerradas', 'Apontamentos, desvios e saldo a produzir'],
  catalogTitle: 'O que a fábrica precisa acompanhar.',
  groups: [
    ['Planejamento de materiais', ['MRP - Material Requirements Planning', 'MRP - Necessidade de Materiais para atender Ordens de Produções', 'Painel de Produção']],
    ['Engenharia e capacidade', ['Cadastro Estrutura Produtos', 'Cadastro Estrutura Produtos - Inversa', 'Cadastro Estrutura Produtos Versões', 'Processos do Roteiro de Produção', 'Cadastro de Máquinas']],
    ['Controle da execução', ['Ordens de Produção', 'Apontamentos de Produção', 'Consulta de Produção', 'Desvios de Apontamento de Produção', 'Relatório de Produção por Turno']],
  ],
  photo: { img: 'mod-pcpm', ratio: [1672, 941], alt: 'Operador acompanha o planejamento da produção em um monitor no chão de fábrica' },
  hero: 'pcpm',
  action: {
    type: 'flow', title: 'Do planejamento ao apontamento, no mesmo fluxo.',
    text: 'Cada etapa do processo produtivo alimenta a seguinte. O que foi planejado aparece ao lado do que já foi produzido.',
    steps: [
      ['Estrutura e roteiro', 'Produtos, versões, processos do roteiro e máquinas cadastrados pela engenharia.'],
      ['MRP', 'Cálculo da necessidade de materiais para atender as ordens de produção.'],
      ['Ordem de produção', 'Ordens planejadas, firmadas e encerradas, com número, produto e datas.'],
      ['Carga de máquina', 'Alocação dos recursos fabris considerando restrições de máquina.'],
      ['Apontamento', 'Quantidade produzida, desvios e o saldo que ainda falta produzir.'],
    ],
    screen: {
      title: 'MRP: do planejamento ao acompanhamento da ordem',
      text: 'É possível navegar por mês, semana ou dia, filtrar grupos de produção e processar ordens. A tabela mostra número da ordem, produto, máquina, datas, quantidade planejada, quantidade produzida e quantidade a produzir. Cada ordem ainda pode ser editada ou impressa, com indicação de situação e possíveis problemas.',
      kind: 'pcpm',
    },
  },
  cta: 'Veja como o planejamento pode conversar com a produção.',
  faq: [
    ['O Infoline calcula a necessidade de materiais (MRP)?', 'Sim. O PCPM inclui o MRP (Material Requirements Planning), que calcula a necessidade de materiais para atender o planejamento e as ordens de produção. A base vem da engenharia: estrutura de produtos e processos cadastrados no sistema.'],
    ['Como acompanho o que foi planejado e o que já foi produzido?', 'Cada ordem de produção mostra quantidade planejada, produzida e a produzir, além de máquina, datas e situação. Apontamentos e desvios de produção alimentam essa visão.'],
    ['O PCPM considera a capacidade das máquinas?', 'Sim. O módulo trabalha com cálculo de carga máquina e restrições de máquina, apoiando a alocação dos recursos fabris e a programação da produção.'],
  ],
};

M.wms = {
  key: 'wms', slug: 'wms', name: 'WMS', icon: 'i-wms', group: 'industria',
  short: 'Estoque endereçado, inventário, separação e expedição.',
  needShort: 'Estoque, leitura, carga e expedição',
  kicker: 'WMS',
  seoTitle: 'WMS para Gestão de Estoque | Infoline',
  seoDesc: 'WMS para endereçamento, inventário, separação e expedição de estoque, com código de barras e rastreabilidade de lotes integrados ao ERP Infoline.',
  h1: 'WMS: saiba onde está cada item e movimente o estoque com confiança.',
  lead: 'O WMS transforma o armazém em uma operação rastreável: endereçamento, separação, inventário, planejamento logístico, etiquetas e transferências conectados ao ERP.',
  overview: [
    'A Área WMS oferece controle detalhado do estoque por endereçamento logístico, considerando armazém, rua, prateleira e demais níveis de localização. Códigos de produto inteligentes ou sequenciais facilitam a identificação e a rastreabilidade dos itens.',
    'Reservas de produtos, inventário cíclico, contagem física, etiquetas e leitura por código de barras ajudam a reduzir erros manuais e dão mais velocidade à conferência, movimentação, separação e expedição.',
  ],
  features: ['Endereçamento por armazém, rua e prateleira', 'Pedido de separação e packing', 'Montagem de cargas', 'Inventário WMS', 'Planejamento logístico', 'Rastreabilidade de lotes', 'Etiquetas e código de barras', 'Kardex e transferências'],
  catalogTitle: 'Estoque rastreável até a expedição.',
  groups: [
    ['Armazém e endereçamento', ['Locais de Estoque', 'Registrar prateleira no produto', 'Produtos WMS', 'Posição do Estoque']],
    ['Planejamento e expedição', ['Planejamento Logístico', 'Pedido Separação', 'Packing Pedido', 'Montagem de Cargas', 'Roteirização', 'Romaneio a Partir do Pedido de Separação']],
    ['Inventário e rastreio', ['Inventário WMS', 'Rastreabilidade de Lotes de Produtos', 'Emissão de etiquetas de Volume para Transporte', 'Kardex/Transferências de estoque Com Lista WMS']],
  ],
  photo: { img: 'mod-wms', ratio: [1536, 1024], alt: 'Operador com leitor de código de barras em um armazém com prateleiras e caminhão de carga' },
  hero: 'wms',
  action: {
    type: 'flow', title: 'Da prateleira à carga expedida.',
    text: 'O estoque deixa de ser um saldo e passa a ter endereço, movimento e responsável em cada etapa.',
    steps: [
      ['Endereçamento', 'Armazém, rua, prateleira e demais níveis de localização de cada produto.'],
      ['Pedido de separação', 'Reservas de produtos e planejamento logístico organizam a separação.'],
      ['Packing', 'Conferência e embalagem do pedido, com etiquetas de volume e leitura por código de barras.'],
      ['Montagem de carga', 'Cargas reúnem pedidos vinculados, volume e situação da operação.'],
      ['Expedição e faturamento', 'Romaneio a partir do pedido de separação e geração do faturamento.'],
    ],
    screen: {
      title: 'Montagem de carga: controle da carga até o faturamento',
      text: 'A montagem de carga reúne em uma única visão o número da carga, os pedidos vinculados, o volume e a situação da operação. Depois de selecionar as cargas, é possível processá-las e gerar o faturamento.',
      kind: 'wms',
      columns: ['Nº da carga', 'Pedidos', 'Volume', 'Situação'],
      rows: [['3227', '01', '2.100', 'Faturada'], ['3228', '06', '0', 'Em montagem'], ['3229', '11', '0', 'Em montagem']],
    },
  },
  cta: 'Transforme localização e movimentação em controle.',
  faq: [
    ['Como o WMS controla a localização do estoque?', 'Por endereçamento logístico: armazém, rua, prateleira e demais níveis de localização. Códigos de produto inteligentes ou sequenciais ajudam a identificar e rastrear cada item.'],
    ['O WMS faz inventário e leitura por código de barras?', 'Sim. O módulo inclui inventário cíclico, contagem física, emissão de etiquetas e leitura por código de barras, para reduzir erros manuais na conferência, movimentação e expedição.'],
    ['É possível montar cargas e gerar o faturamento?', 'Sim. A montagem de carga reúne número da carga, pedidos vinculados, volume e situação. Depois de selecionar as cargas, é possível processá-las e gerar o faturamento.'],
  ],
};

M.compras = {
  key: 'compras', slug: 'compras', name: 'Compras e Suprimentos', icon: 'i-compras', group: 'industria',
  short: 'Da necessidade ao recebimento, com menos trabalho manual.',
  needShort: 'Cotações, XML e entrada de materiais',
  kicker: 'Compras e suprimentos',
  seoTitle: 'Compras e Suprimentos: Cotação, XML e Recebimento | Infoline',
  seoDesc: 'ERP de compras com solicitação, cotação, pedido e recebimento. Localiza NF-e, importa XML e CT-e e atualiza estoque, fiscal e financeiro.',
  h1: 'Compras e suprimentos: do pedido de compra ao recebimento, sem depender de controles paralelos.',
  lead: 'A rotina acompanha a necessidade, a cotação, o pedido e a entrada dos materiais. O sistema pode localizar automaticamente documentos fiscais emitidos para a empresa e, quando necessário, também permite buscar pela chave de acesso ou importar o arquivo XML. A rotina ainda permite importar CT-e por XML.',
  overview: [
    'A Área de Compras e Suprimentos gerencia a aquisição de materiais e serviços em um fluxo que começa nas solicitações, passa por cotações e segue até a emissão dos pedidos.',
    'No recebimento, as entradas mantêm o estoque atualizado e podem refletir automaticamente os impactos fiscal, contábil, patrimonial e financeiro, trazendo consistência às áreas envolvidas na compra.',
  ],
  features: ['Localização automática de documentos fiscais', 'Consulta pela chave de acesso', 'Importação manual de XML', 'Importação de CT-e por XML', 'Solicitação e cotação de compras', 'Integração com estoque, fiscal e financeiro'],
  catalogTitle: 'A compra inteira, da solicitação à entrada.',
  groups: [
    ['Compra', ['Solicitação de Compra', 'Solicitação de Material', 'Cotações', 'Pedidos de Compra', 'Geração de Pedidos a partir de Cotações']],
    ['Recebimento fiscal', ['Recebimentos (Notas Fiscais de Entrada)', 'XML NFe de DI - Despachante', 'Recebimento Com Retenção de Imposto', 'Transferência de Local Por Nota', 'Entrada de Produção']],
    ['Acompanhamento', ['Agendamento de Recebimento', 'Entregas de Produtos por Compras em Aberto', 'Análise de Compras', 'Histórico Compra - 3 Preços', 'Relatório de pedidos de compras sintético']],
  ],
  photo: { img: 'mod-compras', ratio: [1672, 941], alt: 'Compradora confere documentos e um tablet em frente a um armazém com prateleiras' },
  hero: 'compras',
  action: {
    type: 'flow', title: 'A compra em cinco passos, sem planilha no meio.',
    text: 'Cada etapa fica registrada no ERP. Quando o material chega, o recebimento já conversa com estoque, fiscal e financeiro.',
    steps: [
      ['Solicitação', 'Solicitações de compra e de material registram a necessidade.'],
      ['Cotação', 'Cotações comparadas, com histórico das últimas compras por preço.'],
      ['Pedido de compra', 'Pedidos gerados a partir das cotações escolhidas.'],
      ['Recebimento', 'Documentos fiscais localizados automaticamente, ou por chave de acesso, XML e CT-e.'],
      ['Estoque e impactos', 'Entrada atualiza o estoque e reflete no fiscal, contábil, patrimonial e financeiro.'],
    ],
  },
  cta: 'Leve suas compras para dentro do mesmo fluxo.',
  faq: [
    ['O sistema importa XML de NF-e e CT-e?', 'Sim. O Infoline pode localizar automaticamente documentos fiscais emitidos para a empresa. Quando necessário, permite buscar pela chave de acesso ou importar o arquivo XML, e também importar CT-e por XML.'],
    ['O recebimento atualiza estoque e financeiro?', 'Sim. As entradas mantêm o estoque atualizado e podem refletir automaticamente os impactos fiscal, contábil, patrimonial e financeiro.'],
    ['Como funciona o fluxo de compra no sistema?', 'Começa nas solicitações, passa por cotações e segue até a emissão dos pedidos. É possível gerar pedidos a partir das cotações e acompanhar entregas em aberto e agendamentos de recebimento.'],
  ],
};

M.custos = {
  key: 'custos', slug: 'custos', name: 'Gestão de Custos', icon: 'i-custos', group: 'industria',
  short: 'Custos de produção, insumos e formação de preços.',
  needShort: 'Hora máquina, insumos e precificação',
  kicker: 'Gestão de custos',
  seoTitle: 'Gestão de Custos e Formação de Preço | Infoline',
  seoDesc: 'Controle hora máquina, hora homem e insumos e forme preços de venda a partir do custo real com o módulo de custos do ERP Infoline.',
  h1: 'Gestão de custos: preço melhor começa com custo conhecido.',
  lead: 'Acompanhe hora máquina, hora homem, insumos e formação de preço para tomar decisões de rentabilidade.',
  overview: [
    'A Área de Custos apoia o controle e a análise dos elementos que formam o custo de produção e operação. Hora máquina, hora homem e insumos ajudam a revelar o custo real de cada atividade.',
    'Com essa base, a formação de preços pode considerar os fatores do processo produtivo com mais segurança, favorecendo decisões de precificação, competitividade e rentabilidade.',
  ],
  features: ['Hora máquina', 'Hora homem', 'Insumos', 'Formação de preço', 'Tabela por margem', 'Markup e rentabilidade'],
  catalogTitle: 'Do centro de custo ao preço de venda.',
  groups: [
    ['Estrutura', ['Cadastro de Centro de Custos', 'Centro de Custo', 'Custos Gerais', 'Cadastro de Máquinas', 'Cadastro Estrutura Produtos']],
    ['Preço', ['Formação de Preço Atacadista', 'Tabela de Preço a partir da Margem', 'Valoração Estoque', 'Valoração Importados']],
    ['Análise', ['Relatório de Markup', 'Resultado Bruto Sobre Vendas', 'Resumo de Rentabilidade por projeto', 'Relatório de Custos com Terceiros']],
  ],
  photo: { img: 'mod-custos', ratio: [1672, 941], alt: 'Técnico inspeciona peças usinadas ao lado de uma máquina industrial' },
  hero: 'custos',
  action: {
    type: 'stack', title: 'Do custo de cada atividade ao preço de venda.',
    text: 'Os elementos do processo produtivo compõem o custo. Sobre ele, a margem e o markup definem o preço, com rentabilidade visível.',
    steps: [
      ['Hora máquina', 'Custo do uso de cada máquina, a partir do cadastro de máquinas.'],
      ['Hora homem', 'Custo da mão de obra envolvida em cada atividade.'],
      ['Insumos', 'Materiais e insumos que entram no produto.'],
      ['Margem e markup', 'Tabela de preço a partir da margem e relatório de markup.'],
    ],
  },
  cta: 'Forme preço a partir do custo real.',
  faq: [
    ['O que o módulo de custos considera?', 'Hora máquina, hora homem e insumos, para revelar o custo real de cada atividade de produção e operação.'],
    ['Como o custo apoia a formação de preço?', 'O módulo inclui formação de preço atacadista, tabela de preço a partir da margem, valoração de estoque e relatório de markup, para definir preços com base no custo.'],
    ['Qual a diferença entre Gestão de Custos e Controladoria?', 'Gestão de Custos cuida dos elementos que formam o custo (hora máquina, hora homem e insumos) e da formação de preço. A Controladoria usa resultados, centros, DRE e dashboards gerenciais para mostrar onde o resultado acontece.'],
  ],
};

M.comercial = {
  key: 'comercial', slug: 'comercial', name: 'Comercial', icon: 'i-comercial', group: 'vendas',
  short: 'Orçamentos, pedidos, preços e vendas em um fluxo conectado.',
  needShort: 'Preços, orçamentos e pedidos integrados',
  kicker: 'ERP comercial',
  seoTitle: 'ERP Comercial: Orçamento, Pedido e Vendas | Infoline',
  seoDesc: 'ERP comercial com tabela de preço, orçamento, pedido de venda e faturamento integrados a estoque, fiscal, contábil e financeiro.',
  h1: 'ERP comercial: venda com preço, carteira e pedido sob controle.',
  lead: 'O Comercial organiza o caminho entre oportunidade, orçamento e pedido, conectando tabela de preços, condições comerciais, aprovação e análise de vendas.',
  overview: [
    'A Área Comercial centraliza o ciclo de vendas, desde a definição de preços e a criação de orçamentos personalizados até o registro dos pedidos. Tabelas de preço e propostas sob medida dão mais agilidade e flexibilidade à negociação.',
    'As entregas podem ser programadas conforme a demanda e cada pedido atualiza automaticamente o estoque. As movimentações se integram aos módulos financeiro, contábil e fiscal, enquanto as previsões de vendas apoiam análises e o planejamento comercial.',
  ],
  features: ['Tabela de Preço', 'Orçamento e proposta', 'Pedido de venda', 'Formação de preço e margem', 'Aprovação e validação comercial', 'Previsão e análise de vendas'],
  catalogTitle: 'Da tabela de preço à análise de vendas.',
  groups: [
    ['Venda', ['Orçamento', 'Proposta de Orçamento', 'Pedido de Venda', 'Pedido de Venda Atacadista', 'Pedido de Venda Indústria']],
    ['Preço e regras', ['Tabela de Preço', 'Tabela de Preço a partir da Margem', 'Grupo de Preços', 'Condições de Pagamento', 'Descontos Flexíveis Por Representante']],
    ['Gestão comercial', ['Painel de Vendas', 'Análise de Carteira', 'Previsão de vendas por Cliente', 'Análise De Vendas', 'Relatório de Vendas por Período']],
  ],
  photo: { img: 'mod-comercial', ratio: [1672, 941], alt: 'Vendedora apresenta um catálogo a um cliente enquanto um notebook exibe o pedido' },
  hero: 'comercial',
  action: {
    type: 'timeline', title: 'Do orçamento ao caixa, cada passo já avisa o próximo.',
    text: 'Uma venda não termina no pedido. No Infoline, ela atravessa estoque, fiscal e financeiro sem ser digitada de novo.',
    steps: [
      ['Orçamento e proposta', 'Preço definido a partir da tabela ou da margem, com proposta personalizada para o cliente.'],
      ['Pedido de venda', 'Pedido registrado, com entregas programadas conforme a demanda.'],
      ['Estoque atualizado', 'Cada pedido emitido atualiza automaticamente o estoque.'],
      ['Faturamento e emissão fiscal', 'O pedido reúne os dados necessários e pode seguir para a rotina de faturamento e emissão fiscal.'],
      ['Financeiro, contábil e fiscal', 'As movimentações comerciais se integram aos módulos financeiro, contábil e fiscal.'],
    ],
  },
  cta: 'Do orçamento ao faturamento: veja o fluxo na sua empresa.',
  faq: [
    ['O pedido de venda atualiza o estoque?', 'Sim. Cada pedido atualiza automaticamente o estoque, e as movimentações comerciais se integram aos módulos financeiro, contábil e fiscal.'],
    ['O pedido de venda se conecta ao faturamento?', 'Sim. O pedido reúne as informações necessárias e pode seguir para a rotina de faturamento, onde a emissão da nota fiscal pode ser realizada. Estoque e financeiro permanecem conectados ao processo.'],
    ['Existe previsão e análise de vendas?', 'Sim. O módulo oferece previsão de vendas por cliente, análise de carteira, análise de vendas, painel de vendas e relatórios por período.'],
  ],
};

M.crm = {
  key: 'crm', slug: 'crm', name: 'Relacionamento com o Cliente', navName: 'CRM', icon: 'i-crm', group: 'vendas',
  short: 'Contatos, funil, follow-up e workflows comerciais.',
  needShort: 'Histórico, funil e acompanhamento',
  kicker: 'CRM integrado ao ERP',
  seoTitle: 'CRM Integrado ao ERP: Funil e Follow-up | Infoline',
  seoDesc: 'CRM integrado ao ERP para registrar contatos, acompanhar o funil de oportunidades, agendar follow-ups e conectar o relacionamento ao comercial.',
  h1: 'CRM integrado ao ERP: cada contato vira histórico, tarefa e oportunidade.',
  lead: 'CRM para organizar contatos, funil, follow-up e workflows, conectando o relacionamento ao comercial.',
  overview: [
    'A Área de Relacionamento com o Cliente organiza a construção e a manutenção de vínculos com a base de clientes. O CRM registra o histórico das interações e oferece uma visão mais completa de cada relacionamento para tornar o atendimento mais personalizado.',
    'Follow-ups ajudam a estruturar lembretes e tarefas de acompanhamento. Os fluxos de trabalho apoiam as etapas internas do atendimento, trazendo mais previsibilidade e agilidade para o relacionamento comercial.',
  ],
  features: ['Histórico de contatos', 'Funil de oportunidades', 'Follow-up', 'Workflows', 'Atividades e responsáveis', 'Dashboards e relatórios'],
  catalogTitle: 'Do contato registrado à oportunidade analisada.',
  groups: [
    ['Relacionamento', ['CRM - Gestão de Relacionamento com o Cliente', 'Gestão de Contatos com Cliente', 'Realizar Contatos', 'Cadastrar Lista de Contatos']],
    ['Oportunidades', ['Funil de Oportunidades', 'Dashboard de oportunidades', 'Cadastro de Funil', 'Cadastro de Origem de Oportunidade']],
    ['Análise', ['Relatório de Contatos por Mês', 'Quantidade de Contatos Por Situação', 'Quantidade de Contatos Por Vendedor', 'Mapeamento de Clientes']],
  ],
  photo: { img: 'mod-crm', ratio: [1672, 941], alt: 'Consultora mostra o histórico de um cliente em um tablet durante uma reunião' },
  hero: 'crm',
  action: {
    type: 'flow', title: 'O relacionamento alimentando a venda.',
    text: 'O CRM não fica ao lado do comercial: ele registra o que acontece antes do pedido e entrega o histórico a quem vende.',
    steps: [
      ['Registrar o contato', 'Gestão de contatos e listas, com origem da oportunidade.'],
      ['Acompanhar', 'Follow-up com lembretes e tarefas para cada responsável.'],
      ['Mover no funil', 'Funil de oportunidades com dashboard de acompanhamento.'],
      ['Levar ao comercial', 'O relacionamento se conecta ao orçamento e ao pedido no módulo Comercial.'],
    ],
  },
  cta: 'Faça o relacionamento alimentar a venda.',
  faq: [
    ['O que o CRM do Infoline registra?', 'O histórico das interações com cada cliente, os contatos realizados, o funil de oportunidades e os follow-ups, com lembretes e tarefas de acompanhamento.'],
    ['O CRM é integrado ao comercial?', 'Sim. O módulo foi pensado para conectar o relacionamento ao comercial, dentro do mesmo ERP.'],
    ['Existem relatórios e dashboards de relacionamento?', 'Sim. Há dashboard de oportunidades, relatório de contatos por mês, quantidade de contatos por situação e por vendedor, e mapeamento de clientes.'],
  ],
};

M.ecommerce = {
  key: 'ecommerce', slug: 'ecommerce', name: 'E-commerce e Marketplaces', icon: 'i-ecommerce', group: 'vendas',
  short: 'Operação conectada a Shopee e Mercado Livre.',
  needShort: 'Shopee, Mercado Livre e pedidos',
  kicker: 'Integração com marketplaces',
  seoTitle: 'ERP com Shopee e Mercado Livre | Infoline',
  seoDesc: 'Integre Shopee e Mercado Livre ao ERP: pedidos, estoque, faturamento e repasses das plataformas conectados ao comercial e ao financeiro.',
  h1: 'Venda em Shopee e Mercado Livre sem separar o digital da gestão.',
  lead: 'O e-commerce integrável aproxima pedidos de marketplace do comercial, estoque, fiscal e financeiro, mantendo o backoffice conectado aos canais digitais.',
  overview: [
    'A Área de E-commerce e Marketplaces conecta a operação digital à gestão empresarial. Os pedidos de canais como Shopee e Mercado Livre podem ser acompanhados junto ao comercial, estoque, faturamento e financeiro.',
    'Produtos, anúncios, pedidos e repasses das plataformas ficam mais próximos do backoffice, reduzindo a necessidade de controles paralelos e trazendo mais consistência para a operação multicanal.',
  ],
  features: ['Integração com Shopee', 'Integração com Mercado Livre', 'Pedidos de marketplace', 'Anúncios e produtos', 'Repasses das plataformas', 'Integração com estoque e faturamento'],
  catalogTitle: 'Do anúncio ao repasse, dentro do ERP.',
  groups: [
    ['Canais', ['Marketplaces', 'Gerenciador E-commerce', 'Anúncios Marketplace', 'Pedido Marketplace']],
    ['Operação', ['Consulta Produto Disponível', 'Pedido de Venda', 'Consulta Estoque', 'Repasse das Plataformas para o Bling']],
    ['Acompanhamento', ['Repasses Marketplace', 'Vendas Diárias por Produto', 'Relatório de Faturamento Consolidado', 'Integrações']],
  ],
  photo: { img: 'mod-ecommerce', ratio: [1672, 940], alt: 'Empreendedora embala pedidos em uma bancada com caixas, notebook e estúdio de fotos' },
  hero: 'ecommerce',
  action: {
    type: 'flow', title: 'O pedido do marketplace segue o mesmo caminho do pedido de balcão.',
    text: 'Os canais digitais entram no ERP e passam pelas mesmas rotinas de estoque, faturamento e financeiro.',
    steps: [
      ['Anúncios e produtos', 'Gerenciador de e-commerce e anúncios de marketplace no ERP.'],
      ['Pedido de marketplace', 'Pedidos de Shopee e Mercado Livre acompanhados junto ao comercial.'],
      ['Estoque e faturamento', 'Consulta de estoque e faturamento na mesma base do restante da operação.'],
      ['Repasse das plataformas', 'Repasses do marketplace acompanhados no financeiro.'],
    ],
  },
  cta: 'Conecte marketplace e backoffice.',
  faq: [
    ['Quais marketplaces o Infoline integra?', 'A integração cobre canais como Shopee e Mercado Livre.'],
    ['Os pedidos de marketplace chegam ao comercial e ao estoque?', 'Sim. Os pedidos podem ser acompanhados junto ao comercial, estoque, faturamento e financeiro, reduzindo controles paralelos.'],
    ['É possível acompanhar repasses e vendas por produto?', 'Sim. O módulo traz repasses de marketplace, vendas diárias por produto e relatório de faturamento consolidado.'],
  ],
};

M.financeiro = {
  key: 'financeiro', slug: 'financeiro', name: 'Financeiro', icon: 'i-financeiro', group: 'financas',
  short: 'Títulos, caixa, bancos, cobrança e conciliação.',
  needShort: 'Contas, fluxo de caixa e CNAB',
  kicker: 'ERP financeiro',
  seoTitle: 'ERP Financeiro: Caixa, Cobrança e Bancos | Infoline',
  seoDesc: 'ERP financeiro com contas a pagar e receber, fluxo de caixa previsto e realizado, conciliação bancária e cobrança por CNAB, integrado à operação.',
  h1: 'ERP financeiro: transforme movimento financeiro em visão de caixa.',
  lead: 'Contas a pagar, contas a receber, previsões, cobrança, bancos e conciliação em um fluxo que recebe os dados da operação.',
  overview: [
    'A Área Financeira integra as movimentações monetárias da empresa, com contas a pagar e a receber, previsões e acompanhamento do fluxo de caixa. Isso oferece uma visão clara da posição financeira para apoiar decisões do dia a dia.',
    'Contas correntes, emissão de cheques e conciliação bancária podem ser administradas de forma centralizada. A integração bancária por CNAB, com remessa e retorno, reduz lançamentos manuais e torna as rotinas de cobrança mais ágeis.',
    'A consulta de portadores permite acompanhar saldo anterior, entradas, saídas e saldo atual dos bancos e caixas. A busca pode considerar movimento, documento, período e faixa de valor, facilitando encontrar o que precisa sem percorrer informações desnecessárias.',
    'Nas rotinas de contas a pagar e a receber, é possível filtrar títulos por vencimento, emissão, portador, situação, representante, grupo e valor. A visualização reúne os títulos para apoiar a conferência, as baixas e as liquidações.',
  ],
  features: ['Contas a pagar e receber', 'Baixas e liquidações', 'Fluxo de caixa previsto e realizado', 'Conciliação bancária', 'Remessa e retorno de cobrança'],
  catalogTitle: 'Movimento financeiro virando visão de caixa.',
  groups: [
    ['Títulos', ['Contas a Pagar', 'Contas a Receber', 'Baixa de Títulos a Pagar', 'Baixa de Títulos a Receber', 'Fatura a Pagar', 'Fatura a Receber']],
    ['Caixa e bancos', ['Fluxo de Caixa Previsto', 'Fluxo de Caixa Realizado', 'Conciliação Bancária', 'Movimentos de Caixas e Bancos', 'Portadores (Bancos e Caixas)']],
    ['Cobrança', ['Planejar Cobranças', 'Gerar arquivo de Remessa a partir do Financeiro', 'Gerenciar Arquivos Retorno de Cobrança Bancária', 'Remessa de Boletos', 'Títulos em aberto por Período']],
  ],
  photo: { img: 'mod-financeiro', ratio: [1672, 941], alt: 'Gestor financeiro analisa relatórios com gráficos de fluxo de caixa no monitor' },
  hero: 'financeiro',
  action: {
    type: 'flow', title: 'Quando surge uma movimentação, você sabe onde olhar.',
    text: 'O financeiro deixa de ser um conjunto de telas isoladas. A navegação aproxima a consulta do saldo, o título a pagar ou receber, as baixas, a conciliação e o fluxo de caixa.',
    steps: [
      ['Portadores', 'Saldo, entradas, saídas e histórico de bancos e caixas.'],
      ['Contas', 'Títulos a pagar e receber, vencimentos, baixas e liquidações.'],
      ['Caixa', 'Visão prevista e realizada para acompanhar a posição financeira.'],
      ['Cobrança', 'Remessa, retorno e acompanhamento de boletos.'],
    ],
    impact: [
      ['Enxergue o saldo e os movimentos', 'Consulte portadores, como bancos e caixas, e acompanhe entradas, saídas e saldo atual com filtros por período, documento, tipo de movimento e faixa de valor.'],
      ['Controle o que entra e o que vence', 'Visualize contas a receber e contas a pagar, acompanhe títulos em aberto e encontre rapidamente as rotinas de baixa, liquidação e fatura.'],
      ['Planeje antes de movimentar', 'Compare fluxo de caixa previsto e realizado para entender os compromissos da operação e tomar decisões com mais contexto.'],
      ['Conecte banco e cobrança', 'Use conciliação bancária e rotinas de remessa e retorno de cobrança para reduzir consultas dispersas e lançamentos manuais.'],
    ],
    impactTitle: 'Menos procura. Mais clareza para decidir.',
  },
  cta: 'Conecte o caixa à operação: peça uma demonstração.',
  faq: [
    ['O Infoline faz conciliação bancária e cobrança por CNAB?', 'Sim. A conciliação bancária é feita no próprio módulo, e a integração bancária por CNAB, com remessa e retorno, reduz lançamentos manuais e agiliza as rotinas de cobrança.'],
    ['Consigo ver o fluxo de caixa previsto e o realizado?', 'Sim. O módulo traz fluxo de caixa previsto e realizado, para comparar os compromissos da operação com o que de fato aconteceu.'],
    ['Como consulto o saldo de bancos e caixas?', 'Pela consulta de portadores, que mostra saldo anterior, entradas, saídas e saldo atual, com busca por movimento, documento, período e faixa de valor.'],
  ],
};

M.whatsapp = {
  key: 'whatsapp', slug: 'integracao-whatsapp', name: 'Integração WhatsApp', icon: 'i-whatsapp', group: 'financas',
  short: 'Envio automático de boletos e mensagens com acompanhamento.',
  needShort: 'Boletos automatizados pelo WhatsApp',
  kicker: 'Integração WhatsApp',
  seoTitle: 'Boletos pelo WhatsApp Integrado ao ERP | Infoline',
  seoDesc: 'Envio automático de boletos pelo WhatsApp a partir do ERP, com link de acesso e acompanhamento dos status enviado, entregue e lido.',
  h1: 'Envie boletos aos clientes automaticamente, pelo canal que eles já usam.',
  lead: 'O Infoline integra a rotina financeira ao WhatsApp para enviar mensagens com o boleto e o link de acesso, registrar o resultado do envio e facilitar o acompanhamento da cobrança.',
  overview: [
    'A Integração WhatsApp aproxima a cobrança da rotina financeira ao automatizar o envio de boletos e mensagens para os clientes. A comunicação ganha velocidade sem depender de processos manuais repetitivos.',
    'Com o acompanhamento das mensagens e da situação dos envios, a empresa consegue organizar melhor a rotina de cobrança e oferecer uma experiência mais prática para quem recebe o boleto.',
  ],
  features: ['Envio automático de boletos', 'Mensagem com documento, parcela e link do boleto', 'Acompanhamento enviado, entregue e lido', 'Consulta por período, telefone ou mensagem', 'Registro de falhas e motivo do não envio', 'Tratamento de cliente sem número válido'],
  catalogTitle: 'Cobrança mais rápida, acompanhamento mais claro.',
  groups: [
    ['Automação financeira', ['Boleto referente ao documento', 'Parcela e série na mensagem', 'Link para acesso ao PDF', 'Envio a partir da rotina de cobrança']],
    ['Acompanhamento', ['Mensagens de WhatsApp', 'Status enviado', 'Status entregue', 'Status lido', 'Pesquisa por data inicial e final']],
    ['Controle de exceções', ['Número de WhatsApp inválido', 'Cliente sem número cadastrado', 'Mensagem não enviada com motivo registrado', 'Reenvio após correção do cadastro']],
  ],
  photo: { img: 'mod-whatsapp', ratio: [1672, 941], alt: 'Profissional confere um boleto impresso enquanto o celular exibe a mensagem enviada' },
  hero: 'whatsapp',
  action: {
    type: 'screen', title: 'Cobrança acompanhável pelo WhatsApp',
    text: 'A tela de mensagens permite filtrar por período, telefone ou texto, visualizar o histórico e acompanhar o status de cada envio. Quando não há número válido, o sistema registra o motivo para a equipe corrigir o cadastro.',
    screen: {
      title: 'Cobrança acompanhável pelo WhatsApp',
      text: 'A tela de mensagens permite filtrar por período, telefone ou texto, visualizar o histórico e acompanhar o status de cada envio. Quando não há número válido, o sistema registra o motivo para a equipe corrigir o cadastro.',
      kind: 'whatsapp',
    },
    steps: [
      ['Título em cobrança', 'A rotina financeira identifica o boleto a enviar.'],
      ['Mensagem automática', 'Documento, parcela e link de acesso ao PDF do boleto na mensagem.'],
      ['Status do envio', 'Enviado, entregue e lido, consultáveis por período, telefone ou texto.'],
      ['Exceções tratadas', 'Número inválido ou ausente fica registrado, com reenvio após a correção.'],
    ],
  },
  cta: 'Envie a cobrança pelo canal que o cliente já acompanha.',
  faq: [
    ['Como funciona o envio de boletos por WhatsApp?', 'O Infoline integra a rotina financeira ao WhatsApp e envia ao cliente uma mensagem com o boleto e o link de acesso, informando documento e parcela.'],
    ['Consigo saber se o cliente recebeu e leu a mensagem?', 'Sim. O acompanhamento mostra o status de cada envio: enviado, entregue e lido, com consulta por período, telefone ou texto da mensagem.'],
    ['O que acontece se o cliente não tem um número válido?', 'O sistema registra o motivo do não envio, como número inválido ou cliente sem número cadastrado. Depois que o cadastro é corrigido, a mensagem pode ser reenviada.'],
    ['A integração parte da rotina financeira?', 'Sim. O título em cobrança dá origem à mensagem com o boleto, aproximando a comunicação com o cliente da rotina financeira já registrada no ERP.'],
    ['Quais informações acompanham a mensagem?', 'A mensagem pode identificar o documento e a parcela e incluir o link de acesso ao PDF do boleto.'],
    ['É possível consultar o histórico dos envios?', 'Sim. A consulta pode ser feita por período, telefone ou texto da mensagem, junto aos estados registrados para cada envio.'],
  ],
};

M.contabilidade = {
  key: 'contabilidade', slug: 'contabilidade', name: 'Fiscal e Contábil', icon: 'i-contabilidade', group: 'financas',
  short: 'Escrituração, livros, impostos e obrigações integrados.',
  needShort: 'Escrituração, livros e obrigações fiscais',
  kicker: 'ERP fiscal e contábil',
  seoTitle: 'ERP Fiscal e Contábil: SPED, Sintegra e Livros | Infoline',
  seoDesc: 'ERP fiscal e contábil com apuração de impostos, livros fiscais, Sintegra, Valida-PR, SPED Fiscal, CIAP, DRE e balancete integrados à operação.',
  h1: 'ERP fiscal e contábil: a informação nasce na operação e chega organizada à contabilidade.',
  lead: 'Lançamentos, livros, impostos, arquivos fiscais, patrimônio e demonstrativos conectados aos movimentos do ERP.',
  overview: [
    'A Área Fiscal e Contábil reúne as rotinas de escrituração e o atendimento às obrigações fiscais da empresa. O sistema permite controlar lotes de lançamentos contábeis e utilizar estruturas alternativas de balanços e balancetes para análises sob diferentes perspectivas.',
    'Na parte fiscal, contempla livros de entrada e saída, termos de abertura e encerramento, geração de arquivos Sintegra e Valida-PR e apuração integrada de impostos. Também apoia o controle patrimonial e o CIAP, ampliando a rastreabilidade dos créditos fiscais.',
  ],
  features: ['Lançamentos e contabilização', 'Apuração de impostos', 'Livros fiscais', 'Sintegra, Valida-PR e SPED', 'CIAP e ativo imobilizado', 'DRE, balanço e balancete'],
  catalogTitle: 'Da escrituração às obrigações.',
  groups: [
    ['Escrituração', ['Lançamentos', 'Diário', 'Razão Analítico', 'Contabilização por Período', 'Refazer contabilizações de Faturamento e Recebimento']],
    ['Fiscal', ['Apuração de Impostos', 'Emissão de Livros', 'Geração de arquivo para Sintegra / Valida-PR', 'Geração de arquivo para Sped Fiscal', 'EFD-Reinf']],
    ['Patrimônio e análise', ['Ativo Imobilizado', 'Depreciação', 'Demonstrativos Contábeis - (DRE, Balanço Patrimonial, etc.)', 'Balancete']],
  ],
  photo: { img: 'mod-contabilidade', ratio: [1536, 1024], alt: 'Contador registra lançamentos em um livro ao lado de uma calculadora e relatórios' },
  hero: 'contabilidade',
  action: {
    type: 'flow', title: 'Da operação à obrigação, sem redigitar.',
    text: 'Compras, vendas, folha e movimentos financeiros geram a contabilização. A partir dela, o fiscal apura impostos e emite livros e arquivos.',
    steps: [
      ['Operação', 'Compras, vendas, folha e financeiro registram os movimentos no ERP.'],
      ['Contabilização', 'Lançamentos por período e lotes de lançamentos contábeis.'],
      ['Apuração de impostos', 'Apuração integrada, com controle patrimonial e CIAP.'],
      ['Livros e arquivos', 'Livros de entrada e saída, Sintegra, Valida-PR, SPED Fiscal e EFD-Reinf.'],
      ['Demonstrativos', 'DRE, balanço patrimonial e balancete, inclusive em estruturas alternativas.'],
    ],
  },
  cta: 'Deixe a informação fiscal nascer na operação.',
  faq: [
    ['O Infoline gera arquivos Sintegra, Valida-PR e SPED?', 'Sim. O módulo fiscal gera arquivos Sintegra e Valida-PR e o SPED Fiscal, além de contemplar a EFD-Reinf e a emissão de livros fiscais de entrada e saída.'],
    ['O sistema controla CIAP e ativo imobilizado?', 'Sim. O módulo apoia o controle patrimonial e o CIAP, ampliando a rastreabilidade dos créditos fiscais, com ativo imobilizado e depreciação.'],
    ['Quais demonstrativos contábeis estão disponíveis?', 'DRE, balanço patrimonial e balancete, com opção de estruturas alternativas de balanços e balancetes para análises sob diferentes perspectivas.'],
  ],
};

M.controladoria = {
  key: 'controladoria', slug: 'controladoria', name: 'Controladoria', icon: 'i-controladoria', group: 'financas',
  short: 'Resultado gerencial, DRE, rentabilidade e visão para decidir.',
  needShort: 'Resultado, margem e decisões estratégicas',
  kicker: 'Controladoria',
  seoTitle: 'Controladoria: Resultado Gerencial e Rentabilidade | Infoline',
  seoDesc: 'Controladoria integrada ao ERP com dashboards gerenciais, DRE, centros de custo, resultado por grupo de contabilização e rentabilidade por projeto.',
  h1: 'Controladoria: enxergue onde o resultado acontece e onde ele muda.',
  lead: 'Cruze receitas, custos, centros e demonstrativos para acompanhar resultado, margem e rentabilidade com contexto gerencial.',
  overview: [
    'A Controladoria reúne Dashboard Diretor e Dashboard Gestor, resultado por grupo de contabilização, resultado bruto sobre vendas, centros de custo e rentabilidade por projeto para apoiar a análise gerencial.',
    'DRE, balanço, balancete e fluxo de caixa realizado complementam essa leitura e ajudam a entender o resultado sob diferentes perspectivas.',
  ],
  features: ['Dashboards gerenciais', 'Resultado por grupo', 'Resultado bruto sobre vendas', 'Centros de custo', 'DRE e balanço', 'Rentabilidade por projeto'],
  catalogTitle: 'Resultado, centros e demonstrativos no mesmo lugar.',
  groups: [
    ['Visão gerencial', ['Dashboard Diretor', 'Dashboard Gestor', 'Resultado por Grupo de Contabilização', 'Resultado Bruto Sobre Vendas']],
    ['Custos', ['Custos Gerais', 'Centro de Custo', 'Resumo de Rentabilidade por projeto', 'Relatório de Markup']],
    ['Demonstrativos', ['Demonstrativos Contábeis - (DRE, Balanço Patrimonial, etc.)', 'Balancete', 'Fluxo de Caixa Realizado']],
  ],
  photo: { img: 'mod-controladoria', ratio: [1672, 941], alt: 'Equipe de controladoria analisa peças e relatórios em torno de uma mesa de reunião' },
  hero: 'controladoria',
  action: {
    type: 'dash', title: 'Uma visão para quem dirige e outra para quem gerencia.',
    text: 'Os dashboards reúnem custos, resultado e demonstrativos, para que a decisão parta do que a operação de fato registrou.',
    steps: [
      ['Dashboard Diretor', 'Visão estratégica do resultado, com demonstrativos contábeis e fluxo de caixa realizado.'],
      ['Dashboard Gestor', 'Visão de acompanhamento: resultado bruto sobre vendas, centro de custo e rentabilidade por projeto.'],
    ],
  },
  cta: 'Veja onde o resultado acontece e onde ele muda.',
  faq: [
    ['Qual é a diferença entre Gestão de Custos e Controladoria?', 'Gestão de Custos explica quanto custa produzir e vender um produto. A Controladoria usa custos, receitas, centros, DRE e demais demonstrativos para analisar o resultado gerencial da empresa.'],
    ['Existem dashboards gerenciais?', 'Sim. O módulo traz o Dashboard Diretor e o Dashboard Gestor, além de resultado por grupo de contabilização e resultado bruto sobre vendas.'],
    ['Consigo ver a rentabilidade por projeto?', 'Sim. O módulo inclui resumo de rentabilidade por projeto, relatório de markup e centros de custo.'],
    ['Quais demonstrativos apoiam a análise?', 'A Controladoria reúne DRE, balanço patrimonial, balancete e fluxo de caixa realizado para apoiar a leitura gerencial do resultado.'],
  ],
};

M.rh = {
  key: 'rh', slug: 'rh', name: 'Recursos Humanos', icon: 'i-rh', group: 'pessoas',
  short: 'Folha, ponto, benefícios e obrigações de pessoal.',
  needShort: 'Folha, ponto e obrigações trabalhistas',
  kicker: 'RH e folha de pagamento',
  seoTitle: 'Folha de Pagamento e RH Integrado ao ERP | Infoline',
  seoDesc: 'Folha de pagamento, ponto eletrônico, benefícios e obrigações como eSocial, CAGED, RAIS, DIRF e SEFIP integrados ao ERP Infoline.',
  h1: 'RH e folha de pagamento: as rotinas de pessoas dentro da gestão empresarial.',
  lead: 'Folha, colaboradores, ponto, benefícios e obrigações acessórias em uma visão integrada.',
  overview: [
    'A Área de Recursos Humanos reúne recursos para a gestão de pessoas e a administração de pessoal. A folha de pagamento, a emissão de holerites e a geração de obrigações como CAGED, SEFIP, DIRF e RAIS ficam centralizadas no mesmo ambiente.',
    'A integração com ponto eletrônico facilita o controle de jornada e o cumprimento das exigências legais. O módulo também contempla participação nos resultados, saúde e segurança do trabalho e pesquisas de clima, apoiando uma gestão mais próxima das pessoas.',
  ],
  features: ['Cadastro de colaboradores', 'Folha e cálculos', 'Ponto eletrônico', 'Benefícios', 'CAGED, DIRF, RAIS e SEFIP', 'eSocial'],
  catalogTitle: 'Pessoas, folha e obrigações no mesmo ambiente.',
  groups: [
    ['Pessoas', ['Cadastro de Colaboradores', 'Cadastro de Colaboradores Completo', 'Cadastro de Cargos Vendedores Internos', 'Cadastro de Horários']],
    ['Folha e obrigações', ['Cálculos', 'Provisões de Folha', 'Eventos Contabilizados Folha', 'Caged', 'Dirf', 'Rais', 'Sefip', 'ESocial']],
    ['Benefícios e acompanhamento', ['Benefícios', 'Informe de rendimento', 'Ocorrências de Exposições de Agentes Nocivos']],
  ],
  photo: { img: 'mod-rh', ratio: [1672, 941], alt: 'Equipe de RH reunida em torno de um notebook em um escritório claro' },
  hero: 'rh',
  action: {
    type: 'chips', title: 'Obrigações e integrações de pessoal, no mesmo ambiente.',
    text: 'A folha se conecta ao ponto eletrônico e à contabilidade, e as obrigações acessórias são geradas a partir do que está cadastrado.',
    chips: ['Folha de pagamento', 'Holerites', 'Ponto eletrônico', 'eSocial', 'CAGED', 'RAIS', 'DIRF', 'SEFIP', 'Benefícios', 'Participação nos resultados', 'Saúde e segurança do trabalho', 'Pesquisa de clima'],
  },
  cta: 'Traga folha, jornada e obrigações para dentro do ERP.',
  faq: [
    ['O RH gera obrigações como eSocial, CAGED, RAIS, DIRF e SEFIP?', 'Sim. A folha de pagamento, a emissão de holerites e a geração de obrigações como CAGED, SEFIP, DIRF e RAIS ficam centralizadas no mesmo ambiente, e o módulo contempla o eSocial.'],
    ['O módulo integra com ponto eletrônico?', 'Sim. A integração com ponto eletrônico facilita o controle de jornada e o cumprimento das exigências legais.'],
    ['O que mais o módulo de RH contempla?', 'Participação nos resultados, saúde e segurança do trabalho, benefícios e pesquisas de clima organizacional, além do cadastro completo de colaboradores.'],
    ['O módulo possui cadastro completo de colaboradores e horários?', 'Sim. O RH contempla cadastro de colaboradores, cadastro completo de colaboradores, cargos e horários, reunindo as informações usadas nas rotinas de pessoal.'],
    ['A folha possui provisões e integração contábil?', 'Sim. Entre as rotinas disponíveis estão provisões de folha e eventos contabilizados da folha. Esses eventos permitem conectar a rotina de pessoal à Contabilidade.'],
    ['O RH acompanha informações relacionadas à saúde e segurança?', 'Sim. O conteúdo atual contempla saúde e segurança do trabalho e registros relacionados à exposição a agentes nocivos.'],
  ],
};

M.processos = {
  key: 'processos', slug: 'gestao-processos', name: 'Gestão de Processos', icon: 'i-processos', group: 'pessoas',
  short: 'Workflows automatizados para padronizar e acompanhar cada etapa.',
  needShort: 'Workflows e padronização de atividades',
  kicker: 'Gestão de processos',
  seoTitle: 'Gestão de Processos e Workflows | Infoline',
  seoDesc: 'Gestão de processos com workflows automatizados: defina, monitore e padronize o fluxo de tarefas entre as áreas da empresa no ERP Infoline.',
  h1: 'Gestão de processos: workflows para padronizar e acompanhar cada etapa.',
  lead: 'Com workflows automatizados, a empresa controla e padroniza as atividades: cada etapa é executada no tempo certo e na sequência correta.',
  overview: [
    'A Gestão de Processos, por meio da implementação de workflows automatizados, garante o controle e a padronização das atividades dentro da empresa. A ferramenta permite definir, monitorar e otimizar o fluxo de tarefas.',
    'Com isso, reduz-se a margem de erro, aumenta-se a eficiência operacional e facilita-se o acompanhamento dos processos, promovendo mais transparência e agilidade na tomada de decisão.',
  ],
  features: ['Workflows automatizados', 'Definição e monitoramento do fluxo de tarefas', 'Padronização das atividades', 'Etapas na sequência e no tempo certos', 'Acompanhamento dos processos', 'Transparência para a tomada de decisão'],
  catalogTitle: null,
  groups: [],
  photo: { img: 'mod-processos', ratio: [1254, 1254], alt: 'Equipe reunida em torno de uma mesa analisando fluxos de trabalho e indicadores' },
  hero: 'processos',
  action: {
    type: 'flow', title: 'Definir, executar, monitorar e otimizar.',
    text: 'O workflow transforma uma rotina que dependia de lembrança em um fluxo com etapas, responsáveis e acompanhamento.',
    steps: [
      ['Definir', 'O fluxo de tarefas é desenhado com suas etapas e sequência.'],
      ['Executar', 'Cada etapa é executada no tempo certo e na sequência correta.'],
      ['Monitorar', 'Acompanhamento dos processos, com transparência sobre o andamento.'],
      ['Otimizar', 'Menos margem de erro e mais eficiência operacional a cada ciclo.'],
    ],
  },
  cta: 'Tire o processo da memória e coloque cada etapa no fluxo.',
  faq: [
    ['O que é a gestão de processos do Infoline?', 'É a implementação de workflows automatizados que garantem o controle e a padronização das atividades, permitindo definir, monitorar e otimizar o fluxo de tarefas.'],
    ['Que problemas ela ajuda a evitar?', 'A margem de erro e o retrabalho, ao garantir que cada etapa seja executada no tempo certo e na sequência correta, com mais transparência para a tomada de decisão.'],
    ['Ela se conecta a outras áreas do ERP?', 'Sim. Os fluxos de trabalho também aparecem no CRM, apoiando as etapas internas do atendimento comercial.'],
    ['É possível definir a sequência de um processo?', 'Sim. O workflow organiza o fluxo de tarefas em etapas e permite que elas sejam executadas na sequência definida para a rotina.'],
    ['O processo pode ser acompanhado durante a execução?', 'Sim. Monitoramento e acompanhamento fazem parte da Gestão de Processos, oferecendo mais transparência sobre o andamento das atividades.'],
    ['O workflow ajuda a padronizar a forma de trabalhar?', 'Sim. A padronização das atividades reduz variações na execução e ajuda cada etapa a acontecer de acordo com o fluxo definido.'],
  ],
};

export const modules = M;
export const moduleOrder = Object.keys(M);
export const moduleBySlug = Object.fromEntries(Object.values(M).map(m => [m.slug, m]));

// ---------------------------------------------------------------------------
// LIGAÇÕES ENTRE MÓDULOS (ecossistema + "Conecta com")
// Cada ligação tem base em texto real dos módulos (ver comentários)
// ---------------------------------------------------------------------------
export const links = [
  ['comercial', 'wms', 'Pedido de separação e montagem de carga'],      // WMS: Pedido Separação / Montagem de Cargas
  ['wms', 'comercial', 'Cargas processadas geram faturamento'],          // WMS: "processá-las e gerar o faturamento"
  ['comercial', 'financeiro', 'Movimentações comerciais no financeiro'],  // Comercial: integradas ao financeiro
  ['comercial', 'contabilidade', 'Notas e impostos da venda'],            // Comercial: integradas ao contábil e fiscal
  ['crm', 'comercial', 'Relacionamento conectado ao comercial'],          // CRM: "conectando o relacionamento ao comercial"
  ['ecommerce', 'comercial', 'Pedidos de marketplace junto ao comercial'],
  ['ecommerce', 'wms', 'Consulta de estoque'],                            // E-commerce: Consulta Estoque
  ['ecommerce', 'financeiro', 'Repasses das plataformas'],                // E-commerce: Repasses Marketplace
  ['compras', 'wms', 'Entrada de materiais atualiza o estoque'],          // Compras: entradas mantêm o estoque atualizado
  ['compras', 'financeiro', 'Impacto financeiro do recebimento'],         // Compras: impactos financeiro
  ['compras', 'contabilidade', 'Impactos fiscal, contábil e patrimonial'],
  ['pcpm', 'compras', 'Necessidade de materiais'],                        // PCPM: MRP necessidade de materiais
  ['pcpm', 'custos', 'Máquinas e estrutura de produto'],                  // Custos: Cadastro de Máquinas / Estrutura Produtos
  ['custos', 'controladoria', 'Custos e formação de preço'],
  ['custos', 'comercial', 'Tabela de preço a partir da margem'],          // item comum aos dois módulos
  ['controladoria', 'contabilidade', 'DRE e demonstrativos'],
  ['financeiro', 'controladoria', 'Fluxo de caixa realizado'],
  ['financeiro', 'contabilidade', 'Movimentos financeiros na contabilização'],
  ['financeiro', 'whatsapp', 'Envio de boletos ao cliente'],
  ['rh', 'contabilidade', 'Eventos contabilizados da folha'],            // RH: Eventos Contabilizados Folha
  ['processos', 'crm', 'Workflows do atendimento'],                       // CRM: "fluxos de trabalho"
];

export function relatedOf(key) {
  const out = new Map();
  for (const [a, b, label] of links) {
    if (a === key && !out.has(b)) out.set(b, { key: b, label, dir: 'out' });
    if (b === key && !out.has(a)) out.set(a, { key: a, label, dir: 'in' });
  }
  return [...out.values()];
}

// ---------------------------------------------------------------------------
// NECESSIDADES  (problema -> capacidade real -> resultado operacional)
// ---------------------------------------------------------------------------
export const needs = [
  {
    key: 'producao', label: 'Produção', icon: 'i-pcpm',
    question: 'A produção é difícil de planejar e de acompanhar?',
    what: ['MRP para calcular a necessidade de materiais', 'Ordens de produção planejadas, firmadas e encerradas', 'Carga e restrições de máquina', 'Apontamentos, desvios e saldo a produzir'],
    outcome: 'Você compara o que foi planejado com o que já foi produzido e enxerga o saldo que ainda precisa ser executado.',
    modules: ['pcpm', 'custos'],
  },
  {
    key: 'estoque', label: 'Estoque e logística', icon: 'i-wms',
    question: 'Falta visibilidade de onde cada item está no estoque?',
    what: ['Endereçamento por armazém, rua e prateleira', 'Inventário cíclico e contagem física', 'Leitura por código de barras e etiquetas', 'Rastreabilidade de lotes'],
    outcome: 'Cada item fica localizável e cada movimentação, rastreável, da separação até a expedição.',
    modules: ['wms'],
  },
  {
    key: 'vendas', label: 'Vendas', icon: 'i-comercial',
    question: 'Preço, pedido e carteira de clientes estão em lugares diferentes?',
    what: ['Tabelas de preço e orçamentos personalizados', 'Pedido de venda que atualiza o estoque', 'Histórico de contatos e funil de oportunidades', 'Pedidos de Shopee e Mercado Livre junto ao comercial'],
    outcome: 'O pedido segue para estoque, faturamento e financeiro sem retrabalho, e o relacionamento fica registrado.',
    modules: ['comercial', 'crm', 'ecommerce'],
  },
  {
    key: 'financeiro', label: 'Financeiro e cobrança', icon: 'i-financeiro',
    question: 'O financeiro está desconectado das vendas e das compras?',
    what: ['Contas a pagar e a receber, com baixas e liquidações', 'Fluxo de caixa previsto e realizado', 'Conciliação bancária e CNAB (remessa e retorno)', 'Boletos enviados automaticamente pelo WhatsApp'],
    outcome: 'As movimentações da operação chegam ao financeiro e a posição de caixa fica visível para decidir.',
    modules: ['financeiro', 'whatsapp'],
  },
  {
    key: 'compras', label: 'Compras', icon: 'i-compras',
    question: 'Falta visão do que já foi pedido e do que ainda vai chegar?',
    what: ['Solicitação, cotação e pedido de compra', 'Localização automática de NF-e e importação de XML e CT-e', 'Agendamento de recebimento', 'Entregas de compras em aberto'],
    outcome: 'A entrada mantém o estoque atualizado e reflete nos impactos fiscal, contábil, patrimonial e financeiro.',
    modules: ['compras'],
  },
  {
    key: 'custos', label: 'Custos e preço', icon: 'i-custos',
    question: 'O preço de venda tem um custo real por trás?',
    what: ['Hora máquina, hora homem e insumos', 'Custo estrutural, custo ABC e custo real', 'Tabela de preço a partir da margem', 'Markup e rentabilidade por projeto'],
    outcome: 'Preços definidos com base no custo real de cada atividade, com rentabilidade visível.',
    modules: ['custos', 'controladoria'],
  },
  {
    key: 'fiscal', label: 'Fiscal e Contábil', icon: 'i-contabilidade',
    question: 'A informação fiscal chega à contabilidade tarde e em outro formato?',
    what: ['Apuração de impostos integrada', 'Livros fiscais, Sintegra, Valida-PR e SPED Fiscal', 'CIAP e ativo imobilizado', 'DRE, balanço patrimonial e balancete'],
    outcome: 'A informação fiscal nasce na operação e chega organizada à contabilidade.',
    modules: ['contabilidade', 'compras'],
  },
  {
    key: 'pessoas', label: 'Pessoas', icon: 'i-rh',
    question: 'Folha, ponto e obrigações estão em ferramentas separadas?',
    what: ['Folha de pagamento e holerites', 'Integração com ponto eletrônico', 'eSocial, CAGED, DIRF, RAIS e SEFIP', 'Benefícios e saúde e segurança do trabalho'],
    outcome: 'As rotinas de pessoas ficam dentro da gestão empresarial, no mesmo ambiente do restante da operação.',
    modules: ['rh'],
  },
  {
    key: 'processos', label: 'Processos', icon: 'i-processos',
    question: 'Atividades dependem de alguém lembrar qual é a próxima etapa?',
    what: ['Workflows automatizados', 'Definição e monitoramento do fluxo de tarefas', 'Etapas na sequência e no tempo certos', 'Acompanhamento e transparência dos processos'],
    outcome: 'Cada etapa é executada no tempo certo e na sequência correta, com menos margem de erro.',
    modules: ['processos', 'crm'],
  },
];

// ---------------------------------------------------------------------------
// VEJA O INFOLINE EM AÇÃO  (fluxos validados contra os módulos reais)
// ---------------------------------------------------------------------------
export const demos = [
  {
    key: 'venda', tab: 'Da venda ao caixa', module: 'comercial',
    title: 'Um pedido de venda atravessa a empresa inteira.',
    steps: [
      ['Orçamento', 'Preço definido pela tabela ou pela margem, com proposta personalizada.'],
      ['Pedido de venda', 'Entregas programadas conforme a demanda.'],
      ['Estoque', 'Cada pedido emitido atualiza automaticamente o estoque.'],
      ['Faturamento', 'O pedido segue para a rotina de faturamento e emissão fiscal.'],
      ['Financeiro e fiscal', 'Movimentos integrados aos módulos financeiro, contábil e fiscal.'],
    ],
  },
  {
    key: 'producao', tab: 'Produção', module: 'pcpm',
    title: 'Do planejamento à ordem apontada.',
    steps: [
      ['Estrutura e roteiro', 'Produtos, processos e máquinas cadastrados pela engenharia.'],
      ['MRP', 'Necessidade de materiais para atender as ordens de produção.'],
      ['Ordem de produção', 'Ordens planejadas, firmadas e encerradas.'],
      ['Carga de máquina', 'Alocação de recursos considerando restrições de máquina.'],
      ['Apontamento', 'Produzido, desvios e saldo a produzir.'],
    ],
  },
  {
    key: 'armazem', tab: 'Armazém', module: 'wms',
    title: 'Do endereço da prateleira à carga expedida.',
    steps: [
      ['Endereçamento', 'Armazém, rua, prateleira e demais níveis de localização.'],
      ['Pedido de separação', 'Reservas e planejamento logístico organizam a separação.'],
      ['Packing', 'Conferência do pedido, etiquetas de volume e código de barras.'],
      ['Montagem de carga', 'Pedidos vinculados, volume e situação da carga.'],
      ['Expedição', 'Romaneio a partir do pedido de separação e faturamento.'],
    ],
  },
  {
    key: 'caixa', tab: 'Caixa e cobrança', module: 'financeiro',
    title: 'Do saldo do banco à cobrança do título.',
    steps: [
      ['Portadores', 'Saldo anterior, entradas, saídas e saldo atual de bancos e caixas.'],
      ['Contas a pagar e receber', 'Títulos, vencimentos, baixas e liquidações.'],
      ['Fluxo de caixa', 'Visão prevista e realizada da posição financeira.'],
      ['Cobrança', 'Remessa e retorno CNAB, boletos e envio pelo WhatsApp.'],
      ['Conciliação', 'Conciliação bancária dos movimentos de caixas e bancos.'],
    ],
  },
];

// ---------------------------------------------------------------------------
// DIFERENCIAIS  (todos rastreáveis a texto real dos módulos / site atual)
// ---------------------------------------------------------------------------
export const differentials = [
  {
    title: 'O pedido conecta estoque, fiscal e financeiro',
    text: 'Na venda, cada pedido emitido atualiza automaticamente o estoque e reúne as informações que seguem para o faturamento. As movimentações se integram aos módulos financeiro, contábil e fiscal, sem redigitação.',
    module: 'comercial',
  },
  {
    title: 'Profundidade industrial no mesmo ERP',
    text: 'MRP II, carga de máquina, roteiros e apontamentos no PCPM. Endereçamento por armazém, rua e prateleira no WMS. Hora máquina, hora homem, insumos e formação de preço na Gestão de Custos.',
    module: 'pcpm',
  },
  {
    title: 'Rotinas fiscais brasileiras dentro do fluxo',
    text: 'Localização de NF-e, importação de XML e CT-e, livros fiscais, Sintegra, Valida-PR, SPED Fiscal e EFD-Reinf. A informação fiscal nasce na operação e chega organizada à contabilidade.',
    module: 'contabilidade',
  },
  {
    title: 'Cobrança que chega ao cliente e volta com status',
    text: 'Remessa e retorno CNAB, conciliação bancária e boletos enviados por WhatsApp, com acompanhamento de enviado, entregue e lido.',
    module: 'financeiro',
  },
  {
    title: 'Canais digitais dentro da gestão',
    text: 'Pedidos, anúncios e repasses de Shopee e Mercado Livre acompanhados junto ao comercial, estoque, faturamento e financeiro.',
    module: 'ecommerce',
  },
  {
    title: 'ERP online em plataforma web',
    text: 'O Infoline conecta operação e gestão em uma plataforma web desenvolvida pela empresa.',
    module: null,
  },
];

// ---------------------------------------------------------------------------
// FAQ DA HOME
// ---------------------------------------------------------------------------
export const homeFaq = [
  ['O que é o Infoline?', 'O Infoline é um ERP online integrado, desenvolvido pela Infoline Sistemas de Gestão Empresarial. Ele reúne as áreas da empresa em uma plataforma web para automatizar processos e centralizar informações.'],
  ['Quais áreas da empresa o Infoline cobre?', 'Comercial, CRM, e-commerce e marketplaces, compras, PCPM (produção), WMS (estoque e expedição), custos, controladoria, financeiro, integração WhatsApp para cobrança, Fiscal e Contábil, Recursos Humanos e Gestão de Processos.'],
  ['O Infoline atende operações industriais?', 'O Infoline possui uma área industrial completa: estrutura de produtos, roteiros, MRP II, carga de máquina, ordens e apontamentos de produção, além de WMS, custos e controladoria integrados.'],
  ['O Infoline é um sistema web?', 'Sim. O Infoline é um ERP online integrado. Em uma única plataforma web, conecta produção, estoque, compras, vendas, financeiro, fiscal e pessoas para centralizar informações e apoiar a gestão.'],
  ['Em quais regiões a Infoline atua?', 'A Infoline atende empresas em todo o Brasil. A sede fica em Curitiba, no Paraná.'],
  ['Como solicito uma demonstração?', 'Preencha o formulário desta página, chame a equipe no WhatsApp ou ligue para (41) 3014-0075. Um especialista apresenta as soluções disponíveis.'],
];

// Fatos verificáveis (faixa sob o hero)
export const facts = [
  { k: 'Desde 2001', v: 'desenvolvendo software de gestão' },
  { k: 'Uma base', v: 'informação compartilhada por toda a operação' },
  { k: 'Plataforma web', v: 'para operação, gestão e decisões' },
  { k: 'Atuação nacional', v: 'atendimento a empresas em todo o Brasil' },
];
