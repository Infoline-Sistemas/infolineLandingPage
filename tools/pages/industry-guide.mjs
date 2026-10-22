import { esc, icon } from '../lib.mjs';
import { head, orgSchema, faqSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';

const questions = [
  ['Qual a diferença entre ERP industrial e PCP?', 'O ERP integra áreas como compras, estoque, produção, custos e financeiro. O PCP organiza o planejamento e o controle da produção; pode ser um módulo do próprio ERP, como o PCPM da Infoline.'],
  ['Como avaliar um sistema de gestão para indústria?', 'Leve uma ordem de produção representativa à demonstração. Verifique a estrutura do produto, a necessidade de materiais, a programação, os apontamentos, o estoque e os custos no mesmo fluxo. Peça para ver também as exceções do seu processo.'],
  ['Uma lista de funcionalidades é suficiente para escolher?', 'Não. Além dos recursos, confirme como os dados passam entre áreas, quem fará a implantação, como os usuários serão treinados e quais etapas precisam ser configuradas para a sua operação.'],
];

const criteria = [
  ['Estrutura do produto', 'Materiais, versões e etapas de fabricação', 'Ao alterar um componente, onde a mudança aparece nas próximas ordens?'],
  ['Materiais e compras', 'Necessidade calculada em relação ao estoque e aos pedidos', 'O que acontece quando um insumo está em falta ou chega depois do previsto?'],
  ['PCP e capacidade', 'Prioridades, ordens, recursos e carga de máquina', 'Como a equipe reprograma uma ordem urgente sem perder a visão das demais?'],
  ['Execução', 'Apontamentos e comparação entre planejado e produzido', 'É possível localizar rapidamente uma ordem atrasada e o saldo a produzir?'],
  ['Custos e gestão', 'Custos da operação conectados à produção e às compras', 'Quais dados entram no custo e como são conferidos?'],
];

export function renderIndustryGuide() {
  const title = 'Como Escolher um Sistema de Gestão para Indústria | Infoline';
  const description = 'Guia para escolher um sistema de gestão para indústria: compare ERP, PCP e execução, avalie materiais, produção, custos e prepare uma demonstração útil.';
  const headHtml = head({ title, description, path: 'como-escolher-sistema-gestao-industria.html', schemas: [orgSchema(), faqSchema(questions)] });
  const bc = breadcrumb([
    { label: 'Início', href: 'index.html' },
    { label: 'Gestão Industrial', href: 'erp-para-industria.html' },
    { label: 'Como escolher' },
  ]);

  const body = `${header({ variant: 'internal' })}${bc}<main id="conteudo">
<article>
  <header class="guide-hero">
    <div class="container guide-hero-inner">
      <div><p class="kicker">Guia prático para a indústria</p><h1>Como escolher um sistema de gestão para indústria</h1><p class="lede">A melhor avaliação começa pelo trabalho da sua fábrica. Veja o que comparar em um ERP industrial, quais perguntas fazer e como testar a solução antes de decidir.</p><p class="guide-meta">Atualizado em 22 de outubro de 2026 · Leitura de 6 minutos</p></div>
      <nav class="guide-summary" aria-label="Nesta página"><strong>Neste guia</strong><a href="#tipos">O que cada sistema resolve</a><a href="#criterios">Critérios para comparar</a><a href="#demonstracao">Roteiro de demonstração</a><a href="#infoline">Onde a Infoline entra</a></nav>
    </div>
  </header>

  <section class="section guide-intro" id="tipos"><div class="container guide-reading">
    <p class="kicker">Comece pelo problema</p><h2>O que sua indústria precisa controlar?</h2>
    <p>“Sistema de gestão para indústria” pode descrever ferramentas com funções bem diferentes. Antes de comparar fornecedores, liste o que hoje depende de planilhas, conferências manuais ou informações mantidas em setores separados.</p>
    <div class="guide-types">
      <div><span>01</span><h3>ERP industrial</h3><p>Reúne pedidos, compras, estoque, planejamento, produção, custos e gestão financeira. É a base para acompanhar o mesmo dado ao longo da operação.</p></div>
      <div><span>02</span><h3>PCP ou PCPM</h3><p>Planeja materiais, ordens, prioridades e capacidade produtiva. Quando está ligado ao ERP, usa a demanda e o estoque como parte do planejamento.</p></div>
      <div><span>03</span><h3>Execução e rotinas da planta</h3><p>Registra o trabalho realizado e pode incluir apontamentos, qualidade, manutenção ou treinamento, conforme a ferramenta. Confira quais dessas rotinas fazem parte do produto avaliado.</p></div>
    </div>
    <p class="guide-note">Uma solução pode cobrir mais de uma dessas frentes. Peça para ver o fluxo entre elas, além da lista de módulos.</p>
  </div></section>

  <section class="section section--mist" id="criterios"><div class="container">
    <div class="guide-section-heading"><p class="kicker">Critérios de avaliação</p><h2>Compare o processo inteiro, não só a tela inicial.</h2><p>Use as mesmas perguntas em todas as demonstrações. Assim fica mais fácil identificar o que já funciona, o que exige configuração e o que depende de outra ferramenta.</p></div>
    <div class="guide-table-wrap" role="region" aria-label="Critérios para comparar sistemas industriais" tabindex="0"><table class="guide-table"><thead><tr><th scope="col">Área</th><th scope="col">O que verificar</th><th scope="col">Pergunta para a demonstração</th></tr></thead><tbody>${criteria.map(([area, verify, question]) => `<tr><th scope="row">${esc(area)}</th><td>${esc(verify)}</td><td>${esc(question)}</td></tr>`).join('')}</tbody></table></div>
  </div></section>

  <section class="section" id="demonstracao"><div class="container guide-reading">
    <p class="kicker">Teste com dados da sua operação</p><h2>Um roteiro simples para a demonstração</h2>
    <ol class="guide-steps">
      <li><b>Escolha um produto real.</b><span>Separe sua estrutura, os materiais e as etapas de fabricação. Inclua uma variação ou exceção frequente.</span></li>
      <li><b>Simule a demanda.</b><span>Mostre como um pedido gera necessidade de materiais e o que muda quando parte do estoque já está disponível.</span></li>
      <li><b>Planeje e execute uma ordem.</b><span>Confira prioridade, recurso utilizado, quantidade planejada, apontamento e saldo ainda a produzir.</span></li>
      <li><b>Siga os dados até outras áreas.</b><span>Observe o que compras, estoque, custos e financeiro conseguem enxergar sem digitar tudo novamente.</span></li>
      <li><b>Documente as respostas.</b><span>Registre recursos disponíveis, ajustes necessários, etapas de implantação, treinamento e responsabilidades de cada lado.</span></li>
    </ol>
    <div class="guide-callout"><strong>Não deixe a exceção para depois.</strong><p>A demonstração deve incluir um atraso de material, uma ordem alterada ou outra situação comum na sua fábrica. É nessa hora que as diferenças entre sistemas aparecem.</p></div>
  </div></section>

  <section class="section section--mist" id="infoline"><div class="container">
    <div class="guide-section-heading"><p class="kicker">ERP Infoline</p><h2>Veja as partes do fluxo industrial na Infoline.</h2><p>As páginas abaixo detalham os recursos que podem ser avaliados com o seu processo real.</p></div>
    <div class="guide-links">
      <a href="pcpm.html"><span>Planejamento e produção</span><h3>PCPM e MRP</h3><p>Estruturas, necessidades, ordens, capacidade e apontamentos.</p><b>Conhecer PCPM ${icon('i-arrow-right', 'i')}</b></a>
      <a href="compras.html"><span>Abastecimento</span><h3>Compras</h3><p>Cotações, pedidos e acompanhamento do recebimento.</p><b>Conhecer Compras ${icon('i-arrow-right', 'i')}</b></a>
      <a href="wms.html"><span>Materiais</span><h3>Estoque e WMS</h3><p>Saldo, endereço, movimentação e expedição.</p><b>Conhecer WMS ${icon('i-arrow-right', 'i')}</b></a>
      <a href="custos.html"><span>Resultado</span><h3>Gestão de Custos</h3><p>Composição de custos, formação de preço e análise de margem.</p><b>Conhecer Custos ${icon('i-arrow-right', 'i')}</b></a>
    </div>
    <p class="guide-back"><a class="text-link" href="erp-para-industria.html">Ver a solução de gestão industrial ${icon('i-arrow-right', 'i')}</a></p>
  </div></section>

  <section class="section" id="perguntas"><div class="container guide-reading">
    <p class="kicker">Perguntas frequentes</p><h2>Dúvidas antes de escolher</h2>
    <div class="faq-list guide-faq">${questions.map(([question, answer], index) => `<details class="faq-item"${index === 0 ? ' open' : ''}><summary>${esc(question)}${icon('i-plus', 'i')}</summary><p class="faq-item-a">${esc(answer)}</p></details>`).join('')}</div>
  </div></section>
</article>
<section class="section guide-final"><div class="container"><div class="cta-banner"><h2>Quer testar esse roteiro com a sua produção?</h2><p>Conte como funciona sua fábrica e avalie o fluxo industrial do ERP Infoline em uma demonstração.</p><div class="cta-banner-actions"><a class="button button-light" href="index.html#contato" data-track="cta_click" data-label="industry_guide_demo">Agendar uma demonstração</a></div></div></div></section>
</main>${footer()}`;

  return { headHtml, body, styles: ['industry-guide.css'], pageType: 'guide', solutionGroup: 'industria' };
}
