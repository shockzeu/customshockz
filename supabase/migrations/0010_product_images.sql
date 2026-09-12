-- ============================================================
-- Adds multi-photo support to products: `image_urls` holds every photo in
-- display order, `image_url` (singular) stays as-is and keeps meaning "the
-- primary/cover photo" — every place that already reads `image_url` (cart,
-- emails, OG tags, sitemap, admin list thumbnail) keeps working unchanged.
-- Backfills image_urls from the existing single image_url so nothing goes
-- blank for products created before this migration.
-- Paste into Supabase SQL Editor and run.
-- ============================================================

alter table products add column if not exists image_urls text[] not null default '{}';

update products
set image_urls = array[image_url]
where image_url is not null and image_urls = '{}';
