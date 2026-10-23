// Nábytek Janek: live workshop state, menu sheet, strip, photo thumbs, click-to-load map, demo form.
(function () {
  'use strict';

  // ---- open/closed (Europe/Prague, Mon–Fri 8–17, Czech public holidays) — pure, tested in test-provoz.mjs
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4,
      f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30,
      i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return [mo, da];
  }
  function svatek(y, mo, d) { // mo 1-12
    var fixed = ['1-1', '5-1', '5-8', '7-5', '7-6', '9-28', '10-28', '11-17', '12-24', '12-25', '12-26'];
    if (fixed.indexOf(mo + '-' + d) > -1) return true;
    var e = easter(y), t = Date.UTC(y, e[0] - 1, e[1]), x = Date.UTC(y, mo - 1, d), day = 864e5;
    return x === t - 2 * day || x === t + day; // Good Friday, Easter Monday
  }
  function praha(now) {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Prague', year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23', weekday: 'short' })
      .formatToParts(now).forEach(function (x) { p[x.type] = x.value; });
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday);
    return { y: +p.year, mo: +p.month, d: +p.day, wd: wd, min: (+p.hour) * 60 + (+p.minute) };
  }
  function pracovni(y, mo, d, wd) { return wd >= 1 && wd <= 5 && !svatek(y, mo, d); }
  // returns {open:bool, key:'open'|'later'|'closed'|'holiday', next: days ahead, nextWd, nextHoliday}
  // r3: holiday hours are unconfirmed (owner question), so the look-ahead never skips a holiday:
  // it names the next weekday and says when that day is a holiday (hours may differ).
  function provoz(now) {
    var t = praha(now);
    if (svatek(t.y, t.mo, t.d) && t.wd >= 1 && t.wd <= 5) return { open: false, key: 'holiday' };
    if (pracovni(t.y, t.mo, t.d, t.wd)) {
      if (t.min >= 480 && t.min < 1020) return { open: true, key: 'open' };
      if (t.min < 480) return { open: false, key: 'later' };
    }
    for (var i = 1; i < 4; i++) {
      var dt = new Date(Date.UTC(t.y, t.mo - 1, t.d + i)), wd = dt.getUTCDay();
      if (wd >= 1 && wd <= 5) return { open: false, key: 'closed', next: i, nextWd: wd, nextHoliday: svatek(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate()) };
    }
  }
  if (typeof module !== 'undefined') { module.exports = { provoz: provoz, svatek: svatek }; return; }

  var doc = document, html = doc.documentElement, en = html.lang === 'en';
  var S = en ? {
    open: 'Workshop open today until 17:00', later: 'Workshop opens today at 8:00', holiday: 'Public holiday today, hours may differ',
    closed: function (s) {
      var d = s.next === 1 ? 'tomorrow' : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][s.nextWd];
      return s.nextHoliday ? 'Workshop closed; ' + d + ' is a public holiday, hours may differ' : 'Workshop closed, opens ' + (s.next === 1 ? d : 'on ' + d) + ' at 8:00';
    }
  } : {
    open: 'Dílna je otevřená, dnes do 17.00', later: 'Dílna dnes otevírá v 8.00', holiday: 'Dnes je svátek, otevírací doba může být jiná',
    closed: function (s) {
      var d = s.next === 1 ? 'zítra' : ['v neděli', 'v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu'][s.nextWd];
      return s.nextHoliday ? 'Dílna je zavřená, ' + d + ' je svátek a otevírací doba může být jiná' : 'Dílna je zavřená, otevírá ' + d + ' v 8.00';
    }
  };
  function ukazStav() {
    var s = provoz(new Date()), txt = s.key === 'closed' ? S.closed(s) : S[s.key];
    doc.querySelectorAll('[data-provoz]').forEach(function (el) { el.textContent = txt; el.classList.toggle('otevreno', s.open); });
  }
  ukazStav(); setInterval(ukazStav, 60000);

  // ---- touch vs keyboard focus rings
  doc.addEventListener('pointerdown', function () { html.classList.add('dotyk'); }, true);
  doc.addEventListener('keydown', function (e) { if (/^(Tab|Arrow|Enter| )/.test(e.key)) html.classList.remove('dotyk'); }, true);

  // ---- after a jump, focus the target section (not the menu button)
  function zamer() {
    var id = decodeURIComponent(location.hash.slice(1)), t = id && doc.getElementById(id);
    if (t) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.scrollIntoView({ block: 'start' }); t.focus({ preventScroll: true }); }
  }
  window.addEventListener('hashchange', zamer);

  // ---- r5: the language link keeps the anchor (both languages share every id)
  function jazykKotva() {
    doc.querySelectorAll('a[hreflang]').forEach(function (a) { a.setAttribute('href', a.getAttribute('href').split('#')[0] + location.hash); });
  }
  jazykKotva(); window.addEventListener('hashchange', jazykKotva);

  // ---- menu sheet: pushes one history entry, back closes it, a link closes it first then navigates
  var dlg = doc.getElementById('nabidka'), opener = doc.querySelector('.branka'), pushed = false, potom = null;
  function otevri(ev) {
    if (!dlg || dlg.open) return;
    dlg.showModal(); html.classList.add('zamceno');
    history.pushState({ nabidka: 1 }, ''); pushed = true;
    if (ev && ev.detail === 0) { var a = dlg.querySelector('a'); if (a) a.focus(); } else dlg.focus();
  }
  function zavri(then) {
    potom = then || null;
    if (pushed) { history.back(); } else { dokonci(); }
  }
  function dokonci() {
    if (dlg && dlg.open) dlg.close();
    html.classList.remove('zamceno'); pushed = false;
    var f = potom; potom = null;
    if (f) f(); else if (opener) opener.focus({ preventScroll: true });
  }
  window.addEventListener('popstate', function () { if (pushed || (dlg && dlg.open)) dokonci(); });
  if (dlg && opener) {
    opener.addEventListener('click', otevri);
    dlg.querySelector('.zavrit-menu').addEventListener('click', function () { zavri(); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); zavri(); });
    dlg.addEventListener('click', function (e) {
      if (e.target === dlg) { zavri(); return; }
      var a = e.target.closest('a');
      if (!a) return;
      var href = a.getAttribute('href');
      if (/^(tel:|mailto:)/.test(href)) return; // leave the sheet open, the phone app takes over
      e.preventDefault();
      zavri(function () { location.href = href; });
    });
  }

  // ---- strip appears once the hero button has left the screen upwards
  var pruh = doc.getElementById('pruh'), hb = doc.getElementById('hlavni-tlacitko') || doc.querySelector('.titulek h1');
  if (pruh && hb && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var e = en[0]; pruh.classList.toggle('ukazat', !e.isIntersecting && e.boundingClientRect.top < 0);
    }).observe(hb);
  }

  // ---- project thumbnails swap the main photo
  doc.querySelectorAll('.nahledy').forEach(function (g) {
    var main = g.parentNode.querySelector('.hlavni');
    g.addEventListener('click', function (e) {
      var b = e.target.closest('.nahled'); if (!b) return;
      main.srcset = b.dataset.srcset; main.src = b.dataset.src; main.alt = b.dataset.alt;
      main.width = +b.dataset.w; main.height = +b.dataset.h;
      g.querySelectorAll('.nahled').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    });
  });

  // ---- map loads only on request
  doc.querySelectorAll('.mapa-btn').forEach(function (b) {
    b.addEventListener('click', function () {
      var box = b.parentNode, f = doc.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=50.7453489,15.1522254&z=16&output=embed';
      f.title = box.dataset.title; f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade'; f.tabIndex = 0;
      box.insertBefore(f, box.firstChild); b.remove(); f.focus({ preventScroll: true });
    });
  });

  // ---- demo form: browser validation, then a panel; nothing leaves the page
  var form = doc.getElementById('formular');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var done = doc.getElementById('hotovo'); done.hidden = false;
    done.scrollIntoView({ block: 'center' }); done.focus({ preventScroll: true });
  });

  if (location.hash) zamer();
})();
