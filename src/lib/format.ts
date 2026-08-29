/** Format a price stored in haléře (CZK * 100) as a localized CZK string. */
export function formatPrice(
  amountInHaler: number,
  currency: "CZK" = "CZK",
): string {
  return new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amountInHaler / 100);
}
