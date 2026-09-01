import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Doprava a platba | CustomShockz",
  description: "Jak probíhá doprava a platba objednávek CustomShockz.",
};

export default function DopravaPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Doprava a platba
        </h1>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 space-y-8">
        <section>
          <h2 className="text-ice text-lg font-semibold">Doprava</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Protože je každý kus ručně upravovaný nebo vyráběný na
            zakázku, doba doručení se liší podle náročnosti provedení —
            u kousků skladem obvykle 3–7 pracovních dnů, u zakázek na
            míru se termín domlouváme individuálně po potvrzení
            objednávky. Zásilky posíláme balíkovou službou s možností
            sledování zásilky.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">Platba</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Platit můžeš bankovním převodem, nebo na dobírku při převzetí
            zásilky. Platební údaje k převodu (číslo účtu a variabilní
            symbol) ti pošleme e-mailem po odeslání objednávky.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
