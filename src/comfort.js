import { itemId } from "./coverage.js";

export const COMFORT_LEVELS = [
  { id: "not-comfortable", label: "Not comfortable" },
  { id: "learning", label: "Learning" },
  { id: "comfortable", label: "Comfortable" },
  { id: "confident", label: "Confident" },
];

const LEVEL_IDS = new Set(COMFORT_LEVELS.map((level) => level.id));

export function isComfortLevel(value) {
  return LEVEL_IDS.has(value);
}

export function sanitizeComfort(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const comfort = {};
  for (const [id, level] of Object.entries(value)) {
    if (id && LEVEL_IDS.has(level)) comfort[id] = level;
  }
  return comfort;
}

export function wordId(gloss) {
  return itemId({ kind: "word", key: gloss });
}

export function comfortCounts(comfort) {
  const counts = Object.fromEntries(COMFORT_LEVELS.map((level) => [level.id, 0]));
  for (const level of Object.values(comfort || {})) {
    if (counts[level] != null) counts[level] += 1;
  }
  return counts;
}
