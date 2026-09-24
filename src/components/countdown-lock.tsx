"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  targetIso: string;
  /** Fixed 1:1 fill (for the IG banner) instead of a full viewport height. */
  square?: boolean;
};

function getRemaining(targetMs: number) {
  const totalSeconds = Math.max(0, Math.floor((targetMs - Date.now()) / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Full-takeover "coming soon" countdown, reused for both the site lock and the IG banner. */
export function CountdownLock({ targetIso, square = false }: Props) {
  const targetMs = new Date(targetIso).getTime();
  // Starts `null` so the very first render is identical on server and
  // client (Date.now() would otherwise differ by the hydration delay and
  // trigger a hydration mismatch) — filled in once mounted.
  const [remaining, setRemaining] = useState<ReturnType<
    typeof getRemaining
  > | null>(null);

  useEffect(() => {
    setRemaining(getRemaining(targetMs));
    const id = setInterval(() => setRemaining(getRemaining(targetMs)), 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  const units = [
    { label: "Dní", value: remaining?.days },
    { label: "Hodin", value: remaining?.hours },
    { label: "Minut", value: remaining?.minutes },
    { label: "Vteřin", value: remaining?.seconds },
  ];

  return (
    <div
      className={cn(
        "bg-onyx relative flex flex-col items-center justify-center overflow-hidden px-6 text-center",
        square ? "h-full w-full" : "min-h-screen",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="bg-ice-blue/20 size-[60vmin] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={72}
          height={72}
          className="opacity-90"
          priority
        />

        <div className="space-y-3">
          <p className="text-ice-blue text-xs font-semibold tracking-[0.3em] uppercase">
            Chystáme něco ledového
          </p>
          <h1 className="font-heading text-foreground text-4xl font-black tracking-tight uppercase sm:text-6xl">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground mx-auto max-w-md text-sm sm:text-base">
            Nový katalog šperků a vylepšený web se spouští už za chvíli.
          </p>
        </div>

        <div className="flex gap-3 sm:gap-4">
          {units.map((u) => (
            <div
              key={u.label}
              className="border-ice-blue/30 bg-onyx-surface flex w-16 flex-col items-center rounded-xl border py-3 sm:w-20 sm:py-4"
            >
              <span className="font-heading text-ice-blue text-2xl font-bold sm:text-4xl">
                {u.value === undefined ? "--" : String(u.value).padStart(2, "0")}
              </span>
              <span className="text-muted-foreground mt-1 text-[10px] tracking-wider uppercase sm:text-xs">
                {u.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
          {siteConfig.instagramHandle}
        </p>
      </div>
    </div>
  );
}
