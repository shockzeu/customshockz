"use client";

import Link from "next/link";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { Button } from "@/components/ui/button";

// Strong ease-out (quart) instead of the weak built-in easeOut.
const EASE_OUT_QUART = [0.23, 1, 0.32, 1] as const;

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
} satisfies Variants;

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: EASE_OUT_QUART },
  },
} satisfies Variants;

const itemReduced = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.3 } },
} satisfies Variants;

export function Hero() {
  const reduceMotion = useReducedMotion();
  const variant = reduceMotion ? itemReduced : item;

  return (
    <section className="relative overflow-hidden">
      {/* Ambient ice glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 0%, rgba(125,211,252,0.16), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-ice-blue/50 to-transparent"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 py-24 text-center sm:px-6 md:py-36 lg:px-8"
      >
        <motion.p
          variants={variant}
          className="text-ice-blue mb-5 text-xs font-medium tracking-[0.3em] uppercase"
        >
          Custom · Iced Out · Handmade
        </motion.p>

        <motion.h1
          variants={variant}
          className="font-heading max-w-4xl text-4xl font-extrabold tracking-tight uppercase sm:text-6xl md:text-7xl"
        >
          Tvůj G-Shock,{" "}
          <span className="text-ice-blue text-glow-ice">jako žádný jiný</span>
        </motion.h1>

        <motion.p
          variants={variant}
          className="text-muted-foreground mt-6 max-w-xl text-base sm:text-lg"
        >
          Ručně upravené, iced-out custom hodinky. Každý kus je originál —
          navržený tak, aby vyčníval z davu.
        </motion.p>

        <motion.div
          variants={variant}
          className="mt-10 flex flex-col gap-3 sm:flex-row"
        >
          <Button asChild size="lg" className="min-w-44">
            <Link href="/kolekce">Prohlédnout kolekci</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-44">
            <Link href="/na-miru">Zakázka na míru</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
