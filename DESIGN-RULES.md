# SupplierClarity website: global rules

Every page follows these rules. When the team gives an instruction that could apply site-wide, confirm once
whether it is global; if yes, apply it to every existing page, add it here, and follow it on all new pages.

_Last updated: 2026-11-26_

## Header and footer (global, shared on every page)
- One header (`shared/site-header`) and one footer (`sections/footer`), rendered by the app shell
  (`app.component.ts`). Pages never include their own.
- Home page: see-through glass bar over the teal hero. Every other page: solid teal bar from the top.
- On all pages the bar is pinned 32px from the top and condenses (shorter, narrower, 12px from the top)
  once the page scrolls, with a fade strip behind it. The fade strip is always white.
- A coloured block at the end of a page (e.g. a yellow band before the footer) keeps `wbSectionTheme="#ffffff"`
  and paints its own background, so the colour never spreads into the footer.
- Each page's first section leaves 74px of space at the top for the bar (`<div class="hero__nav-space">`
  pattern, or 32px padding + 74px spacer).
- Menu and footer links that point at home page sections use `/#section`, so they work from any page.
- Drop-down menus: every new page is added as a child of its parent menu item in `NAV_LINKS`
  (`site-content.ts`): service pages under Services, product pages under Products, and so on. Children
  open on hover or keyboard focus on desktop and are listed indented in the mobile menu. The parent
  still links to its home page section. If it is unclear where a page belongs, ask Melwin.
- New service/product pages are also added to the matching footer column.

## One screen per section (from the Infra automation page onwards)
- Every section fits within one viewport height on laptops and desktops (checked at 1280x720, 1366x768,
  1536x730, 1440x900 and 1920x1080). A section that would scroll past one screen is not acceptable.
- Put `host: { class: 'wb-fit' }` on the page component. It switches the shared sizes to screen-height-aware
  versions: `--wb-fit-y` (section padding), `--wb-fit-h2` (H2 size), `--wb-fit-gap` (heading to content).
- Size photos and illustrations from the screen height (e.g. `calc(100svh - 2 * var(--wb-fit-y) - ...)`),
  not only from the width.
- Content that can't fit in one screen (several rows or steps) either pins and steps in place (the three-step
  ring) or scrolls with a sticky side menu (Business impact: Melwin wants the left menu sticky and the rows
  scrolling smoothly, not swapping). On `.wb-fit` pages each impact row is sized to about one screen.
- Follow the mockup's layout. Shrink type and spacing to fit one screen before changing a layout, and ask
  before rearranging a section.
- Pinned layouts and side-by-side layouts hold down to 901px wide. Phones and narrow tablets are exempt where stacked content cannot fit, but keep sections as compact as possible.
- Applies to all service/product pages (Infra automation, Agentic AI, Data modernization, API services and every new page). The home page is excluded by Melwin's choice.

## Typography (tokens in `src/styles.scss`)
| Use | Class / token | Font | Max size |
|---|---|---|---|
| Home hero H1 | `--wb-fs-hero` | Manrope 700 | 102px |
| Page hero H1 (other pages) | `--wb-fs-h2` | Manrope 700 | 78px |
| Section heading H2 | `.wb-h2` | Satoshi 700 | 78px |
| Blue phrase in headings | `.wb-accent` | — | — |
| Section lead / intro | `.wb-lead` | Manrope | 25px |
| Card titles | `--wb-fs-card-title` | Manrope 600–700 | 30px |
| Large card headings | `--wb-fs-h3` | Manrope 700 | 48px |
| Body text | `--wb-fs-body` | Manrope | 20px |
| Bullets / small body | `clamp(0.9375rem, 0.94vw, 1.125rem)` | Manrope | 18px |
| Buttons | `--wb-fs-button` | Satoshi 700 | 22px |
| Eyebrow pill | `wb-pill-label` | Satoshi 700 | 16px, 36px tall |
| Kickers (small caps labels) | 15px, uppercase, 0.08–0.1em tracking | Manrope 600 | 15px |

## Spacing
- Section top/bottom padding: `--wb-section-y` (64–120px).
- Eyebrow → heading → lead: `--wb-space-xs` (16px).
- Section intro → main content: `--wb-space-lg` (40–56px).
- Lead → buttons: `--wb-space-md` (32–40px). Card grid gaps: `--wb-gap-cards` (24px).
- Content width: `.wb-container` (max 1660px with fluid side gutters).
- Sections that must fit one screen use tighter padding: `clamp(40px, 3.4vw, 64px)`.

## Colours
- Brand blue `--wb-blue` #2c58f1; amber outline `--wb-amber`; yellow panels #ffdb57 / page yellow #ffd06a.
- Card palettes used so far: blue #0a84ff, purple #7e5ebf, yellow #fade5d (dark text on yellow),
  teal gradient #508fa1→#4166aa, purple gradient #574ba0→#6b3f8a, green gradient #2e7a62→#35a08f.
- Page background changes per section via `wbSectionTheme` (see `SECTION_THEMES`).

## Components to reuse
- `wb-section-head`: eyebrow pill + H2 (with blue phrase) + lead. `align="center" | "start"`.
- `wb-button`: `variant="primary" | "light" | "outline" | "yellow" | "outline-light"` (the last two for blue panels);
  all CTAs have the running-light outline.
- `wb-cta-panel`: closing call to action with photo and two buttons; `tone="yellow" | "blue"`.
- `wb-impact-rows`: "Business impact" section (3 rows, sticky side menu that highlights the row in view,
  product banner). Content shape `ImpactContent` in `content/content-types.ts`. `[pinned]="true"` on
  one-screen pages: the section pins and scrolls through the rows in place.
- Service page section templates (in `pages/agentic-ai/sections/`, each takes a `[content]` input; shapes in
  `content/content-types.ts`): `wb-agentic-hero` (HeroContent, image + three chips), `wb-agentic-help`
  (HelpContent, tabs; `layout="centered"` = mockup layout, `"split"` = Agentic AI), `wb-agentic-delivery` (DeliveryContent, pinned three-step ring). Reuse these for new
  service pages that follow the same design instead of copying them. Options added for API services: hero
  `titleSegments` (several blue phrases) and two-line chips with `pos`; tabs `eyebrowIcon`, `kicker`, tone `plum`;
  ring takes any number of steps (nodes spaced evenly), step `intro`, tone `rose`, `centered` heading.
- `wb-pill-label tone="light"`: eyebrow pill for blue sections.
- Product page sections (`pages/products/sections/`, content shapes in `content-types.ts`): `wb-product-hero`
  (logo in an orbit with four corner chips, product accent colour, `[animated]` for moving dots + pulsing glow),
  `wb-product-video` (text + video; `videoUrl` empty shows a "coming soon" poster). Capabilities reuse
  `wb-infra-capabilities [content]` (optional eyebrow, heading, lead, feature pills, link inside an item's text);
  industries reuse `wb-agentic-help layout="centered"`; closing band is `wb-cta-band` (shared).
- Product pages live under `/products/...` and go in the Products drop-down. Products with their own website
  (InsureLiv) get a short landing page: hero + yellow band linking to the product site.
- Auto-advancing lists (e.g. Infra automation capabilities): ~3.5s per item, pause while a mouse hovers
  over the content or keyboard focus is inside (a mouse click does not pause it), resume afterwards; never
  pause on touch; only runs while the section is on screen. With reduced motion it still advances, with
  plain fades instead of movement.
- Capability photo decks are the same size on every page (one screen minus a standard eyebrow + heading). A section
  with extra heading content (FieldZapp pills) may run a little past one screen rather than shrink the photos.
- Business impact illustrations use object-fit: contain (never cropped or zoomed).
- Photo deck (Infra capabilities): stacked cards, the front card swings out left and the tilted card behind
  straightens into the front on each change.
- `wb-pill-label`: eyebrow icons live in `public/assets/icons/eyebrow/` (add to the `EyebrowIcon` type).
- `wb-carousel-arrows variant="chevron"`: bare ‹ › arrows (used on all carousels).
- `wbReveal`: scroll-reveal animation directive.
- `wb-company-hero` (company pages): split hero with photo, floating chips and an optional `[slot=extra]` area
  (stats, count-up). Company pages live under `/company/...`, copy in `about-content.ts`, photos in
  `public/assets/img/about/`. Leader portraits are cut onto the brand blue (#3464e6) backdrop.
- Component styles must stay under the 9 kB production budget. When a page grows past it, move a section into
  its own component (e.g. `wb-advisory-board`) rather than raising the budget.

## Copy style
- US spelling. Sentence case everywhere (headings, buttons, chips, tabs).
- No comma before "and" in lists. Commas instead of dashes. Full stops at the end of bullets.
- Abbreviations keep their case (RaaS, OKF, RAG, KPI) even inside uppercase labels.
- Primary CTA: "Book a consultation". Product CTAs: "Request a demo".

## Motion and accessibility
- Every animation respects `prefers-reduced-motion`.
- Hover-only content must also work on keyboard focus and tap.
- Never use `overflow: hidden` on `body` or on a section containing sticky elements (use `overflow: clip`).

## Adding a new page
1. Copy into `src/app/content/<page>-content.ts` (all text and image paths live here, not in templates).
2. Page component in `src/app/pages/<page>/` built from shared components + page-specific sections.
3. Register the route in `src/app/app.routes.ts` (lazy-loaded, with a page title).
4. Add it to the header drop-down and footer column in `site-content.ts` (ask if the parent is unclear), and link it from the home page where relevant.
5. Check at 1440, 1100 and 390px, and that every section fits one screen at the sizes above; production build must pass.
