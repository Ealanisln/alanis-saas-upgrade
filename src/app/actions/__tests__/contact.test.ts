import { getTranslations } from "next-intl/server";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { sendContactEmail } from "@/lib/email";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { submitContact, type ContactSubmission } from "../contact";

vi.mock("@/lib/email", () => ({ sendContactEmail: vi.fn() }));
vi.mock("@/lib/turnstile", () => ({ verifyTurnstileToken: vi.fn() }));
vi.mock("next-intl/server", () => ({ getTranslations: vi.fn() }));

const { mockHeaderGet } = vi.hoisted(() => ({ mockHeaderGet: vi.fn() }));
vi.mock("next/headers", () => ({
  headers: async () => ({ get: mockHeaderGet }),
}));

const mockVerify = vi.mocked(verifyTurnstileToken);
const mockSend = vi.mocked(sendContactEmail);
const mockGetTranslations = vi.mocked(getTranslations);

function makeInput(
  overrides: Partial<ContactSubmission> = {},
): ContactSubmission {
  return {
    name: "Jane Doe",
    email: "Jane@Example.com",
    message: "I'd like to hire you.",
    locale: "en",
    turnstileToken: "tok-123",
    ...overrides,
  };
}

describe("submitContact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockHeaderGet.mockReturnValue(null);
    mockVerify.mockResolvedValue("ok");
    mockSend.mockResolvedValue(true);
    // Echo translator: t("mailSubject") → "mailSubject:"
    mockGetTranslations.mockResolvedValue(
      ((key: string) => `${key}:`) as unknown as Awaited<
        ReturnType<typeof getTranslations>
      >,
    );
  });

  describe("input validation", () => {
    it.each([
      ["empty name", { name: "" }],
      ["whitespace-only name", { name: "   " }],
      ["empty email", { email: "" }],
      ["empty message", { message: "" }],
      ["name over 100 chars", { name: "a".repeat(101) }],
      ["email over 200 chars", { email: `${"a".repeat(195)}@ex.com` }],
      ["message over 1200 chars", { message: "a".repeat(1201) }],
      ["email without @", { email: "not-an-email" }],
      ["email without TLD", { email: "user@host" }],
      ["email with spaces", { email: "user name@example.com" }],
      ["name with a newline (header injection)", { name: "Jane\r\nBcc: x" }],
    ])("rejects %s without verifying or sending", async (_label, overrides) => {
      const result = await submitContact(makeInput(overrides));

      expect(result).toEqual({ ok: false, code: "invalid" });
      expect(mockVerify).not.toHaveBeenCalled();
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("accepts boundary lengths (100/200/1200)", async () => {
      const result = await submitContact(
        makeInput({
          name: "a".repeat(100),
          email: `${"a".repeat(193)}@ex.com`, // exactly 200 chars
          message: "a".repeat(1200),
        }),
      );

      expect(result).toEqual({ ok: true });
    });
  });

  describe("Turnstile verification", () => {
    it("returns a verification error when the token is rejected", async () => {
      mockVerify.mockResolvedValue("rejected");

      const result = await submitContact(makeInput());

      expect(result).toEqual({ ok: false, code: "verification" });
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("maps an unavailable verifier to the send error (mailto fallback)", async () => {
      mockVerify.mockResolvedValue("unavailable");

      const result = await submitContact(makeInput());

      expect(result).toEqual({ ok: false, code: "send" });
      expect(mockSend).not.toHaveBeenCalled();
    });

    it("passes an empty string when no token was provided", async () => {
      await submitContact(makeInput({ turnstileToken: undefined }));

      expect(mockVerify).toHaveBeenCalledWith("", undefined);
    });

    it("forwards the first x-forwarded-for hop as the remote IP", async () => {
      mockHeaderGet.mockReturnValue("203.0.113.7, 10.0.0.1");

      await submitContact(makeInput());

      expect(mockHeaderGet).toHaveBeenCalledWith("x-forwarded-for");
      expect(mockVerify).toHaveBeenCalledWith("tok-123", "203.0.113.7");
    });
  });

  describe("email delivery", () => {
    it("sends the trimmed, lowercased submission with a localized subject", async () => {
      const result = await submitContact(
        makeInput({ name: "  Jane Doe  ", email: "  Jane@Example.COM " }),
      );

      expect(result).toEqual({ ok: true });
      expect(mockGetTranslations).toHaveBeenCalledWith({
        locale: "en",
        namespace: "portfolio.contact",
      });
      expect(mockSend).toHaveBeenCalledWith({
        name: "Jane Doe",
        email: "jane@example.com",
        message: "I'd like to hire you.",
        subject: "mailSubject:Jane Doe",
      });
    });

    it("uses the requested locale when it is supported", async () => {
      await submitContact(makeInput({ locale: "es" }));

      expect(mockGetTranslations).toHaveBeenCalledWith({
        locale: "es",
        namespace: "portfolio.contact",
      });
    });

    it("falls back to the default locale for unsupported locales", async () => {
      await submitContact(makeInput({ locale: "fr" }));

      expect(mockGetTranslations).toHaveBeenCalledWith({
        locale: "en",
        namespace: "portfolio.contact",
      });
    });

    it("returns a send error when email delivery fails", async () => {
      mockSend.mockResolvedValue(false);

      const result = await submitContact(makeInput());

      expect(result).toEqual({ ok: false, code: "send" });
    });
  });
});
