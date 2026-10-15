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
const page = pages.find((item) => item.type === 'page' && item.url.includes('index.html'));
if (!page) throw new Error('Home não encontrada no Chrome de QA.');

const result = await new Promise((resolve, reject) => {
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  socket.addEventListener('open', () => {
    socket.send(JSON.stringify({
      id: 1,
      method: 'Runtime.evaluate',
      params: {
        awaitPromise: true,
        returnByValue: true,
        expression: `(async () => {
          const ids = ['solucoes', 'em-acao', 'necessidades', 'integracao', 'por-que', 'quem-somos', 'contato'];
          const order = ids.map((id) => ({ id, top: document.getElementById(id)?.offsetTop ?? -1 }));
          const imageStyle = getComputedStyle(document.querySelector('.reality-card img'));
          const cardStyle = getComputedStyle(document.querySelector('.reality-card'));
          const ecosystem = document.querySelector('[data-saturn-scene]');
          ecosystem.scrollIntoView({ block: 'center' });
          await new Promise((done) => setTimeout(done, 180));
          const production = Array.from(ecosystem.querySelectorAll('.eco-solution')).find((node) => node.textContent.includes('Produção'));
          const initialLeft = production.style.left;
          await new Promise((done) => setTimeout(done, 220));
          const moved = production.style.left !== initialLeft;
          production.dispatchEvent(new MouseEvent('mouseenter'));
          await new Promise((done) => setTimeout(done, 60));
          const title = ecosystem.querySelector('[data-eco-event] [data-eco-title]').textContent;
          const flow = ecosystem.querySelector('[data-eco-event] [data-eco-flow]').textContent;
          const canvas = ecosystem.querySelector('.eco-canvas');
          const frontCount = ecosystem.querySelectorAll('.eco-solution.is-front').length;
          production.dispatchEvent(new MouseEvent('mouseleave'));
          return JSON.stringify({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth,
            order,
            realityCardTransition: cardStyle.transitionProperty,
            realityImageTransition: imageStyle.transitionProperty,
            realityImageDuration: imageStyle.transitionDuration,
            ecosystem: { title, flow, moved, frontCount, canvasWidth: canvas.width, canvasHeight: canvas.height },
          });
        })()`,
      },
    }));
  });
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.id !== 1) return;
    socket.close();
    if (data.result?.exceptionDetails) reject(new Error(data.result.exceptionDetails.text));
    else resolve(JSON.parse(data.result.result.value));
  });
  socket.addEventListener('error', reject);
});

console.log(JSON.stringify(result, null, 2));
