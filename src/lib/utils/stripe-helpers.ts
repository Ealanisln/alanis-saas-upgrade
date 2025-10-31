/**
 * Format amount for Stripe (convert to smallest currency unit)
 * For USD: $500 becomes 50000 cents
 * For zero-decimal currencies (JPY, KRW): amount stays the same
 *
 * @param amount - Amount in dollars (e.g., 500)
 * @param currency - Currency code (e.g., 'usd', 'mxn')
 * @returns Amount in cents for USD or smallest unit for other currencies
 */
export function formatAmountForStripe(
  amount: number,
  currency: string,
): number {
  const numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);

  // Check if currency uses decimals
  let zeroDecimalCurrency: boolean = true;
  for (const part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }

  // For zero-decimal currencies (JPY, KRW, etc), return as-is
  // For decimal currencies (USD, EUR, MXN), multiply by 100 to get cents
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}
