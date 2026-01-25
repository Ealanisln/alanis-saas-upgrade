import { PRICING_TIERS } from "@/lib/stripe";

// Valid amounts in cents derived from PRICING_TIERS
export const VALID_AMOUNTS_CENTS = Object.values(PRICING_TIERS).map(
  (tier) => tier.priceUSD * 100,
);

// Validation constants
export const MAX_SERVICE_NAME_LENGTH = 100;
export const MIN_AMOUNT_CENTS = 100; // $1.00 minimum
export const MAX_AMOUNT_CENTS = 10000000; // $100,000 maximum

/**
 * Validates and sanitizes the payment amount
 * @param amount - Amount in cents to validate
 * @returns true if amount is valid
 * @throws Error if amount is invalid
 */
export function validateAmount(amount: number): void {
  // Type check
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    throw new Error("Invalid amount: must be a valid number");
  }

  // Must be a positive integer (cents)
  if (!Number.isInteger(amount) || amount <= 0) {
    throw new Error("Invalid amount: must be a positive integer");
  }

  // Range validation
  if (amount < MIN_AMOUNT_CENTS) {
    throw new Error(`Invalid amount: minimum is ${MIN_AMOUNT_CENTS} cents`);
  }

  if (amount > MAX_AMOUNT_CENTS) {
    throw new Error(`Invalid amount: maximum is ${MAX_AMOUNT_CENTS} cents`);
  }

  // Validate against allowed pricing tiers
  if (!VALID_AMOUNTS_CENTS.includes(amount)) {
    throw new Error("Invalid amount: must match a valid pricing tier");
  }
}

/**
 * Sanitizes and validates the service name
 * @param name - Service name to sanitize
 * @returns Sanitized service name
 * @throws Error if name is invalid
 */
export function sanitizeServiceName(name: string): string {
  // Type check
  if (typeof name !== "string") {
    throw new Error("Invalid service name: must be a string");
  }

  // Trim whitespace
  const trimmed = name.trim();

  // Length validation
  if (trimmed.length === 0) {
    throw new Error("Invalid service name: cannot be empty");
  }

  if (trimmed.length > MAX_SERVICE_NAME_LENGTH) {
    throw new Error(
      `Invalid service name: maximum length is ${MAX_SERVICE_NAME_LENGTH} characters`,
    );
  }

  // Remove potentially dangerous characters (allow only alphanumeric, spaces, hyphens, underscores)
  const sanitized = trimmed.replace(/[^a-zA-Z0-9\s\-_]/g, "");

  if (sanitized.length === 0) {
    throw new Error("Invalid service name: contains no valid characters");
  }

  return sanitized;
}
