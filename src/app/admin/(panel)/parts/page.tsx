import { TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { PartVariantRow } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { PartForm } from "@/components/admin/part-form";
import { PartsTable } from "@/components/admin/parts-table";

export const metadata = {
  title: "Varianty dílů",
  robots: { index: false, follow: false },
};

export default async function AdminPartsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("part_variants")
    .select("*")
    .order("part_type", { ascending: true })
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight uppercase">
          Varianty dílů
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Stavební kameny pro konfigurátor: pouzdra, číselníky, řemínky a
          iced-out lunety.
        </p>
      </div>

      <PartForm />

      {error ? (
        <Card className="border-destructive/40">
          <CardContent className="text-muted-foreground flex items-start gap-3 py-6 text-sm">
            <TriangleAlert className="text-destructive mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground font-medium">
                Nepodařilo se načíst varianty
              </p>
              <p className="mt-1 text-xs">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <PartsTable variants={(data as PartVariantRow[]) ?? []} />
      )}
    </div>
  );
}
