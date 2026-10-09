import http from 'node:http';

const port = process.argv[2] || '9229';
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
const page = pages.find((item) => item.type === 'page' && item.url.includes('solucoes.html'));
if (!page) throw new Error('Soluções não encontrada no Chrome de QA.');

const result = await new Promise((resolve, reject) => {
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  socket.addEventListener('open', () => socket.send(JSON.stringify({ id: 1, method: 'Runtime.evaluate', params: { returnByValue: true, expression: `JSON.stringify({
    viewport:{width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth},
    hero:document.querySelector('.solutions-hero-inner').getBoundingClientRect().toJSON(),
    map:document.querySelector('.solutions-map').getBoundingClientRect().toJSON(),
    counts:{featured:document.querySelectorAll('.portal-feature').length,compact:document.querySelectorAll('.portal-module').length,areas:document.querySelectorAll('.portal-area').length,realityLinks:document.querySelectorAll('.solutions-reality a').length},
    links:Array.from(document.querySelectorAll('.portal-feature')).map((item)=>item.getAttribute('href'))
  })` } })));
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
if (result.viewport.scrollWidth > result.viewport.width + 1) process.exitCode = 2;
