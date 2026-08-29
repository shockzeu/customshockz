import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/types";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/produkt/${product.slug}`}
      className="group block rounded-xl transition-transform duration-150 ease-out-quart focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98]"
    >
      <Card className="hover:border-ice-blue/50 overflow-hidden pt-0 transition-colors">
        <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden bg-gradient-to-br">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-[400ms] ease-out-quart [@media(hover:hover)]:group-hover:scale-105"
            />
          ) : (
            <>
              <div
                className="absolute inset-0 opacity-40 transition-transform duration-[400ms] ease-out-quart [@media(hover:hover)]:group-hover:scale-105"
                style={{
                  background:
                    "radial-gradient(120% 120% at 30% 20%, rgba(125,211,252,0.28), transparent 55%)",
                }}
                aria-hidden
              />
              <span className="text-muted-foreground/60 absolute inset-0 flex items-center justify-center text-xs tracking-widest uppercase">
                {product.name}
              </span>
            </>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            {!product.inStock && <Badge variant="secondary">Vyprodáno</Badge>}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="text-base font-semibold">
            {product.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {product.description}
          </p>
        </CardContent>

        <CardFooter className="flex items-center justify-between">
          <span
            className={cn(
              "font-heading text-lg font-bold",
              product.inStock ? "text-ice" : "text-muted-foreground",
            )}
          >
            {formatPrice(product.priceCzk, product.currency)}
          </span>
          <span className="text-ice-blue text-sm font-medium opacity-100 transition-opacity duration-150 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100">
            Detail →
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
