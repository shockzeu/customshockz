import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";
import { getActiveProducts } from "@/lib/data/products";

const STATIC_ROUTES = [
  "",
  "/hodinky",
  "/sperky",
  "/na-miru",
  "/o-nas",
  "/kontakt",
  "/doprava",
  "/poukazy",
  "/reklamace",
  "/obchodni-podminky",
  "/gdpr",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getActiveProducts();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));

  const productEntries: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteConfig.url}/produkt/${p.slug}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
