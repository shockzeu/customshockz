"use client";

import { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

type Props = {
  images: string[];
  alt: string;
};

/** Product photo(s): a big preview plus a thumbnail row when there's more than one. */
export function ProductGallery({ images, alt }: Props) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div>
      <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br">
        {current ? (
          <Image
            key={current}
            src={current}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(120% 120% at 30% 20%, rgba(125,211,252,0.28), transparent 55%)",
            }}
            aria-hidden
          />
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {images.map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Fotka ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                i === active
                  ? "border-ice-blue"
                  : "border-border/60 hover:border-border",
              )}
            >
              <Image src={url} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
