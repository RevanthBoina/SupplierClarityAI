# SupplierClarity AI

**Vendor Product Image Upscaler for E-Commerce & Retail.**
SupplierClarity AI takes the low-resolution product photos retailers receive from suppliers and
makes them catalog-ready — upscaled, sharpened and standardized automatically, without asking
vendors for reshoots.

This repository contains the full product site (marketing pages + the live upscaler tool) and the
CPU enhancement backend that powers it.

---

## The live demo flow

1. Open `/enhance` (or press **Try the upscaler** anywhere on the site).
2. Drop a supplier photo (or use a built-in sample). Enhancement starts immediately.
3. Pick an engine, output scale (2×/3×/4×) and format (PNG/JPG) — change any setting and run again.
4. The server queues the job, runs the enhancement models on CPU with tiled inference and streams
   real progress (stage + tile counts) back to the page.
5. Compare original vs result in the before/after slider and download the catalog-ready file.

Jobs are queued one at a time (the demo runs on a single CPU core), inputs and results are kept for
two hours, then deleted automatically.

## The stack

| Layer | What | Where |
|---|---|---|
| Site | Angular 19 (standalone components, signals), SupplierClarity design system | `src/` |
| API | Express 4: `POST /api/jobs`, `GET /api/jobs/:id`, `GET /api/models`, `GET /files/:id/:name` | `server/index.mjs` |
| Engine | CPU super-resolution models (ncnn param/bin), tiled inference, arbitrary scale, alpha/EXIF handling | `server/enhance.py` |
| Weights | `balanced-x4`, `sketch-x4`, `max-detail-x4` (ncnn format) | `server/weights/ncnn` |

### Engines exposed in the tool

| Engine id | Label | Character | Typical |
|---|---|---|---|
| `balanced` | Catalog Balanced | the everyday workhorse | ~15 s per MP |
| `sketch` | Fast Sketch | smallest/fastest, great for flat art & sketches | ~8 s per MP |
| `max-detail` | Photo Max Detail | deepest detail restoration | ~5 min per MP |

Engine ids are the public API surface. Weight filenames are internal and never exposed to clients.

## Quick start

```bash
npm install
npm run setup:engine    # creates .venv and installs the worker (ncnn, numpy, pillow)
npm run build           # Angular production build -> dist/whiteblue-site
npm run serve           # serves the site + API on http://localhost:8787
```

`setup:engine` needs Python 3.9+ (on Debian/Ubuntu also `sudo apt install python3-venv`). If the
host already has the packages it detects them and does nothing.

Then open <http://localhost:8787/enhance>, drop an image and it processes end to end.

`GET /api/health` reports whether the worker was detected:

```json
{ "ok": true, "engine": { "available": true, "mode": "engine", "models": { "balanced": { "available": true } } } }
```

### Working on the site (hot reload)

```bash
node server/index.mjs     # API on :8787
npm start                 # ng serve on :4200, proxies /api and /files to :8787
```

The dev proxy forwards both `/api/*` and `/files/*`, so results and downloads load correctly in
development too.

### Running the worker by hand

```bash
.venv/bin/python server/enhance.py \
  --model balanced --input photo.jpg --output result.png --preview preview.jpg \
  --outscale 4 --format png --tile 0 --threads 2
```

The worker writes one JSON event per line to stdout (`start`, `load`, `tiles`, `resize`, `save`,
`done`, or `error` with a stable code); human-readable timings go to stderr. `--tile 0` selects a
memory-safe tile size for the chosen model.

## Two ways the tool can run

| Mode | When | What the visitor sees |
|---|---|---|
| **AI engine** | A Python worker and the model files are available (`server/index.mjs`) | Queued jobs, tile-by-tile progress, AI-enhanced output |
| **Browser preview** | No worker on the host (e.g. a static/Vercel deployment, or the engine is not installed) | The same upload flow, upscaled in the browser, clearly labelled *Browser preview* |

The browser fallback exists so an upload never dead-ends: the page always returns a real,
downloadable upscaled file. The AI engine adds detail the resampler cannot.

To deploy the full experience, host `server/index.mjs` (or the worker) on a machine with Python —
serverless platforms cannot run the CPU models.

## API

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | Service, engine, queue and limit status |
| `GET` | `/api/models` | Engines with per-engine availability |
| `POST` | `/api/jobs` | `multipart/form-data`: `image`, `model`, `outscale`, `format` |
| `GET` | `/api/jobs/:id` | Status, `progress`, `tiles`, `queuePosition`, `files`, `error` |
| `DELETE` | `/api/jobs/:id` | Cancel a queued or running job |
| `GET` | `/files/:id/:name` | `input.*`, `preview.jpg`, `result.png` / `result.jpg` |

Errors are JSON with a stable `code` (`unsupported_image`, `image_too_large`, `unknown_model`,
`engine_unavailable`, `queue_full`, `rate_limited`, `timeout`, …) and a human-readable `error`.
Uploads are validated by magic bytes, not by the browser's MIME type or filename.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `PORT` | `8787` | HTTP port |
| `ENHANCE_PYTHON` | auto | Explicit interpreter (`python3`, `.venv/bin/python`, …) |
| `ENHANCE_THREADS` | auto | Worker threads (defaults to cores − 1) |
| `MAX_UPLOAD_BYTES` | `12582912` | 12 MB upload cap |
| `MAX_INPUT_PIXELS` | `1600000` | Input pixel cap (CPU demo guard) |
| `MAX_QUEUE` | `24` | Maximum waiting jobs |
| `JOB_TTL_MS` | `7200000` | How long inputs/results are kept (2 h) |
| `RATE_LIMIT_PER_MIN` | `15` | Uploads per IP per minute |
| `DATA_DIR` | `server/data` | Job storage root (useful in tests) |

## Verification

```bash
npm test             # component tests: upload → progress → result, errors, cancel (Jest + jsdom)
npm run test:api     # API contract tests: validation, job lifecycle, cancel, file serving
npm run verify       # engine deps, model files, a forward pass per engine and a real end-to-end job
```

`npm test` needs no browser (jsdom), `npm run test:api` boots the real server on a random port with a
temporary data directory and adapts when no worker is installed, and `npm run verify` prints exactly
what is missing — and how to fix it — when the engine is not ready.

## Troubleshooting: an upload does not process

1. `curl localhost:8787/api/health` — `engine.available` must be `true` for AI output.
2. If it is `false`, run `npm run setup:engine` and restart `npm run serve`. The response `hint`
   names the missing package or model files.
3. If the page says **Browser preview mode**, the app is running without the API (for example a
   static deploy) — that is the fallback, not an error.
4. Check the image limits: 12 MB and ~1.6 MP. The API rejects bigger files with a clear message
   and the page validates before uploading.
5. Look at the server log; worker failures include the last stderr lines and an error code.

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

Or without keys: `npm start` (ng serve proxies `/api` and `/files` to `localhost:8787`) and the
built-in knowledge base answers.
