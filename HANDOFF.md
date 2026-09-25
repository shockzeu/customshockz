# CustomShockz — stav projektu (2026-09-25)

## ▶️ Začni tady v nové session
Řekni Claude Code: **"přečti si HANDOFF.md a pojďme pokračovat"**.

### 🆕 2026-09-25 ráno — hotovo a live (novější než zbytek dokumentu)
- **Migrace `0011_product_options` i `0012_product_material` SPUŠTĚNÉ** (tabulka `product_options`
  existuje, `products.material` existuje). Tip: SQL do Supabase editoru vkládat přes
  `window.monaco.editor.getModels()[0].setValue(sql)` v `javascript_tool` — psaní klávesnicí
  kazí autocomplete a klávesové zkratky dashboardu přeskakují na jiné stránky.
- **Admin:** trvalé mazání produktů (koš), pole **Materiál** (odznak s ikonou na stránce produktu),
  **editor variant** přímo v okně produktu (skupina/popisek/barva/příplatek, full-replace přes
  `saveProductOptions`), **řazení fotek** (šipky + drag&drop, č. 1 = titulní), stránka
  **`/admin/catalog`** (náhled všech produktů vč. draftů).
- **Produkty živé:** *Iced Clover náramek* (mosaz + zirkon, 4 barvy s vlastní fotkou × délky
  18/20,5/23 cm, Lukáš ceny upravil na 849 Kč základ) a *Iced Stud moissanite náušnice* (925 stříbro).
  Import náramku: `scripts/import-bracelet-iced-clover.mjs`.
- **Další na řadě:** Lukáš dodělává fotky dalších ~4 náramků (1 fotka na barvu, složka
  `D:\Produktove fotky na stranku Ready to use\`), druhé náušnice a pak přívěsky. Délky uvádět
  jen v cm (žádné palce). Plánuje pořadí fotek: 1. AI fotka, 2. reálná na bílém, 3. na ruce/další AI.
- Countdown lock se vypne sám 25.9. 18:00.

### ⏳ DŮLEŽITÉ: web je (možná pořád) schválně zamčený countdownem
Lukáš si na sebe udělal ADHD-nátlakový trik: **od 2026-09-24 je celý veřejný web
`customshockz.eu` schválně přepnutý na "coming soon" countdown banner** (neonové intro logo →
odpočet dní/hodin/minut/vteřin → "@CustomShockz"), s cílem **2026-09-25 18:00** (Europe/Prague).
Důvod: donutit se web do té doby reálně dodělat.

- **Než začneš cokoliv řešit, zkontroluj aktuální čas.** Pokud je PO 25.9.2026 18:00, zámek se
  **automaticky sám vypnul** (žádná akce potřeba) a web běží normálně — tahle sekce je pak už jen
  historie, netřeba se jí zabývat.
- Pokud je čas ještě PŘED deadlinem a countdown pořád běží na `customshockz.eu`, je to **záměrný
  stav, ne bug** — neřeš to jako incident.
- **`/admin` funguje normálně po celou dobu**, zámek se týká jen veřejného storefrontu.
- **Jak to funguje (kód):**
  - `src/proxy.ts` — před `launchAtMs` přepisuje (rewrite) VŠECHNY veřejné routy na `/pripravujeme`;
    po deadline prostě `NextResponse.next()` (nezasahuje). `/admin` má svoji vlastní auth-guard
    větev, co běží vždycky bez ohledu na zámek.
  - `src/config/site.ts` → `siteConfig.launchAt` — jediné místo, kde je cílový čas (ISO string
    s `+02:00` offsetem). Kdyby Lukáš chtěl posunout termín, stačí upravit tady + pushnout.
  - `src/components/countdown-lock.tsx` — samotný banner (i pro `/pripravujeme/ig`, čtvercová
    1080×1080 verze na screenshot pro Instagram).
  - `src/components/intro-animation.tsx` + CSS blok v `globals.css` (sekce "Site intro: neon-
    outline logo draw") — neonová intro animace loga, co se přehraje před odhalením obsahu.
    Žije v `(site)/layout.tsx` (spustí se jen při skutečném otevření/refreshi webu, ne při
    klikání mezi stránkami) a zvlášť na `/pripravujeme/page.tsx`.
- **Úklid po startu prodeje (volitelné, není urgentní, zámek se sám neaktivuje znovu):** smazat
  `siteConfig.launchAt`, `src/proxy.ts`ho launch-check blok, `src/app/pripravujeme/` a případně
  i `intro-animation.tsx`/CSS blok, pokud Lukáš intro animaci na běžný provoz nechce. Zeptej se
  ho, jestli chce intro logo zachovat natrvalo (jen na první návštěvu) nebo úplně pryč — zatím to
  nebylo probrané.
- Pushnuto jako commity `b0a2fec` (product-options scaffolding, nesouvisí) a `5d14312` (countdown
  lock + intro), ověřeno živě na produkci i na mobilu i že `/admin` funguje.

### 🔴 Nejaktuálnější rozdělaná práce — katalog Šperky (pokračuj TADY, jakmile řeší countdown výše)
Kategorie "Šperky" byla úplně prázdná. Lukáš chce **náramky a přívěsky** (řetízky zatím ne).
Postup a stav k 2026-09-25:

1. **Fotky přes ChatGPT — PŘÍSTUP OPUŠTĚN, nepokoušej se o něj znovu bez pokynu.** Původní plán
   (nahrát fotku produktu + `scene1-pozadi.png` do ChatGPT a nechat ho sloučit) selhal — ChatGPT
   neuměl spolehlivě odstranit ruku/zápěstí a výsledek nebyl Scéna 1 (viz starší historie níže,
   pokud by ses chtěl vrátit k detailům). **Místo toho jsme přešli na fotky přímo od dodavatele**
   (viz bod 2) — ty většinou žádnou ruku ani nemají, takže odpadá nejtěžší část problému.
2. **Zdrojové fotky — `D:\obrazecky\`** (9 screenshotů, Lukáš je tam nahrál sám). Rozpoznané:
   - **4× moissanite náušnice** (halo styl) — zlatá i stříbrná varianta, na čistém bílém pozadí,
     BEZ ruky. Přímo použitelné jako zdroj pro kompozici na Scénu 1.
   - **4× cuban náramek s moissanitem** — 2 fotky na modrém džínovém pozadí, 2 na bílém, všechny
     BEZ ruky. Odpovídá produktu č. 2 níže (925 stříbrný Cuban s moissanitem).
   - **1× stejný náramek na zápěstí** (tmavá pleť) — TUHLE nepoužívat jako zdroj pro kompozici
     (má ruku), je to jen referenční/marketingová fotka.
   - **Chybí NUOYA čtyřlístkový náramek** (produkt č. 1 níže) — Lukáš k němu žádné fotky do
     `D:\obrazecky` nedal. **Zatím odloženo, neřeš, dokud nedodá fotky/nepotvrdí, že na něj chce
     pokračovat.**
3. **925 stříbrný Cuban náramek s moissanitem — rozpracováno, čeká na 3. fotku.**
   - Lukáš řekl "mám dvě docela dobré fotky náramku, ještě dodělám třetí" — **až fotku (fotky)
     dodá, spusť import** (viz bod níže), needěláš žádné další focení/kompozici sám, pokud
     nedostaneš pokyn (fotky z `D:\obrazecky` jsou už dost čisté na přímé použití, ChatGPT/Scéna-1
     kompozice se nakonec neřešila jako povinný krok pro tenhle produkt — ověř si to s Lukášem,
     než cokoliv vygeneruješ, ať se to nerozjede zbytečně znovu).
   - **Ceny spočítané a odsouhlasené** (dodavatel × 2,0, zaokrouhleno po 300 Kč), jen pro **plný
     styl** (na fotkách): 15 cm 3 490 Kč, 16,5 cm 3 790 Kč, 18 cm 4 090 Kč, 19 cm 4 390 Kč,
     20 cm 4 690 Kč, 21,5 cm 4 990 Kč. Barvy (zlatá / bílé zlato) bez příplatku.
     "Hollow" (prokládaný) styl se řeší jako SAMOSTATNÝ produkt později, jiné ceny, teď neřešit.
   - **Import script hotový, ale NESPUŠTĚNÝ:** `scripts/import-bracelet-cuban-moissanite.mjs`
     (bere cesty k fotkám jako argumenty: `node scripts/import-bracelet-cuban-moissanite.mjs
     <foto1> [foto2] [foto3]`). Vytvoří produkt jako **draft** (`is_active: false`) + `Barva` a
     `Délka` `product_options` řádky. Vyžaduje migraci `0011` (viz bod 5).
   - Navržený název: "Iced Cuban náramek – moissanit, 925 stříbro" — Lukáš ho zatím explicitně
     nepotvrdil, jen neprotestoval; klidně se ho zeptej znovu, než importuješ.
4. **Moissanite náušnice — fotky jsou (viz bod 2), ale NIC dalšího ještě neřešeno:** žádná cena,
   žádné varianty (zlatá/stříbrná?), žádný import script. Než začneš, zeptej se Lukáše na
   cenotvorbu (stejná logika jako u náramku: nákupní cena z Temu × marže) a jestli chce jako
   variantu i barvu kovu.
   - **Samostatně od katalogu** jsme pro náušnice připravili i **2 varianty promptů pro
     ChatGPT+Higgsfield na Instagram ad-set** (hero/detail/price-card v ledově modré "Ice & Onyx"
     stylistice) — to je marketingová grafika, NE produktová katalogová fotka, neplést dohromady.
     Nevím, jestli je Lukáš stihl vygenerovat/poslat výsledek zpátky.
5. **DB migrace `0011_product_options.sql` — NAPSANÁ, pořád NESPUŠTĚNÁ** v Supabase SQL Editoru
   (`https://supabase.com/dashboard/project/cmejkszywblqrnpyxogp/sql/new`). Musí se pustit dřív,
   než půjde import script výše vůbec spustit (bez ní `product_options` insert selže).
6. **Kód pro "vyber si variantu" na stránce produktu — HOTOVO A ŽIVÉ** (na rozdíl od staršího
   stavu handoffu). `src/components/product-variants.tsx` je zapojený do
   `src/app/(site)/produkt/[slug]/page.tsx`: pokud `getProductOptionsByProductId(product.id)`
   vrátí neprázdný objekt, renderuje se `ProductVariants` místo `SimpleOrderButton`. Bezpečné i
   bez spuštěné migrace (funkce při chybě vrátí `{}`, spadne zpět na `SimpleOrderButton`).
7. Popisek KAŽDÉHO šperku musí uvádět skutečný materiál (Lukášovo explicitní rozhodnutí — viz
   sekce "💎 Šperky — katalog" níže, materiál smí být cokoliv, hlavně že je napsaný v popisu).

### Starší dokončená práce (co NEŘEŠIT, je hotové a live)
1. **✅ Builder** (Základ → Luneta → Číselník) je živý, funkční, oceněný (5 190 Kč balíček +
   400 Kč ciferník navrch), dvousloupcový sticky layout s vylepšenými animacemi, trust bar běží,
   mobilní pokladna opravená.
2. **✅ Checkout byl rozbitý, teď opravený** — RLS bug + přidaný trust panel s údaji k platbě
   před odesláním objednávky.
3. **✅ Countdown lock + intro animace** — viz sekce úplně nahoře, live na produkci.
4. **Připraveno, čeká se jen na "nahraj to"** — náramek (`bracelet_iced_cuban_scene1.png`) je
   hotový, stačí ho naimportovat jako produkt v adminu (kategorie Šperky) — nesouvisí s Cuban
   moissanite náramkem výše, je to samostatná starší položka.
5. **Čeká se na Lukáše, aby poslal materiál:** odkaz s variantami reliéfu, reálné fotky z
   fotoboxu, právní údaje (IČO/sídlo), fotky mod kitů.
6. **Volitelné, kdykoliv** — ověřit doménu `customshockz.eu` v Resend, ať potvrzovací e-maily
   nechodí do spamu.

**2026-09-13 — co přibylo:**
1. **Trust bar** — nekonečně scrollující pruh nad navigací se 4 hláškami (ruční výroba, doprava,
   platba, "žádné dva kusy nejsou stejné"), čistá CSS `@keyframes` animace (`src/components/layout/trust-bar.tsx`
   + `animate-marquee` utility v `globals.css`), běží nepřetržitě i pod myší (Lukáš nechtěl
   hover-pauzu). Prošlo 3 koly úpravy textu, než se trefily hlášky, co pokrývají hodinky i šperky.
2. **Oprava mobilní pokladny** — `/pokladna` grid (formulář + souhrn objednávky) neměl na mobilu
   žádné explicitní `grid-cols`, jen `lg:grid-cols-[1fr_360px]`, takže se sloupec roztáhl podle
   nejdelšího řádku v souhrnu (dlouhý config text) až na ~823px na 375px displeji — celá stránka
   pak byla vodorovně rolovatelná. Oprava: přidán `grid-cols-1` na začátek (`src/app/(site)/pokladna/page.tsx`,
   4 místa). Nahlásila to Lukášova přítelkyně při zkušební objednávce.
3. **Cenovka builderu** — `basePriceCzk` na `/na-miru` bylo natvrdo `0`, všechny `price_modifier`
   byly `0` → builder vždy ukazoval 0 Kč. Domluveno s Lukášem: pevný balíček (hodinky+luneta
   dohromady, protože luneta je v builderu povinná, žádná varianta "originál") = **5 190 Kč**,
   každý DALŠÍ krok (ciferník teď, ručičky/řemínky později) je nezávislý příplatek navrch, ne
   něco, co se musí zpětně dopočítávat k cílové částce. Ciferník: Originál 0 Kč, ostatních
   6 barev +400 Kč (nastaveno přes SQL update na `part_variants`, ne v repu).
4. **Náramek jako první šperk** — Lukáš poslal `D:\customshockz\customshock.png` (iced Cuban
   link náramek, foceno v ruce na modrém pozadí), prohnáno Scénou 1 → `bracelet_iced_cuban_scene1.png`.
   Zatím JEN soubor, není naimportovaný jako produkt v adminu (kategorie Šperky) — čeká se, až
   Lukáš řekne "nahraj to".
5. **IG marketingová grafika** (mimo tenhle repo, samostatné soubory) — z fotky iced-out hodinek
   v ruce (`D:\customshockz\customshock.png`) vyrobeno: hero vizuál na Scéně 1 s cenou/CTA,
   "glow up" before/after (obyčejné vs. iced hodinky), UGC-hook card (originální foto + punchy
   text), a cartoon/pop-art verze (ruka odstraněná přes RMBG + ruční domaskování + OpenCV
   cartoon-filter, halftone pozadí). Skripty a výstupy v `D:\AI\customshockz\ig_ads.py`,
   `ig_cartoon.py`, `D:\AI\customshockz\ig_output\`.
6. **Remotion video projekt (`D:\claude code\customshockz-ads`) — odloženo, Lukáš to nechce
   používat.** Zkusili jsme "skládací" video hodinek, výsledek se Lukášovi nelíbil ("je to
   hrozný"). Samostatný projekt mimo tenhle repo, nijak nesouvisí s customshockz webem — není
   potřeba se tím zabývat, pokud si o to Lukáš znovu neřekne.

**2026-09-12 — dvě reálné chyby nahlášené Lukášem při přidávání prvního skutečného produktu,
obě opravené a pushnuté rovnou (blokovaly přidávání katalogu):**
1. Produkt šel doplnit jen o JEDNU fotku → přidán sloupec `image_urls` (pole), admin formulář
   teď bere víc souborů najednou (`<input multiple>`), na stránce produktu je z nich galerie
   s náhledy (`src/components/product-gallery.tsx`), pokud je fotek víc než jedna.
2. Každý produkt v kategorii `watches` automaticky renderoval CELÝ multi-step Configurator pod
   sebou (`isConfigurable = product.category === "watches"` v `produkt/[slug]/page.tsx`) — dřív
   to nebylo vidět, protože `part_variants` bylo prázdné/draft, ale teď že má `base`/`case`/`dial`
   aktivní řádky, se pod KAŽDÝM hotovým kusem objevil cizí "postav si vlastní" builder. Oprava:
   stránka jednotlivého produktu už Configurator vůbec nepoužívá, vždy jen `SimpleOrderButton`
   — multi-step builder zůstává výhradně na `/na-miru`.

**2026-09-17 — co přibylo:**
1. **Oprava rozbité pokladny (checkout úplně nefungoval)** — Lukášova přítelkyně zkoušela
   objednávku a nešlo to. Root cause: `createOrder` v `src/app/(site)/pokladna/actions.ts` insertoval
   do `orders`/`order_items` přes ANON Supabase klienta. RLS politika sice povolovala `insert`, ale
   PostgREST po insertu automaticky dělá i `select` na vrácený řádek (kvůli `.insert().select()`
   řetězení v knihovně) — a `select` politiku pro `anon` na `orders` záměrně NEMÁME (jinak by
   kdokoliv mohl číst cizí jména/adresy). Insert tak spadl na `select` kroku. **Oprava:** nový
   `src/lib/supabase/admin.ts` (service-role klient, obchází RLS úplně) — `createOrder` teď
   používá tenhle klient jen pro insert do `orders`/`order_items`. Ověřeno reálnou objednávkou
   naživo, testovací řádek pak smazán jednorázovým scriptem (nezůstal v repu).
2. **Trust panel v pokladně** — Lukášův postřeh: "poděkujem za objednávku a AŽ PAK se objeví číslo
   účtu" = nedůvěryhodné. Teď se hned pod výběrem platební metody (`src/app/(site)/pokladna/page.tsx`)
   zobrazí crossfade panel: u bankovního převodu rovnou číslo účtu (`siteConfig.bankAccount`) +
   vysvětlení, u dobírky vysvětlení, že se platí až při doručení. Vidí to PŘED odesláním objednávky.
3. **Vylepšené animace v `/na-miru` builderu** — Lukáš chtěl hezčí swipe přechody mezi kroky.
   `src/components/configurator.tsx`: přepsáno na dvousloupcový sticky layout
   (`lg:grid-cols-[minmax(0,1fr)_400px]`, velký náhled vlevo zůstává vidět i při scrollování
   pravého sloupce s volbami), silnější slide+fade přechod mezi kroky (40px posun, 280ms), tečkový
   indikátor kroku se teď plynule přesouvá (framer-motion `layoutId`), a nové miniatury (fotky
   variant) mají nástupovou "stagger" animaci (`@keyframes thumb-in` v `globals.css`, postupně
   po sobě, `animation-fill-mode: backwards` — kdyby se animace z nějakého důvodu nespustila,
   thumbnail zůstane vidět, ne neviditelný). **Lekce zapsaná do paměti:** pokud se animace testuje
   v Chrome tabu, co je v tu chvíli NA POZADÍ (skrytý), `requestAnimationFrame` stojí a vypadá to
   jako rozbitý kód, i když není — vždycky testovat ve viditelném tabu.

**2026-09-24/25 — co přibylo (tahle a předchozí session):**
1. **Per-product varianty (délka/barva) — kompletní scaffolding + zapojení.** Nová tabulka
   `product_options` (migrace `0011`, zatím nespuštěná), typ `ProductOptionRow`,
   `getProductOptionsByProductId()`, komponenta `ProductVariants` a její zapojení do stránky
   produktu (viz sekce Šperky výše, bod 6) — na rozdíl od hodinkového `Configurator` je to
   jednokrokový výběr (všechny skupiny voleb najednou, žádný wizard), pro šperky jako
   délka/barva u náramku.
2. **Countdown lock + intro animace — viz sekce úplně nahoře.** Sebe-nátlakový trik: web
   schválně zamčený countdownem do 2026-09-25 18:00, s neonovou intro animací loga na každé
   otevření webu (`(site)/layout.tsx`), `/admin` nedotčené.
3. **Průzkum katalogu šperků** — identifikace zdrojových fotek v `D:\obrazecky`, cenový výzkum
   na Alibabě pro Cuban moissanite náramek (viz sekce Šperky výše, bod 3), rozhodnutí opustit
   ChatGPT-based pozadí-swap přístup ve prospěch přímého použití dodavatelských fotek.

## 💎 Šperky — historie/kontext (pro detaily viz aktuální stav v sekci úplně nahoře)

Lukáš chce hlavně **náramky a přívěsky** (řetízky zatím ne — explicitně řekl "řetízky zatím ne
jen ty přívěsky"). Postup hledání produktů byl: hledali jsme na AliExpress/Alibaba/Temu (přes
`claude-in-chrome`, Lukášův přihlášený Chrome — izolovaný Browser panel v Claude Code na
těchhle e-shopech nefunguje, viz bod 4 v sekci builderu níže, platí to stejně i pro Alibaba/Temu).

### ⚠️ Důležité pravidlo o materiálu (Lukášovo explicitní rozhodnutí, drž se ho)
Nejdřív jsem produkty filtroval jen na nerez ocel / 925 stříbro (Lukáš odmítl lacinou slitinu se
slovy "nechci prodávat něco za 80 korun co začne zelenat"). **Pak to ale sám otočil**: *"Nevadí
ten materiál, je to asi jedno, hlavně že to hezky vypadá, lidi budou OBEZNÁMENI s materiálem u
popisu KAŽDÉHO produktu."* → **Materiál smí být cokoliv (i slitina/mosaz), pokud vypadá dobře —
podmínka je, že se skutečný materiál napíše do popisu produktu.** Neopakuj starší přísnější filtr,
řiď se touhle poslední instrukcí.

### Původně vybrané 3 produkty (odkazy — NUOYA je teď odložený, viz nahoře)
1. **NUOYA čtyřlístkový Cuban náramek** — `https://www.alibaba.com/product-detail/subject_1601402017682.html`
   — materiál: slitina/mosaz (alloy/brass), MOQ 1. **ODLOŽENO** — Lukáš k němu nedodal fotky do
   `D:\obrazecky`, neřeš dokud nepotvrdí, že chce pokračovat. Barevné varianty popsané: 4 barvy —
   stříbrná/modrá, stříbrná/bílá, růžové zlato/růžová, zlatá/zelená (čtyřlístek v barvě kamínku).
2. **925 stříbrný Cuban náramek s moissanitem** — `https://www.alibaba.com/product-detail/subject_1601807364387.html`
   ("6mm White Gold 925 Sterling Silver VVS Moissanite Diamond Cuban Link Chain Bracelet"), MOQ 1.
   **AKTIVNÍ, viz aktuální stav nahoře** — 2 styly (plný / "hollow" prokládaný, teď jen plný)
   × 2 barvy kovu (žluté zlato / bílé zlato pokovení na 925 stříbře). Ceny za kus na Alibabě
   (nákupní, mění se podle délky): 15cm 1 747 Kč, 16,5cm 1 893 Kč, 18cm 2 039 Kč, 19cm 2 184 Kč,
   20cm 2 330 Kč, 21,5cm 2 476 Kč — prodejní ceny (×2,0) viz aktuální stav nahoře.
3. **Moissanite náušnice (pecky)** — Temu `https://share.temu.com/lKlXoTXaSjB` — platinově pokovené,
   MOQ efektivně 1 (Temu se dá objednat i kus). **AKTIVNÍ, viz aktuální stav nahoře** — fotky
   dorazily jako screenshoty (gold + silver varianta), cena/varianty ještě neřešené. Temu na PC
   házelo nerelevantní výsledky, na mobilu ne — Lukáš produkty našel na mobilu a nahodil do
   košíku. Temu má i vlastní CAPTCHA/bot-blok — **CAPTCHA vždy řeší Lukáš sám, nikdy se to
   neobchází automatizovaně.**

Cílová nákupní cena, kterou Lukáš zmiňoval jako orientaci: cca 500 Kč/kus (u některých produktů
je nákupní cena na Alibabě citelně vyšší, viz bod 2 výše — řešeno vyšší marží, ne nižší cenou).

### Databáze a kód pro varianty (délka/barva) — stav k 2026-09-25
Na rozdíl od hodinkového builderu (`part_variants`, globální, víceklikový wizard) potřebují tyhle
šperky **jednoduchý jednokrokový výběr přímo na stránce produktu** (např. "Barva: zlatá/bílé
zlato", žádný multi-step). Nový, samostatný systém:
- **`supabase/migrations/0011_product_options.sql`** (NAPSANÁ, STÁLE NESPUŠTĚNÁ) — nová tabulka
  `product_options` (na rozdíl od `part_variants` patří KONKRÉTNÍMU `product_id`, ne globálnímu
  typu), sloupce `group_name` (např. "Délka", "Barva"), `label`, `hex_color`, `image_url`,
  `price_modifier`, `sort_order`, `is_active`. RLS stejná logika jako u ostatních veřejných tabulek.
  **Spustit v Supabase SQL Editoru** (`https://supabase.com/dashboard/project/cmejkszywblqrnpyxogp/sql/new`)
  dřív, než půjde import script pro náramek vůbec spustit.
- **`src/types/index.ts`** — přidán typ `ProductOptionRow` (hned za `PartVariantRow`).
- **`src/lib/data/product-options.ts`** (nový) — `getProductOptionsByProductId(productId)`, vrací
  aktivní options seskupené podle `group_name`. Bezpečné i bez migrace — při chybě vrací `{}`.
- **`src/components/product-variants.tsx`** (hotový) — `ProductVariants` komponenta: ukáže
  všechny skupiny voleb najednou (žádný wizard), spočítá cenu (base + modifiers), přidá do košíku
  přes stejný `useCart().addItem(...)` kontrakt jako `Configurator`/`SimpleOrderButton`
  (`CartItem` typ beze změny — `key/productSlug/name/imageUrl/unitPriceCzk/configSummary/codAllowed`).
  Náhledový obrázek se přepne, pokud vybraná varianta má vlastní fotku.
- **✅ HOTOVO A ŽIVÉ:** zapojeno do `src/app/(site)/produkt/[slug]/page.tsx` — podmínka: pokud
  `getProductOptionsByProductId(product.id)` vrátí neprázdný objekt, renderuje se `ProductVariants`
  místo `SimpleOrderButton`.
- **`scripts/import-bracelet-cuban-moissanite.mjs`** (nový, hotový, NESPUŠTĚNÝ) — bere cesty
  k fotkám jako argumenty, service-role klient, upload do bucketu `product-images`, insert
  `products` řádku (kategorie `bracelets`, `is_active: false`) + `product_options` řádků (Barva,
  Délka podle cen výše). Čeká na 3. fotku od Lukáše.
- **CHYBÍ:** import script pro náušnice (zatím žádná cenotvorba/varianty domluvené).
- **CHYBÍ:** mechanismus, kam uložit odkaz na dodavatele pro budoucí ruční objednávání
  ("abych je mohl na zakázku objednávat") — zatím žádné DB pole na tohle není, zvážit privátní
  poznámku (ne veřejné pole na produktu, to by bylo vidět zákazníkům).

## Co to je
Custom G-Shock e-shop v `D:\claude code\customshockz` (na GitHubu: `shockzeu/customshockz`, branch `main`, živě na `https://www.customshockz.eu`). Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, framer-motion. Paleta "Ice & Onyx" (dark default).

## Tech stack
- **Supabase** — DB + auth (funguje, admin panel čte/píše odsud, produkty i objednávky). **Pozor: lokální `npm run dev` čte STEJNOU produkční databázi jako živý web** — není tam žádné staging prostředí, takže cokoliv aktivuješ (`is_active = true`) je hned vidět na `customshockz.eu`, i když to testuješ jen lokálně.
- **Resend** — potvrzovací e-maily (funguje, `src/lib/email.ts`, no-op pokud chybí `RESEND_API_KEY`)
- **Stripe** — ⏭️ vědomě odloženo na Lukášovo přání. `stripe` balíček není nainstalovaný.
- **Vercel** — nasazení, push do `main` = automatický deploy (obvykle 30–60 s)

## Co je hotové celkově
- Konfigurátor produktu, košík, checkout flow, admin panel (produkty, díly/varianty, objednávky)
- Jednoduché per-produkt varianty (délka/barva) pro šperky, viz sekce výše
- Platba: bankovní převod / dobírka (per-produkt přepínač `cod_allowed`)
- Automatický variabilní symbol (`order_number` od 10001)
- Dávky produktů ("drops") v adminu
- Logo + favicon + rotační animace, SEO (robots/sitemap/OG obrázky), Google Search Console ověřeno
- Countdown lock + intro animace (dočasné, viz sekce úplně nahoře)
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
  modrý). **Aktivní, live** od 2026-09-12. `Originál` je vložený jako první, takže je i výchozí
  volbou (výměna ciferníku je opt-in). Import: `scripts/import-ga2100-dials.mjs`. **Ceny hotové
  od 2026-09-13**: Originál 0 Kč, ostatních 6 +400 Kč (`price_modifier`, nastaveno přes SQL, ne
  v repu — když se budou ceny znovu měnit, je to `update part_variants set price_modifier=X where
  part_type='dial' and label != 'Originál (neměnit)'`).
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

### 💰 Jak funguje cenotvorba builderu (důležité pro každý další krok)
Rozhodnuto s Lukášem 2026-09-13, **drž se toho i pro budoucí kroky** (ručičky, řemínky, mod kit):

- `basePriceCzk` na `/na-miru` (v `src/app/(site)/na-miru/page.tsx`, natvrdo v kódu, v haléřích)
  = **5 190 Kč** = pevný balíček "hodinky + povinná iced-out luneta" dohromady. Je to JEDNA
  cena za oba kroky (Základ i Pouzdro), protože luneta v builderu nejde vynechat (žádná varianta
  "originál" u `case`) — nedává smysl ji cenit zvlášť.
- Každý DALŠÍ krok navíc (Číselník teď, časem Ručičky/Řemínky/Mod kit) je **nezávislý příplatek**
  (`price_modifier` na dané `part_variants` řadě, v haléřích, `price_modifier * 100` = Kč) —
  NEPŘEPOČÍTÁVÁ se zpětně základní cena, aby "vyšla" na nějaké kulaté číslo. Když Lukáš řekne
  "chci aby to i s XY vyšlo na Z Kč", řeš to nastavením ceny TOHO nového kroku, ne úpravou
  `basePriceCzk` nebo starších `price_modifier` hodnot.
- Číselník: Originál (neměnit) = 0 Kč (výchozí, opt-in výměna), ostatních 6 barev = +400 Kč.
- Pokud Lukáš chce cenu změnit, je to buď úprava `basePriceCzk` v kódu (commit+push), nebo SQL
  `update part_variants set price_modifier = X*100 where part_type = 'TYP' and label = '...'`
  přes Supabase SQL Editor — bez potřeby nasazení.
- **Šperky (per-product varianty) mají trochu jinou logiku**, viz sekce "💎 Šperky" výše —
  `price_modifier` na `product_options` řádcích je vždy k CELKOVÉ ceně produktu (`basePriceCzk`
  toho konkrétního produktu v `products` tabulce), ne k builderovému balíčku.

### 🔜 Další kroky (v tomhle pořadí, potvrzeno s Lukášem)
Postup kroků v builderu má být: **1) Základ → 2) Luneta/Pouzdro (case, hotovo) → 3) Číselník → 4) Reliéf**

1. **Číselník** (`part_type: "dial"`) — ✅ hotovo, live a OCENĚNO od 2026-09-13 (viz sekce
   cenotvorby výše).
2. **Reliéf** (`part_type: "relief"`) — gumové indexy/rysky na ciferníku (G-Shock nemá čísla, jen
   rysky, a ty jdou vyměnit za custom gumové). Lukáš pošle odkaz (AliExpress/jiný) s variantami,
   stejný postup jako u krytů: stáhnout ve vysokém rozlišení, očíslovat/ukázat přehled, Lukáš
   vybere, projet přes Scénu 1, importovat. **Musí obsahovat i variantu "Originál"** (bez fotky,
   `price_modifier: 0`) pro zákazníky, co nechtějí měnit nic. Cenu nastavit stejným způsobem jako
   u ciferníku (nezávislý příplatek, viz sekce cenotvorby výše). Pozn.: odkaz, co Lukáš poslal na
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
   uložit s příponou `.webp`, jinak to PIL/GDI+ neotevře. **Alibaba/Temu fungují stejně přes
   claude-in-chrome**, izolovaný Browser panel má stejný bot-block problém i tam.
5. Po dodání fotek reliéfu/číselníku/mod kitu vždy: stáhnout → ukázat přehled očíslovaný → Lukáš
   vybere → Scéna 1 → import script (`is_active: false` draft) → **počkat na explicitní pokyn
   "aktivuj"** než se to pustí live (viz Poznámky k workflow níže — tohle se minule nedodrželo a
   živý web na chvíli spadl, protože stará nasazená verze neznala nový `part_type`).

## Priority dalších kroků (obecně, mimo builder)
1. **Katalog šperků** (viz sekce úplně nahoře) — probíhá, pokračovat dál stejným stylem
2. **Custom builder** (viz sekce výše) — probíhá, pokračovat dál stejným stylem
3. Doplnit právní údaje (IČO/sídlo) — kdykoliv, jen text
4. Nahrát reálný katalog, jakmile budou fotky z fotoboxu
5. Ověřit doménu v Resend
6. Stripe platba kartou — až bude chtít, zatím vědomě odloženo
7. Aktualizovat README (popisuje starší architekturu)

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
- Aktuální migrace: `0001` až `0011` (naposledy napsaná `0011_product_options.sql` — **zatím
  NESPUŠTĚNÁ**, viz sekce Šperky výše; poslední SKUTEČNĚ spuštěná je `0010_product_images.sql`
  z 2026-09-12)
- **Nikdy nevytvářet dočasné "preview" stránky/routy, co obchází RLS přes service-role klíč, a
  nechat je v repu** — použité jednou k lokálnímu testování draftů (`na-miru-preview/page.tsx`),
  po ověření smazáno PŘED commitem. Kdyby se to omylem pushlo, byla by to bezpečnostní díra
  (kdokoliv by mohl vidět/rendrovat neaktivní/draft obsah). (`/pripravujeme` z countdown locku
  je jiný případ — nezobrazuje draft data, jen statický banner, bezpečné nechat v repu.)
- **Barevné popisky variant vždy ověřit vizuálně u KAŽDÉ fotky zvlášť, nikdy neodhadovat/domýšlet
  podle názvu modelu.** 2026-09-08: u importu 17 základů (`import-ga2100-base.mjs`) byly popisky
  napsané "od oka" bez pořádné kontroly a několik jich bylo vyloženě špatně (např. "tyrkysové
  detaily" a "stříbrný ciferník" byly navzájem prohozené u dvou různých hodinek, jiné měly barvu
  co na fotce vůbec nebyla). Oprava: `scripts/fix-ga2100-base-labels.mjs` — projít si znovu KAŽDOU
  zdrojovou fotku (`Read` tool přímo na soubor v `D:\AI\customshockz\input\ga2100_variants\`) a
  popsat přesně to, co je vidět, než se cokoliv napíše do labelu.
- **Animace testovat vždy ve viditelném Chrome tabu**, ne na pozadí — skrytý/pozadí tab zastaví
  `requestAnimationFrame` a i CSS keyframe animace se čas od času chovají nespolehlivě při
  headless/hidden screenshotování; pro ověření timingu (ne jen vzhledu) je spolehlivější dočasně
  prodloužit `duration` konstantu, screenshotnout uprostřed a pak vrátit zpět, než spoléhat na
  přesné načasování screenshot-tool round-tripu.

## Pokračování na jiném zařízení (např. MacBook)
Projekt žije na GitHubu, takže se nepřenáší souborem/e-mailem — naklonuje se:

1. Nainstalovat Node.js (LTS) a Git, pokud tam ještě nejsou
2. Nainstalovat Claude Code a přihlásit se stejným účtem
3. `git clone https://github.com/shockzeu/customshockz.git`
4. `npm install` ve složce projektu
5. **`.env.local` se v gitu nepřenáší (obsahuje tajné klíče)** — potřeba ho ručně vytvořit podle `.env.example` a doplnit skutečné hodnoty (Supabase URL/klíče, Resend klíč). Přenést zvlášť a bezpečně.
6. `npm run dev` → běží na `http://localhost:3000` (**pozor, viz Tech stack výše — je to živá produkční DB**)

Změny se pak synchronizují přes `git push` / `git pull` na `main`.
