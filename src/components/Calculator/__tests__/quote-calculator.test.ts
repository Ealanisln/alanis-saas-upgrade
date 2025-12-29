import { describe, it, expect, beforeEach } from "vitest";
import { QuoteCalculator, quoteCalculator } from "../quote-calculator";
import type { SelectedService } from "@/types/calculator/service-calculator.types";

describe("QuoteCalculator", () => {
  let calculator: QuoteCalculator;

  beforeEach(() => {
    calculator = new QuoteCalculator();
  });

  // Test data based on service-config.ts
  const testServices: Record<string, SelectedService> = {
    landing: { categoryId: "development", optionId: "landing", quantity: 1 },
    ecommerce: {
      categoryId: "development",
      optionId: "ecommerce",
      quantity: 1,
    },
    corporate: {
      categoryId: "development",
      optionId: "corporate",
      quantity: 1,
    },
    webapp: { categoryId: "development", optionId: "webapp", quantity: 1 },
    wireframes: { categoryId: "design", optionId: "wireframes", quantity: 1 },
    mockups: { categoryId: "design", optionId: "mockups", quantity: 1 },
    seo: { categoryId: "marketing", optionId: "seo", quantity: 1 },
  };

  describe("calculateQuote - empty services", () => {
    it("returns zero values for empty services array", () => {
      const result = calculator.calculateQuote([], "pyme", "normal");

      expect(result.subtotal).toBe(0);
      expect(result.discounts).toBe(0);
      expect(result.taxes).toBe(0);
      expect(result.total).toBe(0);
      expect(result.totalHours).toBe(0);
      expect(result.estimatedDelivery).toBe(0);
    });

    it("returns default multipliers for empty services", () => {
      const result = calculator.calculateQuote([], "pyme", "normal");

      expect(result.urgencyMultiplier).toBe(1);
      expect(result.discountRate).toBe(0);
    });
  });

  describe("calculateQuote - single service", () => {
    it("calculates correct subtotal for landing page", () => {
      // Landing: basePrice=1500 * priceMultiplier=1 * quantity=1 = 1500
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(1500);
      expect(result.totalHours).toBe(40); // estimatedHours for landing
    });

    it("calculates correct subtotal for e-commerce", () => {
      // E-commerce: basePrice=1500 * priceMultiplier=4 * quantity=1 = 6000
      const result = calculator.calculateQuote(
        [testServices.ecommerce],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(6000);
      expect(result.totalHours).toBe(200); // estimatedHours for ecommerce
    });

    it("calculates correct subtotal for webapp", () => {
      // Webapp: basePrice=1500 * priceMultiplier=6 * quantity=1 = 9000
      const result = calculator.calculateQuote(
        [testServices.webapp],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(9000);
      expect(result.totalHours).toBe(300);
    });

    it("applies 16% tax correctly", () => {
      // Landing: 1500 subtotal, 16% tax = 240
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.taxes).toBe(1500 * 0.16); // 240
    });

    it("calculates total correctly (subtotal + tax)", () => {
      // Landing: 1500 + 240 (16% tax) = 1740
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.total).toBe(1500 + 1500 * 0.16); // 1740
    });
  });

  describe("calculateQuote - multiple services", () => {
    it("sums subtotals from multiple services", () => {
      // Landing (1500) + Corporate (1500 * 2.5 = 3750) = 5250
      const result = calculator.calculateQuote(
        [testServices.landing, testServices.corporate],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(1500 + 3750);
    });

    it("sums hours from multiple services", () => {
      // Landing (40) + Corporate (100) = 140
      const result = calculator.calculateQuote(
        [testServices.landing, testServices.corporate],
        "pyme",
        "normal",
      );

      expect(result.totalHours).toBe(40 + 100);
    });

    it("handles services from different categories", () => {
      // Development: Landing (1500) + Design: Wireframes (800 * 1 = 800) = 2300
      const result = calculator.calculateQuote(
        [testServices.landing, testServices.wireframes],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(1500 + 800);
      expect(result.totalHours).toBe(40 + 20); // landing 40 + wireframes 20
    });

    it("handles quantity > 1", () => {
      // Wireframes with quantity 2: 800 * 1 * 2 = 1600
      const wireframesX2: SelectedService = {
        categoryId: "design",
        optionId: "wireframes",
        quantity: 2,
      };
      const result = calculator.calculateQuote(
        [wireframesX2],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(1600);
      expect(result.totalHours).toBe(40); // 20 * 2
    });
  });

  describe("discount rates", () => {
    it("returns 15% discount for startup", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "startup",
        "normal",
      );

      expect(result.discountRate).toBe(0.15);
      expect(result.discounts).toBe(1500 * 0.15); // 225
    });

    it("returns 0% discount for pyme (default)", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.discountRate).toBe(0);
      expect(result.discounts).toBe(0);
    });

    it("returns -10% (premium) for enterprise", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "enterprise",
        "normal",
      );

      expect(result.discountRate).toBe(-0.1);
      // Negative discount means premium - discounts will be negative
      expect(result.discounts).toBe(1500 * -0.1); // -150
    });
  });

  describe("urgency multipliers", () => {
    it("returns 1.0 for normal urgency", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.urgencyMultiplier).toBe(1.0);
    });

    it("returns 1.5 for express urgency", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "express",
      );

      expect(result.urgencyMultiplier).toBe(1.5);
    });

    it("returns 2.0 for urgent urgency", () => {
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "urgent",
      );

      expect(result.urgencyMultiplier).toBe(2.0);
    });
  });

  describe("combined calculations", () => {
    it("applies startup discount then calculates total", () => {
      // Landing: 1500, 15% discount = 1275, 16% tax on 1275 = 204
      // Total = 1275 + 204 = 1479
      const result = calculator.calculateQuote(
        [testServices.landing],
        "startup",
        "normal",
      );

      const expectedAfterDiscount = 1500 - 1500 * 0.15; // 1275
      const expectedTax = expectedAfterDiscount * 0.16; // 204
      const expectedTotal = expectedAfterDiscount + expectedTax; // 1479

      expect(result.total).toBeCloseTo(expectedTotal, 2);
    });

    it("applies enterprise premium then calculates total", () => {
      // Landing: 1500, -10% discount (premium) = 1650, 16% tax on 1650 = 264
      // Total = 1650 + 264 = 1914
      const result = calculator.calculateQuote(
        [testServices.landing],
        "enterprise",
        "normal",
      );

      const expectedAfterDiscount = 1500 - 1500 * -0.1; // 1650
      const expectedTax = expectedAfterDiscount * 0.16; // 264
      const expectedTotal = expectedAfterDiscount + expectedTax; // 1914

      expect(result.total).toBeCloseTo(expectedTotal, 2);
    });

    it("applies urgency multiplier after discount", () => {
      // Landing: 1500, normal pyme, express (1.5x)
      // = 1500 * 1.5 = 2250, + 16% tax = 2250 + 360 = 2610
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "express",
      );

      const expectedWithUrgency = 1500 * 1.5; // 2250
      const expectedTax = expectedWithUrgency * 0.16; // 360
      const expectedTotal = expectedWithUrgency + expectedTax; // 2610

      expect(result.total).toBeCloseTo(expectedTotal, 2);
    });

    it("applies discount, urgency, and tax in correct order", () => {
      // Landing: 1500, startup 15% discount, express 1.5x
      // = (1500 - 225) * 1.5 = 1275 * 1.5 = 1912.5, + 16% tax = 2218.5
      const result = calculator.calculateQuote(
        [testServices.landing],
        "startup",
        "express",
      );

      const subtotal = 1500;
      const discount = subtotal * 0.15; // 225
      const afterDiscount = subtotal - discount; // 1275
      const withUrgency = afterDiscount * 1.5; // 1912.5
      const tax = withUrgency * 0.16; // 306
      const expectedTotal = withUrgency + tax; // 2218.5

      expect(result.total).toBeCloseTo(expectedTotal, 2);
    });
  });

  describe("delivery time calculation", () => {
    it("calculates base weeks from hours (40 hrs = 1 week)", () => {
      // Landing: 40 hours = 1 week
      const result = calculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.estimatedDelivery).toBe(1);
    });

    it("rounds up to nearest week", () => {
      // Corporate: 100 hours = 2.5 weeks, rounds to 3
      const result = calculator.calculateQuote(
        [testServices.corporate],
        "pyme",
        "normal",
      );

      expect(result.estimatedDelivery).toBe(3); // ceil(100/40) = 3
    });

    it("applies 0.5 multiplier for urgent delivery", () => {
      // E-commerce: 200 hours = 5 weeks, urgent = 2.5 weeks, rounds to 3
      const result = calculator.calculateQuote(
        [testServices.ecommerce],
        "pyme",
        "urgent",
      );

      const baseWeeks = Math.ceil(200 / 40); // 5
      const expectedDelivery = Math.max(1, Math.ceil(baseWeeks * 0.5)); // ceil(2.5) = 3

      expect(result.estimatedDelivery).toBe(expectedDelivery);
    });

    it("applies 0.7 multiplier for express delivery", () => {
      // E-commerce: 200 hours = 5 weeks, express = 3.5 weeks, rounds to 4
      const result = calculator.calculateQuote(
        [testServices.ecommerce],
        "pyme",
        "express",
      );

      const baseWeeks = Math.ceil(200 / 40); // 5
      const expectedDelivery = Math.max(1, Math.ceil(baseWeeks * 0.7)); // ceil(3.5) = 4

      expect(result.estimatedDelivery).toBe(expectedDelivery);
    });

    it("returns minimum 1 week", () => {
      // Even with short project and urgent, minimum is 1 week
      const shortService: SelectedService = {
        categoryId: "design",
        optionId: "wireframes", // 20 hours
        quantity: 1,
      };
      const result = calculator.calculateQuote(
        [shortService],
        "pyme",
        "urgent",
      );

      // 20 hours = 1 week base, urgent 0.5 = 0.5, but min is 1
      expect(result.estimatedDelivery).toBe(1);
    });
  });

  describe("formatting utilities", () => {
    it("formats currency in MXN format", () => {
      const formatted = calculator.formatCurrency(1500);

      // MXN format should include currency symbol and proper formatting
      expect(formatted).toMatch(/\$|MXN/);
      expect(formatted).toContain("1");
      expect(formatted).toContain("500");
    });

    it("formats percentage correctly", () => {
      const formatted = calculator.formatPercentage(0.15);

      expect(formatted).toContain("15");
      expect(formatted).toContain("%");
    });

    it("handles negative rates for formatting (uses absolute value)", () => {
      const formatted = calculator.formatPercentage(-0.1);

      // Should show 10% (absolute value)
      expect(formatted).toContain("10");
      expect(formatted).toContain("%");
      expect(formatted).not.toContain("-");
    });

    it("formats zero percentage", () => {
      const formatted = calculator.formatPercentage(0);

      expect(formatted).toContain("0");
      expect(formatted).toContain("%");
    });

    it("formats large currency values", () => {
      const formatted = calculator.formatCurrency(100000);

      expect(formatted).toMatch(/100[,.]?000/);
    });
  });

  describe("singleton export", () => {
    it("exports a pre-instantiated calculator", () => {
      expect(quoteCalculator).toBeInstanceOf(QuoteCalculator);
    });

    it("singleton works correctly", () => {
      const result = quoteCalculator.calculateQuote(
        [testServices.landing],
        "pyme",
        "normal",
      );

      expect(result.subtotal).toBe(1500);
    });
  });
});
