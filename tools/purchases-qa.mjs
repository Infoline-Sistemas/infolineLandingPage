import http from 'node:http';

const port = process.argv[2] || '9230';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('compras.html'));
if (!page) throw new Error('Compras não encontrada no Chrome de QA.');

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
        const orderRect = document.querySelector('.buy-order').getBoundingClientRect();
        const floatRects = Array.from(document.querySelectorAll('.buy-float')).map((item) => item.getBoundingClientRect());
        const overlapsOrder = floatRects.map((item) => !(item.right <= orderRect.left || item.left >= orderRect.right || item.bottom <= orderRect.top || item.top >= orderRect.bottom));
        const steps = Array.from(document.querySelectorAll('.purchases-flow-step'));
        const target = steps[3];
        target.click();
        await new Promise((done) => setTimeout(done, 40));
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.purchases-hero .mod-hero-inner'),
          heroCopy: rect('.purchases-hero .mod-hero-inner > div:first-child'),
          heroProduct: rect('.purchases-hero-product'),
          overlays: { order: orderRect.toJSON(), floats: floatRects.map((item) => item.toJSON()), overlapsOrder },
          responsive: {
            flowColumns: getComputedStyle(document.querySelector('.purchases-flow-track')).gridTemplateColumns,
            flowClientWidth: document.querySelector('.purchases-flow-track').clientWidth,
            flowScrollWidth: document.querySelector('.purchases-flow-track').scrollWidth,
            tableClientWidth: document.querySelector('.buy-screen-scroll').clientWidth,
            tableScrollWidth: document.querySelector('.buy-screen-scroll').scrollWidth,
            tableMinWidth: getComputedStyle(document.querySelector('.buy-screen-table')).minWidth,
          },
          counts: {
            bento: document.querySelectorAll('.purchases-cap-card').length,
            flow: steps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.purchases-situations article').length,
            connections: document.querySelectorAll('.purchases-eco-node').length,
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
if (result.viewport.scrollWidth > result.viewport.width + 1) process.exitCode = 2;
if (result.counts.bento !== 8 || result.counts.flow !== 5 || result.counts.hotspots !== 4 || result.counts.situations !== 6 || result.counts.connections !== 4) process.exitCode = 3;
if (!result.flowInteraction.active || result.flowInteraction.control !== 'Itens, valores e entrega') process.exitCode = 4;
