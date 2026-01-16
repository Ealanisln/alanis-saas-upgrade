/**
 * Helper functions for extracting localized content from Sanity
 *
 * Translation Fallback Strategy:
 * 1. Try requested locale (e.g., Spanish)
 * 2. If not available, fall back to English (default)
 * 3. If English not available, use first available value
 * 4. Optionally log missing translations for debugging
 */

import type {
  SanityPost,
  SanityCategory,
  SanityAuthor,
  LocalizedPost,
  LocalizedCategory,
  LocalizedAuthor,
} from "./types";
import { defaultLocale } from "@/config/i18n";

// ============================================================================
// Types
// ============================================================================

/**
 * Represents the source of a localized value (which fallback was used)
 */
export type LocalizationSource =
  | "requested" // Value found in requested locale
  | "fallback" // Value found in fallback locale (English)
  | "first_available" // Value from first available translation
  | "undefined"; // No value found

/**
 * Result of a localization operation with metadata about the source
 */
export interface LocalizationResult<T> {
  value: T | undefined;
  source: LocalizationSource;
  requestedLocale: string;
  actualLocale: string | null;
}

/**
 * Options for the getLocalizedValue function
 */
export interface LocalizationOptions {
  /** The fallback locale if the desired locale is not available (default: 'en') */
  fallbackLocale?: string;
  /** Field name for logging purposes */
  fieldName?: string;
  /** Document ID for logging purposes */
  documentId?: string;
  /** Whether to log fallback usage (default: false in production) */
  logFallback?: boolean;
}

/**
 * Entry in the missing translations log
 */
export interface MissingTranslationEntry {
  timestamp: Date;
  requestedLocale: string;
  fallbackLocale: string;
  actualLocale: string | null;
  source: LocalizationSource;
  fieldName?: string;
  documentId?: string;
}

// ============================================================================
// Missing Translation Logger
// ============================================================================

// In-memory log for development debugging
const missingTranslationsLog: MissingTranslationEntry[] = [];
const MAX_LOG_ENTRIES = 100;

/**
 * Log a missing translation for debugging purposes
 */
function logMissingTranslation(entry: MissingTranslationEntry): void {
  // Only log in development
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  // Add to in-memory log (with limit)
  if (missingTranslationsLog.length >= MAX_LOG_ENTRIES) {
    missingTranslationsLog.shift();
  }
  missingTranslationsLog.push(entry);

  // Console warning for visibility
  const location = entry.fieldName
    ? `${entry.documentId ? `[${entry.documentId}]` : ""}${entry.fieldName}`
    : entry.documentId || "unknown field";

  console.warn(
    `[i18n] Missing translation: "${entry.requestedLocale}" for ${location}. ` +
      `Using ${entry.source === "fallback" ? `fallback "${entry.actualLocale}"` : entry.source}.`,
  );
}

/**
 * Get the missing translations log (for debugging/admin purposes)
 */
export function getMissingTranslationsLog(): ReadonlyArray<MissingTranslationEntry> {
  return [...missingTranslationsLog];
}

/**
 * Clear the missing translations log
 */
export function clearMissingTranslationsLog(): void {
  missingTranslationsLog.length = 0;
}

/**
 * Get a summary of missing translations by locale and field
 */
export function getMissingTranslationsSummary(): Record<string, number> {
  const summary: Record<string, number> = {};
  for (const entry of missingTranslationsLog) {
    const key = `${entry.requestedLocale}:${entry.fieldName || "unknown"}`;
    summary[key] = (summary[key] || 0) + 1;
  }
  return summary;
}

// ============================================================================
// Core Localization Functions
// ============================================================================

/**
 * Extract a localized value from an internationalized array field with detailed result
 * @param field - The internationalized array field from Sanity
 * @param locale - The desired locale (e.g., 'en', 'es')
 * @param options - Optional configuration for fallback behavior and logging
 * @returns LocalizationResult with value and metadata about the source
 */
export function getLocalizedValueWithMetadata<T = string>(
  field: Array<{ _key?: string; language?: string; value: T }> | undefined,
  locale: string,
  options: LocalizationOptions = {},
): LocalizationResult<T> {
  const {
    fallbackLocale = defaultLocale,
    fieldName,
    documentId,
    logFallback = process.env.NODE_ENV === "development",
  } = options;

  // Handle undefined/invalid field
  if (!field || !Array.isArray(field) || field.length === 0) {
    return {
      value: undefined,
      source: "undefined",
      requestedLocale: locale,
      actualLocale: null,
    };
  }

  // Try to find the value for the requested locale
  // Support both _key (from plugin) and language (from custom structure)
  const localizedItem = field.find(
    (item) => item._key === locale || item.language === locale,
  );
  if (localizedItem) {
    return {
      value: localizedItem.value,
      source: "requested",
      requestedLocale: locale,
      actualLocale: locale,
    };
  }

  // Fallback to the fallback locale (default: English)
  const fallbackItem = field.find(
    (item) => item._key === fallbackLocale || item.language === fallbackLocale,
  );
  if (fallbackItem) {
    // Log the fallback usage
    if (logFallback && locale !== fallbackLocale) {
      logMissingTranslation({
        timestamp: new Date(),
        requestedLocale: locale,
        fallbackLocale,
        actualLocale: fallbackLocale,
        source: "fallback",
        fieldName,
        documentId,
      });
    }
    return {
      value: fallbackItem.value,
      source: "fallback",
      requestedLocale: locale,
      actualLocale: fallbackLocale,
    };
  }

  // Last resort: return the first available value
  const firstItem = field[0];
  const actualLocale = firstItem?._key || firstItem?.language || null;

  if (logFallback) {
    logMissingTranslation({
      timestamp: new Date(),
      requestedLocale: locale,
      fallbackLocale,
      actualLocale,
      source: "first_available",
      fieldName,
      documentId,
    });
  }

  return {
    value: firstItem?.value,
    source: "first_available",
    requestedLocale: locale,
    actualLocale,
  };
}

/**
 * Extract a localized value from an internationalized array field
 * @param field - The internationalized array field from Sanity
 * @param locale - The desired locale (e.g., 'en', 'es')
 * @param fallbackLocale - The fallback locale if the desired locale is not available (default: 'en')
 * @returns The localized value or undefined if not found
 */
export function getLocalizedValue<T = string>(
  field: Array<{ _key?: string; language?: string; value: T }> | undefined,
  locale: string,
  fallbackLocale: string = defaultLocale,
): T | undefined {
  return getLocalizedValueWithMetadata(field, locale, {
    fallbackLocale,
    logFallback: false,
  }).value;
}

// ============================================================================
// Content Localization Functions with Fallback Support
// ============================================================================

/**
 * Options for content localization functions
 */
export interface ContentLocalizationOptions {
  /** Whether to track fallback usage (for debugging) */
  trackFallbacks?: boolean;
  /** Whether to include metadata about which fields used fallback */
  includeMetadata?: boolean;
}

/**
 * Metadata about which fields used fallback translations
 */
export interface LocalizationMetadata {
  usedFallback: boolean;
  fallbackFields: string[];
  requestedLocale: string;
}

/**
 * Extract localized content from a Sanity post document
 * @param post - The post document from Sanity
 * @param locale - The desired locale
 * @param options - Optional configuration for fallback behavior
 * @returns The post with localized content
 */
export function localizePost(
  post: SanityPost,
  locale: string,
  options: ContentLocalizationOptions = {},
): LocalizedPost | null {
  if (!post) return null;

  const { trackFallbacks = process.env.NODE_ENV === "development" } = options;

  // Extract localized values with metadata for tracking
  const titleResult = getLocalizedValueWithMetadata(post.title, locale, {
    fieldName: "title",
    documentId: post._id,
    logFallback: trackFallbacks,
  });
  const descriptionResult = getLocalizedValueWithMetadata(
    post.smallDescription,
    locale,
    {
      fieldName: "smallDescription",
      documentId: post._id,
      logFallback: trackFallbacks,
    },
  );
  const bodyResult = getLocalizedValueWithMetadata(post.body, locale, {
    fieldName: "body",
    documentId: post._id,
    logFallback: trackFallbacks,
  });

  // Determine final values with proper type handling
  // Note: We don't fallback to raw i18n arrays - if no localized value found, use empty/default
  const title = titleResult.value ?? "Untitled";
  const smallDescription = descriptionResult.value ?? "";
  const body = bodyResult.value ?? [];

  // Build metadata about fallback usage
  const fallbackFields: string[] = [];
  if (
    titleResult.source === "fallback" ||
    titleResult.source === "first_available"
  ) {
    fallbackFields.push("title");
  }
  if (
    descriptionResult.source === "fallback" ||
    descriptionResult.source === "first_available"
  ) {
    fallbackFields.push("smallDescription");
  }
  if (
    bodyResult.source === "fallback" ||
    bodyResult.source === "first_available"
  ) {
    fallbackFields.push("body");
  }

  // Build the localized post, explicitly omitting non-localized reference fields
  // These will be populated separately if needed by the component
  const localizedPost = {
    _id: post._id,
    _type: post._type,
    _createdAt: post._createdAt,
    _updatedAt: post._updatedAt,
    title,
    slug: post.slug,
    mainImage: post.mainImage,
    publishedAt: post.publishedAt,
    smallDescription,
    body,
  } as LocalizedPost;

  // Attach metadata for components that need to show translation status
  if (options.includeMetadata && fallbackFields.length > 0) {
    (
      localizedPost as LocalizedPost & {
        _localizationMetadata?: LocalizationMetadata;
      }
    )._localizationMetadata = {
      usedFallback: true,
      fallbackFields,
      requestedLocale: locale,
    };
  }

  return localizedPost;
}

/**
 * Extract localized content from a Sanity category document
 * @param category - The category document from Sanity
 * @param locale - The desired locale
 * @param options - Optional configuration for fallback behavior
 * @returns The category with localized content
 */
export function localizeCategory(
  category: SanityCategory,
  locale: string,
  options: ContentLocalizationOptions = {},
): LocalizedCategory | null {
  if (!category) return null;

  const { trackFallbacks = process.env.NODE_ENV === "development" } = options;

  const titleResult = getLocalizedValueWithMetadata(category.title, locale, {
    fieldName: "title",
    documentId: category._id,
    logFallback: trackFallbacks,
  });
  const descriptionResult = getLocalizedValueWithMetadata(
    category.description,
    locale,
    {
      fieldName: "description",
      documentId: category._id,
      logFallback: trackFallbacks,
    },
  );

  const localizedCategory: LocalizedCategory = {
    ...category,
    title: titleResult.value || "",
    description: descriptionResult.value,
  };

  if (options.includeMetadata) {
    const fallbackFields: string[] = [];
    if (
      titleResult.source === "fallback" ||
      titleResult.source === "first_available"
    ) {
      fallbackFields.push("title");
    }
    if (
      descriptionResult.source === "fallback" ||
      descriptionResult.source === "first_available"
    ) {
      fallbackFields.push("description");
    }
    if (fallbackFields.length > 0) {
      (
        localizedCategory as LocalizedCategory & {
          _localizationMetadata?: LocalizationMetadata;
        }
      )._localizationMetadata = {
        usedFallback: true,
        fallbackFields,
        requestedLocale: locale,
      };
    }
  }

  return localizedCategory;
}

/**
 * Extract localized content from a Sanity author document
 * @param author - The author document from Sanity
 * @param locale - The desired locale
 * @param options - Optional configuration for fallback behavior
 * @returns The author with localized content
 */
export function localizeAuthor(
  author: SanityAuthor,
  locale: string,
  options: ContentLocalizationOptions = {},
): LocalizedAuthor | null {
  if (!author) return null;

  const { trackFallbacks = process.env.NODE_ENV === "development" } = options;

  const bioResult = getLocalizedValueWithMetadata(author.bio, locale, {
    fieldName: "bio",
    documentId: author._id,
    logFallback: trackFallbacks,
  });

  const localizedAuthor: LocalizedAuthor = {
    ...author,
    bio: bioResult.value,
  };

  if (
    options.includeMetadata &&
    (bioResult.source === "fallback" || bioResult.source === "first_available")
  ) {
    (
      localizedAuthor as LocalizedAuthor & {
        _localizationMetadata?: LocalizationMetadata;
      }
    )._localizationMetadata = {
      usedFallback: true,
      fallbackFields: ["bio"],
      requestedLocale: locale,
    };
  }

  return localizedAuthor;
}

// ============================================================================
// Translation Checking Utilities
// ============================================================================

/**
 * Helper to check if a field has a translation for a specific locale
 * @param field - The internationalized array field
 * @param locale - The locale to check
 * @returns true if the field has a translation for the locale
 */
export function hasTranslation<T = unknown>(
  field: Array<{ _key?: string; language?: string; value: T }> | undefined,
  locale: string,
): boolean {
  if (!field || !Array.isArray(field)) {
    return false;
  }

  return field.some((item) => item._key === locale || item.language === locale);
}

/**
 * Get all available locales for a field
 * @param field - The internationalized array field
 * @returns Array of locale codes that have translations
 */
export function getAvailableLocales<T = unknown>(
  field: Array<{ _key?: string; language?: string; value: T }> | undefined,
): string[] {
  if (!field || !Array.isArray(field)) {
    return [];
  }

  return field
    .map((item) => item._key || item.language)
    .filter((locale): locale is string => locale !== undefined);
}

/**
 * Check translation coverage for a Sanity post
 * @param post - The post document from Sanity
 * @param locale - The locale to check
 * @returns Object with coverage information
 */
export function getPostTranslationCoverage(
  post: SanityPost,
  locale: string,
): {
  isFullyTranslated: boolean;
  translatedFields: string[];
  missingFields: string[];
  coveragePercentage: number;
} {
  const fields = ["title", "smallDescription", "body"] as const;
  const translatedFields: string[] = [];
  const missingFields: string[] = [];

  const fieldMap: Record<string, unknown> = {
    title: post.title,
    smallDescription: post.smallDescription,
    body: post.body,
  };

  for (const field of fields) {
    const fieldValue = fieldMap[field] as
      | Array<{ _key?: string; language?: string; value: unknown }>
      | undefined;
    if (hasTranslation(fieldValue, locale)) {
      translatedFields.push(field);
    } else {
      missingFields.push(field);
    }
  }

  return {
    isFullyTranslated: missingFields.length === 0,
    translatedFields,
    missingFields,
    coveragePercentage: (translatedFields.length / fields.length) * 100,
  };
}

/**
 * Check translation coverage for a Sanity category
 * @param category - The category document from Sanity
 * @param locale - The locale to check
 * @returns Object with coverage information
 */
export function getCategoryTranslationCoverage(
  category: SanityCategory,
  locale: string,
): {
  isFullyTranslated: boolean;
  translatedFields: string[];
  missingFields: string[];
  coveragePercentage: number;
} {
  const fields = ["title", "description"] as const;
  const translatedFields: string[] = [];
  const missingFields: string[] = [];

  const fieldMap: Record<string, unknown> = {
    title: category.title,
    description: category.description,
  };

  for (const field of fields) {
    const fieldValue = fieldMap[field] as
      | Array<{ _key?: string; language?: string; value: unknown }>
      | undefined;
    if (hasTranslation(fieldValue, locale)) {
      translatedFields.push(field);
    } else {
      missingFields.push(field);
    }
  }

  return {
    isFullyTranslated: missingFields.length === 0,
    translatedFields,
    missingFields,
    coveragePercentage: (translatedFields.length / fields.length) * 100,
  };
}
