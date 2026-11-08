import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase.js";
import {
  MODEL_SYNC_TOO_LARGE,
  blobToEncodedChunks,
  encodedChunksToBlob,
  prepareCloudBlob,
} from "./model-chunks.js";
import {
  assertModelSize,
  listModels,
  modelDocId,
  modelKey,
  notifyModelsChanged,
  parseModelKey,
  readModel,
  slotUpdatedAt,
  writeModel,
} from "./models.js";

const BATCH_LIMIT = 400;

function newer(a, b) {
  const left = typeof a === "string" ? a : "";
  const right = typeof b === "string" ? b : "";
  if (!left) return false;
  if (!right) return true;
  return left > right;
}

function modelRef(uid, gloss, term, kind) {
  const slot = kind === "image" ? "image" : "video";
  return doc(db, "learners", uid, "models", modelDocId(gloss, term, slot));
}

function chunksCol(uid, gloss, term, kind) {
  return collection(modelRef(uid, gloss, term, kind), "chunks");
}

async function deleteChunkDocs(uid, gloss, term, kind) {
  const snap = await getDocs(chunksCol(uid, gloss, term, kind));
  const refs = snap.docs.map((entry) => entry.ref);
  for (let i = 0; i < refs.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    for (const ref of refs.slice(i, i + BATCH_LIMIT)) batch.delete(ref);
    await batch.commit();
  }
}

async function writeChunkDocs(uid, gloss, term, kind, encodedChunks) {
  for (let i = 0; i < encodedChunks.length; i += BATCH_LIMIT) {
    const batch = writeBatch(db);
    const slice = encodedChunks.slice(i, i + BATCH_LIMIT);
    slice.forEach((data, offset) => {
      const index = i + offset;
      batch.set(doc(chunksCol(uid, gloss, term, kind), String(index)), {
        index,
        data,
      });
    });
    await batch.commit();
  }
}

async function blobFromChunks(uid, gloss, term, kind, chunkCount, contentType) {
  const snap = await getDocs(chunksCol(uid, gloss, term, kind));
  const byIndex = new Map();
  snap.forEach((entry) => {
    const row = entry.data() || {};
    const index = typeof row.index === "number" ? row.index : Number(entry.id);
    if (!Number.isFinite(index) || typeof row.data !== "string") return;
    byIndex.set(index, row.data);
  });
  const expected = typeof chunkCount === "number" && chunkCount > 0 ? chunkCount : byIndex.size;
  const ordered = [];
  for (let i = 0; i < expected; i += 1) {
    const part = byIndex.get(i);
    if (typeof part !== "string") throw new Error("chunk-missing");
    ordered.push(part);
  }
  return encodedChunksToBlob(ordered, contentType || "application/octet-stream");
}

/**
 * Upload a personal model slot as Firestore metadata + chunk docs.
 * Storage / Blaze is not used.
 */
export async function uploadModelSlot(uid, { gloss, term, kind, blob, updatedAt }) {
  const prepared = await prepareCloudBlob(blob, kind === "image" ? "image" : "video");
  const slot = kind === "image" ? "image" : "video";
  const contentType =
    prepared.type || (slot === "image" ? "image/jpeg" : "video/webm");
  const at = updatedAt || new Date().toISOString();
  const encodedChunks = await blobToEncodedChunks(prepared);

  await deleteChunkDocs(uid, gloss, term, slot);
  await writeChunkDocs(uid, gloss, term, slot, encodedChunks);
  await setDoc(modelRef(uid, gloss, term, slot), {
    gloss: gloss || "",
    term: term || "",
    kind: slot,
    contentType,
    size: prepared.size,
    updatedAt: at,
    chunkCount: encodedChunks.length,
    backend: "firestore",
  });

  return {
    blob: prepared,
    updatedAt: at,
    contentType,
    chunkCount: encodedChunks.length,
    size: prepared.size,
  };
}

export async function deleteModelSlot(uid, { gloss, term, kind }) {
  const slot = kind === "image" ? "image" : "video";
  try {
    await deleteChunkDocs(uid, gloss, term, slot);
  } catch {
    /* chunks may already be gone */
  }
  try {
    await deleteDoc(modelRef(uid, gloss, term, slot));
  } catch {
    /* metadata may already be gone */
  }
}

/**
 * Save a personal model slot to IndexedDB, then to the account when signed in.
 * Shared by Dictionary and Record so both stay on one path.
 */
export async function saveModelMedia(uid, sign, slot, blob) {
  assertModelSize(blob);
  const key = modelKey(sign);
  const kind = slot === "image" ? "image" : "video";
  const updatedAt = new Date().toISOString();
  let next = await writeModel(
    key,
    { [kind]: blob },
    { gloss: sign.gloss, term: sign.term, updatedAt },
  );
  let cloudNote = "";
  if (uid) {
    try {
      const uploaded = await uploadModelSlot(uid, {
        gloss: sign.gloss,
        term: sign.term,
        kind,
        blob,
        updatedAt,
      });
      next = await writeModel(
        key,
        { [kind]: uploaded.blob },
        {
          gloss: sign.gloss,
          term: sign.term,
          updatedAt: uploaded.updatedAt,
        },
      );
    } catch (error) {
      if (error?.code === "model/too-large") throw error;
      if (error?.code === "model/sync-too-large") {
        cloudNote = error.message;
      } else {
        cloudNote =
          "Saved on this device, but the account upload didn’t finish. It will retry when you sign in again.";
      }
    }
  }
  notifyModelsChanged();
  return { model: next, cloudNote };
}

/** Clear a slot locally, and from Firestore when signed in. */
export async function clearModelMedia(uid, sign, slot) {
  const kind = slot === "image" ? "image" : "video";
  const key = modelKey(sign);
  const next = await writeModel(key, { [kind]: null }, { gloss: sign.gloss, term: sign.term });
  notifyModelsChanged();
  let cloudNote = "";
  if (uid) {
    try {
      await deleteModelSlot(uid, {
        gloss: sign.gloss,
        term: sign.term,
        kind,
      });
    } catch {
      cloudNote = "Removed on this device, but the cloud copy could not be deleted yet.";
    }
  }
  return { model: next, cloudNote };
}

async function pullRemoteModels(uid) {
  const snap = await getDocs(collection(db, "learners", uid, "models"));
  const rows = [];
  snap.forEach((entry) => {
    const data = entry.data() || {};
    if (data.kind !== "image" && data.kind !== "video") return;
    const chunkCount = typeof data.chunkCount === "number" ? data.chunkCount : 0;
    if (chunkCount <= 0) return;
    rows.push({
      id: entry.id,
      gloss: typeof data.gloss === "string" ? data.gloss : "",
      term: typeof data.term === "string" ? data.term : "",
      kind: data.kind,
      contentType: typeof data.contentType === "string" ? data.contentType : "",
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : "",
      chunkCount,
      size: typeof data.size === "number" ? data.size : 0,
    });
  });
  return rows;
}

/**
 * Merge account models with IndexedDB.
 * Newer updatedAt wins. Cloud is never deleted just because guest local is empty.
 */
function notifySyncNote(message) {
  if (typeof window === "undefined" || !message) return;
  window.dispatchEvent(new CustomEvent("signspace-models-sync-note", { detail: { message } }));
}

export async function syncModels(uid) {
  if (!uid) return { pulled: 0, pushed: 0 };

  const remote = await pullRemoteModels(uid);
  const localRows = await listModels();
  const localByKey = new Map(localRows.map((row) => [row.id, row]));
  let pulled = 0;
  let pushed = 0;
  let syncTooLarge = 0;

  for (const entry of remote) {
    const gloss = entry.gloss;
    const term = entry.term;
    if (!gloss && !term) continue;
    const key = modelKey({ gloss, term });
    const local = localByKey.get(key) || (await readModel(key));
    const localAt = slotUpdatedAt(local, entry.kind);
    const hasLocal = Boolean(local?.[entry.kind]);
    if (hasLocal && !newer(entry.updatedAt, localAt)) continue;
    try {
      const blob = await blobFromChunks(
        uid,
        gloss,
        term,
        entry.kind,
        entry.chunkCount,
        entry.contentType,
      );
      const next = await writeModel(
        key,
        { [entry.kind]: blob },
        {
          gloss,
          term,
          updatedAt: entry.updatedAt || new Date().toISOString(),
        },
      );
      localByKey.set(key, next);
      pulled += 1;
    } catch {
      /* keep going; one bad object shouldn't block the rest */
    }
  }

  for (const row of localByKey.values()) {
    const gloss = row.gloss || parseModelKey(row.id).gloss;
    const term = row.term || parseModelKey(row.id).term;
    for (const kind of ["image", "video"]) {
      const blob = row[kind];
      if (!blob) continue;
      const localAt = slotUpdatedAt(row, kind);
      const remoteMatch = remote.find(
        (entry) => entry.kind === kind && entry.gloss === gloss && entry.term === term,
      );
      if (remoteMatch && !newer(localAt, remoteMatch.updatedAt)) continue;
      try {
        const uploaded = await uploadModelSlot(uid, {
          gloss,
          term,
          kind,
          blob,
          updatedAt: localAt || new Date().toISOString(),
        });
        await writeModel(
          row.id,
          { [kind]: uploaded.blob },
          {
            gloss,
            term,
            updatedAt: uploaded.updatedAt,
          },
        );
        pushed += 1;
      } catch (error) {
        if (error?.code === "model/sync-too-large") syncTooLarge += 1;
        /* leave local copy; oversized clips stay device-only until trimmed */
      }
    }
  }

  if (pulled || pushed) notifyModelsChanged();
  if (syncTooLarge) notifySyncNote(MODEL_SYNC_TOO_LARGE);
  return { pulled, pushed, syncTooLarge };
}
