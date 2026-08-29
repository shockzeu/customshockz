import Image from "next/image";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/data/products";
import { getPartVariantsByType } from "@/lib/data/parts";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Configurator } from "@/components/configurator";
import { SimpleOrderButton } from "@/components/simple-order-button";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const isConfigurable = product.category === "watches";
  const partsByType = isConfigurable ? await getPartVariantsByType() : null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
              priority
            />
          ) : (
            <div
              className="absolute inset-0 opacity-40"
              style={{
                background:
                  "radial-gradient(120% 120% at 30% 20%, rgba(125,211,252,0.28), transparent 55%)",
              }}
              aria-hidden
            />
          )}
          {!product.inStock && (
            <Badge variant="secondary" className="absolute top-4 left-4">
              Vyprodáno
            </Badge>
          )}
        </div>

        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
            {product.name}
          </h1>
          <p className="text-ice mt-3 text-xl font-semibold">
            {isConfigurable ? "od " : ""}
            {formatPrice(product.priceCzk)}
          </p>
          {product.description && (
            <p className="text-muted-foreground mt-4 text-sm sm:text-base">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            {isConfigurable && partsByType ? (
              <Configurator
                productSlug={product.slug}
                productName={product.name}
                imageUrl={product.imageUrl}
                basePriceCzk={product.priceCzk}
                partsByType={partsByType}
                inStock={product.inStock}
              />
            ) : (
              <SimpleOrderButton
                productSlug={product.slug}
                productName={product.name}
                imageUrl={product.imageUrl}
                priceCzk={product.priceCzk}
                inStock={product.inStock}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
