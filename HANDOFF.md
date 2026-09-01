# CustomShockz — stav projektu (2026-09-01)

## Co to je
Custom G-Shock e-shop v `D:\claude code\customshockz` (na GitHubu: `shockzeu/customshockz`, branch `main`). Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, framer-motion. Paleta "Ice & Onyx" (dark default).

## Tech stack
- **Supabase** — DB + auth (funguje, admin panel čte/píše odsud, produkty i objednávky)
- **Resend** — potvrzovací e-maily (funguje, `src/lib/email.ts`, no-op pokud chybí `RESEND_API_KEY`)
- **Stripe** — ⏭️ vědomě odloženo, nechceme zatím platbu kartou. `stripe` balíček není nainstalovaný, `src/lib/stripe.ts` je placeholder.

## Co je hotové
- Konfigurátor produktu, košík, checkout flow
- Admin panel: produkty (vč. nahrávání fotek do Supabase Storage), díly/varianty, objednávky se změnou stavu
- Platba: bankovní převod / dobírka (`PaymentMethod` typ v `src/types/index.ts`) — **karta zatím není a nikde se to už netvrdí** (opraveno na `/doprava`)
- Logo (CS monogram, `public/logo.png` + `src/app/icon.png` favicon), rotační animace v navbaru/patičce (`animate-logo-spin` v `globals.css`)
- `scripts/clear-test-data.mjs` — smaže testovací produkty a varianty dílů ze Supabase

## ⚠️ Blokuje ostrý provoz — potřeba od Lukáše
1. **Právní údaje v Obchodních podmínkách a GDPR** — `src/app/(site)/obchodni-podminky/page.tsx` a `src/app/(site)/gdpr/page.tsx` mají placeholder `[Doplnit: obchodní jméno / jméno a příjmení, IČO, sídlo]`. Bez tohohle nejde legálně spustit prodej v ČR. Potřeba: OSVČ vs. firma, IČO, sídlo/adresa podnikání.
2. **Reálný katalog produktů** — čeká na fotky hodinek/šperků. Až budou, nahrávají se přímo v adminu (`/admin/products` → tlačítko "Vybrat" u fotky). Před ostrým katalogem spustit `clear-test-data.mjs`.
3. **Ověřit doménu customshockz.eu v Resend** — aby e-maily nešly do spamu. Potřeba přístup k DNS správě domény.

## Priority dalších kroků
1. Doplnit právní údaje (bod 1 výše) — nejrychlejší, jen text
2. Nahrát reálný katalog, jakmile jsou fotky
3. Ověřit doménu v Resend
4. Stripe platba kartou — až bude chtít, zatím odloženo na přání
5. Aktualizovat README (popisuje starší architekturu)

## Poznámky k workflow
- Batchovat lokální změny, čekat na explicitní "publikuj" pokyn před git push/deployem (výjimka: synchronizace mezi zařízeními, jako teď)
- URL vždy otevírat v Chrome, ne Edge
- Vše ukládat na disk D (disk C je skoro plný) — **na jiném počítači/Macu tohle neplatí, tam normální umístění**
- Nasazení: push do `main` na GitHubu → Vercel automaticky nasadí

## Pokračování na jiném zařízení (např. MacBook)
Projekt žije na GitHubu, takže se nepřenáší souborem/e-mailem — naklonuje se:

1. Nainstalovat Node.js (LTS) a Git, pokud tam ještě nejsou
2. Nainstalovat Claude Code a přihlásit se stejným účtem
3. `git clone https://github.com/shockzeu/customshockz.git`
4. `npm install` ve složce projektu
5. **`.env.local` se v gitu nepřenáší (obsahuje tajné klíče)** — potřeba ho ručně vytvořit podle `.env.example` a doplnit skutečné hodnoty (Supabase URL/klíče, Resend klíč). Tenhle soubor je potřeba přenést zvlášť, bezpečně (ne veřejně) — nejlíp přes heslenku/správce hesel, ne prostým e-mailem, protože obsahuje ostré přístupové klíče k databázi.
6. `npm run dev` → běží na `http://localhost:3000`

Změny odsud i odtud se pak synchronizují přes `git push` / `git pull` na `main` — je to jeden a ten samý projekt, jen ho otevíráš z jiného počítače.
