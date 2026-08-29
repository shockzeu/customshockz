"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

// Strong ease-out (quart) — the built-in easeOut is too weak to feel intentional.
const EASE_OUT_QUART = [0.23, 1, 0.32, 1] as const;

/** Fade + rise in when scrolled into view. Reusable across sections. */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: EASE_OUT_QUART, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
