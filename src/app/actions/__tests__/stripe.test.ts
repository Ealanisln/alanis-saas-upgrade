import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

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
  });
});
