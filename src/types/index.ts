/** Shared domain types. Extended in later phases (Supabase / Stripe). */

export const PRODUCT_CATEGORIES = ["watches", "earrings", "bracelets"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];

/** Human labels for the product_category enum. */
export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  watches: "Hodinky",
  earrings: "Náušnice",
  bracelets: "Náramky",
};

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
  category: ProductCategory;
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
  category: ProductCategory;
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

// ---------- Cart / checkout ----------

export const PAYMENT_METHODS = ["bank_transfer", "cash_on_delivery"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Platba na účet (bankovní převod)",
  cash_on_delivery: "Dobírka",
};

export const ORDER_STATUSES = [
  "new",
  "processing",
  "shipped",
  "done",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  new: "Nová",
  processing: "Zpracovává se",
  shipped: "Odesláno",
  done: "Vyřízeno",
  cancelled: "Zrušeno",
};

/** One line in the shopping cart — a configured product ready to order. */
export type CartItem = {
  /** Unique per distinct configuration, so the same product with different parts gets its own line. */
  key: string;
  productSlug: string | null;
  name: string;
  imageUrl: string | null;
  unitPriceCzk: number; // haléře, base price + any part modifiers
  quantity: number;
  /** Human-readable selected parts, e.g. "Pouzdro: Černá". Empty for non-configurable products. */
  configSummary: string[];
};

export type OrderRow = {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  address_street: string;
  address_city: string;
  address_zip: string;
  payment_method: PaymentMethod;
  note: string | null;
  total_price: number; // haléře
  status: OrderStatus;
  created_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_name: string;
  config_summary: string | null;
  unit_price: number; // haléře
  quantity: number;
  created_at: string;
};
