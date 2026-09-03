-- ============================================================
-- CustomShockz — Order number / variable symbol migration
-- Adds a sequential, human-readable order number that also serves as
-- the bank-transfer variable symbol (VS must be numeric, ≤10 digits —
-- a plain incrementing integer satisfies that for the lifetime of the
-- shop). Paste into Supabase SQL Editor. Safe to re-run.
-- ============================================================

alter table public.orders
  add column if not exists order_number integer generated always as identity (start with 10001);

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_order_number_key'
  ) then
    alter table public.orders
      add constraint orders_order_number_key unique (order_number);
  end if;
end $$;
