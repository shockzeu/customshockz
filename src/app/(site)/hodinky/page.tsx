import { getActiveProducts } from "@/lib/data/products";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Hodinky | CustomShockz",
  description: "Aktuální kolekce iced-out custom G-Shock hodinek.",
};

export default async function HodinkyPage() {
  const products = await getActiveProducts({ category: "watches" });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal className="mb-10">
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Hodinky
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl text-sm">
          Každý kus je ručně dělaný originál. Co je vyprodané, se nevrací.
        </p>
      </Reveal>

      {products.length === 0 ? (
        <p className="text-muted-foreground py-20 text-center text-sm">
          Právě teď tu nic nemáme — kolekce se brzy naplní.
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
