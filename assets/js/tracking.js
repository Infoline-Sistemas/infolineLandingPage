/** Métricas e campanhas opcionais, condicionadas às preferências do visitante. */
(function () {
  'use strict';
  var STORAGE_KEY = 'infoline_campaign_params';
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var AD_KEYS = ['gclid', 'gbraid', 'wbraid', 'fbclid'];
  var MAX_AGE = 90 * 24 * 60 * 60 * 1000;
  var cfg = window.INFOLINE_CONFIG || {};
  var loaded = {};
  var directGa = false;
  var pageTracked = false;
  var ready = document.readyState !== 'loading';
  function consent() { return window.infolineConsent ? window.infolineConsent.get() : { analytics: false, marketing: false }; }
  function enabled() { var c = consent(); return c.analytics || c.marketing; }

  // Não encaminhar nome, e-mail, telefone, mensagens ou URLs com dados de formulário.
  var fields = ['page_path', 'page_title', 'module', 'solution_group', 'label', 'href', 'navigation_area', 'form_id', 'channel'];
  function safeHref(value) {
    try {
      var url = new URL(value, location.href);
      if (url.protocol !== 'https:' && url.protocol !== 'http:') return url.protocol;
      return url.origin + url.pathname;
    } catch (e) { return undefined; }
  }
  function pushEvent(name, payload) {
    if (!enabled()) return;
    var data = {};
    fields.forEach(function (key) {
      if (!payload || payload[key] == null) return;
      data[key] = key === 'href' ? safeHref(payload[key]) : String(payload[key]).slice(0, 160);
    });
    window.dataLayer.push(Object.assign({ event: name }, data));
    if (directGa && consent().analytics) window.gtag('event', name, Object.assign({ send_to: cfg.ga4Id }, data));
  }
  window.infolineTrack = pushEvent;

  function allowedParams(data) {
    var c = consent();
    var keys = (c.analytics || c.marketing ? UTM_KEYS : []).concat(c.marketing ? AD_KEYS : []);
    var result = {};
    keys.forEach(function (key) { if (typeof data[key] === 'string') result[key] = data[key].slice(0, 250); });
    if (Object.keys(result).length) { result._ts = data._ts; result._landing = data._landing; }
    return result;
  }
  function getStoredParams() {
    try {
      var raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!enabled() || !raw || typeof raw._ts !== 'number' || Date.now() < raw._ts || Date.now() - raw._ts > MAX_AGE) {
        localStorage.removeItem(STORAGE_KEY);
        return {};
      }
      var filtered = allowedParams(raw);
      if (Object.keys(filtered).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      else localStorage.removeItem(STORAGE_KEY);
      return filtered;
    } catch (e) { return {}; }
  }
  window.infolineGetCampaignParams = getStoredParams;
  function captureParams() {
    getStoredParams();
    if (!enabled()) return;
    try {
      var url = new URL(location.href);
      var found = { _ts: Date.now(), _landing: location.pathname };
      UTM_KEYS.concat(AD_KEYS).forEach(function (key) { var value = url.searchParams.get(key); if (value) found[key] = value; });
      var filtered = allowedParams(found);
      if (Object.keys(filtered).length) localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (e) { /* sem armazenamento de campanha */ }
  }
  function injectScript(src) {
    var script = document.createElement('script');
    script.async = true;
    script.src = src;
    document.head.appendChild(script);
    window.infolineTrackingLoaded = true;
  }
  function loadTags() {
    var c = consent();
    if (!enabled()) return;
    if (/^GTM-[A-Z0-9]+$/.test(cfg.gtmId || '')) {
      if (!loaded.gtm) {
        loaded.gtm = true;
        window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
        injectScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(cfg.gtmId));
      }
    } else if (c.analytics && /^G-[A-Z0-9]+$/.test(cfg.ga4Id || '') && !loaded.ga) {
      loaded.ga = true;
      directGa = true;
      window.gtag('js', new Date());
      window.gtag('config', cfg.ga4Id, { send_page_view: false, page_location: location.origin + location.pathname, allow_google_signals: c.marketing, allow_ad_personalization_signals: c.marketing });
      injectScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4Id));
    }
    if (c.marketing && /^\d+$/.test(cfg.metaPixelId || '') && !loaded.meta) {
      loaded.meta = true;
      if (!window.fbq) {
        var fbq = window.fbq = function () { fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments); };
        window._fbq = fbq;
        fbq.push = fbq; fbq.loaded = true; fbq.version = '2.0'; fbq.queue = [];
      }
      window.fbq('init', cfg.metaPixelId);
      window.fbq('track', 'PageView');
      injectScript('https://connect.facebook.net/en_US/fbevents.js');
    }
  }
  function trackPage() {
    if (!ready || !enabled() || pageTracked) return;
    pageTracked = true;
    pushEvent('page_view', { page_path: location.pathname, page_title: document.title });
    var type = document.body.dataset.pageType;
    if (type === 'module') pushEvent('module_view', { module: document.body.dataset.module, solution_group: document.body.dataset.solutionGroup });
    else if (type === 'solutions') pushEvent('solution_view', { page_path: location.pathname });
  }
  function applyConsent(e) {
    captureParams();
    if (e && e.detail.reloading) return;
    loadTags();
    trackPage();
    if (enabled()) {
      var c = consent();
      window.dataLayer.push({ event: 'infoline_consent_update', analytics_storage: c.analytics ? 'granted' : 'denied', ad_storage: c.marketing ? 'granted' : 'denied', ad_user_data: c.marketing ? 'granted' : 'denied', ad_personalization: c.marketing ? 'granted' : 'denied' });
    }
  }
  document.addEventListener('infoline:consent', applyConsent);
  document.addEventListener('DOMContentLoaded', function () { ready = true; trackPage(); });
  applyConsent();

  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-track]');
    if (!el) return;
    pushEvent(el.getAttribute('data-track'), { label: el.getAttribute('data-label') || el.textContent.trim().slice(0, 80), href: el.getAttribute('href') || undefined });
  }, { passive: true });
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-nav-link], nav a');
    if (!el || el.hasAttribute('data-track')) return;
    var area = el.closest('.footer') ? 'footer' : el.closest('.mobile-nav') ? 'mobile' : el.closest('.breadcrumb') ? 'breadcrumb' : el.closest('.module-nav') ? 'module' : 'header';
    pushEvent('navigation_click', { label: el.textContent.trim().replace(/\s+/g, ' ').slice(0, 80), href: el.getAttribute('href') || undefined, navigation_area: area });
  }, { passive: true });
})();
