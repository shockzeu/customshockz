-- ============================================================
-- CustomShockz — Phase 3b migration
-- Adds a product category so jewelry (earrings/bracelets) can be
-- sold alongside watches. Paste into Supabase SQL Editor and run.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'product_category') then
    create type product_category as enum ('watches', 'earrings', 'bracelets');
  end if;
end $$;

alter table public.products
  add column if not exists category product_category not null default 'watches';
