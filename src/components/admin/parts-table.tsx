"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EyeOff, Eye } from "lucide-react";

import { PART_TYPE_LABELS, type PartVariantRow } from "@/types";
import { formatPrice } from "@/lib/format";
import { setPartActive } from "@/app/admin/(panel)/parts/actions";
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

function formatModifier(haler: number) {
  if (haler === 0) return "—";
  const s = formatPrice(Math.abs(haler));
  return haler > 0 ? `+${s}` : `−${s}`;
}

export function PartsTable({ variants }: { variants: PartVariantRow[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggleActive(v: PartVariantRow) {
    startTransition(async () => {
      const res = await setPartActive(v.id, !v.is_active);
      if (res.error) {
        toast.error("Změna selhala", { description: res.error });
        return;
      }
      toast.success(v.is_active ? "Varianta skryta" : "Varianta obnovena");
      router.refresh();
    });
  }

  return (
    <div className="border-border/60 overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Typ</TableHead>
            <TableHead>Náhled</TableHead>
            <TableHead>Název</TableHead>
            <TableHead className="hidden sm:table-cell">Barva</TableHead>
            <TableHead>Příplatek</TableHead>
            <TableHead>Stav</TableHead>
            <TableHead className="text-right">Akce</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-muted-foreground py-10 text-center text-sm"
              >
                Zatím žádné varianty. Přidej první pomocí formuláře výše.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((v) => (
              <TableRow key={v.id} className={v.is_active ? "" : "opacity-55"}>
                <TableCell>
                  <span className="text-muted-foreground text-xs tracking-wide uppercase">
                    {PART_TYPE_LABELS[v.part_type] ?? v.part_type}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {v.hex_color && (
                      <span
                        className="border-border/60 size-5 shrink-0 rounded border"
                        style={{ backgroundColor: v.hex_color }}
                        title={v.hex_color}
                      />
                    )}
                    {v.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={v.image_url}
                        alt={v.label}
                        className="border-border/60 size-8 rounded border object-cover"
                      />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium">{v.label}</TableCell>
                <TableCell className="text-muted-foreground hidden font-mono text-xs sm:table-cell">
                  {v.hex_color ?? "—"}
                </TableCell>
                <TableCell className="text-sm">
                  {formatModifier(v.price_modifier)}
                </TableCell>
                <TableCell>
                  {v.is_active ? (
                    <Badge className="bg-ice-blue text-onyx">Aktivní</Badge>
                  ) : (
                    <Badge variant="secondary">Skrytý</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={v.is_active ? "Skrýt" : "Obnovit"}
                      disabled={pending}
                      onClick={() => toggleActive(v)}
                    >
                      {v.is_active ? (
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
  );
}
