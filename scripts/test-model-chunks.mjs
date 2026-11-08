/**
 * Node roundtrip for Firestore media chunk encode/decode.
 * Run: node scripts/test-model-chunks.mjs
 */
import assert from "node:assert/strict";
import {
  CHUNK_RAW_BYTES,
  MAX_SYNC_BYTES,
  assertSyncSize,
  decodeMediaChunks,
  encodeMediaChunks,
} from "../src/model-chunks.js";

function fillPattern(length) {
  const bytes = new Uint8Array(length);
  for (let i = 0; i < length; i += 1) bytes[i] = (i * 17 + 3) % 256;
  return bytes;
}

function roundtrip(label, length) {
  const original = fillPattern(length);
  const encoded = encodeMediaChunks(original);
  const expectedChunks = length === 0 ? 0 : Math.ceil(length / CHUNK_RAW_BYTES);
  assert.equal(encoded.length, expectedChunks, `${label}: chunk count`);
  for (const part of encoded) {
    assert.ok(typeof part === "string" && part.length > 0, `${label}: non-empty chunk`);
    // base64 of 512KB raw is ~682KB — keep well under Firestore 1MiB
    assert.ok(part.length < 900 * 1024, `${label}: chunk under 900KB`);
  }
  const restored = decodeMediaChunks(encoded);
  assert.equal(restored.length, original.length, `${label}: length`);
  assert.deepEqual(restored, original, `${label}: bytes`);
  console.log(`ok ${label} (${length} bytes → ${encoded.length} chunk(s))`);
}

roundtrip("empty", 0);
roundtrip("small", 1024);
roundtrip("exact-chunk", CHUNK_RAW_BYTES);
roundtrip("multi-chunk", CHUNK_RAW_BYTES * 2 + 1234);
roundtrip("near-sync-cap", Math.min(MAX_SYNC_BYTES, CHUNK_RAW_BYTES * 4 + 99));

assert.throws(
  () => assertSyncSize({ size: MAX_SYNC_BYTES + 1 }),
  (error) => error?.code === "model/sync-too-large",
);
assert.doesNotThrow(() => assertSyncSize({ size: MAX_SYNC_BYTES }));
console.log("ok sync size guard");

console.log("All model-chunk tests passed.");
