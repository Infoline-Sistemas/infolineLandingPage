import { head, orgSchema } from '../head.mjs';
import { header, footer, breadcrumb } from '../layout.mjs';

const receita = 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/programas-e-atividades/reforma-tributaria-do-consumo/entenda';
const cronograma = 'https://www.gov.br/receitafederal/pt-br/acesso-a-informacao/acoes-e-programas/reforma-tributaria-do-consumo/orientacoes-da-reforma-tributaria/cronograma';

export function renderTaxReform() {
  const title = 'Reforma Tributária: IBS, CBS e preparação do ERP | Infoline';
  const description = 'Entenda o cronograma da Reforma Tributária do Consumo e como preparar cadastros, documentos fiscais e parametrizações no ERP Infoline V3.1.';
  const headHtml = head({ title, description, path: 'reforma-tributaria.html', schemas: [orgSchema()] });
  const bc = breadcrumb([{ label: 'Início', href: 'index.html' }, { label: 'Reforma Tributária' }]);

  const body = `${header({ variant: 'internal' })}${bc}<main id="conteudo">
<article>
  <header class="tax-hero">
    <div class="container tax-hero-grid">
      <div>
        <p class="kicker">Reforma Tributária do Consumo</p>
        <h1>Prepare sua operação para IBS e CBS.</h1>
        <p class="lede">A transição tributária alcança cadastros, documentos fiscais e rotinas de apuração. Veja o cronograma, o que conferir na sua empresa e como o ERP Infoline V3.1 apoia as operações suportadas.</p>
        <div class="tax-hero-actions"><a class="button button-primary" href="index.html#contato" data-track="cta_click" data-label="tax_hero_demo">Conversar com a Infoline</a><a class="tax-text-link" href="#cronograma">Ver o cronograma ↓</a></div>
        <p class="tax-updated">Conteúdo revisado em 10 de novembro de 2026 · Fontes oficiais ao final da página</p>
      </div>
      <div class="tax-hero-visual" aria-label="Transição da Reforma Tributária entre 2026 e 2033">
        <span class="tax-visual-label">Transição em etapas</span>
        <div><b>2026</b><span>Preparação e testes</span></div>
        <div><b>2027</b><span>CBS e Imposto Seletivo</span></div>
        <div><b>2029–32</b><span>Substituição gradual de ICMS e ISS</span></div>
        <div><b>2033</b><span>Novo modelo integral</span></div>
      </div>
    </div>
  </header>

  <section class="section tax-intro" id="entenda"><div class="container tax-reading">
    <p class="kicker">O que muda</p><h2>Uma transição que exige atenção aos dados da operação.</h2>
    <p>A Reforma Tributária do Consumo introduz a CBS, de competência federal, e o IBS, de competência estadual e municipal. Também prevê o Imposto Seletivo para os produtos e serviços definidos na legislação. A implementação ocorre em etapas: regras antigas e novas convivem durante parte da transição.</p>
    <p>Para a empresa, isso torna mais importante revisar a classificação de itens e serviços, a emissão de documentos eletrônicos e a configuração fiscal de cada operação. O tratamento aplicável depende das normas vigentes, do regime tributário e das particularidades do negócio.</p>
  </div></section>

  <section class="section section--mist" id="cronograma"><div class="container">
    <div class="tax-section-heading"><p class="kicker">Cronograma oficial</p><h2>As principais etapas da transição.</h2><p>Use estas datas como referência para planejar a preparação da empresa. Detalhes operacionais devem ser acompanhados nas publicações dos órgãos oficiais.</p></div>
    <ol class="tax-timeline">
      <li><span>2026</span><div><h3>Testes e preparação</h3><p>Início da fase de testes de IBS e CBS. É o momento de revisar informações fiscais, documentos eletrônicos e processos internos.</p></div></li>
      <li><span>2027–2028</span><div><h3>CBS em cobrança e IBS em transição</h3><p>A CBS substitui PIS e Cofins. Começa o Imposto Seletivo. O IPI tem alíquotas zeradas para a maioria dos produtos, com exceções ligadas à Zona Franca de Manaus. O IBS segue em etapa de transição.</p></div></li>
      <li><span>2029–2032</span><div><h3>Substituição gradual de ICMS e ISS</h3><p>O IBS avança gradualmente enquanto ICMS e ISS são reduzidos, conforme o cronograma legal.</p></div></li>
      <li><span>2033</span><div><h3>Modelo integral</h3><p>O novo modelo de tributação do consumo passa a vigorar integralmente.</p></div></li>
    </ol>
    <p class="tax-source-note">Resumo baseado no <a href="${receita}" target="_blank" rel="noopener noreferrer">cronograma da Receita Federal</a>. Consulte as regras atuais antes de tomar decisões fiscais.</p>
  </div></section>

  <section class="section" id="preparacao"><div class="container">
    <div class="tax-section-heading"><p class="kicker">Na prática</p><h2>O que revisar com sua equipe fiscal e contábil.</h2></div>
    <div class="tax-check-grid">
      <article><span>01</span><h3>Cadastros</h3><p>Confira produtos, serviços, clientes, fornecedores e classificações que influenciam o tratamento tributário.</p></article>
      <article><span>02</span><h3>Documentos fiscais</h3><p>Verifique os campos e as informações exigidos nos documentos eletrônicos usados pela sua operação.</p></article>
      <article><span>03</span><h3>Parametrização</h3><p>Revise regras por operação, regime e período de vigência junto aos responsáveis pela área fiscal.</p></article>
      <article><span>04</span><h3>Testes e conferência</h3><p>Simule operações reais, confira os resultados e registre ajustes antes da aplicação em produção.</p></article>
    </div>
  </div></section>

  <section class="section section--dark tax-infoline" id="infoline"><div class="container tax-infoline-grid">
    <div><p class="kicker">Infoline V3.1</p><h2>Dados fiscais conectados à operação.</h2><p>O ERP Infoline já contempla parametrização, cálculo e informações de IBS e CBS em rotinas fiscais e documentos eletrônicos para operações suportadas. A configuração deve considerar as regras aplicáveis e o regime de cada empresa.</p><a class="button button-primary" href="contabilidade.html" data-track="cta_click" data-label="tax_fiscal_module">Conhecer o módulo Fiscal e Contábil</a></div>
    <aside><strong>Como avaliar sua preparação</strong><p>Leve à demonstração uma operação representativa da sua empresa. Assim é possível conferir cadastros, emissão, cálculo e conferência com base no seu processo.</p><a href="index.html#contato" data-track="cta_click" data-label="tax_demo">Agendar uma demonstração →</a></aside>
  </div></section>

  <section class="section tax-sources"><div class="container tax-reading">
    <p class="kicker">Fontes e atualização</p><h2>Acompanhe as orientações oficiais.</h2>
    <p>O cronograma e as exigências de documentos podem receber novas orientações. Para conferir as regras mais recentes, consulte a <a href="${receita}" target="_blank" rel="noopener noreferrer">visão geral da Reforma Tributária na Receita Federal</a> e o <a href="${cronograma}" target="_blank" rel="noopener noreferrer">cronograma de documentos fiscais eletrônicos</a>.</p>
    <p>Este conteúdo é informativo. A definição do tratamento fiscal da sua empresa deve ser feita com a equipe contábil ou tributária responsável.</p>
  </div></section>
</article>
</main>${footer()}`;

  return { headHtml, body, styles: ['tax-reform.css'], pageType: 'guide' };
}
