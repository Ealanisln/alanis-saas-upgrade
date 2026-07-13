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

### Verify the handoff logo SVGs

**Priority:** P2
`public/assets/logo-light.svg` / `logo-dark.svg` (byte-identical to the handoff assets) contain four `<image>` elements with no `href` inside mask/filter defs — the raster payload was stripped in the design-tool export. The path-based wordmark renders fine, but confirm no icon mark was lost, then clean ~10KB of dead defs with SVGO. Noticed by adversarial review on `feature/portfolio-redesign`.

## Redesign follow-ups

### Deferred redesign sub-items

**Priority:** P2
Deferred from the v0.5.0 redesign ship: `@portabletext/react` 6 and `@vercel/analytics` 2 upgrades; dead shadcn `hsl()` token cleanup in `src/styles/index.css` and `src/components/ui/*` (the `--radius`-undefined latent parity still stands for ui/* primitives used by blog pages).

## Completed

### Major visual redesign on the modernized stack

**Priority:** P1
Design folder provided as `design_handoff_portfolio/`. DESIGN.md rewritten with the new system → token layer in `src/styles/index.css` → portfolio components → single-page home in en+es, light+dark; blog data layer preserved, contact form replaced by the specced mailto flow. Deferred sub-items split into "Deferred redesign sub-items" above.
**Completed:** v0.5.0 (2026-07-12)
