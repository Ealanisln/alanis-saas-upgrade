import { MetadataRoute } from "next";
import { locales, defaultLocale, siteConfig } from "@/config/i18n";
import { safeFetch } from "@/sanity/lib/client";

// Function to fetch all blog posts
async function getAllPosts() {
  const query = `
    *[_type == 'post'] {
      "slug": slug.current,
      _updatedAt
    }
  `;
  return safeFetch(query);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  // Get all blog posts
  const posts = await getAllPosts();

  // Create sitemap entries for blog posts for each locale
  const blogEntries: MetadataRoute.Sitemap = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  posts.forEach((post: any) => {
    locales.forEach((locale) => {
      const url =
        locale === defaultLocale
          ? `${baseUrl}/blog/${post.slug}`
          : `${baseUrl}/${locale}/blog/${post.slug}`;

      blogEntries.push({
        url,
        lastModified: new Date(post._updatedAt || new Date()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              loc === defaultLocale
                ? `${baseUrl}/blog/${post.slug}`
                : `${baseUrl}/${loc}/blog/${post.slug}`,
            ]),
          ),
        },
      });
    });
  });

  // Static pages with multilingual support
  const routes = [
    { path: "", priority: 1.0, changeFrequency: "monthly" as const },
    { path: "/blog", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/about", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/contact", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/portfolio", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/plans", priority: 0.8, changeFrequency: "monthly" as const },
  ];

  const staticPages: MetadataRoute.Sitemap = [];

  routes.forEach((route) => {
    locales.forEach((locale) => {
      const url =
        locale === defaultLocale
          ? `${baseUrl}${route.path}`
          : `${baseUrl}/${locale}${route.path}`;

      staticPages.push({
        url,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [
              loc,
              loc === defaultLocale
                ? `${baseUrl}${route.path}`
                : `${baseUrl}/${loc}${route.path}`,
            ]),
          ),
        },
      });
    });
  });

  // Combine all entries
  return [...staticPages, ...blogEntries];
}
