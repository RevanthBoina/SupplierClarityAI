/**
 * SupplierClarity AI — API + static host.
 *
 * Serves the built Angular app from dist/ and exposes the vendor-image
 * enhancement pipeline (Real-ESRGAN via ncnn, CPU):
 *   POST /api/jobs            multipart: image, model, outscale, format
 *   GET  /api/jobs/:id        job status + result metadata
 *   GET  /api/models          available enhancement models
 *   GET  /files/:id/:name     input / result / preview files
 *   GET  /api/health
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.join(ROOT, "dist", "whiteblue-site", "browser");
const DATA = path.join(__dirname, "data");
const JOBS_DIR = path.join(DATA, "jobs");
const PORT = Number(process.env.PORT || 8787);
const MAX_UPLOAD = 12 * 1024 * 1024; // 12 MB
const MAX_PIXELS = 1_600_000; // guard CPU time: ~1.6 MP input
const JOB_TTL_MS = 2 * 60 * 60 * 1000; // keep results for 2h

const MODELS = {
  "realesrgan-x4fast": { label: "Catalog Balanced", scale: 4, avgMsPerMp: 8000 },
  "realesr-animevideov3-x4": { label: "Fast Sketch", scale: 4, avgMsPerMp: 4200 },
  "realesrgan-x4plus": { label: "Photo Max Detail", scale: 4, avgMsPerMp: 148000 },
};

const jobs = new Map(); // id -> job record (mirror of meta.json + runtime state)
let active = 0;
const queue = [];

/* ---------------------------------- storage --------------------------------- */

async function ensureDirs() {
  await fs.mkdir(JOBS_DIR, { recursive: true });
}

function jobDir(id) {
  return path.join(JOBS_DIR, id);
}

async function writeMeta(job) {
  const { id, status, stage, model, outscale, format, createdAt, startedAt, finishedAt, error, input, output, tiles } = job;
  await fs.writeFile(
    path.join(jobDir(id), "meta.json"),
    JSON.stringify({ id, status, stage, model, outscale, format, createdAt, startedAt, finishedAt, error, input, output, tiles }, null, 2),
  );
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
    try {
      const meta = JSON.parse(await fs.readFile(path.join(JOBS_DIR, id, "meta.json"), "utf8"));
      if (meta.status === "processing" || meta.status === "queued") meta.status = "error", meta.error = "Server restarted during processing";
      jobs.set(id, meta);
      if (now - new Date(meta.createdAt).getTime() > JOB_TTL_MS) await gcJob(id);
    } catch {
      /* ignore */
    }
  }
}

async function gcJob(id) {
  jobs.delete(id);
  await fs.rm(jobDir(id), { recursive: true, force: true }).catch(() => {});
}

async function gcSweep() {
  const now = Date.now();
  for (const [id, meta] of jobs) {
    if (now - new Date(meta.createdAt).getTime() > JOB_TTL_MS) await gcJob(id);
  }
}

/* --------------------------------- pipeline --------------------------------- */

function runJob(job) {
  job.status = "processing";
  job.startedAt = new Date().toISOString();
  job.stage = "load";
  writeMeta(job).catch(() => {});

  const outName = job.format === "jpg" ? "result.jpg" : "result.png";
  const outPath = path.join(jobDir(job.id), outName);
  const args = [
    path.join(__dirname, "enhance.py"),
    "--model", job.model,
    "--input", path.join(jobDir(job.id), "input" + job.input.ext),
    "--output", outPath,
    "--tile", String(192),
    "--outscale", String(job.outscale),
    "--format", job.format,
    "--threads", "2",
  ];
  const proc = spawn("python3", args, { cwd: __dirname });

  let stderrTail = "";
  proc.stdout.on("data", (d) => {
    for (const line of d.toString().split("\n")) {
      if (!line.trim()) continue;
      try {
        const ev = JSON.parse(line);
        if (ev.stage === "tiles") {
          job.stage = "enhancing";
          job.tiles = ev;
        } else if (ev.stage) {
          job.stage = ev.stage;
        }
      } catch {
        /* non-JSON line */
      }
    }
  });
  proc.stderr.on("data", (d) => {
    stderrTail = (stderrTail + d.toString()).slice(-2000);
  });
  proc.on("error", async (err) => {
    job.status = "error";
    job.error = `Worker failed to start: ${err.message}`;
    job.finishedAt = new Date().toISOString();
    await writeMeta(job).catch(() => {});
    active--;
    pump();
  });
  proc.on("close", async (code) => {
    active--;
    try {
      if (code === 0 && fsSync.existsSync(outPath)) {
        const stat = await fs.stat(outPath);
        // small preview for the before/after slider
        await new Promise((res) => {
          const p = spawn("python3", [
            "-c",
            `import sys;from PIL import Image;im=Image.open(sys.argv[1]);im.thumbnail((1200,1200));im.convert("RGB").save(sys.argv[2],"JPEG",quality=82)`,
            outPath,
            path.join(jobDir(job.id), "preview.jpg"),
          ]);
          p.on("close", res);
        });
        let dims = {};
        try {
          const meta = JSON.parse(
            await new Promise((res, rej) => {
              const p = spawn("python3", [
                "-c",
                `import sys,json;from PIL import Image;im=Image.open(sys.argv[1]);print(json.dumps({"width":im.size[0],"height":im.size[1]}))`,
                outPath,
              ]);
              let buf = "";
              p.stdout.on("data", (d) => (buf += d));
              p.on("close", () => res(buf));
              p.on("error", rej);
            }),
          );
          dims = meta;
        } catch {
          /* dims optional */
        }
        job.status = "done";
        job.stage = "done";
        job.finishedAt = new Date().toISOString();
        job.output = { file: outName, bytes: stat.size, width: dims.width, height: dims.height, ms: job.startedAt ? new Date(job.finishedAt) - new Date(job.startedAt) : null };
      } else {
        job.status = "error";
        job.error = `Enhancement failed (exit ${code}). ${stderrTail.split("\n").slice(-3).join(" ").slice(0, 300)}`;
        job.finishedAt = new Date().toISOString();
      }
    } catch (e) {
      job.status = "error";
      job.error = e.message;
    }
    await writeMeta(job).catch(() => {});
    pump();
  });
}

function pump() {
  while (active < 1 && queue.length) {
    const job = queue.shift();
    active++;
    runJob(job);
  }
}

/* ----------------------------------- api ------------------------------------ */

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, _file, cb) => {
      const id = (req.jobId ||= crypto.randomUUID());
      const dir = jobDir(id);
      fs.mkdir(dir, { recursive: true }).then(() => cb(null, dir), cb);
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname || "").toLowerCase() || ".png";
      req.jobExt = ext;
      cb(null, "input" + ext);
    },
  }),
  limits: { fileSize: MAX_UPLOAD, files: 1 },
  fileFilter: (_req, file, cb) => {
    const ok = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/bmp"].includes(file.mimetype);
    cb(ok ? null : new Error("Unsupported file type. Use JPG, PNG, WebP, GIF or BMP."), ok);
  },
});

const app = express();
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, engine: "Real-ESRGAN (ncnn, CPU)", queue: queue.length, active, chat: getChatConfig() });
});

/* Clarity Assistant: Groq/Gemini when keys are set, knowledge base otherwise.
   Keys come from the environment (see .env.example) and never reach the browser. */
app.get("/api/chat", (_req, res) => {
  res.json({ ok: true, chat: getChatConfig() });
});

app.post("/api/chat", async (req, res) => {
  try {
    res.json(await handleChat(req.body || {}));
  } catch (e) {
    console.error("[chat] error:", e.message);
    res.status(500).json({ error: "Chat request failed" });
  }
});

app.get("/api/models", (_req, res) => {
  res.json(
    Object.entries(MODELS).map(([id, m]) => ({
      id,
      label: m.label,
      scale: m.scale,
      avgMsPerMp: m.avgMsPerMp,
    })),
  );
});

app.post("/api/jobs", (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message || "Upload failed" });
    try {
      const file = req.file;
      if (!file) return res.status(400).json({ error: "No image received" });
      const model = MODELS[req.body.model] ? req.body.model : "realesrgan-x4fast";
      const outscale = Math.min(4, Math.max(1, Number(req.body.outscale) || 4));
      const format = req.body.format === "jpg" ? "jpg" : "png";
      const id = req.jobId;
      const ext = req.jobExt || ".png";

      // pixel guard
      const dims = await new Promise((resolve) => {
        const p = spawn("python3", ["-c", `import sys,json;from PIL import Image;im=Image.open(sys.argv[1]);print(json.dumps({"width":im.size[0],"height":im.size[1]}))`, file.path]);
        let buf = "";
        p.stdout.on("data", (d) => (buf += d));
        p.on("close", () => {
          try {
            resolve(JSON.parse(buf));
          } catch {
            resolve(null);
          }
        });
        p.on("error", () => resolve(null));
      });
      if (!dims) return res.status(400).json({ error: "Could not read image" });
      const px = dims.width * dims.height;
      if (px > MAX_PIXELS) {
        await gcJob(id);
        return res.status(400).json({ error: `Image too large for the CPU demo engine (${dims.width}×${dims.height}). Keep it under ~1.6 MP (e.g. 1264×1264).` });
      }

      const job = {
        id,
        status: "queued",
        stage: "queued",
        model,
        outscale,
        format,
        createdAt: new Date().toISOString(),
        startedAt: null,
        finishedAt: null,
        error: null,
        input: { name: file.originalname, bytes: file.size, ext, width: dims.width, height: dims.height },
        output: null,
        tiles: null,
      };
      jobs.set(id, job);
      await writeMeta(job);
      queue.push(job);
      pump();
      res.status(201).json({ id, status: job.status, estimatedMs: Math.round((px / 1e6) * MODELS[model].avgMsPerMp * (outscale / 4) * 0.55 + 1500) });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
});

app.get("/api/jobs/:id", (req, res) => {
  const job = jobs.get(req.params.id);
  if (!job) return res.status(404).json({ error: "Unknown job" });
  res.json({
    id: job.id,
    status: job.status,
    stage: job.stage,
    tiles: job.tiles,
    model: job.model,
    outscale: job.outscale,
    format: job.format,
    error: job.error,
    input: job.input,
    output: job.output,
    files: job.status === "done" ? { result: `/files/${job.id}/${job.output.file}`, preview: `/files/${job.id}/preview.jpg`, original: `/files/${job.id}/input${job.input.ext}` } : null,
  });
});

app.get("/files/:id/:name", (req, res) => {
  const { id, name } = req.params;
  if (!/^[a-f0-9-]{10,40}$/.test(id)) return res.status(400).end();
  const ok = ["result.png", "result.jpg", "preview.jpg", "meta.json"].includes(name) || /^input\.(png|jpe?g|webp|gif|bmp)$/.test(name);
  if (!ok) return res.status(403).end();
  const p = path.join(JOBS_DIR, id, name);
  if (!fsSync.existsSync(p)) return res.status(404).end();
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.type(name.endsWith(".png") ? "image/png" : name.endsWith(".json") ? "application/json" : name.endsWith(".bmp") ? "image/bmp" : name.endsWith(".webp") ? "image/webp" : name.endsWith(".gif") ? "image/gif" : "image/jpeg");
  fsSync.createReadStream(p).pipe(res);
});

/* --------------------------------- static ----------------------------------- */

app.use(express.static(DIST, { maxAge: "1h", index: false }));
app.get(/^\/(?!api\/|files\/).*/, (_req, res) => {
  res.sendFile(path.join(DIST, "index.html"));
});

/* ---------------------------------- boot ------------------------------------ */

await ensureDirs();
await recoverStale();
setInterval(() => gcSweep().catch(() => {}), 30 * 60 * 1000).unref();
app.listen(PORT, "0.0.0.0", () => {
  console.log(`SupplierClarity AI server on http://0.0.0.0:${PORT}`);
});
