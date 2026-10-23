// Penzion U muzea: menu, phone bar, map, demo form. No storage, no third-party requests on load.
(function () {
  var html = document.documentElement;
  // Touch vs keyboard focus rings
  document.addEventListener('pointerdown', function () { html.classList.add('dotyk'); }, true);
  document.addEventListener('keydown', function (e) {
    if (/^(Tab|Arrow|Enter| )/.test(e.key)) html.classList.remove('dotyk');
  }, true);

  // Menu: a history entry so Back closes it; links replace that entry so Back still leaves the page correctly
  var menu = document.getElementById('menu'), opener = document.querySelector('.menu-tl'), y = 0;
  function closeMenu() {
    if (!menu.open) return;
    menu.close();
    document.body.style.cssText = '';
    window.scrollTo({ top: y, left: 0, behavior: 'instant' });
    history.scrollRestoration = 'auto';
  }
  if (menu && opener) {
    opener.addEventListener('click', function (e) {
      y = window.scrollY;
      history.scrollRestoration = 'manual';
      history.pushState({ menu: 1 }, '');
      menu.showModal();
      document.body.style.cssText = 'position:fixed;left:0;right:0;top:' + (-y) + 'px';
      if (e.detail === 0) { var a = menu.querySelector('nav a'); if (a) a.focus(); } else menu.focus();
    });
    menu.querySelector('.menu-zavrit').addEventListener('click', function () { history.back(); });
    menu.addEventListener('cancel', function (e) { e.preventDefault(); history.back(); });
    menu.addEventListener('click', function (e) { if (e.target === menu) history.back(); });
    menu.querySelectorAll('a[href]').forEach(function (a) {
      if (a.getAttribute('href').indexOf('tel:') === 0) return;
      a.addEventListener('click', function (e) { e.preventDefault(); location.replace(a.href); });
    });
    window.addEventListener('popstate', closeMenu);
  }

  // Phone bar appears once the page's main button has scrolled away
  var main = document.querySelector('[data-hlavni]'), bar = document.getElementById('lista');
  function show(on) {
    if (bar) { bar.classList.toggle('vidim', on); bar.setAttribute('aria-hidden', on ? 'false' : 'true'); bar.querySelectorAll('a').forEach(function (a) { a.tabIndex = on ? 0 : -1; }); }
  }
  if (main && 'IntersectionObserver' in window) {
    show(false);
    new IntersectionObserver(function (en) { show(!en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe(main);
  } else show(true);

  // Home on phones: the header wordmark shows once the h1 (the name) has gone under the header
  var h1 = html.classList.contains('domu') && document.querySelector('.uvod h1');
  if (h1 && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (en) { html.classList.toggle('znacka-vidim', !en[0].isIntersecting && en[0].boundingClientRect.top < 100); }, { rootMargin: '-56px 0px 0px 0px' }).observe(h1);
  } else html.classList.add('znacka-vidim');

  // Map loads only on request
  var mt = document.querySelector('.mapa-tl');
  if (mt) mt.addEventListener('click', function () {
    var f = document.createElement('iframe');
    f.src = mt.dataset.src; f.title = mt.textContent; f.loading = 'lazy';
    mt.parentNode.insertBefore(f, mt.parentNode.firstChild); mt.remove();
  });

  // Booking: a stay shows where Previo goes; wellness is the demo enquiry form, nothing is sent anywhere
  var form = document.getElementById('formular');
  if (form) {
    var q = new URLSearchParams(location.search);
    function mode() {
      var w = form.co.value === 'wellness';
      form.querySelectorAll('[data-wellness]').forEach(function (el) { el.hidden = !w; });
      form.querySelectorAll('[data-pobyt]').forEach(function (el) { el.hidden = w; });
    }
    if (q.get('co') === 'wellness') form.querySelector('input[value=wellness]').checked = true;
    if (/^(deluxe|krb|suteren)$/.test(q.get('pokoj'))) { form.pokoj.value = q.get('pokoj'); form.querySelector('input[value=wellness]').checked = true; }
    mode();
    // No past dates (local date, not UTC)
    var d = new Date();
    form.od.min = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    form.addEventListener('change', function (e) { if (e.target.name === 'co') mode(); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // required fields, e-mail format and past dates; hidden fields (the other mode) are skipped
      var bad = [].filter.call(form.elements, function (f) { return f.willValidate && f.offsetParent !== null && !f.checkValidity(); })[0];
      if (bad) { bad.reportValidity(); bad.focus(); return; }
      var done = document.getElementById('hotovo');
      done.hidden = false;
      form.querySelector('.ukazka').hidden = true;
      done.scrollIntoView({ block: 'center' });
      done.focus({ preventScroll: true });
    });
  }
})();
