# TODOS

## CI / Infrastructure

### Run the Sanity Studio e2e spec in CI

**Priority:** P1
`e2e/sanity-studio.spec.ts` self-skips when `NEXT_PUBLIC_SANITY_PROJECT_ID` is the `ci-placeholder` value CI sets without secrets, so the riskiest surface (embedded Studio) is never exercised by the pipeline. Set the real `NEXT_PUBLIC_SANITY_*` repo secrets (read-only; no write token needed) so the 7 studio tests run in CI. Noticed on `chore/stack-prep-redesign`.

## Proxy / Routing

### Conditional x-locale Set-Cookie for CDN cacheability

**Priority:** P2
`src/proxy.ts` sets the `x-locale` cookie on every matched response even when the value is unchanged; unconditional `Set-Cookie` headers can hinder CDN caching of ISR pages. Only set the cookie when `request.cookies.get("x-locale")?.value !== locale`. Measure Vercel cache-hit behavior before/after. Deferred from the v0.4.0 stack-prep ship (behavior-neutral branch).

## Content / Assets

### Replace placeholder image slots with real screenshots

**Priority:** P1
The project cards (Consumer Lending 4:3, Ready Set + Destino SF 16:10) and the blog-fallback cover render neutral `bg-slot` placeholder blocks per the handoff. Source real product screenshots and drop them in. Also: several Sanity posts lack EN translations (Spanish titles show on the EN page via fallback), `publishedAt`, and categories — fix in Studio.

## Contact form

### Lazy-mount the Turnstile widget

**Priority:** P3
The Turnstile widget initializes on page load even though the contact form is the last section of the single-page portfolio. Defer initialization until the form nears the viewport (IntersectionObserver) or use Turnstile's interaction-only appearance. Deferred from the v0.5.1 review.

### Consider per-IP rate limiting on submitContact

**Priority:** P3
Turnstile single-use tokens are the throttle on the public contact action; without Turnstile keys the form degrades to unthrottled (send still gated on `RESEND_API_KEY`). If spam or quota burn ever shows up, add a lightweight per-IP limiter (Upstash or in-memory) as defense in depth. Accepted risk in the v0.5.1 review.

## Redesign follow-ups

### Deferred redesign sub-items

**Priority:** P2
Deferred from the v0.5.0 redesign ship: `@portabletext/react` 6 and `@vercel/analytics` 2 upgrades; dead shadcn `hsl()` token cleanup in `src/styles/index.css` and `src/components/ui/*` (the `--radius`-undefined latent parity still stands for ui/* primitives used by blog pages).

### CSP hardening: drop 'unsafe-inline' from script-src

**Priority:** P3
`script-src` keeps `'unsafe-inline'`, which blunts the CSP's XSS protection. Move to nonce-based script-src (Next.js supports nonces via the proxy/headers) or hashes. From the v0.6.0 release review.

### Small copy/i18n/a11y follow-ups from the v0.6.0 review

**Priority:** P3
(1) `contact.ts` builds the mail subject as `t("mailSubject") + name` — the trailing space in the translation is load-bearing and locales can't reorder; switch to an ICU placeholder `{name}`. (2) The hero Terminal typing loop ignores `prefers-reduced-motion` while the CSS animations respect it — render the finished script for reduced-motion visitors. (3) The green "AML/KYC · in production" badge keeps its light-mode pair in dark mode (~3:1 contrast); add a dark remap (e.g. `dark:text-[#34D399]`) and record it in DESIGN.md. (4) Contact email/social literals are duplicated across Contact/Footer/ContactForm/email.ts — import from `siteConfig`. (5) The theme-color hexes are hand-synced across Nav.tsx/layout.tsx/index.css — centralize.

### Pin the e2e env contract in playwright.config

**Priority:** P3
`e2e/contact.spec.ts` assumes no `RESEND_API_KEY`/Turnstile keys in the server env — a dev running `pnpm test:e2e` with real keys in `.env.local` would send an actual email and fail the assertion. Pin `webServer.env` (empty contact vars) in `playwright.config.ts`, and consider moving the duplicated timeout bumps from contact/dark-mode specs into the config. Also: the ES validation e2e only asserts `body` is visible — mirror the EN assertions. From the v0.6.0 release review.

### Trim the home-page data payloads

**Priority:** P3
(1) The home GROQ query ships full post bodies (`pt::text`) just to count words server-side — compute the count in GROQ instead. (2) `NextIntlClientProvider` receives the full message bag; pass only the client-consumed namespaces (nav/hero/contact). From the v0.6.0 release review.

## Completed

### Delete the unused shadcn ui primitives and their deps

**Priority:** P2
Nothing outside `src/components/ui/` imports the shadcn primitives (badge, button, card, carousel, dialog, dropdown-menu, pagination, table, the index barrel) — only `PageNotFound` is live. Delete them plus the orphaned deps (`@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `embla-carousel-react`, `lucide-react` and its `optimizePackageImports` entry). Same sweep: `src/components/Blog/{SingleBlog,RelatedPost,SharePost,TagButton}.tsx` are unimported, and `src/styles/index.css` carries dead tokens (`--shadow-three`, `--animate-accordion-*`, the `#checkboxLabel` rule). From the v0.6.0 release review.
**Completed:** v0.6.1 (2026-07-14)

### Strip the stale Stripe entries from CSP and .env.example

**Priority:** P2
`next.config.js` allowlists js.stripe.com / api.stripe.com / hooks.stripe.com / *.stripe.com on four CSP directives but no Stripe code or dependency remains; `.env.example` keeps a Stripe key section. Remove both (or comment why they stay). Also stale: `vitest.config.ts` coverage excludes for nonexistent `src/app/{dashboard,error,new-ui}/**`, and the `next.config.js:8` comment still says "middleware" instead of `src/proxy.ts`. From the v0.6.0 release review.
**Completed:** v0.6.1 (2026-07-14)

### Serve the analytics script first-party

**Priority:** P2
`layout.tsx` loads Umami from `analytics-omega-nine.vercel.app` (allowlisted in CSP script-src/connect-src). A `*.vercel.app` subdomain is released if the project is deleted/renamed — anyone claiming it gains script execution on the site. Point a first-party domain (e.g. `analytics.alanis.dev`, which already exists) at the Umami project and load from there. Related: the instance is currently returning 500 on `/api/send` (15–24s) — page-view data is being dropped; check its database. From the v0.6.0 release review + QA.
**Completed:** v0.6.1 (2026-07-14)

### Verify the handoff logo SVGs

**Priority:** P2
`public/assets/logo-light.svg` / `logo-dark.svg` contained four `<image>` elements with no `href` — the raster laptop icon really was stripped in the design-tool export. Restored from the pre-redesign originals and re-rasterized to 9KB transparent PNGs at 3× (`/assets/logo-{light,dark}.png`); the SVGs were removed.
**Completed:** v0.5.1 (2026-07-13)

### Major visual redesign on the modernized stack

**Priority:** P1
Design folder provided as `design_handoff_portfolio/`. DESIGN.md rewritten with the new system → token layer in `src/styles/index.css` → portfolio components → single-page home in en+es, light+dark; blog data layer preserved, contact form replaced by the specced mailto flow. Deferred sub-items split into "Deferred redesign sub-items" above.
**Completed:** v0.5.0 (2026-07-12)
