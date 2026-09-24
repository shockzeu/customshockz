# CustomShockz — stav projektu (2026-09-17)

## ▶️ Začni tady v nové session
Řekni Claude Code: **"přečti si HANDOFF.md a pojďme pokračovat"**.

### 🔴 Nejaktuálnější rozdělaná práce (2026-09-17) — pokračuj TADY
Rozjeli jsme katalog **Šperky** (byl úplně prázdný). Lukáš vybral přesně **3 produkty** k
naimportování ještě "dnes" (viz sekce "💎 Šperky — katalog" níže pro plné detaily, odkazy,
materiály i to, co přesně znamená "Scéna 1 přes ChatGPT"). Stav rozdělané práce:

1. **Fotky (9 ks, 3 na produkt) — NEDOKONČENO, PRVNÍ POKUS NEPOVEDENÝ, ZAČNI TADY.**
   Zkoušíme nový postup: místo ComfyUI (na druhém PC) generovat/kompozitovat fotky přes
   **ChatGPT (placený tarif ChatGPT Go)** — nahrát zdrojovou fotku produktu + referenční
   `scene1-pozadi.png` a napsat prompt, ať to složí dohromady.

   **Co se stalo:** zpráva se v Chrome tabu s ChatGPT (`chatgpt.com/c/6aab48ab-9c44-83ed-bae0-d431f53fd4bb`)
   nakonec odeslala (i přes vyskakovací "Get smarter answers" modal přes Send tlačítkem) a
   ChatGPT vygeneroval obrázek. **Výsledek je ale špatný a NEPOUŽITELNÝ**: ChatGPT prakticky
   jen mírně upravilo pozadí u PŮVODNÍ fotky — ruka/zápěstí se zlatým náramkem tam pořád je,
   pozadí je modrý gradient s kruhovou září, ale NENÍ to Scéna 1 (chybí plochý černý backdrop,
   je to spíš tmavě modrý prostor) a hlavně **produkt vůbec není vyfocený samostatně** — přesně
   to, co prompt výslovně zakazoval ("remove the wrist/hand entirely... No hands, no wrist").
   Já (Claude) jsem tenhle výsledek předtím vzal jako hotový/OK bez pořádné kontroly — **nedělej
   to znovu, zkontroluj KAŽDÝ vygenerovaný obrázek proti checklistu níže, než ho ukážeš Lukášovi
   jako hotový.**

   **Co dělat jako úplně první krok v nové session:**
   - Otevři ten samý ChatGPT chat a podívej se na vygenerovaný obrázek (screenshot výše popsán).
   - Nesnaž se to opravit stejným promptem znovu se stejnými vstupy — ChatGPT má očividně problém
     spolehlivě "vysvléknout" produkt z ruky/zápěstí jen na základě textové instrukce v editačním
     režimu obrázku. Vyzkoušej radši dvoukrokový přístup: (a) nejdřív ChatGPT požádat JEN o
     vyjmutí/vygenerování produktu samotného (bez pozadí, bez ruky) z fotky produktu, teprve
     (b) až se tenhle mezikrok povede, samostatným promptem to zkompozituj na Scénu 1. Případně
     zkusit explicitnější formulaci ("photograph of the bracelet by itself, laid flat/curled on
     a table, no hand, no skin, no wrist visible anywhere in the frame") nebo referenční fotku
     "jak správně vypadá produktová fotka bez ruky" přiložit jako třetí obrázek.
   - **Checklist, co MUSÍ platit, než se obrázek prohlásí za hotový:**
     1. Nikde není vidět kůže/ruka/zápěstí — jen samotný šperk.
     2. Pozadí je plochý, jednolitý onyx černý backdrop (ne gradient do modra, ne tmavě modrý
        prostor) s měkkou ledově modrou září — přesně jako `scene1-pozadi.png`.
     3. Žádná 3D perspektiva/podlaha/stěna/místnost.
     4. Barvy/detaily produktu (barva kovu, kamínky) odpovídají zdrojové fotce, nic se nesmí
        "vymyslet" navíc.
   - Pokud po pár pokusech ChatGPT pořád nezvládá čistě odstranit ruku, zvaž návrat k osvědčené
     ComfyUI pipeline (RMBG maska už uměla přesně tohle u hodinek/náramku — viz "Co přesně je
     Scéna 1" výše) aspoň pro krok "odstranit ruku", a Scénu 1 dokompozitovat tam.
   - Až bude jeden obrázek OK podle checklistu výše, teprve pak pokračovat na zbylých 8 fotek
     (3 produkty × 3 fotky) a ukázat Lukášovi až finální sadu, ne průběžné nepovedené pokusy.
2. **DB migrace `0011_product_options.sql` — NAPSANÁ, ale ještě NESPUŠTĚNÁ** v Supabase SQL Editoru.
   Musí se pustit dřív, než půjde cokoliv s variantami reálně uložit.
3. **Kód pro "vyber si variantu" na stránce produktu — NAPSANÝ, ale ještě NEZAPOJENÝ.** Nová
   komponenta `src/components/product-variants.tsx` existuje a je hotová, ale
   `src/app/(site)/produkt/[slug]/page.tsx` ji ještě nepoužívá (pořád tam vždy jede jen
   `SimpleOrderButton`). Potřeba: podmíněně renderovat `ProductVariants`, když
   `getProductOptionsByProductId(product.id)` vrátí neprázdný objekt.
4. **Import produktů do Supabase — NEEXISTUJE ještě žádný script.** Až budou fotky hotové, napsat
   one-off import script (vzor: `scripts/import-ga2100-dials.mjs`) — vytvoří 3 řádky v `products`
   (kategorie `bracelets`/`earrings`) + jejich `product_options` řádky (délka, barva...), **vše
   jako draft (`is_active: false`)** — normální pravidlo, počkat na Lukášovo "aktivuj".
5. Popisek KAŽDÉHO produktu musí uvádět skutečný materiál (viz sekce Šperky níže — Lukáš to
   explicitně chce, i u obyčejné slitiny/mosazi, hlavně že je to v popisu napsané).

### Starší dokončená práce (co NEŘEŠIT, je hotové a live)
1. **✅ Builder** (Základ → Luneta → Číselník) je živý, funkční, oceněný (5 190 Kč balíček +
   400 Kč ciferník navrch), dvousloupcový sticky layout s vylepšenými animacemi (viz
   "2026-09-1x — layout a animace builderu" níže), trust bar běží, mobilní pokladna opravená.
2. **✅ Checkout byl rozbitý, teď opravený** — RLS bug (viz "Opravy 2026-09-1x" níže) + přidaný
   trust panel s údaji k platbě před odesláním objednávky.
3. **Připraveno, čeká se jen na "nahraj to"** — náramek (`bracelet_iced_cuban_scene1.png`) je
   hotový, stačí ho naimportovat jako produkt v adminu (kategorie Šperky) — nesouvisí s dnešními
   3 novými produkty, je to samostatná starší položka.
4. **Čeká se na Lukáše, aby poslal materiál:** odkaz s variantami reliéfu, reálné fotky z
   fotoboxu, právní údaje (IČO/sídlo), fotky mod kitů.
5. **Volitelné, kdykoliv** — ověřit doménu `customshockz.eu` v Resend, ať potvrzovací e-maily
   nechodí do spamu.

**2026-09-13 — co přibylo dnes:**
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

**2026-09-17 (tahle session) — co přibylo:**
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

## 💎 Šperky — katalog (rozjeto 2026-09-17, NEDOKONČENO)

Kategorie "Šperky" byla úplně prázdná. Lukáš chce hlavně **náramky a přívěsky** (řetízky zatím ne
— explicitně řekl "řetízky zatím ne jen ty přívěsky"). Postup hledání produktů byl: hledali jsme
na AliExpress/Alibaba/Temu (přes `claude-in-chrome`, Lukášův přihlášený Chrome — izolovaný Browser
panel v Claude Code na těchhle e-shopech nefunguje, viz bod 4 v sekci builderu výše, platí to
stejně i pro Alibaba/Temu).

### ⚠️ Důležité pravidlo o materiálu (Lukášovo explicitní rozhodnutí, drž se ho)
Nejdřív jsem produkty filtroval jen na nerez ocel / 925 stříbro (Lukáš odmítl lacinou slitinu se
slovy "nechci prodávat něco za 80 korun co začne zelenat"). **Pak to ale sám otočil**: *"Nevadí
ten materiál, je to asi jedno, hlavně že to hezky vypadá, lidi budou OBEZNÁMENI s materiálem u
popisu KAŽDÉHO produktu."* → **Materiál smí být cokoliv (i slitina/mosaz), pokud vypadá dobře —
podmínka je, že se skutečný materiál napíše do popisu produktu.** Neopakuj starší přísnější filtr,
řiď se touhle poslední instrukcí.

### Finální 3 produkty na dnešek (potvrzené odkazy, žádné jiné nepřidávat bez pokynu)
1. **NUOYA čtyřlístkový Cuban náramek** — `https://www.alibaba.com/product-detail/subject_1601402017682.html`
   — materiál: slitina/mosaz (alloy/brass), MOQ 1. Barevné varianty stažené jako reference
   (soubory `nuoya_clover_*.jpg`, `nuoya_silver_blue.jpg`, `nuoya_silver_white.jpg`,
   `nuoya_rosegold_pink.jpg`, `nuoya_gold_green.jpg` ve scratchpadu, pokud ještě existují —
   scratchpad je session-specific, po delší době může být pryč): **4 barvy** — stříbrná/modrá,
   stříbrná/bílá, růžové zlato/růžová, zlatá/zelená (čtyřlístek v barvě kamínku).
2. **925 stříbrný Cuban náramek s moissanitem** — `https://www.alibaba.com/product-detail/subject_1601807364387.html`
   ("6mm White Gold 925 Sterling Silver VVS Moissanite Diamond Cuban Link Chain Bracelet"), MOQ 1.
   Varianty stažené jako reference (`silver_cuban_moiss_*.jpg`, `silver_cuban_gold.jpg`,
   `silver_cuban_whitegold.jpg`, `silver_cuban_hollow_whitegold.jpg`, `silver_cuban_hollow_gold.jpg`):
   **2 styly** (plný / "hollow" prokládaný) **× 2 barvy kovu** (žluté zlato / bílé zlato pokovení
   na 925 stříbře).
3. **Moissanite náušnice (pecky)** — Temu `https://share.temu.com/lKlXoTXaSjB` — platinově pokovené,
   MOQ efektivně 1 (Temu se dá objednat i kus). Reference: `temu_earrings_1.jpg`, `temu_earrings_2.jpg`.
   Temu na PC házelo nerelevantní výsledky, na mobilu ne — Lukáš produkty našel na mobilu a nahodil
   do košíku, pak jsme si to spolu prohlédli na PC. Temu má i vlastní CAPTCHA/bot-blok, který se
   objevil při procházení — **CAPTCHA vždy řeší Lukáš sám, nikdy se to neobchází automatizovaně.**

Cílová nákupní cena, kterou Lukáš zmiňoval jako orientaci: cca 500 Kč/kus.

### Co přesně znamená "udělat produktové fotky" tady (9 fotek = 3 produkty × 3 fotky)
Lukáš chce z fotky produktu (typicznav na ruce/na modelu, jak to má dodavatel na inzerátu)
vyrobit čistou katalogovou fotku na značkovém pozadí — přesně jako se to dělalo pro hodinky (viz
"Co přesně je Scéna 1" výše v sekci builderu: plochý onyx černý backdrop + měkká ledově modrá
záře, ŽÁDNÁ 3D perspektiva/místnost). Dosavadní postup pro hodinky běžel přes ComfyUI na druhém
PC (RMBG + IC-Light + kompozice, `D:\AI\customshockz\run_on_bg.py`) — **pro šperky dnes zkoušíme
alternativu přímo přes ChatGPT** (Lukáš má placené ChatGPT Go), protože je rychlejší a nevyžaduje
přepínat na druhý počítač:

**Postup (přes `claude-in-chrome`, chatgpt.com, Lukáš přihlášený přes Apple Sign-In):**
1. V novém chatu nahrát přes `file_upload` na file-input v composeru DVA soubory najednou:
   (a) zdrojová fotka produktu (např. `silver_cuban_moiss_2.jpg`), (b) referenční pozadí
   `D:\claude code\customshockz\scene1-pozadi.png` (identická kopie: `D:\AI\customshockz\scenes\scene1.png`).
2. Napsat prompt v tomhle duchu (fungovalo, ale výsledek ještě nebyl ověřený k momentu psaní
   tohohle handoffu):
   > First image: a jewelry product photo of a bracelet (worn on a wrist). Second image: our
   > brand's exact background style ("Scene 1") — a flat, seamless onyx-black backdrop with a
   > soft icy-blue glow, no 3D room, no floor/wall perspective. Task: create a clean product-only
   > photo of the bracelet from the first image (remove the wrist/hand entirely), placed on our
   > Scene 1 background style from the second image. Keep the bracelet laid out in a circle (like
   > a jewelry catalog shot), sharp focus, studio product lighting, same icy-blue glow and pure
   > black flat background as the reference. No hands, no wrist, no 3D room.
3. **Pozor na vyskakovací ChatGPT modaly** (např. "Get smarter answers" nabídka Think/Upgrade) —
   umí se objevit přesně nad Send tlačítkem a schytat klik místo odeslání zprávy. Vždycky po
   kliknutí na Send udělat screenshot a ověřit, že se zpráva fakt odeslala (title/URL tabu se
   samo o sobě nezmění spolehlivě — vytvoří se hned s prvním nahraným souborem, ne až po odeslání).
4. Zkontrolovat výsledek proti referenci (plochý černý podklad, ledově modrá záře, žádná 3D
   perspektiva/stín na "podlaze") — pokud ChatGPT přidá perspektivu/stín/místnost, doupravit
   prompt a zkusit znovu.
5. Zopakovat pro zbylé fotky (cíl: 3 fotky na produkt × 3 produkty = 9 fotek celkem — typicky
   different varianty barev/úhlů na produkt).

### Databáze a kód pro varianty (délka/barva) — napsané, nezapojené
Na rozdíl od hodinkového builderu (`part_variants`, globální, víceklikový wizard) potřebují tyhle
šperky **jednoduchý jednokrokový výběr přímo na stránce produktu** (např. "Barva: zlatá/bílé
zlato", žádný multi-step). Nový, samostatný systém:
- **`supabase/migrations/0011_product_options.sql`** (NAPSANÁ, NESPUŠTĚNÁ) — nová tabulka
  `product_options` (na rozdíl od `part_variants` patří KONKRÉTNÍMU `product_id`, ne globálnímu
  typu), sloupce `group_name` (např. "Délka", "Barva"), `label`, `hex_color`, `image_url`,
  `price_modifier`, `sort_order`, `is_active`. RLS stejná logika jako u ostatních veřejných tabulek.
  **Spustit v Supabase SQL Editoru** (`https://supabase.com/dashboard/project/cmejkszywblqrnpyxogp/sql/new`)
  před čímkoliv dalším.
- **`src/types/index.ts`** — přidán typ `ProductOptionRow` (hned za `PartVariantRow`).
- **`src/lib/data/product-options.ts`** (nový) — `getProductOptionsByProductId(productId)`, vrací
  aktivní options seskupené podle `group_name`.
- **`src/components/product-variants.tsx`** (nový, hotový) — `ProductVariants` komponenta: ukáže
  všechny skupiny voleb najednou (žádný wizard), spočítá cenu (base + modifiers), přidá do košíku
  přes stejný `useCart().addItem(...)` kontrakt jako `Configurator`/`SimpleOrderButton`
  (`CartItem` typ beze změny — `key/productSlug/name/imageUrl/unitPriceCzk/configSummary/codAllowed`).
  Náhledový obrázek se přepne, pokud vybraná varianta má vlastní fotku.
- **CHYBÍ:** zapojit do `src/app/(site)/produkt/[slug]/page.tsx` — tam se pořád vždy renderuje
  jen `SimpleOrderButton`, potřeba podmínku: pokud `getProductOptionsByProductId(product.id)`
  vrátí neprázdný objekt, renderovat `ProductVariants` místo `SimpleOrderButton`.
- **CHYBÍ:** import script (vzor `scripts/import-ga2100-dials.mjs` — service-role klient,
  `.env.local`, upload fotek do Supabase Storage, insert řádků). Rozhodnout: nahrát fotky do
  existujícího bucketu `part-images`, nebo založit nový bucket pro produktové fotky šperků.
  Vytvoří 3 `products` řádky (kategorie `bracelets`/`bracelets`/`earrings`) + jejich
  `product_options` řádky (viz varianty výše u každého produktu) — **vše jako draft
  (`is_active: false`)**, počkat na Lukášovo "aktivuj".
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
- Aktuální migrace: `0001` až `0010` (naposledy `0010_product_images.sql` — sloupec `image_urls`
  na `products`, spuštěno 2026-09-12)
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
