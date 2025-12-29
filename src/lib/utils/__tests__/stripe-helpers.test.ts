import { describe, it, expect } from "vitest";
import { formatAmountForStripe } from "../stripe-helpers";

describe("stripe-helpers", () => {
  describe("formatAmountForStripe", () => {
    describe("decimal currencies (USD, EUR, MXN)", () => {
      it("converts USD dollars to cents", () => {
        // $500 should become 50000 cents
        const result = formatAmountForStripe(500, "usd");
        expect(result).toBe(50000);
      });

      it("converts EUR euros to cents", () => {
        // €100 should become 10000 cents
        const result = formatAmountForStripe(100, "eur");
        expect(result).toBe(10000);
      });

      it("converts MXN pesos to centavos", () => {
        // 1000 MXN should become 100000 centavos
        const result = formatAmountForStripe(1000, "mxn");
        expect(result).toBe(100000);
      });

      it("handles decimal amounts correctly", () => {
        // $19.99 should become 1999 cents
        const result = formatAmountForStripe(19.99, "usd");
        expect(result).toBe(1999);
      });

      it("rounds to nearest cent for floating point precision", () => {
        // $1.005 rounds to 100 due to floating point: 1.005 * 100 = 100.49999...
        // This is expected JavaScript floating point behavior
        const result = formatAmountForStripe(1.005, "usd");
        expect(result).toBe(100);

        // $1.006 rounds to 101 as expected
        const result2 = formatAmountForStripe(1.006, "usd");
        expect(result2).toBe(101);
      });

      it("handles zero amount", () => {
        const result = formatAmountForStripe(0, "usd");
        expect(result).toBe(0);
      });

      it("handles large amounts", () => {
        // $10,000 should become 1,000,000 cents
        const result = formatAmountForStripe(10000, "usd");
        expect(result).toBe(1000000);
      });

      it("handles GBP (British Pounds)", () => {
        // £250 should become 25000 pence
        const result = formatAmountForStripe(250, "gbp");
        expect(result).toBe(25000);
      });
    });

    describe("zero-decimal currencies (JPY, KRW)", () => {
      it("keeps JPY amount as-is (no decimal)", () => {
        // ¥5000 should stay 5000 (no cents in JPY)
        const result = formatAmountForStripe(5000, "jpy");
        expect(result).toBe(5000);
      });

      it("keeps KRW amount as-is (no decimal)", () => {
        // ₩10000 should stay 10000 (no cents in KRW)
        const result = formatAmountForStripe(10000, "krw");
        expect(result).toBe(10000);
      });
    });

    describe("pricing tier amounts", () => {
      it("correctly formats Starter tier price ($500)", () => {
        const result = formatAmountForStripe(500, "usd");
        expect(result).toBe(50000);
      });

      it("correctly formats Business tier price ($850)", () => {
        const result = formatAmountForStripe(850, "usd");
        expect(result).toBe(85000);
      });

      it("correctly formats Professional tier price ($2000)", () => {
        const result = formatAmountForStripe(2000, "usd");
        expect(result).toBe(200000);
      });

      it("correctly formats Enterprise tier price ($4200)", () => {
        const result = formatAmountForStripe(4200, "usd");
        expect(result).toBe(420000);
      });
    });
  });
});
