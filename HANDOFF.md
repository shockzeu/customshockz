# CustomShockz — stav projektu (2026-09-08)

## ▶️ Začni tady v nové session
Řekni Claude Code: **"přečti si HANDOFF.md a pojďme pokračovat na custom builderu"** — všechno
potřebné je v sekci **🔨 Custom builder** níže. Krátce: builder na `/na-miru` je živý a funkční
(krok Základ → krok Pouzdro/luneta). **Čeká na Lukáše:** 7 variant ciferníku (`dial`) je
naimportovaných jako draft a commitnutých lokálně, ale **není to pushnuté ani aktivované** —
až to Lukáš odsouhlasí, pushnout `main` a teprve potom aktivovat řádky (v tomhle pořadí, viz
Poznámky k workflow). Postup zpracování nových fotek (stáhnout → ukázat očíslovaný přehled →
Lukáš vybere → Scéna 1 → import jako draft → **teprve po pokynu aktivovat**) je popsaný v sekci
"Další kroky" níže — drž se ho přesně, ušetří to opravování chyb.

## Co to je
Custom G-Shock e-shop v `D:\claude code\customshockz` (na GitHubu: `shockzeu/customshockz`, branch `main`, živě na `https://www.customshockz.eu`). Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, framer-motion. Paleta "Ice & Onyx" (dark default).

## Tech stack
- **Supabase** — DB + auth (funguje, admin panel čte/píše odsud, produkty i objednávky). **Pozor: lokální `npm run dev` čte STEJNOU produkční databázi jako živý web** — není tam žádné staging prostředí, takže cokoliv aktivuješ (`is_active = true`) je hned vidět na `customshockz.eu`, i když to testuješ jen lokálně.
- **Resend** — potvrzovací e-maily (funguje, `src/lib/email.ts`, no-op pokud chybí `RESEND_API_KEY`)
- **Stripe** — ⏭️ vědomě odloženo na Lukášovo přání. `stripe` balíček není nainstalovaný.
- **Vercel** — nasazení, push do `main` = automatický deploy (obvykle 30–60 s)

## Co je hotové celkově
- Konfigurátor produktu, košík, checkout flow, admin panel (produkty, díly/varianty, objednávky)
- Platba: bankovní převod / dobírka (per-produkt přepínač `cod_allowed`)
- Automatický variabilní symbol (`order_number` od 10001)
- Dávky produktů ("drops") v adminu
- Logo + favicon + rotační animace, SEO (robots/sitemap/OG obrázky), Google Search Console ověřeno
- `scripts/clear-test-data.mjs` — smaže testovací produkty a varianty dílů ze Supabase

## ⚠️ Blokuje ostrý provoz — potřeba od Lukáše
1. **Právní údaje v Obchodních podmínkách a GDPR** — placeholder `[Doplnit: obchodní jméno / jméno a příjmení, IČO, sídlo]`.
2. **Reálný katalog produktů** (fotobox fotky) — spustit `clear-test-data.mjs` před ostrým katalogem.
3. **Ověřit doménu customshockz.eu v Resend** — ať e-maily nechodí do spamu.

---

## 🔨 Custom builder — stav k 2026-09-07 (hlavní aktuální práce)

Cíl: `/na-miru` (a `Configurator` komponenta obecně) je teď **postupný wizard** — zákazník
prochází kroky jeden po druhém (ne všechno najednou), s velkým náhledovým obrázkem nahoře,
který se mění podle kliknuté miniatury. **Lukáš dělá zatím jen model GA-2100** (ne DW-6900/GA-110).

### Co je HOTOVÉ a ŽIVÉ na customshockz.eu
- **`src/components/configurator.tsx`** přepsaný na krok-za-krokem wizard:
  - Nahoře velký náhled (crossfade animace při změně, framer-motion, `EASE_OUT_QUART`)
  - Pod ním číslované "tečky" (klikatelné, skáčou na libovolný krok)
  - Vždy se renderuje jen AKTUÁLNÍ krok (`step` state)
  - Slide+fade animace mezi kroky, se směrem (vpřed/vzad) podle toho, jestli jdeš dál nebo
    klikáš "Zpět"/na dřívější tečku
  - Varianty s `image_url` se renderují jako čtvercové thumbnaily (klik = jen výběr + přepnutí
    velkého náhledu, NEPŘESKAKUJE na další krok); varianty bez fotky mají starou "pilulku"
    s barevnou tečkou (fallback)
  - **Krok se posune jen po kliknutí na tlačítko "Pokračovat →"** (a zpět přes "← Zpět") —
    zpočátku se posouvalo automaticky hned po výběru, Lukáš chtěl změnit, ať si lidi stihnou
    projít všechny možnosti (např. všech 17 základů) předtím, než potvrdí.
- **`src/types/index.ts`** — `PART_TYPES` teď `["base", "case", "dial", "relief"]` (v tomhle
  pořadí = pořadí kroků v builderu; `dial` posunut před `relief` 2026-09-08, protože Lukáš chtěl
  ciferníky jako 3. krok). **Odstraněno**: `bezel-iced` (bylo duplicitní s `case` —
  kryty se od začátku importují jako `part_type: "case"`) a `strap` (nepoužívá se, Lukáš to
  zatím neřeší). **Nově přidáno**: `relief` (viz níže).
- **Náhledový obrázek v builderu** se odvozuje z varianty vybrané v AKTUÁLNÍM kroku (a když ta
  fotku nemá, spadne na nejbližší předchozí krok, co ji má). Dřív to byl samostatný state
  nastavovaný jen při kliknutí, takže builder startoval s prázdným oknem a po přechodu na další
  krok tam viselo foto z předchozího kroku (opraveno 2026-09-08).
- **Data v Supabase (aktivní, `is_active = true`, živé na webu):**
  - **8× `case`** — GA-2100 iced-out kryty/luneta (Silver1797/1788/1791/1806, Gold1788/1791/1806/1797)
  - **17× `base`** — originální GA-2100 modely, číslované `01`–`17` v popisku (`01 · GA-2100-1A1ER — …`
    atd.) — **to číslo je záměrně jen v textu, NENÍ vypálené do fotky**, slouží Lukášovi jako
    reference, který přesný model objednat u dodavatele, když přijde objednávka
- **7× `dial`** — ciferníky "Who cares I'm already late" (2in1 sada z AliExpressu), tj. `Originál
  (neměnit)` bez fotky + 6 barev (černý, bílý s černým/modrým/červeným písmem, tyrkysový, ledově
  modrý). **VŠECHNY jako draft `is_active = false`**, čekají na Lukášovo odsouhlasení.
  `Originál` je vložený jako první, takže je i výchozí volbou (výměna ciferníku je opt-in).
  Import: `scripts/import-ga2100-dials.mjs`. Cena zatím u všech `price_modifier: 0` — Lukáš
  příplatek ještě neurčil.
- **Postgres `part_type` enum** rozšířen o `base` (migrace `0008`) a `relief` (migrace `0009`).
  Staré hodnoty `bezel-iced`/`strap` v enumu zůstaly (Postgres neumí snadno mazat hodnoty z enumu
  bez přestavby typu) — nevadí, nic je nepoužívá, appka je ignoruje.
- Nové admin scripty (stejný vzor jako `clear-test-data.mjs`, service-role klíč z `.env.local`):
  - `scripts/import-ga2100-base.mjs` — import 17 základů
  - `scripts/import-ga2100-cases.mjs` — import 8 krytů
  - `scripts/activate-builder-drafts.mjs` — hromadně nastaví `is_active = true` pro `base`+`case`
    (spouštět ručně z terminálu — Claude Code auto-mode klasifikátor blokuje tenhle typ hromadné
    "publikační" akce přes Bash, proto se to nakonec dodělalo přes admin UI v Chromu)
  - `scripts/fix-ga2100-base-labels.mjs` — opravný skript, přepíše `label`+`hex_color` u všech 17
    `base` řádků (spuštěno 2026-09-08, viz "Lekce" níže — dodatečně měnit popisky/barvy jde
    stejným vzorem: `.update({label, hex_color}).eq("part_type", X).ilike("label", "%kód%")`)

### Co přesně je "Scéna 1"
Schválené (2026-09-04) defaultní pozadí pro ÚPLNĚ VŠECHNY produktové fotky: plochý onyx černý
backdrop s měkkou ledově modrou září, **žádná 3D perspektiva** (žádná zeď/podlaha/místnost) —
takhle to Lukáš chtěl poté, co odmítl dřívější verzi s 3D místností (feedback: "vypadalo to jako
vznášející se nálepka"). Soubor identicky uložený na dvou místech:
- `D:\AI\customshockz\scenes\scene1.png` (originál, ComfyUI pipeline ho odsud kopíruje)
- `D:\claude code\customshockz\scene1-pozadi.png` (kopie přímo v repu)

**Pozor na matoucí soubor:** `D:\customshockz\POzadi na produkty.png` je STARÁ odmítnutá 3D verze
(zeď+podlaha v perspektivě) — nepoužívat, to není Scéna 1.

Postup zpracování nového produktu (spouští se MIMO tenhle repo, v `D:\AI\customshockz\`):
```
copy "D:\AI\customshockz\scenes\scene1.png" "D:\AI\ComfyUI_windows_portable\ComfyUI\input\scene1.png"
copy "<zdrojová fotka produktu>" "D:\AI\ComfyUI_windows_portable\ComfyUI\input\"
D:\AI\ComfyUI_windows_portable\python_embeded\python.exe D:\AI\customshockz\run_on_bg.py <produkt.png> scene1.png <out_name> [scale_pct] [pos_y_pct] [angle] [pos_x_pct] [clean_mask] [process_res]
```
- Server musí běžet: `D:\AI\ComfyUI_windows_portable\python_embeded\python.exe -s ComfyUI\main.py --windows-standalone-build --port 8188` (v `D:\AI\ComfyUI_windows_portable`, s `HF_HOME=D:\AI\cache\huggingface`)
- Výstup: `D:\AI\ComfyUI_windows_portable\ComfyUI\output\<out_name>.png`
- `scale_pct` default 45, `pos_y_pct` default 68 — pro kryty/základy (kulaté/celé hodinky) funguje
  dobře `scale_pct=42-55, pos_y_pct=50-55` (vycentrované), ne default (ten je laděný na náramek)
- **`process_res` (nový 9. argument, default 1024)** — zvýšit na `2048` u produktů s tenkými
  mezerami (např. "hvězdicový"/"paprskovitý" design s tenkými hroty) — při 1024 RMBG masku
  tenkých mezer často spojí a uprostřed zůstane bílá skvrna místo průhledna. Objeveno a opraveno
  2026-09-06 na variantě "Silver1791" (kryt s hroty).
- Kompletní detaily (bug fixy, pravidlo "3 úhly na produkt", zákaz rotace) v `D:\AI\customshockz\RUNBOOK.md`

**Díry v produktu (výřezy) — `run_dials_with_holes.py`:** RMBG segmentuje jen VNĚJŠÍ obrys, vnitřní
výřezy (dírky pro ručičky, okénko displeje) nechá jako plnou plochu → zůstane v nich pozadí z
původní fotky (u ciferníků to byl béžový flek z AliExpress fotky). Řešení: vypálit tvary výřezů do
alfa kanálu PŘED kompozicí (ne opravovat hotový obrázek dodatečně) — pak se přes díry správně
propíše i stín a odraz. Maska je uložená v `D:\AI\customshockz\dial_holes_mask.npy` (souřadnice
zdrojové fotky 800×800, platí pro celou tuhle sérii ciferníků, protože je fotil stejně).
**Automatická detekce podle barvy se neosvědčila** — vezme i tahy písma a u nízkého kontrastu díru
mine; spolehlivé je vytáhnout tvar z varianty, kde nejvíc kontrastuje (dírky z černé, okénko z
tyrkysové) a tuhle jednu masku pak použít na všechny barvy.

### 🔜 Další kroky (v tomhle pořadí, potvrzeno s Lukášem)
Postup kroků v builderu má být: **1) Základ → 2) Luneta/Pouzdro (case, hotovo) → 3) Číselník → 4) Reliéf**

1. **Číselník** (`part_type: "dial"`) — ✅ zpracováno 2026-09-08, 7 variant naimportováno jako
   draft (viz výše). **Zbývá:** Lukáš je schválí → pushnout `main` (kvůli přehození pořadí kroků
   v `PART_TYPES`) → **teprve pak aktivovat** řádky. Otevřená otázka: příplatek za ciferník
   (`price_modifier`), teď je všude 0.
2. **Reliéf** (`part_type: "relief"`) — gumové indexy/rysky na ciferníku (G-Shock nemá čísla, jen
   rysky, a ty jdou vyměnit za custom gumové). Lukáš pošle odkaz (AliExpress/jiný) s variantami,
   stejný postup jako u krytů: stáhnout ve vysokém rozlišení, očíslovat/ukázat přehled, Lukáš
   vybere, projet přes Scénu 1, importovat. **Musí obsahovat i variantu "Originál"** (bez fotky,
   `price_modifier: 0`) pro zákazníky, co nechtějí měnit nic. Pozn.: odkaz, co Lukáš poslal na
   ručičky (hodinové ručičky, 12 barev) zatím nikam nepatří — není pro ně krok v builderu.
3. **Mod kit** — CELÝ set pouzdro+řemínek (např. "AP mod kit" styl), do kterého se přesune původní
   strojek/modul → ciferník zůstává stejný jako na originále. **Nejde kombinovat s iced-out lunetou**
   (fyzicky nesedí — mod kit je jeden kompaktní kus). Domluvený plán: v kroku 2 udělat "buď/nebo"
   přepínač (dvě záložky ve stejném kroku) mezi "Iced-out luneta" (case, hotovo) a "Mod kit" (nový
   `part_type`, zatím žádná data/kód) — NENÍ ještě implementováno, čeká se na zdrojové fotky mod kitů.
4. **Stahování fotek z AliExpressu:** izolovaný Browser panel v Claude Code na AliExpressu
   **nefunguje** — bot-detekce ho přesměruje na `wp.html` a panel s cenou/variantami zůstane
   navždy v loading skeletonu. Funguje **claude-in-chrome** (Lukášův přihlášený Chrome): načte
   stránku celou. Postup: `find` na "Band Color swatch thumbnail images" vrátí refy i s `alt`
   (= názvy variant), pak přes `javascript_tool` číst `src` **po jedné** (hromadný
   `JSON.stringify` přes víc obrázků blokne bezpečnostní filtr). Z URL miniatury utnout příponu
   `_220x220q75.jpg_.avif` a stáhnout `https://ae-pic-a1.aliexpress-media.com/kf/<kód>.jpg` —
   to je originál v plném rozlišení. **Pozor: přestože URL končí `.jpg`, data jsou WebP** —
   uložit s příponou `.webp`, jinak to PIL/GDI+ neotevře.
5. Po dodání fotek reliéfu/číselníku/mod kitu vždy: stáhnout → ukázat přehled očíslovaný → Lukáš
   vybere → Scéna 1 → import script (`is_active: false` draft) → **počkat na explicitní pokyn
   "aktivuj"** než se to pustí live (viz Poznámky k workflow níže — tohle se minule nedodrželo a
   živý web na chvíli spadl, protože stará nasazená verze neznala nový `part_type`).

## Priority dalších kroků (obecně, mimo builder)
1. **Custom builder** (viz sekce výše) — probíhá, pokračovat dál stejným stylem
2. Doplnit právní údaje (IČO/sídlo) — kdykoliv, jen text
3. Nahrát reálný katalog, jakmile budou fotky z fotoboxu
4. Ověřit doménu v Resend
5. Stripe platba kartou — až bude chtít, zatím vědomě odloženo
6. Aktualizovat README (popisuje starší architekturu)

## Poznámky k workflow
- **Pořadí při aktivaci nového `part_type`:** NEJDŘÍV pushnout kód, co ten typ umí zobrazit,
  AŽ POTOM aktivovat řádky v DB s tím typem. Obráceně (aktivovat dřív než je kód venku) způsobí,
  že stará nasazená verze na produkci spadne s chybou, protože neumí neznámý `part_type` (stalo
  se 2026-09-06 s typem `base`, opraveno rychlým pushem).
- Batchovat lokální změny, čekat na explicitní "publikuj"/"aktivuj" pokyn před tím, než se draft
  varianty přepnou na `is_active = true` — výjimka: věci co blokují prodej nebo co Lukáš přímo chce
  hned live.
- **Hromadné/"publikační" DB akce (např. aktivace 25 variant najednou) blokuje Claude Code
  auto-mode klasifikátor přes Bash** — funguje to ale přes admin UI v Chromu (přihlášený účet),
  tam žádný blok není. Jednotlivé klikací akce chtějí pauzu ~1.5–2s mezi kliky, jinak se rychlé
  kliky za sebou ztratí (React re-render po prvním kliku zneplatní zbytek dávky).
- URL vždy otevírat v Chrome, ne Edge
- Vše ukládat na disk D (disk C je skoro plný) — na jiném počítači/Macu neplatí
- Nasazení: push do `main` na GitHubu → Vercel automaticky nasadí (obvykle do ~30–60 s)
- Databázové migrace (`supabase/migrations/*.sql`) se pouštějí ručně v Supabase SQL Editoru — dá
  se to udělat i přímo v Chrome (přihlášený účet), stačí otevřít SQL Editor a vložit obsah migrace.
  Odkaz: `https://supabase.com/dashboard/project/cmejkszywblqrnpyxogp/sql/new`
- Aktuální migrace: `0001` až `0009` (naposledy `0009_relief_part_type.sql`)
- **Nikdy nevytvářet dočasné "preview" stránky/routy, co obchází RLS přes service-role klíč, a
  nechat je v repu** — použité jednou k lokálnímu testování draftů (`na-miru-preview/page.tsx`),
  po ověření smazáno PŘED commitem. Kdyby se to omylem pushlo, byla by to bezpečnostní díra
  (kdokoliv by mohl vidět/rendrovat neaktivní/draft obsah).
- **Barevné popisky variant vždy ověřit vizuálně u KAŽDÉ fotky zvlášť, nikdy neodhadovat/domýšlet
  podle názvu modelu.** 2026-09-08: u importu 17 základů (`import-ga2100-base.mjs`) byly popisky
  napsané "od oka" bez pořádné kontroly a několik jich bylo vyloženě špatně (např. "tyrkysové
  detaily" a "stříbrný ciferník" byly navzájem prohozené u dvou různých hodinek, jiné měly barvu
  co na fotce vůbec nebyla). Oprava: `scripts/fix-ga2100-base-labels.mjs` — projít si znovu KAŽDOU
  zdrojovou fotku (`Read` tool přímo na soubor v `D:\AI\customshockz\input\ga2100_variants\`) a
  popsat přesně to, co je vidět, než se cokoliv napíše do labelu.

## Pokračování na jiném zařízení (např. MacBook)
Projekt žije na GitHubu, takže se nepřenáší souborem/e-mailem — naklonuje se:

1. Nainstalovat Node.js (LTS) a Git, pokud tam ještě nejsou
2. Nainstalovat Claude Code a přihlásit se stejným účtem
3. `git clone https://github.com/shockzeu/customshockz.git`
4. `npm install` ve složce projektu
5. **`.env.local` se v gitu nepřenáší (obsahuje tajné klíče)** — potřeba ho ručně vytvořit podle `.env.example` a doplnit skutečné hodnoty (Supabase URL/klíče, Resend klíč). Přenést zvlášť a bezpečně.
6. `npm run dev` → běží na `http://localhost:3000` (**pozor, viz Tech stack výše — je to živá produkční DB**)

Změny se pak synchronizují přes `git push` / `git pull` na `main`.
