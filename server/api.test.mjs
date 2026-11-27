/**
 * SupplierClarity AI — API contract tests.
 *
 * Boots the real server on a random port with a temporary data directory and
 * exercises the upload → queue → enhance → download path, plus the validation
 * and cancellation paths. When the host has no Python worker the enhancement
 * assertions are replaced by the documented `engine_unavailable` contract, so
 * the suite is meaningful in CI and on a laptop alike.
 *
 *   npm run test:api
 */
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, before, test } from "node:test";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLE = path.join(ROOT, "public", "assets", "samples", "sneaker-lowres.jpg");
const DIST_INDEX = path.join(ROOT, "dist", "whiteblue-site", "browser", "index.html");
const PORT = 8100 + Math.floor(Math.random() * 700);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), "clarity-api-"));

let child = null;
let health = null;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function request(pathname, init = {}) {
  const res = await fetch(`${BASE}${pathname}`, init);
  const type = res.headers.get("content-type") || "";
  const body = type.includes("application/json") ? await res.json() : await res.arrayBuffer();
  return { status: res.status, body, headers: res.headers };
}

async function waitForServer(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(`${BASE}/api/health`);
      if (res.ok) return;
    } catch {
      /* not listening yet */
    }
    await sleep(150);
  }
  throw new Error("The API server did not start in time.");
}

/** A structurally valid PNG header — enough for the API's magic-byte checks. */
function pngHeader(width, height) {
  const buf = Buffer.alloc(33);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(buf, 0);
  buf.writeUInt32BE(13, 8);
  buf.write("IHDR", 12, "latin1");
  buf.writeUInt32BE(width, 16);
  buf.writeUInt32BE(height, 20);
  buf[24] = 8;
  buf[25] = 6;
  return buf;
}

function uploadForm(bytes, { filename = "photo.png", type = "image/png", model = "balanced", outscale = "2", format = "png" } = {}) {
  const form = new FormData();
  form.append("image", new Blob([bytes], { type }), filename);
  form.append("model", model);
  form.append("outscale", outscale);
  form.append("format", format);
  return form;
}

async function pollJob(id, timeoutMs = 240_000) {
  const deadline = Date.now() + timeoutMs;
  let last = null;
  while (Date.now() < deadline) {
    const res = await request(`/api/jobs/${id}`);
    assert.equal(res.status, 200);
    last = res.body;
    if (["done", "error", "canceled"].includes(last.status)) return last;
    await sleep(250);
  }
  throw new Error(`Job ${id} did not finish. Last status: ${JSON.stringify(last)}`);
}

before(async () => {
  child = spawn(process.execPath, [path.join(ROOT, "server", "index.mjs")], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(PORT), DATA_DIR },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stderr.on("data", (chunk) => process.stderr.write(chunk));
  await waitForServer();
  health = (await request("/api/health")).body;
});

after(() => {
  child?.kill("SIGKILL");
  fs.rmSync(DATA_DIR, { recursive: true, force: true });
});

test("health reports the service, engine and limits", () => {
  assert.equal(health.ok, true);
  assert.equal(typeof health.engine.available, "boolean");
  assert.equal(health.engine.mode, health.engine.available ? "engine" : "browser");
  assert.equal(health.limits.maxUploadBytes, 12 * 1024 * 1024);
  assert.equal(health.limits.maxInputPixels, 1_600_000);
  assert.ok(Array.isArray(health.models));
});

test("models exposes the three public engines with availability", async () => {
  const res = await request("/api/models");
  assert.equal(res.status, 200);
  assert.deepEqual(
    res.body.map((model) => model.id).sort(),
    ["balanced", "max-detail", "sketch"],
  );
  for (const model of res.body) {
    assert.equal(typeof model.label, "string");
    assert.equal(model.scale, 4);
    assert.equal(typeof model.available, "boolean");
  }
});

test("rejects a file that is not an image", async () => {
  const res = await request("/api/jobs", { method: "POST", body: uploadForm(Buffer.from("hello"), { filename: "note.png" }) });
  assert.equal(res.status, 415);
  assert.equal(res.body.code, "unsupported_image");
});

test("rejects images above the pixel guard", async () => {
  const res = await request("/api/jobs", { method: "POST", body: uploadForm(pngHeader(2400, 1600)) });
  assert.equal(res.status, 400);
  assert.equal(res.body.code, "image_too_large");
});

test("rejects an unknown engine", async () => {
  const sample = fs.readFileSync(SAMPLE);
  const res = await request("/api/jobs", {
    method: "POST",
    body: uploadForm(sample, { filename: "sneaker.jpg", type: "image/jpeg", model: "nope" }),
  });
  assert.equal(res.status, 400);
  assert.equal(res.body.code, "unknown_model");
});

test("rejects malformed job ids and unknown jobs", async () => {
  assert.equal((await request("/api/jobs/not-a-job")).status, 400);
  assert.equal((await request("/api/jobs/00000000-0000-4000-8000-000000000000")).status, 404);
});

test("an uploaded image is enhanced end to end", async () => {
  const sample = fs.readFileSync(SAMPLE);
  const created = await request("/api/jobs", {
    method: "POST",
    body: uploadForm(sample, { filename: "sneaker.jpg", type: "image/jpeg", model: "balanced", outscale: "2" }),
  });

  if (created.status === 503) {
    // Documented fallback contract for hosts without a Python worker.
    assert.equal(created.body.code, "engine_unavailable");
    assert.equal(typeof created.body.hint, "string");
    return;
  }

  assert.equal(created.status, 201, JSON.stringify(created.body));
  assert.match(created.body.id, /^[a-f0-9-]{10,40}$/);
  assert.ok(created.body.estimatedMs > 0);

  const job = await pollJob(created.body.id);
  assert.equal(job.status, "done", job.error || "job failed");
  assert.equal(job.progress, 100);
  assert.ok(job.output.width >= 870 && job.output.width <= 890, `unexpected width ${job.output.width}`);
  assert.ok(job.output.bytes > 1000);
  assert.deepEqual(Object.keys(job.files).sort(), ["original", "preview", "result"]);

  const result = await fetch(`${BASE}${job.files.result}`);
  assert.equal(result.status, 200);
  assert.equal(result.headers.get("content-type"), "image/png");
  const bytes = Buffer.from(await result.arrayBuffer());
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");

  const preview = await fetch(`${BASE}${job.files.preview}`);
  assert.equal(preview.status, 200);
  assert.equal(preview.headers.get("content-type"), "image/jpeg");

  const original = await fetch(`${BASE}${job.files.original}`);
  assert.equal(original.status, 200);

  // Job metadata must never be served as a file.
  const meta = await fetch(`${BASE}/files/${job.id}/meta.json`);
  assert.equal(meta.status, 404);
});

test("a queued or running job can be canceled", async () => {
  if (!health.engine.available) return;
  const sample = fs.readFileSync(SAMPLE);
  const created = await request("/api/jobs", {
    method: "POST",
    body: uploadForm(sample, { filename: "sneaker.jpg", type: "image/jpeg", model: "max-detail", outscale: "4" }),
  });
  assert.equal(created.status, 201);

  const canceled = await request(`/api/jobs/${created.body.id}`, { method: "DELETE" });
  assert.equal(canceled.status, 200);
  assert.ok(["canceling", "canceled"].includes(canceled.body.status));

  const job = await pollJob(created.body.id, 30_000);
  assert.equal(job.status, "canceled");
});

test("the built site is served with a SPA fallback", async (t) => {
  if (!fs.existsSync(DIST_INDEX)) {
    t.skip("dist/ is not built");
    return;
  }
  const res = await fetch(`${BASE}/enhance`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") || "", /text\/html/);
  assert.match(await res.text(), /<wb-root/);
});
