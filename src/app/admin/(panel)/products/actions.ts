"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types";

export type ProductInput = {
  id?: string;
  name: string;
  category: ProductCategory;
  slug: string;
  description: string;
  imageUrl: string | null;
  basePriceCzk: number; // whole CZK from the form
  inStock: boolean;
  isActive: boolean;
  codAllowed: boolean;
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

export async function saveProduct(input: ProductInput): Promise<ActionResult> {
  try {
    const supabase = await requireUser();

    if (!input.name.trim()) return { error: "Název je povinný" };
    const slug = input.slug.trim();
    if (!slug) return { error: "Slug je povinný" };

    const payload = {
      name: input.name.trim(),
      category: input.category,
      slug,
      description: input.description.trim() || null,
      image_url: input.imageUrl,
      base_price: Math.round(input.basePriceCzk * 100), // → haléře
      in_stock: input.inStock,
      is_active: input.isActive,
      cod_allowed: input.codAllowed,
    };

    const res = input.id
      ? await supabase.from("products").update(payload).eq("id", input.id)
      : await supabase.from("products").insert(payload);

    if (res.error) return { error: res.error.message };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/hodinky");
    revalidatePath("/sperky");
    revalidatePath(`/produkt/${slug}`);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** Soft delete / restore — we never hard-delete. */
export async function setProductActive(
  id: string,
  isActive: boolean,
): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("products")
      .update({ is_active: isActive })
      .eq("id", id);
    if (error) return { error: error.message };

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/");
    revalidatePath("/hodinky");
    revalidatePath("/sperky");
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}
