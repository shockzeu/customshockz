import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

export const metadata = {
  title: "Kontakt | CustomShockz",
  description: "Napiš nám ohledně objednávky, zakázky na míru nebo čehokoliv jiného.",
};

export default function KontaktPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Reveal>
        <h1 className="font-heading text-3xl font-bold tracking-tight uppercase sm:text-4xl">
          Kontakt
        </h1>
        <p className="text-muted-foreground mt-3 text-base sm:text-lg">
          Máš dotaz k objednávce, zakázce na míru nebo cokoliv jiného?
          Ozvi se — obvykle odpovídáme do pár dnů.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 space-y-4">
        <a
          href={`mailto:${siteConfig.email}`}
          className="border-border/60 hover:border-ice-blue/50 flex items-center justify-between rounded-xl border p-5 transition-colors"
        >
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              E-mail
            </p>
            <p className="mt-1 font-medium">{siteConfig.email}</p>
          </div>
          <span className="text-ice-blue text-sm">Napsat →</span>
        </a>

        <a
          href={siteConfig.instagram}
          target="_blank"
          rel="noopener noreferrer"
          className="border-border/60 hover:border-ice-blue/50 flex items-center justify-between rounded-xl border p-5 transition-colors"
        >
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase">
              Instagram
            </p>
            <p className="mt-1 font-medium">{siteConfig.instagramHandle}</p>
          </div>
          <span className="text-ice-blue text-sm">Otevřít →</span>
        </a>
      </Reveal>

      <Reveal delay={0.18} className="mt-10">
        <Button asChild size="lg" className="min-w-44">
          <a href={`mailto:${siteConfig.email}`}>Napsat e-mail</a>
        </Button>
      </Reveal>
    </div>
  );
}
