/**
 * One-off fix: corrects the color descriptions in the 17 "base" (GA-2100)
 * part_variants labels — several were wrong/guessed instead of matching the
 * actual photo (e.g. "tyrkysové detaily" and "stříbrný ciferník" were on the
 * wrong rows). Re-checked every source photo and rewrites label + hex_color
 * to match what's actually visible. Does NOT touch images or is_active.
 *
 * Usage: node scripts/fix-ga2100-base-labels.mjs
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

// number | model code | corrected color description | hex swatch
const FIXES = [
  [1, "GA-2100-1A1ER", "Matná černá (bez barevných detailů)", "#1c1c1c"],
  [2, "GA-2100-1A2ER", "Černá s modrými detaily", "#29b6f6"],
  [3, "GA-2100-1A3ER", "Černá se zelenými detaily", "#39d353"],
  [4, "GA-2100-1A4ER", "Černá s oranžovými detaily", "#ff8a3d"],
  [5, "GA-2100-1AER", "Klasická černá se stříbrnými detaily", "#c7cdd6"],
  [6, "GA-2100-7A7ER", "Bílá (tone-on-tone)", "#e9e9e9"],
  [7, "GA-2100-9A9ER", "Neonově žlutá", "#d7e639"],
  [8, "GA-2100AS-2AER", "Modrá se skleněným efektem", "#2b3a4d"],
  [9, "GA-2100BCE-1AER", "Matná černá, nylonový řemínek", "#191919"],
  [10, "GA-2100LXB-1A9ER", "Černá se zlatými detaily", "#d4af37"],
  [11, "GA-2100LXB-1AER", "Černá se stříbrošedými detaily", "#9ea3ab"],
  [12, "GA-2100RC-1AER", "Černá s tyrkysovými detaily", "#3ddc97"],
  [13, "GA-2100SB-1AER", "Černá se stříbrným ciferníkem", "#c0c0c0"],
  [14, "GA-2100SKE-7AER", "Průhledná (Skeleton)", "#cfcfcf"],
  [15, "GA-2110ET-8AER", "Šedá", "#8a8a8a"],
  [16, "GA-2100-4AER", "Červená", "#d81e1e"],
  [17, "GA-2100-7AER", "Bílá s černým ciferníkem", "#f2f2f2"],
];

for (const [num, model, colorDesc, hex] of FIXES) {
  const label = `${String(num).padStart(2, "0")} · ${model} — ${colorDesc}`;

  const { data, error } = await supabase
    .from("part_variants")
    .update({ label, hex_color: hex })
    .eq("part_type", "base")
    .ilike("label", `%${model}%`)
    .select("id, label");

  if (error) {
    console.error(`Update selhal (${model}):`, error.message);
    process.exit(1);
  }
  if (!data || data.length === 0) {
    console.warn(`⚠️  Nenalezen žádný řádek pro ${model}`);
    continue;
  }
  console.log(`OK ${label}`);
}

console.log("✅ Popisky opraveny.");
