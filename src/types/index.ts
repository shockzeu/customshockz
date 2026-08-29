/** Shared domain types. Extended in later phases (Supabase / Stripe). */

/** Storefront-facing product shape, derived from `ProductRow`. */
export type Product = {
  id: string;
  slug: string;
  name: string;
  /** Price in the smallest currency unit (haléře) for Stripe compatibility. */
  priceCzk: number;
  currency: "CZK";
  description: string;
  imageUrl: string | null;
  inStock: boolean;
};

export type Collection = {
  id: string;
  slug: string;
  title: string;
  description: string;
};

// ---------- Database rows (Supabase, Phase 2) ----------

export const PART_TYPES = ["case", "dial", "strap", "bezel-iced"] as const;
export type PartType = (typeof PART_TYPES)[number];

/** Human labels for the part_type enum. */
export const PART_TYPE_LABELS: Record<PartType, string> = {
  case: "Pouzdro (case)",
  dial: "Číselník (dial)",
  strap: "Řemínek (strap)",
  "bezel-iced": "Iced-out luneta (bezel)",
};

export type ProductRow = {
  id: string;
  name: string;
  slug: string | null;
  description: string | null;
  image_url: string | null;
  base_price: number; // haléře (CZK * 100)
  in_stock: boolean;
  is_active: boolean;
  created_at: string;
};

export type PartVariantRow = {
  id: string;
  part_type: PartType;
  label: string;
  hex_color: string | null;
  image_url: string | null;
  price_modifier: number; // haléře (CZK * 100), can be negative
  is_active: boolean;
  created_at: string;
};
