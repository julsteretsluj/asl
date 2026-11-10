/**
 * Coverage of atomic lesson glosses vs curated / dictionary embeds.
 * Usage: npm run test:lesson-embeds
 */
import { lessonList } from "../src/lessons.js";
import { VOCAB } from "../src/data.js";
import { EMBED_BY_GLOSS, resolveEmbed } from "../src/embeds.js";
import { normalizeEmbed, resolveSignVideo } from "../src/video.js";
import { DRILLS } from "../src/gloss.js";
import { resolveLessonVariants } from "../src/variants.js";

const MARKER = /^\[.+\]$/;
const SKIP = new Set([
  "A",
  "AN",
  "THE",
  "IS",
  "ARE",
  "WAS",
  "WERE",
  "AM",
  "OF",
  "AND",
  "BECAUSE",
  "WILL",
  "BE",
  "AT",
  "TO",
  "THEN",
  "GOING",
  "DO",
  "DOES",
  "DID",
  "IT",
  "MY",
  "ON",
  "FOR",
  "FROM",
  "WITH",
  "SO",
  "BUT",
  "OR",
  "IF",
  "HE",
  "SHE",
  "THEY",
  "THIS",
  "THAT",
  "HIS",
  "HER",
  "THEIR",
  "YOUR",
  "ME",
  "HIM",
  "US",
  "THEM",
  "GO-ING",
  "DRIVING",
  "RAINED",
  "SNOWED",
  "HAPPENED",
  "APPLES",
  "BOOKS",
  "CATS",
  "DOGS",
  "TREES",
  "EYES",
  "CHIN",
  "FOREHEAD",
  "CHEEK",
  "NOSE",
  // Meta / non-citation tiles
  "ALL-CAPS",
  "IS?",
  "SAM",
  "GO-TO",
  // Classifiers and locus labels (no single-sign citation film)
  "CL:B",
  "CL:C",
  "LEFT",
]);

function isFingerspell(token) {
  return /^[A-Z](-[A-Z]){1,}$/.test(token) && token.split("-").every((part) => part.length === 1);
}

function isAtomicGloss(token) {
  if (!token || typeof token !== "string") return false;
  const t = token.trim();
  if (!t || /\s/.test(t)) return false;
  if (MARKER.test(t) || SKIP.has(t) || isFingerspell(t)) return false;
  if (/^[A-Z]$/.test(t) || /^\d+$/.test(t)) return false;
  if (/^(me|left|right)-[A-Z][A-Z0-9+-]*-(me|left|right)$/i.test(t)) return true;
  if (/^CL:[A-Z0-9]+$/i.test(t)) return true;
  if (/^[A-Z][A-Z0-9+-]*\?$/.test(t)) return true;
  if (/^[A-Z][A-Z0-9+-]*(\+\+)?$/.test(t)) return true;
  if (/^[A-Z][A-Z0-9]*(-[A-Z][A-Z0-9]*)+$/.test(t)) return true;
  return false;
}

function addAtomic(set, raw) {
  if (!raw) return;
  for (const part of String(raw).replace(/,/g, " ").split(/\s+/)) {
    const token = part.trim();
    if (isAtomicGloss(token)) set.add(token);
  }
}

function collectFromExercise(set, exercise) {
  if (!exercise) return;
  if (exercise.type === "bank") {
    (exercise.tiles || []).forEach((tile) => addAtomic(set, tile));
    (exercise.answer || []).forEach((tile) => addAtomic(set, tile));
  } else if (exercise.type === "match") {
    (exercise.pairs || []).forEach((pair) => {
      addAtomic(set, pair.b);
      addAtomic(set, pair.a);
    });
  } else if (exercise.type === "choice") {
    addAtomic(set, exercise.answer);
    (exercise.options || []).forEach((option) => addAtomic(set, typeof option === "string" ? option : option?.label));
  } else if (exercise.type === "blank") {
    addAtomic(set, exercise.answer);
    (exercise.options || []).forEach((option) => addAtomic(set, option));
    addAtomic(set, exercise.before);
    addAtomic(set, exercise.after);
  } else if (exercise.type === "type") {
    addAtomic(set, exercise.model);
    addAtomic(set, exercise.modelGloss);
    const drill = DRILLS.find((item) => item.id === exercise.drillId);
    if (drill) {
      addAtomic(set, drill.model);
      (drill.tiles || []).forEach((tile) => addAtomic(set, tile));
      (drill.stage || []).forEach((stage) => addAtomic(set, stage.gloss));
    }
  }
}

function glossCandidates(gloss) {
  const list = [gloss];
  if (gloss.endsWith("++")) list.push(gloss.slice(0, -2));
  if (gloss.endsWith("?")) list.push(gloss.slice(0, -1));
  const directed = gloss.match(/^(?:me|left|right)-([A-Z][A-Z0-9+-]*)-(?:me|left|right)$/i);
  if (directed) list.push(directed[1].toUpperCase());
  return [...new Set(list)];
}

function resolveForGloss(gloss) {
  for (const key of glossCandidates(gloss)) {
    const items = VOCAB.filter((item) => item.gloss === key);
    for (const item of items) {
      const embed = resolveSignVideo(item);
      if (embed) return { embed, via: key === gloss ? "vocab" : `vocab:${key}` };
    }
    const mapped = resolveEmbed(key) || normalizeEmbed(EMBED_BY_GLOSS[key]);
    if (mapped) return { embed: mapped, via: key === gloss ? "embed-map" : `embed-map:${key}` };
  }
  return null;
}

const glosses = new Set();
for (const lesson of lessonList()) {
  for (const list of resolveLessonVariants(lesson)) {
    for (const exercise of list) collectFromExercise(glosses, exercise);
  }
}

const sorted = [...glosses].sort();
const ok = [];
const missing = [];
for (const gloss of sorted) {
  const resolved = resolveForGloss(gloss);
  if (resolved) ok.push({ gloss, provider: resolved.embed.provider, via: resolved.via });
  else missing.push(gloss);
}

const pct = sorted.length ? ((ok.length / sorted.length) * 100).toFixed(1) : "0.0";
console.log(`Lesson gloss embeds: ${ok.length}/${sorted.length} (${pct}%)`);
console.log(`ok=${ok.length} missing=${missing.length}`);
if (missing.length) {
  console.log("Missing:");
  for (const gloss of missing) console.log(`  ${gloss}`);
}
process.exitCode = missing.length ? 1 : 0;
