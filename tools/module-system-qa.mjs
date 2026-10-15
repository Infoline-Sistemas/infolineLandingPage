import http from 'node:http';

const port = process.argv[2] || '9343';
const premiumPages = [
  'pcpm.html', 'wms.html', 'compras.html', 'custos.html', 'comercial.html',
  'crm.html', 'ecommerce.html', 'financeiro.html', 'integracao-whatsapp.html',
  'contabilidade.html', 'controladoria.html', 'rh.html', 'gestao-processos.html',
];

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function evaluate(page, pageName) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(page.webSocketDebuggerUrl);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        awaitPromise: true,
        returnByValue: true,
        expression: `(async () => {
          const flow = document.querySelector('[data-module-flow]');
          const steps = Array.from(flow?.querySelectorAll('.module-system-flow-step') || []);
          const target = steps.at(-1);
          target?.click();
          await new Promise((done) => setTimeout(done, 80));
          return JSON.stringify({
            page: ${JSON.stringify(pageName)},
            viewport: { width: innerWidth, scrollWidth: document.documentElement.scrollWidth },
            label: document.querySelector('.module-system-hero-product .mod-product-label')?.textContent.trim(),
            labelDisplay: document.querySelector('.module-system-hero-product .mod-product-label') ? getComputedStyle(document.querySelector('.module-system-hero-product .mod-product-label')).display : null,
            screenLabel: document.querySelector('.module-system-screen-stage .module-system-illustrative-label')?.textContent.trim(),
            warning: document.querySelector('.module-system-hero-product > small')?.textContent.trim(),
            warningColor: document.querySelector('.module-system-hero-product > small') ? getComputedStyle(document.querySelector('.module-system-hero-product > small')).color : null,
            flowSteps: steps.length,
            flowInteraction: target ? {
              active: target.classList.contains('is-active'),
              pressed: target.getAttribute('aria-pressed'),
              input: document.querySelector('[data-flow-detail="input"]')?.textContent.trim(),
              expectedInput: target.dataset.flowInput,
              control: document.querySelector('[data-flow-detail="control"]')?.textContent.trim(),
              expectedControl: target.dataset.flowControl,
              output: document.querySelector('[data-flow-detail="output"]')?.textContent.trim(),
              expectedOutput: target.dataset.flowOutput,
            } : null,
          });
        })()`,
      },
    })));
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.id !== 1) return;
      socket.close();
      if (data.result?.exceptionDetails) reject(new Error(data.result.exceptionDetails.exception?.description || data.result.exceptionDetails.text));
      else resolve(JSON.parse(data.result.result.value));
    });
    socket.addEventListener('error', reject);
  });
}

const tabs = await getJson(`http://127.0.0.1:${port}/json`);
const results = [];
for (const pageName of premiumPages) {
  const page = tabs.find((item) => item.type === 'page' && item.url.includes(pageName));
  if (!page) throw new Error(`${pageName} não encontrada no Chrome de QA.`);
  results.push(await evaluate(page, pageName));
}

const failures = results.flatMap((result) => {
  const issues = [];
  if (result.viewport.scrollWidth > result.viewport.width + 1) issues.push('overflow horizontal global');
  if (result.labelDisplay !== 'none') issues.push('selo de tela ilustrativa ainda está enfatizado');
  if (result.screenLabel !== 'Tela ilustrativa') issues.push('tela principal sem identificação visual de ilustrativa');
  if (result.warning !== 'Representação ilustrativa. Nenhum dado real é exibido.') issues.push('aviso de dados ilustrativos ausente');
  if (result.warningColor !== 'rgb(159, 180, 210)') issues.push('aviso de dados ilustrativos fora da cor discreta definida');
  if (!result.flowSteps || !result.flowInteraction) issues.push('fluxo interativo ausente');
  else {
    if (!result.flowInteraction.active || result.flowInteraction.pressed !== 'true') issues.push('etapa final do fluxo não ativou');
    if (result.flowInteraction.input !== result.flowInteraction.expectedInput) issues.push('entrada do fluxo não atualizou');
    if (result.flowInteraction.control !== result.flowInteraction.expectedControl) issues.push('controle do fluxo não atualizou');
    if (result.flowInteraction.output !== result.flowInteraction.expectedOutput) issues.push('saída do fluxo não atualizou');
  }
  return issues.map((issue) => `${result.page}: ${issue}`);
});

if (failures.length) {
  console.error(`QA do sistema de módulos falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

console.log(`QA do sistema de módulos ok: ${results.length} páginas, hero, tela principal, aviso e fluxos interativos validados.`);
