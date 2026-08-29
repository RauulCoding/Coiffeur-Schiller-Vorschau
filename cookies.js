// ============================================================
// COOKIE-/EINWILLIGUNGSVERWALTUNG
// Steuert das Nachladen von Google Fonts und Calendly erst nach
// Zustimmung. Speicherung der Auswahl in localStorage.
// ============================================================
(function () {
  const CONSENT_KEY = 'cs_consent_v1';

  function readConsent() {
    try {
      const raw = localStorage.getItem(CONSENT_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  function writeConsent(consent) {
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(consent)); } catch (e) {}
  }

  function loadGoogleFonts() {
    if (document.getElementById('googleFontsLink')) return;
    const preconnect1 = document.createElement('link');
    preconnect1.rel = 'preconnect';
    preconnect1.href = 'https://fonts.googleapis.com';
    const preconnect2 = document.createElement('link');
    preconnect2.rel = 'preconnect';
    preconnect2.href = 'https://fonts.gstatic.com';
    preconnect2.crossOrigin = 'anonymous';
    const fontLink = document.createElement('link');
    fontLink.id = 'googleFontsLink';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;1,9..144,400&family=Jost:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap';
    document.head.appendChild(preconnect1);
    document.head.appendChild(preconnect2);
    document.head.appendChild(fontLink);
  }

  function loadCalendly() {
    const placeholder = document.getElementById('bookingPlaceholder');
    const embed = document.getElementById('bookingEmbed');
    if (!embed || document.getElementById('calendlyScript')) return;
    if (placeholder) placeholder.remove();

    const widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', 'https://calendly.com/raulcolac2008/termin-buchen?hide_event_type_details=1&hide_gdpr_banner=1&background_color=f7f1e4&text_color=201f1c&primary_color=ad8d47');
    widget.style.minWidth = '280px';
    widget.style.height = '780px';
    embed.appendChild(widget);

    const script = document.createElement('script');
    script.id = 'calendlyScript';
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }

  function applyConsent(consent) {
    if (consent.fonts) loadGoogleFonts();
    if (consent.calendly) loadCalendly();
  }

  const banner = document.getElementById('cookieBanner');
  const modal = document.getElementById('cookieModal');
  const toggleFonts = document.getElementById('toggleFonts');
  const toggleCalendly = document.getElementById('toggleCalendly');

  function hideBanner() { banner.hidden = true; modal.hidden = true; }
  function currentToggleState() { return { fonts: !!toggleFonts.checked, calendly: !!toggleCalendly.checked }; }
  function setToggles(consent) { toggleFonts.checked = !!consent.fonts; toggleCalendly.checked = !!consent.calendly; }

  const existing = readConsent();
  if (existing) {
    applyConsent(existing);
    if (toggleFonts && toggleCalendly) setToggles(existing);
  } else if (banner) {
    banner.hidden = false;
  }

  const btn = (id) => document.getElementById(id);

  if (btn('cookieAcceptAll')) btn('cookieAcceptAll').addEventListener('click', () => {
    const consent = { fonts: true, calendly: true, ts: new Date().toISOString() };
    writeConsent(consent); applyConsent(consent); if (toggleFonts) setToggles(consent); hideBanner();
  });

  if (btn('cookieRejectAll')) btn('cookieRejectAll').addEventListener('click', () => {
    const consent = { fonts: false, calendly: false, ts: new Date().toISOString() };
    writeConsent(consent); if (toggleFonts) setToggles(consent); hideBanner();
  });

  if (btn('cookieRejectAllModal')) btn('cookieRejectAllModal').addEventListener('click', () => {
    const consent = { fonts: false, calendly: false, ts: new Date().toISOString() };
    writeConsent(consent); if (toggleFonts) setToggles(consent); hideBanner();
  });

  if (btn('cookieOpenSettings')) btn('cookieOpenSettings').addEventListener('click', () => { modal.hidden = false; });

  if (btn('openCookieSettings')) btn('openCookieSettings').addEventListener('click', () => {
    const c = readConsent() || { fonts: false, calendly: false };
    if (toggleFonts) setToggles(c);
    banner.hidden = false;
    modal.hidden = false;
  });

  if (btn('cookieSaveSettings')) btn('cookieSaveSettings').addEventListener('click', () => {
    const consent = Object.assign(currentToggleState(), { ts: new Date().toISOString() });
    writeConsent(consent); applyConsent(consent); hideBanner();
  });

  const loadCalendlyBtn = btn('loadCalendlyBtn');
  if (loadCalendlyBtn) {
    loadCalendlyBtn.addEventListener('click', () => {
      const consent = Object.assign(readConsent() || { fonts: false }, { calendly: true, ts: new Date().toISOString() });
      writeConsent(consent); applyConsent(consent); if (toggleFonts) setToggles(consent);
    });
  }
})();
