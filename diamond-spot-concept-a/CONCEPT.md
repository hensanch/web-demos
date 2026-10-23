# DIAMOND SPOT, concept A: the issue (editorial)

Homepage prototype: `index.html` + `assets/` (self-hosted fonts, WebP images, 10 MB total). Screenshots are in `shots/`:
`A-1440-fold/full`, `A-390-fold/full`, `ix-1440-kolekce-queens` (collection tab switched), `ix-1440-prsteny-osa`
(price axis on hover) and `ix-390-obsah` (phone contents drawer). Nothing was published, sent or logged into. The
page makes no third-party request on load (checked over local HTTP: every request went to 127.0.0.1, with 0 console
errors).

## The idea in 5 sentences
1. The homepage is laid out like an issue of a fashion magazine about one shop. The nameplate "Diamond Spot" is set
   in hairline Bodoni across the whole width. The portrait with Vertex rings is the cover, and five cover lines act
   as the table of contents.
2. Every section runs on the same spine. A narrow column on the left holds the section title and a short paragraph,
   and the wide column on the right holds the work. The page breaks that spine twice, with the mustard wall and the
   black counter, and both colours come from the room on Masná.
3. The six designer collections share one fixed spread. Picking a name swaps the photo, the text and three pieces in
   place, so nothing on the page moves or reflows.
4. Reviews are set as pull quotes next to what they praise: Eva and Daniela's reply in the collections spread,
   Filip's sizing story in the engagement rings, Marek's five weeks in made-to-order, Natalie in pearls.
5. Every price is visible without hovering. The single "Do e-shopu" link in the header is the only way out of the
   page, so this is a brand front for the e-shop they already run, not a replacement for it.

## Layout and type system
- **Spine 1 : 3** (`.list`, `minmax(0,1fr) minmax(0,3fr)`, 60 px gap) from 1000 px. The content edge sits at
  x = 434 at 1440 px. The header uses the same grid from 1240 px, so the running head (the name of the section
  you're reading) sits on the spine.
- **Container:** max 1600 px, side padding `clamp(20px, 4vw, 60px)`. Breakpoints are 560 / 640 / 700 / 760 / 800 /
  900 / 1000 / 1200 / 1240, each one used for a single job.
- **Type:** Bodoni Moda (variable, optical size 6-96, normal + italic, 400 only) for the nameplate, headings, cover
  lines, collection names and quotes. Urbanist (400 / 500 / 600) for body text, captions and prices.
  - The nameplate is the one bold move: `clamp(56px, 15.1vw, 242px)`, tracking -0.035em. It fills the container
    exactly at 1440 (1334 / 1334 px) and sits on a 1 px rule that the descender of "p" breaks through.
  - On phones the nameplate becomes two stacked lines at 23.6vw, "Diamond" on the left and "Spot" on the right.
  - The rest of the scale is shallow: H2 30→44, H3 22→28, quotes 20→25 italic, body 16/17 at 1.55, captions 14/15.
  - Hierarchy comes from weight and grey: ink #1d1c20 for titles, #4b494f body (8.6:1), #6a676e captions (5.4:1).
  - There are no caps labels, no eyebrows, no middle dots and no arrows.
- **Spacing** steps in fives: 5/10/20/30/40/60/80/120/160. Blocks are separated by `clamp(80px, 8vw, 130px)`.
- **Colour:** the white of the product photos (#fff, measured) is the page, and the black glitter counter #1d1c20 is
  the ink. Mustard plaster #d4ba5a appears once, as the surface of the wedding-ring spread. The counter colour is
  the surface of the visit section, with silver #c9c7cc text taken from the fascia letters. The gold and the stones
  are the only other saturated pixels, plus one small green dot that shows the shop is open.
- **Products** are 1:1 cutouts on pure white with no box, border or radius. Name and price are always visible.
  Grids are 4-up (engagement) or 3-up (collections) on desktop and 2-up or 3-up on phone.
- **Motion** only happens when the user does something. Durations are 0.15 / 0.3 / 0.5 s with plain ease:
  - the wordmark fades into the header once the nameplate has scrolled away;
  - the running head cross-fades;
  - the contents drawer opens on phone (grid-rows 0fr→1fr);
  - collection tabs cross-fade;
  - on the price axis, the diamond marker slides to the price of the ring you point at.
  There are no keyframes, scroll reveals, parallax or snapping. `prefers-reduced-motion` turns every transition off.
- **Accessibility and craft:**
  - collection tabs are a real ARIA tablist (arrow keys work);
  - the drawer closes with Esc;
  - focus rings are visible on both light and dark sections;
  - tap targets are at least 44 px;
  - anchors use `scroll-margin-top` so a jump never leaves a sliver of the previous section under the fixed header;
  - the open/closed line is computed in Europe/Prague time, with static hours as the fallback.
- **Measured:**
  - desktop: 7,111 px tall (7.9 screens at 900);
  - phone: 9,854 px tall (11.7 screens at 844);
  - phone fold: the main button ends at y = 471 (inside 664), with the nameplate, intro, open state and phone
    number above it;
  - no horizontal overflow at 390.

## Why it fits DIAMOND SPOT specifically
- **The owners make a magazine already.** Daniela studied graphic design and photographs (`site-pages/autorske-sperky.txt`).
  The collection photography is one consistent studio series of hands on grey and white
  (`photos-site/orig/*-1150-*.jpg`, `photos-best/04`, `05`). Their own words say the shop has "atmosféra pařížské
  galerie" (`site-pages/diamond-spot.txt`). An editorial layout is the format that material was shot for.
- **It treats the brand as a set of authored collections, not a catalogue.** Six named collections with their own
  stories (Horus, Homer's kosmos, Mucha, queens of history) give a magazine real features to run. A ring-tray shop
  could not fill this layout.
- **The colours come from the room.** The mustard plaster was sampled from `photos-best/02` (#d4ba5a) and the
  counter from `photos-best/01a` (#1d1c20). The grey-sage behind Daniela's portrait (`04`, #7c8577) matches the sage
  curtain in `01a`.
- **The geometry is theirs.** Square cells for Vertex, a circle-free grid, and one diamond-shaped marker on the price
  axis, which is the diamond-in-the-O from their logo (`/assets/img/diamond-spot-logo_cz.png`, inspected only).
- **The proof comes from them.** Every fact traces to their own pages or reviews. The provenance is listed below.

## What would make the owner speechless
1. **The designer on the cover (`04`; most likely Daniela, to be confirmed, and the caption doesn't name her), under a nameplate set like Vogue's**, with her own collections as the cover lines. Their
   current site opens on a stock-looking ruby-heart carousel under a cookie wall (`research/THEIRS-now-390-fold.png`).
2. **Her reply to Eva printed as a letter to the editor:** "…nejsou pouhým módním doplňkem, ale … malá, leč hodnotná
   a rafinovaná umělecká díla." The designer reads her own words, set the way she would want them.
3. **The award ring with its trophy** (`photos-best/11`) and the line "Prsten, který se promění v přívěsek". Their
   site currently tells this story in a banner graphic with the text baked in.
4. **The gold wall with their name in 3D letters** (`photos-best/02`), shown full-bleed on a page painted the same
   mustard as the plaster. The page turns into their shop.
5. **The engagement-ring price axis.** It runs from 10 180 to 525 000 Kč with the median of 41 500 marked, and
   pointing at any ring slides the diamond to its price. It shows a 300-model range honestly without a filter UI.

## Provenance (every fact on the page)
- **Address, hours, phone, email:** Masná 699/15, út-so 11-19, ne+po zavřeno, 778 880 111, info@diamondspot.cz
  (`site-pages/kontakt.txt`).
- **Step-free entrance:** `maps.json`.
- **Legal footer:** YUDC s.r.o., IČ, DIČ, sídlo, C 237129 (`site-pages/obchodni-podminky.txt` lines 6-10).
- **About the shop:** "na půl cesty mezi Staroměstským náměstím a Náměstím Republiky", "sklonku roku 2017",
  "funkcionalistický dům Otty a Karla Kohnů" (`site-pages/o-diamond-spot.txt`).
- **Daniela:** graphic design in Prague, paints, draws, photographs (`autorske-sperky.txt`).
- **Collection texts:** condensed from each collection page (`eye-to-the-soul.txt`, `vertex-kolekce.txt`,
  `cosmos-kolekce.txt`, `liberty.txt`, `queens.txt`, `diamond-spot.txt`).
- **Piece counts and "od" prices:** min per page in `products.tsv` (ETTS 14 / 55 400, Vertex 15 / 19 650,
  Cosmos 20 / 24 630, Liberty 12 / 72 000, Queens 21 / 42 080, Diamond Spot 12 / 21 950).
- **Product names and prices:** `products.tsv`. Names are shortened only by dropping secondary carat figures, and
  "Zasnubní" is corrected to "Zásnubní".
- **Engagement rings:**
  - "přes 300 modelů" (`zasnubni-prsteny.txt`, `home-cz.txt`);
  - 244 unique listings in `products.tsv`, from 10 180 to 525 000 Kč;
  - median 41 500 (RESEARCH.md);
  - "jasného původu s certifikátem" (`zasnubni-prsteny.txt`).
- **Wedding rings:** "více než 600 modelů", "Všechny modely je možné vyzkoušet u šálku dobré kávy"
  (`snubni-prsteny.txt`); pairs 19 599-75 656 (`products.tsv`).
- **Making process:** the steps and the 0,016-0,33 mm layers, Au585 / Au750, gravura, nielo and rhodium all come
  from `identita.txt`.
- **Stones:** the bourses in Israel and Belgium, the source countries, "lupou, mikroskopy … váhami … certifikátem"
  and "inkluze … nejsou vyplňovány laserem" all come from `identita.txt` / `home-cz.txt`. The certificate list
  comes from `o-diamond-spot.txt`.
- **Pearls:** Tahitian from French Polynesia, gold South Sea, snow-white Akoya and Chinese freshwater, with grades
  AAA / AAA+ / AAAA (`perly.txt`, `home-cz.txt`). Their text spells the province "Suzu", so the page says "z Číny".
- **Reviews:** verbatim from `reviews.json`, with first names only.
  - Eva: "Komatovič" corrected to "Komatović", and her trailing emoji dropped.
  - Daniela's reply: the opening "Milá Evo," was dropped.
  - Marek and Filip: excerpts.
  - Natalie: one sentence.
  - Dan is not quoted. No fragment is used twice.
- **Rating:** 5,0 / 172 (`maps.json`).

## Photos used (all theirs, from `research/`)
- **Cover:** `photos-best/04`.
- **Collection leads:** `11` (ETTS + trophy), `15` (Vertex Cube still), `photos-site/orig/...cosmos-1150...`,
  `...liberty-1150...`, `05` (Queens), `...emerald-spo-ring...` (Diamond Spot, B/W).
- **Engagement rings:** `...zasnubni-prsteny-1785431374`.
- **Wedding rings:** `02`, `10`.
- **Stones and pearls:** `photos-maps/g05`, `08`.
- **Visit section:** `01a`, `01b`.
- **Products:** 22 cutouts from `photos-site/products__1150x1150__*`.
- **Not used:** none of the `beograd` photos. None of the banners with baked-in text.

## Rules check
- **Links:** one external web link (`Do e-shopu` → https://diamondspot.eu/cz), plus `tel:` and `mailto:` to their
  own number and address.
- **Products** don't link to the shop. The single e-shop link is in the fixed header and is always visible.
- **Map:** loads only on click.
- **Form:** submits nowhere. "Ukázka: formulář nic neodesílá." is always visible, and after Odeslat the page shows
  "Ukázka – nic se neodeslalo."
- **Fonts:** self-hosted woff2 (latin + latin-ext).
- **No copying from sperky-stekr.cz:**
  - **Spine:** 1:3 at x = 434, not 30/70 at 448.
  - **Type:** a Didone + geometric sans pairing, not sans + PT Serif.
  - **Header:** white, with a running head. No black header and no left slide-in panel; the phone gets a drop-down
    contents drawer.
  - **Hero:** a cover with no video.
  - **Structure:** no row repetition and no four boxes.
  - **Detail interactions:** no hover square or white fade, no metal swatches, no fading price filter.
  - **Copy, colours and code:** none of theirs.

## Not done here
- **Owner questions** (see RESEARCH.md):
  - confirm that the portraits in `04` / `05` may be used, and whether that is Daniela;
  - which email domain, .cz or .eu;
  - what Reservio books, which would replace the visit form;
  - CZ + EN;
  - OK to show the price range.
- **Workflow steps left to the orchestrator:**
  - no row appended to `USED-LOOKS.md`; the orchestrator does that for the concept it picks;
  - no critic pass;
  - no iOS Simulator run.
