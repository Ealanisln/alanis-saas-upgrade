# Prompt for Claude Code

Paste this (or adapt it) as your first message to Claude Code from the repo root, with this handoff folder placed inside the repo (e.g. `./design_handoff_portfolio/`):

---

Implement my personal portfolio site from the design handoff in `design_handoff_portfolio/`.

**Read `design_handoff_portfolio/README.md` first** — it is the full spec: every section, exact colors, typography, spacing, interactions, and design tokens. The two `.dc.html` files are high-fidelity HTML design references (all styles inline); recreate them, do not ship them.

Requirements:
1. **Stack**: Next.js 15 (App Router) + React 19 + TypeScript (strict) + Tailwind CSS. Single responsive page — use `Portfolio v2.dc.html` for ≥768px and `Portfolio Mobile.dc.html` as the spec for small viewports.
2. **Design tokens**: implement the light/dark palettes from the README as CSS variables (or Tailwind theme values), with the dark-mode accent remaps. Font: Geist 400/500/600/700.
3. **Theme toggle**: light/dark, persisted in `localStorage` (`alanis-portfolio-theme`), no flash on load (inline script or cookie strategy), `color-scheme` set accordingly.
4. **Blog section**: wire to Sanity via GROQ — featured post + 4 recent (3 on mobile), linking to `/blog` and post pages. Stub the Sanity client config if credentials aren't set; keep the sample copy from the references as fallback/placeholder data.
5. **Contact form**: no backend — build the `mailto:` URL exactly as described in the README.
6. **Assets**: use `design_handoff_portfolio/assets/` (logos + résumé PDF). Project/blog images are placeholders — use neutral placeholder blocks with the exact aspect ratios until real screenshots are provided.
7. Match the references pixel-perfectly: hover states, hero stagger animation, mobile menu animation, smooth anchor scrolling with scroll-padding, focus rings.
8. Accessibility: semantic landmarks, alt text, visible focus states, ≥44px touch targets on mobile.

When done, run the dev server and verify light + dark mode at 1440px and 390px against the reference files.

---

## Notes

- The `.dc.html` references open best in a text editor; the `<x-dc>` wrapper, `{{ }}` holes, `sc-if`/`sc-for`, and `style-hover`/`style-focus` attributes belong to the prototyping environment (see the note at the end of README.md). `style-hover`/`style-focus` values are the intended `:hover`/`:focus` styles.
- All copy in the references is final — use it verbatim.
