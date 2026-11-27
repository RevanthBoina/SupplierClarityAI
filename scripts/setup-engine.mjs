#!/usr/bin/env node
/**
 * SupplierClarity AI — one-command setup for the CPU enhancement worker.
 *
 *   npm run setup:engine            # create .venv and install ncnn/numpy/pillow
 *   npm run setup:engine -- --force # rebuild the virtualenv from scratch
 *
 * If the system Python already has the packages this is a no-op with a note.
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const REQUIREMENTS = path.join(ROOT, "server", "requirements.txt");
const force = process.argv.includes("--force");
const isWindows = process.platform === "win32";
const venvDir = path.join(ROOT, ".venv");
const venvPython = path.join(venvDir, isWindows ? "Scripts" : "bin", isWindows ? "python.exe" : "python");

function run(command, args, options = {}) {
  return spawnSync(command, args, { encoding: "utf8", stdio: "pipe", ...options });
}

function basePython() {
  const candidates = [process.env.PYTHON, isWindows ? "python" : "python3", "python"].filter(Boolean);
  for (const candidate of candidates) {
    const probe = run(candidate, ["-c", "import sys; print(sys.version_info[:2])"]);
    if (probe.status === 0) return candidate;
  }
  return null;
}

function packagesReady(interpreter) {
  const probe = run(interpreter, ["-c", "import ncnn, numpy, PIL; print('ok')"]);
  return probe.status === 0;
}

function fail(message, hint) {
  console.error(`\n✖ ${message}`);
  if (hint) console.error(`  ${hint}`);
  process.exit(1);
}

console.log("SupplierClarity AI — enhancement engine setup\n");

const python = basePython();
if (!python) {
  fail("No Python interpreter found.", "Install Python 3.9+ and make sure `python3` is on PATH.");
}

if (packagesReady(python)) {
  console.log(`✔ ${python} already has ncnn, numpy and pillow — nothing to install.`);
  console.log(`  The API will use it automatically (set ENHANCE_PYTHON to override).`);
  process.exit(0);
}

if (force && fs.existsSync(venvDir)) {
  console.log("• Removing the existing .venv (--force)");
  fs.rmSync(venvDir, { recursive: true, force: true });
}

if (!fs.existsSync(venvPython)) {
  console.log(`• Creating .venv with ${python}`);
  const created = run(python, ["-m", "venv", venvDir]);
  if (created.status !== 0) {
    fail(
      "Could not create the virtualenv.",
      (created.stderr || "").trim() || "On Debian/Ubuntu install python3-venv first.",
    );
  }
}

console.log("• Installing worker dependencies (ncnn, numpy, pillow)");
const install = run(venvPython, ["-m", "pip", "install", "--disable-pip-version-check", "-r", REQUIREMENTS], {
  stdio: "inherit",
});
if (install.status !== 0) {
  fail("Dependency installation failed.", "Check the network connection and re-run `npm run setup:engine`.");
}

if (!packagesReady(venvPython)) {
  fail("The worker still cannot import its dependencies.", "Try `npm run setup:engine -- --force`.");
}

console.log("\n✔ Enhancement engine ready.");
console.log("  Verify it end to end:  npm run verify");
console.log("  Serve the site:        npm run build && npm run serve\n");
