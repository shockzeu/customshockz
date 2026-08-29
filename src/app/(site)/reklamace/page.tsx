import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Reklamace | CustomShockz",
  description: "Jak probíhá reklamace a odstoupení od smlouvy u CustomShockz.",
};

export default function ReklamacePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Reklamace
        </h1>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 space-y-8">
        <section>
          <h2 className="text-ice text-lg font-semibold">Záruka</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            Na veškeré zboží se vztahuje zákonná záruční doba 24 měsíců
            od převzetí. V případě vady nás kontaktuj na{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-ice-blue underline underline-offset-2"
            >
              {siteConfig.email}
            </a>{" "}
            s popisem problému a fotkami — reklamaci vyřídíme co
            nejrychleji.
          </p>
        </section>

        <section>
          <h2 className="text-ice text-lg font-semibold">
            Odstoupení od smlouvy
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-relaxed sm:text-base">
            U hodinek z běžné kolekce máš jako spotřebitel právo
            odstoupit od smlouvy do 14 dnů od převzetí zboží bez udání
            důvodu. U zboží upraveného podle tvého přání nebo pro tvou
            osobu (zakázky na míru, individuální konfigurace dílů) se
            toto právo dle zákona neuplatňuje, jelikož jde o zboží
            vyrobené na míru.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
