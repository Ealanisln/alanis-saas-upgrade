import { describe, it, expect } from "vitest";
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
