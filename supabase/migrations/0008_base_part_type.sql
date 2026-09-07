-- ============================================================
-- Adds "base" (celé originální hodinky) as a new part_type,
-- for the builder's step 1 ("vyber základ").
-- Paste into Supabase SQL Editor and run.
-- ============================================================

alter type part_type add value if not exists 'base';
