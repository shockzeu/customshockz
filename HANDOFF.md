# CustomShockz — stav projektu (2026-09-05)

## Co to je
Custom G-Shock e-shop v `D:\claude code\customshockz` (na GitHubu: `shockzeu/customshockz`, branch `main`, živě na `https://www.customshockz.eu`). Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, framer-motion. Paleta "Ice & Onyx" (dark default).

## Tech stack
- **Supabase** — DB + auth (funguje, admin panel čte/píše odsud, produkty i objednávky)
- **Resend** — potvrzovací e-maily (funguje, `src/lib/email.ts`, no-op pokud chybí `RESEND_API_KEY`)
- **Stripe** — ⏭️ vědomě odloženo na Lukášovo přání (riziko nevyzvednuté dobírky u zakázek na míru řešeno jinak, viz níže). `stripe` balíček není nainstalovaný.
- **Vercel** — nasazení, push do `main` = automatický deploy

## Co je hotové (od 30. 8. přibylo hodně)
- Konfigurátor produktu, košík, checkout flow
- Admin panel: produkty (vč. nahrávání fotek do Supabase Storage), díly/varianty, objednávky se změnou stavu
- Platba: bankovní převod / dobírka. **Dobírka je teď per-produkt přepínač** (`cod_allowed` sloupec, admin → Upravit produkt → "Povolit dobírku", default vypnuto) — checkout ji nabídne jen když ji povolují úplně všechny položky v košíku. Řeší riziko nevyzvednutých zakázek na míru.
- **Automatický variabilní symbol** — každá objednávka má sekvenční `order_number` (od 10001), který slouží i jako VS pro bankovní převod. Zobrazí se na děkovací stránce i v e-mailu, admin ho vidí jako `#10047` v přehledu objednávek.
- **Dávky produktů ("drops")** — v adminu `/admin/products` tlačítko "Vytvořit dávku": založí N skrytých produktů najednou (5/7/10/vlastní počet + kategorie), Lukáš je postupně vyplní přes editaci, pak jedním tlačítkem "Zveřejnit dávku" zveřejní všechny najednou.
- Logo (CS monogram, `public/logo.png`, bílé na průhledném pozadí) + `src/app/icon.png` favicon + rotační animace v navbaru/patičce (`animate-logo-spin` v `globals.css`, otáčí se kolem svislé osy jako mince)
- **SEO**: `robots.txt` a `sitemap.xml` (`src/app/robots.ts`, `src/app/sitemap.ts`), per-produkt `generateMetadata` (title/popis/OG obrázek — použije fotku produktu, pokud existuje, jinak brand kartu)
- **Vlastní OG/Twitter obrázek při sdílení odkazu** — `src/app/opengraph-image.tsx` + `twitter-image.tsx`, generuje se kódem (logo + wordmark na tmavém pozadí), místo Vercel defaultu
- **Google Search Console** — `www.customshockz.eu` ověřeno (meta tag v `layout.tsx`, `verification.google`), sitemap odeslán, homepage požádána o prioritní zaindexování
- `scripts/clear-test-data.mjs` — smaže testovací produkty a varianty dílů ze Supabase

## ⚠️ Blokuje ostrý provoz — potřeba od Lukáše
1. **Právní údaje v Obchodních podmínkách a GDPR** — `src/app/(site)/obchodni-podminky/page.tsx` a `src/app/(site)/gdpr/page.tsx` mají placeholder `[Doplnit: obchodní jméno / jméno a příjmení, IČO, sídlo]`. Bez tohohle nejde legálně spustit prodej v ČR.
2. **Reálný katalog produktů** — Lukáš si pořídil fotobox, fotí si produkty sám (AI fotky produktů nevypadaly věrohodně). Nahrávají se přímo v adminu (`/admin/products` → tlačítko "Vybrat" u fotky, nebo přes dávky). Před ostrým katalogem spustit `clear-test-data.mjs`.
3. **Ověřit doménu customshockz.eu v Resend** — aby e-maily nešly do spamu. Potřeba přístup k DNS správě domény.

## 🔜 Další úkol: custom builder (kryty na hodinky) — ROZJET V NOVÉM OKNĚ
Lukáš chce probrat a postavit lepší "custom builder" — pravděpodobně navazuje na existující `/na-miru` konfigurátor (`src/components/configurator.tsx`, part_type `case`/`dial`/`strap`/`bezel-iced` v `src/types/index.ts`).

Konkrétní bezprostřední úkol, který zmínil:
1. Pošle **odkaz na AliExpress** s kryty na hodinky (watch cases)
2. Potřebuje z něj **vyscreenovat všechny kryty** (produktové fotky)
3. Z nich udělat **"Scénu 1"** přes lokální ComfyUI pipeline — viz `[reference-customshockz-comfyui-ads.md]` v paměti: IC-Light + RMBG + DetailTransfer, runbook v `D:\AI\customshockz`, paleta Ice & Onyx
4. **Důležité (feedback z paměti):** u produktových foto kompozic používat **plochý bezešvý podklad, ne 3D scénu s perspektivou stěny/podlahy** — viz `feedback-flat-backdrop-over-3d-scene.md`

Cíl: mít čisté, jednotné fotky krytů jako podklad pro `part_variants` (case) v adminu / v konfigurátoru, než se probere finální podoba samotného builderu.

## Priority dalších kroků
1. **Custom builder** (viz sekce výše) — čerstvě rozjednáno, pokračovat v novém okně/session
2. Doplnit právní údaje (IČO/sídlo) — kdykoliv, jen text
3. Nahrát reálný katalog, jakmile budou fotky z fotoboxu
4. Ověřit doménu v Resend
5. Stripe platba kartou — až bude chtít, zatím vědomě odloženo
6. Aktualizovat README (popisuje starší architekturu)

## Poznámky k workflow
- Batchovat lokální změny, čekat na explicitní "publikuj" pokyn před git push/deployem — **výjimka**: u věcí, co blokují prodej nebo co si Lukáš přímo přeje hned live (poslední dobou spíš pushujeme rovnou po ověření, funguje to dobře)
- URL vždy otevírat v Chrome, ne Edge
- Vše ukládat na disk D (disk C je skoro plný) — na jiném počítači/Macu neplatí
- Nasazení: push do `main` na GitHubu → Vercel automaticky nasadí (obvykle do ~30–60 s)
- Databázové migrace (`supabase/migrations/*.sql`) se pouštějí ručně v Supabase SQL Editoru — dá se to udělat i přímo v Chrome (přihlášený účet), stačí otevřít SQL Editor a vložit obsah migrace
- Aktuální migrace: `0001` až `0007` (naposledy `0007_product_batches.sql`)

## Pokračování na jiném zařízení (např. MacBook)
Projekt žije na GitHubu, takže se nepřenáší souborem/e-mailem — naklonuje se:

1. Nainstalovat Node.js (LTS) a Git, pokud tam ještě nejsou
2. Nainstalovat Claude Code a přihlásit se stejným účtem
3. `git clone https://github.com/shockzeu/customshockz.git`
4. `npm install` ve složce projektu
5. **`.env.local` se v gitu nepřenáší (obsahuje tajné klíče)** — potřeba ho ručně vytvořit podle `.env.example` a doplnit skutečné hodnoty (Supabase URL/klíče, Resend klíč). Přenést zvlášť a bezpečně (heslenka/správce hesel, ne veřejný e-mail).
6. `npm run dev` → běží na `http://localhost:3000`

Změny se pak synchronizují přes `git push` / `git pull` na `main`.
