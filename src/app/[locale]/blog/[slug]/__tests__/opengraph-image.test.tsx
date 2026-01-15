import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { createClient } from "next-sanity";

// Mock next/og ImageResponse
vi.mock("next/og", () => ({
  ImageResponse: vi.fn().mockImplementation((element, options) => ({
    _type: "ImageResponse",
    element,
    options,
  })),
}));

// Mock next-sanity client
vi.mock("next-sanity", () => ({
  createClient: vi.fn(() => ({
    fetch: vi.fn(),
  })),
}));

// Mock global fetch for image fetching
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Blog Post OpenGraph Image", () => {
  let mockSanityFetch: Mock;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();

    // Setup Sanity mock
    mockSanityFetch = vi.fn();
    (createClient as Mock).mockReturnValue({
      fetch: mockSanityFetch,
    });

    // Setup fetch mock for image loading
    mockFetch.mockResolvedValue({
      ok: true,
      headers: new Headers({ "content-type": "image/jpeg" }),
      arrayBuffer: async () => new ArrayBuffer(8),
    });
  });

  describe("with cover image", () => {
    it("returns ImageResponse with cover image only (no text overlay)", async () => {
      // Mock post with cover image
      mockSanityFetch.mockResolvedValue({
        title: [{ _key: "en", value: "Test Blog Post" }],
        mainImage: {
          asset: {
            _ref: "image-abc123-1200x630-jpg",
            _type: "reference",
          },
        },
      });

      // Dynamically import to get fresh module with mocks
      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "test-post", locale: "en" }),
      });

      expect(result._type).toBe("ImageResponse");
      expect(result.options).toEqual({ width: 1200, height: 630 });

      // Verify the element structure - should just have an img, no text overlays
      const element = result.element;
      expect(element.type).toBe("div");

      // Find the img element in the children
      const imgElement = element.props.children;
      expect(imgElement.type).toBe("img");
      expect(imgElement.props.style.objectFit).toBe("cover");
      expect(imgElement.props.style.width).toBe("100%");
      expect(imgElement.props.style.height).toBe("100%");
    });

    it("fetches post data with correct GROQ query", async () => {
      mockSanityFetch.mockResolvedValue({
        title: [{ _key: "en", value: "Test" }],
        mainImage: {
          asset: { _ref: "image-test-800x600-png", _type: "reference" },
        },
      });

      const { default: Image } = await import("../opengraph-image");

      await Image({
        params: Promise.resolve({ slug: "my-slug", locale: "en" }),
      });

      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.stringContaining('_type == "post"'),
        { slug: "my-slug" },
      );
      // Verify author is NOT in the query (was removed)
      expect(mockSanityFetch).toHaveBeenCalledWith(
        expect.not.stringContaining("author"),
        expect.anything(),
      );
    });
  });

  describe("without cover image", () => {
    it("returns fallback with title when no cover image", async () => {
      // Mock post without cover image
      mockSanityFetch.mockResolvedValue({
        title: [{ _key: "en", value: "Blog Post Without Image" }],
        mainImage: null,
      });

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "no-image-post", locale: "en" }),
      });

      expect(result._type).toBe("ImageResponse");
      expect(result.options).toEqual({ width: 1200, height: 630 });

      // Fallback should show the title
      const element = result.element;
      expect(element.type).toBe("div");
      // Fallback has gradient background
      expect(element.props.style.background).toContain("linear-gradient");
    });

    it("returns fallback when post not found", async () => {
      mockSanityFetch.mockResolvedValue(null);

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "non-existent", locale: "en" }),
      });

      expect(result._type).toBe("ImageResponse");
      // Should use "Blog" as default title
      const element = result.element;
      expect(element.props.style.background).toContain("linear-gradient");
    });
  });

  describe("localization", () => {
    it("extracts title for requested locale", async () => {
      mockSanityFetch.mockResolvedValue({
        title: [
          { _key: "en", value: "English Title" },
          { _key: "es", value: "Titulo en Espanol" },
        ],
        mainImage: null,
      });

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "test", locale: "es" }),
      });

      // The fallback shows title, which should be Spanish
      expect(result._type).toBe("ImageResponse");
    });

    it("falls back to English when requested locale not found", async () => {
      mockSanityFetch.mockResolvedValue({
        title: [{ _key: "en", value: "English Only" }],
        mainImage: null,
      });

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "test", locale: "es" }),
      });

      expect(result._type).toBe("ImageResponse");
    });
  });

  describe("error handling", () => {
    it("returns fallback on Sanity fetch error", async () => {
      mockSanityFetch.mockRejectedValue(new Error("Sanity error"));

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "error-post", locale: "en" }),
      });

      expect(result._type).toBe("ImageResponse");
      // Error fallback should have gradient background
      expect(result.element.props.style.background).toContain(
        "linear-gradient",
      );
    });

    it("returns fallback when image fetch fails", async () => {
      mockSanityFetch.mockResolvedValue({
        title: [{ _key: "en", value: "Test" }],
        mainImage: {
          asset: { _ref: "image-test-800x600-png", _type: "reference" },
        },
      });

      // Make image fetch fail
      mockFetch.mockResolvedValue({
        ok: false,
      });

      const { default: Image } = await import("../opengraph-image");

      const result = await Image({
        params: Promise.resolve({ slug: "test", locale: "en" }),
      });

      // Should return fallback since image couldn't be fetched
      expect(result._type).toBe("ImageResponse");
      expect(result.element.props.style.background).toContain(
        "linear-gradient",
      );
    });
  });

  describe("exports", () => {
    it("exports correct metadata", async () => {
      const module = await import("../opengraph-image");

      expect(module.size).toEqual({ width: 1200, height: 630 });
      expect(module.contentType).toBe("image/png");
      expect(module.alt).toBe("Alanis Dev Blog");
      expect(module.runtime).toBe("edge");
    });
  });
});
