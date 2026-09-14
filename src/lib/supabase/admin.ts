import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Service-role client — bypasses RLS. Server-only, never import from a
 * Client Component.
 *
 * Needed for checkout: PostgREST returns the inserted row by default
 * (`.select()` after `.insert()`), which requires a SELECT policy in
 * addition to the INSERT one. Customers must never get a SELECT policy on
 * `orders` — it would let anyone read other people's names/addresses — so
 * the insert itself runs as service-role instead.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );
}
