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

## 2026-09-06 pozdě večer — druhá revize (dva čerství kritici, po přestavbě)
AI-tells 6/10 (z 5), sells 7, mobile 8. Opraveno: dvě vymyšlená fakta ("na gauči" – v salonu je jen židle a stolek; "děti stříháme i s rodiči u křesla" – nikde v podkladech), dvě špatné popisky střihů (c6 je fade, ne buzzcut; c3 je delší střih s přechodem, ne fade), zlatá jen jednou (masthead ALFA je teď světlý, zlaté je jen velké ALFA na fotce), hero 16:11 (méně zvětšování), poznámka o čekárně nad mřížkou (ne mezi dvěma bloky fotek), desktop 1 velká + 4 malé čtvercové (ne čtyři stejné dlaždice), odkaz na všechny recenze pod skóre (mrtvý sloupec), když je zavřeno, velká buňka ukazuje příští otevírací dobu, hodiny na dvě řádky, mapa 4:3, "pití a bonbony jsou zdarma" (z recenzí). Kritik: sdílí s DB v3 stejnou kostru první obrazovky a stejný JS – vizuálně jiné, strukturálně příbuzné. Otevřené: ceny (majitel), jak najít jednotku v OC Cíl (majitel), og:image na finální doménu při předání.
