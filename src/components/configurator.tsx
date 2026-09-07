"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { toast } from "sonner";

import {
  PART_TYPES,
  PART_TYPE_LABELS,
  PART_TYPE_STEP_HINTS,
  type PartVariantRow,
} from "@/types";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SimpleOrderButton } from "@/components/simple-order-button";

// Strong ease-out (quart) — matches components/motion/reveal.tsx.
const EASE_OUT_QUART = [0.23, 1, 0.32, 1] as const;

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

  const [previewUrl, setPreviewUrl] = useState<string | null>(imageUrl);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const lastStep = activeTypes.length - 1;
  const reduceMotion = useReducedMotion();

  function goToStep(target: number) {
    setDirection(target >= step ? 1 : -1);
    setStep(Math.max(0, Math.min(target, lastStep)));
  }

  function selectVariant(type: string, variant: PartVariantRow) {
    setSelected((s) => ({ ...s, [type]: variant.id }));
    if (variant.image_url) setPreviewUrl(variant.image_url);
  }

  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir > 0 ? 32 : -32,
    }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({
      opacity: 0,
      x: reduceMotion ? 0 : dir > 0 ? -32 : 32,
    }),
  };

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
      <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br">
        <AnimatePresence mode="wait">
          {previewUrl ? (
            <motion.div
              key={previewUrl}
              className="absolute inset-0"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 1.03 }
              }
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: EASE_OUT_QUART }}
            >
              <Image
                src={previewUrl}
                alt={productName}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="absolute inset-0 opacity-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 20%, rgba(125,211,252,0.28), transparent 55%)",
              }}
              aria-hidden
            />
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-center gap-2">
        {activeTypes.map((type, i) => (
          <button
            key={type}
            type="button"
            onClick={() => goToStep(i)}
            title={PART_TYPE_LABELS[type]}
            className={cn(
              "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
              i === step
                ? "border-ice-blue bg-ice-blue/10 text-ice-blue"
                : i < step
                  ? "border-ice-blue/60 text-ice-blue/60"
                  : "border-border/60 text-muted-foreground",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" custom={direction}>
      {activeTypes.map((type, stepIndex) => {
        if (stepIndex !== step) return null;
        const currentVariant = partsByType[type].find(
          (v) => v.id === selected[type],
        );
        return (
          <motion.div
            key={type}
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
          >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide">
                <span className="border-ice-blue text-ice-blue flex size-5 shrink-0 items-center justify-center rounded-full border text-xs">
                  {stepIndex + 1}
                </span>
                Krok {stepIndex + 1} z {activeTypes.length} ·{" "}
                {PART_TYPE_LABELS[type]}
              </CardTitle>
              <p className="text-muted-foreground text-xs">
                {PART_TYPE_STEP_HINTS[type]}
              </p>
              {currentVariant && (
                <p className="text-foreground text-xs font-medium">
                  Vybráno: {currentVariant.label}
                </p>
              )}
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {partsByType[type].map((variant) => {
                const isActive = selected[type] === variant.id;

                if (variant.image_url) {
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      title={variant.label}
                      aria-label={variant.label}
                      onClick={() => selectVariant(type, variant)}
                      className={cn(
                        "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                        isActive
                          ? "border-ice-blue"
                          : "border-border/60 hover:border-border",
                      )}
                    >
                      <Image
                        src={variant.image_url}
                        alt={variant.label}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                      {variant.price_modifier !== 0 && (
                        <span className="absolute inset-x-0 bottom-0 truncate bg-black/70 px-1 text-center text-[9px] leading-tight text-white">
                          {variant.price_modifier > 0 ? "+" : ""}
                          {formatPrice(variant.price_modifier)}
                        </span>
                      )}
                    </button>
                  );
                }

                return (
                  <button
                    key={variant.id}
                    type="button"
                    onClick={() => selectVariant(type, variant)}
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
            {(step > 0 || step < lastStep) && (
              <div className="flex items-center justify-between px-6 pb-6">
                {step > 0 ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToStep(step - 1)}
                  >
                    ← Zpět
                  </Button>
                ) : (
                  <span />
                )}
                {step < lastStep && (
                  <Button size="sm" onClick={() => goToStep(step + 1)}>
                    Pokračovat →
                  </Button>
                )}
              </div>
            )}
          </Card>
          </motion.div>
        );
      })}
      </AnimatePresence>

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
