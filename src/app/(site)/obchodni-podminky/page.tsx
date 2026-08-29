import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Obchodní podmínky | CustomShockz",
  description: "Obchodní podmínky e-shopu CustomShockz.",
};

export default function ObchodniPodminkyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Obchodní podmínky
        </h1>
      </Reveal>

      <Reveal
        delay={0.08}
        className="text-muted-foreground mt-10 space-y-8 text-sm leading-relaxed sm:text-base"
      >
        <section>
          <h2 className="text-ice text-lg font-semibold">
            1. Provozovatel
          </h2>
          <p className="mt-2">
            [Doplnit: obchodní jméno / jméno a příjmení, IČO, sídlo,
            zápis v živnostenském/obchodním rejstříku]. Kontaktní e-mail:{" "}
            {siteConfig.email}.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            2. Uzavření kupní smlouvy
          </h2>
          <p className="mt-2">
            Odesláním objednávky přes web nebo potvrzením objednávky
            e-mailem (u zakázek na míru) dochází k uzavření kupní
            smlouvy mezi kupujícím a provozovatelem.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">3. Cena a platba</h2>
          <p className="mt-2">
            Ceny uvedené u produktů jsou konečné, včetně DPH je-li
            provozovatel plátcem. Platba probíhá způsoby uvedenými na
            stránce{" "}
            <a
              href="/doprava"
              className="text-ice-blue underline underline-offset-2"
            >
              Doprava a platba
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            4. Dodání zboží
          </h2>
          <p className="mt-2">
            Podmínky a orientační termíny dodání jsou uvedeny na stránce{" "}
            <a
              href="/doprava"
              className="text-ice-blue underline underline-offset-2"
            >
              Doprava a platba
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            5. Odstoupení od smlouvy a reklamace
          </h2>
          <p className="mt-2">
            Podmínky odstoupení od smlouvy a reklamačního řízení jsou
            uvedeny na stránce{" "}
            <a
              href="/reklamace"
              className="text-ice-blue underline underline-offset-2"
            >
              Reklamace
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            6. Ochrana osobních údajů
          </h2>
          <p className="mt-2">
            Zpracování osobních údajů se řídí zásadami uvedenými na
            stránce{" "}
            <a href="/gdpr" className="text-ice-blue underline underline-offset-2">
              Ochrana osobních údajů
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            7. Závěrečná ustanovení
          </h2>
          <p className="mt-2">
            Právní vztahy neupravené těmito podmínkami se řídí platnými
            právními předpisy České republiky, zejména občanským
            zákoníkem a zákonem o ochraně spotřebitele.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
