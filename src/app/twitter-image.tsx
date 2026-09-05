import { ImageResponse } from "next/og";

import { BrandCard, ogImageSize, ogImageContentType } from "@/lib/og-image";

export const alt = "CustomShockz — Iced Out Custom G-Shock";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default async function Image() {
  return new ImageResponse(await BrandCard({}), size);
}
