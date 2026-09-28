-- ============================================================
-- CustomShockz — allow admin to permanently delete orders
-- (needed so test orders placed during development can be
-- cleared out of the live "Tržby celkem" total). Already run
-- directly in the Supabase SQL Editor — this file just records it.
-- ============================================================

drop policy if exists "orders admin delete" on public.orders;
create policy "orders admin delete"
  on public.orders for delete
  to authenticated
  using (true);

drop policy if exists "order_items admin delete" on public.order_items;
create policy "order_items admin delete"
  on public.order_items for delete
  to authenticated
  using (true);
