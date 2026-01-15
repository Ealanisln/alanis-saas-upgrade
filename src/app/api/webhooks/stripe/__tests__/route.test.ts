import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";
import type Stripe from "stripe";

// Use vi.hoisted to define mocks that will be used in vi.mock factories
const {
  mockHeadersGet,
  mockConstructEvent,
  mockIsEventProcessed,
  mockMarkEventProcessing,
  mockMarkEventCompleted,
  mockMarkEventFailed,
  mockSendCustomerEmail,
  mockSendInternalNotification,
} = vi.hoisted(() => ({
  mockHeadersGet: vi.fn(),
  mockConstructEvent: vi.fn(),
  mockIsEventProcessed: vi.fn(),
  mockMarkEventProcessing: vi.fn(),
  mockMarkEventCompleted: vi.fn(),
  mockMarkEventFailed: vi.fn(),
  mockSendCustomerEmail: vi.fn(),
  mockSendInternalNotification: vi.fn(),
}));

// Mock all dependencies
vi.mock("next/headers", () => ({
  headers: vi.fn(async () => ({
    get: mockHeadersGet,
  })),
}));

vi.mock("@/lib/stripe", () => ({
  stripe: {
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  },
}));

vi.mock("@/lib/email", () => ({
  sendCustomerConfirmationEmail: mockSendCustomerEmail,
  sendInternalNotification: mockSendInternalNotification,
}));

vi.mock("@/lib/idempotency", () => ({
  isEventProcessed: mockIsEventProcessed,
  markEventProcessing: mockMarkEventProcessing,
  markEventCompleted: mockMarkEventCompleted,
  markEventFailed: mockMarkEventFailed,
}));

// Import the route after mocks are set up
import { POST } from "../route";

describe("Stripe Webhook Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Set required env vars
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_secret";

    // Default mock implementations
    mockHeadersGet.mockImplementation((key: string) => {
      if (key === "stripe-signature") return "test_signature";
      return null;
    });
    mockIsEventProcessed.mockReturnValue(false);
    mockMarkEventProcessing.mockReturnValue(true);
    mockSendCustomerEmail.mockResolvedValue({ success: true });
    mockSendInternalNotification.mockResolvedValue({ success: true });
  });

  afterEach(() => {
    delete process.env.STRIPE_WEBHOOK_SECRET;
  });

  function createMockRequest(body: string = "{}"): NextRequest {
    return new NextRequest("http://localhost:3000/api/webhooks/stripe", {
      method: "POST",
      body,
      headers: {
        "stripe-signature": "test_signature",
      },
    });
  }

  function createStripeEvent(
    type: string,
    data: Record<string, unknown>,
  ): Stripe.Event {
    return {
      id: `evt_test_${Date.now()}`,
      object: "event",
      api_version: "2025-10-29.clover",
      created: Math.floor(Date.now() / 1000),
      type,
      data: {
        object: data,
      },
      livemode: false,
      pending_webhooks: 0,
      request: null,
    } as Stripe.Event;
  }

  describe("Request Validation", () => {
    it("should return 400 when signature is missing", async () => {
      mockHeadersGet.mockReturnValue(null);

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toContain("signature");
    });

    it("should return 500 when webhook secret is not configured", async () => {
      delete process.env.STRIPE_WEBHOOK_SECRET;

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(500);

      const json = await response.json();
      expect(json.error).toContain("not configured");
    });

    it("should return 400 when signature verification fails", async () => {
      mockConstructEvent.mockImplementation(() => {
        throw new Error("Invalid signature");
      });

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(400);

      const json = await response.json();
      expect(json.error).toContain("Webhook Error");
    });
  });

  describe("Idempotency", () => {
    it("should skip already processed events", async () => {
      const event = createStripeEvent("checkout.session.completed", {
        id: "cs_test_123",
      });
      mockConstructEvent.mockReturnValue(event);
      mockIsEventProcessed.mockReturnValue(true);

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.message).toContain("already processed");
    });

    it("should skip events currently being processed", async () => {
      const event = createStripeEvent("checkout.session.completed", {
        id: "cs_test_123",
      });
      mockConstructEvent.mockReturnValue(event);
      mockIsEventProcessed.mockReturnValue(false);
      mockMarkEventProcessing.mockReturnValue(false);

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(200);

      const json = await response.json();
      expect(json.message).toContain("being processed");
    });

    it("should mark event as completed after successful processing", async () => {
      const event = createStripeEvent("payment_intent.succeeded", {
        id: "pi_test_123",
        amount: 50000,
        currency: "usd",
      });
      mockConstructEvent.mockReturnValue(event);

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(mockMarkEventCompleted).toHaveBeenCalledWith(event.id);
    });

    it("should mark event as failed on processing error", async () => {
      const event = createStripeEvent("checkout.session.completed", {
        id: "cs_test_123",
        customer_details: {
          email: "test@example.com",
          name: "Test User",
        },
        amount_total: 50000,
        metadata: { service_name: "Starter Plan" },
      });
      mockConstructEvent.mockReturnValue(event);
      mockSendCustomerEmail.mockRejectedValue(new Error("Email failed"));

      const request = createMockRequest();
      const response = await POST(request);

      expect(response.status).toBe(500);
      expect(mockMarkEventFailed).toHaveBeenCalledWith(event.id);
    });
  });

  describe("Event Handlers", () => {
    describe("checkout.session.completed", () => {
      it("should send confirmation emails on successful checkout", async () => {
        const event = createStripeEvent("checkout.session.completed", {
          id: "cs_test_123",
          customer_details: {
            email: "customer@example.com",
            name: "John Doe",
          },
          amount_total: 50000,
          metadata: { service_name: "Starter Plan" },
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(mockSendCustomerEmail).toHaveBeenCalledWith({
          to: "customer@example.com",
          name: "John Doe",
          service: "Starter Plan",
          amount: 50000,
          sessionId: "cs_test_123",
        });
        expect(mockSendInternalNotification).toHaveBeenCalledWith({
          type: "new_payment",
          service: "Starter Plan",
          customer: "John Doe",
          amount: 50000,
          sessionId: "cs_test_123",
        });
      });

      it("should handle checkout without customer email", async () => {
        const event = createStripeEvent("checkout.session.completed", {
          id: "cs_test_456",
          customer_details: {
            email: null,
            name: "Anonymous",
          },
          amount_total: 85000,
          metadata: { service_name: "Business Plan" },
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        expect(response.status).toBe(200);
        // Customer email should not be sent without email
        expect(mockSendCustomerEmail).not.toHaveBeenCalled();
        // Internal notification should still be sent
        expect(mockSendInternalNotification).toHaveBeenCalled();
      });
    });

    describe("payment_intent.succeeded", () => {
      it("should handle successful payment intent", async () => {
        const event = createStripeEvent("payment_intent.succeeded", {
          id: "pi_test_789",
          amount: 200000,
          currency: "usd",
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.received).toBe(true);
      });
    });

    describe("payment_intent.payment_failed", () => {
      it("should handle failed payment intent", async () => {
        const event = createStripeEvent("payment_intent.payment_failed", {
          id: "pi_failed_123",
          last_payment_error: {
            message: "Card declined",
          },
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        expect(response.status).toBe(200);
      });
    });

    describe("charge.refunded", () => {
      it("should handle refunded charge", async () => {
        const event = createStripeEvent("charge.refunded", {
          id: "ch_refund_123",
          amount_refunded: 50000,
          currency: "usd",
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        expect(response.status).toBe(200);
      });
    });

    describe("Unhandled Events", () => {
      it("should acknowledge unhandled event types", async () => {
        const event = createStripeEvent("customer.created", {
          id: "cus_test_123",
        });
        mockConstructEvent.mockReturnValue(event);

        const request = createMockRequest();
        const response = await POST(request);

        // Should return 200 even for unhandled events
        expect(response.status).toBe(200);
      });
    });
  });
});
