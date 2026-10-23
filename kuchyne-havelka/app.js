/* Kuchyně Havelka – shared behaviour. No third-party request until the visitor taps the map. */
(function () {
  var html = document.documentElement;

  /* focus rings only for keyboard users */
  document.addEventListener('pointerdown', function () { html.classList.add('dotyk'); }, true);
  document.addEventListener('keydown', function (e) {
    if (/^(Tab|Arrow|Enter| )/.test(e.key)) html.classList.remove('dotyk');
  }, true);

  /* ---------- language ---------- */
  var EN = window.KH_EN || {};
  var lang = 'cs';
  try {
    var q = new URLSearchParams(location.search).get('lang');
    lang = q === 'en' || q === 'cs' ? q : (localStorage.getItem('kh-lang') || 'cs');
  } catch (e) {}
  var orig = new Map();
  function t(cs, en) { return lang === 'en' ? en : cs; }
  function applyLang() {
    html.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      if (!orig.has(el)) orig.set(el, el.innerHTML);
      var k = el.getAttribute('data-i18n');
      el.innerHTML = lang === 'en' && EN[k] != null ? EN[k] : orig.get(el);
      if (el.hasAttribute('lang') && el.getAttribute('lang') !== 'en' || el.dataset.olang) {
        el.dataset.olang = 'cs'; el.setAttribute('lang', lang);
      }
    });
    ['alt', 'aria-label', 'placeholder', 'content'].forEach(function (a) {
      document.querySelectorAll('[data-i18n-' + a + ']').forEach(function (el) {
        var key = 'o-' + a;
        if (el[key] == null) el[key] = el.getAttribute(a);
        var k = el.getAttribute('data-i18n-' + a);
        el.setAttribute(a, lang === 'en' && EN[k] != null ? EN[k] : el[key]);
      });
    });
    var tk = document.body.getAttribute('data-title');
    if (!document.oTitle) document.oTitle = document.title;
    document.title = lang === 'en' && EN[tk] ? EN[tk] : document.oTitle;
    document.querySelectorAll('.jazyk button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    /* keep the language when moving between pages */
    document.querySelectorAll('a[href*=".html"]:not([href^="http"])').forEach(function (a) {
      var h = a.getAttribute('href').split('?')[0];
      a.setAttribute('href', lang === 'en' ? h + '?lang=en' : h);
    });
    stav();
  }
  document.querySelectorAll('.jazyk button').forEach(function (b) {
    b.addEventListener('click', function () {
      lang = b.getAttribute('data-lang');
      try { localStorage.setItem('kh-lang', lang); } catch (e) {}
      /* the URL follows the chosen language, so a reload keeps it */
      try { history.replaceState(history.state, '', location.pathname + (lang === 'en' ? '?lang=en' : '') + location.hash); } catch (e) {}
      applyLang();
    });
  });

  /* ---------- open / closed, Europe/Prague ---------- */
  // Po–Čt 9.30–17.00, Pá 9.30–14.30 (kontakt.html, Google). Weekend: by phone arrangement.
  var HOURS = { 1: [570, 1020], 2: [570, 1020], 3: [570, 1020], 4: [570, 1020], 5: [570, 870] };
  function pragueNow() {
    var p = {};
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Prague', weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    var d = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 0 }[p.weekday];
    return { d: d, m: +p.hour * 60 + +p.minute, t0: Date.UTC(+p.year, +p.month - 1, +p.day), svatek: svatek(+p.year, +p.month, +p.day) };
  }
  /* Czech public holidays: Google marks these days "Otevírací doba se může lišit" (owner question) */
  function svatek(y, mo, da) {
    var md = mo + '.' + da;
    if (/^(1\.1|5\.1|5\.8|7\.5|7\.6|9\.28|10\.28|11\.17|12\.24|12\.25|12\.26)$/.test(md)) return true;
    // Easter Sunday (anonymous Gregorian algorithm); Good Friday = -2 days, Easter Monday = +1 day
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
    var h = (19 * a + b - Math.floor(b / 4) - g + 15) % 30, l = (32 + 2 * (b % 4) + 2 * Math.floor(c / 4) - h - c % 4) % 7;
    var m = Math.floor((a + 11 * h + 22 * l) / 451), em = Math.floor((h + l - 7 * m + 114) / 31), ed = (h + l - 7 * m + 114) % 31 + 1;
    var t0 = Date.UTC(y, em - 1, ed), t = Date.UTC(y, mo - 1, da), day = 864e5;
    return t === t0 - 2 * day || t === t0 + day;
  }
  function hm(m) { return Math.floor(m / 60) + '.' + String(m % 60).padStart(2, '0'); }
  var DAY_CS = ['v neděli', 'v pondělí', 'v úterý', 've středu', 've čtvrtek', 'v pátek', 'v sobotu'];
  var DAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function stav() {
    var n = pragueNow(), h = HOURS[n.d], s;
    if (n.svatek) {
      s = t('Dnes je svátek, otevírací doba může být jiná', 'Today is a public holiday, opening hours may differ');
    } else if (h && n.m >= h[0] && n.m < h[1]) {
      s = t('Studio je teď otevřené do ' + hm(h[1]), 'The studio is open now until ' + hm(h[1]).replace('.', ':'));
    } else if (h && n.m < h[0]) {
      s = t('Studio dnes otevírá v ' + hm(h[0]), 'The studio opens today at ' + hm(h[0]).replace('.', ':'));
    } else {
      /* next weekday; if it is a public holiday, say so instead of promising 9.30 (holiday hours: owner question 8) */
      var d = n.d, i = 0, x;
      do { d = (d + 1) % 7; i++; } while (!HOURS[d]);
      x = new Date(n.t0 + i * 864e5);
      if (svatek(x.getUTCFullYear(), x.getUTCMonth() + 1, x.getUTCDate())) {
        s = i === 1
          ? t('Studio je zavřené, zítra je svátek', 'The studio is closed; tomorrow is a public holiday')
          : t('Studio je zavřené, ' + DAY_CS[d] + ' je svátek', 'The studio is closed; ' + DAY_EN[d] + ' is a public holiday');
      } else {
        s = i === 1
          ? t('Studio je zavřené, zítra od 9.30', 'The studio is closed, open tomorrow from 9:30')
          : t('Studio je zavřené, otevíráme ' + DAY_CS[d] + ' v 9.30', 'The studio is closed, open on ' + DAY_EN[d] + ' at 9:30');
      }
    }
    document.querySelectorAll('[data-stav]').forEach(function (el) { el.textContent = s; });
    var today = document.querySelector('[data-den="' + n.d + '"]');
    if (today) today.setAttribute('aria-current', 'date');
  }

  /* ---------- menu sheet ---------- */
  var menu = document.getElementById('menu');
  var opener = document.querySelector('.menu-tl');
  if (menu && opener && menu.showModal) {
    var pushed = false;
    opener.addEventListener('click', function (e) {
      menu.showModal();
      if (e.detail === 0) { var f = menu.querySelector('a'); if (f) f.focus(); } else { menu.focus(); }
      history.pushState({ menu: 1 }, ''); pushed = true;
    });
    function zavri() { if (menu.open) menu.close(); }
    menu.addEventListener('close', function () { if (pushed) { pushed = false; history.back(); } opener.focus({ preventScroll: true }); });
    window.addEventListener('popstate', function () { pushed = false; zavri(); });
    menu.querySelector('.zavrit').addEventListener('click', zavri);
    menu.addEventListener('click', function (e) { if (e.target === menu) zavri(); });
    menu.querySelectorAll('a[href$=".html"],a[href*=".html?"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        /* leave the menu's history entry behind without an extra back step */
        e.preventDefault(); var href = a.href; pushed = false; menu.close(); location.replace(href);
      });
    });
  }

  /* ---------- phone bar: appears when the page's own button has left the screen ---------- */
  var lista = document.querySelector('.lista');
  var hlavni = document.querySelector('[data-hlavni]');
  if (lista && hlavni && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      var e = en[0];
      lista.classList.toggle('ukaz', !e.isIntersecting && e.boundingClientRect.top < 0);
      /* one dominant button: the header copy shows only once the hero button is off screen */
      html.classList.toggle('ukaz-poptat', !e.isIntersecting);
    }).observe(hlavni);
  } else if (lista && !document.querySelector('form.formular')) {
    var onScroll = function () { lista.classList.toggle('ukaz', window.scrollY > 320); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  /* ---------- the cutting plan → project viewer ---------- */
  var P = {
    'kh-07': [6, 'Kuchyň', 'Kitchen', 'Bílá lesklá kuchyň s mramorovým ostrůvkem a dubovým stolem', 'White gloss kitchen with a marble island and an oak table'],
    'kh-06': [4, 'Kuchyň', 'Kitchen', 'Bílá kuchyň s ostrůvkem obloženým kamennými pásky', 'White kitchen with an island clad in stone strips'],
    'kh-05': [4, 'Kuchyň', 'Kitchen', 'Bílá kuchyň s jídelním stolem a tmavou pracovní deskou', 'White kitchen with a dining table and a dark worktop'],
    'kh-04': [5, 'Kuchyň', 'Kitchen', 'Bílá kuchyň se šedou zástěnou vedle dřevěného schodiště', 'White kitchen with a grey splashback next to a timber staircase'],
    'kh-03': [2, 'Kuchyň', 'Kitchen', 'Kuchyň v dubovém dekoru s bílými skříňkami', 'Oak-décor kitchen with white cabinets'],
    'kh-02': [5, 'Kuchyň', 'Kitchen', 'Kuchyň v dubovém dekoru s vytaženými zásuvkami a rohovým výsuvem', 'Oak-décor kitchen with drawers and a corner pull-out open'],
    'kh-01': [3, 'Kuchyň', 'Kitchen', 'Bílá kuchyň s ostrůvkem a dubovou nikou u schodiště', 'White kitchen with an island and an oak niche by the stairs'],
    'bed': [4, 'Kuchyň, Bedřichov', 'Kitchen, Bedřichov', 'Bílá kuchyň pod dřevěnými trámy s ostrůvkem a policí na knihy', 'White kitchen under timber beams, with an island and a bookshelf'],
    'vs-01': [1, 'Vestavěná skříň', 'Built-in wardrobe', 'Bílá vestavěná skříň s posuvnými dveřmi, jedno pole otevřené', 'White built-in wardrobe with sliding doors, one bay open'],
    'zv-01': [2, 'Nábytek na míru', 'Made-to-measure furniture', 'Bílé schodovité police a skříňky na míru', 'White stepped shelving and cupboards made to measure']
  };
  var view = document.getElementById('prohlizec');
  if (view && view.showModal) {
    var img = view.querySelector('img'), cur = null, idx = 1, vPushed = false, back = null;
    function code(c) { return c === 'bed' ? 'Bedřichov' : c.toUpperCase(); }
    function show() {
      var p = P[cur];
      img.src = 'img/p/' + cur + '-' + idx + '.jpg';
      img.alt = t(p[3], p[4]) + ' (' + idx + '/' + p[0] + ')';
      view.querySelector('.nazev').textContent = code(cur) + ', ' + t(p[1], p[2]).split(',')[0].toLowerCase();
      view.querySelector('.pocet').textContent = idx + ' / ' + p[0];
      var popis = view.querySelector('.popis');
      if (popis) popis.textContent = t(p[3], p[4]);
      view.querySelectorAll('.dalsi,.predchozi').forEach(function (b) { b.disabled = p[0] < 2; });
    }
    function step(d) { var n = P[cur][0]; idx = ((idx - 1 + d + n) % n) + 1; show(); }
    document.querySelectorAll('.dil[data-p]').forEach(function (b) {
      b.addEventListener('click', function () {
        cur = b.getAttribute('data-p'); idx = 1; back = b; show(); view.showModal();
        history.pushState({ v: 1 }, ''); vPushed = true;
      });
    });
    view.querySelector('.dalsi').addEventListener('click', function () { step(1); });
    view.querySelector('.predchozi').addEventListener('click', function () { step(-1); });
    view.querySelector('.zavrit').addEventListener('click', function () { view.close(); });
    view.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    });
    view.addEventListener('close', function () {
      if (vPushed) { vPushed = false; history.back(); }
      if (back) back.focus({ preventScroll: true });
    });
    window.addEventListener('popstate', function () { if (view.open) { vPushed = false; view.close(); } });
    var x0 = null;
    var stage = view.querySelector('.jeviste');
    stage.addEventListener('pointerdown', function (e) { x0 = e.clientX; });
    stage.addEventListener('pointerup', function (e) {
      if (x0 == null) return; var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
    });
  }

  /* ---------- map: loads only on request ---------- */
  document.querySelectorAll('.mapa button').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = document.createElement('iframe');
      f.src = 'https://www.google.com/maps?q=Kuchyn%C4%9B+Havelka,+Studáneck%C3%A1+591,+463+03+Str%C3%A1%C5%BE+nad+Nisou&z=15&output=embed';
      f.title = t('Mapa: Kuchyně Havelka, Studánecká 591, Stráž nad Nisou', 'Map: Kuchyně Havelka, Studánecká 591, Stráž nad Nisou');
      f.loading = 'lazy'; f.setAttribute('tabindex', '0');
      b.parentNode.insertBefore(f, b); b.remove(); f.focus();
    });
  });

  /* ---------- enquiry form: DEMO, sends nothing ---------- */
  // At handover: point this at the studio's inbox (owner question 7). Until then nothing leaves the page.
  var form = document.querySelector('form.formular');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      var out = form.querySelector('.vysledek');
      out.textContent = t('Ukázka: nic se neodeslalo. Na hotovém webu by teď poptávka odešla do studia.', 'Demo: nothing was sent. On the finished site, this enquiry would now go to the studio.');
      out.hidden = false; out.focus();
    });
  }

  applyLang();
})();
