import QRCode from "qrcode";

import { siteConfig } from "@/config/site";
import { buildSpdString, czAccountToIban } from "@/lib/payment/qr-platba";

export const runtime = "nodejs";

const IBAN = czAccountToIban(siteConfig.bankAccount);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const castka = Number(searchParams.get("castka"));
  const vs = (searchParams.get("vs") ?? "").trim();

  if (!Number.isFinite(castka) || castka <= 0 || !/^\d{1,10}$/.test(vs)) {
    return new Response("Invalid parameters", { status: 400 });
  }

  const spd = buildSpdString({
    iban: IBAN,
    amountHaler: castka,
    variableSymbol: vs,
    message: `CustomShockz objednavka ${vs}`,
  });

  const png = await QRCode.toBuffer(spd, {
    type: "png",
    width: 260,
    margin: 1,
    color: { dark: "#0a0a0a", light: "#ffffff" },
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      // Deterministic for a given (castka, vs) pair — cache hard.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
