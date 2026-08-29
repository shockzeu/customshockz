# CustomShockz

E-shop pro značku **CustomShockz** — custom / iced-out G-Shock hodinky.
Streetwear / hypebeast estetika, tmavý mód jako výchozí.

> Instagram: [@CustomShockz](https://instagram.com/CustomShockz)

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitiva)
- **Framer Motion** (animace)
- Připraveno pro pozdější **Stripe** (platby) a **Supabase** (DB / auth) —
  balíčky zatím **nejsou** nainstalované, viz placeholdery v `src/lib/`.

## Vývoj

```bash
npm run dev     # dev server na http://localhost:3000
npm run build   # produkční build
npm run start   # spuštění produkčního buildu
npm run lint
```

## Barevná paleta — „Ice & Onyx"

Definovaná jako CSS proměnné + Tailwind utility v `src/app/globals.css`.

| Role | Hex | Utility |
| --- | --- | --- |
| Pozadí | `#0A0A0B` | `bg-onyx` / `bg-background` |
| Povrchy / karty | `#151517` | `bg-onyx-surface` / `bg-card` |
| Primární text / akcent | `#E5E7FF` | `text-ice` |
| CTA (ledově modrá) | `#7DD3FC` | `bg-ice-blue` / `text-ice-blue` / `bg-primary` |
| Text | `#F5F5F7` | `text-foreground` |

## Struktura

```
src/
├─ app/                 # App Router (layout, page, globals.css)
├─ components/
│  ├─ ui/               # shadcn/ui komponenty
│  ├─ layout/           # navbar, footer, logo
│  ├─ sections/         # hero, featured (stránkové sekce)
│  ├─ motion/           # Reveal a další framer-motion wrappery
│  └─ product-card.tsx
├─ config/site.ts       # název, navigace, odkazy, marketing copy
├─ data/products.ts     # mock katalog (nahradí Supabase)
├─ lib/
│  ├─ utils.ts          # cn()
│  ├─ format.ts         # formatPrice() (CZK)
│  ├─ env.ts            # centralizované env proměnné
│  ├─ stripe.ts         # PLACEHOLDER (Phase: platby)
│  └─ supabase/         # PLACEHOLDER (Phase: DB / auth)
└─ types/index.ts       # Product, Collection
```

## Roadmapa

- **Fáze 1 (hotovo):** kostra projektu, branding, paleta, layout, homepage.
- **Fáze 2+:** katalog + detail produktu, Supabase data/auth, Stripe checkout,
  košík, objednávky. Env proměnné jsou předpřipravené v `.env.example`.

## Environment

Zkopíruj `.env.example` → `.env.local` a doplň hodnoty, jakmile se dostaneš
k příslušné fázi. `.env.local` je v `.gitignore`.
