"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { stripe, STRIPE_CURRENCY, PRICING_TIERS } from "@/lib/stripe";

// Valid amounts in cents derived from PRICING_TIERS
const VALID_AMOUNTS_CENTS = Object.values(PRICING_TIERS).map(
  (tier) => tier.priceUSD * 100,
);

// Validation constants
const MAX_SERVICE_NAME_LENGTH = 100;
const MIN_AMOUNT_CENTS = 100; // $1.00 minimum
const MAX_AMOUNT_CENTS = 10000000; // $100,000 maximum

/**
 * Validates and sanitizes the payment amount
 * @param amount - Amount in cents to validate
 * @returns true if amount is valid
 * @throws Error if amount is invalid
 */
function validateAmount(amount: number): void {
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
function sanitizeServiceName(name: string): string {
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

/**
 * Creates a Stripe Checkout Session
 * @param amount - Amount in smallest currency unit (e.g., cents for USD)
 * @param name - Product/service name
 * @returns Redirects to Stripe Checkout
 */
export async function createCheckoutSession(
  amount: number,
  name: string,
  locale: string = "en",
): Promise<void> {
  // Validate and sanitize inputs
  validateAmount(amount);
  const sanitizedName = sanitizeServiceName(name);

  // Get the origin for redirect URLs
  const headersList = await headers();
  const origin = headersList.get("origin");

  if (!origin) {
    throw new Error("Origin header is missing");
  }

  // Create Stripe Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: STRIPE_CURRENCY,
          product_data: {
            name: sanitizedName,
            description: `${sanitizedName} - Web Development Service`,
          },
          unit_amount: amount, // Amount in cents (e.g., 50000 = $500.00)
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/${locale}/plans?canceled=true`,
    metadata: {
      service_name: sanitizedName,
      amount: amount.toString(),
    },
  });

  // Redirect to Stripe Checkout
  if (!session.url) {
    throw new Error("Checkout session URL is missing");
  }

  // Note: redirect() throws NEXT_REDIRECT which is expected behavior
  redirect(session.url);
}
