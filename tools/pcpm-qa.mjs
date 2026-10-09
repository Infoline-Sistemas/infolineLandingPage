import http from 'node:http';

const port = process.argv[2] || '9224';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('pcpm.html'));
if (!page) throw new Error('PCPM não encontrado no Chrome de QA.');

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
        const flowSteps = Array.from(document.querySelectorAll('.pcpm-flow-step'));
        const target = flowSteps[4];
        target.dispatchEvent(new MouseEvent('mouseenter'));
        await new Promise((done) => setTimeout(done, 40));
        return JSON.stringify({
          viewport: { width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth },
          hero: rect('.pcpm-hero .mod-hero-inner'),
          heroCopy: rect('.pcpm-hero .mod-hero-inner > div:first-child'),
          heroProduct: rect('.pcpm-hero-product'),
          heroLayout: {
            gridAlignItems: getComputedStyle(document.querySelector('.pcpm-hero .mod-hero-inner')).alignItems,
            copyDisplay: getComputedStyle(document.querySelector('.pcpm-hero .mod-hero-inner > div:first-child')).display,
            copyChildren: Array.from(document.querySelector('.pcpm-hero .mod-hero-inner > div:first-child').children).map((item) => ({
              tag: item.tagName,
              className: item.className,
              height: item.getBoundingClientRect().height,
              top: item.getBoundingClientRect().top,
              bottom: item.getBoundingClientRect().bottom,
            })),
          },
          counts: {
            bento: document.querySelectorAll('.pcpm-cap-card').length,
            flow: flowSteps.length,
            hotspots: document.querySelectorAll('.module-system-hotspot').length,
            situations: document.querySelectorAll('.pcpm-situations article').length,
            connections: document.querySelectorAll('.pcpm-eco-node').length,
          },
          flowInteraction: {
            active: target.classList.contains('is-active'),
            input: document.querySelector('[data-flow-detail="input"]').textContent,
            control: document.querySelector('[data-flow-detail="control"]').textContent,
            output: document.querySelector('[data-flow-detail="output"]').textContent,
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
