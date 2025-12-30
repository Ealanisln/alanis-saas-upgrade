import { sendQuoteEmail } from "@/lib/email";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { submitQuoteRequest } from "../quote";

// Mock the email module
vi.mock("@/lib/email", () => ({
  sendQuoteEmail: vi.fn(),
}));

const mockSendQuoteEmail = vi.mocked(sendQuoteEmail);

describe("submitQuoteRequest server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validQuoteData = {
    name: "John Doe",
    email: "john@example.com",
    services: [
      { name: "Web Development", price: 5000 },
      { name: "UI/UX Design", price: 2000 },
    ],
    totalAmount: 7000,
    clientType: "enterprise" as const,
    urgency: "normal" as const,
  };

  describe("validation", () => {
    it("should return error when name is missing", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        name: "",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Name is required");
      expect(result.error).toBe("VALIDATION_ERROR");
      expect(mockSendQuoteEmail).not.toHaveBeenCalled();
    });

    it("should return error when name is only whitespace", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        name: "   ",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Name is required");
    });

    it("should return error when email is missing", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        email: "",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email is required");
      expect(result.error).toBe("VALIDATION_ERROR");
    });

    it("should return error when email is only whitespace", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        email: "   ",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Email is required");
    });

    it("should return error for invalid email format", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        email: "invalid-email",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email format");
      expect(result.error).toBe("VALIDATION_ERROR");
    });

    it("should return error for email without domain", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        email: "test@",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email format");
    });

    it("should return error for email without @", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        email: "testexample.com",
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid email format");
    });

    it("should return error when services array is empty", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        services: [],
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("At least one service is required");
      expect(result.error).toBe("VALIDATION_ERROR");
    });

    it("should return error when services is undefined", async () => {
      const result = await submitQuoteRequest({
        ...validQuoteData,
        services: undefined as unknown as typeof validQuoteData.services,
      });

      expect(result.success).toBe(false);
      expect(result.message).toBe("At least one service is required");
    });
  });

  describe("successful submission", () => {
    it("should call sendQuoteEmail with correct data", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await submitQuoteRequest(validQuoteData);

      expect(mockSendQuoteEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        phone: undefined,
        company: undefined,
        services: [
          { name: "Web Development", price: 5000 },
          { name: "UI/UX Design", price: 2000 },
        ],
        totalAmount: 7000,
        clientType: "enterprise",
        urgency: "normal",
        notes: undefined,
      });
    });

    it("should trim whitespace from inputs", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await submitQuoteRequest({
        ...validQuoteData,
        name: "  John Doe  ",
        email: "  JOHN@Example.COM  ",
        phone: "  +1234567890  ",
        company: "  Tech Corp  ",
        notes: "  Some notes  ",
      });

      expect(mockSendQuoteEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "John Doe",
          email: "john@example.com",
          phone: "+1234567890",
          company: "Tech Corp",
          notes: "Some notes",
        }),
      );
    });

    it("should lowercase email address", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await submitQuoteRequest({
        ...validQuoteData,
        email: "JOHN@EXAMPLE.COM",
      });

      expect(mockSendQuoteEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
        }),
      );
    });

    it("should return success message", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      const result = await submitQuoteRequest(validQuoteData);

      expect(result.success).toBe(true);
      expect(result.message).toBe(
        "Quote request submitted successfully! We will contact you soon.",
      );
    });

    it("should handle optional fields correctly", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      const minimalData = {
        name: "Jane",
        email: "jane@test.com",
        services: [{ name: "Service", price: 1000 }],
        totalAmount: 1000,
        clientType: "pyme" as const,
        urgency: "urgent" as const,
      };

      const result = await submitQuoteRequest(minimalData);

      expect(result.success).toBe(true);
      expect(mockSendQuoteEmail).toHaveBeenCalledWith({
        name: "Jane",
        email: "jane@test.com",
        phone: undefined,
        company: undefined,
        services: [{ name: "Service", price: 1000 }],
        totalAmount: 1000,
        clientType: "pyme",
        urgency: "urgent",
        notes: undefined,
      });
    });

    it("should include all optional fields when provided", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      const fullData = {
        ...validQuoteData,
        phone: "+1234567890",
        company: "Tech Corp",
        notes: "Need this done ASAP",
      };

      await submitQuoteRequest(fullData);

      expect(mockSendQuoteEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          phone: "+1234567890",
          company: "Tech Corp",
          notes: "Need this done ASAP",
        }),
      );
    });
  });

  describe("error handling", () => {
    it("should return error when email sending fails", async () => {
      mockSendQuoteEmail.mockResolvedValue({
        success: false,
        error: "API error",
      });

      const result = await submitQuoteRequest(validQuoteData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "Failed to submit quote request. Please try again.",
      );
      expect(result.error).toBe("API error");
    });

    it("should return error when sendQuoteEmail throws", async () => {
      mockSendQuoteEmail.mockRejectedValue(new Error("Network error"));

      const result = await submitQuoteRequest(validQuoteData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred. Please try again later.",
      );
      expect(result.error).toBe("Network error");
    });

    it("should handle non-Error exceptions", async () => {
      mockSendQuoteEmail.mockRejectedValue("String error");

      const result = await submitQuoteRequest(validQuoteData);

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "An unexpected error occurred. Please try again later.",
      );
      expect(result.error).toBe("Unknown error");
    });
  });
});
