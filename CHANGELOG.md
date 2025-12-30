# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

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

- Mobile navigation tests now correctly check for hamburger menu button
- Blog post navigation test waits for URL change before assertions
- Removed redundant font loading (CSS @import) - fonts now loaded via next/font

### Security

- Content-Security-Policy and enhanced security headers (AWDP-57)
- Patched CVE affecting Next.js Server Components (DoS vulnerability)
- Updated dependencies to address known vulnerabilities
