# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
pnpm dev                    # Start dev server (Turbopack is the Next 16 default)
pnpm build                  # Production build
pnpm start                  # Start production server
pnpm lint                   # Run ESLint (flat config, eslint.config.mjs)
pnpm lint:fix               # Run ESLint with autofix

# Testing
pnpm test                   # Run tests once
pnpm test:watch             # Run tests in watch mode
pnpm test:ui                # Run tests with UI
pnpm test:coverage          # Run tests with coverage report
pnpm test:e2e               # Run Playwright e2e suite
pnpm typecheck              # TypeScript compiler check
```

## Architecture Overview

**Stack**: Next.js 16 (App Router) + React 19 + TypeScript + Sanity CMS (v6) + Tailwind CSS 4 (CSS-first config)

### Routing & Internationalization

- Uses next-intl with locale-based routing: `/[locale]/...`
- Locales: `en` (default), `es`
- Translation files: `/messages/{locale}/{namespace}.json`
- Server components: `getTranslations('namespace')`
- Client components: `useTranslations('namespace')`
- The proxy (src/proxy.ts, Next 16 convention) handles locale detection and redirects

### Key Directories

```
src/
├── app/[locale]/           # Locale-aware pages (home = single-page portfolio, blog; about/contact are redirect stubs)
├── app/api/revalidate/     # Sanity webhook for ISR revalidation
├── app/studio/             # Sanity Studio at /studio
├── components/             # Feature-organized React components
├── sanity/                 # CMS schemas and GROQ queries
│   └── lib/queries.ts      # All Sanity queries
├── lib/
│   ├── api/client.ts       # Singleton Axios client with interceptors
│   ├── seo.ts              # SEO metadata generation
│   └── utils/              # Helper functions with tests
├── store/ui/               # Zustand store (minimal UI state)
├── hooks/                  # Custom hooks (useApi)
└── types/                  # TypeScript definitions
```

### Data Fetching Patterns

**Sanity CMS**: Headless CMS for blog posts and content

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

- Contact form submits through the `submitContact` server action (`src/app/actions/contact.ts`): Cloudflare Turnstile verification (`src/lib/turnstile.ts`) then Resend delivery (`src/lib/email.ts`). The Turnstile widget renders only when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set; verification is skipped only when both Turnstile keys are unset — a half-configured pair fails closed (see `src/components/portfolio/ContactForm.tsx` and DESIGN.md)

### SEO

- Custom `generateMetadata()` in `/src/lib/seo.ts`
- Locale-aware canonical URLs
- JSON-LD structured data
- Dynamic Open Graph images via `/src/lib/og-utils.tsx`

### Styling

- Tailwind CSS with custom color system. **See DESIGN.md for the canonical palette, type, spacing, and aesthetic direction.** Tokens live in `src/styles/index.css` (`bg-canvas/card/soft/slot`, `text-ink`/`-2/-3/-4`, `border-line`/`-2`, `bg-accent`); the source-of-truth spec is `design_handoff_portfolio/README.md`.
- Dark mode via class-based next-themes (light + dark are equally first-class — never ship a feature in only one mode)
- Import path alias: `@/*` → `./src/*`

## Design System

**Always read DESIGN.md before making any visual or UI decisions.** All font choices, colors, spacing, and aesthetic direction are defined there. Do not deviate without explicit user approval.

The system is the recruiter-focused portfolio from `design_handoff_portfolio/` — Geist (+ JetBrains Mono in the hero pill/terminal only), blue `#1D4ED8` accent (dark-mode remap `#5B8AF5`), white/near-black palette, 1080px content width. Signature elements (hero terminal card, numbered accent eyebrows, availability pill) are documented in DESIGN.md and must not be removed without flagging. All portfolio copy is final and verbatim in `messages/{locale}/portfolio.json` — do not paraphrase it.

In code review and QA: flag any code that introduces purple/violet, decorative gradients, Inter/Space Grotesk/IBM Plex Sans, shadows or radii outside the DESIGN.md scales, or any other entry on the DESIGN.md anti-slop checklist.

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
- `SANITY_REVALIDATE_SECRET` (the `/api/revalidate` webhook rejects all requests without it)
- `NEXT_PUBLIC_API_BASE_URL`, `NEXT_PUBLIC_SITE_URL`

Contact form (optional but required in production — see `.env.example`):

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` (Cloudflare Turnstile anti-bot)
- `RESEND_API_KEY`, `EMAIL_FROM`, `EMAIL_TO` (Resend email delivery)
