"use client";

import { useState } from "react";
import Image from "next/image";
import { Gem, PackageOpen } from "lucide-react";

import { PRODUCT_CATEGORY_LABELS, type ProductOptionRow, type ProductRow } from "@/types";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function CatalogGrid({
  products,
  optionsByProduct,
}: {
  products: ProductRow[];
  optionsByProduct: Record<string, ProductOptionRow[]>;
}) {
  const [selected, setSelected] = useState<ProductRow | null>(null);

  if (products.length === 0) {
    return (
      <div className="text-muted-foreground flex flex-col items-center gap-2 py-16 text-sm">
        <PackageOpen className="size-8" />
        Zatím žádné produkty.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setSelected(p)}
            className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Card className="hover:border-ice-blue/50 overflow-hidden pt-0 transition-colors">
              <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden bg-gradient-to-br">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground/60 absolute inset-0 flex items-center justify-center px-2 text-center text-xs tracking-widest uppercase">
                    {p.name}
                  </span>
                )}
                <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                  {p.is_active ? (
                    <Badge className="bg-ice-blue text-onyx">Aktivní</Badge>
                  ) : (
                    <Badge variant="secondary">Skrytý</Badge>
                  )}
                </div>
              </div>
              <CardHeader className="pb-0">
                <CardTitle className="line-clamp-1 text-sm">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-3">
                <p className="text-ice text-sm font-semibold">
                  {formatPrice(p.base_price)}
                </p>
              </CardContent>
            </Card>
          </button>
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto sm:max-w-2xl">
          {selected && (
            <ProductPreview
              product={selected}
              options={optionsByProduct[selected.id] ?? []}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function ProductPreview({
  product,
  options,
}: {
  product: ProductRow;
  options: ProductOptionRow[];
}) {
  const images = product.image_urls?.length
    ? product.image_urls
    : product.image_url
      ? [product.image_url]
      : [];

  const grouped: Record<string, ProductOptionRow[]> = {};
  for (const o of options) (grouped[o.group_name] ??= []).push(o);

  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="pr-6 text-xl">{product.name}</DialogTitle>
      </DialogHeader>

      {images.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {images.map((url, i) => (
            <div
              key={url}
              className="bg-onyx-surface relative aspect-square overflow-hidden rounded-lg"
            >
              <Image
                src={url}
                alt={`${product.name} — fotka ${i + 1}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">Bez fotky.</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-ice text-lg font-semibold">
          {formatPrice(product.base_price)}
        </span>
        <Badge variant="secondary">{PRODUCT_CATEGORY_LABELS[product.category]}</Badge>
        {product.material && (
          <Badge variant="secondary" className="gap-1.5">
            <Gem className="size-3.5" />
            {product.material}
          </Badge>
        )}
        {product.is_active ? (
          <Badge className="bg-ice-blue text-onyx">Aktivní</Badge>
        ) : (
          <Badge variant="secondary">Skrytý</Badge>
        )}
        {!product.in_stock && <Badge variant="secondary">Vyprodáno</Badge>}
      </div>

      {product.description && (
        <p className="text-muted-foreground text-sm">{product.description}</p>
      )}

      {Object.entries(grouped).map(([groupName, opts]) => (
        <div key={groupName}>
          <p className="text-xs font-medium tracking-wide uppercase">{groupName}</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {opts.map((o) => (
              <Badge key={o.id} variant="secondary" className="gap-1.5">
                {o.hex_color && (
                  <span
                    className="size-2.5 rounded-full ring-1 ring-white/30"
                    style={{ backgroundColor: o.hex_color }}
                  />
                )}
                {o.label}
                {o.price_modifier !== 0 && (
                  <span className="text-muted-foreground">
                    {o.price_modifier > 0 ? "+" : ""}
                    {formatPrice(o.price_modifier)}
                  </span>
                )}
              </Badge>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
