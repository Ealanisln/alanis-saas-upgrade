# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start dev server with Turbopack
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint

# Testing
pnpm test                   # Run tests once
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Run tests with UI
pnpm test:coverage          # Run tests with coverage report
```

## Architecture Overview

**Stack**: Next.js 15 (App Router) + React 19 + TypeScript + Sanity CMS + Tailwind CSS

### Routing & Internationalization

- Uses next-intl with locale-based routing: `/[locale]/...`
- Locales: `en` (default), `es`
- Translation files: `/messages/{locale}/{namespace}.json`
- Server components: `getTranslations('namespace')`
- Client components: `useTranslations('namespace')`
- Middleware handles locale detection and redirects

### Key Directories

```
src/
├── app/[locale]/           # Locale-aware pages (home, blog, portfolio, plans, contact)
├── app/api/webhooks/       # Stripe webhook handlers
├── app/studio/             # Sanity Studio at /studio
├── components/             # Feature-organized React components
├── sanity/                 # CMS schemas and GROQ queries
│   └── lib/queries.ts      # All Sanity queries
├── lib/
│   ├── api/client.ts       # Singleton Axios client with interceptors
│   ├── seo.ts              # SEO metadata generation
│   └── utils/              # Helper functions with tests
├── store/ui/               # Zustand store (minimal UI state)
├── hooks/                  # Custom hooks (useApi, useQuotes)
└── types/                  # TypeScript definitions
```

### Data Fetching Patterns

**Sanity CMS**: Headless CMS for blog posts, portfolio, and content

- GROQ queries defined in `/src/sanity/lib/queries.ts`
- Client setup in `/src/sanity/lib/client.ts`
- Content is internationalized using array fields

**React Query (TanStack)**: Client-side server state

- 5 minute stale time, 3 retries
- Query key pattern: `['resourceName', options]`

**API Client**: Singleton Axios instance at `/src/lib/api/client.ts`

- Adds Bearer token from localStorage
- Handles 401 errors automatically
- Type-safe methods: `apiClient.get()`, `apiClient.post()`, etc.

### Form Handling

- react-hook-form for form state
- Zod for validation schemas
- Contact form and quote calculator are the main forms

### SEO

- Custom `generateMetadata()` in `/src/lib/seo.ts`
- Locale-aware canonical URLs
- JSON-LD structured data
- Dynamic Open Graph images via `/src/lib/og-utils.tsx`

### Styling

- Tailwind CSS with custom color system (primary: blue #4F7AFA, accent: orange #F79433)
- Dark mode via class-based next-themes
- Import path alias: `@/*` → `./src/*`

### Testing

- Vitest with React Testing Library
- Test files in `__tests__/*.test.ts`
- Mocks provided for next/navigation, next-intl, next/image

## Git Workflow

- **All PRs must target `development` branch, NOT `main`**
- Feature branches: `feature/AWDP-XX-description`
- Main branch is for production releases only
- Development branch is merged to main after testing

## Environment Variables

Required:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`
- `SANITY_API_TOKEN`
- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`

Payment (optional):

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
