import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { verifyTurnstileToken } from "../turnstile";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

describe("verifyTurnstileToken", () => {
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", mockFetch);
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("TURNSTILE_SECRET_KEY", "test-secret");
    vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  describe("graceful degradation", () => {
    it("resolves ok without calling fetch when Turnstile is unconfigured", async () => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "");

      await expect(verifyTurnstileToken("any-token")).resolves.toBe("ok");
      expect(mockFetch).not.toHaveBeenCalled();
      expect(console.warn).toHaveBeenCalledWith(
        "TURNSTILE_SECRET_KEY not configured. Skipping Turnstile verification.",
      );
    });

    it("fails closed when the site key is set but the secret is missing", async () => {
      vi.stubEnv("TURNSTILE_SECRET_KEY", "");
      vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");

      await expect(verifyTurnstileToken("any-token")).resolves.toBe(
        "unavailable",
      );
      expect(mockFetch).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalledWith(
        "NEXT_PUBLIC_TURNSTILE_SITE_KEY is set but TURNSTILE_SECRET_KEY is missing. Rejecting submission.",
      );
    });

    it("rejects without calling fetch when the token is empty", async () => {
      vi.stubEnv("NEXT_PUBLIC_TURNSTILE_SITE_KEY", "site-key");

      await expect(verifyTurnstileToken("")).resolves.toBe("rejected");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("returns unavailable for a missing token when the widget is never served", async () => {
      // secret set (beforeEach) but no site key: visitors can never solve
      // a challenge, so this is a server misconfig, not a bot signal
      await expect(verifyTurnstileToken("")).resolves.toBe("unavailable");
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("rejects oversized tokens without relaying them to Cloudflare", async () => {
      await expect(verifyTurnstileToken("x".repeat(2049))).resolves.toBe(
        "rejected",
      );
      expect(mockFetch).not.toHaveBeenCalled();
    });
  });

  describe("siteverify request", () => {
    it("resolves true when Cloudflare reports success", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await expect(verifyTurnstileToken("tok-123")).resolves.toBe("ok");

      expect(mockFetch).toHaveBeenCalledWith(
        VERIFY_URL,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            secret: "test-secret",
            response: "tok-123",
          }).toString(),
          signal: expect.any(AbortSignal),
        }),
      );
    });

    it("appends remoteip to the request body when provided", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      await verifyTurnstileToken("tok-123", "203.0.113.7");

      const body = mockFetch.mock.calls[0][1].body as string;
      expect(body).toContain("remoteip=203.0.113.7");
    });

    it("rejects when verification fails and logs the error codes", async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          success: false,
          "error-codes": ["invalid-input-response"],
        }),
      });

      await expect(verifyTurnstileToken("bad-token")).resolves.toBe("rejected");
      expect(console.error).toHaveBeenCalledWith(
        "Turnstile verification failed:",
        ["invalid-input-response"],
      );
    });

    it("returns unavailable when the siteverify response is not ok", async () => {
      mockFetch.mockResolvedValue({ ok: false, status: 503 });

      await expect(verifyTurnstileToken("tok-123")).resolves.toBe(
        "unavailable",
      );
      expect(console.error).toHaveBeenCalledWith(
        "Turnstile verification request failed:",
        503,
      );
    });

    it("returns unavailable when fetch throws", async () => {
      mockFetch.mockRejectedValue(new Error("network down"));

      await expect(verifyTurnstileToken("tok-123")).resolves.toBe(
        "unavailable",
      );
      expect(console.error).toHaveBeenCalledWith(
        "Turnstile verification error:",
        expect.any(Error),
      );
    });
  });
});
