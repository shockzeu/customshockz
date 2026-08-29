/**
 * Create the first admin user for CustomShockz.
 *
 * Usage (from the project root, after filling .env.local):
 *   node scripts/create-admin.mjs admin@customshockz.com "SilneHeslo123"
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY   (server-only secret — never commit / expose)
 *
 * This uses the service-role key to create a confirmed user directly.
 * Alternatively, create the user in the Supabase dashboard:
 *   Authentication → Users → Add user → tick "Auto Confirm User".
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// Minimal .env.local loader (no extra dependency).
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

const [, , email, password] = process.argv;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!email || !password) {
  console.error('Použití: node scripts/create-admin.mjs <email> "<heslo>"');
  process.exit(1);
}
if (!url || !serviceKey) {
  console.error(
    "Chybí NEXT_PUBLIC_SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
});

if (error) {
  console.error("Chyba:", error.message);
  process.exit(1);
}

console.log(`✅ Admin účet vytvořen: ${data.user.email}`);
console.log("Přihlas se na /admin/login");
