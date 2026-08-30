# CustomShockz — stav projektu (2026-08-30)

## Co to je
Custom G-Shock e-shop v `D:\claude code\customshockz`. Next.js 16 (App Router), TypeScript, Tailwind v4, shadcn/ui, framer-motion. Paleta "Ice & Onyx" (dark default).

## Tech stack
- **Supabase** — DB + auth (funguje, admin panel čte objednávky odsud)
- **Resend** — potvrzovací e-maily (funguje, `src/lib/email.ts`, no-op pokud chybí `RESEND_API_KEY`)
- **Stripe** — ⚠️ zatím jen placeholder, `stripe` balíček není nainstalovaný, kód v `src/lib/stripe.ts` je zakomentovaný

## Co je hotové
- Konfigurátor produktu, košík, checkout flow
- Admin panel: seznam objednávek, změna stavu (`src/components/admin/orders-list.tsx`, `src/app/admin/(panel)/orders/`)
- Platba zatím jen: bankovní převod / dobírka (`PaymentMethod` typ v `src/types/index.ts`)
- `scripts/clear-test-data.mjs` — smaže testovací produkty a varianty dílů ze Supabase

## Priority dalších kroků (doporučeno v tomto pořadí)
1. **Stripe platba kartou** — nejvyšší priorita, blokuje reálný provoz
2. **Reálný katalog produktů** — nahradit testovací data (použít `clear-test-data.mjs` před nahráním ostrého katalogu)
3. **Ověřit doménu customshockz.eu v Resend** — aby e-maily nešly do spamu
4. **Aktualizovat README** — popisuje starší architekturu než co je reálně implementované

## Poznámky k workflow
- Batchovat lokální změny, čekat na explicitní "publikuj" pokyn před git push/deployem
- URL vždy otevírat v Chrome, ne Edge
- Vše ukládat na disk D (disk C je skoro plný)
