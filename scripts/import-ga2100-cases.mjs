/**
 * One-off import: uploads the 8 processed GA-2100 case (bezel) product shots
 * to Supabase Storage and inserts them as `part_variants` rows (part_type
 * "case"), so they show up as thumbnail swatches in the builder.
 *
 * Inserted as is_active = false (draft) — activate them from /admin/parts
 * once you're happy with them, same as the product "drops" workflow.
 *
 * Usage: node scripts/import-ga2100-cases.mjs
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

const ITEMS = [
  { file: "cshockz_Silver1797_GA-2100_scene1.png", label: "Stříbrná 1797" },
  { file: "cshockz_Silver1788_GA-2100_scene1.png", label: "Stříbrná 1788" },
  { file: "cshockz_Silver1791_GA-2100_scene1.png", label: "Stříbrná 1791" },
  { file: "cshockz_Silver1806_GA-2100_scene1.png", label: "Stříbrná 1806" },
  { file: "cshockz_Gold1788_GA-2100_scene1.png", label: "Zlatá 1788" },
  { file: "cshockz_Gold1791_GA-2100_scene1.png", label: "Zlatá 1791" },
  { file: "cshockz_Gold1806_GA-2100_scene1.png", label: "Zlatá 1806" },
  { file: "cshockz_Gold1797_GA-2100_scene1.png", label: "Zlatá 1797" },
];

for (const item of ITEMS) {
  const bytes = readFileSync(`${OUTDIR}\\${item.file}`);
  const path = `case/${crypto.randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("part-images")
    .upload(path, bytes, { contentType: "image/png", upsert: false });

  if (uploadError) {
    console.error(`Upload selhal (${item.file}):`, uploadError.message);
    process.exit(1);
  }

  const { data: pub } = supabase.storage.from("part-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("part_variants").insert({
    part_type: "case",
    label: item.label,
    hex_color: item.label.startsWith("Zlatá") ? "#D4AF37" : "#C7CDD6",
    image_url: pub.publicUrl,
    price_modifier: 0,
    is_active: false,
  });

  if (insertError) {
    console.error(`Insert selhal (${item.label}):`, insertError.message);
    process.exit(1);
  }

  console.log(`OK ${item.label} -> ${pub.publicUrl}`);
}

console.log(`✅ Importováno ${ITEMS.length} variant krytu (case), jako neaktivní draft.`);
