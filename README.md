# Alanis SaaS Platform

A modern, bilingual (English/Spanish) SaaS platform built with Next.js 15, featuring comprehensive i18n support, Sanity CMS integration, and a service calculator for quote generation.

## Features

### Core Functionality
- **Bilingual Support**: Full English and Spanish language support using next-intl
- **Content Management**: Sanity CMS v4 integration with localized content
- **Service Calculator**: Interactive quote generator with pricing calculations
- **Blog System**: Multi-language blog with Portable Text support
- **Portfolio Showcase**: Featured projects display
- **Contact Forms**: Integrated contact and quote request forms
- **Pricing Plans**: Tiered pricing display with FAQs

### Technical Features
- **Type-Safe**: Full TypeScript support with strict typing
- **Modern Stack**: Next.js 15, React 19, Tailwind CSS
- **Testing**: Vitest testing framework with 100% passing tests
- **Security**: Comprehensive security headers and hardening
- **Performance**: Optimized images (AVIF, WebP), code splitting
- **Analytics**: Vercel Analytics integration
- **Responsive**: Mobile-first design with dark/light themes

## Tech Stack

### Frontend
- **Framework**: Next.js 15.5.6 (App Router)
- **React**: 19.2.0
- **Styling**: Tailwind CSS 3.4.1
- **UI Components**: Radix UI, Lucide Icons
- **Internationalization**: next-intl 3.28.0
- **State Management**: Zustand (cart functionality)

### Backend & CMS
- **CMS**: Sanity 4.10.3
- **API Client**: Axios 1.12.2 (with security fixes)
- **Content**: Portable Text for rich content

### Development
- **Language**: TypeScript 5.7.2
- **Testing**: Vitest 3.2.4
- **Linting**: ESLint with 45+ rules
- **Package Manager**: pnpm

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm
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

# External API
NEXT_PUBLIC_API_BASE_URL=https://api.alanis.dev

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
```

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

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler check
```

## Project Structure

```
alanis-saas-upgrade/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── [locale]/       # Localized routes
│   │   ├── actions/        # Server actions
│   │   └── providers.tsx   # Client providers
│   ├── components/         # React components
│   │   ├── Blog/          # Blog components
│   │   ├── Calculator/    # Service calculator
│   │   ├── Contact/       # Contact forms
│   │   ├── Portfolio/     # Portfolio display
│   │   ├── Pricing/       # Pricing plans
│   │   └── ui/            # Reusable UI components
│   ├── lib/               # Utility functions
│   │   └── api/           # API client
│   ├── sanity/            # Sanity CMS configuration
│   │   ├── lib/           # Sanity utilities
│   │   └── schemas/       # Content schemas
│   ├── store/             # Zustand stores
│   ├── types/             # TypeScript types
│   └── hooks/             # Custom React hooks
├── messages/              # i18n translation files
│   ├── en/               # English translations
│   └── es/               # Spanish translations
├── migrations/            # Sanity migration scripts
└── public/               # Static assets
```

## Internationalization (i18n)

The platform supports two locales: **English (en)** and **Spanish (es)**.

### Route Structure
- English: `/en/*`
- Spanish: `/es/*`

### Adding Translations

Translations are organized by namespace in `messages/{locale}/`:
- `common.json` - Shared content (footer, navigation)
- `home.json` - Homepage content
- `about.json` - About page content
- `blog.json` - Blog section
- `contact.json` - Contact forms
- `plans.json` - Pricing plans
- `portfolio.json` - Portfolio section

Example:
```json
// messages/en/home.json
{
  "title": "Welcome",
  "description": "Professional development services"
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

```bash
# In your Sanity project directory
npm run dev
```

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
- Utility functions
- Cart store functionality

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
4. Run type check: `pnpm type-check`
5. Run linter: `pnpm lint`
6. Submit a pull request

## Documentation

Additional documentation available in `/docs`:
- API Client Guide
- Backend Migration Guide
- Invoice Ninja Integration
- SEO Setup

## Changelog

See individual reports for detailed changes:
- `WEEK1_REPORT.md` - Initial setup and testing
- `WEEK2_REPORT.md` - Code quality improvements
- `MAINTENANCE_REPORT.md` - Security updates

## License

[Your License Here]

## Support

For issues and questions, please create an issue in the repository.

---

Built with ❤️ using Next.js, Sanity, and modern web technologies.
