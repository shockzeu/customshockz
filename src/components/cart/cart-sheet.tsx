"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, setQuantity, totalCzk, totalCount } = useCart();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        aria-label="Košík"
        onClick={() => setOpen(true)}
      >
        <ShoppingBag className="size-5" />
        {totalCount > 0 && (
          <span className="bg-ice-blue text-onyx absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] font-bold">
            {totalCount}
          </span>
        )}
      </Button>

      <SheetContent side="right" className="flex w-4/5 max-w-sm flex-col">
        <SheetHeader>
          <SheetTitle>Košík</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <p className="text-muted-foreground flex-1 px-4 text-sm">
            Košík je zatím prázdný.
          </p>
        ) : (
          <div className="flex-1 space-y-4 overflow-y-auto px-4">
            {items.map((item) => (
              <div key={item.key} className="flex gap-3">
                <div className="from-onyx-surface to-onyx relative size-16 shrink-0 overflow-hidden rounded-lg bg-gradient-to-br">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium">{item.name}</p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      aria-label="Odebrat z košíku"
                      className="text-muted-foreground hover:text-foreground shrink-0"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                  {item.configSummary.length > 0 && (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {item.configSummary.join(" · ")}
                    </p>
                  )}
                  <div className="mt-2 flex items-center justify-between">
                    <div className="border-border/60 flex items-center rounded-md border">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity - 1)}
                        aria-label="Snížit počet"
                        className="text-muted-foreground hover:text-foreground p-1.5"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-xs">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.key, item.quantity + 1)}
                        aria-label="Zvýšit počet"
                        className="text-muted-foreground hover:text-foreground p-1.5"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <span className="text-ice text-sm font-semibold">
                      {formatPrice(item.unitPriceCzk * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <SheetFooter>
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Mezisoučet</span>
              <span className="font-heading text-ice text-lg font-bold">
                {formatPrice(totalCzk)}
              </span>
            </div>
            <SheetClose asChild>
              <Button asChild size="lg" className="w-full">
                <Link href="/pokladna">Pokračovat k objednávce</Link>
              </Button>
            </SheetClose>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
