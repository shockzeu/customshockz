# CustomShockz — stav projektu (2026-09-27)

## ▶️ Začni tady v nové session
Řekni Claude Code: **"přečti si HANDOFF.md a pojďme pokračovat"**.

## Co to je
Custom G-Shock e-shop + šperky v `D:\claude code\customshockz` (GitHub: `shockzeu/customshockz`,
branch `main`, živě na `https://www.customshockz.eu`). Next.js 16 (App Router), TypeScript,
Tailwind v4, shadcn/ui, framer-motion, Supabase, paleta "Ice & Onyx" (dark).

**Web je od 2026-09-25 17:45 venku naostro** — countdown lock je pryč, žádný "coming soon" stav.
`/admin` funguje jako dřív.

## ✅ Katalog šperků — živé (2026-09-27)
Všechny 4 produkty jsou aktivní na webu:

1. **Iced Cuban náramek – moissanit, 925 stříbro** (`iced-cuban-naramek-moissanit-925`) — Cuban
   link, 925 stříbro (žádné zlato), šířka 8 mm, 6 délek 15–21,5 cm (3 600–4 750 Kč, krok 230 Kč).
2. **Iced Clover náramek** (`iced-clover-naramek`) — mosaz + zirkon, 4 barvy (modrá/fialovo-
   růžová/růžová/zelená, každá vlastní fotka) × 3 délky 18/20,5/23 cm (849/899/949 Kč).
3. **Iced Tennis náramek – moissanit, 925 stříbro** (`iced-tennis-naramek-moissanit-925`) —
   cluster tennis, cushion klastry, 925 stříbro, šířka 6 mm, 4 délky 15–19 cm (4 900–6 100 Kč).
4. **Iced Stud 0.5ct moissanite náušnice** (`iced-stud-moissanite-nausnice`) — 925 stříbro,
   cushion halo pecky. **Pozor:** `material` pole je u ní `null` (založená ještě před polem
   Materiál) — materiál je jen v textu popisu. Nekritické, ale klidně dopiš při další úpravě.

Import skripty (pro referenci/další podobné produkty): `scripts/import-bracelet-*.mjs`.

## 🆕 Admin — co přibylo (2026-09-25/26)
- **Trvalé mazání produktů** (koš vedle ikony oka v `/admin/products`) — potvrzovací dialog.
- **Pole Materiál** — zobrazí se jako odznak s ikonkou na stránce produktu.
- **Editor variant přímo v okně produktu** — tabulka Skupina/Popisek/Barva/Cena, funguje
  při úpravě i při zakládání nového produktu. **Cena ve sloupci je CELKOVÁ cena té varianty**
  (ne příplatek) — přepočet na `price_modifier` dělá kód na pozadí (viz sekce cenotvorby níže).
- **Řazení fotek** — šipky ◀▶ nebo drag&drop přímo v okně produktu, fotka č. 1 = titulní.
- **`/admin/catalog`** — náhled všech produktů (i draftů) s fotkami/popisem/variantami, jak by
  je viděl zákazník. Odkaz v levém menu i na Přehledu.

## 🐛 Opraveno 2026-09-26 — dvě chyby na stránce produktu
1. **Blikání fotek při scrollu** — karty produktů (Šperky/Hodinky/homepage) měly `Reveal`
   animaci (fade+rise při scrollu do view), takže na mobilu nejdřív zmizely, pak se objevily
   a pak do nich ještě doskočila fotka. **Oprava:** `Reveal` z karet produktů odstraněn
   (`sperky/page.tsx`, `hodinky/page.tsx`, `sections/featured.tsx`) — karty se renderují hned.
2. **Výběr barvy nefungoval vizuálně** — `ProductVariants` dřív renderoval barvu do
   samostatného náhledu POD popisem, co zmizel, když se shodoval s hlavní fotkou (typicky
   u výchozí/první barvy) → vypadalo to, že výběr nic nedělá, a stránka poskakovala.
   **Oprava:** nový `src/components/product-image-context.tsx` (React Context) sdílí
   "aktivní fotku" mezi `ProductGallery` a `ProductVariants` — výběr barvy teď přepíná
   hlavní galerii nahoře, klik na náhled v galerii zase vybere odpovídající barvu (obousměrně).
   Otestováno živě na `iced-clover-naramek` (barvy i délky, admin i storefront).

## 💡 Nápady na další produkty (probírali jsme, nerozhodnuto)
Priorita podle nejmenší extra práce (stejní dodavatelé, stejný pipeline):
1. **Přívěsky** (moissanite/cuban — kříž, dolar, iniciály) — Lukáš to plánuje jako další krok.
2. **Prsteny** — stejná cílovka, stejní dodavatelé na Alibaba/AliExpress/Temu.
3. **Kotníkové řetízky (anklets)** — v podstatě náramek na kotník, nejrychlejší přidání.
Řetízky na krk zatím vědomě NE (Lukáš: "zatím ne").

## 💰 Jak funguje cenotvorba u šperků (per-product varianty)
- `basePriceCzk` produktu = cena nejlevnější varianty (typicky nejkratší délka).
- `price_modifier` na `product_options` řádku je v haléřích, **relativně** k základní ceně —
  ale v ADMIN UI (editor variant) i na webu (výběr barvy/délky) se vždy ukazuje/zadává
  **absolutní cena té varianty**, nikdy "+X Kč příplatek" (Lukáš to výslovně nechtěl — připadalo
  mu to jako přehnaná marže na malý rozdíl ve velikosti). Přepočet tam/zpět dělá
  `product-dialog.tsx` (`priceModifierCzk = zadaná_cena - základní_cena`).
- Typický postup s Lukášem: on pošle nákupní ceny podle délky (screenshot z Alibaby/Temu),
  domluvíme marži (naposledy 90 % = ×1,9, nebo pevný krok v Kč mezi délkami — viz Cuban
  náramek, kde chtěl krok 230 Kč místo vypočtených 300 Kč), zaokrouhlíme na hezké číslo.

## Tech stack
- **Supabase** (DB + auth + storage) — `product-images` bucket pro fotky. Migrace `0001`–`0012`
  všechny spuštěné (`0011_product_options`, `0012_product_material` naposledy).
  **SQL do Supabase editoru vkládej přes `window.monaco.editor.getModels()[0].setValue(sql)`
  v `javascript_tool`** — psaní klávesnicí do editoru kazí autocomplete/klávesové zkratky
  dashboardu (přeskakuje na jiné stránky). Ověřeno spolehlivé.
- **Resend** — potvrzovací e-maily, no-op bez `RESEND_API_KEY`.
- **Stripe** — vědomě odloženo, `stripe` balíček není nainstalovaný.
- **Vercel** — push do `main` = auto-deploy (~30–60 s).
- **Pozor:** lokální `npm run dev` čte STEJNOU produkční DB jako živý web — žádné staging.

## ⚠️ Blokuje ostrý provoz — pořád čeká na Lukáše
1. Právní údaje v Obchodních podmínkách a GDPR (placeholder IČO/sídlo).
2. Ověřit doménu `customshockz.eu` v Resend (e-maily ať nechodí do spamu).

## Poznámky k workflow (ověřené, drž se jich)
- **Batchovat lokální změny, čekat na explicitní "publikuj"/"aktivuj"** — výjimka: co blokuje
  prodej nebo co Lukáš přímo řekne udělat hned. Nové šperky zakládej jako `is_active: false`
  draft, dokud on sám neřekne "zveřejni".
- **AliExpress/Alibaba/Temu** — izolovaný Browser panel má bot-blok, nefunguje. Používej
  `claude-in-chrome` (Lukášův přihlášený Chrome). Fotky stahovat přes CDN URL bez resize
  suffixu (např. Alibaba `_100x100.jpg`/`_80x80.jpg` na konci — ale ověř si doménu/cestu,
  různé sekce stránky používají různé CDN prefixy typu `sc01`/`sc04`, ne všechny jsou
  skutečná galerie produktu — ověřuj podle viditelných miniatur, ne jen podle prvního
  matche v DOM). Temu má navíc vlastní captcha — tu vždy řeší Lukáš sám.
- URL vždy v Chrome, ne Edge. Vše ukládat na disk D (disk C skoro plný).
- Barevné popisky/materiál vždy ověřit vizuálně z fotky, nikdy neodhadovat podle názvu.
- Animace testovat ve viditelném Chrome tabu, ne na pozadí (skrytý tab zastaví rAF).
- Nikdy nenechávat v repu dočasné "preview" routy, co obchází RLS přes service-role klíč.
- Po každé netriviální UI změně: typecheck (`npx tsc --noEmit`) + `npm run build` před pushem.

## Starší historie (builder, countdown lock detaily, ChatGPT pokusy...)
Smazáno z tohohle souboru pro přehlednost — dohledatelné v git historii commitů a v
`git log -p HANDOFF.md`, pokud by bylo potřeba se k něčemu vrátit.
