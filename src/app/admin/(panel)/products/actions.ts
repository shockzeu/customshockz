"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ProductCategory } from "@/types";

const DIACRITICS_RE = /[̀-ͯ]/g;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(DIACRITICS_RE, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

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

type CreateBatchResult = { error?: string; batch?: string; count?: number };

/**
 * Creates `count` hidden draft products at once, tagged with the same
 * `batch` label. Fill each one in via the normal edit dialog, then call
 * `publishBatch` to make them all live together.
 */
export async function createProductBatch(input: {
  batchLabel: string;
  count: number;
  category: ProductCategory;
}): Promise<CreateBatchResult> {
  try {
    const supabase = await requireUser();

    const batchLabel = input.batchLabel.trim();
    if (!batchLabel) return { error: "Název dávky je povinný" };

    const count = Math.round(input.count);
    if (!Number.isFinite(count) || count < 1 || count > 50) {
      return { error: "Počet kusů musí být 1 až 50" };
    }

    const baseSlug = slugify(batchLabel) || "produkt";
    const suffix = Math.random().toString(36).slice(2, 6);

    const rows = Array.from({ length: count }, (_, i) => ({
      name: `${batchLabel} — kus ${i + 1}`,
      category: input.category,
      slug: `${baseSlug}-${suffix}-${i + 1}`,
      base_price: 0,
      in_stock: true,
      is_active: false,
      cod_allowed: false,
      batch: batchLabel,
    }));

    const { error } = await supabase.from("products").insert(rows);
    if (error) return { error: error.message };

    revalidatePath("/admin/products");
    return { batch: batchLabel, count };
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Neznámá chyba" };
  }
}

/** Flips every product in a batch to active at once. */
export async function publishBatch(batch: string): Promise<ActionResult> {
  try {
    const supabase = await requireUser();
    const { error } = await supabase
      .from("products")
      .update({ is_active: true })
      .eq("batch", batch);
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
