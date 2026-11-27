/**
 * SupplierClarity AI — image sniffing and dimension reading (no dependencies).
 *
 * The enhancement API must reject bad uploads *before* a worker is spawned, and
 * it must know the real format even when the browser sends a wrong MIME type or
 * a file with no extension. Everything here works from the magic bytes and the
 * format headers, so it is fast, dependency-free and safe for untrusted input.
 */

const FORMATS = {
  png: { mime: "image/png", ext: ".png" },
  jpeg: { mime: "image/jpeg", ext: ".jpg" },
  webp: { mime: "image/webp", ext: ".webp" },
  gif: { mime: "image/gif", ext: ".gif" },
  bmp: { mime: "image/bmp", ext: ".bmp" },
};

function startsWith(buf, bytes, offset = 0) {
  if (buf.length < offset + bytes.length) return false;
  for (let i = 0; i < bytes.length; i += 1) {
    if (buf[offset + i] !== bytes[i]) return false;
  }
  return true;
}

function ascii(buf, start, end) {
  return buf.subarray(start, end).toString("latin1");
}

/** PNG: IHDR is always the first chunk. */
function pngSize(buf) {
  if (buf.length < 24) return null;
  if (ascii(buf, 12, 16) !== "IHDR") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

/** JPEG: walk the marker segments until a start-of-frame is found. */
function jpegSize(buf) {
  if (buf.length < 4) return null;
  let offset = 2; // skip SOI
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) {
      // Resynchronise on the next marker (some encoders pad with junk bytes).
      offset += 1;
      continue;
    }
    let marker = buf[offset + 1];
    if (marker === 0xff) {
      offset += 1;
      continue;
    }
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    if (length < 2) return null;
    const isSof =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      if (offset + 9 > buf.length) return null;
      return { width: buf.readUInt16BE(offset + 7), height: buf.readUInt16BE(offset + 5) };
    }
    if (marker === 0xda) return null; // start of scan: no frame header found
    offset += 2 + length;
  }
  return null;
}

/** GIF: logical screen descriptor. */
function gifSize(buf) {
  if (buf.length < 10) return null;
  return { width: buf.readUInt16LE(6), height: buf.readUInt16LE(8) };
}

/** BMP: BITMAPINFOHEADER (or a later DIB header) carries signed dimensions. */
function bmpSize(buf) {
  if (buf.length < 26) return null;
  const headerSize = buf.readUInt32LE(14);
  if (headerSize < 12) return null;
  if (headerSize === 12) {
    return { width: buf.readUInt16LE(18), height: buf.readUInt16LE(20) };
  }
  const width = buf.readInt32LE(18);
  const height = buf.readInt32LE(22);
  return { width: Math.abs(width), height: Math.abs(height) };
}

/** WebP: VP8 (lossy), VP8L (lossless) and VP8X (extended) chunks. */
function webpSize(buf) {
  if (buf.length < 30) return null;
  const chunk = ascii(buf, 12, 16);
  if (chunk === "VP8 ") {
    if (buf.length < 30) return null;
    return {
      width: buf.readUInt16LE(26) & 0x3fff,
      height: buf.readUInt16LE(28) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    if (buf.length < 25) return null;
    const bits = buf.readUInt32LE(21);
    return {
      width: (bits & 0x3fff) + 1,
      height: ((bits >> 14) & 0x3fff) + 1,
    };
  }
  if (chunk === "VP8X") {
    if (buf.length < 30) return null;
    const width = 1 + (buf[24] | (buf[25] << 8) | (buf[26] << 16));
    const height = 1 + (buf[27] | (buf[28] << 8) | (buf[29] << 16));
    return { width, height };
  }
  return null;
}

/**
 * Read the real format and pixel dimensions of an image buffer.
 * @param {Buffer} buf
 * @returns {{ format: string, mime: string, ext: string, width: number, height: number } | null}
 */
export function readImageMeta(buf) {
  if (!Buffer.isBuffer(buf) || buf.length < 12) return null;

  let format = null;
  let size = null;

  if (startsWith(buf, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    format = "png";
    size = pngSize(buf);
  } else if (startsWith(buf, [0xff, 0xd8, 0xff])) {
    format = "jpeg";
    size = jpegSize(buf);
  } else if (ascii(buf, 0, 6) === "GIF87a" || ascii(buf, 0, 6) === "GIF89a") {
    format = "gif";
    size = gifSize(buf);
  } else if (ascii(buf, 0, 4) === "RIFF" && ascii(buf, 8, 12) === "WEBP") {
    format = "webp";
    size = webpSize(buf);
  } else if (startsWith(buf, [0x42, 0x4d])) {
    format = "bmp";
    size = bmpSize(buf);
  }

  if (!format || !size) return null;
  if (!Number.isFinite(size.width) || !Number.isFinite(size.height)) return null;
  if (size.width <= 0 || size.height <= 0) return null;
  if (size.width > 100000 || size.height > 100000) return null;

  return {
    format,
    mime: FORMATS[format].mime,
    ext: FORMATS[format].ext,
    width: size.width,
    height: size.height,
  };
}
