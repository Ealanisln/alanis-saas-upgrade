import { describe, it, expect } from "vitest";
import {
  validateAmount,
  sanitizeServiceName,
  VALID_AMOUNTS_CENTS,
  MAX_SERVICE_NAME_LENGTH,
  MIN_AMOUNT_CENTS,
  MAX_AMOUNT_CENTS,
} from "@/lib/stripe-validation";

describe("Stripe Payment Validation", () => {
  describe("validateAmount", () => {
    describe("type validation", () => {
      it("should reject NaN", () => {
        expect(() => validateAmount(NaN)).toThrow(
          "Invalid amount: must be a valid number",
        );
      });

      it("should reject Infinity", () => {
        expect(() => validateAmount(Infinity)).toThrow(
          "Invalid amount: must be a valid number",
        );
      });

      it("should reject negative Infinity", () => {
        expect(() => validateAmount(-Infinity)).toThrow(
          "Invalid amount: must be a valid number",
        );
      });
    });

    describe("integer validation", () => {
      it("should reject floating point numbers", () => {
        expect(() => validateAmount(50000.5)).toThrow(
          "Invalid amount: must be a positive integer",
        );
      });

      it("should reject zero", () => {
        expect(() => validateAmount(0)).toThrow(
          "Invalid amount: must be a positive integer",
        );
      });

      it("should reject negative numbers", () => {
        expect(() => validateAmount(-100)).toThrow(
          "Invalid amount: must be a positive integer",
        );
      });

      it("should accept positive integers", () => {
        expect(() => validateAmount(50000)).not.toThrow();
      });
    });

    describe("range validation", () => {
      it("should reject amounts below minimum", () => {
        expect(() => validateAmount(50)).toThrow(
          `Invalid amount: minimum is ${MIN_AMOUNT_CENTS} cents`,
        );
      });

      it("should reject amounts above maximum", () => {
        expect(() => validateAmount(MAX_AMOUNT_CENTS + 1)).toThrow(
          `Invalid amount: maximum is ${MAX_AMOUNT_CENTS} cents`,
        );
      });

      it("should accept amount at exact minimum (if valid tier)", () => {
        // MIN_AMOUNT_CENTS (100) is not a valid tier, so this should still fail
        expect(() => validateAmount(MIN_AMOUNT_CENTS)).toThrow(
          "Invalid amount: must match a valid pricing tier",
        );
      });
    });

    describe("pricing tier validation", () => {
      it("should accept all valid pricing tier amounts", () => {
        VALID_AMOUNTS_CENTS.forEach((amount) => {
          expect(() => validateAmount(amount)).not.toThrow();
        });
      });

      it("should accept Starter tier amount (50000 cents = $500)", () => {
        expect(() => validateAmount(50000)).not.toThrow();
      });

      it("should accept Business tier amount (85000 cents = $850)", () => {
        expect(() => validateAmount(85000)).not.toThrow();
      });

      it("should accept Professional tier amount (200000 cents = $2000)", () => {
        expect(() => validateAmount(200000)).not.toThrow();
      });

      it("should accept Enterprise tier amount (420000 cents = $4200)", () => {
        expect(() => validateAmount(420000)).not.toThrow();
      });

      it("should reject amounts not matching any tier", () => {
        const invalidAmounts = [1000, 25000, 75000, 100000, 150000, 300000];
        invalidAmounts.forEach((amount) => {
          expect(() => validateAmount(amount)).toThrow(
            "Invalid amount: must match a valid pricing tier",
          );
        });
      });

      it("should reject amounts close to but not exactly matching tiers", () => {
        // Off by one cent
        expect(() => validateAmount(49999)).toThrow(
          "Invalid amount: must match a valid pricing tier",
        );
        expect(() => validateAmount(50001)).toThrow(
          "Invalid amount: must match a valid pricing tier",
        );
      });
    });
  });

  describe("sanitizeServiceName", () => {
    describe("type validation", () => {
      it("should reject non-string input", () => {
        // @ts-expect-error Testing runtime type check
        expect(() => sanitizeServiceName(123)).toThrow(
          "Invalid service name: must be a string",
        );
      });

      it("should reject null", () => {
        // @ts-expect-error Testing runtime type check
        expect(() => sanitizeServiceName(null)).toThrow(
          "Invalid service name: must be a string",
        );
      });

      it("should reject undefined", () => {
        // @ts-expect-error Testing runtime type check
        expect(() => sanitizeServiceName(undefined)).toThrow(
          "Invalid service name: must be a string",
        );
      });
    });

    describe("empty string validation", () => {
      it("should reject empty string", () => {
        expect(() => sanitizeServiceName("")).toThrow(
          "Invalid service name: cannot be empty",
        );
      });

      it("should reject whitespace-only string", () => {
        expect(() => sanitizeServiceName("   ")).toThrow(
          "Invalid service name: cannot be empty",
        );
      });

      it("should reject tabs and newlines only", () => {
        expect(() => sanitizeServiceName("\t\n\r")).toThrow(
          "Invalid service name: cannot be empty",
        );
      });
    });

    describe("length validation", () => {
      it("should reject strings exceeding max length", () => {
        const longName = "a".repeat(MAX_SERVICE_NAME_LENGTH + 1);
        expect(() => sanitizeServiceName(longName)).toThrow(
          `Invalid service name: maximum length is ${MAX_SERVICE_NAME_LENGTH} characters`,
        );
      });

      it("should accept strings at max length", () => {
        const maxName = "a".repeat(MAX_SERVICE_NAME_LENGTH);
        expect(() => sanitizeServiceName(maxName)).not.toThrow();
      });

      it("should accept short strings", () => {
        expect(() => sanitizeServiceName("Plan")).not.toThrow();
      });
    });

    describe("character sanitization", () => {
      it("should remove HTML tags", () => {
        const result = sanitizeServiceName("<script>alert(1)</script>Plan");
        expect(result).toBe("scriptalert1scriptPlan");
        expect(result).not.toContain("<");
        expect(result).not.toContain(">");
      });

      it("should remove SQL injection characters", () => {
        const result = sanitizeServiceName("Plan'; DROP TABLE users;--");
        // Hyphens are allowed, semicolons and quotes are removed
        expect(result).toBe("Plan DROP TABLE users--");
        expect(result).not.toContain("'");
        expect(result).not.toContain(";");
      });

      it("should remove special characters", () => {
        const result = sanitizeServiceName('Plan@#$%^&*()+=[]{}|\\:"<>?,./');
        expect(result).toBe("Plan");
      });

      it("should preserve alphanumeric characters", () => {
        const result = sanitizeServiceName("StarterPlan2024");
        expect(result).toBe("StarterPlan2024");
      });

      it("should preserve spaces", () => {
        const result = sanitizeServiceName("Starter Plan");
        expect(result).toBe("Starter Plan");
      });

      it("should preserve hyphens", () => {
        const result = sanitizeServiceName("Starter-Plan");
        expect(result).toBe("Starter-Plan");
      });

      it("should preserve underscores", () => {
        const result = sanitizeServiceName("Starter_Plan");
        expect(result).toBe("Starter_Plan");
      });

      it("should handle mixed valid and invalid characters", () => {
        const result = sanitizeServiceName("Starter Plan - 2024_v1.0!");
        expect(result).toBe("Starter Plan - 2024_v10");
      });
    });

    describe("whitespace handling", () => {
      it("should trim leading whitespace", () => {
        const result = sanitizeServiceName("   Starter Plan");
        expect(result).toBe("Starter Plan");
      });

      it("should trim trailing whitespace", () => {
        const result = sanitizeServiceName("Starter Plan   ");
        expect(result).toBe("Starter Plan");
      });

      it("should trim both leading and trailing whitespace", () => {
        const result = sanitizeServiceName("   Starter Plan   ");
        expect(result).toBe("Starter Plan");
      });

      it("should preserve internal spaces", () => {
        const result = sanitizeServiceName("Starter  Plan  2024");
        expect(result).toBe("Starter  Plan  2024");
      });
    });

    describe("edge cases", () => {
      it("should reject string with only special characters", () => {
        expect(() => sanitizeServiceName("@#$%^&*()")).toThrow(
          "Invalid service name: contains no valid characters",
        );
      });

      it("should handle unicode special characters by removing them", () => {
        // Curly quotes, special unicode punctuation should be removed
        const result = sanitizeServiceName("Plan\u2019s Best\u2014Service");
        expect(result).toContain("Plan");
        expect(result).toContain("Best");
        expect(result).toContain("Service");
        expect(result).not.toContain("\u2019"); // curly apostrophe removed
        expect(result).not.toContain("\u2014"); // em dash removed
      });

      it("should handle emoji by removing them", () => {
        const result = sanitizeServiceName("Plan 🚀 Name");
        expect(result).toBe("Plan  Name");
      });
    });
  });

  describe("exported constants", () => {
    it("should have correct VALID_AMOUNTS_CENTS values", () => {
      expect(VALID_AMOUNTS_CENTS).toContain(50000); // $500
      expect(VALID_AMOUNTS_CENTS).toContain(85000); // $850
      expect(VALID_AMOUNTS_CENTS).toContain(200000); // $2000
      expect(VALID_AMOUNTS_CENTS).toContain(420000); // $4200
      expect(VALID_AMOUNTS_CENTS).toHaveLength(4);
    });

    it("should have correct MAX_SERVICE_NAME_LENGTH", () => {
      expect(MAX_SERVICE_NAME_LENGTH).toBe(100);
    });

    it("should have correct MIN_AMOUNT_CENTS", () => {
      expect(MIN_AMOUNT_CENTS).toBe(100);
    });

    it("should have correct MAX_AMOUNT_CENTS", () => {
      expect(MAX_AMOUNT_CENTS).toBe(10000000);
    });
  });
});
