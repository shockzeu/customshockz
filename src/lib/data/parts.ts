import { createClient } from "@/lib/supabase/server";
import { PART_TYPES, type PartType, type PartVariantRow } from "@/types";

/** Active part variants for the configurator, grouped by part type. */
export async function getPartVariantsByType(): Promise<
  Record<PartType, PartVariantRow[]>
> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("part_variants")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const grouped = Object.fromEntries(
    PART_TYPES.map((t) => [t, [] as PartVariantRow[]]),
  ) as Record<PartType, PartVariantRow[]>;

  if (error || !data) return grouped;

  for (const row of data as PartVariantRow[]) {
    grouped[row.part_type].push(row);
  }
  return grouped;
}
