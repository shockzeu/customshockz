-- ============================================================
-- Adds a dedicated `material` field to products, shown as a small
-- badge on the product page so customers see the real material at
-- a glance (Lukáš's rule: every jewelry listing must state the real
-- material, e.g. "Mosaz + zirkon", "925 stříbro").
--
-- Paste into Supabase SQL Editor and run.
-- ============================================================

alter table public.products
  add column if not exists material text;
