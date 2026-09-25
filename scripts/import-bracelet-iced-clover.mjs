/**
 * One-off import: "Iced Clover" bracelet (brass + zircon, four-leaf clover
 * link chain) as a DRAFT product with per-product options (Barva, Délka).
 *
 * Prices: 18 cm 850 Kč, 20,5 cm 900 Kč, 23 cm 950 Kč. `price_modifier` is in
 * haléře, relative to the 18 cm base price.
 * Inserted as is_active = false — activate from /admin/products when told to.
 *
 * Requires migration 0011_product_options.sql (and 0012_product_material.sql)
 * to be applied first.
 *
 * Usage: node scripts/import-bracelet-iced-clover.mjs <modra.png> <fialovomodra.png> <ruzova.png> <zelena.png>
 *   photos = one per color, in this exact order (Modrá, Fialovo-růžová, Růžová, Zelená).
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
if (photoPaths.length !== 4) {
  console.error(
    "Zadej přesně 4 fotky v pořadí Modrá, Fialovo-růžová, Růžová, Zelená:\n" +
      "node scripts/import-bracelet-iced-clover.mjs <modra.png> <fialovomodra.png> <ruzova.png> <zelena.png>",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const SLUG = "iced-clover-naramek";
const CONTENT_TYPES = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

const PRODUCT = {
  name: "Iced Clover náramek",
  slug: SLUG,
  description:
    "Náramek s prokládaným řetízkem a čtyřlístkovými (clover) články, každý osazený broušenými " +
    "zirkony motýlkového tvaru v barevném provedení a obklopený věnečkem menších čirých zirkonů. " +
    "Zapínání skryté v pokoveném zámku posetém zirkony. Materiál: mosaz + zirkon. Vyber si barvu a délku podle zápěstí.",
  material: "Mosaz + zirkon",
  base_price: 85000, // 850 Kč = nejkratší délka (18 cm)
  category: "bracelets",
  in_stock: true,
  is_active: false,
  cod_allowed: false,
  batch: "sperky-1",
};

// Options for Barva get their image_url filled in after upload (index-matched to photoPaths).
const COLOR_LABELS = ["Modrá", "Fialovo-růžová", "Růžová", "Zelená"];
const COLOR_HEX = ["#2F5FCE", "#8B4FD1", "#E85FA0", "#2E8B57"];

const LENGTH_OPTIONS = [
  { group_name: "Délka", label: "18 cm", price_modifier: 0 },
  { group_name: "Délka", label: "20,5 cm", price_modifier: 5000 },
  { group_name: "Délka", label: "23 cm", price_modifier: 10000 },
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

const colorOptions = COLOR_LABELS.map((label, i) => ({
  group_name: "Barva",
  label,
  hex_color: COLOR_HEX[i],
  image_url: imageUrls[i],
  price_modifier: 0,
}));

const rows = [...colorOptions, ...LENGTH_OPTIONS].map((o, i) => ({
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
