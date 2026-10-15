import http from 'node:http';

const port = process.argv[2] || '9280';
function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

const pages = await getJson(`http://127.0.0.1:${port}/json`);
const page = pages.find((item) => item.type === 'page' && item.url.includes('crm.html'));
if (!page) throw new Error('CRM não encontrado no Chrome de QA.');

const result = await new Promise((resolve, reject) => {
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  socket.addEventListener('open', () => socket.send(JSON.stringify({
    id: 1,
    method: 'Runtime.evaluate',
    params: {
      awaitPromise: true,
      returnByValue: true,
      expression: `(async () => {
        const rect = (selector) => document.querySelector(selector)?.getBoundingClientRect().toJSON() || null;
        const panel = document.querySelector('.crm-product').getBoundingClientRect();
        const notes = Array.from(document.querySelectorAll('.crm-note')).map((item) => item.getBoundingClientRect());
        const overlaps = notes.map((item) => !(item.right <= panel.left || item.left >= panel.right || item.bottom <= panel.top || item.top >= panel.bottom));
        const steps = Array.from(document.querySelectorAll('.crm-flow-step'));
        const target = steps[4];
        target.click();
        await new Promise((done) => setTimeout(done, 40));
        const board = document.querySelector('.crm-board');
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.crm-hero .mod-hero-inner'),
          heroProduct: rect('.crm-hero-product'),
          overlays: { panel: panel.toJSON(), notes: notes.map((item) => item.toJSON()), overlaps },
          responsive: {
            flowColumns: getComputedStyle(document.querySelector('.crm-flow-track')).gridTemplateColumns,
            flowClientWidth: document.querySelector('.crm-flow-track').clientWidth,
            flowScrollWidth: document.querySelector('.crm-flow-track').scrollWidth,
            boardClientWidth: board.clientWidth,
            boardScrollWidth: board.scrollWidth,
          },
          counts: {
            bento: document.querySelectorAll('.crm-cap-card').length,
            flow: steps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.crm-situations article').length,
            connections: document.querySelectorAll('.crm-eco-node').length,
          },
          flowInteraction: {
            active: target.classList.contains('is-active'),
            input: document.querySelector('[data-module-flow] [data-flow-detail="input"]').textContent,
            control: document.querySelector('[data-module-flow] [data-flow-detail="control"]').textContent,
            output: document.querySelector('[data-module-flow] [data-flow-detail="output"]').textContent,
          },
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

console.log(JSON.stringify(result, null, 2));
if (result.viewport.scrollWidth > result.viewport.width + 1 || result.overlays.overlaps.some(Boolean)) process.exitCode = 2;
if (result.counts.bento !== 8 || result.counts.flow !== 5 || result.counts.hotspots !== 4 || result.counts.situations !== 6 || result.counts.connections !== 2) process.exitCode = 3;
if (!result.flowInteraction.active || result.flowInteraction.output !== 'Venda segue ao Comercial') process.exitCode = 4;
