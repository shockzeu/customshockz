-- ============================================================
-- CustomShockz — Per-product cash-on-delivery toggle
-- Custom / made-to-order pieces risk real material + shipping cost if
-- the customer never picks up a COD parcel. This lets each product
-- opt in to COD individually instead of it being all-or-nothing.
-- Defaults to false — off unless explicitly enabled per product.
-- Paste into Supabase SQL Editor. Safe to re-run.
-- ============================================================

alter table public.products
  add column if not exists cod_allowed boolean not null default false;
