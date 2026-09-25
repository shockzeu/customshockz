import { createClient } from "@/lib/supabase/server";
import type { ProductOptionRow, ProductRow } from "@/types";
import { CatalogGrid } from "@/components/admin/catalog-grid";

export const metadata = {
  title: "Katalog",
  robots: { index: false, follow: false },
};

export default async function AdminCatalogPage() {
  const supabase = await createClient();
  const [{ data: products, error }, { data: options }] = await Promise.all([
    supabase.from("products").select("*").order("created_at", { ascending: false }),
    supabase
      .from("product_options")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true }),
  ]);

  const optionsByProduct = new Map<string, ProductOptionRow[]>();
  for (const row of (options as ProductOptionRow[]) ?? []) {
    const list = optionsByProduct.get(row.product_id) ?? [];
    list.push(row);
    optionsByProduct.set(row.product_id, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight uppercase">
          Katalog
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Náhled toho, jak produkty vypadají (fotky, popis, cena, varianty) —
          i draft/skryté kusy. Klikni na produkt pro detail.
        </p>
      </div>

      {error ? (
        <p className="text-destructive text-sm">
          Nepodařilo se načíst katalog: {error.message}
        </p>
      ) : (
        <CatalogGrid
          products={(products as ProductRow[]) ?? []}
          optionsByProduct={Object.fromEntries(optionsByProduct)}
        />
      )}
    </div>
  );
}
