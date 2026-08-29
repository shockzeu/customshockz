import { TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsTable } from "@/components/admin/products-table";

export const metadata = {
  title: "Produkty",
  robots: { index: false, follow: false },
};

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight uppercase">
          Produkty
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Základní modely hodinek. Mazání je „měkké" — produkt se jen skryje.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/40">
          <CardContent className="text-muted-foreground flex items-start gap-3 py-6 text-sm">
            <TriangleAlert className="text-destructive mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground font-medium">
                Nepodařilo se načíst produkty
              </p>
              <p className="mt-1 text-xs">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <ProductsTable products={(data as ProductRow[]) ?? []} />
      )}
    </div>
  );
}
