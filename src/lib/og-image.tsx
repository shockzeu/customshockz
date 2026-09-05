import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { join, dirname } from "node:path";

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = "image/png";

/**
 * Locate public/logo.png relative to the project root. process.cwd() is
 * the documented, officially-supported way to do this (and is correct
 * on Vercel) — the import.meta.url fallback only exists because some
 * local dev sandboxes launch the dev server with an unexpected cwd.
 */
function resolveLogoPath() {
  const fromCwd = join(process.cwd(), "public/logo.png");
  if (existsSync(fromCwd)) return fromCwd;

  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return join(moduleDir, "../../public/logo.png");
}

const logoDataPromise = readFile(resolveLogoPath(), "base64").then(
  (data) => `data:image/png;base64,${data}`,
);

/**
 * Shared "Ice & Onyx" brand card used as the fallback share-image for
 * every route — swap for a per-product photo once real catalog photos
 * exist (see opengraph-image.tsx under produkt/[slug] for that hook).
 */
export async function BrandCard({ tagline }: { tagline?: string }) {
  const logoSrc = await logoDataPromise;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#0A0A0B",
        backgroundImage:
          "radial-gradient(120% 120% at 50% 30%, rgba(125,211,252,0.16), transparent 60%)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logoSrc} width={150} height={150} style={{ marginBottom: 36 }} />
      <div
        style={{
          display: "flex",
          fontSize: 100,
          fontWeight: 800,
          letterSpacing: -2,
        }}
      >
        <span style={{ color: "#F5F5F7" }}>CUSTOM</span>
        <span style={{ color: "#7DD3FC", marginLeft: 18 }}>SHOCKZ</span>
      </div>
      <div
        style={{
          marginTop: 28,
          fontSize: 28,
          color: "#9A9AA3",
          letterSpacing: 6,
        }}
      >
        {tagline ?? "ICED OUT CUSTOM G-SHOCK"}
      </div>
    </div>
  );
}
