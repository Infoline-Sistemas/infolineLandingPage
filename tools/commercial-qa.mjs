import http from 'node:http';

const port = process.argv[2] || '9225';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('comercial.html'));
if (!page) throw new Error('Comercial não encontrado no Chrome de QA.');

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
        const steps = Array.from(document.querySelectorAll('.commercial-flow-step'));
        const target = steps[1];
        target.dispatchEvent(new MouseEvent('mouseenter'));
        await new Promise((done) => setTimeout(done, 40));
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.commercial-hero .mod-hero-inner'),
          heroCopy: rect('.commercial-hero .mod-hero-inner > div:first-child'),
          heroProduct: rect('.commercial-hero-product'),
          responsive: {
            flowColumns: getComputedStyle(document.querySelector('.commercial-flow-track')).gridTemplateColumns,
            flowClientWidth: document.querySelector('.commercial-flow-track').clientWidth,
            flowScrollWidth: document.querySelector('.commercial-flow-track').scrollWidth,
            tableClientWidth: document.querySelector('.sales-screen-scroll').clientWidth,
            tableScrollWidth: document.querySelector('.sales-screen-scroll').scrollWidth,
          },
          counts: {
            bento: document.querySelectorAll('.commercial-cap-card').length,
            flow: steps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.commercial-situations article').length,
            connections: document.querySelectorAll('.commercial-eco-node').length,
          },
          flowInteraction: {
            active: target.classList.contains('is-active'),
            input: document.querySelector('[data-commercial-flow] [data-flow-detail="input"]').textContent,
            control: document.querySelector('[data-commercial-flow] [data-flow-detail="control"]').textContent,
            output: document.querySelector('[data-commercial-flow] [data-flow-detail="output"]').textContent,
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
