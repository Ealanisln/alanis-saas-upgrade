import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "@/lib/email";
import sendEmail from "../email";

// Mock the email module
vi.mock("@/lib/email", () => ({
  sendContactEmail: vi.fn(),
}));

const mockSendContactEmail = vi.mocked(sendContactEmail);

describe("sendEmail server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("validation", () => {
    it("should throw error when name is missing", async () => {
      await expect(
        sendEmail({
          name: "",
          email: "test@example.com",
          message: "Hello",
        }),
      ).rejects.toThrow("All fields are required");
    });

    it("should throw error when email is missing", async () => {
      await expect(
        sendEmail({
          name: "John",
          email: "",
          message: "Hello",
        }),
      ).rejects.toThrow("All fields are required");
    });

    it("should throw error when message is missing", async () => {
      await expect(
        sendEmail({
          name: "John",
          email: "test@example.com",
          message: "",
        }),
      ).rejects.toThrow("All fields are required");
    });

    it("should throw error for invalid email format", async () => {
      await expect(
        sendEmail({
          name: "John",
          email: "invalid-email",
          message: "Hello",
        }),
      ).rejects.toThrow("Invalid email format");
    });

    it("should throw error for email without domain", async () => {
      await expect(
        sendEmail({
          name: "John",
          email: "test@",
          message: "Hello",
        }),
      ).rejects.toThrow("Invalid email format");
    });

    it("should throw error for email without @", async () => {
      await expect(
        sendEmail({
          name: "John",
          email: "testexample.com",
          message: "Hello",
        }),
      ).rejects.toThrow("Invalid email format");
    });
  });

  describe("successful submission", () => {
    it("should call sendContactEmail with correct data", async () => {
      mockSendContactEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await sendEmail({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
      });

      expect(mockSendContactEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
        subject: "New contact from John Doe",
      });
    });

    it("should trim whitespace from inputs", async () => {
      mockSendContactEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await sendEmail({
        name: "  John Doe  ",
        email: "  JOHN@Example.COM  ",
        message: "  Hello there!  ",
      });

      expect(mockSendContactEmail).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        message: "Hello there!",
        subject: "New contact from   John Doe  ",
      });
    });

    it("should lowercase email address", async () => {
      mockSendContactEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      await sendEmail({
        name: "John",
        email: "JOHN@EXAMPLE.COM",
        message: "Hello",
      });

      expect(mockSendContactEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "john@example.com",
        }),
      );
    });

    it("should return success message", async () => {
      mockSendContactEmail.mockResolvedValue({
        success: true,
        messageId: "msg_123",
      });

      const result = await sendEmail({
        name: "John",
        email: "john@example.com",
        message: "Hello",
      });

      expect(result).toBe("Your message has been sent successfully!");
    });
  });

  describe("error handling", () => {
    it("should throw error when email sending fails", async () => {
      mockSendContactEmail.mockResolvedValue({
        success: false,
        error: "API error",
      });

      await expect(
        sendEmail({
          name: "John",
          email: "john@example.com",
          message: "Hello",
        }),
      ).rejects.toThrow("Failed to send message. Please try again later.");
    });

    it("should throw error when sendContactEmail throws", async () => {
      mockSendContactEmail.mockRejectedValue(new Error("Network error"));

      await expect(
        sendEmail({
          name: "John",
          email: "john@example.com",
          message: "Hello",
        }),
      ).rejects.toThrow("An error occurred while sending your message.");
    });
  });
});
