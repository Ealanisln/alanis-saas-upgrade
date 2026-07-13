import { getLocalizedValue } from "@/sanity/lib/i18n";
import type { SanityImage } from "@/sanity/lib/types";

export interface I18nString {
  _key?: string;
  language?: string;
  value: string;
}

export interface PortfolioPost {
  _id: string;
  _createdAt: string;
  title?: I18nString[];
  slug?: { current?: string };
  smallDescription?: I18nString[];
  mainImage?: SanityImage;
  publishedAt?: string;
  categories?: I18nString[][];
  bodyText?: string;
}

export const formatDate = (iso: string | undefined, locale: string) => {
  if (!iso) return "";
  const date = new Date(iso);
  // A malformed CMS date must not throw during render
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "es" ? "es-MX" : "en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    // Post dates render the same regardless of server/viewer timezone
    timeZone: "UTC",
  }).format(date);
};

// ~200 wpm reading speed, minimum 1 minute
export const readMinutes = (bodyText: string | undefined) =>
  Math.max(1, Math.round((bodyText?.trim().split(/\s+/).length ?? 0) / 200));

export const localizePortfolioPost = (post: PortfolioPost, locale: string) => ({
  key: post._id,
  href: `/blog/${post.slug?.current ?? ""}`,
  title: getLocalizedValue(post.title, locale) ?? "Untitled",
  excerpt: getLocalizedValue(post.smallDescription, locale) ?? "",
  category: post.categories?.[0]
    ? (getLocalizedValue(post.categories[0], locale) ?? "")
    : "",
  date: formatDate(post.publishedAt ?? post._createdAt, locale),
  minutes: readMinutes(post.bodyText),
  image: post.mainImage,
  imageAlt: post.mainImage?.alt,
});

export type CardPost = ReturnType<typeof localizePortfolioPost>;
