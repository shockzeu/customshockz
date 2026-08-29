import Link from "next/link";

import { getActiveProducts } from "@/lib/data/products";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion/reveal";

export async function Featured() {
  const products = await getActiveProducts({ limit: 6 });

  if (products.length === 0) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <Reveal className="mb-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="font-heading text-2xl font-bold tracking-tight uppercase sm:text-3xl">
            Nejnovější kousky
          </h2>
          <p className="text-muted-foreground mt-2 text-sm">
            Výběr z aktuální kolekce. Limitované, jeden kus od každého.
          </p>
        </div>
        <Button asChild variant="ghost" className="hidden sm:inline-flex">
          <Link href="/hodinky">Vše →</Link>
        </Button>
      </Reveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={i * 0.08}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
