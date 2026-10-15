/**
 * assets/js/forms.js
 * Centraliza o envio de lead em submitLead(): validação, UTMs/click IDs,
 * consentimento e tracking. Não há endpoint fictício: se
 * Usa o endpoint próprio ou a integração Web3Forms já existente.
 * Sem ambos, abre um e-mail sem confirmar um recebimento inexistente.
 */
(function () {
  'use strict';

  function setStatus(form, kind, message) {
    var box = form.querySelector('[data-form-status]');
    if (!box) return;
    box.className = 'form-status is-visible form-status--' + kind;
    box.textContent = message;
  }

  function validate(form) {
    var ok = true;
    var firstInvalid = null;
    form.querySelectorAll('[data-field]').forEach(function (field) {
      var input = field.querySelector('input, textarea, select');
      if (!input) return;
      var valid = input.checkValidity() && (!input.required || input.type === 'checkbox' || input.value.trim().length > 0);
      field.classList.toggle('has-error', !valid);
      if (valid) input.removeAttribute('aria-invalid');
      else {
        input.setAttribute('aria-invalid', 'true');
        if (!firstInvalid) firstInvalid = input;
        ok = false;
      }
    });
    if (firstInvalid) firstInvalid.focus();
    return ok;
  }

  function prepareValidation(form) {
    form.querySelectorAll('[data-field]').forEach(function (field, index) {
      var input = field.querySelector('input, textarea, select');
      var error = field.querySelector('.field-error');
      if (!input) return;
      if (error) {
        if (!error.id) error.id = (form.id || 'form') + '-error-' + (index + 1);
        var describedBy = (input.getAttribute('aria-describedby') || '').split(/\s+/).filter(Boolean);
        if (describedBy.indexOf(error.id) === -1) describedBy.push(error.id);
        input.setAttribute('aria-describedby', describedBy.join(' '));
      }
      function clearIfValid() {
        if (!input.checkValidity()) return;
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
      }
      input.addEventListener('input', clearIfValid);
      input.addEventListener('change', clearIfValid);
    });
  }

  async function submitLead(form) {
    var cfg = window.INFOLINE_CONFIG || {};
    var data = {};
    new FormData(form).forEach(function (v, k) { if (k !== 'website') data[k] = v; }); // "website" = honeypot

    // honeypot: se preenchido, aborta silenciosamente (provável bot)
    var hp = form.querySelector('input[name="website"]');
    if (hp && hp.value) return { ok: false, skipped: true };

    Object.assign(data, window.infolineGetCampaignParams ? window.infolineGetCampaignParams() : {});
    data.page = window.location.origin + window.location.pathname;
    data.submitted_at = new Date().toISOString();

    if (window.infolineTrack) window.infolineTrack('form_submit', { form_id: form.id || 'contato' });
    if (window.infolineTrack) window.infolineTrack('demo_request', { form_id: form.id || 'contato' });

    if (!cfg.leadEndpoint && !cfg.web3formsAccessKey) {
      // Sem endpoint configurado ainda: prepara um e-mail com os dados para
      // não confirmar um envio que não aconteceu.
      var subject = encodeURIComponent('Solicitação de contato — site Infoline');
      var lines = encodeURIComponent(Object.keys(data).map(function (k) { return k + ': ' + data[k]; }).join('\r\n'));
      window.location.href = 'mailto:' + (cfg.leadCcEmail || 'comercial@infolinesystems.com.br') + '?subject=' + subject + '&body=' + lines;
      return { ok: true, fallback: 'mailto' };
    }

    if (!cfg.leadEndpoint) {
      var web3Data = new FormData();
      Object.keys(data).forEach(function (key) { web3Data.append(key, data[key]); });
      web3Data.append('access_key', cfg.web3formsAccessKey);
      web3Data.append('subject', 'Solicitação de demonstração — site Infoline');
      web3Data.append('from_name', 'Site Infoline');
      var web3Response = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: web3Data });
      var web3Result = await web3Response.json();
      if (!web3Response.ok || web3Result.success !== true) throw new Error('Falha no envio do formulário');
      return { ok: true };
    }
    var res = await fetch(cfg.leadEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Falha no envio (HTTP ' + res.status + ')');
    if ((res.headers.get('content-type') || '').includes('application/json')) {
      var result = await res.json();
      if (result.success === false || result.ok === false) throw new Error('Solicitação recusada pelo endpoint');
    }
    return { ok: true };
  }
  window.submitLead = submitLead;

  document.querySelectorAll('form[data-lead-form]').forEach(function (form) {
    prepareValidation(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) {
        setStatus(form, 'err', 'Verifique os campos destacados antes de enviar.');
        return;
      }
      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;
      setStatus(form, 'pending', 'Enviando sua solicitação…');
      var btn = form.querySelector('[type="submit"]');
      if (btn) { btn.disabled = true; btn.dataset.originalText = btn.textContent; btn.textContent = 'Enviando…'; }

      submitLead(form)
        .then(function (r) {
          if (r.skipped) return;
          if (r.fallback === 'mailto') {
            setStatus(form, 'ok', 'Abrimos seu aplicativo de e-mail com os dados preenchidos. Se preferir, chame no WhatsApp.');
            if (window.infolineTrack) window.infolineTrack('lead_handoff', { form_id: form.id || 'contato', channel: 'mailto' });
          } else {
            setStatus(form, 'ok', 'Recebemos sua solicitação. Nossa equipe entra em contato em breve.');
            form.reset();
            if (window.infolineTrack) window.infolineTrack('generate_lead', { form_id: form.id || 'contato' });
          }
        })
        .catch(function () {
          setStatus(form, 'err', 'Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.');
        })
        .finally(function () {
          if (btn) { btn.disabled = false; btn.textContent = btn.dataset.originalText; }
        });
    });

    form.addEventListener('focusin', function (e) {
      if (e.target.matches('input, textarea, select') && !form.dataset.startTracked) {
        form.dataset.startTracked = '1';
        if (window.infolineTrack) window.infolineTrack('form_start', { form_id: form.id || 'contato' });
      }
    });
  });

  // ---- formulários que concluem no WhatsApp (ex.: trabalhe conosco) ------
  document.querySelectorAll('form[data-whatsapp-form]').forEach(function (form) {
    prepareValidation(form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate(form)) {
        setStatus(form, 'err', 'Verifique os campos destacados antes de continuar.');
        return;
      }
      var cfg = window.INFOLINE_CONFIG || {};
      var fd = new FormData(form);
      var honeypot = form.querySelector('input[name="website"]');
      if (honeypot && honeypot.value) return;
      var labels = JSON.parse(form.dataset.fieldLabels || '{}');
      var lines = [];
      fd.forEach(function (v, k) {
        if (!v || k === 'website') return;
        lines.push((labels[k] || k) + ': ' + v);
      });
      if (window.infolineTrack) window.infolineTrack('form_submit', { form_id: form.id || 'trabalhe-conosco' });
      var url = 'https://wa.me/' + (cfg.whatsapp || '') + '?text=' + encodeURIComponent(lines.join('\n'));
      window.open(url, '_blank', 'noopener');
      setStatus(form, 'ok', 'Continue no WhatsApp e confirme o envio da sua candidatura.');
      if (window.infolineTrack) window.infolineTrack('lead_handoff', { form_id: form.id || 'trabalhe-conosco', channel: 'whatsapp' });
    });
    form.addEventListener('focusin', function (e) {
      if (e.target.matches('input, textarea, select') && !form.dataset.startTracked) {
        form.dataset.startTracked = '1';
        if (window.infolineTrack) window.infolineTrack('form_start', { form_id: form.id || 'trabalhe-conosco' });
      }
    });
  });
})();
