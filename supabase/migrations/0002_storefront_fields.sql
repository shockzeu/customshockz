-- ============================================================
-- CustomShockz — Phase 3 migration
-- Adds storefront-facing fields to products + a product-images bucket.
-- Paste into Supabase SQL Editor and run. Safe to re-run.
-- ============================================================

alter table public.products
  add column if not exists slug text,
  add column if not exists description text,
  add column if not exists image_url text,
  add column if not exists in_stock boolean not null default true;

create unique index if not exists products_slug_key on public.products (slug);

-- ---------- Storage bucket for product photos ----------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product-images public read" on storage.objects;
create policy "product-images public read"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "product-images admin upload" on storage.objects;
create policy "product-images admin upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

drop policy if exists "product-images admin update" on storage.objects;
create policy "product-images admin update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product-images admin delete" on storage.objects;
create policy "product-images admin delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');
