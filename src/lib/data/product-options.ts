import { createClient } from "@/lib/supabase/server";
import type { ProductOptionRow } from "@/types";

/**
 * Active options for one product, grouped by `group_name` in the order the
 * groups first appear (sort_order within each group, then created_at).
 * Empty object for a product with no configurable options.
 */
export async function getProductOptionsByProductId(
  productId: string,
): Promise<Record<string, ProductOptionRow[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_options")
    .select("*")
    .eq("product_id", productId)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error || !data) return {};

  const grouped: Record<string, ProductOptionRow[]> = {};
  for (const row of data as ProductOptionRow[]) {
    (grouped[row.group_name] ??= []).push(row);
  }
  return grouped;
}
