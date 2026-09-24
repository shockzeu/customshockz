-- ============================================================
-- Per-product options (length, color, ...) for regular (non-builder)
-- products — e.g. a bracelet where the customer picks a length and a
-- metal color, same idea as the AliExpress/Alibaba supplier listings.
--
-- Distinct from `part_variants`: those are global, keyed only by
-- `part_type`, and feed the /na-miru multi-step builder. These rows
-- belong to ONE product (`product_id`) and are grouped by a free-text
-- `group_name` (e.g. "Délka", "Barva") chosen per product at import time.
--
-- Paste into Supabase SQL Editor and run.
-- ============================================================

create table if not exists public.product_options (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references public.products(id) on delete cascade,
  group_name     text not null,               -- e.g. 'Délka', 'Barva'
  label          text not null,               -- e.g. '7 inch', 'Stříbrná'
  hex_color      text,                        -- e.g. '#C0C0C0', nullable
  image_url      text,                        -- nullable
  price_modifier integer not null default 0,  -- haléře (CZK * 100), can be negative
  sort_order     integer not null default 0,
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

create index if not exists product_options_product_id_idx
  on public.product_options(product_id);

-- ---------- Row Level Security ----------
alter table public.product_options enable row level security;

drop policy if exists "product_options public read" on public.product_options;
create policy "product_options public read"
  on public.product_options for select
  using (is_active or auth.role() = 'authenticated');

drop policy if exists "product_options admin write" on public.product_options;
create policy "product_options admin write"
  on public.product_options for all
  to authenticated
  using (true) with check (true);
