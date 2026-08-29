"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { PART_TYPES, type PartType } from "@/types";

export type PartInput = {
  id?: string;
  part_type: PartType;
  label: string;
  hex_color: string | null;
  image_url: string | null;
  priceModifierCzk: number; // whole CZK from the form (can be negative)
  is_active: boolean;
};

type ActionResult = { error?: string };

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Nepřihlášený uživatel");
  return supabase;
}

export async function savePartVariant(input: PartInput): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    if (!input.label.trim()) return { error: "Název varianty je povinný" };
    if (!PART_TYPES.includes(input.part_type))
      return { error: "Neplatný typ dílu" };

    const payload = {
      part_type: input.part_type,
      label: input.label.trim(),
      hex_color: input.hex_color?.trim() || null,
      image_url: input.image_url?.trim() || null,
      price_modifier: Math.round(input.priceModifierCzk * 100), // → haléře
      is_active: input.is_active,
    };

    const res = input.id
      ? await supabase.from("part_variants").update(payload).eq("id", input.id)
      : await supabase.from("part_variants").insert(payload);

    if (res.error) return { error: res.error.message };

    revalidatePath("/admin/parts");
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** Soft delete / restore. */
export async function setPartActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("part_variants")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/parts");
    revalidatePath("/admin");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}
