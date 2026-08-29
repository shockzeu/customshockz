"use client";

import { toast } from "sonner";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

type Props = {
  productSlug: string | null;
  productName: string;
  imageUrl: string | null;
  priceCzk: number;
  inStock: boolean;
};

/** Add-to-cart CTA for products without a part configurator (e.g. jewelry). */
export function SimpleOrderButton({
  productSlug,
  productName,
  imageUrl,
  priceCzk,
  inStock,
}: Props) {
  const { addItem } = useCart();

  function handleAddToCart() {
    addItem({
      key: productSlug ?? productName,
      productSlug,
      name: productName,
      imageUrl,
      unitPriceCzk: priceCzk,
      configSummary: [],
    });
    toast.success("Přidáno do košíku");
  }

  return (
    <Button
      size="lg"
      className="w-full sm:w-auto"
      disabled={!inStock}
      onClick={handleAddToCart}
    >
      {inStock ? `Přidat do košíku — ${formatPrice(priceCzk)}` : "Vyprodáno"}
    </Button>
  );
}
