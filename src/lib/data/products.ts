import { createClient } from "@/lib/supabase/server";
import type { Product, ProductRow } from "@/types";

function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    slug: row.slug ?? row.id,
    name: row.name,
    priceCzk: row.base_price,
    currency: "CZK",
    description: row.description ?? "",
    imageUrl: row.image_url,
    inStock: row.in_stock,
  };
}

/** Active products for the public storefront, newest first. */
export async function getActiveProducts(limit?: number): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error || !data) return [];

  return (data as ProductRow[]).map(toProduct);
}

/** Single active product by slug, or null if not found / hidden. */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !data) return null;
  return toProduct(data as ProductRow);
}
