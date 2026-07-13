# alanis.dev — Portfolio

A single-page, bilingual (English/Spanish) developer portfolio built with Next.js 16, backed by a Sanity-powered blog. Aimed at recruiters and hiring managers: hero with an animated terminal card, stats, about, experience timeline, featured projects, skills, blog, and contact — in light and dark mode. The design system is documented in [DESIGN.md](./DESIGN.md).

## Features

### Core Functionality

- **Single-Page Portfolio**: Hero (availability pill + animated terminal), stats strip, About, Experience timeline, Featured Projects, Skills, Blog, and Contact sections; legacy routes (`/about`, `/contact`, …) permanently redirect to their home-page sections
- **Bilingual Support**: Full English and Spanish language support using next-intl (English at `/`, Spanish at `/es`)
- **Content Management**: Sanity CMS v6 integration with localized content
- **Blog System**: Multi-language blog at `/blog` with Portable Text support; home-page blog section shows the featured + recent posts and degrades gracefully without Sanity
- **Contact Form**: No backend by design — submitting opens the visitor's email client with the message pre-filled (`mailto:`)

### Technical Features

- **Type-Safe**: Full TypeScript support with strict typing
- **Modern Stack**: Next.js 16, React 19, Tailwind CSS 4
- **Testing**: Vitest testing framework with 100% passing tests
- **Security**: Comprehensive security headers and hardening
- **Performance**: Optimized images (AVIF, WebP), code splitting
- **Analytics**: Vercel Analytics integration
- **Responsive**: Mobile-first design with dark/light themes

## Tech Stack

### Frontend

- **Framework**: Next.js 16.2 (App Router, Turbopack builds)
- **React**: 19.2
- **Styling**: Tailwind CSS 4.3 (CSS-first config — theme tokens live in `src/styles/index.css`)
- **UI Components**: Radix UI, Lucide Icons
- **Internationalization**: next-intl 4.13
- **State Management**: Zustand (minimal UI state)

### Backend & CMS

- **CMS**: Sanity 6.4 (next-sanity 13)
- **API Client**: Axios 1.18 (with security fixes)
- **Content**: Portable Text for rich content

### Development

- **Language**: TypeScript 5.9
- **Testing**: Vitest 3.2 (unit) + Playwright (e2e)
- **Linting**: ESLint CLI with flat config (`eslint.config.mjs`)
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 22.12+ (an `.nvmrc` is provided — `nvm use`)
- pnpm (this repo is pnpm-only; the npm lockfile was removed)
- Sanity account for CMS

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd alanis-saas-upgrade
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Configure your `.env.local` with required values:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token
SANITY_REVALIDATE_SECRET=your_webhook_secret

# External API & site
NEXT_PUBLIC_API_BASE_URL=https://api.alanis.dev
NEXT_PUBLIC_SITE_URL=https://www.alanis.dev

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

The contact form needs no email/anti-spam configuration — it builds a `mailto:` URL client-side.

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Available Scripts

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server

# Testing
pnpm test             # Run tests
pnpm test:watch       # Run tests in watch mode
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run Playwright e2e tests

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Run ESLint with autofix
pnpm typecheck        # Run TypeScript compiler check
```

## Project Structure

```
alanis-saas-upgrade/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── [locale]/       # Localized routes (home, blog; about/contact redirect stubs)
│   │   ├── api/            # Route handlers (Sanity revalidate webhook)
│   │   ├── studio/         # Embedded Sanity Studio at /studio
│   │   └── providers.tsx   # Client providers
│   ├── components/         # React components
│   │   ├── portfolio/     # Single-page portfolio sections (Hero, Terminal, Nav, ...)
│   │   ├── Blog/          # Blog components (Portable Text, posts)
│   │   ├── Common/        # Breadcrumb + JSON-LD helpers
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility functions
│   │   └── api/           # API client
│   ├── sanity/            # Sanity CMS configuration
│   │   ├── lib/           # Sanity utilities
│   │   └── schemas/       # Content schemas
│   ├── store/             # Zustand store (UI state)
│   ├── types/             # TypeScript types
│   └── hooks/             # Custom React hooks
├── design_handoff_portfolio/ # Design handoff (source of truth for the redesign)
├── messages/              # i18n translation files
│   ├── en/               # English translations
│   └── es/               # Spanish translations
├── migrations/            # Sanity migration scripts
└── public/               # Static assets (resume PDF, logos, images)
```

## Internationalization (i18n)

The platform supports two locales: **English (en)** and **Spanish (es)**.

### Route Structure

- English (default): `/*` — no locale prefix; legacy `/en/*` URLs redirect to the root
- Spanish: `/es/*`

### Adding Translations

Translations are organized by namespace in `messages/{locale}/`:

- `common.json` - Shared content
- `navigation.json` - Nav labels
- `home.json` - Homepage metadata
- `portfolio.json` - All portfolio section copy (final and verbatim — do not paraphrase; see CLAUDE.md)
- `blog.json` - Blog section

Example:

```json
// messages/en/home.json (keys are nested per section)
{
  "meta": {
    "title": "Emmanuel Alanis — Senior Full Stack Developer",
    "description": "..."
  }
}
```

## Content Management (Sanity)

### Content Types

- **Posts**: Blog articles with i18n support
- **Authors**: Author profiles
- **Categories**: Content categorization

### Localized Fields

Fields like `title`, `description`, and `body` support multiple languages using Sanity's internationalization structure.

### Running Sanity Studio

The Studio is embedded in the app — run `pnpm dev` and open [http://localhost:3000/studio](http://localhost:3000/studio).

## Testing

The project uses Vitest for testing:

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

Current test coverage focuses on:

- Utility functions and blog helpers (`blog-utils`)
- Portfolio components (e.g. the hero Terminal animation)
- UI store and shared UI components

End-to-end coverage runs on Playwright (`pnpm test:e2e`): home sections, blog, contact, navigation/anchors, locale switching, translation fallback, dark mode, accessibility, error scenarios, and the embedded Sanity Studio.

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy

### Environment Variables for Production

Ensure all variables from `.env.example` are configured in your deployment platform.

## Security

- **Security Headers**: CSP, HSTS, X-Frame-Options configured
- **Dependencies**: Regularly updated, CVE-free
- **API Security**: Token-based authentication
- **Input Validation**: Form validation and sanitization

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests: `pnpm test`
4. Run type check: `pnpm typecheck`
5. Run linter: `pnpm lint`
6. Submit a pull request

## Documentation

- [DESIGN.md](./DESIGN.md) - Canonical design system (palette, type, spacing, anti-slop checklist)
- [CLAUDE.md](./CLAUDE.md) - Project instructions for Claude Code
- [TODOS.md](./TODOS.md) - Open follow-ups and deferred work
- `design_handoff_portfolio/` - Redesign handoff (pixel reference for the portfolio)

Additional documentation available in `/docs`:

- API Client Guide
- Backend Migration Guide
- i18n Fallback Strategy
- Invoice Ninja Integration
- SEO Setup
- Stripe Webhook Setup

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for versioned release notes.

Historical reports:

- `WEEK1_REPORT.md` - Initial setup and testing
- `WEEK2_REPORT.md` - Code quality improvements
- `MAINTENANCE_REPORT.md` - Security updates

## License

[Your License Here]

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, Sanity, and modern web technologies.
