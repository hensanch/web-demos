/* Apartmány Vesna – shared behaviour: language, menu, bottom bar, house index, map, form, gallery. */
(function () {
  'use strict';
  var html = document.documentElement;
  var D = window.VESNA_I18N || {};
  var LANGS = ['cs', 'en', 'de'];
  var REZ = 'https://booking.previo.cz/?hotId=773015';

  /* Touch never shows a focus ring, keyboard always does. */
  document.addEventListener('pointerdown', function () { html.classList.add('dotyk'); }, true);
  document.addEventListener('keydown', function (e) {
    if (/^(Tab|Arrow|Enter| |Escape)/.test(e.key)) html.classList.remove('dotyk');
  }, true);

  /* ---------- language ---------- */
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var origHtml = new Map(), origAttr = new Map();
  function t(key, fallback) { var l = html.lang; return (l !== 'cs' && D[l] && D[l][key]) || fallback; }

  function apply(lang) {
    html.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!origHtml.has(el)) origHtml.set(el, el.innerHTML);
      var v = lang === 'cs' ? null : (D[lang] || {})[el.getAttribute('data-i18n')];
      el.innerHTML = v || origHtml.get(el);
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var p = pair.split('='), attr = p[0].trim(), key = p[1].trim(), id = attr;
        var o = origAttr.get(el) || {}; if (!(id in o)) { o[id] = el.getAttribute(attr); origAttr.set(el, o); }
        var v = lang === 'cs' ? null : (D[lang] || {})[key];
        el.setAttribute(attr, v || o[id]);
      });
    });
    document.querySelectorAll('.jazyky button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    document.querySelectorAll('a[data-rez]').forEach(function (a) {
      a.href = REZ + (lang === 'cs' ? '' : '&lang=' + lang);
    });
    /* internal links carry the language, so it survives even without storage */
    document.querySelectorAll('a[href]').forEach(function (a) {
      var h = a.getAttribute('href');
      if (!/^[a-z-]+\.html/.test(h)) return;
      var u = new URL(h, location.href);
      if (lang === 'cs') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
      a.setAttribute('href', u.pathname.split('/').pop() + u.search + u.hash);
    });
    var u = new URL(location.href);
    if (lang === 'cs') u.searchParams.delete('lang'); else u.searchParams.set('lang', lang);
    try { history.replaceState(history.state, '', u.pathname + u.search + u.hash); } catch (e) {}
    document.querySelectorAll('blockquote[data-recenze]').forEach(function (b) { b.lang = lang; });
    document.dispatchEvent(new CustomEvent('jazyk', { detail: lang }));
  }

  var fromUrl = new URLSearchParams(location.search).get('lang');
  if (LANGS.indexOf(fromUrl) >= 0) store('vesna-jazyk', fromUrl);
  var start = fromUrl || store('vesna-jazyk') || 'cs';
  if (LANGS.indexOf(start) < 0) start = 'cs';
  /* no smooth scrolling anywhere: deep links and menu jumps land at once */
  apply(start);
  document.addEventListener('click', function (e) {
    var b = e.target.closest('.jazyky button');
    if (!b) return;
    var l = b.getAttribute('data-lang');
    store('vesna-jazyk', l);
    apply(l);
  });

  /* ---------- menu: a sheet from the top ---------- */
  var menu = document.getElementById('menu');
  var opener = null, lockY = 0;
  function lock() {
    lockY = window.scrollY;
    document.body.style.top = -lockY + 'px';
    document.body.classList.add('zamceno');
  }
  function unlock() {
    document.body.classList.remove('zamceno');
    document.body.style.top = '';
    window.scrollTo({ top: lockY, left: 0, behavior: 'instant' });
  }
  function closeNow() {
    if (!menu || !menu.open) return;
    menu.close();
    unlock();
    if (opener) opener.focus({ preventScroll: true });
    /* back to 'auto' only after the traversal: switching inside popstate lets the browser
       restore the scroll it saved while the body was locked (0) */
    setTimeout(function () {
      if (Math.abs(window.scrollY - lockY) > 2) window.scrollTo({ top: lockY, left: 0, behavior: 'instant' });
      history.scrollRestoration = 'auto';
    }, 60);
  }
  function requestClose() {
    if (history.state && history.state.menu) history.back(); else closeNow();
  }
  if (menu) {
    document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        opener = btn;
        history.scrollRestoration = 'manual';
        lock();
        menu.showModal();
        history.pushState({ menu: 1 }, '');
        if (e.detail === 0) { var first = menu.querySelector('nav a'); if (first) first.focus(); }
        else menu.focus();
      });
    });
    menu.querySelector('.zavrit').addEventListener('click', requestClose);
    menu.querySelectorAll('nav a').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); location.replace(a.href); });
    });
    menu.addEventListener('cancel', function (e) { e.preventDefault(); requestClose(); });
    menu.addEventListener('click', function (e) { if (e.target === menu) requestClose(); });
    window.addEventListener('popstate', function () { if (menu.open) closeNow(); });
    window.addEventListener('pageshow', function () {
      if (menu.open) closeNow();
      if (history.state && history.state.menu) history.replaceState(null, '');
    });
  }

  /* ---------- header: hides on the way down, returns on the way up (phones) ---------- */
  var hlava = document.querySelector('.hlava'), lastY = window.scrollY, ticking = false, quietUntil = 0;
  var telefon = window.matchMedia('(max-width:759px)');
  /* home: the small wordmark appears only once the big name has scrolled away */
  var uvodFoto = document.querySelector('.uvod-foto');
  if (hlava && uvodFoto && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { hlava.classList.toggle('ukaz', !en[0].isIntersecting); }, { rootMargin: '-80px 0px 0px 0px' }).observe(uvodFoto);
  }
  window.vesnaTicho = function (ms) { quietUntil = Date.now() + ms; if (hlava && telefon.matches) hlava.classList.add('skryt'); };
  window.addEventListener('scroll', function () {
    if (ticking || !hlava) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY;
      if (!document.body.classList.contains('zamceno') && telefon.matches) {
        if (y < 80) hlava.classList.remove('skryt');
        else if (y > lastY + 6) hlava.classList.add('skryt');
        else if (y < lastY - 6 && Date.now() > quietUntil) hlava.classList.remove('skryt');
        lastY = y;
      }
      ticking = false;
    });
  }, { passive: true });
  function hideIfDeep() { if (hlava && telefon.matches && window.scrollY > 80) { hlava.classList.add('skryt'); lastY = window.scrollY; } }
  window.addEventListener('hashchange', function () { if (window.vesnaTicho) window.vesnaTicho(1000); });
  window.addEventListener('load', function () { if (location.hash) { hideIfDeep(); setTimeout(hideIfDeep, 400); } });

  /* ---------- bottom bar (phones): appears once the page's own booking button has scrolled away ---------- */
  var bar = document.querySelector('.lista-dole');
  var heroCta = document.querySelector('[data-hero-cta]');
  if (bar) {
    if (heroCta && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (en) {
        bar.classList.toggle('videt', !en[0].isIntersecting);
      }).observe(heroCta);
    } else bar.classList.add('videt');
  }

  /* ---------- anchors: focus the target, not the link ---------- */
  function focusTarget(hash) {
    if (!hash || hash.length < 2) return;
    var el = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (el && el.hasAttribute('tabindex')) el.focus({ preventScroll: true });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href*="#"]');
    if (!a) return;
    var u = new URL(a.href);
    if (u.pathname === location.pathname && u.hash) setTimeout(function () { focusTarget(u.hash); }, 0);
  });
  if (location.hash) focusTarget(location.hash);

  /* ---------- the house drawing lights the unit being read (apartments page) ---------- */
  var units = document.querySelectorAll('.byt[id]');
  if (units.length && 'IntersectionObserver' in window) {
    var cells = {}, holdUntil = 0;
    function light(id) {
      Object.keys(cells).forEach(function (k) { cells[k].removeAttribute('aria-current'); });
      if (cells[id]) cells[id].setAttribute('aria-current', 'true');
    }
    document.querySelectorAll('.dum .okno[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      cells[id] = a;
      a.addEventListener('click', function () { holdUntil = Date.now() + 1000; light(id); });
    });
    var io = new IntersectionObserver(function (en) {
      if (Date.now() < holdUntil) return;
      en.forEach(function (x) {
        if (x.isIntersecting) light(x.target.id);
        else if (x.target === units[0] && x.boundingClientRect.top > 0) light(null);
      });
    }, { rootMargin: '0px 0px -80% 0px' });
    units.forEach(function (u) { io.observe(u); });
  }

  /* ---------- map: loads only when asked ---------- */
  var mapBtn = document.querySelector('[data-mapa]');
  if (mapBtn) {
    mapBtn.addEventListener('click', function () {
      var box = mapBtn.parentNode;
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Apartm%C3%A1ny+VESNA,+Nov%C3%A1+Ves+nad+Nisou+581&z=15&output=embed&hl=' + html.lang;
      f.title = t('mapa.titulek', 'Mapa: Apartmány Vesna, Nová Ves nad Nisou 581');
      f.loading = 'lazy';
      f.referrerPolicy = 'no-referrer-when-downgrade';
      box.innerHTML = '';
      box.appendChild(f);
      f.focus();
    });
  }

  /* ---------- enquiry form (front end only; the backend is wired at handover) ---------- */
  var form = document.querySelector('form.poptavka');
  document.querySelectorAll('input[data-od-dneska]').forEach(function (i) {
    var d = new Date(), z = function (n) { return (n < 10 ? '0' : '') + n; };
    i.min = d.getFullYear() + '-' + z(d.getMonth() + 1) + '-' + z(d.getDate());
  });
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var ok = true, firstBad = null;
      form.querySelectorAll('[data-povinne]').forEach(function (f) {
        var v = f.value.trim(), msg = '';
        if (!v) msg = t('f.chyba.prazdne', 'Vyplňte prosím.');
        else if (f.name === 'kontakt' && !(/@.+\./.test(v) || v.replace(/\D/g, '').length >= 9)) msg = t('f.chyba.kontakt', 'Napište e-mail nebo telefon, ať se vám můžeme ozvat.');
        else if (f.name === 'hoste' && !(+v >= 1)) msg = t('f.chyba.hoste', 'Napište přibližný počet hostů.');
        var out = document.getElementById(f.id + '-chyba');
        if (out) out.textContent = msg;
        f.setAttribute('aria-invalid', msg ? 'true' : 'false');
        if (msg) { ok = false; if (!firstBad) firstBad = f; }
      });
      if (!ok) { firstBad.focus(); return; }
      var done = document.getElementById('potvrzeni');
      form.hidden = true;
      done.hidden = false;
      done.focus();
    });
    var again = document.querySelector('[data-znovu]');
    if (again) again.addEventListener('click', function () {
      form.reset();
      form.hidden = false;
      document.getElementById('potvrzeni').hidden = true;
      form.querySelector('input,select,textarea').focus();
    });
  }

  /* ---------- gallery: one stage, a strip grouped by place ---------- */
  var stage = document.querySelector('.jeviste');
  if (stage) {
    var big = stage.querySelector('img');
    var cap = stage.querySelector('.popis');
    var count = stage.querySelector('.pocet');
    var thumbs = Array.prototype.slice.call(document.querySelectorAll('.nahledy button'));
    var cur = 0;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(i, scroll) {
      cur = (i + thumbs.length) % thumbs.length;
      var b = thumbs[cur], im = b.querySelector('img'), n = b.getAttribute('data-foto');
      big.srcset = 'img/' + n + '-800.jpg 800w, img/' + n + '-1600.jpg ' + b.getAttribute('data-w') + 'w';
      big.src = 'img/' + n + '-800.jpg';
      big.width = +b.getAttribute('data-w'); big.height = +b.getAttribute('data-h');
      big.alt = im.alt;
      cap.textContent = im.alt;
      count.textContent = (cur + 1) + ' / ' + thumbs.length;
      thumbs.forEach(function (x, k) { if (k === cur) x.setAttribute('aria-current', 'true'); else x.removeAttribute('aria-current'); });
      var nx = new Image(); nx.src = 'img/' + thumbs[(cur + 1) % thumbs.length].getAttribute('data-foto') + '-800.jpg';
      if (scroll && stage.getBoundingClientRect().top < 0) { window.vesnaTicho(1200); } if (scroll && stage.getBoundingClientRect().top < 0) stage.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
    }
    thumbs.forEach(function (b, i) { b.addEventListener('click', function () { show(i, true); }); });
    stage.querySelector('[data-zpet]').addEventListener('click', function () { show(cur - 1); });
    stage.querySelector('[data-dal]').addEventListener('click', function () { show(cur + 1); });
    document.addEventListener('keydown', function (e) {
      if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName) || (menu && menu.open)) return;
      if (e.key === 'ArrowLeft') { show(cur - 1); }
      if (e.key === 'ArrowRight') { show(cur + 1); }
    });
    var x0 = null, y0 = null;
    big.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
    big.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0; x0 = null;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    });
    big.addEventListener('pointercancel', function () { x0 = null; });
    document.addEventListener('jazyk', function () { show(cur); });
    show(0);
  }
})();
