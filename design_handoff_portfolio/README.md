# Handoff: Personal Portfolio — Emmanuel Alanis (Desktop + Mobile)

## Overview
A single-page personal portfolio site for Emmanuel Alanis, Senior Full Stack Developer (Mexico City, GMT-6), targeting recruiters/hiring managers for remote, USD-denominated roles. Sections: sticky nav, hero, stats strip ("By the numbers"), About, Experience (timeline), Featured Projects, Skills, Blog (posts from Sanity), Contact (links + mailto form), footer. Includes a light/dark theme toggle persisted in `localStorage`.

Two design references are included:
- `Portfolio v2.dc.html` — **desktop/responsive** layout (max content width 1080px)
- `Portfolio Mobile.dc.html` — **mobile** layout (≤480px, hamburger menu)

Both share identical content, tokens, and behavior; they differ only in layout/spacing. Implement as **one responsive page**, using the mobile file as the spec for small viewports (breakpoint suggestion: 768px for nav collapse; the mobile reference was designed at 390px).

## About the Design Files
The `.dc.html` files in this bundle are **design references created in HTML** — prototypes showing intended look and behavior, not production code to copy directly. They use a proprietary template runtime (`support.js`, `<x-dc>`, `{{ }}` holes, `sc-if`/`sc-for`) that will not run outside its host environment. **Your task is to recreate these designs in the target codebase's environment** (the developer's stack is Next.js 15 / React 19 / TypeScript / Tailwind — that's the natural target) using its established patterns. All styles in the reference files are inline, so every exact value is readable directly in the markup.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, copy, and interactions. Recreate pixel-perfectly.

## Screens / Views

### 1. Sticky Nav
- Sticky top, z-50, `backdrop-filter: blur(12px)`, background `rgba(247,248,250,0.85)` light / `rgba(15,17,21,0.82)` dark, 1px bottom border `--line`.
- **Desktop:** 68px tall, content max-width 1080px, 24px side padding. Left: logo. Right: text links (About, Experience, Projects, Skills, Blog — 14px/500, color `--ink-3`, hover `--ink`), theme-toggle icon button (36×36, radius 8, 1px border `--line-2`, bg `--bg-card`), primary CTA "Get in Touch" (accent bg, white text, 14px/600, padding 9px 18px, radius 8, hover `brightness(0.92)`).
- **Mobile:** 60px tall, 18px side padding. Left: logo (smaller). Right: theme toggle + hamburger, both **44×44** (radius 10, border `--line-2`, bg `--bg-card`). Hamburger toggles a dropdown menu panel: full-width links (16px/600, 12px vertical padding, 1px dividers) + full-width accent CTA button (radius 10, 13px padding, centered). Menu animates in: `opacity 0→1, translateY(-8px)→0, 0.18s ease-out`. Tapping a link closes the menu.
- Logo has two variants controlled by a `logoStyle` setting:
  - `chip` (desktop default): light logo SVG inside a dark chip (`#16181D` bg, radius 8, padding 7px 12px 5px desktop / 6px 10px 4px mobile; in dark mode chip gets a `#333A49` border). Logo image height 24px desktop / 20px mobile.
  - `wordmark` (mobile default): bare SVG — `logo-dark.svg` in light mode, `logo-light.svg` in dark mode. Height 28px desktop / 24px mobile.
- Theme toggle icon: moon outline in light mode, sun in dark mode (17px stroke icons, stroke-width 1.8).
- Anchor scrolling: `scroll-behavior: smooth`, `scroll-padding-top: 96px` desktop / 76px mobile.

### 2. Hero
- Background: vertical gradient `--bg-card → --bg` (white → off-white).
- **Desktop padding:** `clamp(72px,10vw,128px)` top, `clamp(56px,8vw,96px)` bottom, 24px sides, 1080px max. **Mobile:** 48px 20px 44px.
- Availability pill (conditional, `openToWork` flag, default on): 1px border `--line-2`, bg `--bg-card`, radius 999 (12 on mobile), 13px/500 (12.5px mobile), with a 7px green dot (`#16A34A` + `0 0 0 3px rgba(22,163,74,0.15)` glow ring). Copy: "Open to remote roles · GMT-6 (Mexico City) — full overlap with US business hours".
- H1 "Emmanuel Alanis": `clamp(42px,7vw,72px)` desktop / 40px mobile, weight 700, line-height 1.04–1.06, letter-spacing -0.03em.
- Role line "Senior Full Stack Developer": `clamp(20px,2.6vw,26px)` / 19px mobile, weight 600, **accent color**.
- Intro paragraph: `clamp(16px,1.8vw,19px)` / 15.5px mobile, line-height 1.65, color `--ink-3`, max-width 660px (desktop).
- CTAs: "Download Résumé" (accent, downloads `assets/Emmanuel-Alanis-Resume.pdf`) + "Get in Touch" (outlined, anchors to #contact). 15px/600, radius 9–10. Row with 14px gap on desktop; stacked full-width, 10px gap, centered text on mobile.
- Entrance animation: each element fades up (`opacity 0→1, translateY(14px)→0`), 0.6s `cubic-bezier(0.2,0.7,0.2,1)`, staggered 0 / 0.08 / 0.14 / 0.2 / 0.26s.

### 3. Stats strip — "By the numbers"
- Bg `--bg-card`, 1px top+bottom borders `--line`.
- Desktop: auto-fit grid `minmax(220px,1fr)`, padding `clamp(36px,5vw,56px) 24px`, gap `clamp(24px,4vw,48px)`. Mobile: 2×2 grid, padding 28px 20px, gap 22px 18px.
- Each stat: big number (`clamp(26px,3vw,32px)` / 24px mobile, 700, -0.02em) over a 14px (13px mobile) `--ink-3` caption.
- Content: **2,200+** commits shipped across production platforms in the last 5 months · **8,000+** automated tests maintained across two production platforms · **Zero downtime** production migration to AWS · **14 releases** shipped to production in a 3-week window.

### 4. About (#about, "01 — About")
- Section pattern used everywhere: eyebrow (13px desktop / 12px mobile, 600, letter-spacing 0.08em, uppercase, **accent color**, numbered "0N — Name") + H2 (`clamp(28px,3.6vw,38px)` desktop / 26px mobile, 700, -0.02em).
- Desktop: two-column auto-fit grid `minmax(280px,1fr)`; left = eyebrow + H2 "An engineer who owns systems end-to-end.", right = 3 paragraphs (16.5px, line-height 1.7, `--ink-2`). Mobile: stacked, paragraphs 15.5px.
- Sections alternate background: About/Projects/Contact on `--bg` (page bg); Stats/Experience/Skills on `--bg-card` with top+bottom `--line` borders. Section padding: `clamp(64px,9vw,112px) 24px` desktop / 56px 20px mobile.

### 5. Experience (#experience, "02 — Experience", H2 "Where I've shipped.")
- Vertical timeline. Each entry: grid `20px 1fr` (desktop, gap clamp(16px,3vw,32px)) / `16px 1fr` gap 14px (mobile). Marker column: filled accent dot 12px (11px mobile) with `0 0 0 4px accent@12%` ring for the current-role entry, hollow dot (bg-card fill, 2px accent border) for the second; a 2px `--line` connector runs below the first dot.
- Entry content: role H3 (20px / 18px mobile, 700), date (13.5px/500 `--ink-3`; inline beside title on desktop, own line on mobile), company line (15px / 14px, 600, accent), summary paragraph (15.5px / 14.5px, line-height 1.65, `--ink-2`, max-width 720px desktop), bullet list (15px / 14px, 8px gap).
- Entries (copy verbatim in the reference files):
  1. **Senior Full Stack Developer · DXN — regulated Mexican SOFOM (consumer lending fintech) · Feb 2026 — Present** — ownership summary + 3 bullets (identity verification/OCR/liveness, security hardening/audit, AWS migration + internal tooling).
  2. **Full Stack Engineer (Contractor) · Ready Set Group — US client, SF Bay Area · Jun 2024 — Present** — summary + 2 bullets (Ready Set logistics platform; Destino SF e-commerce), with bolded lead-ins (`600`, `--ink` color).

### 6. Featured Projects (#projects, "03 — Featured Projects", H2 "Production systems, not side demos.")
- **Flagship card** (Consumer Lending Platform — Mexican SOFOM): bg-card, 1px `--line` border, radius 16, shadow `0 8px 24px rgba(22,24,29,0.05)`. Desktop: two-column auto-fit grid `minmax(300px,1fr)` — text left, 4:3 image right, padding `clamp(24px,4vw,40px)`. Mobile: stacked, padding 20px, image between title and description. Badges: "Flagship" (accent bg, white, uppercase 12px/11.5px, radius 999) and "Regulated · in production" (green `#15803D` on `rgba(22,163,74,0.09)`).
- **Two secondary cards** (Ready Set; Destino SF): same card chrome, image on top (16:10), title 19px/18px, description 14.5px/14px, then tech-chip row (chips: 12.5px/12px, 500, `--bg-soft` bg, radius 999, padding 4px 11px/10px). Desktop cards hover-lift: `translateY(-2px)` + shadow `0 10px 28px rgba(22,24,29,0.08)`, 0.18s.
- Every card ends with "Case study — details on request" (13.5px/600, `--ink-3`).
- Image areas are **placeholders** (drag-and-drop slots in the prototype) with radius 12/10, 1px `--line` border, `--slot-bg` background — replace with real product screenshots.
- Tech chips — Ready Set: Next.js 15, React 19, TypeScript, "PostgreSQL · Prisma · Supabase · PostGIS", Stripe, Twilio, Mapbox. Destino SF: Next.js 15, React 19, TypeScript, "PostgreSQL · Prisma · Supabase", Square, Shippo.

### 7. Skills (#skills, "04 — Skills", H2 "Tech stack.")
- Six groups, each with a **2px accent top border**, 14–16px top padding, uppercase group label (14px/13px, 700, 0.05em).
- Desktop: auto-fit grid `minmax(220px,1fr)`; items as a plain stacked list (14.5px, `--ink-2`). Mobile: stacked groups; items as **chips** (13px/500, `--bg-soft`, radius 999, 5px 12px).
- Groups/items (verbatim): Frontend (React 18/19, Next.js 15 App Router, TypeScript strict, Tailwind CSS, Zustand) · Backend (Node.js, Django, PHP / Symfony, Prisma) · Database & Infra (PostgreSQL, PostGIS, Supabase, Redis, Docker, AWS, Hetzner, Coolify / Dokploy, GitHub Actions) · Payments & Integrations (Stripe, Square, Shippo, Twilio, Mapbox / Google Maps, Resend / SendGrid) · Security & Identity (JWT, MFA / OTP, CSP, Biometric liveness detection, OCR document verification, OWASP remediation) · Testing & Quality (Playwright, k6 load testing, Accessibility (WCAG) testing, 8,000+ automated tests maintained).

### 8. Blog (#blog, "05 — Blog", H2 "Notes from production.")
- **Data source: Sanity CMS.** The reference files show hardcoded sample posts; implement with a GROQ query. Suggested post fields: `title`, `slug`, `excerpt`, `coverImage`, `category` (tag), `publishedAt`, estimated read time. Section shows the **featured post** (latest or a `featured` flag) + the **next 4 recent posts** (3 on mobile). "View all posts →" links to the blog index (`/blog`); every card/row links to the post page. Prototype links are `#blog` placeholders.
- Section header row (desktop): eyebrow + H2 left, "View all posts →" link right (14.5px/600, accent, hover → ink), baseline-aligned via flex space-between. Sub-line below: "Writing about web development, new technologies, and the practices that hold up in real production systems." (16px / 15.5px mobile, `--ink-3`, max-width 560px).
- **Desktop layout**: two-column auto-fit grid `minmax(300px,1fr)`, gap `clamp(24px,3vw,32px)`, on `--bg` (page bg, no section borders).
  - **Featured card (left)**: bg-card, 1px `--line` border, radius 16, overflow hidden; hover lift `translateY(-2px)` + shadow `0 10px 28px rgba(22,24,29,0.08)`, 0.18s. Cover image on top, 16:8.5 (16:9 mobile), 1px `--line` bottom border, `--slot-bg` placeholder in prototype. Body padding 26px 28px 28px: category chip (12px/600 uppercase 0.05em, accent text on `color-mix(in srgb, accent 8%, transparent)` bg, radius 999, padding 4px 11px) + date · read time (13px, `--ink-4`), then title (`clamp(20px,2.2vw,24px)`, 700, line-height 1.25, -0.015em), then excerpt (15px, 1.65, `--ink-3`).
  - **Recent list (right)**: stacked rows, each = date · category line (13px, `--ink-4`) over title (17.5px/600, line-height 1.35, `--ink` — whole row is a link), padding 20px 4px, 1px `--line` divider between rows (none after last).
- **Mobile layout**: stacked — header, featured card (body padding 20px, title 19px, excerpt 14px), then 3 list rows (title 16px/600, meta 12.5px, padding 18px 2px), then "View all posts →" link (44px+ hit target).

### 9. Contact (#contact, "06 — Contact", H2 "Let's talk.")
- Desktop: two-column auto-fit grid `minmax(300px,1fr)` — intro + contact links left, form card right. Mobile: stacked.
- Intro: "**Open to remote, USD-denominated opportunities.** I typically reply within one business day — US business hours included." (bold lead in `--ink`).
- Contact links (15px/600, 17px icons, hover → accent; ≥44px hit target on mobile): mailto emmanuel@alanis.dev · linkedin.com/in/ealanis · github.com/Ealanisln.
- Form card: bg-card, 1px `--line` border, radius 14, shadow as project cards, padding 22–32px. Fields: Name (text), Email (email), Message (textarea rows=5), all required. Labels 13.5px/600 `--ink-2`. Inputs: bg `--bg`, 1px `--line-2` border, radius 8, padding ~12px 14px, font-size **16px on mobile** (prevents iOS zoom) / 15px desktop. Focus: accent border + `0 0 0 3px accent@12%` ring. Submit: accent button. Footnote: "Opens your email client with the message pre-filled." (12.5px, `--ink-4`, centered).
- Submit behavior (no backend): build a `mailto:` URL — subject `Opportunity for Emmanuel — from {name}`, body `{message}\n\n— {name} ({email})` — and navigate to it.

### 10. Footer
- Bg `#16181D` light mode / `#0B0D11` dark (with `#262B36` top border in dark).
- Desktop: single row, space-between — left: light logo (26px) + "© 2026 Emmanuel Alanis. Mexico City · GMT-6." (13.5px, `#9AA3B2`-ish); right: GitHub / LinkedIn / email links (`#C6CBD4`, 13.5px/500, hover white). Mobile: stacked (logo, links row, copyright), padding 32px 20px.

## Interactions & Behavior
- **Theme toggle**: switches light/dark by swapping the CSS-variable palette (see Design Tokens). Persist choice in `localStorage` (key used in prototype: `alanis-portfolio-theme`); read on load. Set `color-scheme` accordingly.
- **Accent remap in dark mode**: accent colors brighten — `#1D4ED8→#5B8AF5`, `#0F766E→#2CB5A5`, `#1E3A8A→#7C93E8`.
- **Mobile menu**: hamburger ↔ close (X) icon swap; panel slides/fades in 0.18s; any link tap closes it.
- **Smooth anchor scrolling** with scroll-padding for the sticky nav.
- **Hero stagger animation** on load (see Hero).
- **Hovers**: nav links → ink; accent buttons → `filter: brightness(0.92)`; outlined buttons → border `--ink-4` (+1px lift on desktop hero CTAs); project cards → lift + deeper shadow; contact links → accent; footer links → white.
- **Form**: native HTML validation; mailto submit (above). No loading/error states needed.
- `::selection` background: `rgba(29,78,216,0.16)`.

## State Management
Minimal client state:
- `theme: 'light' | 'dark'` — initialized from localStorage, toggled by nav button.
- `menuOpen: boolean` (mobile only).
- Optional config flags the prototype exposes: `openToWork` (show/hide hero pill, default true), `logoStyle: 'chip' | 'wordmark'`, `accent` (one of 3 colors, default `#1D4ED8`).

Data fetching: **Blog section only** — fetch posts from Sanity (GROQ) at build/request time; featured + 4 recent (3 on mobile). Everything else is static.

## Design Tokens
Font: **Geist** (Google Fonts, weights 400/500/600/700), fallback `system-ui, -apple-system, 'Segoe UI', sans-serif`. `-webkit-font-smoothing: antialiased`.

Light palette:
- `--bg #F7F8FA` · `--bg-card #FFFFFF` · `--bg-soft #F1F3F7` · `--slot-bg #F7F8FA`
- `--ink #16181D` · `--ink-2 #3D4453` · `--ink-3 #5B6270` · `--ink-4 #9AA3B2`
- `--line #E6E8EE` · `--line-2 #DCE0E8`
- `--nav-bg rgba(247,248,250,0.85)` · `--chip-bg #16181D` · `--chip-line transparent`
- `--footer-bg #16181D` · `--footer-line transparent`

Dark palette:
- `--bg #0F1115` · `--bg-card #171A21` · `--bg-soft #242A37` · `--slot-bg #1D222D`
- `--ink #F2F4F8` · `--ink-2 #C4CAD6` · `--ink-3 #98A1B3` · `--ink-4 #7A8397`
- `--line #262B36` · `--line-2 #333A49`
- `--nav-bg rgba(15,17,21,0.82)` · `--chip-bg #16181D` · `--chip-line #333A49`
- `--footer-bg #0B0D11` · `--footer-line #262B36`

Accent: **`#1D4ED8` (default)**; alternatives `#0F766E`, `#1E3A8A`. Dark-mode remaps listed above. Accent rings use `color-mix(in srgb, accent 12%, transparent)`.

Status colors: green dot `#16A34A` (+ `rgba(22,163,74,0.15)` ring); green badge text `#15803D` on `rgba(22,163,74,0.09)`.

Radii: 8 (inputs, small buttons), 9–10 (CTAs), 12 (flagship image, mobile pill), 14 (form card), 16 (project cards), 999 (pills/chips).

Shadows: card `0 8px 24px rgba(22,24,29,0.05)`; card hover `0 10px 28px rgba(22,24,29,0.08)`; button `0 1px 2px rgba(22,24,29,0.08)`.

Motion: `fadeUp` 0.6s `cubic-bezier(0.2,0.7,0.2,1)` staggered; `menuIn` 0.18s ease-out; micro-transitions 0.15–0.18s.

## Assets (included in `assets/`)
- `logo-light.svg` — light wordmark, for dark chip/backgrounds (footer, dark mode).
- `logo-dark.svg` — dark wordmark, for light backgrounds.
- `Emmanuel-Alanis-Resume.pdf` — linked from the "Download Résumé" CTA.
- Project images: not included — the prototype uses drop-in placeholder slots (`slot-lending` 4:3, `slot-readyset` 16:10, `slot-destino` 16:10). Source real screenshots.
- Blog cover images: from Sanity (`coverImage` via `@sanity/image-url`, 16:8.5 desktop featured / 16:9 mobile); the prototype uses a placeholder slot (`slot-blog-featured`).
- Icons: inline SVGs in the reference files (moon/sun, hamburger/close, mail, LinkedIn, GitHub) — lift the paths verbatim or use an equivalent icon set (lucide-style, stroke-width 1.8).

## Files
- `Portfolio v2.dc.html` — desktop/responsive design reference (all exact styles inline).
- `Portfolio Mobile.dc.html` — mobile design reference.
- `assets/` — logos + résumé PDF.
- `CLAUDE_CODE_PROMPT.md` — ready-to-paste kickoff prompt for Claude Code.

Note: ignore the `<x-dc>` wrapper, `support.js` reference, `{{ }}` holes, `sc-if`/`sc-for` tags, `style-hover`/`style-focus` attributes, and the `<script data-dc-script>` block's runtime plumbing — they belong to the prototyping environment. `style-hover`/`style-focus` values are the intended `:hover`/`:focus` styles; the script's `renderVals()` shows the data (skill groups) and handlers (theme toggle, menu, mailto submit) to reimplement.
