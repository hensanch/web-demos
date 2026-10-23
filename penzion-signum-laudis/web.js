(function () {
  'use strict';
  var d = document, root = d.documentElement;

  // Touch vs keyboard focus rings
  d.addEventListener('pointerdown', function () { root.classList.add('dotyk'); }, true);
  d.addEventListener('keydown', function (e) { if (/^(Tab|Arrow|Enter| )/.test(e.key)) root.classList.remove('dotyk'); }, true);

  // ---- language: CS in the HTML, EN/DE from i18n.js; ?lang= wins, then the remembered choice
  var T = window.SL_T || {}, cur = 'cs';
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function setLang(l) {
    if (l !== 'en' && l !== 'de') l = 'cs';
    d.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (el.dataset.cs === undefined) el.dataset.cs = el.innerHTML;
      var v = l === 'cs' ? el.dataset.cs : (T[l] && T[l][el.dataset.i18n]);
      if (v) el.innerHTML = v;
    });
    d.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.dataset.i18nAttr.split(';').forEach(function (pair) {
        var p = pair.split(':'), a = p[0], k = p[1], key = 'cs_' + a.replace(/\W/g, '');
        if (el.dataset[key] === undefined) el.dataset[key] = el.getAttribute(a) || '';
        var v = l === 'cs' ? el.dataset[key] : (T[l] && T[l][k]);
        if (v) el.setAttribute(a, v.replace(/<[^>]+>/g, ''));
      });
    });
    root.lang = l; cur = l;
    d.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === l)); });
    store('sl-lang', l);
  }
  var qs = new URLSearchParams(location.search).get('lang');
  var start = qs || store('sl-lang') || 'cs';
  if (qs || start !== 'cs') setLang(start); // ?lang=cs also overwrites a remembered choice
  d.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lang]');
    if (b) setLang(b.dataset.lang);
  });

  // ---- menu dialog (back gesture closes it, tap on backdrop closes it)
  var menu = d.getElementById('menu'), opener = d.querySelector('.menu-otevrit'), lockY = 0;
  function closeMenu(fromPop) {
    if (!menu.open) return;
    menu.close();
    d.body.style.position = ''; d.body.style.top = ''; d.body.style.width = '';
    window.scrollTo({ top: lockY, left: 0, behavior: 'instant' });
    history.scrollRestoration = 'auto';
    if (!fromPop && history.state && history.state.menu) history.back();
  }
  if (menu && opener && menu.showModal) {
    opener.addEventListener('click', function (e) {
      lockY = window.scrollY;
      history.scrollRestoration = 'manual';
      history.pushState({ menu: 1 }, '');
      menu.showModal();
      d.body.style.position = 'fixed'; d.body.style.top = -lockY + 'px'; d.body.style.width = '100%';
      if (e.detail === 0) { var a = menu.querySelector('nav a'); if (a) a.focus(); } else menu.focus();
    });
    menu.querySelector('.menu-zavrit').addEventListener('click', function () { closeMenu(false); });
    menu.addEventListener('click', function (e) {
      if (e.target === menu) closeMenu(false);
      var a = e.target.closest('nav a');
      if (a) { // leave the page: drop our history entry without animating
        e.preventDefault(); var href = a.href;
        menu.close(); d.body.style.position = '';
        location.replace(href); // swaps out the menu entry: history stays [previous, page, new page]
      }
    });
    menu.addEventListener('cancel', function (e) { e.preventDefault(); closeMenu(false); });
    window.addEventListener('popstate', function () { closeMenu(true); });
  }

  // ---- phone bottom bar: shows once the page's own first Poptat button has left the screen
  var bar = d.querySelector('.spodni-lista'), watch = d.querySelector('main [data-cta]');
  if (bar && 'IntersectionObserver' in window && !d.body.classList.contains('str-kontakt')) {
    bar.hidden = false;
    var show = function (v) {
      bar.classList.toggle('videt', v); bar.setAttribute('aria-hidden', String(!v));
      bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = v ? 0 : -1; });
    };
    if (watch) {
      var seen = false;
      new IntersectionObserver(function (en) {
        var e = en[0];
        if (e.isIntersecting) { seen = true; show(false); }
        else show(seen ? e.boundingClientRect.top < 0 : true);
      }).observe(watch);
    } else show(true);
  }

  // ---- home: wordmark appears in the header once the name has scrolled away
  var h1 = d.querySelector('.str-index h1');
  if (h1 && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { d.body.classList.toggle('po-uvodu', !en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe(h1);
  }

  // ---- villa: zoom Vosátko's sheet to one drawing
  var plan = d.getElementById('plan');
  if (plan) {
    var okno = plan.parentNode, W = 1497, box = d.querySelector('[data-vyrez]').dataset.vyrez;
    var zoom = function () {
      // the window takes the drawing's own shape (max 72vh tall), so no mat or frame shows
      var b = box.split(',').map(Number), ar = b[2] / b[3];
      okno.style.aspectRatio = String(ar); okno.style.maxWidth = 'calc(72vh * ' + ar + ')';
      var cw = okno.clientWidth, k = cw / W, s = W / b[2];
      var tx = -b[0] * k * s, ty = -b[1] * k * s;
      plan.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + s + ')';
    };
    var uzke = window.matchMedia('(max-width: 599px)'), n = -1;
    d.querySelectorAll('[data-vyrez]').forEach(function (b) {
      b.addEventListener('click', function () {
        var c = b.querySelector('.plan-n');
        if (b.dataset.uzke && uzke.matches) { // phones: the three floor plans one per tap, 1/3 2/3 3/3
          var parts = b.dataset.uzke.split('|');
          n = b.getAttribute('aria-pressed') === 'true' ? (n + 1) % parts.length : 0;
          box = parts[n]; c.textContent = (n + 1) + '/' + parts.length;
        } else { box = b.dataset.vyrez; if (c) c.textContent = ''; }
        zoom();
        d.querySelectorAll('[data-vyrez]').forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      });
    });
    zoom(); window.addEventListener('resize', zoom);
  }

  // ---- gallery: one dialog, prev/next, arrow keys, swipe
  var dlg = d.getElementById('prohlidka');
  if (dlg && dlg.showModal) {
    var shots = [].slice.call(d.querySelectorAll('.snimek')), i = 0, big = d.getElementById('prohlidka-img'),
      cap = d.getElementById('prohlidka-popis'), cnt = dlg.querySelector('.pr-pocet'), back = null;
    var show = function (n) {
      i = (n + shots.length) % shots.length;
      var im = shots[i].querySelector('img');
      big.hidden = false; big.src = shots[i].dataset.velky; big.alt = im.alt; cap.textContent = shots[i].dataset.popis || ''; // short caption, the alt text stays for screen readers
      cnt.textContent = (i + 1) + ' / ' + shots.length;
    };
    shots.forEach(function (s, n) { s.addEventListener('click', function () { back = s; show(n); dlg.showModal(); }); });
    dlg.querySelector('.pr-zpet').addEventListener('click', function () { show(i - 1); });
    dlg.querySelector('.pr-dal').addEventListener('click', function () { show(i + 1); });
    dlg.querySelector('.pr-zavrit').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('close', function () { if (back) back.focus({ preventScroll: true }); });
    dlg.addEventListener('keydown', function (e) { if (e.key === 'ArrowLeft') show(i - 1); if (e.key === 'ArrowRight') show(i + 1); });
    var x0 = null;
    dlg.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    dlg.addEventListener('touchend', function (e) {
      if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) show(i + (dx < 0 ? 1 : -1));
    });
  }

  // ---- enquiry form: a demo, it never sends anything
  var form = d.getElementById('poptavka');
  if (form) {
    var ap = new URLSearchParams(location.search).get('apartman');
    if (ap) { var sel = d.getElementById('f-apartman'); if (sel.querySelector('option[value="' + ap.replace(/\W/g, '') + '"]')) sel.value = ap; }
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    var iso = today.toISOString().slice(0, 10);
    d.getElementById('f-prijezd').min = iso; d.getElementById('f-odjezd').min = iso;
    var CS = { 'f.chyba-datum': 'Odjezd musí být po příjezdu.', 'f.chyba-minulost': 'Příjezd nemůže být v minulosti.' };
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = d.getElementById('f-chyba'), done = d.getElementById('f-hotovo');
      err.textContent = ''; done.hidden = true;
      var bad = [].slice.call(form.querySelectorAll('[required]')).filter(function (f) { return !f.value.trim(); });
      if (bad.length) { bad[0].focus(); bad[0].reportValidity && bad[0].reportValidity(); return; }
      var a = d.getElementById('f-prijezd').value, o = d.getElementById('f-odjezd').value;
      if (a < iso) { err.textContent = cur === 'cs' ? CS['f.chyba-minulost'] : T[cur]['f.chyba-minulost']; return; }
      if (o <= a) { err.textContent = cur === 'cs' ? CS['f.chyba-datum'] : T[cur]['f.chyba-datum']; return; }
      done.hidden = false; // nothing leaves the page
      done.scrollIntoView({ block: 'center' });
    });
  }

  // ---- map: loads only on a tap
  var mb = d.querySelector('.mapa-nacist');
  if (mb) mb.addEventListener('click', function () {
    var f = d.createElement('iframe');
    f.src = 'https://www.google.com/maps?q=' + encodeURIComponent('Penzion Signum Laudis, Velké Hamry 429, 468 45 Velké Hamry') + '&z=15&output=embed';
    f.title = 'Mapa'; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
    var m = d.getElementById('mapa'); m.innerHTML = ''; m.appendChild(f); m.tabIndex = -1; m.focus({ preventScroll: true });
  });
})();
