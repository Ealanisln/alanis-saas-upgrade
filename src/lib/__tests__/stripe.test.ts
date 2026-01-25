import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { PRICING_TIERS, STRIPE_CURRENCY, type PricingTier } from "../stripe";

describe("stripe configuration", () => {
  describe("STRIPE_CURRENCY", () => {
    it("should be set to USD", () => {
      expect(STRIPE_CURRENCY).toBe("usd");
    });
  });

  describe("PRICING_TIERS", () => {
    it("should have all expected tier keys", () => {
      const expectedTiers: PricingTier[] = [
        "starter",
        "business",
        "professional",
        "enterprise",
      ];

      expectedTiers.forEach((tier) => {
        expect(PRICING_TIERS).toHaveProperty(tier);
      });
    });

    it("should have correct structure for each tier", () => {
      Object.values(PRICING_TIERS).forEach((tier) => {
        expect(tier).toHaveProperty("name");
        expect(tier).toHaveProperty("priceUSD");
        expect(tier).toHaveProperty("description");
        expect(typeof tier.name).toBe("string");
        expect(typeof tier.priceUSD).toBe("number");
        expect(typeof tier.description).toBe("string");
      });
    });

    describe("Starter tier", () => {
      it("should have correct name", () => {
        expect(PRICING_TIERS.starter.name).toBe("Starter");
      });

      it("should have price of $500", () => {
        expect(PRICING_TIERS.starter.priceUSD).toBe(500);
      });

      it("should have a description", () => {
        expect(PRICING_TIERS.starter.description).toBeTruthy();
        expect(PRICING_TIERS.starter.description.length).toBeGreaterThan(0);
      });
    });

    describe("Business tier", () => {
      it("should have correct name", () => {
        expect(PRICING_TIERS.business.name).toBe("Business");
      });

      it("should have price of $850", () => {
        expect(PRICING_TIERS.business.priceUSD).toBe(850);
      });

      it("should have a description", () => {
        expect(PRICING_TIERS.business.description).toBeTruthy();
      });
    });

    describe("Professional tier", () => {
      it("should have correct name", () => {
        expect(PRICING_TIERS.professional.name).toBe("Professional");
      });

      it("should have price of $2000", () => {
        expect(PRICING_TIERS.professional.priceUSD).toBe(2000);
      });

      it("should have a description", () => {
        expect(PRICING_TIERS.professional.description).toBeTruthy();
      });
    });

    describe("Enterprise tier", () => {
      it("should have correct name", () => {
        expect(PRICING_TIERS.enterprise.name).toBe("Enterprise");
      });

      it("should have price of $4200", () => {
        expect(PRICING_TIERS.enterprise.priceUSD).toBe(4200);
      });

      it("should have a description", () => {
        expect(PRICING_TIERS.enterprise.description).toBeTruthy();
      });
    });

    describe("pricing order", () => {
      it("should have prices in ascending order", () => {
        expect(PRICING_TIERS.starter.priceUSD).toBeLessThan(
          PRICING_TIERS.business.priceUSD,
        );
        expect(PRICING_TIERS.business.priceUSD).toBeLessThan(
          PRICING_TIERS.professional.priceUSD,
        );
        expect(PRICING_TIERS.professional.priceUSD).toBeLessThan(
          PRICING_TIERS.enterprise.priceUSD,
        );
      });

      it("should have all positive prices", () => {
        Object.values(PRICING_TIERS).forEach((tier) => {
          expect(tier.priceUSD).toBeGreaterThan(0);
        });
      });
    });
  });

  describe("PricingTier type", () => {
    it("should allow valid tier keys", () => {
      // Type assertion test - if this compiles, the types are correct
      const validTiers: PricingTier[] = [
        "starter",
        "business",
        "professional",
        "enterprise",
      ];

      expect(validTiers).toHaveLength(4);
    });
  });
});

describe("stripe client initialization", () => {
  const originalEnv = process.env.STRIPE_SECRET_KEY;

  beforeEach(() => {
    // Reset modules to get fresh stripe instance
    vi.resetModules();
  });

  afterEach(() => {
    // Restore original environment
    if (originalEnv !== undefined) {
      process.env.STRIPE_SECRET_KEY = originalEnv;
    } else {
      delete process.env.STRIPE_SECRET_KEY;
    }
    vi.resetModules();
  });

  describe("getStripeInstance via proxy", () => {
    it("should throw error when STRIPE_SECRET_KEY is not defined", async () => {
      // Remove the secret key
      delete process.env.STRIPE_SECRET_KEY;

      // Import fresh module
      const { stripe } = await import("../stripe");

      // Accessing any property on the proxy should trigger getStripeInstance
      expect(() => stripe.customers).toThrow(
        "STRIPE_SECRET_KEY is not defined in environment variables",
      );
    });

    it("should initialize Stripe client when STRIPE_SECRET_KEY is defined", async () => {
      // Set the secret key
      process.env.STRIPE_SECRET_KEY = "sk_test_mock_key_12345";

      // Import fresh module
      const { stripe } = await import("../stripe");

      // Accessing the proxy should work without throwing
      expect(() => stripe.customers).not.toThrow();
    });

    it("should use singleton pattern for stripe instance", async () => {
      process.env.STRIPE_SECRET_KEY = "sk_test_singleton_test";

      // Import fresh module
      const { stripe } = await import("../stripe");

      // Access different properties - should use same instance
      const customers1 = stripe.customers;
      const customers2 = stripe.customers;
      const paymentIntents = stripe.paymentIntents;

      // All should be defined (singleton is reused)
      expect(customers1).toBeDefined();
      expect(customers2).toBeDefined();
      expect(paymentIntents).toBeDefined();

      // Same property access returns same reference
      expect(customers1).toBe(customers2);
    });

    it("should proxy property access to stripe instance", async () => {
      process.env.STRIPE_SECRET_KEY = "sk_test_proxy_test";

      const { stripe } = await import("../stripe");

      // Common Stripe resources should be accessible through proxy
      expect(stripe.customers).toBeDefined();
      expect(stripe.paymentIntents).toBeDefined();
      expect(stripe.checkout).toBeDefined();
      expect(stripe.webhooks).toBeDefined();
    });
  });

  describe("error handling", () => {
    it("should provide helpful error message for missing key", async () => {
      delete process.env.STRIPE_SECRET_KEY;

      const { stripe } = await import("../stripe");

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        stripe.customers;
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toContain("STRIPE_SECRET_KEY");
        expect((error as Error).message).toContain("environment variables");
      }
    });

    it("should throw on first property access, not on import", async () => {
      delete process.env.STRIPE_SECRET_KEY;

      // Import should succeed (lazy initialization)
      const importResult = await import("../stripe");
      expect(importResult).toBeDefined();
      expect(importResult.stripe).toBeDefined();

      // Error only thrown when accessing properties
      expect(() => importResult.stripe.customers).toThrow();
    });
  });
});
