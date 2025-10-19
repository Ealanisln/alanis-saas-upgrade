/**
 * Helper functions for extracting localized content from Sanity
 */

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
  fallbackLocale: string = 'en'
): T | undefined {
  if (!field || !Array.isArray(field)) {
    return undefined;
  }

  // Try to find the value for the requested locale
  // Support both _key (from plugin) and language (from custom structure)
  const localizedItem = field.find((item) =>
    item._key === locale || item.language === locale
  );
  if (localizedItem) {
    return localizedItem.value;
  }

  // Fallback to the fallback locale
  const fallbackItem = field.find((item) =>
    item._key === fallbackLocale || item.language === fallbackLocale
  );
  if (fallbackItem) {
    return fallbackItem.value;
  }

  // Last resort: return the first available value
  return field[0]?.value;
}

/**
 * Extract localized content from a Sanity post document
 * @param post - The post document from Sanity
 * @param locale - The desired locale
 * @returns The post with localized content
 */
export function localizePost(post: any, locale: string) {
  if (!post) return null;

  return {
    ...post,
    title: getLocalizedValue(post.title, locale),
    smallDescription: getLocalizedValue(post.smallDescription, locale),
    body: getLocalizedValue(post.body, locale),
  };
}

/**
 * Extract localized content from a Sanity category document
 * @param category - The category document from Sanity
 * @param locale - The desired locale
 * @returns The category with localized content
 */
export function localizeCategory(category: any, locale: string) {
  if (!category) return null;

  return {
    ...category,
    title: getLocalizedValue(category.title, locale),
    description: getLocalizedValue(category.description, locale),
  };
}

/**
 * Extract localized content from a Sanity author document
 * @param author - The author document from Sanity
 * @param locale - The desired locale
 * @returns The author with localized content
 */
export function localizeAuthor(author: any, locale: string) {
  if (!author) return null;

  return {
    ...author,
    bio: getLocalizedValue(author.bio, locale),
  };
}

/**
 * Helper to check if a field has a translation for a specific locale
 * @param field - The internationalized array field
 * @param locale - The locale to check
 * @returns true if the field has a translation for the locale
 */
export function hasTranslation(
  field: Array<{ _key?: string; language?: string; value: any }> | undefined,
  locale: string
): boolean {
  if (!field || !Array.isArray(field)) {
    return false;
  }

  return field.some((item) => item._key === locale || item.language === locale);
}
