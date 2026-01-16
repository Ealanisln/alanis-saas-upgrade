/**
 * Integration tests for i18n fallback strategy (AWDP-31)
 *
 * These tests verify:
 * 1. Fallback behavior works end-to-end with real data structures
 * 2. Multiple document types work together correctly
 * 3. Edge cases are handled gracefully
 * 4. Coverage utilities provide accurate information
 */

import { describe, it, expect, beforeEach } from "vitest";
import {
  getLocalizedValue,
  getLocalizedValueWithMetadata,
  localizePost,
  localizeCategory,
  localizeAuthor,
  hasTranslation,
  getAvailableLocales,
  getPostTranslationCoverage,
  clearMissingTranslationsLog,
  type LocalizationMetadata,
} from "../i18n";
import type { SanityPost, SanityCategory, SanityAuthor } from "../types";

// Helper to create realistic i18n fields
const createI18nField = <T>(values: Record<string, T>) =>
  Object.entries(values).map(([key, value]) => ({ _key: key, value }));

// Realistic mock data simulating Sanity CMS responses
const createRealisticPost = (config: {
  hasSpanish: boolean;
  partialSpanish?: boolean;
}): SanityPost => ({
  _id: `post-${Date.now()}`,
  _type: "post",
  _createdAt: "2024-01-15T10:00:00.000Z",
  _updatedAt: "2024-06-20T15:30:00.000Z",
  _rev: "abc123",
  title: config.hasSpanish
    ? createI18nField({
        en: "Building Modern Web Applications with Next.js",
        es: "Construyendo Aplicaciones Web Modernas con Next.js",
      })
    : createI18nField({
        en: "Building Modern Web Applications with Next.js",
      }),
  smallDescription: config.partialSpanish
    ? createI18nField({
        en: "Learn how to build scalable, performant web applications using Next.js 15 and React 19.",
      })
    : config.hasSpanish
      ? createI18nField({
          en: "Learn how to build scalable, performant web applications using Next.js 15 and React 19.",
          es: "Aprende a construir aplicaciones web escalables y de alto rendimiento con Next.js 15 y React 19.",
        })
      : createI18nField({
          en: "Learn how to build scalable, performant web applications using Next.js 15 and React 19.",
        }),
  body: config.hasSpanish
    ? createI18nField({
        en: [
          {
            _type: "block",
            _key: "block1",
            children: [
              { _type: "span", text: "Next.js is a powerful framework..." },
            ],
          },
        ],
        es: [
          {
            _type: "block",
            _key: "block1",
            children: [
              {
                _type: "span",
                text: "Next.js es un framework potente...",
              },
            ],
          },
        ],
      })
    : createI18nField({
        en: [
          {
            _type: "block",
            _key: "block1",
            children: [
              { _type: "span", text: "Next.js is a powerful framework..." },
            ],
          },
        ],
      }),
  slug: { _type: "slug", current: "building-modern-web-apps-nextjs" },
  mainImage: {
    _type: "image",
    asset: { _ref: "image-abc123", _type: "reference" },
  },
  publishedAt: "2024-06-20T12:00:00.000Z",
});

const createRealisticCategory = (hasSpanish: boolean): SanityCategory => ({
  _id: `category-${Date.now()}`,
  _type: "category",
  _createdAt: "2024-01-01T00:00:00.000Z",
  _updatedAt: "2024-01-01T00:00:00.000Z",
  _rev: "def456",
  title: hasSpanish
    ? createI18nField({ en: "Web Development", es: "Desarrollo Web" })
    : createI18nField({ en: "Web Development" }),
  description: hasSpanish
    ? createI18nField({
        en: "Articles about web development technologies",
        es: "Artículos sobre tecnologías de desarrollo web",
      })
    : createI18nField({
        en: "Articles about web development technologies",
      }),
  slug: { _type: "slug", current: "web-development" },
});

const createRealisticAuthor = (hasSpanish: boolean): SanityAuthor => ({
  _id: `author-${Date.now()}`,
  _type: "author",
  _createdAt: "2024-01-01T00:00:00.000Z",
  _updatedAt: "2024-01-01T00:00:00.000Z",
  _rev: "ghi789",
  name: "Emmanuel Alanis",
  bio: hasSpanish
    ? createI18nField({
        en: "Full-stack developer specializing in React and Node.js. Passionate about building great user experiences.",
        es: "Desarrollador full-stack especializado en React y Node.js. Apasionado por crear excelentes experiencias de usuario.",
      })
    : createI18nField({
        en: "Full-stack developer specializing in React and Node.js. Passionate about building great user experiences.",
      }),
  slug: { _type: "slug", current: "emmanuel-alanis" },
  image: {
    _type: "image",
    asset: { _ref: "image-author123", _type: "reference" },
  },
});

describe("i18n Integration Tests", () => {
  beforeEach(() => {
    clearMissingTranslationsLog();
  });

  describe("Complete blog post localization workflow", () => {
    it("should localize a fully translated post correctly", () => {
      const post = createRealisticPost({ hasSpanish: true });
      const localized = localizePost(post, "es", { trackFallbacks: false });

      expect(localized).not.toBeNull();
      expect(localized?.title).toBe(
        "Construyendo Aplicaciones Web Modernas con Next.js",
      );
      expect(localized?.smallDescription).toContain("Aprende a construir");
      expect(localized?.body).toHaveLength(1);
    });

    it("should fall back to English for untranslated post", () => {
      const post = createRealisticPost({ hasSpanish: false });
      const localized = localizePost(post, "es", { trackFallbacks: false });

      expect(localized).not.toBeNull();
      expect(localized?.title).toBe(
        "Building Modern Web Applications with Next.js",
      );
      expect(localized?.smallDescription).toContain("Learn how to build");
    });

    it("should handle partially translated post with metadata", () => {
      const post = createRealisticPost({
        hasSpanish: true,
        partialSpanish: true,
      });
      const localized = localizePost(post, "es", {
        trackFallbacks: false,
        includeMetadata: true,
      });

      expect(localized).not.toBeNull();
      // Title should be in Spanish
      expect(localized?.title).toContain("Construyendo");
      // Description should fall back to English
      expect(localized?.smallDescription).toContain("Learn how to build");

      // Check metadata
      const metadata = (
        localized as { _localizationMetadata?: LocalizationMetadata }
      )?._localizationMetadata;
      expect(metadata).toBeDefined();
      expect(metadata?.usedFallback).toBe(true);
      expect(metadata?.fallbackFields).toContain("smallDescription");
      expect(metadata?.fallbackFields).not.toContain("title");
    });
  });

  describe("Category and author localization", () => {
    it("should localize category with full translations", () => {
      const category = createRealisticCategory(true);
      const localized = localizeCategory(category, "es", {
        trackFallbacks: false,
      });

      expect(localized?.title).toBe("Desarrollo Web");
      expect(localized?.description).toContain("Artículos sobre");
    });

    it("should fall back category to English", () => {
      const category = createRealisticCategory(false);
      const localized = localizeCategory(category, "es", {
        trackFallbacks: false,
      });

      expect(localized?.title).toBe("Web Development");
      expect(localized?.description).toContain("Articles about");
    });

    it("should localize author bio correctly", () => {
      const author = createRealisticAuthor(true);
      const localized = localizeAuthor(author, "es", { trackFallbacks: false });

      expect(localized?.bio).toContain("Desarrollador full-stack");
    });

    it("should preserve non-localized author fields", () => {
      const author = createRealisticAuthor(true);
      const localized = localizeAuthor(author, "es", { trackFallbacks: false });

      expect(localized?.name).toBe("Emmanuel Alanis");
      expect(localized?.image).toBeDefined();
    });
  });

  describe("Translation coverage reporting", () => {
    it("should report 100% coverage for fully translated post", () => {
      const post = createRealisticPost({ hasSpanish: true });
      const coverage = getPostTranslationCoverage(post, "es");

      expect(coverage.isFullyTranslated).toBe(true);
      expect(coverage.coveragePercentage).toBe(100);
      expect(coverage.missingFields).toHaveLength(0);
    });

    it("should report 0% coverage for untranslated post", () => {
      const post = createRealisticPost({ hasSpanish: false });
      const coverage = getPostTranslationCoverage(post, "es");

      expect(coverage.isFullyTranslated).toBe(false);
      expect(coverage.coveragePercentage).toBe(0);
      expect(coverage.missingFields).toContain("title");
      expect(coverage.missingFields).toContain("smallDescription");
      expect(coverage.missingFields).toContain("body");
    });

    it("should report partial coverage for partially translated post", () => {
      const post = createRealisticPost({
        hasSpanish: true,
        partialSpanish: true,
      });
      const coverage = getPostTranslationCoverage(post, "es");

      expect(coverage.isFullyTranslated).toBe(false);
      expect(coverage.coveragePercentage).toBeGreaterThan(0);
      expect(coverage.coveragePercentage).toBeLessThan(100);
      expect(coverage.translatedFields).toContain("title");
      expect(coverage.missingFields).toContain("smallDescription");
    });
  });

  describe("Batch processing multiple documents", () => {
    it("should process multiple posts with mixed translation status", () => {
      const posts = [
        createRealisticPost({ hasSpanish: true }),
        createRealisticPost({ hasSpanish: false }),
        createRealisticPost({ hasSpanish: true, partialSpanish: true }),
      ];

      const localizedPosts = posts.map((post) =>
        localizePost(post, "es", { trackFallbacks: false }),
      );

      // All should be non-null
      expect(localizedPosts.every((p) => p !== null)).toBe(true);

      // All should have string titles
      expect(localizedPosts.every((p) => typeof p?.title === "string")).toBe(
        true,
      );

      // First should be Spanish
      expect(localizedPosts[0]?.title).toContain("Construyendo");
      // Second should be English fallback
      expect(localizedPosts[1]?.title).toContain("Building");
      // Third should be Spanish title
      expect(localizedPosts[2]?.title).toContain("Construyendo");
    });

    it("should correctly identify which posts need translation", () => {
      const posts = [
        createRealisticPost({ hasSpanish: true }),
        createRealisticPost({ hasSpanish: false }),
        createRealisticPost({ hasSpanish: true, partialSpanish: true }),
      ];

      const needsTranslation = posts.filter((post) => {
        const coverage = getPostTranslationCoverage(post, "es");
        return !coverage.isFullyTranslated;
      });

      expect(needsTranslation).toHaveLength(2);
    });
  });

  describe("Edge cases and resilience", () => {
    it("should handle post with completely empty i18n fields", () => {
      const post: SanityPost = {
        _id: "empty-post",
        _type: "post",
        _createdAt: "2024-01-01T00:00:00.000Z",
        _updatedAt: "2024-01-01T00:00:00.000Z",
        _rev: "xyz",
        title: [],
        smallDescription: [],
        body: [],
        slug: { _type: "slug", current: "empty-post" },
      };

      const localized = localizePost(post, "es", { trackFallbacks: false });

      expect(localized).not.toBeNull();
      expect(localized?.title).toBe("Untitled");
      expect(localized?.smallDescription).toBe("");
      expect(localized?.body).toEqual([]);
    });

    it("should handle undefined i18n fields", () => {
      const post = {
        _id: "partial-post",
        _type: "post",
        _createdAt: "2024-01-01T00:00:00.000Z",
        _updatedAt: "2024-01-01T00:00:00.000Z",
        _rev: "xyz",
        title: undefined,
        slug: { _type: "slug", current: "partial-post" },
      } as unknown as SanityPost;

      const localized = localizePost(post, "es", { trackFallbacks: false });

      expect(localized).not.toBeNull();
      expect(localized?.title).toBe("Untitled");
    });

    it("should handle mixed _key and language field formats", () => {
      const mixedField = [
        { _key: "en", value: "English value" },
        { language: "es", value: "Spanish value" },
      ];

      expect(getLocalizedValue(mixedField, "en")).toBe("English value");
      expect(getLocalizedValue(mixedField, "es")).toBe("Spanish value");
    });
  });

  describe("Locale detection utilities", () => {
    it("should correctly identify available locales across documents", () => {
      const post = createRealisticPost({ hasSpanish: true });

      const titleLocales = getAvailableLocales(post.title);
      expect(titleLocales).toContain("en");
      expect(titleLocales).toContain("es");
    });

    it("should correctly check translation existence", () => {
      const post = createRealisticPost({ hasSpanish: false });

      expect(hasTranslation(post.title, "en")).toBe(true);
      expect(hasTranslation(post.title, "es")).toBe(false);
      expect(hasTranslation(post.title, "fr")).toBe(false);
    });
  });

  describe("Metadata and source tracking", () => {
    it("should track the source of localized values", () => {
      const post = createRealisticPost({ hasSpanish: false });

      const titleResult = getLocalizedValueWithMetadata(post.title, "es", {
        logFallback: false,
      });

      expect(titleResult.source).toBe("fallback");
      expect(titleResult.requestedLocale).toBe("es");
      expect(titleResult.actualLocale).toBe("en");
    });

    it("should report requested source for available translations", () => {
      const post = createRealisticPost({ hasSpanish: true });

      const titleResult = getLocalizedValueWithMetadata(post.title, "es", {
        logFallback: false,
      });

      expect(titleResult.source).toBe("requested");
      expect(titleResult.actualLocale).toBe("es");
    });
  });
});
