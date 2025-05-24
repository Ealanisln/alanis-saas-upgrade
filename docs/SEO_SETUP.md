# SEO and OpenGraph Setup Documentation

This document outlines the comprehensive SEO and OpenGraph (OG) graphics setup implemented across the Alanis Dev website.

## 🎯 Overview

The website now includes:
- ✅ Auto-generated OpenGraph images for all major pages
- ✅ Comprehensive metadata for SEO optimization
- ✅ Structured data (JSON-LD) for better search engine understanding
- ✅ Breadcrumb navigation with structured data
- ✅ Consistent branding across all social media previews

## 📁 File Structure

```
src/
├── app/
│   ├── opengraph-image.tsx          # Root OG image
│   ├── about/
│   │   └── opengraph-image.tsx      # About page OG image
│   ├── portafolio/
│   │   └── opengraph-image.tsx      # portafolio page OG image
│   ├── contacto/
│   │   └── opengraph-image.tsx      # Contact page OG image
│   ├── planes/
│   │   └── opengraph-image.tsx      # Pricing page OG image
│   └── blog/
│       └── opengraph-image.tsx      # Blog page OG image
├── lib/
│   └── seo.ts                       # SEO utility functions
└── components/
    └── Common/
        └── BreadcrumbJsonLd.tsx     # Breadcrumb structured data
```

## 🖼️ OpenGraph Images

### Design System
All OG images follow a consistent design system:
- **Dimensions**: 1200x630px (optimal for social media)
- **Format**: PNG
- **Runtime**: Edge (for fast generation)
- **Brand Colors**: 
  - Home: Blue gradient (#1E40AF → #60A5FA)
  - About: Green gradient (#059669 → #34D399)
  - portafolio: Purple gradient (#7C3AED → #C084FC)
  - Contact: Red gradient (#DC2626 → #F87171)
  - Pricing: Cyan gradient (#0891B2 → #38BDF8)
  - Blog: Orange gradient (#F59E0B → #FB923C)

### Features
- Gradient backgrounds with subtle patterns
- Consistent typography and layout
- Decorative elements matching page theme
- Website URL in bottom right
- Responsive text sizing
- Professional branding

## 📊 SEO Metadata

### Pages Covered
1. **Home Page** (`/`)
   - Professional service structured data
   - Service catalog
   - Contact information

2. **About Page** (`/about`)
   - Person structured data
   - Skills and expertise
   - Social media profiles

3. **portafolio Page** (`/portafolio`)
   - Collection page structured data
   - Project showcase metadata

4. **Contact Page** (`/contacto`)
   - Contact page structured data
   - Business information

5. **Pricing Page** (`/planes`)
   - Service offerings structured data
   - Pricing plans information

6. **Blog Page** (`/blog`)
   - Blog structured data
   - Article listings

### Metadata Features
- **Title Templates**: Consistent format across pages
- **Descriptions**: SEO-optimized, unique per page
- **Keywords**: Relevant, targeted keywords
- **Canonical URLs**: Proper canonicalization
- **Open Graph**: Complete OG metadata
- **Twitter Cards**: Large image cards
- **Robots**: Proper indexing directives

## 🔧 SEO Utility Functions

The `src/lib/seo.ts` file provides reusable functions:

### `generateMetadata(config: SEOConfig)`
Generates comprehensive Next.js metadata object.

```typescript
const metadata = generateMetadata({
  title: "About Me",
  description: "Learn about Emmanuel Alanis...",
  keywords: ["developer", "react", "nextjs"],
  canonical: "/about",
  ogImage: "/about/opengraph-image"
});
```

### `generatePersonStructuredData()`
Creates Person schema for the About page.

### `generateWebsiteStructuredData()`
Creates ProfessionalService schema for the home page.

### `generateArticleStructuredData(article)`
Creates BlogPosting schema for blog articles.

### `generateBreadcrumbs(path)`
Generates breadcrumb items for any page path.

## 📋 Structured Data (JSON-LD)

### Schema Types Used
- **ProfessionalService**: Main website
- **Person**: About page
- **ContactPage**: Contact page
- **Service**: Pricing page
- **CollectionPage**: portafolio page
- **Blog**: Blog listing
- **BlogPosting**: Individual blog posts
- **BreadcrumbList**: Navigation breadcrumbs

### Benefits
- Enhanced search result appearance
- Rich snippets in Google
- Better understanding by search engines
- Improved click-through rates

## 🚀 Implementation Examples

### Adding SEO to a New Page

1. **Create OG Image** (`opengraph-image.tsx`):
```typescript
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Page Title - Alanis Dev";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    // Your JSX design here
  );
}
```

2. **Add Metadata** to page:
```typescript
import { generateMetadata, generateBreadcrumbs } from "@/lib/seo";
import BreadcrumbJsonLd from "@/components/Common/BreadcrumbJsonLd";

export const metadata = generateMetadata({
  title: "Page Title",
  description: "Page description...",
  keywords: ["keyword1", "keyword2"],
  canonical: "/page-path",
  ogImage: "/page-path/opengraph-image"
});

export default function Page() {
  const breadcrumbs = generateBreadcrumbs("/page-path");
  
  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {/* Page content */}
    </>
  );
}
```

## 🔍 Testing and Validation

### Tools for Testing
1. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
4. **Google Rich Results Test**: https://search.google.com/test/rich-results

### What to Test
- OG image generation and display
- Metadata accuracy
- Structured data validation
- Social media preview appearance
- Search engine snippet preview

## 📈 Performance Considerations

### Edge Runtime
- OG images use Edge Runtime for fast generation
- No server-side rendering delays
- Cached at CDN level

### Image Optimization
- PNG format for quality
- Optimal dimensions (1200x630)
- Minimal file sizes through efficient design

### SEO Best Practices
- Unique titles and descriptions
- Proper heading hierarchy
- Fast loading times
- Mobile-friendly design
- Semantic HTML structure

## 🔄 Maintenance

### Regular Tasks
1. **Update OG Images**: When branding changes
2. **Review Metadata**: Ensure accuracy and relevance
3. **Test Social Sharing**: Verify previews work correctly
4. **Monitor Performance**: Check Core Web Vitals
5. **Update Structured Data**: Keep schema current

### Version Control
- All OG images are code-based (not static files)
- Easy to version and update
- Consistent with design system changes

## 📞 Support

For questions about the SEO setup:
- Check this documentation first
- Review the utility functions in `src/lib/seo.ts`
- Test changes in development before deploying
- Use browser dev tools to inspect metadata

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: Emmanuel Alanis 