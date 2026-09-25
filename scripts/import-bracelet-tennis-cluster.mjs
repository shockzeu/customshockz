/**
 * One-off import: 925 silver cluster tennis bracelet (VVS moissanite,
 * cushion clusters) as a DRAFT product with per-product Délka options.
 * No photos — Lukáš adds those himself via /admin/products.
 *
 * Prices: supplier price x 1.9 (90% margin), rounded to steps of 100 CZK.
 * 15 cm 4 900 Kč ... 19 cm 6 100 Kč. `price_modifier` is in haléře,
 * relative to the 15 cm base price. Inserted as is_active = false —
 * activate from /admin/products when told to.
 *
 * Requires migrations 0011_product_options.sql and 0012_product_material.sql.
 *
 * Usage: node scripts/import-bracelet-tennis-cluster.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

function loadEnv() {
  try {
    const raw = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // no .env.local — rely on the process env
  }
}

loadEnv();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUG = "iced-tennis-naramek-moissanit-925";

const PRODUCT = {
  name: "Iced Tennis náramek – moissanit, 925 stříbro",
  slug: SLUG,
  description:
    "Tenisový náramek s hranatými (cushion) klastry broušených moissanitů (VVS) v drápkovém " +
    "osazení, šířka 6 mm. Čisté 925 stříbro, žádné zlato. Skládací bezpečnostní zapínání. " +
    "Vyber si délku podle svého zápěstí.",
  material: "925 stříbro",
  base_price: 490000, // 4 900 Kč = nejkratší délka (15 cm)
  category: "bracelets",
  in_stock: true,
  is_active: false,
  cod_allowed: false,
  batch: "sperky-1",
};

const OPTIONS = [
  { group_name: "Délka", label: "15 cm", price_modifier: 0 },
  { group_name: "Délka", label: "16,5 cm", price_modifier: 40000 },
  { group_name: "Délka", label: "18 cm", price_modifier: 80000 },
  { group_name: "Délka", label: "19 cm", price_modifier: 120000 },
];

const { data: existing } = await supabase
  .from("products")
  .select("id")
  .eq("slug", SLUG)
  .maybeSingle();

if (existing) {
  console.error(`Produkt se slugem "${SLUG}" už existuje (id ${existing.id}). Nic neimportuji.`);
  process.exit(1);
}

const { data: product, error: productError } = await supabase
  .from("products")
  .insert(PRODUCT)
  .select("id")
  .single();

if (productError) {
  console.error("Insert produktu selhal:", productError.message);
  process.exit(1);
}

const rows = OPTIONS.map((o, i) => ({
  product_id: product.id,
  sort_order: i,
  is_active: true,
  ...o,
}));

const { error: optionsError } = await supabase.from("product_options").insert(rows);

if (optionsError) {
  console.error("Insert voleb selhal (je spuštěná migrace 0011?):", optionsError.message);
  console.error(`Produkt ${product.id} už je vložený jako draft — smaž ho v adminu, nebo dodělej options ručně.`);
  process.exit(1);
}

console.log(`✅ Náramek importován jako draft (id ${product.id}), ${rows.length} voleb, bez fotek.`);
