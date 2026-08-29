import { siteConfig } from "@/config/site";
import { getPartVariantsByType } from "@/lib/data/parts";
import { Button } from "@/components/ui/button";
import { Configurator } from "@/components/configurator";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Zakázka na míru | CustomShockz",
  description: "Postav si vlastní custom G-Shock — vyber si pouzdro, číselník, řemínek a lunetu.",
};

export default async function NaMiruPage() {
  const partsByType = await getPartVariantsByType();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Postav si vlastní kus
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-base sm:text-lg">
          Vyber si pouzdro, číselník, řemínek a lunetu podle sebe — cena
          se počítá rovnou. Přidej si to do košíku a dokonči objednávku.
        </p>
      </Reveal>

      <div className="mt-10">
        <Configurator
          productSlug={null}
          productName="Zakázka na míru"
          imageUrl={null}
          basePriceCzk={0}
          partsByType={partsByType}
          inStock
        />
      </div>

      <Reveal delay={0.1} className="border-border/60 mt-14 rounded-xl border p-6">
        <h2 className="text-lg font-semibold">
          Nevidíš tu, co chceš?
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          Pokud máš speciální přání, které tu v konfigurátoru nenajdeš
          (jiná barva, gravírování, netradiční kombinace), napiš nám
          přímo — domluvíme se na řešení individuálně.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="min-w-44">
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Speciální přání — zakázka na míru")}`}
            >
              Napsat e-mail
            </a>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-44">
            <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
              Napsat na Instagram
            </a>
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
