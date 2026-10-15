import http from 'node:http';
import fs from 'node:fs';

const port = process.argv[2] || '9224';
const match = process.argv[3] || 'financeiro';
const viewportWidth = Number(process.argv[4] || 0);
const viewportHeight = Number(process.argv[5] || 0);
const screenshotPath = process.argv[6] || '';

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
const page = pages.find((item) => item.type === 'page' && item.url.includes(match));
if (!page) throw new Error(`Página contendo "${match}" não encontrada.`);

const result = await new Promise((resolve, reject) => {
  const socket = new WebSocket(page.webSocketDebuggerUrl);
  let resultMetrics;
  const evaluate = () => {
    socket.send(JSON.stringify({
      id: 2,
      method: 'Runtime.evaluate',
      params: {
        awaitPromise: true,
        returnByValue: true,
        expression: `(async () => {
          await new Promise((done) => setTimeout(done, 700));
          if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
          else scrollTo(0, 0);
          await new Promise((done) => setTimeout(done, 500));
          if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView();
          else scrollTo(0, 0);
          await new Promise((done) => setTimeout(done, 120));
          const heroLayout = document.querySelector('.mod-hero-inner, .hero-inner, .solutions-hero-inner');
          const menuButton = document.querySelector('.menu-button');
          return JSON.stringify({
          innerWidth,
          innerHeight,
          devicePixelRatio,
          scrollY,
          scrollWidth: document.documentElement.scrollWidth,
          target: document.getElementById(location.hash.slice(1))?.getBoundingClientRect().toJSON(),
          hero: document.querySelector('.mod-hero-inner, .hero-inner, .solutions-hero-inner')?.getBoundingClientRect().toJSON(),
          product: document.querySelector('.mod-hero-product, .hero-visual, .solutions-map')?.getBoundingClientRect().toJSON(),
          grid: heroLayout ? getComputedStyle(heroLayout).gridTemplateColumns : null,
          menu: menuButton ? getComputedStyle(menuButton).display : null,
          mockBackground: document.querySelector('.m-win') ? getComputedStyle(document.querySelector('.m-win')).backgroundColor : null
          ,heroCashflow: document.querySelector('.hero-ui-foot b') ? {
            text: document.querySelector('.hero-ui-foot b').textContent,
            clientWidth: document.querySelector('.hero-ui-foot b').clientWidth,
            scrollWidth: document.querySelector('.hero-ui-foot b').scrollWidth
          } : null
          ,saturnCanvas: document.querySelector('.eco-canvas') ? {
            width: document.querySelector('.eco-canvas').width,
            height: document.querySelector('.eco-canvas').height
          } : null
        });
        })()`,
      },
    }));
  };
  socket.addEventListener('open', () => {
    if (viewportWidth && viewportHeight) {
      socket.send(JSON.stringify({
        id: 1,
        method: 'Emulation.setDeviceMetricsOverride',
        params: { width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1, mobile: true },
      }));
    } else {
      evaluate();
    }
  });
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.id === 1) {
      evaluate();
      return;
    }
    if (data.id === 2) {
      if (data.result?.exceptionDetails) {
        socket.close();
        reject(new Error(data.result.exceptionDetails.exception?.description || data.result.exceptionDetails.text || 'Falha ao avaliar a página.'));
        return;
      }
      const value = data.result?.result?.value;
      if (typeof value !== 'string') {
        socket.close();
        reject(new Error('A avaliação do navegador não retornou métricas em JSON.'));
        return;
      }
      const metrics = JSON.parse(value);
      if (!screenshotPath) {
        socket.close();
        resolve(metrics);
        return;
      }
      socket.send(JSON.stringify({ id: 3, method: 'Page.captureScreenshot', params: { format: 'png', fromSurface: true } }));
      resultMetrics = metrics;
      return;
    }
    if (data.id === 3) {
      fs.writeFileSync(screenshotPath, Buffer.from(data.result.data, 'base64'));
      socket.close();
      resolve(resultMetrics);
    }
  });
  socket.addEventListener('error', reject);
});

console.log(JSON.stringify(result, null, 2));
if (result.scrollWidth > result.innerWidth + 1) process.exitCode = 2;
