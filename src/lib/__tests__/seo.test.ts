import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  generateMetadata,
  generatePersonStructuredData,
  generateWebsiteStructuredData,
  generateArticleStructuredData,
  generateAlternates,
  generateLocalizedUrl,
  getLocaleCode,
  generateBreadcrumbs,
} from "../seo";

// Mock the i18n config
vi.mock("@/config/i18n", () => ({
  siteConfig: {
    url: "https://test.alanis.dev",
    name: "Test Site",
    author: "Test Author",
    contact: { email: "test@test.com" },
    social: {
      github: "https://github.com/test",
      linkedin: "https://linkedin.com/test",
      twitter: "https://twitter.com/test",
    },
    images: {
      logo: "/images/logo.png",
      ogImage: "/opengraph-image",
    },
  },
  isValidLocale: (locale: string) => ["en", "es"].includes(locale),
  locales: ["en", "es"] as const,
  defaultLocale: "en" as const,
}));

describe("seo utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateMetadata", () => {
    it("appends site name to title when not present", () => {
      const metadata = generateMetadata({
        title: "My Page",
        description: "Test description",
      });

      expect(metadata.title).toBe("My Page | Test Site");
    });

    it("does not duplicate site name if already in title", () => {
      const metadata = generateMetadata({
        title: "My Page | Test Site",
        description: "Test description",
      });

      expect(metadata.title).toBe("My Page | Test Site");
    });

    it("sets description correctly", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "This is a test description",
      });

      expect(metadata.description).toBe("This is a test description");
    });

    it("handles empty keywords array", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
        keywords: [],
      });

      expect(metadata.keywords).toBeUndefined();
    });

    it("handles populated keywords array", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
        keywords: ["react", "nextjs", "typescript"],
      });

      expect(metadata.keywords).toEqual(["react", "nextjs", "typescript"]);
    });

    it("generates correct canonical URL from path", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
        canonical: "/about",
      });

      expect(metadata.alternates?.canonical).toBe(
        "https://test.alanis.dev/about",
      );
    });

    it("sets correct OpenGraph metadata", () => {
      const metadata = generateMetadata({
        title: "OG Test",
        description: "OG Description",
        ogImage: "/custom-og-image",
        canonical: "/test",
      });

      expect(metadata.openGraph).toMatchObject({
        type: "website",
        locale: "es_ES",
        title: "OG Test | Test Site",
        description: "OG Description",
        siteName: "Test Site",
      });
      expect(metadata.openGraph?.images).toEqual([
        {
          url: "/custom-og-image",
          width: 1200,
          height: 630,
          alt: "OG Test",
        },
      ]);
    });

    it("sets correct Twitter card metadata", () => {
      const metadata = generateMetadata({
        title: "Twitter Test",
        description: "Twitter Description",
      });

      expect(metadata.twitter).toMatchObject({
        card: "summary_large_image",
        title: "Twitter Test | Test Site",
        description: "Twitter Description",
        creator: "@ealanisln",
      });
    });

    it("handles article type with publishedTime, author, section", () => {
      const metadata = generateMetadata({
        title: "Blog Post",
        description: "Article description",
        type: "article",
        publishedTime: "2024-01-15T10:00:00Z",
        modifiedTime: "2024-01-20T12:00:00Z",
        author: "John Doe",
        section: "Technology",
      });

      expect(metadata.openGraph?.type).toBe("article");
      // Article-specific fields are spread into openGraph
      const og = metadata.openGraph as Record<string, unknown>;
      expect(og.publishedTime).toBe("2024-01-15T10:00:00Z");
      expect(og.modifiedTime).toBe("2024-01-20T12:00:00Z");
      expect(og.authors).toEqual(["John Doe"]);
      expect(og.section).toBe("Technology");
    });

    it("sets default author when not provided", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
      });

      expect(metadata.authors).toEqual([{ name: "Test Site" }]);
    });

    it("sets provided author", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
        author: "Custom Author",
      });

      expect(metadata.authors).toEqual([{ name: "Custom Author" }]);
    });

    it("sets correct robots metadata", () => {
      const metadata = generateMetadata({
        title: "Test",
        description: "Test",
      });

      expect(metadata.robots).toMatchObject({
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      });
    });
  });

  describe("generatePersonStructuredData", () => {
    it("returns valid Person schema structure", () => {
      const data = generatePersonStructuredData();

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("Person");
      expect(data.name).toBe("Test Author");
      expect(data.alternateName).toBe("Test Site");
    });

    it("contains correct social links and job info", () => {
      const data = generatePersonStructuredData();

      expect(data.sameAs).toContain("https://github.com/test");
      expect(data.sameAs).toContain("https://linkedin.com/test");
      expect(data.sameAs).toContain("https://twitter.com/test");
      expect(data.jobTitle).toBe("Full-Stack Developer");
      expect(data.worksFor).toEqual({
        "@type": "Organization",
        name: "Freelance",
      });
    });

    it("contains knowsAbout technologies", () => {
      const data = generatePersonStructuredData();

      expect(data.knowsAbout).toContain("React");
      expect(data.knowsAbout).toContain("Next.js");
      expect(data.knowsAbout).toContain("TypeScript");
    });
  });

  describe("generateWebsiteStructuredData", () => {
    it("returns valid ProfessionalService schema structure", () => {
      const data = generateWebsiteStructuredData();

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("ProfessionalService");
      expect(data.name).toBe("Alanis Dev - Desarrollo Web");
      expect(data.url).toBe("https://test.alanis.dev");
    });

    it("contains correct offer catalog", () => {
      const data = generateWebsiteStructuredData();

      expect(data.hasOfferCatalog).toBeDefined();
      expect(data.hasOfferCatalog["@type"]).toBe("OfferCatalog");
      expect(data.hasOfferCatalog.itemListElement).toHaveLength(3);

      const serviceNames = data.hasOfferCatalog.itemListElement.map(
        (item: { itemOffered: { name: string } }) => item.itemOffered.name,
      );
      expect(serviceNames).toContain("Desarrollo de Aplicaciones Web");
      expect(serviceNames).toContain("E-commerce");
      expect(serviceNames).toContain("Landing Pages");
    });

    it("contains founder information", () => {
      const data = generateWebsiteStructuredData();

      expect(data.founder).toMatchObject({
        "@type": "Person",
        name: "Test Author",
        jobTitle: "Full-Stack Developer",
      });
    });
  });

  describe("generateArticleStructuredData", () => {
    it("returns valid BlogPosting schema", () => {
      const data = generateArticleStructuredData({
        title: "Test Article",
        description: "Test description",
        url: "https://test.alanis.dev/blog/test-article",
        publishedTime: "2024-01-15T10:00:00Z",
      });

      expect(data["@context"]).toBe("https://schema.org");
      expect(data["@type"]).toBe("BlogPosting");
      expect(data.headline).toBe("Test Article");
      expect(data.description).toBe("Test description");
      expect(data.datePublished).toBe("2024-01-15T10:00:00Z");
    });

    it("uses provided author or falls back to default", () => {
      const withAuthor = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
        author: "Custom Author",
      });

      const withoutAuthor = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
      });

      expect(withAuthor.author.name).toBe("Custom Author");
      expect(withoutAuthor.author.name).toBe("Test Author");
    });

    it("handles optional modifiedTime", () => {
      const withModified = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
        modifiedTime: "2024-01-20",
      });

      const withoutModified = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
      });

      expect(withModified.dateModified).toBe("2024-01-20");
      expect(withoutModified.dateModified).toBe("2024-01-15"); // Falls back to publishedTime
    });

    it("handles optional section", () => {
      const withSection = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
        section: "Technology",
      });

      const withoutSection = generateArticleStructuredData({
        title: "Test",
        description: "Test",
        url: "https://test.com",
        publishedTime: "2024-01-15",
      });

      expect(withSection.articleSection).toBe("Technology");
      expect(withoutSection.articleSection).toBe("Web Development"); // Default
    });
  });

  describe("generateAlternates", () => {
    it("returns correct canonical for English locale (root path)", () => {
      const result = generateAlternates("en", "/about");

      expect(result.canonical).toBe("https://test.alanis.dev/about");
    });

    it("returns correct canonical for Spanish locale (/es prefix)", () => {
      const result = generateAlternates("es", "/about");

      expect(result.canonical).toBe("https://test.alanis.dev/es/about");
    });

    it("generates correct language links", () => {
      const result = generateAlternates("en", "/blog");

      expect(result.languages).toEqual({
        en: "https://test.alanis.dev/blog",
        es: "https://test.alanis.dev/es/blog",
        "x-default": "https://test.alanis.dev/blog",
      });
    });

    it("throws error on invalid locale", () => {
      expect(() => generateAlternates("fr", "/about")).toThrow(
        "Invalid locale: fr",
      );
    });

    it("normalizes paths without leading slash", () => {
      const result = generateAlternates("en", "about");

      expect(result.canonical).toBe("https://test.alanis.dev/about");
    });
  });

  describe("generateLocalizedUrl", () => {
    it("returns root URL for English locale", () => {
      const url = generateLocalizedUrl("en", "/about");

      expect(url).toBe("https://test.alanis.dev/about");
    });

    it("returns /es prefixed URL for Spanish locale", () => {
      const url = generateLocalizedUrl("es", "/about");

      expect(url).toBe("https://test.alanis.dev/es/about");
    });

    it("throws error on invalid locale", () => {
      expect(() => generateLocalizedUrl("de", "/about")).toThrow(
        "Invalid locale: de",
      );
    });

    it("normalizes paths without leading slash", () => {
      const url = generateLocalizedUrl("en", "contact");

      expect(url).toBe("https://test.alanis.dev/contact");
    });
  });

  describe("getLocaleCode", () => {
    it("returns en_US for 'en' locale", () => {
      expect(getLocaleCode("en")).toBe("en_US");
    });

    it("returns es_ES for 'es' locale", () => {
      expect(getLocaleCode("es")).toBe("es_ES");
    });

    it("throws error on invalid locale", () => {
      expect(() => getLocaleCode("fr")).toThrow("Invalid locale: fr");
    });
  });

  describe("generateBreadcrumbs", () => {
    it("returns home breadcrumb for root path", () => {
      const breadcrumbs = generateBreadcrumbs("/");

      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0]).toEqual({
        name: "Home",
        url: "https://test.alanis.dev",
      });
    });

    it("generates correct breadcrumbs for nested paths", () => {
      const breadcrumbs = generateBreadcrumbs("/about");

      expect(breadcrumbs).toHaveLength(2);
      expect(breadcrumbs[0].name).toBe("Home");
      expect(breadcrumbs[1]).toEqual({
        name: "About",
        url: "https://test.alanis.dev/about",
      });
    });

    it("maps known segments to names", () => {
      const breadcrumbs = generateBreadcrumbs("/portfolio");

      expect(breadcrumbs[1].name).toBe("Portfolio");
    });

    it("uses segment as name for unknown paths", () => {
      const breadcrumbs = generateBreadcrumbs("/custom-page");

      expect(breadcrumbs[1].name).toBe("custom-page");
    });

    it("handles deeply nested paths", () => {
      const breadcrumbs = generateBreadcrumbs("/blog/my-post");

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[1].name).toBe("Blog");
      expect(breadcrumbs[2]).toEqual({
        name: "my-post",
        url: "https://test.alanis.dev/blog/my-post",
      });
    });

    it("handles locale prefix in path", () => {
      const breadcrumbs = generateBreadcrumbs("/es/about");

      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[1].name).toBe("ES");
      expect(breadcrumbs[2].name).toBe("About");
    });
  });
});
