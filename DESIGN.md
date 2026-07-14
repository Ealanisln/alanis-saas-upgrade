# Design System — alanis.dev (Personal Portfolio)

> **Source of truth:** `design_handoff_portfolio/README.md` + the two `.dc.html`
> references in that folder. This file summarizes the system for day-to-day
> decisions; when in doubt, the handoff references win.

## Memorable Thing

> A senior full-stack engineer who owns regulated production systems end-to-end — worth hiring for remote, USD-denominated roles.

The site is a single-page portfolio aimed at recruiters and hiring managers
(US-remote market), bilingual EN/ES, with the blog (Sanity) as supporting
evidence of production experience.

## Product Context

- **What this is:** Single-page personal portfolio (hero, stats, about, experience timeline, featured projects, skills, blog, contact) + blog index/post pages, for Emmanuel Alanis, Senior Full Stack Developer, Mexico City (GMT-6).
- **Who it's for:** Recruiters and hiring managers evaluating for remote roles; secondarily technical peers reading the blog.
- **Predecessor:** The 2026-04 "Production Console" system (signal orange `#FF5C1F`, `// status-line` strip, oversized ES//EN hero) was superseded on 2026-07-12 by the design handoff. Its three "load-bearing risks" are retired with it.

## Aesthetic Direction

Calm, credible, production-grade. White/near-white surfaces, hairline borders,
one saturated blue accent, a dark terminal card in the hero as the single
"developer" signal. Both light and dark mode are first-class — never ship a
feature in only one mode.

## Color

CSS variables live in `src/styles/index.css`; Tailwind utilities map through
`@theme inline` (`bg-canvas`, `bg-card`, `bg-soft`, `bg-slot`, `text-ink`,
`text-ink-2/3/4`, `border-line`, `border-line-2`, `bg-accent`, `text-accent`).

| Var           | Light                    | Dark                               |
| ------------- | ------------------------ | ---------------------------------- |
| `--bg`        | `#F7F8FA`                | `#0F1115`                          |
| `--bg-card`   | `#FFFFFF`                | `#171A21`                          |
| `--bg-soft`   | `#F1F3F7`                | `#242A37`                          |
| `--slot-bg`   | `#F7F8FA`                | `#1D222D`                          |
| `--ink`       | `#16181D`                | `#F2F4F8`                          |
| `--ink-2`     | `#3D4453`                | `#C4CAD6`                          |
| `--ink-3`     | `#5B6270`                | `#98A1B3`                          |
| `--ink-4`     | `#9AA3B2`                | `#7A8397`                          |
| `--line`      | `#E6E8EE`                | `#262B36`                          |
| `--line-2`    | `#DCE0E8`                | `#333A49`                          |
| `--nav-bg`    | `rgba(247,248,250,0.85)` | `rgba(15,17,21,0.82)`              |
| `--chip-bg`   | `#16181D`                | `#16181D` (+ `#333A49` border)     |
| `--footer-bg` | `#16181D`                | `#0B0D11` (+ `#262B36` top border) |
| `--dots`      | `#DCE0E8`                | `#262B36`                          |
| `--term-line` | `#262B36`                | `#333A49`                          |
| `--accent`    | `#1D4ED8`                | `#5B8AF5` (remap)                  |

- Accent alternatives (config, unused by default): `#0F766E` (dark `#2CB5A5`), `#1E3A8A` (dark `#7C93E8`).
- Status green: dot `#16A34A` (+ `rgba(22,163,74,0.15)` ring); badge text `#15803D` on `rgba(22,163,74,0.09)`.
- Accent focus/marker rings: `color-mix(in srgb, var(--accent) 12%, transparent)`.
- `::selection`: `rgba(29,78,216,0.16)`.
- Terminal card is always dark: bg `#0F1115`, header `#171A21`, prompt `#5B8AF5`, output `#F2F4F8`, status `#34D399`.
- **Banned:** purple/violet anywhere; multi-color gradients (the hero's white→off-white vertical gradient is the one exception, from the handoff); Inter / Space Grotesk / IBM Plex.

## Typography

- **Sans:** Geist 400/500/600/700 via `next/font/google` — a single `--font-geist` variable (deduped @font-face/preload), mapped to `--font-heading` / `--font-body` in `src/styles/index.css`.
- **Mono:** JetBrains Mono 400/500 (`--font-jetbrains-mono`) — hero availability pill and terminal card only.
- Display sizes carry negative letter-spacing (H1 `-0.03em`, H2 `-0.02em`, card titles `-0.01em`/`-0.015em`).
- Key sizes: H1 `clamp(42px,7vw,72px)` desktop / 40px mobile; H2 `clamp(28px,3.6vw,38px)` / 26px; eyebrow 13px/12px 600 uppercase `0.08em` accent, numbered `0N — Name`.

## Spacing & Layout

- Content max-width **1080px**, 24px side padding desktop / 18–20px mobile.
- Section padding `clamp(64px,9vw,112px)` desktop / 56px mobile vertical.
- Sections alternate: About/Projects/Blog/Contact on `--bg`; Stats/Experience/Skills on `--bg-card` with 1px top+bottom `--line` borders.
- Radii: 8 (inputs, small buttons), 9–10 (CTAs), 12 (flagship image, mobile pill), 14 (form card, terminal), 16 (project/blog cards), 999 (pills/chips).
- Shadows (handoff spec): card `0 8px 24px rgba(22,24,29,0.05)`; hover `0 10px 28px rgba(22,24,29,0.08)`; button `0 1px 2px rgba(22,24,29,0.08)`; terminal `0 24px 48px rgba(22,24,29,0.18)`.
- Breakpoint: **768px** for nav collapse and desktop/mobile layout swaps (mobile reference designed at 390px).

## Motion

- `fadeUp` 0.6s `cubic-bezier(0.2,0.7,0.2,1)`, hero stagger 0/0.08/0.14/0.2/0.26/0.32s.
- `menuIn` 0.18s ease-out (mobile menu); micro-transitions 0.15–0.18s.
- Terminal typing: 52ms/char, 420ms pause after commands, 300ms between output lines, blinking cursor when done.
- Availability dot pulse 2.4s.
- **Banned:** scroll-driven parallax, fade-up-on-scroll on every block, gradient animations.

## Signature Elements (load-bearing — do not remove without flagging)

1. **Hero terminal card** with the typed `whoami / cat stack.txt / ./status --production` script — the single "developer" signal on the page.
2. **Numbered accent eyebrows** (`01 — About` … `06 — Contact`) tying the single-page structure together.
3. **Availability pill** (green pulsing dot, JetBrains Mono, GMT-6) — must be kept accurate; stale status is worse than none.

## Behavior

- Theme: light/dark toggle, persisted in `localStorage` key `alanis-portfolio-theme` (next-themes, class strategy, `color-scheme` set, no flash).
- Language: EN/ES via next-intl locale routing (`/` and `/es`), globe toggle in nav; all portfolio copy in `messages/{locale}/portfolio.json` — **copy is final, verbatim from the handoff; do not paraphrase.**
- Contact form: server action → Cloudflare Turnstile verification → Resend email to `EMAIL_TO`, subject `Opportunity for Emmanuel — from {name}` (the `mailSubject` string). Widget hidden and verification skipped when the Turnstile env keys are unset (the idle note swaps to `fNotePlain` so the copy never claims protection that isn't active).
- Form status colors: success reuses the accent; error text uses the legacy `--t-error` token (`#C0392B` light / `#FF6B5A` dark) — carried over from the pre-redesign palette as the system's only error color, kept for both status messaging and the blog/error pages.
- Smooth anchor scrolling with `scroll-padding-top` 96px desktop / 76px mobile.
- Project/blog-fallback images are neutral `--slot-bg` placeholder blocks (4:3 flagship, 16:10 secondary, 16:8.5 / 16:9 blog) until real screenshots exist.

## Anti-slop Checklist (flag in review)

- Purple/violet anywhere
- Decorative gradients (beyond the specced hero white→off-white)
- Inter, Space Grotesk, IBM Plex as display or body
- system-ui as primary display font
- 3-column feature grid with icons in colored circles
- Stock-photo people in hero
- "Built for X" / "Designed for Y" copy patterns
- Copy that deviates from the handoff's final verbatim text
- New shadows/radii outside the scales above

## Decisions Log

| Date       | Decision                                                                    | Rationale                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-26 | "Production Console" system created (signal orange, status-line, ES//EN)    | Chosen via /design-consultation 3-variant comparison.                                                                                                                                                                                                                              |
| 2026-07-12 | **Superseded** by the recruiter-focused portfolio handoff                   | Product pivot: from selling dev services to landing remote roles. New system: Geist, blue `#1D4ED8` accent, hero terminal card, 1080px page.                                                                                                                                       |
| 2026-07-12 | `#1D4ED8` blue un-retired as the accent                                     | The 2026-04 ban targeted default-GitHub blue in the old system; the handoff explicitly specs this accent with a dark remap `#5B8AF5`.                                                                                                                                              |
| 2026-07-12 | Contact backend (Resend + Turnstile) removed                                | Handoff specs a no-backend `mailto:` form.                                                                                                                                                                                                                                         |
| 2026-07-13 | Contact backend (Resend + Turnstile) **restored**; brand logo re-rasterized | Owner decision post-launch: keep the anti-bot form, not `mailto:`. Handoff logo SVGs had stripped the embedded laptop icon (blank `<image>` tags); originals were 165KB raster-in-SVG, so the full mark now ships as 9KB transparent PNGs at 3× (`/assets/logo-{light,dark}.png`). |
