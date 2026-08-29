-- ============================================================
-- CustomShockz — Orders / checkout migration
-- Adds orders + order_items so checkout submissions are stored
-- and visible in the admin panel. Paste into Supabase SQL Editor.
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'payment_method') then
    create type payment_method as enum ('bank_transfer', 'cash_on_delivery');
  end if;
  if not exists (select 1 from pg_type where typname = 'order_status') then
    create type order_status as enum ('new', 'processing', 'shipped', 'done', 'cancelled');
  end if;
end $$;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  customer_name  text not null,
  email          text not null,
  phone          text,
  address_street text not null,
  address_city   text not null,
  address_zip    text not null,
  payment_method payment_method not null,
  note           text,
  total_price    integer not null,             -- haléře (CZK * 100)
  status         order_status not null default 'new',
  created_at     timestamptz not null default now()
);

create table if not exists public.order_items (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null references public.orders(id) on delete cascade,
  product_name   text not null,                -- snapshot, product may change later
  config_summary text,                         -- e.g. "Pouzdro: Černá, Číselník: Bílý"
  unit_price     integer not null,             -- haléře (CZK * 100)
  quantity       integer not null default 1,
  created_at     timestamptz not null default now()
);

-- ---------- Row Level Security ----------
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Anyone (including anonymous checkout) can create an order, but only the
-- authenticated admin can read/update it — customers never see other
-- people's orders since there's no public select policy.
drop policy if exists "orders public insert" on public.orders;
create policy "orders public insert"
  on public.orders for insert
  to anon, authenticated
  with check (true);

drop policy if exists "orders admin read" on public.orders;
create policy "orders admin read"
  on public.orders for select
  to authenticated
  using (true);

drop policy if exists "orders admin update" on public.orders;
create policy "orders admin update"
  on public.orders for update
  to authenticated
  using (true) with check (true);

drop policy if exists "order_items public insert" on public.order_items;
create policy "order_items public insert"
  on public.order_items for insert
  to anon, authenticated
  with check (true);

drop policy if exists "order_items admin read" on public.order_items;
create policy "order_items admin read"
  on public.order_items for select
  to authenticated
  using (true);
