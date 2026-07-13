# Changelog

All notable changes to this project will be documented in this file.

## [0.4.0] - 2026-07-12

Stack-wide platform modernization with strict 1:1 visual parity — the site looks and behaves identically, but now runs on current majors as the foundation for the upcoming redesign.

### Changed

- **Tailwind CSS 3.4 → 4.3**: CSS-first configuration — `tailwind.config.ts` replaced by `@theme` tokens in `src/styles/index.css`; palette vars renamed `--color-*` → `--t-*`; custom container breakpoint steps (450–1400px) preserved; v4 class renames applied (`outline-hidden`, `shadow-xs`, `shrink-0`, opacity slash syntax)
- **Next.js 15.5 → 16.2**: first Turbopack production build; `src/middleware.ts` renamed to `src/proxy.ts` per Next 16 convention (runtime edge → Node); CI moved to Node 22 with `engines >=22.12` and `.nvmrc`
- **Sanity 4 → 6** with next-sanity 13 and internationalized-array plugin 5; `@sanity/image-url` v2 named-import migration; five studio-transitive packages removed from direct dependencies
- Linting migrated from the deprecated `next lint` to the ESLint CLI with a consolidated flat config (rules from the dead `.eslintrc.json` restored: import ordering, no-console, prefer-const, and friends)
- Font variables now live on `<html>` so Tailwind v4 `:root`-level font tokens resolve correctly (headings keep the Geist display face, code blocks keep JetBrains Mono)

### Fixed

- Proxy malformed-URL guard made case-insensitive (lowercase percent-encodings no longer bypass the 404)
- Locale detection matches `/es` exactly or as a path prefix (a future `/essays` route would no longer be tagged Spanish)
- `x-locale` cookie hardened with `secure` in production; localhost image patterns now allowed in development only
- Playwright suite freed of `networkidle` waits (a CI flake class under Next 16 prefetching) — e2e wall time dropped from ~2 minutes to ~37 seconds
- Coverage thresholds actually enforce now (the previous nested config shape was silently ignored)

### Removed

- Unused `zod` dependency and stale `package-lock.json` (pnpm repo)
- Dead duplicate Sanity image URL builder (`src/sanity/lib/image.ts`)
- Security-audit exposure: production dependency vulnerabilities down to two accepted moderates inside Sanity's CLI tooling

## [0.3.1] - 2026-04-26

### Added

- `DESIGN.md` at repo root codifying the "Production Console" design system — palette, type stack, spacing, layout, motion, anti-slop checklist, and decisions log
- `CLAUDE.md` "Design System" section instructing future Claude/CC sessions to read `DESIGN.md` before any visual work
- Portfolio repositioned as **AI-first developer**: hero, about, and experience copy rewritten to lead with AI orchestration (Claude Code as daily driver, plus Cursor / Codex / Gemini for specialized roles); badges, terminal prompt, and stats updated to match

### Changed

- Heading + body font swapped from Space Grotesk + IBM Plex Sans to **Geist** (Vercel)
- Mono font swapped from IBM Plex Mono to **JetBrains Mono**
- Light-mode background swapped from pure white to warm-paper `#FAFAF7`
- Dark-mode background tightened from `#0D1117` to `#0B0D0E`
- Single-accent palette: GitHub-blue `#2f81f7` primary and purple `#8250df` accent retired in favor of signal-orange `#FF5C1F` (light) / `#FF6A2C` (dark)
- Tailwind legacy color literals (`black`, `dark`, `gray-dark`, `gray-light`, `stroke`, `body-color`, `bg-color-dark`) remapped to new palette equivalents
- `shadow-submit` tint changed from blue to orange
- `meta theme-color` (light + dark) updated to match new bg tokens
- Spanish locale flag changed from `🇪🇸` to `🇲🇽` to better reflect the LATAM audience
- `LanguageConfirmation` banner readability — replaced the `from-primary to-primary/90` gradient (which faded into the page) with solid `bg-primary`, and bumped the dismiss button from `border-white/50` to full `border-white` with a hover-invert so both buttons read with high contrast on the orange
- Day-job framing updated for accuracy: "Lead Developer" → "Full-Stack Developer", and copy now describes the actual team shape (2 full-stack devs + 1 IT director). Industry framing changed from generic "fintech" to the more specific Mexican regulated entity, **SOFOM**
- Location compressed to **CDMX** in the hero terminal prompt and `developer.ts` code card so the hero doesn't overflow on mobile

### Removed

- Space Grotesk, IBM Plex Sans, IBM Plex Mono Google Font imports
- `tsconfig.tsbuildinfo` from version control (was tracked despite being in `.gitignore`)

## [Unreleased]

### Added

- Sanity on-demand revalidation endpoint (`/api/revalidate`) for instant blog updates
- Unit tests for revalidation API endpoint (8 tests)
- Unit tests for Posts component including author handling (16 tests)
- Blog post OG images now display only the cover image from Sanity (no text overlay)
- Unit tests for blog post OG image component (9 tests)
- System theme option in ThemeToggler dropdown (light/dark/system) with device preference support
- Unit tests for ThemeToggler component (22 tests)
- Email internationalization for contact and quote confirmation emails
- Resend email service integration for contact and quote forms (AWDP-59)
- Cloudflare Turnstile anti-spam protection for forms (AWDP-58)
- Stripe webhook idempotency to prevent duplicate processing (AWDP-60)
- ESLint enabled in builds with all errors fixed (AWDP-62)
- Idempotency utility library for webhook handling
- Unit tests for email service and server actions
- Comprehensive unit test suite (300+ tests) (AWDP-41 to AWDP-50)
  - useApi and useQuotes hooks tests (AWDP-41)
  - API client utilities tests (AWDP-42)
  - Contact form component tests (AWDP-43)
  - SEO utilities tests (AWDP-44)
  - QuoteCalculator class tests (AWDP-46)
  - Stripe utilities tests (AWDP-48)
  - Zustand UI store tests (AWDP-49)
- E2E test suite with Playwright (62 tests)
  - Form submission flows (AWDP-45)
  - Accessibility tests with axe-core WCAG 2.1 AA (AWDP-47)
  - Dark mode toggle tests (AWDP-50)
- SEO structured data (JSON-LD) for all pages (AWDP-36)
- BreadcrumbJsonLd component for consistent breadcrumb structured data
- E2E test coverage for locale switching and navigation

### Changed

- Updated Next.js from 15.5.7 to 15.5.9 (security patch for DoS vulnerability)
- Improved pricing page structured data with proper currency formatting (USD)
- Fixed blog listing logo URL to use correct domain (alanis.dev)
- E2E tests now properly handle mobile viewport navigation

### Fixed

- Blog crash when posts have no author (added optional chaining)
- Blog OG images now use absolute URLs for Facebook/WhatsApp compatibility
- OG images now use static `/og-alanis-web-dev.jpg` for consistent branding
- Added `og:site_name` to all page metadata
- Contact form "sending" button now displays properly translated text
- Email sender domain updated to use verified updates.alanis.dev subdomain
- Email service now accepts both RESEND_API_KEY and SEND_API_KEY env variables
- Mobile navigation tests now correctly check for hamburger menu button
- Blog post navigation test waits for URL change before assertions
- Removed redundant font loading (CSS @import) - fonts now loaded via next/font

### Security

- Content-Security-Policy and enhanced security headers (AWDP-57)
- Patched CVE affecting Next.js Server Components (DoS vulnerability)
- Updated dependencies to address known vulnerabilities
