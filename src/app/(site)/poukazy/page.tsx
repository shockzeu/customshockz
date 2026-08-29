import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Dárkové poukazy | CustomShockz",
  description: "Dárkové poukazy CustomShockz — už brzy.",
};

export default function PoukazyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-24 text-center sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Dárkové poukazy
        </h1>
        <p className="text-muted-foreground mt-4 text-base sm:text-lg">
          Dárkové poukazy zatím nemáme spuštěné, ale chystáme je. Pokud
          chceš darovat CustomShockz teď hned, ozvi se nám přímo — poukaz
          na míru ti rádi domluvíme individuálně.
        </p>
      </Reveal>
      <Reveal delay={0.1} className="mt-8">
        <Button asChild size="lg" className="min-w-44">
          <a
            href={`mailto:${siteConfig.email}?subject=${encodeURIComponent("Dárkový poukaz")}`}
          >
            Napsat ohledně poukazu
          </a>
        </Button>
      </Reveal>
    </div>
  );
}
