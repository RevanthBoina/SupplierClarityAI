#!/usr/bin/env python3
"""
SupplierClarity AI — CPU image enhancement worker.

Runs the catalogue super-resolution models (ncnn param/bin pairs under
weights/ncnn) on supplier product images and writes catalogue-ready output.

The worker is deliberately chatty on stdout in a machine-readable format so the
API can stream real progress to the browser. Every event is one JSON object per
line:
    {"stage": "start", "width": W, "height": H}
    {"stage": "load"}
    {"stage": "tiles", "done": n, "total": m}
    {"stage": "resize", "scale": s}
    {"stage": "save"}
    {"stage": "done", "width": W, "height": H, "ms": ms, "tiles": n}
    {"stage": "error", "code": "...", "message": "..."}   (exit code 2)

Human-readable timings go to stderr only.

Usage:
  enhance.py --model balanced --input IN --output OUT [--preview PREVIEW]
             [--outscale 4] [--format png|jpg] [--quality 92]
             [--tile 0] [--tile-pad 10] [--threads 2]

Models: balanced | sketch | max-detail
"""
import argparse
import json
import os
import sys
import time

HERE = os.path.dirname(os.path.abspath(__file__))
WEIGHTS = os.path.join(HERE, "weights", "ncnn")

# Interpreter/runtime problems are reported with a stable code so the API can
# turn them into an actionable message instead of a stack trace.
EXIT_ERROR = 2

# Public model id -> weight pair + tiling budget.
# `small` is the pixel count below which one un-tiled pass is cheaper (and fits
# comfortably in memory) than tiling.
MODEL_DEFAULTS = {
    "balanced": {"weights": "balanced-x4", "tile": 256, "small": 260_000},
    "sketch": {"weights": "sketch-x4", "tile": 320, "small": 640_000},
    "max-detail": {"weights": "max-detail-x4", "tile": 128, "small": 50_000},
}

MAX_OUTPUT_PIXELS = 32_000_000
MAX_OUTPUT_SIDE = 9000


def emit(obj):
    sys.stdout.write(json.dumps(obj, separators=(",", ":")) + "\n")
    sys.stdout.flush()


def fail(code, message):
    emit({"stage": "error", "code": code, "message": str(message)[:800]})
    print(f"error [{code}]: {message}", file=sys.stderr, flush=True)
    sys.exit(EXIT_ERROR)


def load_dependencies():
    """Import heavy deps lazily so a missing package yields a clean error."""
    missing = []
    try:
        import numpy  # noqa: F401
    except Exception:
        missing.append("numpy")
    try:
        from PIL import Image, ImageOps  # noqa: F401
    except Exception:
        missing.append("pillow")
    try:
        import ncnn  # noqa: F401
    except Exception:
        missing.append("ncnn")
    if missing:
        fail(
            "missing_dependency",
            "The enhancement worker is missing Python packages: "
            + ", ".join(missing)
            + ". Install them with `pip install -r server/requirements.txt`.",
        )
    import numpy
    from PIL import Image, ImageOps
    import ncnn

    return ncnn, numpy, Image, ImageOps


def weight_pair(model):
    spec = MODEL_DEFAULTS.get(model)
    if not spec:
        fail("unknown_model", f"Unknown model '{model}'.")
    return os.path.join(WEIGHTS, f"{spec['weights']}.param"), os.path.join(WEIGHTS, f"{spec['weights']}.bin")


def load_net(ncnn, numpy, model, threads):
    param, binf = weight_pair(model)
    if not (os.path.isfile(param) and os.path.isfile(binf)):
        fail(
            "missing_model",
            f"Model files for '{model}' are missing from server/weights/ncnn.",
        )
    net = ncnn.Net()
    net.opt.use_vulkan_compute = False
    net.opt.num_threads = max(1, int(threads))
    if net.load_param(param) != 0:
        fail("bad_model", f"Could not load the '{model}' model graph.")
    if net.load_model(binf) != 0:
        fail("bad_model", f"Could not load the '{model}' weights.")
    return net


def infer_rgb(ncnn, numpy, net, arr):
    """
    Run one forward pass. Input: HxWx3 uint8 RGB. Output: (H*4)x(W*4)x3 uint8.

    The network expects pixels in 0..1 and returns 0..1, so the input is divided
    by 255 and the output multiplied back. Results are clipped and rounded here
    so tiled canvases stay 8-bit (a float canvas for a 25 MP result would cost
    ~300 MB).
    """
    h, w = arr.shape[:2]
    mat = ncnn.Mat.from_pixels(numpy.ascontiguousarray(arr), ncnn.Mat.PixelType.PIXEL_RGB, w, h)
    mean = numpy.array([0.0, 0.0, 0.0], dtype=numpy.float32)
    norm = numpy.array([1 / 255.0, 1 / 255.0, 1 / 255.0], dtype=numpy.float32)
    mat.substract_mean_normalize(mean, norm)

    ex = net.create_extractor()
    ex.input("data", mat)
    ret, out = ex.extract("output")
    del ex
    if ret != 0:
        fail("inference_failed", f"The enhancement model returned an error (code {ret}).")

    out.substract_mean_normalize(mean, numpy.array([255.0, 255.0, 255.0], dtype=numpy.float32))
    data = numpy.transpose(out.numpy(), (1, 2, 0))
    del out
    return numpy.clip(numpy.rint(data), 0, 255).astype(numpy.uint8)


def enhance(ncnn, numpy, net, arr, tile, tile_pad, scale, progress=None):
    """
    Tiled inference with reflect padding.

    Each patch is padded on every side and the *centre* of the network output is
    copied into the canvas. (Copying from the top-left corner, as a naive
    implementation does, shifts every tile by tile_pad pixels and produces a
    visible grid of seams.)
    """
    h, w = arr.shape[:2]
    if not tile or (w <= tile and h <= tile):
        # A single pass still reports progress, so the UI can show "enhancing"
        # instead of sitting at 10% until the result lands.
        if progress:
            progress(0, 1)
        out = infer_rgb(ncnn, numpy, net, arr)
        if progress:
            progress(1, 1)
        return out

    pad = max(0, int(tile_pad))
    padded = numpy.pad(arr, ((pad, pad), (pad, pad), (0, 0)), mode="reflect")
    pad_out = pad * scale
    canvas = numpy.empty((h * scale, w * scale, 3), dtype=numpy.uint8)

    xs = list(range(0, w, tile))
    ys = list(range(0, h, tile))
    total = len(xs) * len(ys)
    done = 0
    if progress:
        progress(0, total)
    for y0 in ys:
        y1 = min(y0 + tile, h)
        for x0 in xs:
            x1 = min(x0 + tile, w)
            patch = padded[y0 : y1 + 2 * pad, x0 : x1 + 2 * pad]
            out = infer_rgb(ncnn, numpy, net, patch)
            canvas[y0 * scale : y1 * scale, x0 * scale : x1 * scale] = out[
                pad_out : pad_out + (y1 - y0) * scale,
                pad_out : pad_out + (x1 - x0) * scale,
            ]
            del out
            done += 1
            if progress:
                progress(done, total)
    return canvas


def choose_tile(model, pixels, requested):
    if requested and requested > 0:
        return int(requested)
    spec = MODEL_DEFAULTS.get(model, {"tile": 256, "small": 260_000})
    # Small images fit in one pass; large ones are tiled to keep peak memory low.
    if pixels <= spec["small"]:
        return 0
    return spec["tile"]


def open_image(Image, ImageOps, path):
    img = Image.open(path)
    img.load()
    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass

    # Preserve transparency, but run inference on an opaque composite so the
    # model never sees transparent black pixels as real colour.
    alpha = None
    if img.mode in ("RGBA", "LA") or (img.mode == "P" and "transparency" in img.info):
        img = img.convert("RGBA")
        alpha = img.getchannel("A")
        rgb = Image.new("RGB", img.size, (255, 255, 255))
        rgb.paste(img, mask=alpha)
        img = rgb
    elif img.mode != "RGB":
        img = img.convert("RGB")

    return img, alpha


def main():
    ap = argparse.ArgumentParser(description="Catalogue image enhancement worker")
    ap.add_argument("--model", default="balanced")
    ap.add_argument("--input")
    ap.add_argument("--output")
    ap.add_argument("--preview")
    ap.add_argument("--tile", type=int, default=0, help="0 = choose automatically")
    ap.add_argument("--tile-pad", type=int, default=10)
    ap.add_argument("--outscale", type=float, default=4.0)
    ap.add_argument("--format", choices=["png", "jpg"], default="png")
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--threads", type=int, default=0)
    ap.add_argument("--selftest", action="store_true", help="run a synthetic image through the worker")
    args = ap.parse_args()

    started = time.time()
    ncnn, numpy, Image, ImageOps = load_dependencies()

    threads = args.threads or max(1, (os.cpu_count() or 2) - 1)
    model_path = args.model
    if model_path not in MODEL_DEFAULTS:
        fail("unknown_model", f"Unknown model '{model_path}'.")

    if args.selftest:
        args.input = None
        gradient = numpy.zeros((64, 64, 3), dtype=numpy.uint8)
        gradient[:, :, 0] = numpy.linspace(0, 255, 64, dtype=numpy.uint8)[None, :]
        gradient[:, :, 1] = numpy.linspace(0, 255, 64, dtype=numpy.uint8)[:, None]
        gradient[:, :, 2] = 128
        emit({"stage": "load", "selftest": True})
        net = load_net(ncnn, numpy, model_path, threads)
        out = enhance(ncnn, numpy, net, gradient, 0, args.tile_pad, 4)
        ok = out.shape == (256, 256, 3) and int(out.max()) > 0
        emit({"stage": "done", "selftest": True, "ok": bool(ok), "shape": list(out.shape)})
        if not ok:
            fail("selftest_failed", "The model ran but produced an unexpected output.")
        return

    if not args.input or not args.output:
        fail("bad_request", "--input and --output are required.")

    try:
        img, alpha = open_image(Image, ImageOps, args.input)
    except FileNotFoundError:
        fail("bad_input", "The uploaded image could not be found.")
    except Exception as exc:
        fail("bad_input", f"The uploaded image could not be decoded ({exc.__class__.__name__}).")

    arr = numpy.asarray(img)
    h, w = arr.shape[:2]
    pixels = w * h
    scale = 4
    out_w, out_h = round(w * args.outscale), round(h * args.outscale)
    if out_w * out_h > MAX_OUTPUT_PIXELS or max(out_w, out_h) > MAX_OUTPUT_SIDE:
        fail(
            "output_too_large",
            f"{args.outscale:g}x output would be {out_w}x{out_h}px. "
            "Use a smaller scale or a smaller source image.",
        )

    emit({"stage": "start", "width": w, "height": h, "tile": choose_tile(model_path, pixels, args.tile)})
    emit({"stage": "load"})
    net = load_net(ncnn, numpy, model_path, threads)

    tile = choose_tile(model_path, pixels, args.tile)
    total_tiles = 0
    if tile and (w > tile or h > tile):
        total_tiles = len(range(0, w, tile)) * len(range(0, h, tile))

    last = {"done": -1}

    def progress(done, total):
        # Emit at most ~100 events; a 1.6 MP image can otherwise emit 100+ lines
        # that the browser cannot use anyway.
        step = max(1, total // 100)
        if done == 0 or done == total or done - last["done"] >= step:
            last["done"] = done
            emit({"stage": "tiles", "done": done, "total": total})

    out = enhance(ncnn, numpy, net, arr, tile, args.tile_pad, scale, progress)
    del net
    print(f"model done in {time.time() - started:.1f}s", file=sys.stderr, flush=True)

    out_img = Image.fromarray(numpy.ascontiguousarray(out))
    del out

    if alpha is not None:
        a = alpha.resize(out_img.size, Image.LANCZOS)
        rgba = out_img.convert("RGBA")
        rgba.putalpha(a)
        out_img = rgba

    if abs(args.outscale - scale) > 1e-3:
        emit({"stage": "resize", "scale": args.outscale})
        out_img = out_img.resize((out_w, out_h), Image.LANCZOS)

    icc = img.info.get("icc_profile")
    save_args = {"icc_profile": icc} if icc else {}
    emit({"stage": "save"})

    try:
        if args.format == "jpg":
            flat = out_img
            if flat.mode in ("RGBA", "LA"):
                bg = Image.new("RGB", flat.size, (255, 255, 255))
                bg.paste(flat, mask=flat.getchannel("A"))
                flat = bg
            elif flat.mode != "RGB":
                flat = flat.convert("RGB")
            quality = max(60, min(100, int(args.quality)))
            flat.save(
                args.output,
                "JPEG",
                quality=quality,
                subsampling=0 if quality >= 90 else 2,
                optimize=True,
                progressive=True,
                **save_args,
            )
        else:
            out_img.save(args.output, "PNG", optimize=True, compress_level=6, **save_args)
    except Exception as exc:
        fail("save_failed", f"Could not write the enhanced image ({exc.__class__.__name__}).")

    if args.preview:
        try:
            thumb = out_img.copy()
            thumb.thumbnail((1400, 1400), Image.LANCZOS)
            if thumb.mode in ("RGBA", "LA"):
                bg = Image.new("RGB", thumb.size, (255, 255, 255))
                bg.paste(thumb, mask=thumb.getchannel("A"))
                thumb = bg
            elif thumb.mode != "RGB":
                thumb = thumb.convert("RGB")
            thumb.save(args.preview, "JPEG", quality=82, optimize=True, progressive=True)
        except Exception as exc:
            print(f"preview skipped: {exc}", file=sys.stderr, flush=True)

    ow, oh = out_img.size
    emit(
        {
            "stage": "done",
            "width": ow,
            "height": oh,
            "ms": round((time.time() - started) * 1000),
            "tiles": total_tiles,
            "bytes": os.path.getsize(args.output) if os.path.exists(args.output) else None,
        }
    )


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except KeyboardInterrupt:
        fail("canceled", "The enhancement job was canceled.")
    except MemoryError:
        fail("out_of_memory", "The worker ran out of memory. Try a smaller image or scale.")
    except Exception as exc:  # pragma: no cover - last-resort guard
        fail("worker_crashed", f"{exc.__class__.__name__}: {exc}")
