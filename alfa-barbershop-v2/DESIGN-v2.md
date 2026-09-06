# ALFA Barber Shop – v2 (2026-09-06 večer, po trojité revizi)

Henry: "This is a product someone will pay 12k for." Tři agenti (AI tells / mobil+prodej / WebKit+správnost), nálezy zapracované.

## Co je na stránce
- Barvy: grafitová #2e3134 jako stěny salonu. Zlatá #d8b76a **jen** na wordmarku ALFA (masthead, hero, menu), jako nápis na stěně. Tlačítka, hodnocení, dnešní den = světlé písmo.
- Písmo: Big Shoulders Display 700/900 + Barlow. Latin-ext ověřeno v reálném WebKitu (simulátor iPhone 17).
- První obrazovka: fotka salonu 5:4 s velkým ALFA / BARBER SHOP (Henry chtěl zpět), jedna věta, 5,0 ze 152 | dnešní hodiny, Trasa + Zavolat, stav otevřeno/zavřeno. Vejde se do 664 px (Safari s lištou).
- Tři sekce, ne pět: Střihy (1 velká + 3 malé fotky s názvem ve fotce, poznámka o čekárně, pás dalších fotek), Recenze (velké 5,0, tři citace, odkaz), Kde nás najdete (adresa, hodiny s "dnes", mapa).
- Žádné podtitulky pod nadpisy, žádné slovní dlaždice, žádný slogan, žádné středové tečky.
- Dětský střih = skutečné dítě (c5), ne prošedivělý pán (c8 šel do pásu).
- Citace: překlepy recenzentů opraveny (mých, milý), duplicitní fragment a seznam jmen barberů vyhozen (fluktuace).
- Bez fotky čekárny (jediná je špatná: noha, načatá Mattonka). Henry: raději žádná.

## Technika
- JSON-LD BarberShop (hodiny, telefon, adresa, hodnocení). og:image + rozměry.
- Menu = role dialog, aria-modal, `inert` na zbytek stránky; Escape zavírá.
- Stav otevřeno je skrytý, dokud ho JS nenaplní (bez JS žádná osamělá tečka). aria-live.
- Mapa: div + iframe (pointer-events none) + odkaz jako overlay (validní HTML).
- Spodní lišta: IntersectionObserver + pasivní scroll listener (simulátor jednou lištu neukázal).
- scroll-margin-top 57 px při hlavičce 61 px, předchozí sekce se schová.
- Všechny klikací prvky ≥ 44 px.

## Otevřené
- Ceny: nikde. Oba recenzenti: největší díra pro walk-in zákazníka. Jen majitel (otázka na pondělí).
- Hero fotka 1500×844 se na telefonu mírně zvětšuje (1,1×). Lepší zdroj od majitele.
- Pro ostrý provoz změnit og:image a JSON-LD image na finální doménu.
