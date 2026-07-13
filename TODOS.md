# TODOS

## CI / Infrastructure

### Run the Sanity Studio e2e spec in CI

**Priority:** P1
`e2e/sanity-studio.spec.ts` self-skips when `NEXT_PUBLIC_SANITY_PROJECT_ID` is the `ci-placeholder` value CI sets without secrets, so the riskiest surface (embedded Studio) is never exercised by the pipeline. Set the real `NEXT_PUBLIC_SANITY_*` repo secrets (read-only; no write token needed) so the 7 studio tests run in CI. Noticed on `chore/stack-prep-redesign`.

## Proxy / Routing

### Conditional x-locale Set-Cookie for CDN cacheability

**Priority:** P2
`src/proxy.ts` sets the `x-locale` cookie on every matched response even when the value is unchanged; unconditional `Set-Cookie` headers can hinder CDN caching of ISR pages. Only set the cookie when `request.cookies.get("x-locale")?.value !== locale`. Measure Vercel cache-hit behavior before/after. Deferred from the v0.4.0 stack-prep ship (behavior-neutral branch).

## Redesign (upcoming)

### Major visual redesign on the modernized stack

**Priority:** P1
Design folder to be provided ("claude design"). Flow: update DESIGN.md with the new system → token layer in `src/styles/index.css` → shared shell/primitives → page by page (home, about, blog, blog post, contact) in en+es, light+dark. Blog data layer and contact form logic stay untouched. The latent parity carries (0-radius `rounded-sm/md/lg`, undefined shadcn `hsl()` vars) die in this redesign. Also deferred to this phase: `@portabletext/react` 6, `@vercel/analytics` 2, dead shadcn token cleanup.

## Completed
