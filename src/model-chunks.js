/**
 * Firestore-safe media chunking (Spark plan — no Storage).
 * Each chunk doc stays well under the 1 MiB Firestore limit.
 */

/** Raw binary bytes per chunk before base64 (~682KB encoded). */
export const CHUNK_RAW_BYTES = 512 * 1024;

/** Soft ceiling for account sync via Firestore chunks (~2.5 MB). */
export const MAX_SYNC_BYTES = Math.floor(2.5 * 1024 * 1024);

export const MODEL_SYNC_TOO_LARGE =
  "Too large for free account sync — trim shorter or use a smaller photo.";

export function assertSyncSize(blob) {
  if (blob && blob.size > MAX_SYNC_BYTES) {
    const error = new Error(MODEL_SYNC_TOO_LARGE);
    error.code = "model/sync-too-large";
    throw error;
  }
}

function bytesToBase64(bytes) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  const step = 0x8000;
  for (let i = 0; i < bytes.length; i += step) {
    binary += String.fromCharCode(...bytes.subarray(i, i + step));
  }
  return btoa(binary);
}

function base64ToBytes(encoded) {
  if (typeof Buffer !== "undefined") {
    return new Uint8Array(Buffer.from(encoded, "base64"));
  }
  const binary = atob(encoded);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i);
  return out;
}

/** Split an ArrayBuffer / Uint8Array into base64 chunk strings. */
export function encodeMediaChunks(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (!bytes.length) return [];
  const chunks = [];
  for (let offset = 0; offset < bytes.length; offset += CHUNK_RAW_BYTES) {
    const end = Math.min(offset + CHUNK_RAW_BYTES, bytes.length);
    chunks.push(bytesToBase64(bytes.subarray(offset, end)));
  }
  return chunks;
}

/** Reassemble base64 chunk strings (in order) into a Uint8Array. */
export function decodeMediaChunks(encodedChunks) {
  const parts = (encodedChunks || []).map((part) => base64ToBytes(part));
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

export async function blobToEncodedChunks(blob) {
  const buffer = await blob.arrayBuffer();
  return encodeMediaChunks(buffer);
}

export function encodedChunksToBlob(encodedChunks, contentType = "application/octet-stream") {
  const bytes = decodeMediaChunks(encodedChunks);
  return new Blob([bytes], { type: contentType || "application/octet-stream" });
}

/**
 * Recompress photos for account sync (canvas JPEG). No-ops outside the browser.
 * Tries lower quality / smaller edges until under MAX_SYNC_BYTES when possible.
 */
export async function compressImageForSync(blob) {
  if (typeof document === "undefined" || !blob) return blob;

  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("compress"));
      img.src = url;
    });
    const width = image.naturalWidth || image.width;
    const height = image.naturalHeight || image.height;
    if (!width || !height) return blob;

    const attempts = [
      { maxEdge: 1600, quality: 0.82 },
      { maxEdge: 1280, quality: 0.72 },
      { maxEdge: 1024, quality: 0.62 },
      { maxEdge: 800, quality: 0.55 },
    ];

    let best = blob;
    for (const attempt of attempts) {
      const scale = Math.min(1, attempt.maxEdge / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      const next = await new Promise((resolve) => {
        canvas.toBlob((out) => resolve(out), "image/jpeg", attempt.quality);
      });
      if (!next) continue;
      best = next;
      if (next.size <= MAX_SYNC_BYTES) return next;
    }
    return best;
  } catch {
    return blob;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function prepareCloudBlob(blob, kind) {
  let next = blob;
  if (kind === "image") {
    next = await compressImageForSync(blob);
  }
  assertSyncSize(next);
  return next;
}
