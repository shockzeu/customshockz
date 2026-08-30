import Image from "next/image";

import { cn } from "@/lib/utils";

/** The CS monogram mark — white artwork on a transparent background. */
export function LogoMark({
  className,
  spin = false,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <Image
      src="/logo.png"
      alt=""
      width={512}
      height={512}
      priority
      className={cn("size-9 shrink-0", spin && "animate-logo-spin", className)}
    />
  );
}

/** Full lockup: CS mark + wordmark. */
export function Logo({
  className,
  spin = true,
}: {
  className?: string;
  spin?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-2.5 select-none", className)}>
      <LogoMark spin={spin} />
      <span className="font-heading text-xl font-extrabold tracking-tight uppercase">
        Custom<span className="text-ice-blue text-glow-ice">Shockz</span>
      </span>
    </span>
  );
}
