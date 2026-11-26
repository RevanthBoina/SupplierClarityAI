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


## Clarity Assistant (bottom-right chatbot)

A floating assistant sits in the bottom-right corner on every page. It appears when the visitor
scrolls up (and stays visible at the top of the page), slides away when they scroll down, and the
conversation is never reset — it persists across scroll hide/show, route changes and reloads
(localStorage), and remains interactive while open.

**How it works**

* Frontend: `src/app/shared/ai-chatbot.component.*` (+ `ai-chatbot.service.ts`) mounted once in the app
  shell. Answers are typed out progressively; responses render as safe markdown-lite (bold, lists,
  links to site pages).
* Backend: `POST /api/chat` — one implementation shared by the Express server (`server/index.mjs`) and
  the Vercel serverless function (`api/chat.mjs`). **Keys are read server-side only and never reach the browser.**
* Providers: Groq is tried first, then Google Gemini, then a built-in knowledge base — so the chat
  always answers, even with no key configured (useful for local dev and demos).

**Set the API keys (Vercel)**

1. Vercel dashboard → your project → **Settings → Environment Variables**
2. Add `GROQ_API_KEY` (from https://console.groq.com) and/or `GEMINI_API_KEY`
   (from https://aistudio.google.com/app/apikey)
3. Optionally set `GROQ_MODEL` (default `openai/gpt-oss-120b`),
   `GEMINI_MODEL` (default `gemini-2.5-flash`) or `CHAT_PROVIDER` (`groq` | `gemini` | `auto`, default `auto`)
4. Redeploy. `GET /api/chat` returns the public provider status (never the keys).

`vercel.json` excludes `/api/*` from the SPA rewrite so the function works; everything else still
serves `index.html`.

**Local development**

```bash
cp .env.example .env   # fill in keys — never commit .env (already git-ignored)
node --env-file=.env server/index.mjs
```

Or without keys: `npm start` (ng serve proxies `/api` to `localhost:8787`) and the built-in
knowledge base answers.
