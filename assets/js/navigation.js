/**
 * assets/js/navigation.js
 * Header, mega menu, navegação mobile, combo "Sou cliente", barra mobile de CTA.
 */
(function () {
  'use strict';

  // Preserva links com âncoras do site anterior.
  if (document.body.dataset.pageType === 'home') {
    var legacyAnchors = { inicio: 'topo', segmentos: 'solucoes', modulos: 'necessidades', diferenciais: 'por-que', empresa: 'quem-somos' };
    var targetId = legacyAnchors[location.hash.slice(1)];
    if (targetId) {
      history.replaceState(null, '', location.pathname + location.search + '#' + targetId);
      var target = document.getElementById(targetId);
      if (target) target.scrollIntoView();
    }
  }

  var header = document.querySelector('[data-header]');
  var menuToggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  var scrim = document.querySelector('[data-nav-scrim]');
  var ctaBar = document.querySelector('[data-mobile-cta]');

  // ---- header: sombra ao rolar ----------------------------------------
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 8) header.setAttribute('data-scrolled', '');
    else header.removeAttribute('data-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- barra fixa mobile: some ao rolar para baixo, volta ao subir -----
  if (ctaBar) {
    var lastY = window.scrollY, ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        if (y > lastY + 6 && y > 140) ctaBar.setAttribute('data-hidden', '');
        else if (y < lastY - 6) ctaBar.removeAttribute('data-hidden');
        lastY = y; ticking = false;
      });
    }, { passive: true });
  }

  // ---- menu mobile -------------------------------------------------------
  function openMobileNav() {
    if (!mobileNav || !scrim || !menuToggle) return;
    mobileNav.inert = false;
    mobileNav.classList.add('is-open');
    scrim.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    var first = mobileNav.querySelector('summary, a, button');
    if (first) requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        if (mobileNav.classList.contains('is-open')) first.focus();
      });
    });
  }
  function closeMobileNav(restoreFocus) {
    if (!mobileNav || !scrim || !menuToggle) return;
    if (restoreFocus === undefined) restoreFocus = true;
    var wasOpen = mobileNav.classList.contains('is-open');
    mobileNav.classList.remove('is-open');
    scrim.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.inert = true;
    document.body.style.overflow = '';
    if (wasOpen && restoreFocus) menuToggle.focus();
  }
  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      var open = menuToggle.getAttribute('aria-expanded') === 'true';
      if (open) closeMobileNav(); else openMobileNav();
    });
  }
  if (scrim) scrim.addEventListener('click', closeMobileNav);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeMobileNav();
    if (e.key === 'Tab' && mobileNav && mobileNav.classList.contains('is-open')) {
      var focusable = [menuToggle].concat(Array.prototype.slice.call(mobileNav.querySelectorAll('a, button, summary, input, select, textarea, [tabindex]:not([tabindex="-1"])')));
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  // Fecha o menu mobile ao redimensionar para desktop
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) closeMobileNav(false);
  });

  // ---- mega menu: clique + teclado (além do :hover em CSS) --------------
  document.querySelectorAll('.nav-link--mega').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.nav-link--mega').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
    });
    btn.closest('.has-mega').addEventListener('focusout', function (e) {
      if (!e.currentTarget.contains(e.relatedTarget)) btn.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-mega')) {
      document.querySelectorAll('.nav-link--mega').forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
    }
  });

  // ---- combo "Sou cliente" ----------------------------------------------
  document.querySelectorAll('.client-combo').forEach(function (combo) {
    var trigger = combo.querySelector('.client-combo-trigger');
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = combo.classList.contains('is-open');
      document.querySelectorAll('.client-combo.is-open').forEach(function (c) {
        c.classList.remove('is-open');
        c.querySelector('.client-combo-trigger').setAttribute('aria-expanded', 'false');
      });
      if (!open) { combo.classList.add('is-open'); trigger.setAttribute('aria-expanded', 'true'); }
      else { trigger.setAttribute('aria-expanded', 'false'); }
    });
    combo.addEventListener('focusout', function (e) {
      if (combo.contains(e.relatedTarget)) return;
      combo.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
    });
  });
  document.addEventListener('click', function () {
    document.querySelectorAll('.client-combo.is-open').forEach(function (c) {
      c.classList.remove('is-open');
      c.querySelector('.client-combo-trigger').setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    document.querySelectorAll('.nav-link--mega[aria-expanded="true"]').forEach(function (btn) {
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    });
    document.querySelectorAll('.client-combo.is-open').forEach(function (combo) {
      combo.classList.remove('is-open');
      var trigger = combo.querySelector('.client-combo-trigger');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    });
  });

  // ---- fecha menus ao navegar por âncora ---------------------------------
  document.querySelectorAll('a[href*="#"]').forEach(function (a) {
    a.addEventListener('click', function () { closeMobileNav(); });
  });
})();
