import { describe, it, expect, vi, beforeEach, afterEach, test } from "vitest";

// Use vi.hoisted to define mocks that will be used in vi.mock factories
const { mockHeadersGet, mockCheckoutSessionCreate, mockRedirect } = vi.hoisted(
  () => ({
    mockHeadersGet: vi.fn(),
    mockCheckoutSessionCreate: vi.fn(),
    mockRedirect: vi.fn(),
  }),
);

// Mock all dependencies
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: mockHeadersGet,
  })),
}));

vi.mock("next/navigation", () => ({
  redirect: mockRedirect,
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: mockCheckoutSessionCreate,
      },
    },
  },
  STRIPE_CURRENCY: "usd",
  PRICING_TIERS: {
    starter: { name: "Starter", priceUSD: 500 },
    business: { name: "Business", priceUSD: 850 },
    professional: { name: "Professional", priceUSD: 2000 },
    enterprise: { name: "Enterprise", priceUSD: 4200 },
  },
}));

// Import after mocks
import { createCheckoutSession } from "../stripe";

describe("Stripe Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_key";

    // Default mock implementations
    mockHeadersGet.mockImplementation((key: string) => {
      if (key === "origin") return "http://localhost:3000";
      return null;
    });
  });

  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY;
  });

  describe("createCheckoutSession", () => {
    it("should create checkout session with correct parameters", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_123",
        url: "https://checkout.stripe.com/pay/cs_test_123",
      });

      await createCheckoutSession(50000, "Starter Plan", "en");

      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Starter Plan",
                description: "Starter Plan - Web Development Service",
              },
              unit_amount: 50000,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url:
          "http://localhost:3000/en/checkout/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/en/plans?canceled=true",
        metadata: {
          service_name: "Starter Plan",
          amount: "50000",
        },
      });

      expect(mockRedirect).toHaveBeenCalledWith(
        "https://checkout.stripe.com/pay/cs_test_123",
      );
    });

    it("should use correct locale in redirect URLs", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_456",
        url: "https://checkout.stripe.com/pay/cs_test_456",
      });

      await createCheckoutSession(85000, "Business Plan", "es");

      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url: expect.stringContaining("/es/checkout/success"),
          cancel_url: expect.stringContaining("/es/plans?canceled=true"),
        }),
      );
    });

    it("should throw error when origin header is missing", async () => {
      mockHeadersGet.mockReturnValue(null);

      await expect(
        createCheckoutSession(50000, "Test Plan", "en"),
      ).rejects.toThrow("Origin header is missing");
    });

    it("should throw error when session URL is missing", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_789",
        url: null,
      });

      await expect(
        createCheckoutSession(50000, "Test Plan", "en"),
      ).rejects.toThrow("Checkout session URL is missing");
    });

    it("should handle different pricing tiers correctly", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_tier",
        url: "https://checkout.stripe.com/pay/cs_test_tier",
      });

      const testCases = [
        { amount: 50000, name: "Starter" },
        { amount: 85000, name: "Business" },
        { amount: 200000, name: "Professional" },
        { amount: 420000, name: "Enterprise" },
      ];

      for (const testCase of testCases) {
        vi.clearAllMocks();
        mockHeadersGet.mockReturnValue("http://localhost:3000");

        await createCheckoutSession(testCase.amount, testCase.name, "en");

        expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            line_items: [
              expect.objectContaining({
                price_data: expect.objectContaining({
                  unit_amount: testCase.amount,
                  product_data: expect.objectContaining({
                    name: testCase.name,
                  }),
                }),
              }),
            ],
          }),
        );
      }
    });

    it("should include service name in metadata", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_meta",
        url: "https://checkout.stripe.com/pay/cs_test_meta",
      });

      await createCheckoutSession(50000, "Custom Service", "en");

      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          metadata: {
            service_name: "Custom Service",
            amount: "50000",
          },
        }),
      );
    });

    it("should default to 'en' locale when not provided", async () => {
      mockCheckoutSessionCreate.mockResolvedValue({
        id: "cs_test_default",
        url: "https://checkout.stripe.com/pay/cs_test_default",
      });

      // Call without locale parameter
      await createCheckoutSession(50000, "Test Plan");

      expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          success_url: expect.stringContaining("/en/checkout/success"),
          cancel_url: expect.stringContaining("/en/plans?canceled=true"),
        }),
      );
    });

    describe("amount validation", () => {
      it("should reject invalid amount that is not a pricing tier", async () => {
        await expect(
          createCheckoutSession(99999, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: must match a valid pricing tier");
      });

      it("should reject negative amounts", async () => {
        await expect(
          createCheckoutSession(-50000, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: must be a positive integer");
      });

      it("should reject zero amount", async () => {
        await expect(
          createCheckoutSession(0, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: must be a positive integer");
      });

      it("should reject amount below minimum", async () => {
        await expect(
          createCheckoutSession(50, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: minimum is 100 cents");
      });

      it("should reject amount above maximum", async () => {
        await expect(
          createCheckoutSession(99999999, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: maximum is 10000000 cents");
      });

      it("should reject non-integer amounts", async () => {
        await expect(
          createCheckoutSession(500.5, "Test Plan", "en"),
        ).rejects.toThrow("Invalid amount: must be a positive integer");
      });

      it("should accept all valid pricing tier amounts", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_valid",
          url: "https://checkout.stripe.com/pay/cs_test_valid",
        });

        const validAmounts = [50000, 85000, 200000, 420000];

        for (const amount of validAmounts) {
          vi.clearAllMocks();
          mockHeadersGet.mockReturnValue("http://localhost:3000");

          await createCheckoutSession(amount, "Test Plan", "en");
          expect(mockCheckoutSessionCreate).toHaveBeenCalled();
        }
      });
    });

    describe("service name validation", () => {
      it("should reject empty service name", async () => {
        await expect(createCheckoutSession(50000, "", "en")).rejects.toThrow(
          "Invalid service name: cannot be empty",
        );
      });

      it("should reject service name with only whitespace", async () => {
        await expect(createCheckoutSession(50000, "   ", "en")).rejects.toThrow(
          "Invalid service name: cannot be empty",
        );
      });

      it("should reject service name exceeding max length", async () => {
        const longName = "a".repeat(101);
        await expect(
          createCheckoutSession(50000, longName, "en"),
        ).rejects.toThrow(
          "Invalid service name: maximum length is 100 characters",
        );
      });

      it("should sanitize dangerous characters from service name", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_sanitize",
          url: "https://checkout.stripe.com/pay/cs_test_sanitize",
        });

        await createCheckoutSession(
          50000,
          "Test<script>alert(1)</script>Plan",
          "en",
        );

        expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            line_items: [
              expect.objectContaining({
                price_data: expect.objectContaining({
                  product_data: expect.objectContaining({
                    name: "Testscriptalert1scriptPlan",
                  }),
                }),
              }),
            ],
          }),
        );
      });

      it("should allow valid characters in service name", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_valid_name",
          url: "https://checkout.stripe.com/pay/cs_test_valid_name",
        });

        await createCheckoutSession(50000, "Starter Plan - 2024_v1", "en");

        expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            line_items: [
              expect.objectContaining({
                price_data: expect.objectContaining({
                  product_data: expect.objectContaining({
                    name: "Starter Plan - 2024_v1",
                  }),
                }),
              }),
            ],
          }),
        );
      });

      it("should trim whitespace from service name", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_trim",
          url: "https://checkout.stripe.com/pay/cs_test_trim",
        });

        await createCheckoutSession(50000, "  Starter Plan  ", "en");

        expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            line_items: [
              expect.objectContaining({
                price_data: expect.objectContaining({
                  product_data: expect.objectContaining({
                    name: "Starter Plan",
                  }),
                }),
              }),
            ],
          }),
        );
      });
    });

    describe("integration: validation before Stripe API call", () => {
      it("should not call Stripe API when amount validation fails", async () => {
        await expect(
          createCheckoutSession(12345, "Test Plan", "en"),
        ).rejects.toThrow();

        expect(mockCheckoutSessionCreate).not.toHaveBeenCalled();
      });

      it("should not call Stripe API when service name validation fails", async () => {
        await expect(createCheckoutSession(50000, "", "en")).rejects.toThrow();

        expect(mockCheckoutSessionCreate).not.toHaveBeenCalled();
      });

      it("should call Stripe API only after successful validation", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_success",
          url: "https://checkout.stripe.com/pay/cs_test_success",
        });

        await createCheckoutSession(50000, "Starter", "en");

        expect(mockCheckoutSessionCreate).toHaveBeenCalledTimes(1);
      });

      it("should include sanitized name in both product_data and metadata", async () => {
        mockCheckoutSessionCreate.mockResolvedValue({
          id: "cs_test_sanitized",
          url: "https://checkout.stripe.com/pay/cs_test_sanitized",
        });

        await createCheckoutSession(50000, "Test@Plan#2024", "en");

        expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
          expect.objectContaining({
            line_items: [
              expect.objectContaining({
                price_data: expect.objectContaining({
                  product_data: expect.objectContaining({
                    name: "TestPlan2024",
                    description: "TestPlan2024 - Web Development Service",
                  }),
                }),
              }),
            ],
            metadata: expect.objectContaining({
              service_name: "TestPlan2024",
            }),
          }),
        );
      });
    });

    describe("security: attack vector prevention", () => {
      test.each([
        [
          "XSS in name",
          50000,
          "<script>alert('xss')</script>",
          "scriptalertxssscript",
        ],
        [
          "SQL injection",
          50000,
          "'; DROP TABLE users;--",
          " DROP TABLE users--",
        ],
        ["Path traversal", 50000, "../../../etc/passwd", "etcpasswd"],
        ["Template injection", 50000, "{{7*7}}", "77"],
      ])(
        "should sanitize %s",
        async (_, amount, maliciousName, expectedSanitized) => {
          mockCheckoutSessionCreate.mockResolvedValue({
            id: "cs_test_security",
            url: "https://checkout.stripe.com/pay/cs_test_security",
          });

          await createCheckoutSession(amount, maliciousName, "en");

          expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
            expect.objectContaining({
              line_items: [
                expect.objectContaining({
                  price_data: expect.objectContaining({
                    product_data: expect.objectContaining({
                      name: expectedSanitized,
                    }),
                  }),
                }),
              ],
            }),
          );
        },
      );

      test.each([
        ["arbitrary low amount", 100],
        ["arbitrary high amount within range", 5000000],
        ["exact amount close to tier", 49999],
        ["amount slightly above tier", 50001],
      ])("should reject %s", async (_, invalidAmount) => {
        await expect(
          createCheckoutSession(invalidAmount, "Test Plan", "en"),
        ).rejects.toThrow();

        expect(mockCheckoutSessionCreate).not.toHaveBeenCalled();
      });
    });
  });
});
