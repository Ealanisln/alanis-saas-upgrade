import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  sendContactEmail,
  sendCustomerConfirmationEmail,
  sendInternalNotification,
  sendQuoteEmail,
} from "../email";

// Mock the Resend module
vi.mock("resend", () => {
  const mockSend = vi.fn();
  return {
    Resend: vi.fn().mockImplementation(() => ({
      emails: {
        send: mockSend,
      },
    })),
    __mockSend: mockSend,
  };
});

// Get the mock function
const getMockSend = async () => {
  const resendModule = await import("resend");
  return (resendModule as unknown as { __mockSend: ReturnType<typeof vi.fn> })
    .__mockSend;
};

describe("Email Service", () => {
  let mockSend: ReturnType<typeof vi.fn>;
  const originalEnv = process.env;

  beforeEach(async () => {
    mockSend = await getMockSend();
    mockSend.mockReset();

    // Set up environment variables
    process.env = {
      ...originalEnv,
      RESEND_API_KEY: "re_test_key",
      EMAIL_FROM: "Test <test@example.com>",
      EMAIL_TO: "recipient@example.com",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  describe("sendContactEmail", () => {
    const validContactData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Hello, I am interested in your services.",
      subject: "Contact inquiry",
    };

    it("should send contact email successfully", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });

      const result = await sendContactEmail(validContactData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_123");
      expect(mockSend).toHaveBeenCalledTimes(2); // Owner notification + user confirmation
    });

    it("should include correct data in owner notification email", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });

      await sendContactEmail(validContactData);

      const firstCall = mockSend.mock.calls[0][0];
      // Check that the email is sent to a configured recipient (env-dependent)
      expect(typeof firstCall.to).toBe("string");
      expect(firstCall.replyTo).toBe("john@example.com");
      expect(firstCall.subject).toBe("Contact inquiry");
      expect(firstCall.html).toContain("John Doe");
      expect(firstCall.html).toContain("john@example.com");
      expect(firstCall.html).toContain(
        "Hello, I am interested in your services.",
      );
    });

    it("should send confirmation email to user", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });

      await sendContactEmail(validContactData);

      const secondCall = mockSend.mock.calls[1][0];
      expect(secondCall.to).toBe("john@example.com");
      expect(secondCall.subject).toBe("Thanks for reaching out! - Alanis Dev");
      expect(secondCall.html).toContain("Thanks for your message, John Doe!");
    });

    it("should use default subject if not provided", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });

      await sendContactEmail({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "Test message",
      });

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.subject).toBe("New contact from Jane Doe");
    });

    it("should handle Resend API error", async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "API rate limit exceeded" },
      });

      const result = await sendContactEmail(validContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("API rate limit exceeded");
    });

    it("should handle exception during send", async () => {
      mockSend.mockRejectedValue(new Error("Network error"));

      const result = await sendContactEmail(validContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Network error");
    });

    it("should return error when RESEND_API_KEY is not configured", async () => {
      delete process.env.RESEND_API_KEY;

      // Need to reset the module to pick up the new env
      vi.resetModules();
      const { sendContactEmail: freshSendContactEmail } = await import(
        "../email"
      );

      const result = await freshSendContactEmail(validContactData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Email service not configured");
    });

    it("should escape HTML in user input to prevent XSS", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_123" }, error: null });

      await sendContactEmail({
        name: "<script>alert('xss')</script>",
        email: "test@example.com",
        message: "<img src=x onerror=alert('xss')>",
      });

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.html).not.toContain("<script>");
      expect(firstCall.html).toContain("&lt;script&gt;");
      expect(firstCall.html).not.toContain("<img");
      expect(firstCall.html).toContain("&lt;img");
    });
  });

  describe("sendQuoteEmail", () => {
    const validQuoteData = {
      name: "Jane Smith",
      email: "jane@company.com",
      phone: "+1234567890",
      company: "Tech Corp",
      services: [
        { name: "Web Development", price: 5000 },
        { name: "UI/UX Design", price: 2000 },
      ],
      totalAmount: 7000,
      clientType: "enterprise" as const,
      urgency: "urgent" as const,
      notes: "Need this done ASAP",
    };

    it("should send quote email successfully", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      const result = await sendQuoteEmail(validQuoteData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_456");
      expect(mockSend).toHaveBeenCalledTimes(2); // Owner + client confirmation
    });

    it("should include all service details in email", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      await sendQuoteEmail(validQuoteData);

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.html).toContain("Web Development");
      expect(firstCall.html).toContain("UI/UX Design");
      expect(firstCall.html).toContain("$5,000");
      expect(firstCall.html).toContain("$2,000");
      expect(firstCall.html).toContain("$7,000");
    });

    it("should include client information", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      await sendQuoteEmail(validQuoteData);

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.html).toContain("Jane Smith");
      expect(firstCall.html).toContain("jane@company.com");
      expect(firstCall.html).toContain("+1234567890");
      expect(firstCall.html).toContain("Tech Corp");
      expect(firstCall.html).toContain("Enterprise");
      expect(firstCall.html).toContain("Urgent");
    });

    it("should include notes when provided", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      await sendQuoteEmail(validQuoteData);

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.html).toContain("Need this done ASAP");
    });

    it("should handle quote without optional fields", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      const minimalQuote = {
        name: "John",
        email: "john@test.com",
        services: [{ name: "Service", price: 1000 }],
        totalAmount: 1000,
        clientType: "pyme" as const,
        urgency: "normal" as const,
      };

      const result = await sendQuoteEmail(minimalQuote);

      expect(result.success).toBe(true);
      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.html).not.toContain("Phone:");
      expect(firstCall.html).not.toContain("Company:");
    });

    it("should set correct subject with total amount", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_456" }, error: null });

      await sendQuoteEmail(validQuoteData);

      const firstCall = mockSend.mock.calls[0][0];
      expect(firstCall.subject).toBe("New Quote Request - $7,000 USD");
    });

    it("should handle API error", async () => {
      mockSend.mockResolvedValue({
        data: null,
        error: { message: "Invalid API key" },
      });

      const result = await sendQuoteEmail(validQuoteData);

      expect(result.success).toBe(false);
      expect(result.error).toBe("Invalid API key");
    });
  });

  describe("sendCustomerConfirmationEmail", () => {
    const validConfirmationData = {
      to: "customer@example.com",
      name: "Alice Johnson",
      service: "Premium Web Development",
      amount: 500000, // $5000 in cents
      sessionId: "cs_test_123",
    };

    it("should send confirmation email successfully", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_789" }, error: null });

      const result = await sendCustomerConfirmationEmail(validConfirmationData);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe("msg_789");
      expect(mockSend).toHaveBeenCalledTimes(1);
    });

    it("should include correct payment details", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_789" }, error: null });

      await sendCustomerConfirmationEmail(validConfirmationData);

      const call = mockSend.mock.calls[0][0];
      expect(call.to).toBe("customer@example.com");
      expect(call.subject).toBe(
        "Payment Confirmation - Premium Web Development",
      );
      expect(call.html).toContain("Alice Johnson");
      expect(call.html).toContain("Premium Web Development");
      expect(call.html).toContain("$5,000");
      expect(call.html).toContain("cs_test_123");
    });

    it("should handle null name gracefully", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_789" }, error: null });

      await sendCustomerConfirmationEmail({
        ...validConfirmationData,
        name: null,
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain("Hi there");
    });

    it("should handle null amount", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_789" }, error: null });

      await sendCustomerConfirmationEmail({
        ...validConfirmationData,
        amount: null,
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain("$0");
    });
  });

  describe("sendInternalNotification", () => {
    it("should send new payment notification", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_int_1" }, error: null });

      const result = await sendInternalNotification({
        type: "new_payment",
        service: "Web Development",
        customer: "John Doe",
        amount: 100000,
        sessionId: "cs_123",
      });

      expect(result.success).toBe(true);
      const call = mockSend.mock.calls[0][0];
      expect(call.subject).toContain("New Payment");
      expect(call.html).toContain("New Payment Received");
      expect(call.html).toContain("John Doe");
      expect(call.html).toContain("$1,000");
    });

    it("should send payment failed notification", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_int_2" }, error: null });

      await sendInternalNotification({
        type: "payment_failed",
        service: "Design Service",
        customer: "Jane Doe",
        amount: 50000,
        sessionId: "cs_456",
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.subject).toContain("Payment Failed");
      expect(call.html).toContain("Payment Failed");
    });

    it("should send refund notification", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_int_3" }, error: null });

      await sendInternalNotification({
        type: "refund",
        service: "Consulting",
        customer: "Bob Smith",
        amount: 25000,
        sessionId: "cs_789",
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.subject).toContain("Refund Processed");
      expect(call.html).toContain("Refund Processed");
    });

    it("should handle null customer name", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_int_4" }, error: null });

      await sendInternalNotification({
        type: "new_payment",
        service: "Service",
        customer: null,
        amount: 10000,
        sessionId: "cs_test",
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain("Unknown");
    });

    it("should include Stripe dashboard link", async () => {
      mockSend.mockResolvedValue({ data: { id: "msg_int_5" }, error: null });

      await sendInternalNotification({
        type: "new_payment",
        service: "Service",
        customer: "Test",
        amount: 10000,
        sessionId: "cs_test",
      });

      const call = mockSend.mock.calls[0][0];
      expect(call.html).toContain("https://dashboard.stripe.com");
    });
  });
});
