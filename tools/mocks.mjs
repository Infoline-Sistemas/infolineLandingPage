// Representações visuais do produto (HTML/CSS). Nenhum dado real:
// valores monetários são mascarados e nomes são genéricos.
import { esc, icon } from './lib.mjs';

const bar = (title, badge = 'Exemplo ilustrativo', badgeClass = '') =>
  `<div class="m-bar"><span class="m-dots"><i></i><i></i><i></i></span><b>${esc(title)}</b><em${badgeClass ? ` class="${esc(badgeClass)}"` : ''}>${esc(badge)}</em></div>`;
const chip = (t, cls = '') => `<span class="m-chip ${cls}">${esc(t)}</span>`;
const status = (t, cls) => `<span class="m-st ${cls}">${esc(t)}</span>`;
const mask = (n = 6) => `<span class="m-mask">${'•'.repeat(n)}</span>`;
const bars = (vals, cls = '') => `<div class="m-bars ${cls}">${vals.map(([a, b]) => `<span><i style="height:${a}%"></i>${b != null ? `<u style="height:${b}%"></u>` : ''}</span>`).join('')}</div>`;

// ---------------------------------------------------------------------------
// HERO DA HOME — fluxo integrado (Comercial → PCPM → WMS → Financeiro)
// ---------------------------------------------------------------------------
export function heroPanel() {
  const rows = [
    ['i-comercial', 'Comercial', 'Pedido de venda registrado', 'Faturado', 'ok'],
    ['i-pcpm', 'PCPM', 'Ordem de produção em andamento', 'Em produção', 'run'],
    ['i-wms', 'WMS', 'Carga em montagem para expedição', 'Em montagem', 'wait'],
    ['i-financeiro', 'Financeiro', 'Título a receber gerado', 'Integrado', 'ok'],
  ];
  return `<div class="m-win m-dark hero-ui" role="img" aria-label="Exemplo ilustrativo: um pedido percorrendo Comercial, PCPM, WMS e Financeiro no Infoline">
  ${bar('Infoline · visão da operação')}
  <ol class="hflow">
    ${rows.map(([ic, t, d, s, c], i) => `<li style="--i:${i}"><span class="hflow-ico">${icon(ic)}</span><div><b>${t}</b><small>${d}</small></div>${status(s, c)}</li>`).join('')}
  </ol>
  <div class="hero-ui-foot"><div><small>Fluxo de caixa</small><b>Previsto × Realizado</b></div>${bars([[38, 30], [52, 46], [44, 50], [66, 58], [58, 64], [78, 70]], 'm-bars-sm')}</div>
</div>`;
}

// ---------------------------------------------------------------------------
// HERO POR MÓDULO
// ---------------------------------------------------------------------------
export const heroMock = {
  pcpm: () => `<div class="m-win">
  ${bar('PCPM · Programação da produção')}
  <div class="m-body">
    <div class="m-toolbar"><span class="m-seg"><b class="on">Mês</b><b>Semana</b><b>Dia</b></span><span class="m-btn">Processar ordens</span></div>
    <div class="gantt">
      <div class="gantt-h"><span></span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span></div>
      <div class="gantt-r"><em>Máquina 01</em><i style="--s:0;--l:3;--p:100" class="g-done"></i></div>
      <div class="gantt-r"><em>Máquina 02</em><i style="--s:1;--l:3;--p:60" class="g-run"></i></div>
      <div class="gantt-r"><em>Máquina 03</em><i style="--s:2;--l:3;--p:0" class="g-plan"></i></div>
      <div class="gantt-r"><em>Máquina 04</em><i style="--s:0;--l:2;--p:100" class="g-done"></i><i style="--s:3;--l:2;--p:0" class="g-plan"></i></div>
    </div>
    <div class="m-table m-t4">
      <div class="m-th"><span>Ordem</span><span>Planejada</span><span>Produzida</span><span>A produzir</span></div>
      <div class="m-tr"><span>OP 0001</span><span>500</span><span>320</span><span><b>180</b></span></div>
      <div class="m-tr"><span>OP 0002</span><span>240</span><span>240</span><span>0</span></div>
    </div>
  </div>
</div>`,

  wms: () => `<div class="m-win">
  ${bar('WMS · Endereçamento e separação')}
  <div class="m-body wms-grid">
    <div class="rack" aria-hidden="true">
      <div class="rack-h"><span>Rua 01</span><span>Rua 02</span><span>Rua 03</span></div>
      ${[3, 2, 1].map((lv) => `<div class="rack-r"><em>P${lv}</em>${['01', '02', '03'].map((r, ci) => `<i class="${lv === 2 && ci === 2 ? 'hit' : (lv + ci) % 3 === 0 ? 'full' : ''}"></i>`).join('')}</div>`).join('')}
      <div class="rack-pin">Armazém A · Rua 03 · Prateleira 2</div>
    </div>
    <div class="pick">
      <b>Pedido de separação</b>
      <ul>
        <li class="ok">${icon('i-check')}Produto A · 2 un</li>
        <li class="ok">${icon('i-check')}Produto B · 1 cx</li>
        <li class="now"><i></i>Produto C · 4 un</li>
      </ul>
      <div class="barcode" aria-hidden="true"></div>
    </div>
  </div>
</div>`,

  financeiro: () => `<div class="m-win">
  ${bar('Financeiro · Visão de caixa')}
  <div class="m-body">
    <div class="m-row-split"><div><small>Portador selecionado</small><b>Banco e caixa</b></div><span class="m-btn">Filtrar período</span></div>
    <div class="m-balance"><small>Saldo disponível</small><strong>R$ ${mask(8)}</strong></div>
    <div class="m-kpis2">
      <div><small>A receber</small><b>${status('Em acompanhamento', 'ok')}</b></div>
      <div><small>A pagar</small><b>${status('Vencimentos visíveis', 'wait')}</b></div>
    </div>
    <div class="m-chart"><div class="m-chart-t"><b>Fluxo de caixa</b><small>Previsto × realizado</small></div>${bars([[40, 34], [52, 48], [46, 52], [66, 58], [60, 64], [78, 70], [70, 74], [88, 80]])}</div>
  </div>
</div>`,

  comercial: () => `<div class="m-win">
  ${bar('Comercial · Pedido de venda')}
  <div class="m-body ord">
    <div class="ord-main">
      <div class="m-row-split"><div><small>Cliente</small><b>Cliente exemplo</b></div><div><small>Tabela de preço</small><b>Atacado</b></div></div>
      <div class="m-table m-t3">
        <div class="m-th"><span>Item</span><span>Qtd.</span><span>Preço</span></div>
        <div class="m-tr"><span>Produto A</span><span>10</span><span>${mask(5)}</span></div>
        <div class="m-tr"><span>Produto B</span><span>4</span><span>${mask(5)}</span></div>
        <div class="m-tr"><span>Produto C</span><span>25</span><span>${mask(5)}</span></div>
      </div>
      <div class="m-row-split m-total"><small>Total do pedido</small><b>R$ ${mask(7)}</b></div>
    </div>
    <ul class="ord-fx">
      <li>${icon('i-check')}<span>Estoque atualizado</span></li>
      <li>${icon('i-check')}<span>Nota fiscal gerada</span></li>
      <li>${icon('i-check')}<span>Título no financeiro</span></li>
    </ul>
  </div>
</div>`,

  compras: () => `<div class="m-win">
  ${bar('Compras · Recebimento')}
  <div class="m-body">
    <div class="m-step">
      <span class="done"><i></i>Solicitação</span><span class="done"><i></i>Cotação</span><span class="done"><i></i>Pedido</span><span class="now"><i></i>Recebimento</span>
    </div>
    <div class="nfe">
      <div><small>Documento fiscal localizado</small><b>NF-e emitida para a empresa</b><code>3524 •••• •••• •••• •••• 5501</code></div>
      <span class="m-btn">Importar XML</span>
    </div>
    <div class="m-table m-t3">
      <div class="m-th"><span>Cotação</span><span>Prazo</span><span>Preço</span></div>
      <div class="m-tr"><span>Fornecedor A</span><span>7 dias</span><span>${mask(5)}</span></div>
      <div class="m-tr"><span>Fornecedor B</span><span>5 dias</span><span>${mask(5)}</span></div>
      <div class="m-tr"><span>Fornecedor C</span><span>10 dias</span><span>${mask(5)}</span></div>
    </div>
  </div>
</div>`,

  crm: () => `<div class="m-win">
  ${bar('CRM · Funil de oportunidades')}
  <div class="m-body kanban">
    ${[['Prospecção', ['Cliente A', 'Cliente B']], ['Contato', ['Cliente C']], ['Proposta', ['Cliente D', 'Cliente E']], ['Negociação', ['Cliente F']]].map(([t, cs], i) => `<div class="k-col"><b>${t}</b>${cs.map((c, j) => `<div class="k-card"><span>${c}</span>${i === 1 && j === 0 ? chip('Follow-up hoje', 'warn') : chip(['Indicação', 'Site', 'Evento', 'Ligação'][(i + j) % 4])}</div>`).join('')}</div>`).join('')}
  </div>
</div>`,

  ecommerce: () => `<div class="m-win">
  ${bar('Marketplaces · Pedidos')}
  <div class="m-body mk">
    <div class="m-table m-t3">
      <div class="m-th"><span>Canal</span><span>Pedido</span><span>Situação</span></div>
      <div class="m-tr"><span><i class="ch ch-s"></i>Shopee</span><span>•••• 041</span><span>${status('Faturado', 'ok')}</span></div>
      <div class="m-tr"><span><i class="ch ch-m"></i>Mercado Livre</span><span>•••• 118</span><span>${status('Separando', 'run')}</span></div>
      <div class="m-tr"><span><i class="ch ch-s"></i>Shopee</span><span>•••• 052</span><span>${status('A faturar', 'wait')}</span></div>
    </div>
    <div class="mk-fan" aria-hidden="true"><span>${icon('i-wms')}Estoque</span><span>${icon('i-comercial')}Faturamento</span><span>${icon('i-financeiro')}Repasse</span></div>
  </div>
</div>`,

  whatsapp: () => `<div class="phone">
  <div class="phone-h"><i></i><div><b>Cliente exemplo</b><small>Cobrança Infoline</small></div></div>
  <div class="phone-b">
    <div class="bubble">
      <b>Boleto disponível</b>
      <p>Documento •••••• · Parcela 1<br>Vencimento ••/••/••••</p>
      <span class="bubble-link">Acessar o boleto (PDF)</span>
      <small>10:42 <em>✓✓</em></small>
    </div>
    <div class="wa-status">
      <div>${status('Enviado', 'ok')}</div><div>${status('Entregue', 'ok')}</div><div>${status('Lido', 'run')}</div>
    </div>
  </div>
</div>`,

  contabilidade: () => `<div class="m-win">
  ${bar('Fiscal · Obrigações e livros')}
  <div class="m-body">
    <div class="m-chips">${['Sintegra', 'Valida-PR', 'SPED Fiscal', 'EFD-Reinf', 'CIAP'].map((t) => chip(t, 'blue')).join('')}</div>
    <div class="m-table m-t3">
      <div class="m-th"><span>Demonstrativo</span><span>Período</span><span>Valor</span></div>
      <div class="m-tr"><span>Receita bruta</span><span>Mês</span><span>${mask(7)}</span></div>
      <div class="m-tr"><span>(–) Deduções</span><span>Mês</span><span>${mask(6)}</span></div>
      <div class="m-tr m-sum"><span>Resultado</span><span>Mês</span><span>${mask(7)}</span></div>
    </div>
    <div class="m-row-split"><span class="m-st ok">Lançamentos contabilizados</span><span class="m-btn">Emitir livros</span></div>
  </div>
</div>`,

  controladoria: () => `<div class="m-win">
  ${bar('Controladoria · Dashboard Gestor')}
  <div class="m-body">
    <div class="m-kpis3"><div><small>Resultado bruto</small><b>${mask(6)}</b></div><div><small>Markup</small><b>${mask(4)}</b></div><div><small>Rentabilidade</small><b>${mask(4)}</b></div></div>
    <div class="ctl">
      <div class="m-chart"><div class="m-chart-t"><b>Por projeto</b><small>Rentabilidade</small></div>${bars([[70, null], [48, null], [82, null], [36, null], [60, null]], 'm-bars-solo')}</div>
      <div class="donut" aria-hidden="true"><i></i><ul><li><s class="c1"></s>Estrutural</li><li><s class="c2"></s>ABC</li><li><s class="c3"></s>Real</li></ul></div>
    </div>
  </div>
</div>`,

  custos: () => `<div class="m-win">
  ${bar('Custos · Formação de preço')}
  <div class="m-body">
    <small class="m-cap">Composição do custo</small>
    <div class="stack"><span class="s1" style="flex:34">Hora máquina</span><span class="s2" style="flex:26">Hora homem</span><span class="s3" style="flex:40">Insumos</span></div>
    <div class="stack-eq"><div><small>Custo</small><b>R$ ${mask(6)}</b></div><i>+</i><div><small>Margem</small><b>${mask(4)}</b></div><i>=</i><div class="hot"><small>Preço de venda</small><b>R$ ${mask(6)}</b></div></div>
    <div class="m-table m-t3">
      <div class="m-th"><span>Produto</span><span>Markup</span><span>Rentab.</span></div>
      <div class="m-tr"><span>Produto A</span><span>${mask(3)}</span><span>${mask(3)}</span></div>
      <div class="m-tr"><span>Produto B</span><span>${mask(3)}</span><span>${mask(3)}</span></div>
    </div>
  </div>
</div>`,

  rh: () => `<div class="m-win">
  ${bar('RH · Folha e ponto')}
  <div class="m-body rh">
    <div class="payslip"><small>Holerite</small><b>Colaborador exemplo</b><div><span>Proventos</span><span>${mask(6)}</span></div><div><span>Descontos</span><span>${mask(5)}</span></div><div class="tot"><span>Líquido</span><span>${mask(6)}</span></div></div>
    <div class="punch"><small>Ponto eletrônico · jornada</small>${bars([[80, null], [76, null], [82, null], [78, null], [70, null]], 'm-bars-solo m-bars-sm')}<div class="wk"><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span></div></div>
    <div class="m-chips">${['eSocial', 'CAGED', 'RAIS', 'DIRF', 'SEFIP'].map((t) => chip(t, 'blue')).join('')}</div>
  </div>
</div>`,

  processos: () => `<div class="m-win">
  ${bar('Processos · Workflow')}
  <div class="m-body wf">
    <div class="wf-line" aria-hidden="true"></div>
    ${[['Solicitação', 'Comercial', 'done'], ['Aprovação', 'Gestor', 'done'], ['Execução', 'Operação', 'now'], ['Conclusão', 'Financeiro', 'next']].map(([t, r, s], i) => `<div class="wf-n ${s}"><span class="wf-dot">${s === 'done' ? icon('i-check') : i + 1}</span><b>${t}</b><small>${r}</small></div>`).join('')}
  </div>
  <div class="m-body wf-foot"><span class="m-st run">Etapa atual no prazo</span><span class="m-st ok">2 de 4 concluídas</span></div>
</div>`,
};

// ---------------------------------------------------------------------------
// TELAS DE EXEMPLO (seção "Exemplo de tela" dos módulos)
// ---------------------------------------------------------------------------
export function screenMock(kind, data = {}) {
  if (kind === 'pcpm') {
    const rows = [
      ['0001', 'Produto A', 'Máquina 01', '500', '320', '180', 'Em produção', 'run'],
      ['0002', 'Produto B', 'Máquina 02', '240', '240', '0', 'Encerrada', 'ok'],
      ['0003', 'Produto C', 'Máquina 03', '800', '0', '800', 'Planejada', 'wait'],
      ['0004', 'Produto A', 'Máquina 01', '300', '0', '300', 'Firmada', 'blue'],
    ];
    return `<div class="m-win m-wide" role="img" aria-label="Exemplo ilustrativo da tela de MRP com ordens de produção">
  ${bar('PCPM · MRP e ordens de produção', 'Tela ilustrativa', 'module-system-illustrative-label')}
  <div class="m-body">
    <div class="m-toolbar"><span class="m-sel">Todos os grupos</span><span class="m-seg"><b>Mês</b><b class="on">Semana</b><b>Dia</b></span><span class="m-btn">Processar ordens</span></div>
    <div class="m-scroll"><div class="m-table m-t7">
      <div class="m-th"><span>Ordem</span><span>Produto</span><span>Máquina</span><span>Planejada</span><span>Produzida</span><span>A produzir</span><span>Situação</span></div>
      ${rows.map((r) => `<div class="m-tr"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span>${r[3]}</span><span>${r[4]}</span><span><b>${r[5]}</b></span><span>${status(r[6], r[7])}</span></div>`).join('')}
    </div></div>
    <small class="m-foot">Exemplo ilustrativo baseado na tela do módulo. Nenhum dado real é exibido.</small>
  </div>
</div>`;
  }
  if (kind === 'wms') {
    const cols = data.columns || [];
    const rows = data.rows || [];
    return `<div class="m-win m-wide" role="img" aria-label="Exemplo da tela de montagem de cargas do WMS">
  ${bar('WMS · Montagem de carga', 'Baseado na tela do sistema')}
  <div class="m-body">
    <div class="m-toolbar"><span class="m-sel">Data · 17/09/2026</span><span class="m-sel">Nº da carga · 3227</span><span class="m-btn">Processar cargas</span></div>
    <div class="m-scroll"><div class="m-table m-t4">
      <div class="m-th">${cols.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
      ${rows.map((r) => `<div class="m-tr">${r.map((c, i) => i === 3 ? `<span>${status(c, c === 'Faturada' ? 'ok' : 'wait')}</span>` : `<span>${esc(c)}</span>`).join('')}</div>`).join('')}
    </div></div>
    <small class="m-foot">Exemplo baseado na tela do sistema. Os números servem apenas de ilustração.</small>
  </div>
</div>`;
  }
  if (kind === 'whatsapp') {
    const rows = [
      ['Cliente exemplo A', '(41) 9••••-••01', 'Boleto enviado', 'Lido', 'ok'],
      ['Cliente exemplo B', '(41) 9••••-••02', 'Boleto enviado', 'Entregue', 'run'],
      ['Cliente exemplo C', '(41) 9••••-••03', 'Boleto enviado', 'Enviado', 'wait'],
      ['Cliente exemplo D', 'Sem número válido', 'Não enviada', 'Corrigir cadastro', 'err'],
    ];
    return `<div class="m-win m-wide" role="img" aria-label="Exemplo ilustrativo da tela de mensagens de WhatsApp da cobrança">
  ${bar('Mensagens de WhatsApp')}
  <div class="m-body">
    <div class="m-toolbar"><span class="m-sel">Data inicial – final</span><span class="m-sel">Telefone ou texto</span><span class="m-btn">Pesquisar</span></div>
    <div class="m-scroll"><div class="m-table m-t4">
      <div class="m-th"><span>Cliente</span><span>Telefone</span><span>Mensagem</span><span>Status</span></div>
      ${rows.map((r) => `<div class="m-tr"><span>${r[0]}</span><span>${r[1]}</span><span>${r[2]}</span><span>${status(r[3], r[4])}</span></div>`).join('')}
    </div></div>
    <small class="m-foot">Exemplo ilustrativo. Nenhum dado real é exibido.</small>
  </div>
</div>`;
  }
  return '';
}

// ---------------------------------------------------------------------------
// TELAS DA SEÇÃO "VEJA EM AÇÃO"  (data-for = etapa que acende o bloco)
// ---------------------------------------------------------------------------
export const demoScreen = {
  venda: () => `<div class="m-win"><div class="m-bar"><span class="m-dots"><i></i><i></i><i></i></span><b>Comercial · Pedido de venda</b><em>Exemplo ilustrativo</em></div>
  <div class="m-body ds">
    <div class="ds-block" data-for="0"><small>Orçamento aprovado</small><b>Cliente exemplo · tabela Atacado</b></div>
    <div class="ds-block" data-for="1"><div class="m-table m-t3"><div class="m-th"><span>Item</span><span>Qtd.</span><span>Entrega</span></div><div class="m-tr"><span>Produto A</span><span>10</span><span>Programada</span></div><div class="m-tr"><span>Produto B</span><span>4</span><span>Programada</span></div></div></div>
    <div class="ds-fx">
      <div class="ds-block" data-for="2">${icon('i-wms')}<span><small>Estoque</small><b>Baixa automática</b></span></div>
      <div class="ds-block" data-for="3">${icon('i-comercial')}<span><small>Faturamento</small><b>Nota fiscal gerada</b></span></div>
      <div class="ds-block" data-for="4">${icon('i-financeiro')}<span><small>Financeiro e fiscal</small><b>Movimento integrado</b></span></div>
    </div>
  </div></div>`,

  producao: () => `<div class="m-win"><div class="m-bar"><span class="m-dots"><i></i><i></i><i></i></span><b>PCPM · Ordens de produção</b><em>Exemplo ilustrativo</em></div>
  <div class="m-body ds">
    <div class="ds-two">
      <div class="ds-block" data-for="0"><small>Engenharia</small><b>Produto A · versão 2</b><span class="m-chips">${chip('Roteiro', 'blue')}${chip('Máquinas', 'blue')}</span></div>
      <div class="ds-block" data-for="1"><small>MRP · necessidade de materiais</small><ul class="ds-list"><li>Material 1 <b>200 un</b></li><li>Material 2 <b>80 kg</b></li></ul></div>
    </div>
    <div class="ds-block" data-for="2"><div class="m-table m-t4"><div class="m-th"><span>Ordem</span><span>Produto</span><span>Planejada</span><span>Situação</span></div><div class="m-tr"><span>0001</span><span>Produto A</span><span>500</span><span>${status('Firmada', 'blue')}</span></div><div class="m-tr"><span>0002</span><span>Produto B</span><span>240</span><span>${status('Planejada', 'wait')}</span></div></div></div>
    <div class="ds-block" data-for="3"><div class="gantt gantt-s"><div class="gantt-r"><em>Máq. 01</em><i style="--s:0;--l:3;--p:70" class="g-run"></i></div><div class="gantt-r"><em>Máq. 02</em><i style="--s:2;--l:3;--p:0" class="g-plan"></i></div></div></div>
    <div class="ds-block" data-for="4"><div class="m-kpis3"><div><small>Planejada</small><b>500</b></div><div><small>Produzida</small><b>320</b></div><div><small>A produzir</small><b>180</b></div></div></div>
  </div></div>`,

  armazem: () => `<div class="m-win"><div class="m-bar"><span class="m-dots"><i></i><i></i><i></i></span><b>WMS · Operação do armazém</b><em>Exemplo ilustrativo</em></div>
  <div class="m-body ds">
    <div class="ds-two">
      <div class="ds-block" data-for="0"><small>Endereço</small><b>Armazém A · Rua 03 · Prateleira 2</b><span class="m-chips">${chip('Código de barras', 'blue')}</span></div>
      <div class="ds-block" data-for="1"><small>Pedido de separação</small><ul class="ds-list"><li>Produto A <b>2 un</b></li><li>Produto B <b>1 cx</b></li></ul></div>
    </div>
    <div class="ds-block" data-for="2"><small>Packing</small><b>Volumes conferidos e etiquetados</b><div class="barcode" aria-hidden="true"></div></div>
    <div class="ds-block" data-for="3"><div class="m-table m-t4"><div class="m-th"><span>Carga</span><span>Pedidos</span><span>Volume</span><span>Situação</span></div><div class="m-tr"><span>3227</span><span>01</span><span>2.100</span><span>${status('Faturada', 'ok')}</span></div><div class="m-tr"><span>3228</span><span>06</span><span>0</span><span>${status('Em montagem', 'wait')}</span></div></div></div>
    <div class="ds-block" data-for="4"><small>Expedição</small><b>Romaneio gerado a partir do pedido de separação</b></div>
  </div></div>`,

  caixa: () => `<div class="m-win"><div class="m-bar"><span class="m-dots"><i></i><i></i><i></i></span><b>Financeiro · Caixa e cobrança</b><em>Exemplo ilustrativo</em></div>
  <div class="m-body ds">
    <div class="ds-block" data-for="0"><div class="m-kpis4"><div><small>Saldo anterior</small><b>${mask(5)}</b></div><div><small>Entradas</small><b>${mask(5)}</b></div><div><small>Saídas</small><b>${mask(5)}</b></div><div><small>Saldo atual</small><b>${mask(5)}</b></div></div></div>
    <div class="ds-block" data-for="1"><div class="m-table m-t3"><div class="m-th"><span>Título</span><span>Vencimento</span><span>Situação</span></div><div class="m-tr"><span>A receber</span><span>••/••</span><span>${status('Em aberto', 'wait')}</span></div><div class="m-tr"><span>A pagar</span><span>••/••</span><span>${status('Liquidado', 'ok')}</span></div></div></div>
    <div class="ds-two">
      <div class="ds-block" data-for="2"><div class="m-chart"><div class="m-chart-t"><b>Fluxo de caixa</b><small>Previsto × realizado</small></div>${bars([[40, 34], [52, 48], [46, 52], [66, 58], [60, 64]], 'm-bars-sm')}</div></div>
      <div class="ds-block" data-for="3"><small>Cobrança</small><b>Remessa CNAB e boleto</b><span class="m-chips">${chip('WhatsApp', 'blue')}</span></div>
    </div>
    <div class="ds-block" data-for="4"><small>Conciliação bancária</small><b>Movimentos conferidos com o extrato</b></div>
  </div></div>`,
};
