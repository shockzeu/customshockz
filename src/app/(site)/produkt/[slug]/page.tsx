import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getProductBySlug } from "@/lib/data/products";
import { formatPrice } from "@/lib/format";
import { PRODUCT_CATEGORY_LABELS } from "@/types";
import { Badge } from "@/components/ui/badge";
import { ProductGallery } from "@/components/product-gallery";
import { SimpleOrderButton } from "@/components/simple-order-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const description =
    product.description ||
    `${PRODUCT_CATEGORY_LABELS[product.category]} od CustomShockz — ${formatPrice(product.priceCzk)}. Ručně upravené, iced-out, každý kus originál.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      type: "website",
      images: product.imageUrl ? [{ url: product.imageUrl }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative">
          <ProductGallery images={product.imageUrls} alt={product.name} />
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
            {formatPrice(product.priceCzk)}
          </p>
          {product.description && (
            <p className="text-muted-foreground mt-4 text-sm sm:text-base">
              {product.description}
            </p>
          )}

          <div className="mt-8">
            <SimpleOrderButton
              productSlug={product.slug}
              productName={product.name}
              imageUrl={product.imageUrl}
              priceCzk={product.priceCzk}
              inStock={product.inStock}
              codAllowed={product.codAllowed}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
