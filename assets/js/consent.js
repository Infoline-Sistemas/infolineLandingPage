/** Preferências locais e Consent Mode v2. Tags opcionais só carregam após escolha. */
(function () {
  'use strict';
  var KEY = 'infoline_cookie_consent';
  var VERSION = 1;
  var MAX_AGE = 180 * 24 * 60 * 60 * 1000;
  var state = { analytics: false, marketing: false };
  var decided = false;
  var opener;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  function googleState() {
    return {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    };
  }
  window.gtag('consent', 'default', googleState());
  window.gtag('set', 'ads_data_redaction', true);

  function clearOptionalStorage() {
    if (!state.analytics && !state.marketing) {
      try { localStorage.removeItem('infoline_campaign_params'); } catch (e) { /* armazenamento bloqueado */ }
    }
    var domains = ['', location.hostname];
    var parts = location.hostname.split('.');
    for (var i = 0; i < parts.length - 1; i++) domains.push('.' + parts.slice(i).join('.'));
    document.cookie.split(';').forEach(function (cookie) {
      var name = cookie.split('=')[0].trim();
      var analytics = /^_ga(?:_|$)|^_gid$|^_gat/.test(name);
      var marketing = /^_gcl_|^_fbp$|^_fbc$/.test(name);
      if ((analytics && !state.analytics) || (marketing && !state.marketing)) {
        domains.forEach(function (domain) {
          document.cookie = name + '=; Max-Age=0; path=/;' + (domain ? ' domain=' + domain + ';' : '');
        });
      }
    });
  }

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved && saved.version === VERSION && typeof saved.analytics === 'boolean' && typeof saved.marketing === 'boolean' && typeof saved.updatedAt === 'number' && Date.now() >= saved.updatedAt && Date.now() - saved.updatedAt < MAX_AGE) {
      state = { analytics: saved.analytics, marketing: saved.marketing };
      decided = true;
      window.gtag('consent', 'update', googleState());
    } else { localStorage.removeItem(KEY); }
  } catch (e) { /* segue com opcionais negados */ }
  clearOptionalStorage();

  function closeDialog() {
    var dialog = document.querySelector('[data-cookie-dialog]');
    if (dialog && dialog.open) dialog.close();
    if (opener) opener.focus();
  }
  function openDialog(trigger) {
    var dialog = document.querySelector('[data-cookie-dialog]');
    if (!dialog) return;
    opener = trigger || document.activeElement;
    dialog.querySelector('[data-cookie-analytics]').checked = state.analytics;
    dialog.querySelector('[data-cookie-marketing]').checked = state.marketing;
    dialog.showModal();
  }
  function save(choice) {
    var revoked = (state.analytics && !choice.analytics) || (state.marketing && !choice.marketing);
    state = { analytics: choice.analytics === true, marketing: choice.marketing === true };
    decided = true;
    try { localStorage.setItem(KEY, JSON.stringify({ version: VERSION, analytics: state.analytics, marketing: state.marketing, updatedAt: Date.now() })); } catch (e) { /* vale nesta página */ }
    window.gtag('consent', 'update', googleState());
    clearOptionalStorage();
    // Recarregar interrompe também scripts de terceiros já inicializados.
    var reload = revoked && window.infolineTrackingLoaded === true;
    document.dispatchEvent(new CustomEvent('infoline:consent', { detail: { analytics: state.analytics, marketing: state.marketing, reloading: reload } }));
    var banner = document.querySelector('[data-cookie-banner]');
    if (banner) banner.hidden = true;
    closeDialog();
    if (reload) location.reload();
  }
  window.infolineConsent = {
    get: function () { return { analytics: state.analytics, marketing: state.marketing, decided: decided }; },
    open: openDialog,
    save: save,
  };

  var banner = document.querySelector('[data-cookie-banner]');
  if (banner) banner.hidden = decided;
  document.addEventListener('click', function (e) {
    var settings = e.target.closest('[data-cookie-settings]');
    if (settings) { openDialog(settings); return; }
    if (e.target.closest('[data-cookie-close]')) { closeDialog(); return; }
    var action = e.target.closest('[data-cookie-action]');
    if (!action) return;
    if (action.dataset.cookieAction === 'accept') save({ analytics: true, marketing: true });
    else if (action.dataset.cookieAction === 'reject') save({ analytics: false, marketing: false });
    else if (action.dataset.cookieAction === 'save') {
      var dialog = document.querySelector('[data-cookie-dialog]');
      save({ analytics: dialog.querySelector('[data-cookie-analytics]').checked, marketing: dialog.querySelector('[data-cookie-marketing]').checked });
    }
  });
  window.addEventListener('storage', function (e) { if (e.key === KEY) location.reload(); });
})();
