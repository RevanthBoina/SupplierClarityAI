/**
 * In-browser fallback upscaler.
 *
 * The live tool prefers the server-side enhancement engine, but static
 * deployments (and offline development) have no CPU worker. In that case the
 * page still has to process the visitor's upload, so this module does a
 * high-quality multi-step resample plus a light unsharp pass on a canvas.
 *
 * It is deliberately labelled "preview" in the UI: it is a real, downloadable
 * upscale, but it is not the AI model.
 */

export interface BrowserEnhanceResult {
  blob: Blob;
  width: number;
  height: number;
  ms: number;
  /** True when the requested scale had to be reduced to fit canvas memory. */
  capped: boolean;
}

const MAX_PIXELS = 16_000_000;
const MAX_SIDE = 6000;

function outputSize(width: number, height: number, scale: number) {
  let factor = scale;
  const fits = (f: number) => width * f * height * f <= MAX_PIXELS && Math.max(width, height) * f <= MAX_SIDE;
  while (factor > 1 && !fits(factor)) factor -= 0.5;
  return {
    width: Math.max(1, Math.round(width * factor)),
    height: Math.max(1, Math.round(height * factor)),
    factor,
    capped: factor < scale,
  };
}

/** Two-pass draw keeps edges smooth when going up by 3-4x. */
function drawScaled(
  source: CanvasImageSource,
  sw: number,
  sh: number,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  let current: HTMLCanvasElement | null = null;
  let cw = sw;
  let ch = sh;

  if (targetW > sw * 2.2) {
    const midW = Math.round(sw * Math.sqrt(targetW / sw));
    const midH = Math.round(sh * Math.sqrt(targetH / sh));
    const mid = document.createElement('canvas');
    mid.width = midW;
    mid.height = midH;
    const mctx = mid.getContext('2d');
    if (mctx) {
      mctx.imageSmoothingEnabled = true;
      mctx.imageSmoothingQuality = 'high';
      mctx.drawImage(source, 0, 0, sw, sh, 0, 0, midW, midH);
      current = mid;
      cw = midW;
      ch = midH;
      source = mid;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas is not available in this browser.');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(source, 0, 0, cw, ch, 0, 0, targetW, targetH);
  current?.remove();
  return canvas;
}

/** 3x3 unsharp kernel; skipped on very large canvases to stay responsive. */
function sharpen(canvas: HTMLCanvasElement): void {
  if (canvas.width * canvas.height > 12_000_000) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const { width, height } = canvas;
  const image = ctx.getImageData(0, 0, width, height);
  const src = image.data;
  const out = new Uint8ClampedArray(src.length);
  const amount = 0.32;
  const centre = 1 + 4 * amount;
  const side = -amount;
  const diagonal = 0;

  for (let y = 0; y < height; y += 1) {
    const row = y * width * 4;
    const rowUp = (y > 0 ? y - 1 : y) * width * 4;
    const rowDown = (y < height - 1 ? y + 1 : y) * width * 4;
    for (let x = 0; x < width; x += 1) {
      const i = row + x * 4;
      const left = row + (x > 0 ? x - 1 : x) * 4;
      const right = row + (x < width - 1 ? x + 1 : x) * 4;
      const up = rowUp + x * 4;
      const down = rowDown + x * 4;
      for (let c = 0; c < 3; c += 1) {
        const value =
          src[i + c] * centre +
          (src[left + c] + src[right + c] + src[up + c] + src[down + c]) * side +
          (src[left + c] + src[right + c] + src[up + c] + src[down + c]) * diagonal;
        out[i + c] = value;
      }
      out[i + 3] = src[i + 3];
    }
  }
  image.data.set(out);
  ctx.putImageData(image, 0, 0);
}

function toBlob(canvas: HTMLCanvasElement, format: 'png' | 'jpg'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('The browser could not encode the image.'))),
      format === 'jpg' ? 'image/jpeg' : 'image/png',
      format === 'jpg' ? 0.92 : undefined,
    );
  });
}

// A macro-task yield rather than requestAnimationFrame: rAF is paused in a
// background tab, which would stall a long upscale until the tab is focused.
const nextTick = () => new Promise<void>((resolve) => setTimeout(resolve, 16));

export async function enhanceInBrowser(
  file: File,
  scale: number,
  format: 'png' | 'jpg',
  onProgress: (percent: number, label: string) => void = () => {},
): Promise<BrowserEnhanceResult> {
  const started = performance.now();
  onProgress(8, 'Decoding image');

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    try {
      bitmap = await createImageBitmap(file);
    } catch {
      throw new Error('This browser could not decode that image. Try a JPG or PNG.');
    }
  }

  const { width, height, capped } = outputSize(bitmap.width, bitmap.height, scale);
  if (width < 32 || height < 32) {
    bitmap.close();
    throw new Error('That image is too small to upscale.');
  }

  onProgress(26, 'Resampling');
  await nextTick();
  const canvas = drawScaled(bitmap, bitmap.width, bitmap.height, width, height);
  bitmap.close();

  onProgress(62, 'Restoring edges, detail, texture');
  await nextTick();
  sharpen(canvas);

  onProgress(88, 'Encoding file');
  const blob = await toBlob(canvas, format);
  onProgress(100, 'Done');

  return {
    blob,
    width,
    height,
    ms: Math.round(performance.now() - started),
    capped,
  };
}
