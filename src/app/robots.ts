import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/studio", "/api", "/dashboard"],
      },
    ],
    sitemap: "https://alanis.dev/sitemap.xml",
    host: "https://alanis.dev",
  };
} 