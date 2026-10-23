// DIAMOND SPOT E2: header line, phone menu, tray filter, detail metal choice, demo forms.
(() => {
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const kc = n => n.toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
  const NB = '\u00a0';

  const mb = $('.menu-btn'), menu = $('#menu');
  mb.addEventListener('click', () => {
    const open = mb.getAttribute('aria-expanded') !== 'true';
    mb.setAttribute('aria-expanded', open); menu.hidden = !open; mb.textContent = open ? 'Zavřít' : 'Menu';
    document.documentElement.style.overflow = open ? 'hidden' : '';  // the sheet covers the page; the page stays put
  });
  $$('#menu a').forEach(a => a.addEventListener('click', () => { if (mb.getAttribute('aria-expanded') === 'true') mb.click(); }));

  // tray filter (collection pages)
  const tray = $('.tray');
  if (tray) {
    const grid = $('.grid-f'), items = $$('.item', grid), total = items.length;
    const words = JSON.parse(tray.dataset.words), countEl = $('.state .count'), empty = $('.empty');
    const resets = $$('.reset'), sort = $('#sort'), ft = $('.ftoggle');
    // phone: the filter groups open under one button
    ft.addEventListener('click', () => { const on = !tray.classList.contains('open'); tray.classList.toggle('open', on); ft.setAttribute('aria-expanded', on); });
    items.forEach((li, i) => { li.dataset.order = i; if (li.dataset.v) li.v = JSON.parse(li.dataset.v); });
    const word = n => n === 1 ? words[0] : (n >= 2 && n <= 4 ? words[1] : words[2]);
    let state = {};

    const readHash = () => {
      state = {};
      new URLSearchParams(location.hash.slice(1)).forEach((v, k) => { state[k] = v; });
    };
    const writeHash = () => {
      const q = new URLSearchParams(state).toString();
      history.replaceState(null, '', q ? '#' + q : location.pathname + location.search);
    };

    const setVariant = (li, m) => {
      if (!li.v) return +li.dataset.price;
      const v = li.v.find(x => x.m === m) || li.v[0];
      $$('.pi', li).forEach(img => img.classList.toggle('on', img.dataset.m === v.m));
      $('.line', li).textContent = v.l;
      $('.price', li).textContent = (m ? '' : (new Set(li.v.map(x => x.p)).size > 1 ? 'od ' : '')) + kc(m ? v.p : Math.min(...li.v.map(x => x.p)));
      const pi = $('.pi.on', li); $$('.pi', li).forEach(i => i.alt = ''); pi.alt = $('.name', li).textContent + ', ' + v.l;
      // the link opens the detail page in the gold the tile shows (#m=p), or bare when no gold is chosen
      const a = $('a', li); a.setAttribute('href', a.getAttribute('href').split('#')[0] + (m && v.m === m ? '#m=' + m : ''));
      return m ? v.p : +li.dataset.price;
    };

    const apply = (animate = true) => {
      const run = () => {
        let shown = 0;
        items.forEach(li => {
          const price = setVariant(li, state.m);
          let ok = true;
          for (const [k, v] of Object.entries(state)) {
            if (k === 'razeni') continue;
            if (k === 'cena') { const [a, b] = v.split('-').map(Number); ok = ok && price >= a && price < b; }
            else ok = ok && (li.dataset[k] || '').split(' ').includes(v);
          }
          li.hidden = !ok; if (ok) shown++;
        });
        const order = state.razeni;
        const sorted = [...items].sort((a, b) => order === 'asc' ? setPrice(a) - setPrice(b) : order === 'desc' ? setPrice(b) - setPrice(a) : a.dataset.order - b.dataset.order);
        sorted.forEach(li => grid.appendChild(li));
        const filtered = Object.keys(state).some(k => k !== 'razeni');
        countEl.textContent = filtered ? `${shown}${NB}z${NB}${total}` : `${total} ${word(total)}`;
        const nf = Object.keys(state).filter(k => k !== 'razeni').length;
        ft.textContent = nf ? `Filtrovat (${nf})` : 'Filtrovat';
        resets.forEach(r => { if (!r.closest('.empty')) r.hidden = !filtered; }); empty.hidden = shown > 0;
        $$('.tb button').forEach(b => b.setAttribute('aria-pressed', state[b.dataset.f] === b.dataset.v));
        sort.value = order || '';
        grid.classList.remove('fading');
      };
      if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) { grid.classList.add('fading'); setTimeout(run, 150); }
      else run();
    };
    const setPrice = li => li.v ? (li.v.find(x => x.m === state.m) || { p: Math.min(...li.v.map(x => x.p)) }).p : +li.dataset.price;

    $$('.tb button').forEach(b => b.addEventListener('click', () => {
      const { f, v } = b.dataset;
      if (state[f] === v) delete state[f]; else state[f] = v;
      writeHash(); apply();
    }));
    sort.addEventListener('change', () => { if (sort.value) state.razeni = sort.value; else delete state.razeni; writeHash(); apply(); });
    resets.forEach(r => r.addEventListener('click', () => { state = {}; writeHash(); apply(); }));
    addEventListener('hashchange', () => { readHash(); apply(false); });
    readHash(); apply(false);
  }

  // touch: the tile's two photos are a sideways pair; the dots follow the swipe
  const pos = el => Math.round(el.scrollLeft / el.clientWidth);
  $$('.has-worn .ts').forEach(ts => ts.addEventListener('scroll', () => { ts.parentNode.dataset.i = pos(ts); }, { passive: true }));

  // detail: metal choice swaps price, spec rows, e-shop link and shows only that gold's photo (+ the worn one)
  const mts = $$('.mt');
  if (mts.length) {
    const gal = $('.gallery');
    mts.forEach(b => b.addEventListener('click', () => {
      mts.forEach(x => x.setAttribute('aria-pressed', x === b));
      $('#pd-price').textContent = kc(+b.dataset.p);
      $$('.spec').forEach(d => { d.hidden = d.dataset.m !== b.dataset.m; });
      $('#pd-url').href = b.dataset.u;
      $$('.g-pi', gal).forEach(f => { f.hidden = f.dataset.m !== b.dataset.m; });
      const fig = $(`.g-pi[data-m="${b.dataset.m}"]`, gal);
      if (fig) gal.prepend(fig);
      gal.scrollLeft = 0;
    }));
    const pre = new URLSearchParams(location.hash.slice(1)).get('m');
    const pb = pre && mts.find(x => x.dataset.m === pre);
    if (pb) pb.click();
  }

  // detail (phone): the photo strip's "1 / 2"
  const gal = $('.gallery'), gn = $('.gnum span');
  if (gal && gn) gal.addEventListener('scroll', () => { gn.textContent = pos(gal) + 1; }, { passive: true });

  // detail: any photo opens full size in a native dialog (Esc, Zavřít or a click closes it)
  const zd = $('.zoomd');
  if (zd) {
    const zi = $('img', zd);
    $$('.zoom').forEach(b => b.addEventListener('click', () => { const im = $('img', b); zi.src = im.currentSrc || im.src; zi.alt = im.alt; zd.showModal(); }));
    zd.addEventListener('click', e => { if (e.target === zd || e.target === zi) zd.close(); });
  }

  // booking date: from the next open day (út-so), never today
  const nextOpen = () => { const d = new Date(); do d.setDate(d.getDate() + 1); while (d.getDay() < 2); return d; };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  $$('input[name="den"]').forEach(i => { const d = iso(nextOpen()); i.min = d; i.value = d; });

  // detail: booking opens in place
  const open = $('.acts .try');
  if (open) open.addEventListener('click', () => {
    const w = $('#book-pd-wrap'), on = w.hidden;
    w.hidden = !on; open.setAttribute('aria-expanded', on);
    if (on) $('input[name="jmeno"]', w).focus();
  });

  // detail: demo cart, nothing is sent anywhere
  const cart = $('.acts .cart');
  if (cart) cart.addEventListener('click', () => { $('.added').hidden = false; cart.textContent = 'V košíku'; });  // the e-shop link lives in this confirmation

  // demo forms: nothing is sent anywhere
  $$('form.book').forEach(f => f.addEventListener('submit', e => {
    e.preventDefault();
    const bad = $$('[required]', f).find(i => !i.value.trim());
    if (bad) { bad.focus(); bad.setAttribute('aria-invalid', 'true'); return; }
    const den = $('input[name="den"]', f);
    if (den && den.value && den.min && den.value < den.min) {  // typed a past day or today
      const [y, mo, d] = den.min.split('-').map(Number);
      den.setCustomValidity(`Vyberte den od ${d}.${NB}${mo}.${NB}${y}.`); den.reportValidity(); den.setCustomValidity(''); return;
    }
    if (den && den.value && new Date(den.value + 'T12:00').getDay() < 2) {  // Sunday or Monday: closed
      den.setCustomValidity('V neděli a v pondělí máme zavřeno.'); den.reportValidity(); den.setCustomValidity(''); return;
    }
    $('.sent', f).hidden = false; $('.btn', f).disabled = true;
  }));
})();
