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

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const lastStep = activeTypes.length - 1;
  const reduceMotion = useReducedMotion();

  // Show the current step's selected variant photo; if it has none (e.g. a
  // draft part type with no photos yet), fall back to the nearest earlier
  // step that does, then to the product's own image.
  const previewUrl = useMemo(() => {
    for (let i = step; i >= 0; i--) {
      const t = activeTypes[i];
      const variant = partsByType[t]?.find((v) => v.id === selected[t]);
      if (variant?.image_url) return variant.image_url;
    }
    return imageUrl;
  }, [step, activeTypes, partsByType, selected, imageUrl]);

  function goToStep(target: number) {
    setDirection(target >= step ? 1 : -1);
    setStep(Math.max(0, Math.min(target, lastStep)));
  }

  function selectVariant(type: string, variant: PartVariantRow) {
    setSelected((s) => ({ ...s, [type]: variant.id }));
  }

  // Full transform strings, not Motion's x/scale shorthands — only these are
  // hardware accelerated.
  const slide = (px: number) => `translateX(${reduceMotion ? 0 : px}px)`;

  const stepVariants = {
    enter: (dir: number) => ({
      opacity: 0,
      transform: slide(dir > 0 ? 40 : -40),
    }),
    center: { opacity: 1, transform: "translateX(0px)" },
    exit: (dir: number) => ({
      opacity: 0,
      transform: slide(dir > 0 ? -40 : 40),
    }),
  };

  // Staggered entrance for the variant thumbnails (see .animate-thumb-in).
  // Decorative — they stay clickable while it plays.
  const thumbDelay = (i: number) => ({ animationDelay: `${60 + i * 12}ms` });

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
    // Block on mobile, two columns from lg — the preview needs a taller parent
    // than itself for `sticky` to have anywhere to travel.
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_400px] lg:items-start lg:gap-10">
      <div className="bg-background/95 border-border/40 sticky top-16 z-30 -mx-4 border-b px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-20 lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        {/* Capped on desktop so it stays shorter than the options column —
            a sticky element as tall as its parent has nowhere to travel. */}
        <div className="from-onyx-surface to-onyx relative mx-auto aspect-square w-full max-w-[min(100%,30vh)] overflow-hidden rounded-xl bg-gradient-to-br lg:max-w-[560px]">
          <AnimatePresence mode="wait">
            {previewUrl ? (
              <motion.div
                key={previewUrl}
                className="absolute inset-0"
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, transform: "scale(1.03)" }
                }
                animate={{ opacity: 1, transform: "scale(1)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE_OUT_QUART }}
              >
                <Image
                  src={previewUrl}
                  alt={productName}
                  fill
                  sizes="(min-width: 1024px) 45vw, 60vw"
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
      </div>

      <div className="mt-6 lg:mt-0">
      <div className="flex items-center justify-center gap-2 lg:justify-start">
        {activeTypes.map((type, i) => (
          <button
            key={type}
            type="button"
            onClick={() => goToStep(i)}
            title={PART_TYPE_LABELS[type]}
            className={cn(
              "relative flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors",
              i === step
                ? "border-transparent text-ice-blue"
                : i < step
                  ? "border-ice-blue/60 text-ice-blue/60"
                  : "border-border/60 text-muted-foreground",
            )}
          >
            {i === step && (
              <motion.span
                layoutId="builder-step-dot"
                aria-hidden
                className="border-ice-blue bg-ice-blue/10 absolute inset-0 rounded-full border"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { duration: 0.28, ease: EASE_OUT_QUART }
                }
              />
            )}
            <span className="relative">{i + 1}</span>
          </button>
        ))}
      </div>

      {/* Clips the 40px slide so it can never widen the page; the -mx/px pair
          keeps room for focus rings on the edge thumbnails. */}
      <div className="-mx-1 overflow-hidden px-1">
      <AnimatePresence mode="wait" custom={direction}>
      {activeTypes.map((type, stepIndex) => {
        if (stepIndex !== step) return null;
        const currentVariant = partsByType[type].find(
          (v) => v.id === selected[type],
        );
        const photoVariants = partsByType[type].filter((v) => v.image_url);
        const plainVariants = partsByType[type].filter((v) => !v.image_url);
        return (
          <motion.div
            key={type}
            className="mt-5"
            custom={direction}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.28, ease: EASE_OUT_QUART }}
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
            <CardContent>
              <div className="space-y-3">
              {plainVariants.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {plainVariants.map((variant, i) => {
                    const isActive = selected[type] === variant.id;
                    return (
                      <button
                        key={variant.id}
                        style={thumbDelay(i)}
                        type="button"
                        onClick={() => selectVariant(type, variant)}
                        className={cn(
                          "animate-thumb-in flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors",
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
                </div>
              )}

              {photoVariants.length > 0 && (
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-4">
                  {photoVariants.map((variant, i) => {
                    const isActive = selected[type] === variant.id;
                    return (
                      <button
                        key={variant.id}
                        style={thumbDelay(plainVariants.length + i)}
                        type="button"
                        title={variant.label}
                        aria-label={variant.label}
                        onClick={() => selectVariant(type, variant)}
                        className={cn(
                          "animate-thumb-in relative aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors",
                          isActive
                            ? "border-ice-blue"
                            : "border-border/60 hover:border-border",
                        )}
                      >
                        <Image
                          src={variant.image_url!}
                          alt={variant.label}
                          fill
                          sizes="(min-width: 1024px) 96px, 25vw"
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
                  })}
                </div>
              )}
              </div>
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
      </div>

      <div className="bg-background/95 border-border/60 sticky bottom-0 z-30 -mx-4 mt-5 flex items-center justify-between border-t px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:rounded-lg lg:border lg:p-4 lg:backdrop-blur-none">
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
    </div>
  );
}
