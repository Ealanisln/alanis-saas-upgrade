# Translation Fallback Strategy

This document describes the translation fallback strategy implemented for handling missing content translations in the Alanis SaaS application.

## Overview

The application uses a two-layer internationalization approach:

1. **Static UI translations** (next-intl): JSON files in `/messages/{locale}/` for UI strings
2. **Dynamic content** (Sanity CMS): Internationalized arrays with `I18nValue<T>` structure

This document focuses on the Sanity CMS fallback strategy for dynamic content.

## Fallback Order

When content is requested in a specific locale, the system follows this fallback order:

1. **Requested locale** - Try to find content in the user's requested language (e.g., Spanish)
2. **Default locale (English)** - Fall back to English if the requested locale is unavailable
3. **First available** - As a last resort, use the first available translation
4. **Default value** - If no translations exist, use empty string or "Untitled"

## Implementation

### Core Function: `getLocalizedValue()`

```typescript
import { getLocalizedValue } from "@/sanity/lib/i18n";

// Simple usage - returns the value only
const title = getLocalizedValue(post.title, "es"); // Spanish or English fallback
```

### Enhanced Function: `getLocalizedValueWithMetadata()`

For cases where you need to know which fallback was used:

```typescript
import { getLocalizedValueWithMetadata } from "@/sanity/lib/i18n";

const result = getLocalizedValueWithMetadata(post.title, "es", {
  fieldName: "title",
  documentId: post._id,
  logFallback: true, // Log to console in development
});

// result.value - The localized value
// result.source - 'requested' | 'fallback' | 'first_available' | 'undefined'
// result.requestedLocale - The locale that was requested
// result.actualLocale - The locale that was actually used
```

### Content Localization Functions

High-level functions for localizing entire documents:

```typescript
import {
  localizePost,
  localizeCategory,
  localizeAuthor,
} from "@/sanity/lib/i18n";

// Localize a post with fallback tracking
const localizedPost = localizePost(post, "es", {
  trackFallbacks: true, // Log missing translations (dev only)
  includeMetadata: true, // Attach metadata to the result
});

// Check if fallback was used
if (localizedPost._localizationMetadata?.usedFallback) {
  console.log(
    "Missing fields:",
    localizedPost._localizationMetadata.fallbackFields,
  );
}
```

## Translation Coverage Checking

Check if content is fully translated:

```typescript
import {
  hasTranslation,
  getAvailableLocales,
  getPostTranslationCoverage,
} from "@/sanity/lib/i18n";

// Check single field
const hasSpanish = hasTranslation(post.title, "es");

// Get all available locales for a field
const locales = getAvailableLocales(post.title); // ['en', 'es']

// Get comprehensive coverage report
const coverage = getPostTranslationCoverage(post, "es");
// {
//   isFullyTranslated: false,
//   translatedFields: ['title'],
//   missingFields: ['smallDescription', 'body'],
//   coveragePercentage: 33.33
// }
```

## Missing Translation Logging

In development mode, the system logs missing translations to help identify content gaps:

```typescript
import {
  getMissingTranslationsLog,
  getMissingTranslationsSummary,
  clearMissingTranslationsLog,
} from "@/sanity/lib/i18n";

// Get all logged missing translations
const log = getMissingTranslationsLog();

// Get summary by locale and field
const summary = getMissingTranslationsSummary();
// { 'es:title': 5, 'es:body': 3 }

// Clear the log
clearMissingTranslationsLog();
```

Console output in development:

```
[i18n] Missing translation: "es" for [post-123]title. Using fallback "en".
```

## UI Indicator Component

Show users when content is displayed in a fallback language:

```tsx
import { TranslationFallbackIndicator } from "@/components/ui/TranslationFallbackIndicator";

function BlogPost({ post }) {
  const localizedPost = localizePost(post, locale, { includeMetadata: true });

  return (
    <article>
      <TranslationFallbackIndicator
        metadata={localizedPost._localizationMetadata}
        fallbackLocale="en"
        size="sm" // or "md"
      />
      <h1>{localizedPost.title}</h1>
    </article>
  );
}
```

The indicator shows: `[icon] Shown in English` with amber styling.

## Best Practices

### 1. Always Use Localization Functions

```typescript
// Good - uses fallback strategy
const title = getLocalizedValue(post.title, locale);

// Bad - no fallback handling
const title = post.title.find((t) => t._key === locale)?.value;
```

### 2. Track Missing Translations in Development

```typescript
const post = localizePost(rawPost, locale, {
  trackFallbacks: process.env.NODE_ENV === "development",
});
```

### 3. Handle Empty States Gracefully

```typescript
const localizedPost = localizePost(post, locale);

// The function returns safe defaults
// title: 'Untitled' if no translation
// smallDescription: '' if no translation
// body: [] if no translation
```

### 4. Use Coverage Functions for Admin Tools

```typescript
// In an admin dashboard
const posts = await fetchAllPosts();
const untranslatedPosts = posts.filter((post) => {
  const coverage = getPostTranslationCoverage(post, "es");
  return !coverage.isFullyTranslated;
});
```

## Edge Cases Handled

| Scenario                               | Behavior                              |
| -------------------------------------- | ------------------------------------- |
| Blog posts without Spanish translation | Falls back to English                 |
| Categories without localized names     | Falls back to English                 |
| Author bios in single language         | Falls back to English                 |
| Missing metadata translations          | Falls back to English                 |
| Completely untranslated content        | Uses first available or default value |
| Empty translation field                | Returns undefined, handled by caller  |

## Acceptance Criteria (AWDP-31)

- [x] Pages don't break with missing translations
- [x] Fallback to English works correctly
- [x] No console errors for missing content (warnings only in dev)
- [x] User sees content (even if not translated)
- [x] Fallback behavior is documented

## Files Modified

- `/src/sanity/lib/i18n.ts` - Core localization functions
- `/src/components/ui/TranslationFallbackIndicator.tsx` - UI component
- `/src/sanity/lib/__tests__/i18n.test.ts` - Unit tests
- `/src/components/ui/__tests__/TranslationFallbackIndicator.test.tsx` - Component tests
