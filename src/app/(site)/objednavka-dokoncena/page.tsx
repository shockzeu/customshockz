import Link from "next/link";

import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, type PaymentMethod } from "@/types";
import { Button } from "@/components/ui/button";
import { BankTransferCard } from "@/components/payment/bank-transfer-card";

export const metadata = {
  title: "Objednávka odeslána | CustomShockz",
};

export default async function ObjednavkaDokoncenaPage({
  searchParams,
}: {
  searchParams: Promise<{ platba?: string; cislo?: string; castka?: string }>;
}) {
  const { platba, cislo, castka } = await searchParams;
  const paymentMethod = (
    platba === "cash_on_delivery" ? "cash_on_delivery" : "bank_transfer"
  ) as PaymentMethod;
  const amountHaler = castka ? Number(castka) : null;
  const showQr =
    paymentMethod === "bank_transfer" &&
    cislo &&
    amountHaler &&
    Number.isFinite(amountHaler) &&
    amountHaler > 0;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
        Děkujeme za objednávku!
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

        {paymentMethod === "bank_transfer" && showQr && (
          <>
            <BankTransferCard
              qrSrc={`/api/qr-platba?castka=${amountHaler}&vs=${cislo}`}
              account={siteConfig.bankAccount}
              variableSymbol={cislo!}
              amountLabel={formatPrice(amountHaler!)}
            />
            <p className="text-muted-foreground mt-4 text-sm leading-relaxed">
              Jakmile platba dorazí na účet, rovnou začneme objednávku
              zpracovávat. Stejné údaje najdeš i v e-mailu s potvrzením.
            </p>
          </>
        )}
        {paymentMethod === "bank_transfer" && !showQr && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Číslo účtu:{" "}
            <span className="text-foreground font-medium">
              {siteConfig.bankAccount}
            </span>
            {cislo && (
              <>
                <br />
                Variabilní symbol:{" "}
                <span className="text-foreground font-medium">{cislo}</span>
              </>
            )}
            <br />
            Přesnou částku k platbě ti pro jistotu ještě pošleme e-mailem
            spolu s potvrzením objednávky. Jakmile platba dorazí na účet,
            rovnou začneme objednávku zpracovávat.
          </p>
        )}
        {paymentMethod === "cash_on_delivery" && (
          <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
            Zaplatíš při převzetí zásilky kurýrovi nebo na poště. Objednávku
            začneme zpracovávat hned teď.
          </p>
        )}
      </div>

      <Button asChild size="lg" className="mt-8">
        <Link href="/hodinky">Zpět na výlohu</Link>
      </Button>
    </div>
  );
}
