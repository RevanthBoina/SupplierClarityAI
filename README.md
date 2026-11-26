# WhiteBlue website (Angular 19)

Homepage built from the Figma file **wb_website_redesign**, frame `WB_homepage` (node 805:60594).

## Run it

```bash
npm install
npm start          # http://localhost:4200
npm run build      # production build in dist/whiteblue-site
```

Production builds download and inline the web fonts, so they need internet access.

## Where things live

| Path | What it holds |
| --- | --- |
| `src/styles.scss` | Design tokens from Figma (colours, type scale, spacing) and shared motion keyframes |
| `src/app/content/site-content.ts` | All page copy and links. Edit text here, not in templates |
| `src/app/sections/*` | One standalone component per Figma section, in page order |
| `src/app/shared/` | Button, section pill, carousel arrows, `wbReveal` (scroll reveal) and `wbCountUp` directives |
| `public/assets/` | Images, icons and illustrations |

## Scroll-driven page colour

The page background changes colour as you scroll, like hoverthink.com/our-work. Each section has a colour in `SECTION_THEMES` (`src/app/content/site-content.ts`). When a section crosses the middle of the screen, the whole page fades to that colour over 0.9s, because every section's own background is transparent. The logic lives in `shared/page-theme.service.ts` and `shared/section-theme.directive.ts`. To restyle the effect, change the colours in `SECTION_THEMES`.

## Pitch animation

The "Every pitch" section uses `public/assets/illustrations/pitch.webm` (with `pitch.mp4` as a fallback), converted from `pitch-illustration-loop.gif`. It plays once when the section scrolls into view and then rests on the final frame, with no loop. `pitch-start.webp` and `pitch-end.webp` are the first and last frames, used as placeholders and for visitors with reduced motion turned on.

## Pitch field markings

The "Every pitch" section draws cricket-field markings over the space around the video: boundary rings, the inner fielding circle (dashed), the two creases and fielding lines. They use the same perspective as the pitch (see the `matrix(...)` transform in `every-pitch.component.html`), are kept off the pitch strip and its labels by a soft mask, fade out before the copy, and draw in as the video starts. They're hidden on phones.

## Eyebrows

Every section starts with an icon pill (`wb-pill-label`). Icons live in `public/assets/icons/eyebrow/` and are chosen with the `icon` input, for example `<wb-pill-label icon="services">Services</wb-pill-label>`.

## Spacing

All gaps come from one scale in `src/styles.scss`: `--wb-section-y` for section padding, plus `--wb-space-xs` / `sm` / `md` / `lg` and `--wb-gap-cards`. Change a value there and it updates the whole site.

## Animation

- **Hero:** load sequence (nav drops in, then badge, headline, copy, buttons and logos rise in turn), slow-drifting grid, light sweep across "AI" and "underneath".
- **Scrolling:** every section reveals as it enters the viewport, using `wbReveal` with variants `up`, `down`, `left`, `right`, `zoom`, `fade` and a `[wbRevealDelay]` stagger.
- **Stats:** the numbers count up when they come into view.
- **Hover:** cards lift, icons spin slightly, arrows nudge, images push in, and buttons get a sheen.
- **Interactions:** product cards expand smoothly; testimonials and case studies slide in from the direction you navigate.
- **Footer:** the globe's land drifts and office pins pulse.
- **Accessibility:** everything is switched off for visitors who have "reduce motion" turned on.

## Images

All supplied images are in place:

| Where | Files (`public/assets/img/`) |
| --- | --- |
| Trusted by | `client-adani.png`, `client-kla.png`, `client-naf.png`, `client-joyride.png` |
| Product cards (expanded) | `product-insureliv.webp`, `product-dobby.webp`, `product-quickqode.webp`, `product-fieldzapp.webp` |
| Product logos | `insureliv-mark.svg` (cut from the wordmark), `logo-dobby.png`, `logo-quickqode.png`, `logo-fieldzapp.png` |
| Founder note | `founder-jai.png` |
| Footer | `globe.png` (floats, light sweep, pin ripples; pin positions in `OFFICE_PINS`) |

Product photos are WebP to keep the page light. Their rounded transparent corners were filled so they sit flush in the cards.

## Still to confirm

- **"Stay With Me" font:** licensed, so add its `@font-face` in `styles.scss`. Gochi Hand is the fallback until then.
- **Case-study photos:** the cards use gradient backgrounds until the photos are supplied.
- **Copy:** the first case-study title is cut off in Figma, and there's only one testimonial although the carousel is built for more.

## Vercel preview deployment

The review deployment is connected to the `review/india-website` branch in the `whiteblue-india-review` Vercel project. Commits pushed to this branch trigger a deployment for team review.
