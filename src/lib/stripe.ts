import Stripe from "stripe";

// Lazy initialization of Stripe client to avoid build-time errors
let stripeInstance: Stripe | null = null;

function getStripeInstance(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error(
        "STRIPE_SECRET_KEY is not defined in environment variables",
      );
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-10-29.clover", // Latest stable version
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export a proxy that lazily initializes the Stripe client
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop: keyof Stripe) {
    return getStripeInstance()[prop];
  },
});

// Currency configuration
export const STRIPE_CURRENCY = "usd";

// Price configuration - these match your pricing tiers
export const PRICING_TIERS = {
  starter: {
    name: "Starter",
    priceUSD: 500,
    description: "Perfect for solopreneurs and new businesses",
  },
  business: {
    name: "Business",
    priceUSD: 850,
    description: "Ideal for growing SMEs",
  },
  professional: {
    name: "Professional",
    priceUSD: 2000,
    description: "Custom web applications with power",
  },
  enterprise: {
    name: "Enterprise",
    priceUSD: 4200,
    description: "E-commerce and SaaS platforms",
  },
} as const;

export type PricingTier = keyof typeof PRICING_TIERS;
