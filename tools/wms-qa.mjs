import http from 'node:http';

const port = process.argv[2] || '9227';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('wms.html'));
if (!page) throw new Error('WMS não encontrado no Chrome de QA.');

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
        const steps = Array.from(document.querySelectorAll('.wms-flow-step'));
        const target = steps[3];
        target.dispatchEvent(new MouseEvent('mouseenter'));
        await new Promise((done) => setTimeout(done, 40));
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.wms-hero .mod-hero-inner'),
          heroCopy: rect('.wms-hero .mod-hero-inner > div:first-child'),
          heroProduct: rect('.wms-hero-product'),
          responsive: {
            flowColumns: getComputedStyle(document.querySelector('.wms-flow-track')).gridTemplateColumns,
            flowClientWidth: document.querySelector('.wms-flow-track').clientWidth,
            flowScrollWidth: document.querySelector('.wms-flow-track').scrollWidth,
            tableClientWidth: document.querySelector('.wms-screen-scroll').clientWidth,
            tableScrollWidth: document.querySelector('.wms-screen-scroll').scrollWidth,
          },
          counts: {
            bento: document.querySelectorAll('.wms-cap-card').length,
            flow: steps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.wms-situations article').length,
            connections: document.querySelectorAll('.wms-eco-node').length,
          },
          flowInteraction: {
            active: target.classList.contains('is-active'),
            input: document.querySelector('[data-wms-flow] [data-flow-detail="input"]').textContent,
            control: document.querySelector('[data-wms-flow] [data-flow-detail="control"]').textContent,
            output: document.querySelector('[data-wms-flow] [data-flow-detail="output"]').textContent,
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
