import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Ochrana osobních údajů | CustomShockz",
  description: "Jak CustomShockz zpracovává osobní údaje zákazníků.",
};

export default function GdprPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Ochrana osobních údajů
        </h1>
      </Reveal>

      <Reveal
        delay={0.08}
        className="text-muted-foreground mt-10 space-y-8 text-sm leading-relaxed sm:text-base"
      >
        <section>
          <h2 className="text-ice text-lg font-semibold">Správce údajů</h2>
          <p className="mt-2">
            Správcem osobních údajů je [Doplnit: obchodní jméno / jméno a
            příjmení, IČO, sídlo]. V otázkách ochrany osobních údajů nás
            kontaktuj na {siteConfig.email}.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            Jaké údaje zpracováváme
          </h2>
          <p className="mt-2">
            Při objednávce zpracováváme jméno, kontaktní e-mail, adresu
            pro doručení a údaje o objednávce. Platební údaje
            nezpracováváme ani neukládáme sami — platby zajišťuje externí
            platební brána.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">Proč</h2>
          <p className="mt-2">
            Údaje zpracováváme za účelem vyřízení objednávky, komunikace
            ohledně zakázky na míru a plnění zákonných povinností
            (např. účetnictví).
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            Kdo má k údajům přístup
          </h2>
          <p className="mt-2">
            Údaje jsou uloženy u poskytovatelů technické infrastruktury
            (hosting a databáze), kteří je zpracovávají výhradně jako
            zpracovatelé podle našich pokynů. Údaje nikomu neprodáváme.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">Tvá práva</h2>
          <p className="mt-2">
            Máš právo na přístup ke svým údajům, jejich opravu, výmaz
            nebo omezení zpracování. Pro uplatnění kteréhokoliv z těchto
            práv nás kontaktuj na {siteConfig.email}.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
