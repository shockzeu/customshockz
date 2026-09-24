"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import type { ProductOptionRow } from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  productSlug: string | null;
  productName: string;
  imageUrl: string | null;
  basePriceCzk: number;
  optionsByGroup: Record<string, ProductOptionRow[]>;
  inStock: boolean;
  codAllowed: boolean;
};

/**
 * Add-to-cart for a regular product that has simple, single-step options
 * (length, color, ...) — e.g. a bracelet where the supplier offers several
 * lengths and metal colors. Unlike `Configurator`, every group is shown at
 * once; there's no multi-step wizard because there's no "base" to build on.
 */
export function ProductVariants({
  productSlug,
  productName,
  imageUrl,
  basePriceCzk,
  optionsByGroup,
  inStock,
  codAllowed,
}: Props) {
  const { addItem } = useCart();
  const groupNames = Object.keys(optionsByGroup);

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      groupNames.map((g) => [g, optionsByGroup[g][0].id]),
    ),
  );

  function selectOption(group: string, option: ProductOptionRow) {
    setSelected((s) => ({ ...s, [group]: option.id }));
  }

  const selectedRows = useMemo(
    () =>
      groupNames
        .map((g) => optionsByGroup[g].find((o) => o.id === selected[g]))
        .filter((o): o is ProductOptionRow => Boolean(o)),
    [groupNames, optionsByGroup, selected],
  );

  // The most recently-listed group with a photo for its selected option wins
  // — e.g. a "Barva" group with per-color photos overrides the plain base image.
  const previewUrl = useMemo(() => {
    for (let i = selectedRows.length - 1; i >= 0; i--) {
      if (selectedRows[i].image_url) return selectedRows[i].image_url;
    }
    return imageUrl;
  }, [selectedRows, imageUrl]);

  const totalCzk =
    basePriceCzk + selectedRows.reduce((sum, o) => sum + o.price_modifier, 0);

  function handleAddToCart() {
    const configSummary = selectedRows.map(
      (o) => `${o.group_name}: ${o.label}`,
    );
    const key = `${productSlug ?? productName}::${selectedRows.map((o) => o.id).join(",")}`;

    addItem({
      key,
      productSlug,
      name: productName,
      imageUrl: previewUrl,
      unitPriceCzk: totalCzk,
      configSummary,
      codAllowed,
    });
    toast.success("Přidáno do košíku");
  }

  return (
    <div className="space-y-6">
      {previewUrl && previewUrl !== imageUrl && (
        <div className="from-onyx-surface to-onyx relative aspect-square w-full max-w-xs overflow-hidden rounded-xl bg-gradient-to-br">
          <Image
            src={previewUrl}
            alt={productName}
            fill
            sizes="320px"
            className="object-cover"
          />
        </div>
      )}

      {groupNames.map((group) => (
        <div key={group} className="grid gap-2">
          <p className="text-sm font-semibold tracking-wide uppercase">
            {group}
          </p>
          <div className="flex flex-wrap gap-2">
            {optionsByGroup[group].map((option) => {
              const isActive = selected[group] === option.id;

              if (option.image_url) {
                return (
                  <button
                    key={option.id}
                    type="button"
                    title={option.label}
                    aria-label={option.label}
                    onClick={() => selectOption(group, option)}
                    className={cn(
                      "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                      isActive
                        ? "border-ice-blue"
                        : "border-border/60 hover:border-border",
                    )}
                  >
                    <Image
                      src={option.image_url}
                      alt={option.label}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </button>
                );
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => selectOption(group, option)}
                  className={cn(
                    "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
                    isActive
                      ? "border-ice-blue bg-ice-blue/10 text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                  )}
                >
                  {option.hex_color && (
                    <span
                      className="size-4 shrink-0 rounded-full border border-white/20"
                      style={{ backgroundColor: option.hex_color }}
                      aria-hidden
                    />
                  )}
                  <span>{option.label}</span>
                  {option.price_modifier !== 0 && (
                    <span className="text-xs opacity-70">
                      {option.price_modifier > 0 ? "+" : ""}
                      {formatPrice(option.price_modifier)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      <Button
        size="lg"
        className="w-full sm:w-auto"
        disabled={!inStock}
        onClick={handleAddToCart}
      >
        {inStock
          ? `Přidat do košíku — ${formatPrice(totalCzk)}`
          : "Vyprodáno"}
      </Button>
    </div>
  );
}
