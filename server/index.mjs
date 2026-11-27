/**
 * SupplierClarity AI — API + static host.
 *
 * Serves the built Angular app from dist/ and exposes the vendor-image
 * enhancement pipeline:
 *
 *   GET    /api/health          service + engine status (never any secrets)
 *   GET    /api/models          enhancement models and their availability
 *   POST   /api/jobs            multipart: image, model, outscale, format
 *   GET    /api/jobs/:id        job status, progress and result metadata
 *   DELETE /api/jobs/:id        cancel a queued or running job
 *   GET    /files/:id/:name     input / result / preview files
 *
 * Jobs run one at a time (the demo is CPU-bound), results are kept for two
 * hours and every job directory is removed afterwards.
 */
import express from "express";
import multer from "multer";
import { spawn } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { handleChat, getChatConfig } from "./chat-core.mjs";
import { DEFAULT_MODEL, MODELS, MODEL_IDS, SERVER_DIR, detectEngine, estimateMs, engineUnavailableMessage } from "./engine.mjs";
import { readImageMeta } from "./image-meta.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "whiteblue-site", "browser");
const DATA = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, "data");
const JOBS_DIR = path.join(DATA, "jobs");

function envInt(name, fallback) {
  const raw = Number(process.env[name]);
  return Number.isFinite(raw) && raw > 0 ? Math.round(raw) : fallback;
}

const PORT = envInt("PORT", 8787);
const MAX_UPLOAD = envInt("MAX_UPLOAD_BYTES", 12 * 1024 * 1024);
const MAX_PIXELS = envInt("MAX_INPUT_PIXELS", 1_600_000);
const MAX_QUEUE = envInt("MAX_QUEUE", 24);
const JOB_TTL_MS = envInt("JOB_TTL_MS", 2 * 60 * 60 * 1000);
const THREADS = envInt("ENHANCE_THREADS", 0);
const RATE_LIMIT = envInt("RATE_LIMIT_PER_MIN", 15);
const SCALES = [1, 2, 3, 4];
const FORMATS = ["png", "jpg"];

const jobs = new Map(); // id -> job record
let active = 0;
const queue = [];
const rateBuckets = new Map();

/* ---------------------------------- storage --------------------------------- */

async function ensureDirs() {
  await fs.mkdir(JOBS_DIR, { recursive: true });
}

function jobDir(id) {
  return path.join(JOBS_DIR, id);
}

function isJobId(id) {
  return typeof id === "string" && /^[a-f0-9-]{10,40}$/.test(id);
}

function metaOf(job) {
  const { id, status, stage, progress, model, outscale, format, createdAt, startedAt, finishedAt, error, errorCode, input, output, tiles } = job;
  return { id, status, stage, progress, model, outscale, format, createdAt, startedAt, finishedAt, error, errorCode, input, output, tiles };
}

async function writeMeta(job) {
  try {
    await fs.writeFile(path.join(jobDir(job.id), "meta.json"), JSON.stringify(metaOf(job), null, 2));
  } catch {
    /* meta is a convenience; a deleted job directory must not break the job */
  }
}

async function removeJobDir(id) {
  await fs.rm(jobDir(id), { recursive: true, force: true }).catch(() => {});
}

async function gcJob(id) {
  jobs.delete(id);
  await removeJobDir(id);
}

async function recoverStale() {
  let entries = [];
  try {
    entries = await fs.readdir(JOBS_DIR);
  } catch {
    return;
  }
  const now = Date.now();
  for (const id of entries) {
    if (!isJobId(id)) {
      await removeJobDir(id);
      continue;
    }
    let meta;
    try {
      meta = JSON.parse(await fs.readFile(path.join(JOBS_DIR, id, "meta.json"), "utf8"));
    } catch {
      await removeJobDir(id);
      continue;
    }
    if (meta.status === "processing" || meta.status === "queued") {
      meta.status = "error";
      meta.stage = "error";
      meta.error = "The server restarted before this job finished. Please run it again.";
      meta.errorCode = "interrupted";
      meta.progress = 0;
      await fs.writeFile(path.join(JOBS_DIR, id, "meta.json"), JSON.stringify(meta, null, 2)).catch(() => {});
    }
    jobs.set(id, { ...meta, child: null });
    if (now - new Date(meta.createdAt || 0).getTime() > JOB_TTL_MS) await gcJob(id);
  }
}

async function gcSweep() {
  const now = Date.now();
  for (const [id, job] of jobs) {
    if (job.status === "processing" || job.status === "queued") continue;
    if (now - new Date(job.createdAt).getTime() > JOB_TTL_MS) await gcJob(id);
  }
}

/* -------------------------------- job shaping -------------------------------- */

function progressFor(job) {
  if (job.status === "queued") return 2;
  if (job.status === "done") return 100;
  if (job.status === "error" || job.status === "canceled") return job.progress || 0;
  switch (job.stage) {
    case "starting":
      return 5;
    case "load":
      return 10;
    case "enhancing": {
      const total = job.tiles?.total || 0;
      const done = job.tiles?.done || 0;
      return total ? Math.min(90, 12 + Math.round(78 * (done / total))) : 15;
    }
    case "resize":
      return 93;
    case "save":
      return 97;
    default:
      return job.progress || 0;
  }
}

function queuePosition(job) {
  if (job.status !== "queued") return 0;
  const index = queue.findIndex((queued) => queued.id === job.id);
  return index < 0 ? 0 : index + 1;
}

function publicJob(job) {
  const done = job.status === "done" && job.output;
  const files = done
    ? {
        result: `/files/${job.id}/${job.output.file}`,
        preview: `/files/${job.id}/${job.previewExists ? "preview.jpg" : job.output.file}`,
        original: `/files/${job.id}/input${job.input.ext}`,
      }
    : null;
  return {
    id: job.id,
    status: job.status,
    stage: job.stage,
    progress: progressFor(job),
    tiles: job.tiles,
    queuePosition: queuePosition(job),
    queueLength: queue.length + (active > 0 ? 1 : 0),
    model: job.model,
    outscale: job.outscale,
    format: job.format,
    error: job.error || null,
    errorCode: job.errorCode || null,
    input: job.input,
    output: job.output,
    files,
    createdAt: job.createdAt,
    startedAt: job.startedAt,
    finishedAt: job.finishedAt,
    elapsedMs: job.startedAt ? (job.finishedAt ? new Date(job.finishedAt) : new Date()) - new Date(job.startedAt) : null,
  };
}

/* --------------------------------- pipeline --------------------------------- */

function workerArgs(job, inputPath, outputPath, previewPath) {
  const model = MODELS[job.model] || MODELS[DEFAULT_MODEL];
  const args = [
    path.join(SERVER_DIR, "enhance.py"),
    "--model", model.id,
    "--input", inputPath,
    "--output", outputPath,
    "--preview", previewPath,
    "--outscale", String(job.outscale),
    "--format", job.format,
    "--quality", "92",
    "--tile", "0",
  ];
  if (THREADS) args.push("--threads", String(THREADS));
  return args;
}

function runJob(job) {
  const engine = detectEngine();
  if (!engine.available || !engine.interpreter) {
    settle(job, "error", {
      errorCode: "engine_unavailable",
      error: engineUnavailableMessage(engine),
    });
    return;
  }

  const model = MODELS[job.model] || MODELS[DEFAULT_MODEL];
  const outName = job.format === "jpg" ? "result.jpg" : "result.png";
  const outPath = path.join(jobDir(job.id), outName);
  const inputPath = path.join(jobDir(job.id), `input${job.input.ext}`);
  const previewPath = path.join(jobDir(job.id), "preview.jpg");

  job.active = true;
  job.status = "processing";
  job.stage = "starting";
  job.startedAt = new Date().toISOString();
  job.error = null;
  job.errorCode = null;
  job.progress = 5;
  writeMeta(job);

  let proc;
  try {
    proc = spawn(engine.interpreter, workerArgs(job, inputPath, outPath, previewPath), {
      cwd: SERVER_DIR,
      env: {
        ...process.env,
        PYTHONUNBUFFERED: "1",
        PYTHONIOENCODING: "utf-8",
        OMP_NUM_THREADS: String(THREADS || 2),
      },
      stdio: ["ignore", "pipe", "pipe"],
    });
  } catch (err) {
    settle(job, "error", { errorCode: "worker_start_failed", error: `The enhancement worker could not start (${err.message}).` });
    return;
  }

  job.child = proc;
  let settled = false;
  let stdoutBuffer = "";
  let stderrTail = "";
  let doneEvent = null;

  const timer = setTimeout(() => {
    if (settled) return;
    job.errorCode = "timeout";
    job.error = `The enhancement worker took longer than ${Math.round(model.timeoutMs / 60000)} minutes and was stopped. Try a smaller image or a faster engine.`;
    try {
      proc.kill("SIGKILL");
    } catch {
      /* already gone */
    }
  }, model.timeoutMs);

  proc.stdout.on("data", (chunk) => {
    stdoutBuffer += chunk.toString();
    let newline;
    while ((newline = stdoutBuffer.indexOf("\n")) >= 0) {
      const line = stdoutBuffer.slice(0, newline).trim();
      stdoutBuffer = stdoutBuffer.slice(newline + 1);
      if (!line) continue;
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        continue;
      }
      if (event.stage === "tiles") {
        job.stage = "enhancing";
        job.tiles = { done: event.done, total: event.total };
      } else if (event.stage === "start") {
        job.stage = "load";
      } else if (event.stage === "load") {
        job.stage = "load";
      } else if (event.stage === "resize") {
        job.stage = "resize";
      } else if (event.stage === "save") {
        job.stage = "save";
      } else if (event.stage === "done") {
        doneEvent = event;
        job.stage = "save";
      } else if (event.stage === "error") {
        job.errorCode = event.code || "worker_error";
        job.error = event.message || "The enhancement worker failed.";
      }
      job.progress = progressFor(job);
    }
  });

  proc.stderr.on("data", (chunk) => {
    stderrTail = (stderrTail + chunk.toString()).slice(-4000);
  });

  proc.on("error", (err) => {
    settle(job, "error", {
      errorCode: "worker_start_failed",
      error: `The enhancement worker could not start (${err.message}).`,
    });
  });

  proc.on("close", async (code, signal) => {
    if (settled) return;
    clearTimeout(timer);
    job.child = null;

    if (job.canceled) {
      settle(job, "canceled", { error: "Canceled.", errorCode: "canceled" });
      await removeJobDir(job.id);
      return;
    }

    if (code === 0 && fsSync.existsSync(outPath)) {
      let stat = null;
      try {
        stat = await fs.stat(outPath);
      } catch {
        /* ignore */
      }
      const width = doneEvent?.width || Math.round(job.input.width * job.outscale);
      const height = doneEvent?.height || Math.round(job.input.height * job.outscale);
      const previewExists = fsSync.existsSync(previewPath);
      settle(job, "done", {
        output: {
          file: outName,
          bytes: stat?.size ?? doneEvent?.bytes ?? null,
          width,
          height,
          ms: doneEvent?.ms ?? (job.startedAt ? Date.now() - new Date(job.startedAt) : null),
          tiles: job.tiles?.total || doneEvent?.tiles || 0,
        },
        previewExists,
        progress: 100,
      });
      return;
    }

    if (job.errorCode === "timeout") {
      settle(job, "error", { error: job.error });
      return;
    }

    const tail = stderrTail.split("\n").filter(Boolean).slice(-3).join(" ").slice(0, 300);
    const reason = job.error || tail || `exit code ${code}${signal ? ` (${signal})` : ""}`;
    settle(job, "error", {
      errorCode: job.errorCode || "worker_failed",
      error: `Enhancement failed: ${reason}`,
    });
  });
}

/** Single place that ends a job, so `active` can never drift. */
function settle(job, status, patch) {
  if (job.settled) return;
  job.settled = true;
  if (job.child) {
    try {
      job.child.kill("SIGKILL");
    } catch {
      /* ignore */
    }
    job.child = null;
  }
  job.status = status;
  job.stage = status;
  job.finishedAt = new Date().toISOString();
  Object.assign(job, patch);
  job.progress = status === "done" ? 100 : job.progress || 0;
  if (job.active) {
    job.active = false;
    active = Math.max(0, active - 1);
  }
  writeMeta(job);
  pump();
}

function pump() {
  while (active < 1 && queue.length) {
    const job = queue.shift();
    if (job.settled || job.canceled) continue;
    active += 1;
    runJob(job);
  }
}

/* ----------------------------------- api ------------------------------------ */

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_UPLOAD, files: 1, fields: 12 },
});

const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  next();
});
app.use(express.json({ limit: "256kb" }));

function rateLimited(ip) {
  const now = Date.now();
  const windowStart = now - 60_000;
  const hits = (rateBuckets.get(ip) || []).filter((t) => t > windowStart);
  hits.push(now);
  rateBuckets.set(ip, hits);
  if (rateBuckets.size > 5000) rateBuckets.clear();
  return hits.length > RATE_LIMIT;
}

function enginePayload(engine) {
  return {
    available: engine.available,
    mode: engine.mode,
    detail: engine.detail,
    hint: engine.hint,
    python: engine.python,
    packages: engine.packages,
    models: engine.models,
  };
}

function modelList() {
  const engine = detectEngine();
  return MODEL_IDS.map((id) => {
    const model = MODELS[id];
    return {
      id,
      label: model.label,
      about: model.about,
      scale: model.scale,
      avgMsPerMp: model.avgMsPerMp,
      available: engine.available && engine.models[id]?.available !== false,
    };
  });
}

app.get("/api/health", (req, res) => {
  const engine = detectEngine({ force: req.query.refresh === "1" });
  res.json({
    ok: true,
    service: "SupplierClarity AI",
    uptimeSec: Math.round(process.uptime()),
    engine: enginePayload(engine),
    queue: { queued: queue.length, active, capacity: MAX_QUEUE },
    limits: {
      maxUploadBytes: MAX_UPLOAD,
      maxInputPixels: MAX_PIXELS,
      scales: SCALES,
      formats: FORMATS,
    },
    models: modelList(),
    chat: getChatConfig(),
  });
});

/* Clarity Assistant: configured provider when keys are set, knowledge base otherwise.
   Keys come from the environment (see .env.example) and never reach the browser. */
app.get("/api/chat", (_req, res) => {
  res.json({ ok: true, chat: getChatConfig() });
});

app.post("/api/chat", async (req, res) => {
  try {
    res.json(await handleChat(req.body || {}));
  } catch (err) {
    console.error("[chat] error:", err.message);
    res.status(500).json({ error: "Chat request failed" });
  }
});

app.get("/api/models", (_req, res) => {
  res.json(modelList());
});

app.post("/api/jobs", (req, res) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({
      error: "Too many enhancement requests. Wait a minute and try again.",
      code: "rate_limited",
    });
  }

  upload.single("image")(req, res, async (err) => {
    if (err) {
      const tooBig = err.code === "LIMIT_FILE_SIZE";
      return res.status(413).json({
        error: tooBig
          ? `That file is larger than ${Math.round(MAX_UPLOAD / (1024 * 1024))} MB. Compress it or pick a smaller photo.`
          : err.message || "Upload failed.",
        code: tooBig ? "file_too_large" : "upload_failed",
      });
    }

    try {
      const file = req.file;
      if (!file?.buffer?.length) {
        return res.status(400).json({ error: "No image was received.", code: "no_image" });
      }

      const meta = readImageMeta(file.buffer);
      if (!meta) {
        return res.status(415).json({
          error: "That file is not a supported image. Use JPG, PNG, WebP, GIF or BMP.",
          code: "unsupported_image",
        });
      }

      if (meta.width * meta.height > MAX_PIXELS) {
        return res.status(400).json({
          error: `That image is ${meta.width}×${meta.height}px. The CPU engine accepts up to ${(MAX_PIXELS / 1e6).toFixed(1)} MP — resize it first (about 1264×1264).`,
          code: "image_too_large",
        });
      }
      if (meta.width < 16 || meta.height < 16) {
        return res.status(400).json({
          error: "That image is too small to enhance. Use an image at least 16×16px.",
          code: "image_too_small",
        });
      }

      const requestedModel = String(req.body?.model || "").trim();
      const modelId = MODELS[requestedModel] ? requestedModel : DEFAULT_MODEL;
      if (requestedModel && !MODELS[requestedModel]) {
        return res.status(400).json({
          error: `Unknown engine "${requestedModel}". Available engines: ${MODEL_IDS.join(", ")}.`,
          code: "unknown_model",
        });
      }

      const requestedScale = Number(req.body?.outscale);
      const outscale = SCALES.includes(requestedScale) ? requestedScale : 4;
      const format = FORMATS.includes(String(req.body?.format)) ? String(req.body.format) : "png";

      const engine = detectEngine();
      if (!engine.available || engine.models[modelId]?.available === false) {
        const missingModel = engine.available && engine.models[modelId]?.available === false;
        return res.status(503).json({
          error: missingModel
            ? `The ${MODELS[modelId].label} engine is not installed on this host.`
            : engineUnavailableMessage(engine),
          code: "engine_unavailable",
          hint: engine.hint,
          engine: enginePayload(engine),
        });
      }

      if (queue.length >= MAX_QUEUE) {
        return res.status(429).json({
          error: `The queue is full (${MAX_QUEUE} images waiting). Try again in a minute.`,
          code: "queue_full",
        });
      }

      const id = crypto.randomUUID();
      const dir = jobDir(id);
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, `input${meta.ext}`), file.buffer);

      const job = {
        id,
        status: "queued",
        stage: "queued",
        progress: 2,
        model: modelId,
        outscale,
        format,
        createdAt: new Date().toISOString(),
        startedAt: null,
        finishedAt: null,
        error: null,
        errorCode: null,
        input: {
          name: String(file.originalname || `upload${meta.ext}`).slice(0, 180),
          bytes: file.size,
          ext: meta.ext,
          mime: meta.mime,
          width: meta.width,
          height: meta.height,
        },
        output: null,
        tiles: null,
        child: null,
        settled: false,
        canceled: false,
      };

      jobs.set(id, job);
      await writeMeta(job);
      queue.push(job);
      pump();

      res.status(201).json({
        id,
        status: job.status,
        queuePosition: queuePosition(job),
        estimatedMs: estimateMs(modelId, meta.width * meta.height),
      });
    } catch (err) {
      console.error("[jobs] error:", err);
      res.status(500).json({ error: "The upload could not be processed.", code: "server_error" });
    }
  });
});

app.get("/api/jobs/:id", (req, res) => {
  if (!isJobId(req.params.id)) return res.status(400).json({ error: "Invalid job id", code: "bad_id" });
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "That job no longer exists.", code: "not_found" });
  res.json(publicJob(job));
});

app.delete("/api/jobs/:id", async (req, res) => {
  if (!isJobId(req.params.id)) return res.status(400).json({ error: "Invalid job id", code: "bad_id" });
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "That job no longer exists.", code: "not_found" });

  if (job.status === "queued") {
    const index = queue.findIndex((queued) => queued.id === job.id);
    if (index >= 0) queue.splice(index, 1);
    job.canceled = true;
    settle(job, "canceled", { error: "Canceled.", errorCode: "canceled" });
    await removeJobDir(job.id);
    return res.json({ id: job.id, status: "canceled" });
  }

  if (job.status === "processing") {
    job.canceled = true;
    try {
      job.child?.kill("SIGKILL");
    } catch {
      /* ignore */
    }
    return res.json({ id: job.id, status: "canceling" });
  }

  res.json({ id: job.id, status: job.status });
});

app.get("/files/:id/:name", (req, res) => {
  const { id, name } = req.params;
  if (!isJobId(id)) return res.status(400).end();
  const allowed =
    name === "result.png" ||
    name === "result.jpg" ||
    name === "preview.jpg" ||
    /^input\.(png|jpe?g|webp|gif|bmp)$/.test(name);
  if (!allowed) return res.status(404).end();

  const filePath = path.join(JOBS_DIR, id, name);
  if (!filePath.startsWith(JOBS_DIR) || !fsSync.existsSync(filePath)) return res.status(404).end();

  const types = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
  };
  res.setHeader("Content-Type", types[path.extname(name).toLowerCase()] || "application/octet-stream");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.sendFile(filePath, (err) => {
    if (err && !res.headersSent) res.status(404).end();
  });
});

/* --------------------------------- static ----------------------------------- */

app.use(
  express.static(DIST, {
    index: false,
    maxAge: "1h",
    setHeaders: (res, filePath) => {
      if (filePath.endsWith("index.html")) res.setHeader("Cache-Control", "no-cache");
    },
  }),
);

app.get(/^\/(?!api\/|files\/).*/, (_req, res) => {
  const index = path.join(DIST, "index.html");
  if (!fsSync.existsSync(index)) {
    return res
      .status(503)
      .type("text/plain")
      .send("The site has not been built yet. Run `npm run build`, then start the server again.");
  }
  res.sendFile(index);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found", code: "not_found" });
});

app.use((err, _req, res, _next) => {
  console.error("[server] error:", err);
  if (res.headersSent) return;
  res.status(err.status || 500).json({ error: "Something went wrong.", code: "server_error" });
});

/* ---------------------------------- boot ------------------------------------ */

await ensureDirs();
await recoverStale();
setInterval(() => gcSweep().catch(() => {}), 30 * 60 * 1000).unref();

const server = app.listen(PORT, "0.0.0.0", () => {
  const engine = detectEngine({ force: true });
  console.log(`SupplierClarity AI on http://0.0.0.0:${PORT}`);
  console.log(
    engine.available
      ? `Enhancement engine: ready (${engine.interpreter}, Python ${engine.python}, ${Object.values(engine.models).filter((m) => m.available).length} models)`
      : `Enhancement engine: unavailable — ${engine.hint}`,
  );
  if (!fsSync.existsSync(path.join(DIST, "index.html"))) {
    console.log("Note: dist/ is missing. Run `npm run build` to serve the site.");
  }
});

function shutdown(signal) {
  console.log(`\n${signal} received, shutting down.`);
  for (const job of jobs.values()) {
    if (job.child) {
      try {
        job.child.kill("SIGKILL");
      } catch {
        /* ignore */
      }
    }
  }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 3000).unref();
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
