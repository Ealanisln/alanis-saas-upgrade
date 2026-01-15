import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock next/cache
const mockRevalidatePath = vi.fn();
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}));

// Mock next-sanity/webhook
const mockParseBody = vi.fn();
vi.mock("next-sanity/webhook", () => ({
  parseBody: (req: NextRequest, secret: string) => mockParseBody(req, secret),
}));

// Helper to create mock NextRequest
function createMockRequest(body: object): NextRequest {
  return new NextRequest("http://localhost:3000/api/revalidate", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Helper to dynamically import POST after setting env
async function getPostHandler() {
  const routeModule = await import("../route");
  return routeModule.POST;
}

describe("POST /api/revalidate", () => {
  const originalEnv = process.env.SANITY_REVALIDATE_SECRET;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
    // Set default env for tests
    process.env.SANITY_REVALIDATE_SECRET = "test-secret";
  });

  afterEach(() => {
    // Restore original env
    process.env.SANITY_REVALIDATE_SECRET = originalEnv;
  });

  describe("validation", () => {
    it("returns 500 when SANITY_REVALIDATE_SECRET is not configured", async () => {
      process.env.SANITY_REVALIDATE_SECRET = "";
      const POST = await getPostHandler();

      const req = createMockRequest({ _type: "post" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe(
        "Missing SANITY_REVALIDATE_SECRET environment variable",
      );
    });

    it("returns 401 when signature is invalid", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: false,
        body: { _type: "post" },
      });

      const req = createMockRequest({ _type: "post" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.message).toBe("Invalid signature");
    });

    it("returns 400 when _type is missing", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: true,
        body: {},
      });

      const req = createMockRequest({});
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe("Bad request: missing _type");
    });
  });

  describe("revalidation for posts", () => {
    it("revalidates blog listing pages for all locales when post is updated", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: true,
        body: { _type: "post" },
      });

      const req = createMockRequest({ _type: "post" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.paths).toContain("/en/blog");
      expect(data.paths).toContain("/es/blog");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/en/blog");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/es/blog");
    });

    it("revalidates specific post pages when slug is provided", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: true,
        body: {
          _type: "post",
          slug: { current: "my-test-post" },
        },
      });

      const req = createMockRequest({
        _type: "post",
        slug: { current: "my-test-post" },
      });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.paths).toContain("/en/blog/my-test-post");
      expect(data.paths).toContain("/es/blog/my-test-post");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/en/blog/my-test-post");
      expect(mockRevalidatePath).toHaveBeenCalledWith("/es/blog/my-test-post");
    });

    it("includes timestamp in response", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: true,
        body: { _type: "post" },
      });

      const beforeTime = Date.now();
      const req = createMockRequest({ _type: "post" });
      const response = await POST(req);
      const data = await response.json();
      const afterTime = Date.now();

      expect(data.now).toBeGreaterThanOrEqual(beforeTime);
      expect(data.now).toBeLessThanOrEqual(afterTime);
    });
  });

  describe("non-post document types", () => {
    it("returns success with empty paths for unknown document types", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockResolvedValue({
        isValidSignature: true,
        body: { _type: "author" },
      });

      const req = createMockRequest({ _type: "author" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.revalidated).toBe(true);
      expect(data.paths).toHaveLength(0);
    });
  });

  describe("error handling", () => {
    it("returns 500 when parseBody throws an error", async () => {
      const POST = await getPostHandler();
      mockParseBody.mockRejectedValue(new Error("Failed to parse body"));

      const req = createMockRequest({ _type: "post" });
      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.message).toBe("Error revalidating");
      expect(data.error).toContain("Failed to parse body");
    });
  });
});
