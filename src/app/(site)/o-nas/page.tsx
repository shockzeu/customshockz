import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "O značce | CustomShockz",
  description: "Kdo stojí za CustomShockz a proč děláme custom G-Shock.",
};

export default function ONasPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          O značce
        </h1>
      </Reveal>

      <Reveal delay={0.08} className="mt-8 space-y-6">
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          CustomShockz vznikl z jednoduché myšlenky — klasický G-Shock je
          nezničitelný a nadčasový, ale nikdo nechce nosit to samé co
          všichni ostatní. Bereme ověřené hodinky Casio G-Shock a ručně je
          přetváříme v originál: iced-out lunety, vlastní kombinace barev,
          detaily, které z krabicového kusu udělají tvůj kus.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed sm:text-lg">
          Každý kousek sázíme a upravujeme ručně. Neděláme velké série —
          buď kupuješ z limitované kolekce, nebo si necháš postavit
          zakázku přesně na míru. Streetwear estetika, řemeslná preciznost.
        </p>
      </Reveal>

      <Reveal delay={0.16} className="border-border/60 mt-10 rounded-xl border p-6">
        <p className="text-sm">
          Sleduj novinky a hotové kousky na Instagramu{" "}
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ice-blue underline underline-offset-2"
          >
            {siteConfig.instagramHandle}
          </a>
          .
        </p>
      </Reveal>
    </div>
  );
}
