import Link from "next/link";

import { siteConfig } from "@/config/site";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Objednávka odeslána | CustomShockz",
};

export default async function ObjednavkaDokoncenaPage({
  searchParams,
}: {
  searchParams: Promise<{ platba?: string }>;
}) {
  const { platba } = await searchParams;
  const paymentMethod = (
    platba === "cash_on_delivery" ? "cash_on_delivery" : "bank_transfer"
  ) as PaymentMethod;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
        Díky za objednávku!
      </h1>
      <p className="text-muted-foreground mt-4 text-base sm:text-lg">
        Přijali jsme ji a ozveme se ti co nejdřív na e-mail s potvrzením a
        dalšími kroky.
      </p>

      <div className="border-border/60 mt-8 rounded-xl border p-6 text-left">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Způsob platby
        </p>
        <p className="mt-1 font-medium">
          {PAYMENT_METHOD_LABELS[paymentMethod]}
        </p>

        {paymentMethod === "bank_transfer" && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Číslo účtu:{" "}
            <span className="text-foreground font-medium">
              {siteConfig.bankAccount}
            </span>
            . Platební údaje (částku a variabilní symbol) ti pošleme
            e-mailem po potvrzení objednávky.
          </p>
        )}
        {paymentMethod === "cash_on_delivery" && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Zaplatíš při převzetí zásilky kurýrovi nebo na poště.
          </p>
        )}
      </div>

      <Button asChild size="lg" className="mt-8">
        <Link href="/hodinky">Zpět na výlohu</Link>
      </Button>
    </div>
  );
}
