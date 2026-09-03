-- ============================================================
-- CustomShockz — Product batches ("drops")
-- Lets the admin create several draft products at once, fill them in
-- one by one while hidden, then publish the whole batch together.
-- Paste into Supabase SQL Editor. Safe to re-run.
-- ============================================================

alter table public.products
  add column if not exists batch text;

create index if not exists products_batch_idx on public.products (batch);
