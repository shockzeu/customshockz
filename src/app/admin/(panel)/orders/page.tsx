import { TriangleAlert } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { OrderItemRow, OrderRow } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { OrdersList } from "@/components/admin/orders-list";

export const metadata = {
  title: "Objednávky",
  robots: { index: false, follow: false },
};

export type OrderWithItems = OrderRow & { order_items: OrderItemRow[] };

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight uppercase">
          Objednávky
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Objednávky odeslané přes web, nejnovější první.
        </p>
      </div>

      {error ? (
        <Card className="border-destructive/40">
          <CardContent className="text-muted-foreground flex items-start gap-3 py-6 text-sm">
            <TriangleAlert className="text-destructive mt-0.5 size-4 shrink-0" />
            <div>
              <p className="text-foreground font-medium">
                Nepodařilo se načíst objednávky
              </p>
              <p className="mt-1 text-xs">{error.message}</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <OrdersList orders={(data as OrderWithItems[]) ?? []} />
      )}
    </div>
  );
}
