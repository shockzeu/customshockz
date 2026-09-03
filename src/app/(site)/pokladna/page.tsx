"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types";
import { createOrder } from "@/app/(site)/pokladna/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal } from "@/components/motion/reveal";

export default function PokladnaPage() {
  const router = useRouter();
  const { items, totalCzk, clear } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressZip, setAddressZip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("bank_transfer");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const res = await createOrder({
      customerName,
      email,
      phone,
      addressStreet,
      addressCity,
      addressZip,
      paymentMethod,
      note,
      items,
    });

    setSubmitting(false);

    if (res.error) {
      toast.error("Objednávku se nepodařilo odeslat", { description: res.error });
      return;
    }

    clear();
    const params = new URLSearchParams({ platba: paymentMethod });
    if (res.orderNumber) params.set("cislo", String(res.orderNumber));
    router.push(`/objednavka-dokoncena?${params.toString()}`);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="font-heading text-2xl font-bold uppercase">
          Košík je prázdný
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Nejdřív si vyber pár kousků, ať máme co objednat.
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/hodinky">Prohlédnout hodinky</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Dokončit objednávku
        </h1>
      </Reveal>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <Reveal delay={0.05}>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="c-name">Jméno a příjmení</Label>
                <Input
                  id="c-name"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Jan Novák"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-email">E-mail</Label>
                <Input
                  id="c-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jan@example.com"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="c-phone">Telefon (volitelné)</Label>
              <Input
                id="c-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+420 601 234 567"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="c-street">Ulice a číslo popisné</Label>
              <Input
                id="c-street"
                required
                value={addressStreet}
                onChange={(e) => setAddressStreet(e.target.value)}
                placeholder="Hlavní 123"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="c-city">Město</Label>
                <Input
                  id="c-city"
                  required
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                  placeholder="Praha"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="c-zip">PSČ</Label>
                <Input
                  id="c-zip"
                  required
                  value={addressZip}
                  onChange={(e) => setAddressZip(e.target.value)}
                  placeholder="110 00"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Způsob platby</Label>
              <div className="grid gap-2 sm:grid-cols-2">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left text-sm transition-colors",
                      paymentMethod === method
                        ? "border-ice-blue bg-ice-blue/10 text-foreground"
                        : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    {PAYMENT_METHOD_LABELS[method]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="c-note">Poznámka (volitelné)</Label>
              <Textarea
                id="c-note"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Cokoliv, co bychom měli vědět k objednávce…"
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              Odeslat objednávku
            </Button>
          </form>
        </Reveal>

        <Reveal delay={0.1} className="border-border/60 h-fit rounded-xl border p-6">
          <h2 className="text-sm font-semibold tracking-wide uppercase">
            Souhrn objednávky
          </h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div key={item.key} className="flex justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">
                    {item.name} × {item.quantity}
                  </p>
                  {item.configSummary.length > 0 && (
                    <p className="text-muted-foreground truncate text-xs">
                      {item.configSummary.join(" · ")}
                    </p>
                  )}
                </div>
                <span className="shrink-0 text-ice">
                  {formatPrice(item.unitPriceCzk * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-border/60 mt-4 flex items-center justify-between border-t pt-4">
            <span className="text-muted-foreground text-sm">Celkem</span>
            <span className="font-heading text-ice text-xl font-bold">
              {formatPrice(totalCzk)}
            </span>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
