# DIAMOND SPOT, concept C: "Into the gold wall"

## The idea in 5 sentences
1. The page opens on their real back wall (`photos-best/02`): mustard plaster, the gold 3D letters DIAMOND SPOT, and rows of black trays with white cushions. As you scroll, the photo leaves its column, the white page floods into the same plaster colour, and the photo dissolves into the wall, so you have walked into the shop.
2. On that wall, one black-framed "tray" with a white inside stays pinned while six short chapters scroll past it: Výběr, Návrh, Kámen, Kov, Velikost, Snubní. That is the engagement ring from choosing it to wearing it.
3. One real ring runs through the story. Their 0,46 ct brilliant BRR105746 (59 500 Kč) sits in the choice tray. Its own "Certifikát pravosti" appears in their shop film (frame at 36.5 s, product ID BRR105746Y1, 0,46 ct, SI1, G, Au 585). In the Kov chapter you switch it between white, yellow and rose gold.
4. Everything that moves answers your scroll or tap: the wall reveal, the tray crossfades, the six cushions filling one by one, the index underline, the metal switch. With reduced motion every one of these is a static layout.
5. After the wall the page cuts to white for Daniela Komatović (the A' Design Award trophy, her own reply to a review, six collections with "od" prices), then to the charcoal concrete wall for Masná 15 (hours, live open state, phone, a booking form that sends nothing).

## Layout and type system
- **Spine:** a 12-column grid. Text sits in columns 1–5 and the stage in 6–12, so content starts at about x = 620 at 1440 px. Side padding is clamp(20 px, 4 vw, 56 px), max width 1600, gap clamp(16, 2.2 vw, 32). On phones it is one column, and the stage pins under the 56 px header.
- **Scenes, not sections:** three grounds come from the room (`palette.py` on 01a/01b/02). White `#fff` (cushions, lit niches), plaster `#d7bd5c` (back wall, with a procedural stucco relief at 20 % multiply), concrete `#2f302c` (left wall). Ink is `#1c1b18` and tray black `#14120f`. The fixed header changes its ground with the scene (0.5 s), and the logo swaps between ink, ink-with-gold and silver.
- **One accent, one job:** plaster gold is a surface. On concrete it is also the submit button and the phone bar's primary button. The only saturated pixels are the room, the gold and the stones.
- **Type:** Jost (Futura lineage, matching their geometric logo and the 1930s functionalist Kohn building), self-hosted at 100 KB. The scale is shallow and fluid from 360 to 1600 px: meta 14→16, body 16→18 at 1.55, h3 19→24 (500), h2 30→46 (300), h1 48→92 (300). Quotes use Jost italic 300. Hierarchy comes from weight and grey, never uppercase or tracking.
- **Spacing:** sections are 84→160 px apart. Inside blocks the steps are 6/10/14/24 px, so the large gaps between blocks contrast with the small ones inside.
- **Products** are unboxed 1:1 cutouts on white with name and price always visible (no hover-only info). The "cushion" grid (4–6 px warm grey gaps) is lifted from their wall trays.
- **Motion:** 0.3 / 0.5 / 0.7 / 0.9 s, one easing curve, all driven by the user. There are no keyframes, no snapping and no autoplay.
- **Length** (reduced-motion static layout): 9.8 desktop screens and 11.5 phone screens. The cinematic version adds about 0.85 screen of scroll for the wall reveal.

## Why it fits DIAMOND SPOT and nobody else
- The mustard plaster, the black trays with white cushions and the concrete wall are their room (`01a`, `02`, `01b`). A different jeweller's page cannot be this colour.
- The engagement ring is their core product: over 300 models, 10 180–525 000 Kč, median about 41 500 (from `products.tsv`). The six chapters use only their own facts. Natural stones never laser-filled, the bourses in Israel and Belgium, GIA/HRD/IGI/TGL/GRS/YUDC and Au 585/750 come from `identita.txt`. Custom design and the 5-week making time come from Marek's review, word for word. Sizing from photos and videos and free resizing come from Filip's review, word for word. "600+ wedding models, all can be tried on" comes from `home-cz.txt`.
- The thread ring's certificate comes from their own film. The metal switcher uses their own three photos of the same ring (identical angle, same price).
- A real person stands behind the brand: Daniela's reply to Eva, in her own voice, is the largest quote on the page.
- It beats the sperky-stekr.cz weaknesses. Nothing third-party loads (verified: 0 external requests in WebKit). Small text is ≥ 4.5:1. Name and price never need hover. The headline is the business name.

## What would make the owner speechless
Henry scrolls once on his phone. Their own gold wall with their name opens up, and the page turns the colour of their shop. Then their own 0,46 ct ring is followed through their own certificate and switches gold colour under the owner's thumb. Finally Daniela's own sentence about "malá, leč hodnotná a rafinovaná umělecká díla" appears as the centrepiece. None of it is stock and none of it is invented. It looks like the room they designed, not like a template.

## Files and provenance (every image is theirs)
`img/zed-*.jpg` ← photos-best/02 · `navrh.jpg` ← shop film 11.5 s (1080p frame, right crop) · `certifikat.jpg` ← shop film 36.5 s · `kov-*.jpg` ← products BRR105746W/Y/P · `r-*.jpg` ← products 500443, BRRS018Y, RN128977WEM, BRR105746W, SRR25533B, RN027604WEM · `c-*.jpg` ← DKR-COSBDYS-Y, DKR-V1CTD-BRY, SRR25729, DKIPEMPY1, DKR-QKWFWPEM-W, DKR-SPD-Y · `velikost.jpg` ← photos-best/06 · `snubni.jpg` ← 10 · `ocenen.jpg` ← 11 · `perly.jpg` ← 08 · `kamen-darek.jpg` ← 13 · `poukaz.jpg` ← 12 · `masna15.jpg` ← 01b · `logo-*.png` ← their public diamond-spot-logo_cz.png (silver original, plus two recolours).
The only outbound link is "do e-shopu" → https://diamondspot.eu/cz. Other links are tel:, mailto: and in-page anchors. The form shows "Ukázka – nic se neodeslalo".

## Verification
WebKit at 1440×900 and 390×844 gave 0 console errors, 0 failed requests, 0 external requests and no horizontal overflow. At 390×664 the hero button's bottom edge is at 612 px, inside the first screen. `lint-typo.py` passes clean. Screenshots are in `shots/`:
- folds: `d-fold`, `m-fold`, `m-fold-664`
- wall reveal: `*-vstup-30/55/85`
- six chapters: `*-krok1..6`
- `*-daniela`, `*-perly`, `*-navsteva`
- full pages: `d-full.jpg`, `m-full.jpg`, captured with reduced motion because a sticky scroll sequence cannot be shown in one still.

## Open items
- **Owner questions:** whether custom design with a free visualisation is a standing offer (the page says "navrhneme prsten podle vás"); free resizing; .cz or .eu email; whether hours are still Tue–Sat 11–19; OK to show the 10 180–525 000 Kč range and the "od" prices.
- **Not done:** the critic round. I also did not append a row to USED-LOOKS.md, because sibling concepts are running in parallel; the orchestrator should append a row for the winning concept. The look to record: Jost; plaster `#d7bd5c`, concrete and white scenes; the wall-reveal hero; the pinned tray with six chapters.
- **Disk:** free space was 6.8 GB at start and 6.4 GB at the end, under the 7 GB floor, partly from parallel workflows. This concept uses 10.4 MB (2 MB img, 0.1 MB fonts, 8.3 MB shots).
