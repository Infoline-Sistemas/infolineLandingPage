import http from 'node:http';

const port = process.argv[2] || '9343';
const pageFilter = process.argv[3] || '';
const viewportFilter = process.argv[4] || '';
const allExpectedPages = [
  'index.html', 'erp-para-industria.html', 'erp-para-importadores.html',
  'erp-para-atacado-distribuicao.html', 'pcpm.html', 'wms.html', 'compras.html',
  'custos.html', 'comercial.html', 'crm.html', 'ecommerce.html', 'financeiro.html',
  'integracao-whatsapp.html', 'contabilidade.html', 'controladoria.html', 'rh.html',
  'gestao-processos.html', 'solucoes.html', 'trabalhe-conosco.html',
  'politica-de-privacidade.html', 'politicadeprivacidade.html',
];
const expectedPages = pageFilter ? allExpectedPages.filter((page) => page.includes(pageFilter)) : allExpectedPages;
const viewportDefinitions = [
  ['mobile-320', 320, 568], ['mobile-360', 360, 640], ['mobile-390', 390, 844], ['mobile-430', 430, 932],
  ['tablet-768', 768, 1024], ['tablet-landscape-1024', 1024, 768], ['desktop-1080', 1080, 900],
  ['desktop-1366', 1366, 768], ['desktop-1440', 1440, 900], ['desktop-1920', 1920, 1080],
  ['bp-419', 419, 844], ['bp-420', 420, 844], ['bp-421', 421, 844],
  ['bp-429', 429, 844], ['bp-431', 431, 844],
  ['bp-639', 639, 900], ['bp-640', 640, 900], ['bp-641', 641, 900],
  ['bp-699', 699, 900], ['bp-700', 700, 900], ['bp-701', 701, 900],
  ['bp-719', 719, 900], ['bp-720', 720, 900], ['bp-721', 721, 900],
  ['bp-759', 759, 900], ['bp-760', 760, 900], ['bp-761', 761, 900],
  ['bp-899', 899, 900], ['bp-900', 900, 900], ['bp-901', 901, 900],
  ['bp-1023', 1023, 900], ['bp-1025', 1025, 900],
  ['bp-1079', 1079, 900], ['bp-1081', 1081, 900],
  ['bp-1179', 1179, 900], ['bp-1180', 1180, 900], ['bp-1181', 1181, 900],
  ['zoom-200-1440', 720, 450],
];
const viewports = viewportDefinitions
  .filter(([name]) => !viewportFilter || name.includes(viewportFilter))
  .map(([name, width, height]) => ({ name, width, height, mobile: width < 1024 }));

if (!expectedPages.length) throw new Error(`Nenhuma página corresponde ao filtro: ${pageFilter}`);
if (!viewports.length) throw new Error(`Nenhum viewport corresponde ao filtro: ${viewportFilter}`);

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (response) => {
      let body = '';
      response.on('data', (chunk) => { body += chunk; });
      response.on('end', () => resolve(JSON.parse(body)));
    }).on('error', reject);
  });
}

function inspect(tab, pageName, viewport) {
  return new Promise((resolve, reject) => {
    const socket = new WebSocket(tab.webSocketDebuggerUrl);
    const timeout = setTimeout(() => {
      socket.close();
      reject(new Error(`${viewport.name}/${pageName}: Chrome não respondeu em 20 segundos`));
    }, 20000);
    socket.addEventListener('open', () => socket.send(JSON.stringify({
      id: 1,
      method: 'Emulation.setDeviceMetricsOverride',
      params: { width: viewport.width, height: viewport.height, deviceScaleFactor: 1, mobile: viewport.mobile },
    })));
    socket.addEventListener('message', (event) => {
      const data = JSON.parse(event.data);
      if (data.id === 1) {
        socket.send(JSON.stringify({
          id: 2,
          method: 'Runtime.evaluate',
          params: {
            awaitPromise: true,
            returnByValue: true,
            expression: `(async () => {
              await new Promise((done) => setTimeout(done, 120));
              document.documentElement.style.scrollBehavior = 'auto';
              scrollTo(0, 0);
              await new Promise((done) => setTimeout(done, 50));
              const isVisible = (element) => {
                if (!element) return false;
                const style = getComputedStyle(element);
                const rect = element.getBoundingClientRect();
                return style.display !== 'none' && style.visibility !== 'hidden' && rect.width > 0 && rect.height > 0;
              };
              const isContained = (element) => {
                for (let parent = element.parentElement; parent && parent !== document.body && parent !== document.documentElement; parent = parent.parentElement) {
                  const style = getComputedStyle(parent);
                  if (/(auto|scroll|hidden|clip)/.test(style.overflowX)) {
                    const rect = parent.getBoundingClientRect();
                    if (rect.left >= -1 && rect.right <= innerWidth + 1) return true;
                  }
                }
                return false;
              };
              const leakingElements = Array.from(document.body.querySelectorAll('*')).filter((element) => {
                if (!isVisible(element) || element.closest('[data-mobile-nav]:not(.is-open)') || element.closest('.hp,[aria-hidden="true"]')) return false;
                const rect = element.getBoundingClientRect();
                if (rect.right <= innerWidth + 1 && rect.left >= -1) return false;
                return !isContained(element);
              }).slice(0, 8).map((element) => ({
                tag: element.tagName.toLowerCase(),
                className: typeof element.className === 'string' ? element.className : '',
                left: Math.round(element.getBoundingClientRect().left),
                right: Math.round(element.getBoundingClientRect().right),
              }));
              const brokenImages = Array.from(document.images)
                .filter((image) => image.complete && image.naturalWidth === 0)
                .map((image) => image.currentSrc || image.src);
              const product = document.querySelector('.module-system-hero-product');
              const productLabel = product?.querySelector('.mod-product-label');
              const screenStage = document.querySelector('.module-system-screen-stage');
              const screenLabel = screenStage?.querySelector('.module-system-illustrative-label');
              const labelState = (label, container) => {
                if (!label || !container) return null;
                const labelRect = label.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                return {
                  visible: isVisible(label),
                  contained: labelRect.left >= containerRect.left - 1 && labelRect.right <= containerRect.right + 1 && labelRect.top >= containerRect.top - 1 && labelRect.bottom <= containerRect.bottom + 1,
                };
              };
              const targetSelectors = ['.menu-button', '.mobile-group summary', '.module-system-flow-step', '.faq-item summary', '.mobile-cta-bar a', '.whatsapp-float'];
              const smallTargets = Array.from(document.querySelectorAll(targetSelectors.join(','))).filter(isVisible).filter((element) => {
                const rect = element.getBoundingClientRect();
                return rect.width < 24 || rect.height < 24;
              }).slice(0, 8).map((element) => ({ selector: element.matches('summary') ? 'summary' : element.className, width: Math.round(element.getBoundingClientRect().width), height: Math.round(element.getBoundingClientRect().height) }));
              const mobileCta = document.querySelector('.mobile-cta-bar');
              const whatsapp = document.querySelector('.whatsapp-float');
              const intersectingText = (overlay) => {
                if (!isVisible(overlay)) return [];
                const overlayRect = overlay.getBoundingClientRect();
                const candidates = new Set();
                const left = Math.max(0, Math.floor(overlayRect.left));
                const right = Math.min(innerWidth - 1, Math.ceil(overlayRect.right));
                const top = Math.max(0, Math.floor(overlayRect.top));
                const bottom = Math.min(innerHeight - 1, Math.ceil(overlayRect.bottom));
                for (let y = top; y <= bottom; y += 6) {
                  for (let x = left; x <= right; x += 6) {
                    const candidate = document.elementsFromPoint(x, y).find((element) => !element.closest('.whatsapp-float,.mobile-cta-bar'));
                    if (candidate && candidate !== document.body && candidate !== document.documentElement) candidates.add(candidate);
                  }
                }
                const matches = [];
                for (const candidate of candidates) {
                  const walker = document.createTreeWalker(candidate, NodeFilter.SHOW_TEXT);
                  while (walker.nextNode() && matches.length < 6) {
                    const node = walker.currentNode;
                    const parent = node.parentElement;
                    if (!node.textContent.trim() || !parent || parent.closest('.whatsapp-float,.mobile-cta-bar,[aria-hidden="true"]') || !isVisible(parent)) continue;
                    const range = document.createRange();
                    range.selectNodeContents(node);
                    const overlaps = Array.from(range.getClientRects()).some((rect) => rect.right > overlayRect.left && rect.left < overlayRect.right && rect.bottom > overlayRect.top && rect.top < overlayRect.bottom);
                    const text = node.textContent.trim().replace(/\\s+/g, ' ');
                    if (overlaps && !matches.includes(text)) matches.push(text);
                  }
                  if (matches.length >= 6) break;
                }
                return matches;
              };
              const whatsappOverlapTop = innerWidth >= 1024 ? intersectingText(whatsapp) : [];
              const brand = document.querySelector('.brand');
              const desktopNav = document.querySelector('.desktop-nav');
              const brandRect = brand?.getBoundingClientRect();
              const desktopRect = desktopNav?.getBoundingClientRect();
              let bottomOverlap = [];
              if (innerWidth < 1024 && mobileCta) {
                scrollTo(0, document.documentElement.scrollHeight);
                await new Promise((done) => setTimeout(done, 90));
                const ctaRect = mobileCta.getBoundingClientRect();
                if (ctaRect.top < innerHeight && ctaRect.bottom > 0) {
                  bottomOverlap = Array.from(document.querySelectorAll('.footer a,.footer button')).filter(isVisible).filter((element) => {
                    const rect = element.getBoundingClientRect();
                    return rect.bottom > ctaRect.top && rect.top < ctaRect.bottom;
                  }).map((element) => (element.textContent || element.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 6);
                }
                scrollTo(0, 0);
              }
              let whatsappOverlapBottom = [];
              if (innerWidth >= 1024 && whatsapp) {
                scrollTo(0, document.documentElement.scrollHeight);
                await new Promise((done) => setTimeout(done, 90));
                whatsappOverlapBottom = intersectingText(whatsapp);
                scrollTo(0, 0);
              }
              return JSON.stringify({
                readyState: document.readyState,
                width: innerWidth,
                scrollWidth: document.documentElement.scrollWidth,
                h1Count: document.querySelectorAll('h1').length,
                brokenImages,
                leakingElements,
                productLabel: labelState(productLabel, product),
                screenLabel: labelState(screenLabel, screenStage),
                smallTargets,
                menuButton: getComputedStyle(document.querySelector('.menu-button')).display,
                desktopNav: getComputedStyle(document.querySelector('.desktop-nav')).display,
                fixedControls: { mobileCta: isVisible(mobileCta), whatsapp: isVisible(whatsapp) },
                bottomOverlap,
                whatsappOverlapTop,
                whatsappOverlapBottom,
                headerCollision: isVisible(brand) && isVisible(desktopNav) && brandRect && desktopRect ? brandRect.right > desktopRect.left + 1 : false,
              });
            })()`,
          },
        }));
      }
      if (data.id !== 2) return;
      clearTimeout(timeout);
      socket.close();
      if (data.result?.exceptionDetails) reject(new Error(data.result.exceptionDetails.exception?.description || data.result.exceptionDetails.text));
      else resolve({ pageName, viewport, ...JSON.parse(data.result.result.value) });
    });
    socket.addEventListener('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
  });
}

const tabs = await getJson(`http://127.0.0.1:${port}/json`);
const failures = [];
for (const viewport of viewports) {
  const results = [];
  for (let index = 0; index < expectedPages.length; index += 4) {
    const batch = expectedPages.slice(index, index + 4);
    results.push(...await Promise.all(batch.map(async (pageName) => {
      const tab = tabs.find((item) => item.type === 'page' && item.url.endsWith(`/${pageName}`));
      if (!tab) {
        failures.push(`${viewport.name}/${pageName}: aba não encontrada`);
        return null;
      }
      return inspect(tab, pageName, viewport);
    })));
  }
  for (const result of results.filter(Boolean)) {
    const pageName = result.pageName;
    if (result.readyState !== 'complete') failures.push(`${viewport.name}/${pageName}: carregamento incompleto`);
    if (result.h1Count !== 1) failures.push(`${viewport.name}/${pageName}: esperado 1 H1; encontrado ${result.h1Count}`);
    if (result.scrollWidth > result.width + 1) failures.push(`${viewport.name}/${pageName}: overflow horizontal global (${result.scrollWidth}px > ${result.width}px)`);
    if (result.brokenImages.length) failures.push(`${viewport.name}/${pageName}: imagens quebradas: ${result.brokenImages.join(', ')}`);
    if (result.leakingElements.length) failures.push(`${viewport.name}/${pageName}: elementos escapam da viewport: ${JSON.stringify(result.leakingElements)}`);
    if (result.productLabel && (!result.productLabel.visible || !result.productLabel.contained)) failures.push(`${viewport.name}/${pageName}: selo ilustrativo do hero oculto ou cortado`);
    if (result.screenLabel && (!result.screenLabel.visible || !result.screenLabel.contained)) failures.push(`${viewport.name}/${pageName}: selo ilustrativo da tela principal oculto ou cortado`);
    if (result.smallTargets.length) failures.push(`${viewport.name}/${pageName}: alvos interativos menores que 24px: ${JSON.stringify(result.smallTargets)}`);
    if (viewport.mobile && result.menuButton === 'none') failures.push(`${viewport.name}/${pageName}: botão do menu móvel oculto`);
    if (!viewport.mobile && result.desktopNav === 'none') failures.push(`${viewport.name}/${pageName}: navegação desktop oculta`);
    if (result.fixedControls.mobileCta && result.fixedControls.whatsapp) failures.push(`${viewport.name}/${pageName}: CTA móvel e WhatsApp flutuante aparecem juntos`);
    if (result.bottomOverlap.length) failures.push(`${viewport.name}/${pageName}: CTA móvel cobre controles do rodapé: ${result.bottomOverlap.join(', ')}`);
    if (result.whatsappOverlapTop.length || result.whatsappOverlapBottom.length) failures.push(`${viewport.name}/${pageName}: WhatsApp flutuante cobre texto: ${[...result.whatsappOverlapTop, ...result.whatsappOverlapBottom].join(' | ')}`);
    if (result.headerCollision) failures.push(`${viewport.name}/${pageName}: logo e navegação do header colidem`);
  }
  process.stdout.write('.');
}

if (failures.length) {
  process.stdout.write('\n');
  console.error(`QA visual matricial falhou com ${failures.length} problema(s):`);
  failures.forEach((failure) => console.error(` - ${failure}`));
  process.exit(1);
}

process.stdout.write('\n');
console.log(`QA visual matricial ok: ${expectedPages.length} páginas em ${viewports.length} viewports, sem overflow, cortes, colisões ou imagens quebradas.`);
