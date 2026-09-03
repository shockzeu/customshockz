"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { PART_TYPES, PART_TYPE_LABELS, type PartVariantRow } from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleOrderButton } from "@/components/simple-order-button";

type Props = {
  productSlug: string | null;
  productName: string;
  imageUrl: string | null;
  basePriceCzk: number;
  partsByType: Record<string, PartVariantRow[]>;
  inStock: boolean;
  codAllowed: boolean;
};

export function Configurator({
  productSlug,
  productName,
  imageUrl,
  basePriceCzk,
  partsByType,
  inStock,
  codAllowed,
}: Props) {
  const { addItem } = useCart();
  const activeTypes = PART_TYPES.filter(
    (t) => (partsByType[t]?.length ?? 0) > 0,
  );

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      activeTypes.map((t) => [t, partsByType[t][0].id]),
    ),
  );

  const selectedRows = useMemo(
    () =>
      activeTypes
        .map((t) => partsByType[t].find((v) => v.id === selected[t]))
        .filter((v): v is PartVariantRow => Boolean(v)),
    [activeTypes, partsByType, selected],
  );

  const totalCzk =
    basePriceCzk + selectedRows.reduce((sum, v) => sum + v.price_modifier, 0);

  function handleAddToCart() {
    const configSummary = selectedRows.map(
      (v) => `${PART_TYPE_LABELS[v.part_type]}: ${v.label}`,
    );
    const key = `${productSlug ?? "custom"}::${selectedRows.map((v) => v.id).join(",")}`;

    addItem({
      key,
      productSlug,
      name: productName,
      imageUrl,
      unitPriceCzk: totalCzk,
      configSummary,
      codAllowed,
    });
    toast.success("Přidáno do košíku");
  }

  if (activeTypes.length === 0) {
    return (
      <SimpleOrderButton
        productSlug={productSlug}
        productName={productName}
        imageUrl={imageUrl}
        priceCzk={basePriceCzk}
        inStock={inStock}
        codAllowed={codAllowed}
      />
    );
  }

  return (
    <div className="space-y-6">
      {activeTypes.map((type) => (
        <Card key={type}>
          <CardHeader>
            <CardTitle className="text-sm font-semibold uppercase tracking-wide">
              {PART_TYPE_LABELS[type]}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {partsByType[type].map((variant) => {
              const isActive = selected[type] === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() =>
                    setSelected((s) => ({ ...s, [type]: variant.id }))
                  }
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-ice-blue bg-ice-blue/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {variant.hex_color && (
                    <span
                      className="size-4 shrink-0 rounded-full border border-white/20"
                      style={{ backgroundColor: variant.hex_color }}
                      aria-hidden
                    />
                  )}
                  <span>{variant.label}</span>
                  {variant.price_modifier !== 0 && (
                    <span className="text-xs opacity-70">
                      {variant.price_modifier > 0 ? "+" : ""}
                      {formatPrice(variant.price_modifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="border-border/60 flex items-center justify-between rounded-lg border p-4">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            Celková cena
          </p>
          <p className="font-heading text-ice text-2xl font-bold">
            {formatPrice(totalCzk)}
          </p>
        </div>
        <Button size="lg" disabled={!inStock} onClick={handleAddToCart}>
          {inStock ? "Přidat do košíku" : "Vyprodáno"}
        </Button>
      </div>
    </div>
  );
}
