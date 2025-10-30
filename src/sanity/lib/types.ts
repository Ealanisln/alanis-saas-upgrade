/**
 * TypeScript types for Sanity documents
 */

import type { PortableTextBlock } from '@portabletext/types';

/**
 * Internationalized field structure
 */
export interface I18nValue<T = string> {
  _key?: string;
  language?: string;
  value: T;
}

/**
 * Sanity image structure
 */
export interface SanityImage {
  _type: 'image';
  asset: {
    _ref: string;
    _type: 'reference';
  };
  alt?: string;
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Sanity slug structure
 */
export interface SanitySlug {
  _type: 'slug';
  current: string;
}

/**
 * Base Sanity document
 */
export interface SanityDocument {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  _rev: string;
}

/**
 * Author document
 */
export interface SanityAuthor extends SanityDocument {
  _type: 'author';
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: I18nValue<string>[];
}

/**
 * Category document
 */
export interface SanityCategory extends SanityDocument {
  _type: 'category';
  title: I18nValue<string>[];
  slug: SanitySlug;
  description?: I18nValue<string>[];
}

/**
 * Post document
 */
export interface SanityPost extends SanityDocument {
  _type: 'post';
  title: I18nValue<string>[];
  slug: SanitySlug;
  author?: {
    _ref: string;
    _type: 'reference';
  };
  mainImage?: SanityImage;
  categories?: Array<{
    _ref: string;
    _type: 'reference';
  }>;
  publishedAt?: string;
  smallDescription?: I18nValue<string>[];
  body?: I18nValue<PortableTextBlock[]>[];
  seoTitle?: I18nValue<string>[];
  seoDescription?: I18nValue<string>[];
}

/**
 * Localized post (after i18n transformation)
 */
export interface LocalizedPost {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  author?: SanityAuthor;
  mainImage?: SanityImage;
  categories?: SanityCategory[];
  publishedAt?: string;
  smallDescription: string;
  body: PortableTextBlock[];
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * Localized category (after i18n transformation)
 */
export interface LocalizedCategory {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  title: string;
  slug: SanitySlug;
  description?: string;
}

/**
 * Localized author (after i18n transformation)
 */
export interface LocalizedAuthor {
  _id: string;
  _type: string;
  _createdAt: string;
  _updatedAt: string;
  name: string;
  slug: SanitySlug;
  image?: SanityImage;
  bio?: string;
}
