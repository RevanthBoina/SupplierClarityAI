# SupplierClarity AI

**Vendor Product Image Upscaler for E-Commerce & Retail.**
SupplierClarity AI takes the low-resolution product photos retailers receive from suppliers and
makes them catalog-ready — upscaled, sharpened and standardized automatically, without asking
vendors for reshoots.

This repository contains the full product site (marketing pages + the live upscaler tool) and the
Real-ESRGAN enhancement backend that powers it.

---

## Live demo flow

1. Open `/enhance` (or press **Try the upscaler** anywhere on the site).
2. Drop a supplier photo (or use one of the built-in degraded samples).
3. Pick an engine, output scale (2×/3×/4×) and format (PNG/JPG).
4. The server runs **Real-ESRGAN** (via ncnn, CPU) with tiled inference and streams progress.
5. Compare the result in the before/after slider and download the catalog-ready file.

Jobs are queued one-at-a-time (the demo runs on a single CPU core), inputs and results are kept
for two hours, then deleted automatically.

## The stack

| Layer | What | Where |
|---|---|---|
| Site | Angular 19 (standalone components, signals), rebranded SupplierClarity design system | `src/` |
| API | Express 4: `POST /api/jobs`, `GET /api/jobs/:id`, `GET /api/models`, `GET /files/:id/:name` | `server/index.mjs` |
| Engine | Real-ESRGAN ncnn models (param/bin), tiled CPU inference, arbitrary `outscale`, alpha/gray handling | `server/enhance.py` |
| Weights | `realesrgan-x4plus`, `realesrgan-x4fast`, `realesr-animevideov3-x4` (ncnn format) | `server/weights/ncnn` |

### Models exposed in the tool

| Model id | Label | Character |
|---|---|---|
| `realesrgan-x4fast` | Catalog Balanced | the everyday workhorse, ~7s per 800×600 |
| `realesr-animevideov3-x4` | Fast Sketch | smallest/fastest, great for flat art & sketches |
| `realesrgan-x4plus` | Photo Max Detail | deepest detail restoration, ~2 min per 800×600 |

## Running it

```bash
npm install
npm run build          # Angular production build -> dist/whiteblue-site
pip3 install ncnn pillow numpy   # engine deps (CPU)
node server/index.mjs  # serves site + API on :8787
```

Environment: `PORT` (default `8787`). Upload limits: 12 MB / ~1.6 MP per image (CPU demo guard).

## Site map

* `/` — hero, stats, industries, platform, products, testimonials, case studies, founder note
* `/enhance` — the live Clarity Upscaler tool
* `/services/image-apis` · `/services/catalog-data` · `/services/workflow-automation` · `/services/agentic-qa`
* `/products/batchforge` · `/products/pim-connect` · `/products/complycheck`
* `/company/purpose-leadership` · `/company/framework` · `/company/social-initiative` · `/company/global-presence`

All page copy lives in `src/app/content/*.ts`; design tokens in `src/styles.scss`.

## Brand

Palette: clarity teal `#0e9aa5` (deep `#0a626b`) with warm amber `#f5a623` accents on paper-white.
Mark: concentric "clarity lens" rings with an amber sparkle (`public/assets/img/sc-mark-*.png`).
Type: Satoshi (display) + Manrope (body), loaded at runtime from Fontshare/Google Fonts.

