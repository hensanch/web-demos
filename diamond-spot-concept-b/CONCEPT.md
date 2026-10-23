# DIAMOND SPOT, concept B: the gallery wall

Homepage-only prototype, CZ, real content. `index.html` + `assets/` (self-hosted fonts, 75 webp/png, `data.js`).
Screenshots: `shots/` (phone 390x844 and desktop 1440x900, fold and full page, plus interaction states
`*-ix-metal`, `*-ix-collection`, `*-ix-bands`, `*-ix-detail`, `desktop-ix-hover`, `desktop-ix-loupe`, `phone-ix-menu`).
Nothing published, sent or logged into. The only outbound link is "Do e-shopu" (`https://diamondspot.eu/cz`). No request leaves the page on load (checked: 0 external requests, 0 console errors, no horizontal overflow at either width).

## The idea in five sentences
1. Daniela describes the shop as "místo s atmosférou pařížské galerie" (`research/site-pages/diamond-spot.txt`), so the homepage is hung like a gallery wall: each piece is an object on white, and every word sits beside it like a wall label.
2. The first screen shows the name as the exhibition title and one object, the Queens ring Eakatarina. You can switch it between yellow, white, rose and black gold, and its label and price change with it (`photos-best/15b-eakatarina-four-metals/`, prices from `products.tsv`).
3. Below that, the six collections and the 244 engagement rings sit in grids that never move: picking a collection or a price range swaps the pieces in place. A strip with one tick per real ring shows where your budget falls (half of them cost less than 41 520 Kč).
4. Any piece opens a "vitrína" (detail view) with a jeweller's loupe that follows the mouse, because their gemologist works with "profesionální lupou, mikroskopy" (`identita.txt`). A short inquiry form slides open in place.
5. The only colour on the page comes from the room. The mustard plaster of Masná 15 (sampled #cbae2e from `photos-best/01a-interior-masna-crop.jpg`) is the one painted wall, and that is where the visit section sits. The black storefront fascia (#393436 from `01b-storefront-masna-15-crop.jpg`) is the footer, carrying their own logo as it appears over the door.

## Layout and type system
- **Spine.** A 12-column grid with 20 px gutters and 40 px side padding from 900 px (20 px on phones), max width 1600 px. The objects hang on the left 8 columns. Every heading, text block, label and control sits on one rail that starts at column 9 (x = 960 at 1440 px; column 8 between 900 and 1199 px). That is a 2:1 split with the text on the right, the way a wall label sits to the right of the work. On the collection and engagement sections the rail is sticky.
- **Hero.** The object area is 520 px square (capped at viewport height minus 200 px). In the rail, H1 + lede sit at the top and the wall label sits at the bottom, both in the same grid cell. On desktop the first row of collection pieces shows above the fold at 900 px. On the phone, the name, the ring, the four gold controls and the price all fit in the 844 px fold.
- **Type.** Two families, both self-hosted woff2 with latin + latin-ext:
  - Instrument Sans 400/500 for everything a visitor reads in order to act.
  - Source Serif 4 *italic* only for object titles (Eakatarina, Cube, Leo, Diana), following the museum convention that the title of a work is italic. When a piece has no model name, the full listing name is the title.
  - Fluid between 360 and 1760 px: H1 44→88 px (500, -0.035 em), H2 24→34, object title 17→20, body 16→17 / 1.55, meta 15. Hierarchy comes from weight and grey, not from size jumps.
- **Colour.**
  - White wall (#fff, so the products' own white background disappears).
  - Black for titles and prices.
  - Text #45443f (9.6:1) and muted #6b6962 (5.5:1, readable, unlike the 2.8:1 grey on Štekr).
  - Lines #e3e0d7.
  - The only saturated pixels are the gold and the stones, apart from the plaster wall and the fascia.
- **Spacing.** Built on 5 and doubling: 5/10/20/40/80/160. Inside a block the gaps are 5-40 px. Between blocks it is 160 px on desktop and 80 px on the phone. The header is 72 px (60 on the phone).
- **Products.** Square, unboxed, no border or radius, scaled 1.1 inside the square so the piece fills it. The grid is 3-up in the 8 columns, 2-up on the phone (4 pieces on the phone, 6 on desktop). Name and price are always visible, so touch users see them too (Štekr hides both until hover).
- **Motion.** Only 0.15, 0.3 and 0.5 s with plain ease, and only when the user acts: a metal crossfade, a grid fade-out and fade-in on swap (it waits for the images to decode), a 1.16 zoom and title underline on hover, the inquiry opening via grid-rows 0fr→1fr with focus moving to the first field, and the dialog fading with @starting-style. There are no keyframes, scroll reveals, parallax or snapping. `prefers-reduced-motion` turns every transition off.
- **Staging (desktop, about 8 screens; phone about 11.4).**
  1. Hero object.
  2. Collections (six tabs in the rail, each with its piece count and "od" price).
  3. Engagement rings (price strip + five budget bands with real counts: 14 / 102 / 79 / 37 / 12), then Marek and Filip.
  4. Wedding rings (the gold wall of trays `02` and the solitaire + eternity `10`, hung with centres on one line, as galleries hang pictures of different sizes).
  5. Pearls and stones (facts list + Natalie).
  6. Daniela (award photo `11` + Eva's review and Daniela's own reply side by side).
  7. Masná 15 on the plaster wall: address, hours, phone, e-mail and the "Domluvit návštěvu" form.
  8. Fascia footer with operator details (YUDC s.r.o.).
- **Forms.** Both forms submit nowhere and show "Ukázka – nic se neodeslalo."

## Why it fits DIAMOND SPOT specifically
- Daniela's pieces are architecture: square rings, cubes, a teardrop, a ring that becomes a pendant. All 94 of their designer-collection photos share one lens and one white background, so they can hang as one exhibition. A generic jeweller's lifestyle photos could not.
- The two things they are proudest of carry the page:
  - Daniela's design. Her collections come first, and the page quotes her own reply ("malá, leč hodnotná a rafinovaná umělecká díla").
  - The gemologist's stones: natural only, never laser-filled, bought at bourses in Israel and Belgium, certified GIA/HRD/IGI/TGL/GRS/YUDC, plus the loupe.
- Their own facts become tools: four golds on one model (they make black gold, which is rare), 244 engagement rings with a real median, and 600+ wedding rings to try on "u šálku dobré kávy" (their words, confirmed by Filip's review).
- Their all-caps warning ("KVŮLI NELEGÁLNÍMU KOPÍROVÁNÍ ... POUZE ČÁST KOLEKCE") becomes an invitation: "Na webu je jen jejich část, celé je uvidíte v Masné 15."
- **Genericness self-test, answered.** Would I do this for any other jeweller? Not the hero, because no other shop has Eakatarina in four golds. Not the plaster wall or the fascia footer, because those colours were sampled from their photos. Not the loupe, which traces to their gemologist text. The price strip is their 244 real prices. What would carry over to another site is the grid discipline, and that is the point of it.

## Against the Štekr reference
- **What we kept, as principles only:** one spine (our own 2:1 proportion with the rail on the right), a shallow fluid scale, a 5-based spacing system, unboxed products, a grid that stays still, short motion that only follows the user, and copy blocks of 10–35 words.
- **What we did not copy:** none of their text, images, fonts, header/menu panel, video hero, row structure, boxes, inquiry bubble, hover square, swatches or fading price filter. Our budget bands swap the pieces, and the strip carries the "where am I" information.
- **Their weaknesses we beat:** no third-party request on load, small text at 5.5:1, name and price visible without hover, and the business name is the headline.

## What would make the owner speechless
- They see their own Eakatarina in the first screen and can turn it through yellow, white, rose and black gold themselves. Then they click a ring and a loupe shows the stone the way their gemologist sees it.
- They see their 244 rings drawn as one line, with "polovina pod 41 520 Kč" marked: a sales argument they have never put on their own site.
- Daniela reads her own reply to Eva quoted next to the award photo, and finds the shop's mustard wall and black fascia in the page colours. It is their room, not a template.

## Open owner questions that this demo depends on (from RESEARCH.md)
1. Rights to the product photography and to `11-video__EyeToTheSoul-video-image.jpg`.
2. Confirm that photo `02` (the gold wall of trays) shows Masná 15. It is captioned only "v obchodě".
3. The e-mail domain: .cz or .eu.
4. Whether "náš gemolog" can be named.
5. Whether "od" prices and the engagement range may be shown. Prices are from their e-shop on 23. 10. 2026 and will drift: the page says "Cena podle e-shopu".
6. Portraits `04`/`05` are deliberately unused until the owner confirms they show Daniela.
7. No "beograd" photos are used.
8. Eva's emoji ending was dropped and "Komatovič" corrected to "Komatović" (typo rule).

## Not done here
- No USED-LOOKS.md row yet. The orchestrator should add one once a concept is picked: Instrument Sans + Source Serif 4 italic titles, a white gallery wall plus mustard plaster and fascia, a hero object with a four-gold switcher, and the loupe plus price strip as the bold element.
- No critic round has been run.
- Disk was at 6.5 GB at the end, below the 7 GB floor, after other workflows ran. This build adds 8.4 MB (assets 2.7 MB, shots 5.7 MB).
