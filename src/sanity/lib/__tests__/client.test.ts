import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock next-sanity to prevent validation errors when projectId is empty
vi.mock("next-sanity", () => ({
  createClient: vi.fn(() => ({
    fetch: vi.fn().mockResolvedValue([]),
  })),
}));

// Mock @sanity/image-url
vi.mock("@sanity/image-url", () => ({
  default: vi.fn(() => ({
    image: vi.fn(() => ({
      width: vi.fn().mockReturnThis(),
      height: vi.fn().mockReturnThis(),
      url: vi
        .fn()
        .mockReturnValue("https://cdn.sanity.io/images/test/test/test.png"),
    })),
  })),
}));

// Store original env
const originalEnv = { ...process.env };

describe("Sanity Client", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(console, "error").mockImplementation(() => {});
    // Set up default environment
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_SANITY_PROJECT_ID: "test-project",
      NEXT_PUBLIC_SANITY_DATASET: "test-dataset",
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    process.env = originalEnv;
  });

  describe("safeFetch", () => {
    it("returns empty array when Sanity is not configured", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "";
      process.env.NEXT_PUBLIC_SANITY_DATASET = "";

      const { safeFetch } = await import("../client");
      const result = await safeFetch("*[_type == 'post']");

      expect(result).toEqual([]);
      expect(console.warn).toHaveBeenCalledWith(
        "Sanity is not configured. Returning empty results.",
      );
    });

    it("returns empty array when projectId is ci-placeholder", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "ci-placeholder";

      const { safeFetch } = await import("../client");
      const result = await safeFetch("*[_type == 'post']");

      expect(result).toEqual([]);
    });
  });

  describe("safeFetchSingle", () => {
    it("returns null when Sanity is not configured", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "";

      const { safeFetchSingle } = await import("../client");
      const result = await safeFetchSingle("*[_type == 'post'][0]");

      expect(result).toBeNull();
      expect(console.warn).toHaveBeenCalledWith(
        "Sanity is not configured. Returning null.",
      );
    });

    it("returns null when projectId is ci-placeholder", async () => {
      process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = "ci-placeholder";

      const { safeFetchSingle } = await import("../client");
      const result = await safeFetchSingle("*[_type == 'post'][0]");

      expect(result).toBeNull();
    });
  });

  describe("client export", () => {
    it("exports a client with fetch method", async () => {
      const { client } = await import("../client");
      expect(client).toBeDefined();
      expect(typeof client.fetch).toBe("function");
    });
  });

  describe("urlFor export", () => {
    it("exports urlFor function", async () => {
      const { urlFor } = await import("../client");
      expect(urlFor).toBeDefined();
      expect(typeof urlFor).toBe("function");
    });

    it("urlFor returns an image builder object", async () => {
      const { urlFor } = await import("../client");
      const mockSource = {
        _type: "image",
        asset: { _ref: "image-abc123-100x100-png" },
      };
      const builder = urlFor(mockSource);

      // Image builder should have chainable methods
      expect(builder).toBeDefined();
      expect(typeof builder.width).toBe("function");
      expect(typeof builder.height).toBe("function");
      expect(typeof builder.url).toBe("function");
    });
  });
});
