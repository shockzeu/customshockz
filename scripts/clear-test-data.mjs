/**
 * One-off cleanup: hard-deletes all rows in `products` and `part_variants`.
 * Use this to wipe test/mock data before adding real catalog content.
 *
 * Usage: node scripts/clear-test-data.mjs
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

const { error: productsError, count: productsCount } = await supabase
  .from("products")
  .delete({ count: "exact" })
  .not("id", "is", null);

if (productsError) {
  console.error("Chyba při mazání products:", productsError.message);
  process.exit(1);
}

const { error: partsError, count: partsCount } = await supabase
  .from("part_variants")
  .delete({ count: "exact" })
  .not("id", "is", null);

if (partsError) {
  console.error("Chyba při mazání part_variants:", partsError.message);
  process.exit(1);
}

console.log(`✅ Smazáno ${productsCount ?? 0} produktů a ${partsCount ?? 0} variant dílů.`);
