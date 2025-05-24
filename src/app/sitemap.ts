import { client } from "@/sanity/lib/client";
import { MetadataRoute } from "next";

// Function to fetch all blog posts
async function getAllPosts() {
  const query = `
    *[_type == 'post'] {
      "slug": slug.current,
      _updatedAt
    }
  `;
  return client.fetch(query);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://alanis.dev";
  
  // Get all blog posts
  const posts = await getAllPosts();
  
  // Create sitemap entries for blog posts
  const blogEntries = posts.map((post: { slug: string; _updatedAt: string }) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post._updatedAt || new Date()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contacto`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portafolio`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/planes`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
  ];
  
  // Combine all entries
  return [...staticPages, ...blogEntries];
} 