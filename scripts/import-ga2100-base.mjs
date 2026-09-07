/**
 * One-off import: uploads the 17 processed GA-2100 "base" (whole original
 * watch) shots to Supabase Storage and inserts them as `part_variants` rows
 * (part_type "base"), for step 1 of the builder ("vyber základ").
 *
 * Each label starts with a stable 2-digit number (01-17) so that, once a
 * customer orders, whoever fulfills the order knows exactly which supplier
 * model number to source — the number lives only in the text label, never
 * burned into the photo itself.
 *
 * Inserted as is_active = false (draft) — activate from /admin/parts once
 * you're happy with them, same as the "case" (bezel) import.
 *
 * Usage: node scripts/import-ga2100-base.mjs
 *
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
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

const OUTDIR = "D:\\AI\\ComfyUI_windows_portable\\ComfyUI\\output";

// number | source file | supplier model code | Czech color name | hex swatch
const ITEMS = [
  [1, "cshockz_base_ga2100_1a1er_scene1.png", "GA-2100-1A1ER", "Černá s modrými detaily", "#1a2440"],
  [2, "cshockz_base_ga2100_1a2er_scene1.png", "GA-2100-1A2ER", "Černá se zelenými detaily", "#1a3328"],
  [3, "cshockz_base_ga2100_1a3er_scene1.png", "GA-2100-1A3ER", "Černá se zeleným ciferníkem", "#22301f"],
  [4, "cshockz_base_ga2100_1a4er_ORIGINAL_scene1.png", "GA-2100-1A4ER", "Černá s oranžovými detaily", "#2b2116"],
  [5, "cshockz_base_ga2100_1aer_scene1.png", "GA-2100-1AER", "Klasická černá", "#1c1c1c"],
  [6, "cshockz_base_ga2100_2100-7a7er_scene1.png", "GA-2100-7A7ER", "Bílá (tone-on-tone)", "#e9e9e9"],
  [7, "cshockz_base_ga2100_2100-9a9er_scene1.png", "GA-2100-9A9ER", "Neonově žlutá", "#d7e639"],
  [8, "cshockz_base_ga2100_2100as-2aer_scene1.png", "GA-2100AS-2AER", "Modrá se skleněným efektem", "#2b3a4d"],
  [9, "cshockz_base_ga2100_2100bce-1aer_scene1.png", "GA-2100BCE-1AER", "Matná černá CasiOak", "#191919"],
  [10, "cshockz_base_ga2100_2100lxb-1a9er_scene1.png", "GA-2100LXB-1A9ER", "Černá se stříbrným ciferníkem", "#202020"],
  [11, "cshockz_base_ga2100_2100lxb-1aer_scene1.png", "GA-2100LXB-1AER", "Černá s tyrkysovými detaily", "#1b2b2b"],
  [12, "cshockz_base_ga2100_2100rc-1aer_scene1.png", "GA-2100RC-1AER", "Černá s oranžovým ciferníkem", "#241f16"],
  [13, "cshockz_base_ga2100_2100sb-1aer_scene1.png", "GA-2100SB-1AER", "Šedomodrá", "#3a4451"],
  [14, "cshockz_base_ga2100_2100ske-7aer_scene1.png", "GA-2100SKE-7AER", "Průhledná (Skeleton)", "#cfcfcf"],
  [15, "cshockz_base_ga2100_2110et-8aer_scene1.png", "GA-2110ET-8AER", "Khaki (Earth Tone)", "#6b6355"],
  [16, "cshockz_base_ga2100_4aer_scene1.png", "GA-2100-4AER", "Červená", "#7a1414"],
  [17, "cshockz_base_ga2100_7aer_scene1.png", "GA-2100-7AER", "Bílá", "#e8e8e8"],
];

for (const [num, file, model, colorName, hex] of ITEMS) {
  const bytes = readFileSync(`${OUTDIR}\\${file}`);
  const path = `base/${crypto.randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("part-images")
    .upload(path, bytes, { contentType: "image/png", upsert: false });

  if (uploadError) {
    console.error(`Upload selhal (${file}):`, uploadError.message);
    process.exit(1);
  }

  const { data: pub } = supabase.storage.from("part-images").getPublicUrl(path);
  const label = `${String(num).padStart(2, "0")} · ${model} — ${colorName}`;

  const { error: insertError } = await supabase.from("part_variants").insert({
    part_type: "base",
    label,
    hex_color: hex,
    image_url: pub.publicUrl,
    price_modifier: 0,
    is_active: false,
  });

  if (insertError) {
    console.error(`Insert selhal (${label}):`, insertError.message);
    process.exit(1);
  }

  console.log(`OK ${label} -> ${pub.publicUrl}`);
}

console.log(`✅ Importováno ${ITEMS.length} základů, jako neaktivní draft.`);
