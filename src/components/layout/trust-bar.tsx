const TRUST_ITEMS = [
  "Ruční výroba na zakázku",
  "Doprava po ČR a SK",
  "Bezpečná platba",
  "Každý kus originál",
];

const REPEAT_COUNT = 8;

/** Slow, continuous ticker of trust messages, sat above the sticky nav. */
export function TrustBar() {
  return (
    <div className="border-border/60 bg-onyx-surface overflow-hidden border-b">
      <div className="animate-marquee flex w-max">
        {Array.from({ length: REPEAT_COUNT }, (_, i) => (
          <div
            key={i}
            aria-hidden={i > 0}
            className="flex shrink-0 items-center gap-8 py-2.5 pr-8"
          >
            {TRUST_ITEMS.map((item) => (
              <span
                key={item}
                className="text-muted-foreground flex items-center gap-8 text-xs font-medium tracking-[0.2em] whitespace-nowrap uppercase"
              >
                {item}
                <span className="text-ice-blue">·</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
