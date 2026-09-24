/**
 * One-off import: 925 silver moissanite Cuban link bracelet (full / "plný"
 * style) as a DRAFT product with per-product options (Barva, Délka v cm).
 *
 * Prices: supplier price x 2.0, rounded to steps of 300 CZK
 * (15 cm = 3 490 Kč ... 21,5 cm = 4 990 Kč). `price_modifier` is in haléře.
 * Inserted as is_active = false — activate from /admin/products when told to.
 *
 * Requires migration 0011_product_options.sql to be applied first.
 *
 * Usage: node scripts/import-bracelet-cuban-moissanite.mjs <photo1> [photo2] [photo3]
 *   photos = finished product shots; the first becomes the main image.
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

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

const photoPaths = process.argv.slice(2);
if (photoPaths.length === 0) {
  console.error("Zadej aspoň jednu fotku: node scripts/import-bracelet-cuban-moissanite.mjs <foto1> [foto2] [foto3]");
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUG = "iced-cuban-naramek-moissanit-925";
const CONTENT_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

const PRODUCT = {
  name: "Iced Cuban náramek – moissanit, 925 stříbro",
  slug: SLUG,
  description:
    "Cuban link náramek se zalitými články, osazený moissanity (VVS) v drápkovém osazení. " +
    "Materiál: 925 sterlingové stříbro, barva žluté zlato nebo bílé zlato (povrchová úprava stříbra). " +
    "Šířka článků 6 mm, bezpečnostní zapínání. Vyber si barvu a délku podle svého zápěstí.",
  base_price: 349000, // 3 490 Kč = nejkratší délka (15 cm)
  category: "bracelets",
  in_stock: true,
  is_active: false,
  cod_allowed: false,
  batch: "sperky-1",
};

const OPTIONS = [
  { group_name: "Barva", label: "Zlatá", hex_color: "#D4AF37", price_modifier: 0 },
  { group_name: "Barva", label: "Bílé zlato", hex_color: "#E8E8EC", price_modifier: 0 },
  { group_name: "Délka", label: "15 cm", price_modifier: 0 },
  { group_name: "Délka", label: "16,5 cm", price_modifier: 30000 },
  { group_name: "Délka", label: "18 cm", price_modifier: 60000 },
  { group_name: "Délka", label: "19 cm", price_modifier: 90000 },
  { group_name: "Délka", label: "20 cm", price_modifier: 120000 },
  { group_name: "Délka", label: "21,5 cm", price_modifier: 150000 },
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

const imageUrls = [];
for (const file of photoPaths) {
  const ext = extname(file).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    console.error(`Nepodporovaná přípona fotky: ${file}`);
    process.exit(1);
  }
  const path = `bracelets/${crypto.randomUUID()}${ext}`;
  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, readFileSync(file), { contentType, upsert: false });
  if (uploadError) {
    console.error(`Upload selhal (${file}):`, uploadError.message);
    process.exit(1);
  }
  const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
  imageUrls.push(pub.publicUrl);
  console.log(`OK foto ${file} -> ${pub.publicUrl}`);
}

const { data: product, error: productError } = await supabase
  .from("products")
  .insert({ ...PRODUCT, image_url: imageUrls[0], image_urls: imageUrls })
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

console.log(`✅ Náramek importován jako draft (id ${product.id}), ${rows.length} voleb, ${imageUrls.length} fotek.`);
