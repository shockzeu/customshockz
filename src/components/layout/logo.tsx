import { cn } from "@/lib/utils";

/**
 * Text wordmark for CustomShockz.
 * Swap for an SVG/PNG lockup in a later phase when brand assets are ready.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-heading text-xl font-extrabold tracking-tight uppercase select-none",
        className,
      )}
    >
      Custom<span className="text-ice-blue text-glow-ice">Shockz</span>
    </span>
  );
}
