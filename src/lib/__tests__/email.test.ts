import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { sendContactEmail, type ContactEmailData } from "../email";

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("resend", () => ({
  Resend: vi.fn(() => ({ emails: { send: mockSend } })),
}));

function makeData(overrides: Partial<ContactEmailData> = {}): ContactEmailData {
  return {
    name: "Jane Doe",
    email: "jane@example.com",
    message: "Hello there",
    subject: "Opportunity for Emmanuel — from Jane Doe",
    ...overrides,
  };
}

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.stubEnv("RESEND_API_KEY", "re_test_key");
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  it("returns false without sending when RESEND_API_KEY is unset", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    await expect(sendContactEmail(makeData())).resolves.toBe(false);
    expect(mockSend).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith(
      "RESEND_API_KEY not configured. Contact email not sent.",
    );
  });

  it("returns true and sends with reply-to set to the sender on success", async () => {
    mockSend.mockResolvedValue({ error: null });

    await expect(sendContactEmail(makeData())).resolves.toBe(true);

    expect(mockSend).toHaveBeenCalledTimes(1);
    const payload = mockSend.mock.calls[0][0];
    expect(payload.replyTo).toBe("jane@example.com");
    expect(payload.subject).toBe("Opportunity for Emmanuel — from Jane Doe");
    expect(payload.html).toContain("Jane Doe");
    expect(payload.html).toContain("Hello there");
  });

  it("returns false when Resend responds with an error", async () => {
    mockSend.mockResolvedValue({ error: { message: "invalid domain" } });

    await expect(sendContactEmail(makeData())).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith("Error sending contact email:", {
      message: "invalid domain",
    });
  });

  it("returns false when the Resend client throws", async () => {
    mockSend.mockRejectedValue(new Error("boom"));

    await expect(sendContactEmail(makeData())).resolves.toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      "Error sending contact email:",
      expect.any(Error),
    );
  });

  describe("HTML escaping", () => {
    it("escapes script tags in the message", async () => {
      mockSend.mockResolvedValue({ error: null });

      await sendContactEmail(
        makeData({ message: '<script>alert("xss")</script>' }),
      );

      const html = mockSend.mock.calls[0][0].html as string;
      expect(html).not.toContain("<script>");
      expect(html).toContain(
        "&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;",
      );
    });

    it("escapes HTML in the name and email fields", async () => {
      mockSend.mockResolvedValue({ error: null });

      await sendContactEmail(
        makeData({
          name: 'Jane <img src=x onerror="alert(1)">',
          email: '"quotes"&<brackets>@example.com',
        }),
      );

      const html = mockSend.mock.calls[0][0].html as string;
      expect(html).not.toContain("<img");
      expect(html).toContain(
        "Jane &lt;img src=x onerror=&quot;alert(1)&quot;&gt;",
      );
      expect(html).toContain(
        "&quot;quotes&quot;&amp;&lt;brackets&gt;@example.com",
      );
    });

    it("escapes ampersands and single quotes", async () => {
      mockSend.mockResolvedValue({ error: null });

      await sendContactEmail(makeData({ message: "Tom & Jerry's day" }));

      const html = mockSend.mock.calls[0][0].html as string;
      expect(html).toContain("Tom &amp; Jerry&#39;s day");
    });
  });
});
