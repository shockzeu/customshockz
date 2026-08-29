-- ============================================================
-- CustomShockz — Phase 2 schema
-- Paste this whole file into the Supabase SQL Editor and run it.
-- (Dashboard → SQL Editor → New query → paste → Run)
-- Safe to re-run: uses IF NOT EXISTS / idempotent guards.
-- ============================================================

-- ---------- Enum for part types ----------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'part_type') then
    create type part_type as enum ('case', 'dial', 'strap', 'bezel-iced');
  end if;
end $$;

-- ---------- products ----------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  base_price  integer not null default 0,   -- in haléře (CZK * 100)
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ---------- part_variants ----------
create table if not exists public.part_variants (
  id             uuid primary key default gen_random_uuid(),
  part_type      part_type not null,
  label          text not null,
  hex_color      text,                        -- e.g. '#7DD3FC'
  image_url      text,                        -- nullable
  price_modifier integer not null default 0,  -- in haléře (CZK * 100), can be negative
  is_active      boolean not null default true,
  created_at     timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.products      enable row level security;
alter table public.part_variants enable row level security;

-- Public (storefront) can read active rows; the admin (any authenticated
-- user — we only create one) can read everything.
drop policy if exists "products public read" on public.products;
create policy "products public read"
  on public.products for select
  using (is_active or auth.role() = 'authenticated');

drop policy if exists "products admin write" on public.products;
create policy "products admin write"
  on public.products for all
  to authenticated
  using (true) with check (true);

drop policy if exists "part_variants public read" on public.part_variants;
create policy "part_variants public read"
  on public.part_variants for select
  using (is_active or auth.role() = 'authenticated');

drop policy if exists "part_variants admin write" on public.part_variants;
create policy "part_variants admin write"
  on public.part_variants for all
  to authenticated
  using (true) with check (true);

-- ---------- Storage bucket for part images (optional uploads) ----------
insert into storage.buckets (id, name, public)
values ('part-images', 'part-images', true)
on conflict (id) do nothing;

drop policy if exists "part-images public read" on storage.objects;
create policy "part-images public read"
  on storage.objects for select
  using (bucket_id = 'part-images');

drop policy if exists "part-images admin upload" on storage.objects;
create policy "part-images admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'part-images');

drop policy if exists "part-images admin update" on storage.objects;
create policy "part-images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'part-images');

drop policy if exists "part-images admin delete" on storage.objects;
create policy "part-images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'part-images');
