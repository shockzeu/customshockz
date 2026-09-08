/**
 * One-off import: uploads the 6 processed GA-2100 dial-scale shots ("Who cares
 * I'm already late" 2in1 kit) to Supabase Storage and inserts them as
 * `part_variants` rows (part_type "dial"), so they show up as thumbnail
 * swatches in the builder's third step.
 *
 * Inserted as is_active = false (draft) — activate them from /admin/parts
 * once you're happy with them, same as the product "drops" workflow.
 *
 * The "Originál" row goes in first (no photo, no surcharge) so it sorts to the
 * front of the step and stays the default: swapping the dial is opt-in.
 *
 * Usage: node scripts/import-ga2100-dials.mjs
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

// Labels/colours written from looking at each processed photo one by one.
const ITEMS = [
  { file: "relief_dial_Black.png", label: "Černý s bílým písmem", hex: "#2F2F2F" },
  { file: "relief_dial_WB.png", label: "Bílý s černým písmem", hex: "#F1F1F1" },
  { file: "relief_dial_WU.png", label: "Bílý s modrým písmem", hex: "#F1F1F1" },
  { file: "relief_dial_WR.png", label: "Bílý s červeným písmem", hex: "#F1F1F1" },
  { file: "relief_dial_TFNU.png", label: "Tyrkysový s bílým písmem", hex: "#5ABDCB" },
  { file: "relief_dial_ICEU.png", label: "Ledově modrý s bílým písmem", hex: "#CEF2F9" },
];

const { error: originalError } = await supabase.from("part_variants").insert({
  part_type: "dial",
  label: "Originál (neměnit)",
  hex_color: null,
  image_url: null,
  price_modifier: 0,
  is_active: false,
});

if (originalError) {
  console.error("Insert selhal (Originál):", originalError.message);
  process.exit(1);
}

console.log("OK Originál (bez fotky)");

for (const item of ITEMS) {
  const bytes = readFileSync(`${OUTDIR}\\${item.file}`);
  const path = `dial/${crypto.randomUUID()}.png`;

  const { error: uploadError } = await supabase.storage
    .from("part-images")
    .upload(path, bytes, { contentType: "image/png", upsert: false });

  if (uploadError) {
    console.error(`Upload selhal (${item.file}):`, uploadError.message);
    process.exit(1);
  }

  const { data: pub } = supabase.storage.from("part-images").getPublicUrl(path);

  const { error: insertError } = await supabase.from("part_variants").insert({
    part_type: "dial",
    label: item.label,
    hex_color: item.hex,
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

console.log(
  `✅ Importováno ${ITEMS.length} ciferníků + Originál (part_type "dial"), jako neaktivní draft.`,
);
