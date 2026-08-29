import Link from "next/link";

import { getActiveProducts } from "@/lib/data/products";
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Šperky | CustomShockz",
  description: "Náušnice a náramky CustomShockz.",
};

const FILTERS = [
  { value: "all", label: "Vše" },
  { value: "earrings", label: PRODUCT_CATEGORY_LABELS.earrings },
  { value: "bracelets", label: PRODUCT_CATEGORY_LABELS.bracelets },
] as const;

export default async function SperkyPage({
  searchParams,
}: {
  searchParams: Promise<{ kategorie?: string }>;
}) {
  const { kategorie } = await searchParams;
  const active = FILTERS.some((f) => f.value === kategorie) ? kategorie : "all";

  const products = await getActiveProducts({
    category:
      active === "all"
        ? (["earrings", "bracelets"] as ProductCategory[])
        : (active as ProductCategory),
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Šperky
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm">
          Náušnice a náramky, stejný iced-out styl jako naše hodinky.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="mb-8 flex flex-wrap gap-2">
        {FILTERS.map((filter) => (
          <Link
            key={filter.value}
            href={filter.value === "all" ? "/sperky" : `/sperky?kategorie=${filter.value}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              active === filter.value
                ? "border-ice-blue bg-ice-blue/10 text-foreground"
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
            )}
          >
            {filter.label}
          </Link>
        ))}
      </Reveal>

      {products.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center text-sm">
          Právě teď tu nic nemáme — mrkni znovu brzy.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={i * 0.05}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
