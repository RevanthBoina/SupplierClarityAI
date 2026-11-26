#!/usr/bin/env python3
"""
SupplierClarity AI — Real-ESRGAN enhancement worker.

Runs Real-ESRGAN models via ncnn (CPU) on supplier product images and writes
catalog-ready upscaled outputs. Progress is emitted as JSON lines on stdout:
    {"stage": "load"} | {"stage": "tiles", "done": n, "total": m} | {"stage": "save"}
Human-readable timings go to stderr.

Usage:
  enhance.py --model MODEL --input IN --output OUT [--tile 192] [--outscale 4]
             [--format png|jpg] [--quality 92] [--threads 2]
Models (ncnn param/bin pairs under weights/ncnn):
  realesrgan-x4fast | realesr-animevideov3-x4 | realesrgan-x4plus
"""
import argparse
import json
import os
import sys
import time

import ncnn
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
WEIGHTS = os.path.join(HERE, "weights", "ncnn")


def emit(obj):
    print(json.dumps(obj), flush=True)


def load_net(model, threads):
    net = ncnn.Net()
    net.opt.use_vulkan_compute = False
    net.opt.num_threads = threads
    param = os.path.join(WEIGHTS, f"{model}.param")
    binf = os.path.join(WEIGHTS, f"{model}.bin")
    if not (os.path.isfile(param) and os.path.isfile(binf)):
        raise FileNotFoundError(f"model files missing for {model}")
    net.load_param(param)
    net.load_model(binf)
    return net


def infer_rgb(net, arr, threads):
    """arr: HxWx3 uint8 RGB -> H*4 x W*4 x3 float32"""
    h, w = arr.shape[:2]
    mat = ncnn.Mat.from_pixels(np.ascontiguousarray(arr), ncnn.Mat.PixelType.PIXEL_RGB, w, h)
    mat.substract_mean_normalize(np.zeros((3,), np.float32), np.array([1 / 255.0] * 3, np.float32))
    ex = net.create_extractor()
    ex.input("data", mat)
    ret, out = ex.extract("output")
    if ret != 0:
        raise RuntimeError(f"ncnn inference failed: {ret}")
    out.substract_mean_normalize(np.zeros((3,), np.float32), np.array([255.0] * 3, np.float32))
    return np.transpose(out.numpy(), (1, 2, 0))


def enhance(net, arr, tile, tile_pad=10):
    """Tiled Real-ESRGAN inference (reflect padding) with progress events."""
    h, w = arr.shape[:2]
    if not tile or (w <= tile and h <= tile):
        return infer_rgb(net, arr, 0)
    big = np.pad(arr.astype(np.uint8), ((tile_pad, tile_pad), (tile_pad, tile_pad), (0, 0)), mode="reflect")
    tiles = [(y0, x0) for y0 in range(0, h, tile) for x0 in range(0, w, tile)]
    canvas = np.zeros((h * 4, w * 4, 3), np.float32)
    for i, (y0, x0) in enumerate(tiles):
        y1, x1 = min(y0 + tile, h), min(x0 + tile, w)
        patch = big[y0 : y1 + tile_pad, x0 : x1 + tile_pad]
        out = infer_rgb(net, patch, 0)
        canvas[y0 * 4 : y1 * 4, x0 * 4 : x1 * 4] = out[0 : (y1 - y0) * 4, 0 : (x1 - x0) * 4]
        emit({"stage": "tiles", "done": i + 1, "total": len(tiles)})
    return canvas


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--model", required=True)
    ap.add_argument("--input", required=True)
    ap.add_argument("--output", required=True)
    ap.add_argument("--tile", type=int, default=192)
    ap.add_argument("--outscale", type=float, default=4.0)
    ap.add_argument("--format", choices=["png", "jpg"], default="png")
    ap.add_argument("--quality", type=int, default=92)
    ap.add_argument("--threads", type=int, default=2)
    args = ap.parse_args()

    t0 = time.time()
    img = Image.open(args.input)
    alpha = None
    if img.mode == "RGBA":
        alpha = img.split()[3]
        img_rgb = Image.new("RGB", img.size, (255, 255, 255))
        img_rgb.paste(img, mask=alpha)
        img = img_rgb
    elif img.mode != "RGB":
        img = img.convert("RGB")
    arr = np.asarray(img)
    w, h = img.size
    emit({"stage": "load"})

    net = load_net(args.model, args.threads)
    out = enhance(net, arr, args.tile)
    out_img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
    print(f"model done in {time.time()-t0:.1f}s", file=sys.stderr, flush=True)

    # arbitrary outscale (matches official repo behaviour: LANCZOS resample after SR)
    if abs(args.outscale - 4.0) > 1e-3:
        tw, th = max(1, round(w * args.outscale)), max(1, round(h * args.outscale))
        out_img = out_img.resize((tw, th), Image.LANCZOS)
    if alpha is not None:
        a = alpha.resize(out_img.size, Image.LANCZOS)
        rgba = out_img.convert("RGBA")
        rgba.putalpha(a)
        out_img = rgba
    emit({"stage": "save"})

    if args.format == "jpg":
        out_img.convert("RGB").save(args.output, "JPEG", quality=args.quality, optimize=True)
    else:
        out_img.save(args.output, "PNG", optimize=True)
    print(f"total {time.time()-t0:.1f}s", file=sys.stderr, flush=True)
    ow, oh = out_img.size
    emit({"stage": "done", "width": ow, "height": oh})


if __name__ == "__main__":
    main()
