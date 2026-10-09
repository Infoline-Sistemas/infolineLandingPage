import http from 'node:http';

const port = process.argv[2] || '9252';
const allModules = [
  { page: 'pcpm.html', panel: '.pcpm-product', note: '.pcpm-float' },
  { page: 'comercial.html', panel: '.sales-order', note: '.sales-float' },
  { page: 'wms.html', panel: '.wms-stock-card', note: '.wms-float' },
  { page: 'compras.html', panel: '.buy-order', note: '.buy-float' },
  { page: 'financeiro.html', panel: '.fin-console', note: '.fin-note' },
  { page: 'custos.html', panel: '.cost-product', note: '.cost-note' },
  { page: 'crm.html', panel: '.crm-product', note: '.crm-note' },
];
const requestedPage = process.argv[3];
const modules = requestedPage ? allModules.filter((item) => item.page === requestedPage) : allModules;
if (!modules.length) throw new Error(`Página de QA desconhecida: ${requestedPage}`);

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function evaluate(page, config) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(page.webSocketDebuggerUrl);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        returnByValue: true,
        expression: `(() => {
          const panel = document.querySelector(${JSON.stringify(config.panel)}).getBoundingClientRect();
          const notes = Array.from(document.querySelectorAll(${JSON.stringify(config.note)})).map((item) => item.getBoundingClientRect());
          const overlaps = notes.map((item) => !(item.right <= panel.left || item.left >= panel.right || item.bottom <= panel.top || item.top >= panel.bottom));
          return JSON.stringify({ page:${JSON.stringify(config.page)}, viewport:{ width:innerWidth, scrollWidth:document.documentElement.scrollWidth }, panel:panel.toJSON(), notes:notes.map((item) => item.toJSON()), overlaps });
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

const pages = await getJson(`http://127.0.0.1:${port}/json`);
const results = [];
for (const config of modules) {
  const page = pages.find((item) => item.type === 'page' && item.url.includes(config.page));
  if (!page) throw new Error(`${config.page} não encontrada no Chrome de QA.`);
  results.push(await evaluate(page, config));
}

console.log(JSON.stringify(results, null, 2));
if (results.some((item) => item.overlaps.some(Boolean) || item.viewport.scrollWidth > item.viewport.width + 1)) process.exitCode = 2;
