import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateOGImage,
  routeConfigs,
  size,
  contentType,
  type OGContent,
} from "../og-utils";

// Mock next/og ImageResponse
vi.mock("next/og", () => ({
  ImageResponse: vi.fn().mockImplementation((element, options) => ({
    _type: "ImageResponse",
    element,
    options,
  })),
}));

describe("og-utils", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("exports", () => {
    it("exports correct size dimensions", () => {
      expect(size).toEqual({
        width: 1200,
        height: 630,
      });
    });

    it("exports correct content type", () => {
      expect(contentType).toBe("image/png");
    });
  });

  describe("generateOGImage", () => {
    const testContent: OGContent = {
      title: "Test Title",
      subtitle: "Test Subtitle",
      icon: "T",
      topics: ["React", "Next.js"],
      url: "test.dev",
    };

    it("returns ImageResponse instance", () => {
      const result = generateOGImage(testContent);

      expect(result).toBeDefined();
      expect(result._type).toBe("ImageResponse");
    });

    it("uses correct size (1200x630)", () => {
      const result = generateOGImage(testContent);

      expect(result.options).toEqual({
        width: 1200,
        height: 630,
      });
    });

    it("accepts content with all properties", () => {
      const fullContent: OGContent = {
        title: "Full Title",
        subtitle: "Full Subtitle",
        icon: "F",
        topics: ["Topic1", "Topic2", "Topic3"],
        url: "full.example.com",
      };

      const result = generateOGImage(fullContent);

      expect(result).toBeDefined();
      expect(result._type).toBe("ImageResponse");
    });

    it("handles content without optional url", () => {
      const contentWithoutUrl: OGContent = {
        title: "No URL",
        subtitle: "Subtitle",
        icon: "N",
        topics: ["Topic"],
      };

      const result = generateOGImage(contentWithoutUrl);

      expect(result).toBeDefined();
    });

    it("handles empty topics array", () => {
      const contentWithEmptyTopics: OGContent = {
        title: "Empty Topics",
        subtitle: "Subtitle",
        icon: "E",
        topics: [],
      };

      const result = generateOGImage(contentWithEmptyTopics);

      expect(result).toBeDefined();
    });
  });

  describe("routeConfigs", () => {
    const expectedRoutes = ["home", "blog", "about", "portafolio", "contacto"];

    it("contains all expected routes", () => {
      expectedRoutes.forEach((route) => {
        expect(routeConfigs).toHaveProperty(route);
      });
    });

    it("each config has required properties", () => {
      Object.values(routeConfigs).forEach((config) => {
        expect(config).toHaveProperty("title");
        expect(config).toHaveProperty("subtitle");
        expect(config).toHaveProperty("icon");
        expect(config).toHaveProperty("topics");
        expect(typeof config.title).toBe("string");
        expect(typeof config.subtitle).toBe("string");
        expect(typeof config.icon).toBe("string");
        expect(Array.isArray(config.topics)).toBe(true);
      });
    });

    it("topics arrays are non-empty", () => {
      Object.values(routeConfigs).forEach((config) => {
        expect(config.topics.length).toBeGreaterThan(0);
      });
    });

    it("URLs are correct for each route", () => {
      expect(routeConfigs.home.url).toBe("alanis.dev");
      expect(routeConfigs.blog.url).toBe("alanis.dev/blog");
      expect(routeConfigs.about.url).toBe("alanis.dev/about");
      expect(routeConfigs.portafolio.url).toBe("alanis.dev/portafolio");
      expect(routeConfigs.contacto.url).toBe("alanis.dev/contacto");
    });

    describe("individual route configs", () => {
      it("home config has correct structure", () => {
        expect(routeConfigs.home).toMatchObject({
          title: "Alanis Dev",
          icon: "A",
        });
        expect(routeConfigs.home.topics).toContain("Next.js");
        expect(routeConfigs.home.topics).toContain("React");
      });

      it("blog config has correct structure", () => {
        expect(routeConfigs.blog).toMatchObject({
          title: "Blog",
          icon: expect.any(String),
        });
      });

      it("about config has correct structure", () => {
        expect(routeConfigs.about).toMatchObject({
          title: "Sobre Mí",
          icon: expect.any(String),
        });
      });

      it("portafolio config has correct structure", () => {
        expect(routeConfigs.portafolio.title).toBe("portafolio");
        expect(routeConfigs.portafolio.topics).toContain("Proyectos");
      });

      it("contacto config has correct structure", () => {
        expect(routeConfigs.contacto.title).toBe("Contacto");
        expect(routeConfigs.contacto.topics).toContain("Servicios");
      });
    });
  });
});
