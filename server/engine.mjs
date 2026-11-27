/**
 * SupplierClarity AI — enhancement engine registry and runtime detection.
 *
 * The site can run the enhancement engine two ways:
 *   • "engine"  — the CPU super-resolution worker (Python + ncnn models) is
 *                 installed and reachable; jobs are queued and run server-side.
 *   • "browser" — no worker on this host (for example a static deployment);
 *                 the page upscales in the browser so the tool still works.
 *
 * Nothing here throws: a missing interpreter or missing model files simply
 * marks the engine unavailable with an actionable hint, which the API and the
 * UI surface verbatim.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const SERVER_DIR = __dirname;
export const WEIGHTS_DIR = path.join(__dirname, "weights", "ncnn");

/** Public model catalogue. Weights are internal filenames, never exposed. */
export const MODELS = {
  balanced: {
    id: "balanced",
    label: "Catalog Balanced",
    about: "The everyday workhorse for product photography.",
    weights: "balanced-x4",
    scale: 4,
    defaultTile: 256,
    avgMsPerMp: 15000,
    timeoutMs: 4 * 60 * 1000,
  },
  sketch: {
    id: "sketch",
    label: "Fast Sketch",
    about: "Smallest and fastest, best for flat art, line work and sketches.",
    weights: "sketch-x4",
    scale: 4,
    defaultTile: 320,
    avgMsPerMp: 8500,
    timeoutMs: 3 * 60 * 1000,
  },
  "max-detail": {
    id: "max-detail",
    label: "Photo Max Detail",
    about: "Deep detail restoration; slow on CPU but the sharpest result.",
    weights: "max-detail-x4",
    scale: 4,
    defaultTile: 128,
    avgMsPerMp: 320000,
    timeoutMs: 12 * 60 * 1000,
  },
};

export const DEFAULT_MODEL = "balanced";
export const MODEL_IDS = Object.keys(MODELS);

const PROBE_SCRIPT = String.raw`
import json, sys
info = {"python": "%d.%d.%d" % sys.version_info[:3], "packages": {}, "errors": []}
for name, module in (("ncnn", "ncnn"), ("pillow", "PIL"), ("numpy", "numpy")):
    try:
        mod = __import__(module)
        info["packages"][name] = str(getattr(mod, "__version__", "installed"))
    except Exception as exc:
        info["packages"][name] = None
        info["errors"].append("%s: %s" % (name, exc.__class__.__name__))
print(json.dumps(info))
`;

/** Interpreter candidates, most specific first. */
function interpreterCandidates() {
  const root = path.resolve(__dirname, "..");
  const env = (process.env.ENHANCE_PYTHON || "").trim();
  const candidates = [];
  if (env) candidates.push(env);
  candidates.push(
    path.join(root, ".venv", "bin", "python"),
    path.join(root, ".venv", "Scripts", "python.exe"),
    path.join(root, "venv", "bin", "python"),
    path.join(root, "venv", "Scripts", "python.exe"),
  );
  if (process.platform === "win32") candidates.push("python", "py");
  else candidates.push("python3", "python");
  return [...new Set(candidates)];
}

function runProbe(interpreter) {
  const res = spawnSync(interpreter, ["-c", PROBE_SCRIPT], {
    encoding: "utf8",
    timeout: 20000,
    windowsHide: true,
    env: { ...process.env, PYTHONIOENCODING: "utf-8" },
  });
  if (res.error || res.status !== 0) return null;
  try {
    return JSON.parse(res.stdout.trim().split("\n").pop());
  } catch {
    return null;
  }
}

let cache = { at: 0, value: null };
const CACHE_MS = 15000;

/**
 * Detect the local worker. Cached briefly so every request does not spawn Python.
 * @param {{ force?: boolean }} [options]
 */
export function detectEngine({ force = false } = {}) {
  if (!force && cache.value && Date.now() - cache.at < CACHE_MS) return cache.value;

  const modelState = {};
  for (const model of Object.values(MODELS)) {
    const param = path.join(WEIGHTS_DIR, `${model.weights}.param`);
    const bin = path.join(WEIGHTS_DIR, `${model.weights}.bin`);
    const missing = [];
    if (!fs.existsSync(param)) missing.push(`${model.weights}.param`);
    if (!fs.existsSync(bin)) missing.push(`${model.weights}.bin`);
    modelState[model.id] = { available: missing.length === 0, missing };
  }

  const tried = [];
  let probe = null;
  let interpreter = null;
  for (const candidate of interpreterCandidates()) {
    tried.push(candidate);
    const result = runProbe(candidate);
    if (result) {
      probe = result;
      interpreter = candidate;
      break;
    }
  }

  const packages = probe?.packages || { ncnn: null, pillow: null, numpy: null };
  const missingPackages = Object.entries(packages)
    .filter(([, version]) => !version)
    .map(([name]) => name);
  const modelsAvailable = Object.values(modelState).filter((m) => m.available).length;

  let available = Boolean(probe) && missingPackages.length === 0 && modelsAvailable > 0;
  let detail;
  let hint;

  if (!probe) {
    detail = "The enhancement worker could not be started on this host.";
    hint =
      "This host has no Python worker. The page falls back to in-browser upscaling; run `npm run setup:engine` and `npm run serve` locally for AI enhancement.";
  } else if (missingPackages.length) {
    detail = `The enhancement worker is missing: ${missingPackages.join(", ")}.`;
    hint = "Run `npm run setup:engine` (or `pip install -r server/requirements.txt`) and restart the server.";
  } else if (modelsAvailable === 0) {
    detail = "No enhancement models were found in server/weights.";
    hint = "Restore the model files in server/weights/ncnn, then restart the server.";
  } else {
    detail = "The enhancement worker is ready.";
    hint = "";
    available = true;
  }

  // A worker without every model can still run the ones it has.
  if (available) {
    const partial = Object.values(modelState).filter((m) => !m.available);
    if (partial.length) detail = "The enhancement worker is ready (some models are unavailable).";
  }

  const value = {
    available,
    mode: available ? "engine" : "browser",
    interpreter,
    python: probe?.python || null,
    packages,
    models: modelState,
    detail,
    hint,
    checkedAt: new Date().toISOString(),
    candidates: tried,
  };
  cache = { at: Date.now(), value };
  return value;
}

/**
 * Best-effort estimate shown before a job starts. The engines always run at
 * their native 4x internally, so the chosen output scale does not change the
 * compute cost — only the input pixel count and the engine do.
 */
export function estimateMs(modelId, pixels) {
  const model = MODELS[modelId] || MODELS[DEFAULT_MODEL];
  const mp = Math.max(pixels, 1) / 1e6;
  return Math.max(1500, Math.round(mp * model.avgMsPerMp * 0.85 + 1200));
}

/** Last-resort language for a friendly, actionable API error. */
export function engineUnavailableMessage(engine = detectEngine()) {
  return engine.hint || "The enhancement engine is not available on this host.";
}
