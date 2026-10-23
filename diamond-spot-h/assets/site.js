// DIAMOND SPOT H: menu, photos that arrive once loaded, listing filter, detail gold + view switch and zoom, demo forms.
// Nothing moves unless the visitor asks; there is no video anywhere.
(() => {
  // set here, not in an inline head script: if this file never arrives, nothing stays hidden (the pieces fade in only with it)
  document.documentElement.classList.add('js');
  const $ = (s, el = document) => el.querySelector(s), $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const kc = n => n.toLocaleString('cs-CZ').replace(/\s/g, ' ') + ' Kč';
  const NB = ' ';
  const still = matchMedia('(prefers-reduced-motion: reduce)');

  // menu: a sheet under the header; Esc, a link or a click outside closes it
  const mb = $('.menu-btn'), menu = $('#menu');
  const setMenu = open => {
    mb.setAttribute('aria-expanded', open); menu.hidden = !open; mb.textContent = open ? 'Zavřít' : 'Menu';
    if (open) { const a = $('nav a', menu); if (a) a.focus({ preventScroll: true }); }
  };
  mb.addEventListener('click', () => setMenu(mb.getAttribute('aria-expanded') !== 'true'));
  $$('#menu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && !menu.hidden) { setMenu(false); mb.focus(); } });
  document.addEventListener('click', e => { if (!menu.hidden && !menu.contains(e.target) && !mb.contains(e.target)) setMenu(false); });

  // pieces fade in once loaded (.5 s), so alt text never paints; a broken or late file never blocks the page
  const shown = (img, el) => { const done = () => el.classList.add('ld'); if (img.complete && img.naturalWidth) done(); else { img.addEventListener('load', done, { once: true }); img.addEventListener('error', done, { once: true }); } };
  $$('.pf').forEach(t => { const i = $('img.on', t) || $('img', t); if (i) shown(i, t); else t.classList.add('ld'); });
  $$('.stage img:not([hidden])').forEach(i => shown(i, i));

  // listing filter: the choice lives in the hash; a piece with several golds shows the one chosen
  const tray = $('#tray');
  if (tray) {
    const grid = $('.grid-f'), items = $$('.item', grid), total = items.length;
    const words = JSON.parse(tray.dataset.words), countEl = $('.state .count'), empty = $('.empty');
    const resets = $$('.reset'), sort = $('#sort'), ft = $('.ftoggle');
    ft.addEventListener('click', () => { const on = !tray.classList.contains('open'); tray.classList.toggle('open', on); ft.setAttribute('aria-expanded', on); });
    items.forEach((li, i) => { li.dataset.order = i; if (li.dataset.v) li.v = JSON.parse(li.dataset.v); });
    const word = n => n === 1 ? words[0] : (n >= 2 && n <= 4 ? words[1] : words[2]);
    let state = {};
    const readHash = () => { state = {}; new URLSearchParams(location.hash.slice(1)).forEach((val, k) => { state[k] = val; }); };
    const writeHash = () => { const q = new URLSearchParams(state).toString(); history.replaceState(null, '', q ? '#' + q : location.pathname + location.search); };

    const setVariant = (li, m) => {
      if (!li.v) return +li.dataset.price;
      const vv = li.v.find(x => x.m === m) || li.v[0];
      $$('.pi', li).forEach(img => img.classList.toggle('on', img.dataset.m === vv.m));
      $('.price', li).textContent = (m ? '' : (new Set(li.v.map(x => x.p)).size > 1 ? 'od ' : '')) + kc(m ? vv.p : Math.min(...li.v.map(x => x.p)));
      const pi = $('.pi.on', li); $$('.pi', li).forEach(i => i.alt = ''); pi.alt = $('.name', li).textContent + ', ' + vv.l;
      // the link opens the detail page in the gold the tile shows (#m=p), or bare when no gold is chosen
      const a = $('a', li); a.setAttribute('href', a.getAttribute('href').split('#')[0] + (m && vv.m === m ? '#m=' + m : ''));
      return m ? vv.p : +li.dataset.price;
    };
    const setPrice = li => li.v ? (li.v.find(x => x.m === state.m) || { p: Math.min(...li.v.map(x => x.p)) }).p : +li.dataset.price;

    const apply = (animate = true) => {
      const run = () => {
        let n = 0;
        items.forEach(li => {
          const price = setVariant(li, state.m);
          let ok = true;
          for (const [k, val] of Object.entries(state)) {
            if (k === 'razeni') continue;
            if (k === 'cena') { const [a, b] = val.split('-').map(Number); ok = ok && price >= a && price < b; }
            else ok = ok && (li.dataset[k] || '').split(' ').includes(val);
          }
          li.hidden = !ok; if (ok) n++;
        });
        const order = state.razeni;
        [...items].sort((a, b) => order === 'asc' ? setPrice(a) - setPrice(b) : order === 'desc' ? setPrice(b) - setPrice(a) : a.dataset.order - b.dataset.order).forEach(li => grid.appendChild(li));
        const filtered = Object.keys(state).some(k => k !== 'razeni');
        countEl.textContent = filtered ? `${n}${NB}z${NB}${total}` : `${total} ${word(total)}`;
        const nf = Object.keys(state).filter(k => k !== 'razeni').length;
        ft.textContent = nf ? `Filtrovat (${nf})` : 'Filtrovat';
        resets.forEach(r => { if (!r.closest('.empty')) r.hidden = !filtered; }); empty.hidden = n > 0;
        $$('.tb button').forEach(b => b.setAttribute('aria-pressed', state[b.dataset.f] === b.dataset.v));
        sort.value = order || '';
        $$('.pf', grid).forEach(t => { if (!t.classList.contains('ld')) shown($('img.on', t) || $('img', t), t); });
        grid.classList.remove('fading');
      };
      if (animate && !still.matches) { grid.classList.add('fading'); setTimeout(run, 150); } else run();
    };
    $$('.tb button').forEach(b => b.addEventListener('click', () => {
      const { f, v: val } = b.dataset;
      if (state[f] === val) delete state[f]; else state[f] = val;
      writeHash(); apply();
    }));
    sort.addEventListener('change', () => { if (sort.value) state.razeni = sort.value; else delete state.razeni; writeHash(); apply(); });
    resets.forEach(r => r.addEventListener('click', () => { state = {}; writeHash(); apply(); }));
    addEventListener('hashchange', () => { readHash(); apply(false); });
    readHash(); apply(false);
  }

  // detail: one square. The gold buttons swap the piece, price, spec rows and e-shop link; the two thumbs swap piece and worn photo
  const stage = $('.stage');
  if (stage) {
    const pis = $$('.g-pi', stage), worn = $('.g-worn', stage), vws = $$('.vw'), mts = $$('.mt');
    let m = pis[0].dataset.m;
    const reveal = i => { i.hidden = false; i.loading = 'eager'; shown(i, i); };
    const show = view => {
      pis.forEach(i => { if (view === 'pi' && i.dataset.m === m) reveal(i); else i.hidden = true; });
      if (worn) { if (view === 'worn') reveal(worn); else worn.hidden = true; }
      vws.forEach(b => b.setAttribute('aria-pressed', b.dataset.view === view));
    };
    vws.forEach(b => b.addEventListener('click', () => show(b.dataset.view)));
    mts.forEach(b => b.addEventListener('click', () => {
      mts.forEach(x => x.setAttribute('aria-pressed', x === b)); m = b.dataset.m;
      $('#pd-price').textContent = kc(+b.dataset.p);
      $$('.spec').forEach(d => { d.hidden = d.dataset.m !== m; });
      $('#pd-url').href = b.dataset.u;
      const th = $('.vw[data-view="pi"] img'), cur = pis.find(i => i.dataset.m === m);
      if (th && cur) th.src = cur.getAttribute('src').replace('-f.webp', '-t.webp');
      show('pi');
      history.replaceState(null, '', '#m=' + m);
    }));
    const fromHash = () => { const pre = new URLSearchParams(location.hash.slice(1)).get('m'), pb = pre && mts.find(x => x.dataset.m === pre); if (pb && pb.getAttribute('aria-pressed') !== 'true') pb.click(); };
    fromHash(); addEventListener('hashchange', fromHash);

    // any photo opens full size in a native dialog (Esc, Zavřít or a click closes it)
    const zd = $('.zoomd'), zi = $('img', zd);
    $('.zoom').addEventListener('click', () => { const im = $$('img', stage).find(i => !i.hidden); zi.src = im.currentSrc || im.src; zi.alt = im.alt; zd.showModal(); });
    zd.addEventListener('click', e => { if (e.target === zd || e.target === zi) zd.close(); });
  }

  // forms: enabled only here, so without JS nothing can be submitted at all
  $$('form.book fieldset').forEach(f => { f.disabled = false; });

  // booking date: from the next open day (út-so), never today
  const nextOpen = () => { const d = new Date(); do d.setDate(d.getDate() + 1); while (d.getDay() < 2); return d; };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  $$('input[name="den"]').forEach(i => { const d = iso(nextOpen()); i.min = d; i.value = d; });

  // detail: the booking form opens in place (.3 s) with the piece already filled in
  const tryBtn = $('.acts .try'), bw = $('#book-pd-wrap');
  if (tryBtn && bw) tryBtn.addEventListener('click', () => {
    const on = !bw.classList.contains('open');
    bw.classList.toggle('open', on); bw.inert = !on; tryBtn.setAttribute('aria-expanded', on);
    if (on) $('input[name="jmeno"]', bw).focus({ preventScroll: true });
  });

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
