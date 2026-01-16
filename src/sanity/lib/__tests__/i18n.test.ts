import { describe, it, expect, beforeEach } from "vitest";
import {
  getLocalizedValue,
  getLocalizedValueWithMetadata,
  getMissingTranslationsLog,
  clearMissingTranslationsLog,
  getMissingTranslationsSummary,
  localizePost,
  localizeCategory,
  localizeAuthor,
  hasTranslation,
  getAvailableLocales,
  getPostTranslationCoverage,
  getCategoryTranslationCoverage,
} from "../i18n";
import type { SanityPost, SanityCategory, SanityAuthor } from "../types";

// Mock data helpers
const createI18nField = <T>(values: Record<string, T>) =>
  Object.entries(values).map(([key, value]) => ({ _key: key, value }));

const createI18nFieldWithLanguage = <T>(values: Record<string, T>) =>
  Object.entries(values).map(([language, value]) => ({ language, value }));

describe("i18n utilities", () => {
  beforeEach(() => {
    clearMissingTranslationsLog();
  });

  describe("getLocalizedValue", () => {
    it("should return the value for the requested locale", () => {
      const field = createI18nField({ en: "Hello", es: "Hola" });
      expect(getLocalizedValue(field, "es")).toBe("Hola");
      expect(getLocalizedValue(field, "en")).toBe("Hello");
    });

    it("should fall back to English when requested locale is not available", () => {
      const field = createI18nField({ en: "Hello" });
      expect(getLocalizedValue(field, "es")).toBe("Hello");
    });

    it("should fall back to first available value when neither requested nor fallback locale exists", () => {
      const field = createI18nField({ fr: "Bonjour" });
      expect(getLocalizedValue(field, "es")).toBe("Bonjour");
    });

    it("should return undefined for empty or invalid fields", () => {
      expect(getLocalizedValue(undefined, "en")).toBeUndefined();
      expect(getLocalizedValue([], "en")).toBeUndefined();
    });

    it("should support fields with language property instead of _key", () => {
      const field = createI18nFieldWithLanguage({ en: "Hello", es: "Hola" });
      expect(getLocalizedValue(field, "es")).toBe("Hola");
    });

    it("should allow custom fallback locale", () => {
      const field = createI18nField({ es: "Hola", fr: "Bonjour" });
      expect(getLocalizedValue(field, "de", "fr")).toBe("Bonjour");
    });
  });

  describe("getLocalizedValueWithMetadata", () => {
    it('should return source as "requested" when locale is found', () => {
      const field = createI18nField({ en: "Hello", es: "Hola" });
      const result = getLocalizedValueWithMetadata(field, "es");

      expect(result.value).toBe("Hola");
      expect(result.source).toBe("requested");
      expect(result.requestedLocale).toBe("es");
      expect(result.actualLocale).toBe("es");
    });

    it('should return source as "fallback" when using fallback locale', () => {
      const field = createI18nField({ en: "Hello" });
      const result = getLocalizedValueWithMetadata(field, "es", {
        logFallback: false,
      });

      expect(result.value).toBe("Hello");
      expect(result.source).toBe("fallback");
      expect(result.requestedLocale).toBe("es");
      expect(result.actualLocale).toBe("en");
    });

    it('should return source as "first_available" when neither requested nor fallback exists', () => {
      const field = createI18nField({ fr: "Bonjour" });
      const result = getLocalizedValueWithMetadata(field, "es", {
        logFallback: false,
      });

      expect(result.value).toBe("Bonjour");
      expect(result.source).toBe("first_available");
      expect(result.requestedLocale).toBe("es");
      expect(result.actualLocale).toBe("fr");
    });

    it('should return source as "undefined" for empty fields', () => {
      const result = getLocalizedValueWithMetadata(undefined, "en");

      expect(result.value).toBeUndefined();
      expect(result.source).toBe("undefined");
      expect(result.actualLocale).toBeNull();
    });

    it("should include field and document info in options", () => {
      const field = createI18nField({ en: "Hello" });
      const result = getLocalizedValueWithMetadata(field, "es", {
        fieldName: "title",
        documentId: "doc123",
        logFallback: false,
      });

      expect(result.source).toBe("fallback");
    });
  });

  describe("Missing translation logging", () => {
    // Note: In test environment, NODE_ENV is 'test', not 'development'
    // The logging only occurs in development mode
    it("should start with empty log", () => {
      expect(getMissingTranslationsLog()).toHaveLength(0);
    });

    it("should clear log when clearMissingTranslationsLog is called", () => {
      clearMissingTranslationsLog();
      expect(getMissingTranslationsLog()).toHaveLength(0);
    });

    it("should return empty summary when no entries", () => {
      expect(getMissingTranslationsSummary()).toEqual({});
    });
  });

  describe("localizePost", () => {
    const createMockPost = (overrides?: Partial<SanityPost>): SanityPost => ({
      _id: "post-1",
      _type: "post",
      _createdAt: "2024-01-01",
      _updatedAt: "2024-01-01",
      title: createI18nField({ en: "English Title", es: "Titulo en Espanol" }),
      smallDescription: createI18nField({
        en: "English description",
        es: "Descripcion en Espanol",
      }),
      body: createI18nField({
        en: [{ _type: "block", children: [{ text: "Content" }] }],
      }),
      slug: { current: "test-post" },
      mainImage: { _type: "image", asset: { _ref: "image-1" } },
      ...overrides,
    });

    it("should return null for null post", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(localizePost(null as any, "en")).toBeNull();
    });

    it("should localize post fields to requested locale", () => {
      const post = createMockPost();
      const result = localizePost(post, "es", { trackFallbacks: false });

      expect(result).not.toBeNull();
      expect(result?.title).toBe("Titulo en Espanol");
      expect(result?.smallDescription).toBe("Descripcion en Espanol");
    });

    it("should fall back to English when Spanish is not available", () => {
      const post = createMockPost({
        title: createI18nField({ en: "English Only Title" }),
        smallDescription: createI18nField({ en: "English only description" }),
      });
      const result = localizePost(post, "es", { trackFallbacks: false });

      expect(result?.title).toBe("English Only Title");
      expect(result?.smallDescription).toBe("English only description");
    });

    it("should include localization metadata when requested", () => {
      const post = createMockPost({
        title: createI18nField({ en: "English Only" }),
      });
      const result = localizePost(post, "es", {
        trackFallbacks: false,
        includeMetadata: true,
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata = (result as any)?._localizationMetadata;
      expect(metadata).toBeDefined();
      expect(metadata?.usedFallback).toBe(true);
      expect(metadata?.fallbackFields).toContain("title");
    });

    it("should handle missing fields gracefully", () => {
      const post = createMockPost({
        title: undefined,
        smallDescription: undefined,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
      const result = localizePost(post, "en", { trackFallbacks: false });

      expect(result?.title).toBe("Untitled");
      expect(result?.smallDescription).toBe("");
    });
  });

  describe("localizeCategory", () => {
    const createMockCategory = (
      overrides?: Partial<SanityCategory>,
    ): SanityCategory => ({
      _id: "cat-1",
      _type: "category",
      _createdAt: "2024-01-01",
      _updatedAt: "2024-01-01",
      title: createI18nField({ en: "Technology", es: "Tecnologia" }),
      description: createI18nField({
        en: "Tech posts",
        es: "Posts de tecnologia",
      }),
      slug: { current: "technology" },
      ...overrides,
    });

    it("should return null for null category", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(localizeCategory(null as any, "en")).toBeNull();
    });

    it("should localize category fields", () => {
      const category = createMockCategory();
      const result = localizeCategory(category, "es", {
        trackFallbacks: false,
      });

      expect(result?.title).toBe("Tecnologia");
      expect(result?.description).toBe("Posts de tecnologia");
    });

    it("should fall back gracefully", () => {
      const category = createMockCategory({
        title: createI18nField({ en: "English Only" }),
      });
      const result = localizeCategory(category, "es", {
        trackFallbacks: false,
      });

      expect(result?.title).toBe("English Only");
    });
  });

  describe("localizeAuthor", () => {
    const createMockAuthor = (
      overrides?: Partial<SanityAuthor>,
    ): SanityAuthor => ({
      _id: "author-1",
      _type: "author",
      _createdAt: "2024-01-01",
      _updatedAt: "2024-01-01",
      name: "John Doe",
      bio: createI18nField({ en: "English bio", es: "Bio en espanol" }),
      image: { _type: "image", asset: { _ref: "image-1" } },
      ...overrides,
    });

    it("should return null for null author", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(localizeAuthor(null as any, "en")).toBeNull();
    });

    it("should localize author bio", () => {
      const author = createMockAuthor();
      const result = localizeAuthor(author, "es", { trackFallbacks: false });

      expect(result?.bio).toBe("Bio en espanol");
    });

    it("should fall back to English", () => {
      const author = createMockAuthor({
        bio: createI18nField({ en: "English bio only" }),
      });
      const result = localizeAuthor(author, "es", { trackFallbacks: false });

      expect(result?.bio).toBe("English bio only");
    });
  });

  describe("hasTranslation", () => {
    it("should return true when translation exists", () => {
      const field = createI18nField({ en: "Hello", es: "Hola" });
      expect(hasTranslation(field, "es")).toBe(true);
    });

    it("should return false when translation does not exist", () => {
      const field = createI18nField({ en: "Hello" });
      expect(hasTranslation(field, "es")).toBe(false);
    });

    it("should return false for undefined field", () => {
      expect(hasTranslation(undefined, "en")).toBe(false);
    });

    it("should support language property", () => {
      const field = createI18nFieldWithLanguage({ es: "Hola" });
      expect(hasTranslation(field, "es")).toBe(true);
    });
  });

  describe("getAvailableLocales", () => {
    it("should return all available locales using _key", () => {
      const field = createI18nField({ en: "Hello", es: "Hola", fr: "Bonjour" });
      expect(getAvailableLocales(field)).toEqual(["en", "es", "fr"]);
    });

    it("should return all available locales using language", () => {
      const field = createI18nFieldWithLanguage({ en: "Hello", es: "Hola" });
      expect(getAvailableLocales(field)).toEqual(["en", "es"]);
    });

    it("should return empty array for undefined field", () => {
      expect(getAvailableLocales(undefined)).toEqual([]);
    });
  });

  describe("getPostTranslationCoverage", () => {
    it("should report fully translated post", () => {
      const post: SanityPost = {
        _id: "post-1",
        _type: "post",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        title: createI18nField({ en: "Title", es: "Titulo" }),
        smallDescription: createI18nField({ en: "Desc", es: "Desc" }),
        body: createI18nField({ en: [], es: [] }),
        slug: { current: "test" },
        mainImage: { _type: "image", asset: { _ref: "img" } },
      };

      const coverage = getPostTranslationCoverage(post, "es");

      expect(coverage.isFullyTranslated).toBe(true);
      expect(coverage.missingFields).toHaveLength(0);
      expect(coverage.coveragePercentage).toBe(100);
    });

    it("should report partially translated post", () => {
      const post: SanityPost = {
        _id: "post-1",
        _type: "post",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        title: createI18nField({ en: "Title", es: "Titulo" }),
        smallDescription: createI18nField({ en: "Desc" }), // Missing Spanish
        body: createI18nField({ en: [] }), // Missing Spanish
        slug: { current: "test" },
        mainImage: { _type: "image", asset: { _ref: "img" } },
      };

      const coverage = getPostTranslationCoverage(post, "es");

      expect(coverage.isFullyTranslated).toBe(false);
      expect(coverage.translatedFields).toContain("title");
      expect(coverage.missingFields).toContain("smallDescription");
      expect(coverage.missingFields).toContain("body");
      expect(coverage.coveragePercentage).toBeCloseTo(33.33, 1);
    });
  });

  describe("getCategoryTranslationCoverage", () => {
    it("should report fully translated category", () => {
      const category: SanityCategory = {
        _id: "cat-1",
        _type: "category",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        title: createI18nField({ en: "Tech", es: "Tecnologia" }),
        description: createI18nField({ en: "Tech posts", es: "Posts tech" }),
        slug: { current: "tech" },
      };

      const coverage = getCategoryTranslationCoverage(category, "es");

      expect(coverage.isFullyTranslated).toBe(true);
      expect(coverage.coveragePercentage).toBe(100);
    });

    it("should handle missing translations", () => {
      const category: SanityCategory = {
        _id: "cat-1",
        _type: "category",
        _createdAt: "2024-01-01",
        _updatedAt: "2024-01-01",
        title: createI18nField({ en: "Tech" }),
        description: createI18nField({ en: "Tech posts" }),
        slug: { current: "tech" },
      };

      const coverage = getCategoryTranslationCoverage(category, "es");

      expect(coverage.isFullyTranslated).toBe(false);
      expect(coverage.coveragePercentage).toBe(0);
    });
  });
});
