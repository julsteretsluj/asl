import { VOCAB } from "./data.js";

const GLOSS_TOKEN = /^[A-Z][A-Z0-9'+-]*(?:\s+[A-Z][A-Z0-9'+-]*)*$/;

/** Look up a dictionary row; fall back to gloss + term for personal models. */
export function signFromGlossTerm(gloss, term = "") {
  const key = typeof gloss === "string" ? gloss.trim() : "";
  if (!key) return null;
  const matches = VOCAB.filter((entry) => entry.gloss === key);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    const want = typeof term === "string" ? term.trim() : "";
    return matches.find((entry) => entry.term === want) || matches[0];
  }
  const label = typeof term === "string" && term.trim() ? term.trim() : key;
  return { gloss: key, term: label, category: "Signs" };
}

function isVocabGloss(label) {
  if (typeof label !== "string" || !GLOSS_TOKEN.test(label.trim())) return false;
  return VOCAB.some((entry) => entry.gloss === label.trim());
}

function leadGloss(prompt) {
  if (typeof prompt !== "string") return "";
  const match = prompt.trim().match(/^([A-Z][A-Z0-9'+-]*(?:\s+[A-Z][A-Z0-9'+-]*)*)\b/);
  return match ? match[1] : "";
}

function pushSign(list, seen, gloss, term = "") {
  if (!isVocabGloss(gloss)) return;
  const sign = signFromGlossTerm(gloss, term);
  if (!sign) return;
  const key = `${sign.gloss}\u0000${sign.term}`;
  if (seen.has(key)) return;
  seen.add(key);
  list.push(sign);
}

/**
 * Vocab signs to watch before the graded prompt.
 * Explicit modelGloss wins first; match pairs and vocab answers fill the rest.
 * Pure grammar meta-questions with no clear sign return [].
 */
export function signsForExercise(exercise) {
  if (!exercise || typeof exercise !== "object") return [];
  const seen = new Set();
  const list = [];

  if (typeof exercise.modelGloss === "string" && exercise.modelGloss.trim()) {
    const sign = signFromGlossTerm(exercise.modelGloss, exercise.modelTerm || "");
    if (sign) {
      seen.add(`${sign.gloss}\u0000${sign.term}`);
      list.push(sign);
    }
  }

  if (typeof exercise.answer === "string" && isVocabGloss(exercise.answer)) {
    pushSign(list, seen, exercise.answer);
  }

  if (Array.isArray(exercise.answer)) {
    for (const tile of exercise.answer) {
      if (isVocabGloss(tile)) pushSign(list, seen, tile);
    }
  }

  const fromPrompt = leadGloss(exercise.prompt);
  if (fromPrompt && isVocabGloss(fromPrompt)) pushSign(list, seen, fromPrompt);

  if (exercise.type === "match" && Array.isArray(exercise.pairs)) {
    for (const pair of exercise.pairs) {
      if (pair?.b && isVocabGloss(pair.b)) pushSign(list, seen, pair.b, pair.a || "");
      else if (pair?.a && isVocabGloss(pair.a)) pushSign(list, seen, pair.a, pair.b || "");
    }
  }

  return list;
}

/** Primary sign for the optional record step. */
export function signForExercise(exercise) {
  if (!exercise || typeof exercise !== "object") return null;
  if (typeof exercise.modelGloss === "string" && exercise.modelGloss.trim()) {
    return signFromGlossTerm(exercise.modelGloss, exercise.modelTerm || "");
  }
  return signsForExercise(exercise)[0] || null;
}
