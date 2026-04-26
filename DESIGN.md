# Design System — alanis.dev (Alanis SaaS Platform)

## Memorable Thing

> A serious LATAM operator who ships reliable, production-ready products with clear business impact.

Three load-bearing words: **serious**, **production-ready**, **business impact**. Every visual decision must serve at least one. If a decision serves none, drop it.

## Product Context

- **What this is:** Bilingual (ES/EN) marketing site + service calculator + blog + portfolio for Emmanuel Alanis, an independent SaaS developer based in Mexico City selling production-grade web/SaaS development to LATAM and US clients.
- **Who it's for:** Two buyer personas served simultaneously:
  1. **Technical buyer** (CTO, lead dev, founder-engineer) scanning for "is this person any good" — wants real code, stack honesty, shipping cadence.
  2. **Non-technical buyer** (founder, ops lead, marketing director, ES-speaking SMB owner) scanning for "can I trust this person" — wants clear pricing, deliverables, plain-language Spanish.
- **Space:** Independent / boutique SaaS development. Peer set: solo dev portfolios (Brittany Chiang), dev-tool marketing (Linear, Vercel, Bun), boutique LATAM dev shops.
- **Project type:** Marketing site + product feature (calculator) + content (blog, portfolio).

## Aesthetic Direction — "Production Console"

- **Direction:** Tasteful terminal aesthetic. Calm, serious, working-tool energy. NOT green-on-black hacker cosplay. Linear-restrained, Bun-warm, Brittany-Chiang-calm.
- **Decoration level:** Intentional. Typography does most of the work. One deliberate texture: a 1px monospace dot grid at ~6% opacity, hero only. No gradients, no blobs, no decorative shapes, no drop shadows.
- **Mood:** The site itself should feel like a tool that runs in production, not a marketing site about tools that run in production.
- **Reference sites:** linear.app (restraint), bun.com (warm dev marketing), brittanychiang.com (solo-dev minimalism).

## Color

- **Approach:** Restrained — single saturated accent (`#FF5C1F`), warm neutrals, near-black/warm-paper for text and backgrounds.
- **Light mode:**

  | Role         | Hex       | Notes                                                                     |
  | ------------ | --------- | ------------------------------------------------------------------------- |
  | Background   | `#FAFAF7` | Warm paper, never pure white                                              |
  | Surface      | `#F1F0EA` | Cards, code blocks, calculator background                                 |
  | Text primary | `#0B0D0E` | Off-pure near-black                                                       |
  | Text muted   | `#5A5C5E` | Metadata, status, captions                                                |
  | Border       | `#D9D7CF` | Hairline 1px                                                              |
  | **Accent**   | `#FF5C1F` | Signal orange — CTAs, calculator result, status-line live dot, link hover |
  | Code green   | `#0F7A3A` | Code-block string literals only, success states                           |
  | Error        | `#C0392B` | Validation, error states                                                  |

- **Dark mode (equally first-class):**

  | Role         | Hex       | Notes                                         |
  | ------------ | --------- | --------------------------------------------- |
  | Background   | `#0B0D0E` | Near-black, never pure                        |
  | Surface      | `#16191B` |                                               |
  | Text primary | `#E8E8E3` | Off-pure                                      |
  | Text muted   | `#8B8E91` |                                               |
  | Border       | `#23272A` |                                               |
  | Accent       | `#FF6A2C` | Slightly lifted orange for dark-mode contrast |
  | Code green   | `#3FB950` |                                               |
  | Error        | `#FF6B5A` |                                               |

- **Banned colors** (do not introduce without explicit user approval):
  - Purple/violet of any kind (the previous `#8250df` accent was retired — it now reads as default-AI-template in 2026)
  - Default GitHub blue `#2f81f7`/`#58a6ff` (was the previous primary — replaced by accent orange)
  - Any gradient. Solid colors only.

## Typography

- **Display/Heading:** **Geist** (Vercel, free). Weights 600/700. Negative letter-spacing -0.03em on display sizes. Loaded via `next/font/google`.
- **Body:** **Geist** regular (400) and medium (500). Same family as heading for visual coherence.
- **Mono:** **JetBrains Mono** (free). Weights 400/500. Used for: status lines, code blocks, version stamps, calculator field labels (k), tabular numerals in the calculator output, eyebrow `// SECTION` labels.
- **Loading:** `next/font/google` with `display: 'swap'`.
- **Banned fonts** (do not introduce):

  - Inter, Roboto, Open Sans, Lato, Montserrat, Poppins (overused)
  - **Space Grotesk** — was the previous heading font; retired because every Next.js template defaults to it
  - **IBM Plex Sans** — was the previous body font; retired (every dev/agency site uses it)
  - system-ui / -apple-system as primary display font (the "I gave up" signal)

- **Scale (modular, 1.25 ratio):**

  | Role          | Size     | Line height | Weight                                      |
  | ------------- | -------- | ----------- | ------------------------------------------- |
  | Display       | 88–120px | 0.96        | 700                                         |
  | H1            | 64px     | 1.0         | 700                                         |
  | H2            | 48px     | 1.05        | 600                                         |
  | H3            | 32px     | 1.15        | 600                                         |
  | Body large    | 19px     | 1.55        | 400                                         |
  | Body          | 16px     | 1.6         | 400                                         |
  | Small         | 14px     | 1.5         | 400                                         |
  | Mono / status | 12–13px  | 1.5         | 500 (uppercase, letter-spacing 0.08–0.14em) |

- **Always use tabular numerals** (`font-feature-settings: "tnum"`) on the calculator output, pricing, dates, version stamps.

## Spacing

- **Base unit:** 4px.
- **Density:** Comfortable.
- **Scale:** `2(2px) · 4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128`.
- **Section padding:** 96px desktop, 48px mobile (vertical).
- **Container max-width:** `1180px` (slightly tighter than typical — feels curated).
- **Hero padding:** 80px top, 120px bottom (desktop).

## Layout

- **Approach:** Hybrid — disciplined 12-column grid for app/calculator, editorial moments on marketing.
- **Grid:** 12 columns, 32px gutter at desktop, 16px at mobile.
- **Border radius scale:** `sm: 4px, md: 6px, lg: 8px`. **Maximum 8px.** No bubble-rounded buttons. No rounded cards larger than 8px.
- **Borders:** Hairline 1px in `--border`. No drop shadows anywhere on production. Use border + slight surface color shift for elevation.
- **Hero composition (canonical):**
  - Top-left: small monospace logomark `alanis.dev/` with blinking orange cursor block
  - Top-right: minimal mono nav (`work · services · calculator · contact`) + theme toggle
  - Status strip directly below topbar, full-width, 1px borders top/bottom: pulsing orange dot + uppercase mono items separated by bullets (`AVAILABLE · Q3 2026 · 2 SLOTS OPEN · LAST SHIPPED 3 DAYS AGO · CDMX GMT-6`). Must be kept accurate — stale status is worse than no status.
  - Two-column hero grid (1.4fr / 1fr): left column carries oversized `ES // EN` typographic toggle (96px Geist 700, inactive locale dimmed to muted), then headline ("Production-ready software, shipped from Mexico City." with "Mexico City" in accent orange), then subhead, then CTA row (primary orange + secondary border).
  - Right column: code card with hairline border, no shadow, header strip + JetBrains Mono syntax-highlighted real production snippet (Stripe webhook handler is the canonical example).

## Three Signature Risks (the ones that make the site memorable)

These three deliberate departures from category convention are LOAD-BEARING. Removing any of them returns the site to default-template-land. Document any decision to drop one.

1. **Signal orange `#FF5C1F` as the only accent.** Replaces blue/violet category default. The calculator result number is the single largest application of orange on the site — it's the visual mark.
2. **Persistent `// status-line` strip below topbar.** Real, live, must be kept current. Single highest-signal element on the entire site. Says "actively shipping" without saying it.
3. **Oversized `ES // EN` typographic language toggle as a hero element.** Bilingual is a feature, not a header dropdown. Inactive locale dimmed to `--muted`. If the site ever expands to PT, this evolves rather than gets buried.

## Motion

- **Approach:** Minimal-functional with one signature moment.
- **Easing:** enter `ease-out`, exit `ease-in`, move `ease-in-out`.
- **Duration:** micro (50–100ms hover), short (150–250ms state changes), medium (250–400ms layout shifts), long (400–700ms reserved).
- **Signature moment:** When the calculator computes, the result number animates with a counter roll-up (1500ms ease-out). Reinforces "real number, real product."
- **Banned:** scroll-driven parallax, entrance animations on every section, fade-up-on-scroll on every block, gradient color animations.

## Anti-slop Checklist

If a Pull Request introduces any of these, it must be flagged in review:

- Purple/violet anywhere
- Gradients (background, text, button)
- Drop shadows
- 3-column feature grid with icons in colored circles
- Centered-everything hero
- Inter, Space Grotesk, IBM Plex as display or body
- system-ui as primary display font
- Bubble-rounded buttons (border-radius > 8px)
- Stock-photo people in hero
- Emoji as decoration (functional emoji in copy is fine — flags 🇲🇽 etc.)
- "Built for X" / "Designed for Y" copy patterns

## Decisions Log

| Date       | Decision                                                                                                                | Rationale                                                                                                                                                                                               |
| ---------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-04-26 | Initial design system created via /design-consultation                                                                  | Codified after 3-variant side-by-side comparison. Variant A (Production Console + signal orange) chosen unanimously. Memorable thing locked: serious LATAM operator, production-ready, business impact. |
| 2026-04-26 | Retired `#8250df` purple and `#2f81f7` blue accents                                                                     | Both read as default-AI-template/default-GitHub in 2026. Replaced with `#FF5C1F` signal orange.                                                                                                         |
| 2026-04-26 | Retired Space Grotesk + IBM Plex Sans                                                                                   | Both overused. Replaced with Geist (Vercel) for heading + body, JetBrains Mono for status/code. All three free, production-grade.                                                                       |
| 2026-04-26 | Adopted `// status-line` strip + oversized `ES // EN` + signal-orange calculator result as the three load-bearing risks | These are the differentiators. Document any future decision to drop one.                                                                                                                                |

## Implementation References

- **Approved mockup:** `~/.gstack/projects/Ealanisln-alanis-saas-upgrade/designs/design-system-20260426-140447/variant-A-orange.html`
- **Comparison board:** `~/.gstack/projects/Ealanisln-alanis-saas-upgrade/designs/design-system-20260426-140447/board.html`
- **v0 prompt:** see chat transcript for /design-consultation session 2026-04-26 — paste into v0.dev to generate React/Tailwind components matching this system.
