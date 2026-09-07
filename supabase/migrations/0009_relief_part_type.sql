-- ============================================================
-- Adds "relief" (gumové indexy/rysky na ciferníku místo číslic) as a new
-- part_type. Purely additive — existing enum values ("strap", "bezel-iced")
-- are left in place (unused, harmless) since Postgres enums can't drop
-- values without a full type rebuild, and no rows use them anyway.
-- Paste into Supabase SQL Editor and run.
-- ============================================================

alter type part_type add value if not exists 'relief';
