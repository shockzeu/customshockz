/**
 * One-off: flips is_active = true for the "base" and "case" part_variants
 * imported by import-ga2100-base.mjs / import-ga2100-cases.mjs, so the
 * /na-miru builder actually shows them.
 *
 * Usage: node scripts/activate-builder-drafts.mjs
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

const { data, error } = await supabase
  .from("part_variants")
  .update({ is_active: true })
  .in("part_type", ["base", "case"])
  .select("label, part_type");

if (error) {
  console.error("Aktivace selhala:", error.message);
  process.exit(1);
}

console.log(`✅ Aktivováno ${data.length} variant:`);
for (const row of data) {
  console.log(`  [${row.part_type}] ${row.label}`);
}
