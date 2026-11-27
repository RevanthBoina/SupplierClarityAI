#!/usr/bin/env node
/**
 * SupplierClarity AI — engine verification.
 *
 * Checks, in order:
 *   1. a Python interpreter with ncnn + numpy + pillow
 *   2. the model files for every engine
 *   3. a forward pass per engine (synthetic image, no files needed)
 *   4. one full end-to-end job on a sample photo (output + preview + dimensions)
 *
 * Run with `npm run verify`. Exits non-zero with an actionable message when the
 * worker is not usable, so it doubles as a pre-deploy check.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectEngine, MODELS, MODEL_IDS } from "./engine.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SAMPLE = path.join(ROOT, "public", "assets", "samples", "sneaker-lowres.jpg");
const WORKER = path.join(ROOT, "server", "enhance.py");

let failures = 0;

function ok(message) {
  console.log(`✔ ${message}`);
}

function warn(message) {
  console.log(`• ${message}`);
}

function bad(message, hint) {
  failures += 1;
  console.log(`✖ ${message}`);
  if (hint) console.log(`   ${hint}`);
}

function runWorker(interpreter, args, timeout = 600_000) {
  const result = spawnSync(interpreter, [WORKER, ...args], {
    encoding: "utf8",
    timeout,
    cwd: path.join(ROOT, "server"),
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
  });
  const events = (result.stdout || "")
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
  return { ...result, events };
}

console.log("SupplierClarity AI — engine verification\n");

const engine = detectEngine({ force: true });
if (!engine.available) {
  bad(engine.detail, engine.hint);
  console.log("\nThe site still works without a worker: the tool falls back to in-browser upscaling.");
  process.exit(1);
}

ok(`Python ${engine.python} via ${engine.interpreter}`);
ok(`ncnn ${engine.packages.ncnn}, numpy ${engine.packages.numpy}, pillow ${engine.packages.pillow}`);

for (const id of MODEL_IDS) {
  if (engine.models[id]?.available) ok(`Model files present: ${MODELS[id].label} (${id})`);
  else bad(`Model files missing for ${MODELS[id].label}: ${engine.models[id]?.missing?.join(", ")}`);
}

const quick = [];
for (const id of MODEL_IDS) {
  if (!engine.models[id]?.available) continue;
  process.stdout.write(`\nSelf-test ${MODELS[id].label} … `);
  const result = runWorker(engine.interpreter, ["--model", id, "--selftest"], 300_000);
  const done = result.events.find((event) => event.stage === "done");
  const error = result.events.find((event) => event.stage === "error");
  if (result.status === 0 && done?.ok) {
    process.stdout.write("ok\n");
    quick.push(id);
  } else {
    process.stdout.write("failed\n");
    bad(`${MODELS[id].label} self-test failed`, error?.message || (result.stderr || "").split("\n").slice(-2).join(" "));
  }
}

if (quick.length && fs.existsSync(SAMPLE)) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "clarity-verify-"));
  const out = path.join(dir, "result.png");
  const preview = path.join(dir, "preview.jpg");
  const model = quick.includes("balanced") ? "balanced" : quick[0];
  console.log(`\nEnd-to-end job (${MODELS[model].label}, 2× output) …`);
  const started = Date.now();
  const result = runWorker(engine.interpreter, [
    "--model", model,
    "--input", SAMPLE,
    "--output", out,
    "--preview", preview,
    "--outscale", "2",
    "--format", "png",
    "--tile", "0",
  ]);
  const done = result.events.find((event) => event.stage === "done");
  const error = result.events.find((event) => event.stage === "error");

  if (result.status === 0 && done && fs.existsSync(out)) {
    const bytes = fs.statSync(out).size;
    ok(`Output ${done.width}×${done.height}px, ${(bytes / 1024).toFixed(0)} KB in ${((Date.now() - started) / 1000).toFixed(1)}s`);
    if (fs.existsSync(preview) && fs.statSync(preview).size > 0) ok("Preview generated for the before/after slider");
    else warn("No preview file was written (the slider falls back to the full result)");
    if (done.width !== 880 || done.height !== 880) {
      bad(`Expected 2× of 440×440 (880×880), received ${done.width}×${done.height}`);
    }
    const tiles = result.events.filter((event) => event.stage === "tiles");
    if (tiles.length) ok(`${tiles.length} progress events streamed to the API`);
  } else {
    bad("End-to-end job failed", error?.message || (result.stderr || "").split("\n").slice(-2).join(" "));
  }
  fs.rmSync(dir, { recursive: true, force: true });
} else if (!fs.existsSync(SAMPLE)) {
  warn("Sample image missing; skipped the end-to-end job");
}

console.log("");
if (failures) {
  console.log(`${failures} check(s) failed. Run \`npm run setup:engine -- --force\` and try again.\n`);
  process.exit(1);
}
console.log("All checks passed. Start the API with `npm run serve`.\n");
