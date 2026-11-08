const DB_NAME = "signspace-dictionary";
const STORE = "models";

import { MAX_SYNC_BYTES, MODEL_SYNC_TOO_LARGE } from "./model-chunks.js";

/** Soft ceiling for personal sign media on this device (~25 MB). */
export const MAX_MODEL_BYTES = 25 * 1024 * 1024;

export const MODEL_TOO_LARGE =
  "That file is too large (over 25 MB). Try a shorter clip or a smaller photo.";

/** Account sync via Firestore chunks (Spark-safe). Re-exported for UI copy. */
export { MAX_SYNC_BYTES, MODEL_SYNC_TOO_LARGE };

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "id" });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export function modelKey(item) {
  return `${item.gloss}\u0000${item.term}`;
}

export function parseModelKey(id) {
  const sep = id.indexOf("\u0000");
  if (sep < 0) return { gloss: id, term: "" };
  return { gloss: id.slice(0, sep), term: id.slice(sep + 1) };
}

/** Path- and Firestore-safe key from gloss + term. */
export function safeModelKey(gloss, term) {
  const raw = `${gloss || ""}__${term || ""}`
    .normalize("NFKC")
    .replace(/[\\/#?[\]*]/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
  return (raw || "sign").slice(0, 180);
}

export function modelDocId(gloss, term, kind) {
  return `${safeModelKey(gloss, term)}__${kind === "image" ? "image" : "video"}`;
}

export function modelStoragePath(uid, gloss, term, kind) {
  const slot = kind === "image" ? "image" : "video";
  return `learners/${uid}/models/${safeModelKey(gloss, term)}/${slot}`;
}

export function assertModelSize(blob) {
  if (blob && blob.size > MAX_MODEL_BYTES) {
    const error = new Error(MODEL_TOO_LARGE);
    error.code = "model/too-large";
    throw error;
  }
}

export function slotUpdatedAt(row, kind) {
  if (!row) return "";
  if (kind === "image") return typeof row.imageUpdatedAt === "string" ? row.imageUpdatedAt : "";
  return typeof row.videoUpdatedAt === "string" ? row.videoUpdatedAt : "";
}

export async function readModel(id) {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function listModels() {
  const db = await openDb();
  try {
    return await new Promise((resolve, reject) => {
      const request = db.transaction(STORE, "readonly").objectStore(STORE).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  } finally {
    db.close();
  }
}

export async function writeModel(id, patch, meta = {}) {
  const current = (await readModel(id)) || { id, image: null, video: null };
  const next = { ...current, ...patch, id };
  const now =
    typeof meta.updatedAt === "string" && meta.updatedAt
      ? meta.updatedAt
      : new Date().toISOString();

  if (meta.gloss != null) next.gloss = meta.gloss;
  if (meta.term != null) next.term = meta.term;
  if (!next.gloss || !next.term) {
    const parsed = parseModelKey(id);
    if (!next.gloss) next.gloss = parsed.gloss;
    if (!next.term) next.term = parsed.term;
  }

  if ("image" in patch) {
    next.imageUpdatedAt = patch.image ? now : "";
    if (!patch.image) next.imageStoragePath = "";
    else if (meta.storagePath) next.imageStoragePath = meta.storagePath;
  }
  if ("video" in patch) {
    next.videoUpdatedAt = patch.video ? now : "";
    if (!patch.video) next.videoStoragePath = "";
    else if (meta.storagePath) next.videoStoragePath = meta.storagePath;
  }

  const db = await openDb();
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(next);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
  return next;
}

export function notifyModelsChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("signspace-models-changed"));
}
