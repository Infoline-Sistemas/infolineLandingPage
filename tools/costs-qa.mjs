import http from 'node:http';

const port = process.argv[2] || '9271';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('custos.html'));
if (!page) throw new Error('Gestão de Custos não encontrada no Chrome de QA.');

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
        const panel = document.querySelector('.cost-product').getBoundingClientRect();
        const notes = Array.from(document.querySelectorAll('.cost-note')).map((item) => item.getBoundingClientRect());
        const overlaps = notes.map((item) => !(item.right <= panel.left || item.left >= panel.right || item.bottom <= panel.top || item.top >= panel.bottom));
        const steps = Array.from(document.querySelectorAll('.costs-flow-step'));
        const target = steps[3];
        target.click();
        await new Promise((done) => setTimeout(done, 40));
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.costs-hero .mod-hero-inner'),
          heroProduct: rect('.costs-hero-product'),
          overlays: { panel: panel.toJSON(), notes: notes.map((item) => item.toJSON()), overlaps },
          responsive: {
            flowColumns: getComputedStyle(document.querySelector('.costs-flow-track')).gridTemplateColumns,
            flowClientWidth: document.querySelector('.costs-flow-track').clientWidth,
            flowScrollWidth: document.querySelector('.costs-flow-track').scrollWidth,
            screenClientWidth: document.querySelector('.cost-screen-layout').clientWidth,
            screenScrollWidth: document.querySelector('.cost-screen-layout').scrollWidth,
          },
          counts: {
            bento: document.querySelectorAll('.costs-cap-card').length,
            flow: steps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.costs-situations article').length,
            connections: document.querySelectorAll('.costs-eco-node').length,
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
if (result.counts.bento !== 8 || result.counts.flow !== 5 || result.counts.hotspots !== 4 || result.counts.situations !== 6 || result.counts.connections !== 3) process.exitCode = 3;
if (!result.flowInteraction.active || result.flowInteraction.control !== 'Formação e regras') process.exitCode = 4;
