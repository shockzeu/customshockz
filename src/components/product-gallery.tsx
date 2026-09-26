"use client";

import Image from "next/image";

import { cn } from "@/lib/utils";
import { useProductImage } from "@/components/product-image-context";

type Props = {
  images: string[];
  alt: string;
};

/**
 * Product photo(s): a big preview plus a thumbnail row when there's more than one.
 * The big photo is shared state, so picking a color below can switch it too.
 */
export function ProductGallery({ images, alt }: Props) {
  const { activeUrl, setActiveUrl } = useProductImage();
  const current = activeUrl ?? images[0];

  return (
    <div>
      <div className="from-onyx-surface to-onyx relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br">
        {current ? (
          // No `key` on purpose: swapping `src` on the same <img> keeps the old
          // photo on screen until the new one has loaded, instead of flashing empty.
          <Image
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
              onClick={() => setActiveUrl(url)}
              aria-label={`Fotka ${i + 1}`}
              className={cn(
                "relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                url === current
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
