"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Pencil, EyeOff, Eye } from "lucide-react";

import { PRODUCT_CATEGORY_LABELS, type ProductRow } from "@/types";
import { formatPrice } from "@/lib/format";
import { setProductActive } from "@/app/admin/(panel)/products/actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ProductDialog } from "@/components/admin/product-dialog";

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleActive(p: ProductRow) {
    startTransition(async () => {
      const res = await setProductActive(p.id, !p.is_active);
      if (res.error) {
        toast.error("Změna selhala", { description: res.error });
        return;
      }
      toast.success(p.is_active ? "Produkt skryt" : "Produkt obnoven");
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <ProductDialog>
          <Button>
            <Plus className="size-4" />
            Přidat produkt
          </Button>
        </ProductDialog>
      </div>

      <div className="border-border/60 overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Název</TableHead>
              <TableHead className="hidden sm:table-cell">Kategorie</TableHead>
              <TableHead>Základní cena</TableHead>
              <TableHead>Stav</TableHead>
              <TableHead className="hidden sm:table-cell">Vytvořeno</TableHead>
              <TableHead className="text-right">Akce</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-10 text-center text-sm"
                >
                  Zatím žádné produkty. Přidej první pomocí tlačítka výše.
                </TableCell>
              </TableRow>
            ) : (
              products.map((p) => (
                <TableRow
                  key={p.id}
                  className={p.is_active ? "" : "opacity-55"}
                >
                  <TableCell className="font-medium">
                    {p.name}
                    <div className="text-muted-foreground text-xs font-normal">
                      /{p.slug ?? "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-sm sm:table-cell">
                    {PRODUCT_CATEGORY_LABELS[p.category]}
                  </TableCell>
                  <TableCell>{formatPrice(p.base_price)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1.5">
                      {p.is_active ? (
                        <Badge className="bg-ice-blue text-onyx">Aktivní</Badge>
                      ) : (
                        <Badge variant="secondary">Skrytý</Badge>
                      )}
                      {!p.in_stock && (
                        <Badge variant="secondary">Vyprodáno</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground hidden text-sm sm:table-cell">
                    {new Date(p.created_at).toLocaleDateString("cs-CZ")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <ProductDialog product={p}>
                        <Button variant="ghost" size="icon" aria-label="Upravit">
                          <Pencil className="size-4" />
                        </Button>
                      </ProductDialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={p.is_active ? "Skrýt" : "Obnovit"}
                        disabled={pending}
                        onClick={() => toggleActive(p)}
                      >
                        {p.is_active ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
