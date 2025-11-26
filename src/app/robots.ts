import type { MetadataRoute } from 'next'
import { siteConfig } from '@/config/i18n'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/private/', '/admin/', '/studio/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  }
} 