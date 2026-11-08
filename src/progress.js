import { isComfortLevel, sanitizeComfort } from "./comfort.js";
import { itemId, itemsInExercise } from "./coverage.js";

const KEY = "signspace-path";

/** Shared heart pool: lessons spend these; home shows the same count. */
export const MAX_HEARTS = 5;
/** One heart returns every 5 minutes while below max. */
export const HEART_RESTORE_MS = 5 * 60 * 1000;

export function emptyProgress() {
  return {
    xp: 0,
    streak: 0,
    lastDay: "",
    completed: {},
    items: {},
    comfort: {},
    hearts: MAX_HEARTS,
    nextHeartAt: null,
    owner: null,
  };
}

export function resolveHearts(progress, now = Date.now()) {
  const raw = progress && typeof progress === "object" ? progress : {};
  // Missing field → full pool so existing learners are not locked out.
  if (raw.hearts === undefined || raw.hearts === null) {
    return { hearts: MAX_HEARTS, nextHeartAt: null };
  }
  let hearts = Math.min(MAX_HEARTS, Math.max(0, Math.floor(Number(raw.hearts)) || 0));
  let nextHeartAt = typeof raw.nextHeartAt === "number" && raw.nextHeartAt > 0 ? raw.nextHeartAt : null;

  if (hearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, nextHeartAt: null };
  }

  if (!nextHeartAt) {
    return { hearts, nextHeartAt: now + HEART_RESTORE_MS };
  }

  while (hearts < MAX_HEARTS && nextHeartAt <= now) {
    hearts += 1;
    if (hearts >= MAX_HEARTS) {
      return { hearts: MAX_HEARTS, nextHeartAt: null };
    }
    nextHeartAt += HEART_RESTORE_MS;
  }

  return { hearts, nextHeartAt };
}

export function applySpendHeart(progress, now = Date.now()) {
  const current = normalizeProgress(progress, now);
  if (current.hearts <= 0) return current;
  const hearts = current.hearts - 1;
  const nextHeartAt = hearts >= MAX_HEARTS ? null : current.nextHeartAt || now + HEART_RESTORE_MS;
  return normalizeProgress({ ...current, hearts, nextHeartAt }, now);
}

export function formatHeartCountdown(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

/** Label for the next restore tick, or null when full. */
export function nextHeartLabel(progress, now = Date.now()) {
  const { hearts, nextHeartAt } = resolveHearts(progress, now);
  if (hearts >= MAX_HEARTS || !nextHeartAt) return null;
  return `Next heart in ${formatHeartCountdown(nextHeartAt - now)}`;
}

function pickHeartMerge(left, right, now) {
  const a = resolveHearts(left, now);
  const b = resolveHearts(right, now);
  if (a.hearts !== b.hearts) return a.hearts > b.hearts ? a : b;
  if (!a.nextHeartAt) return a;
  if (!b.nextHeartAt) return b;
  return a.nextHeartAt <= b.nextHeartAt ? a : b;
}

function dayKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function shiftDays(date, amount) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

export function normalizeProgress(parsed, now = Date.now()) {
  if (!parsed || typeof parsed !== "object") return emptyProgress();
  const rawItems = parsed.items && typeof parsed.items === "object" && !Array.isArray(parsed.items) ? parsed.items : {};
  const items = {};
  const comfort = sanitizeComfort(parsed.comfort);
  for (const [id, item] of Object.entries(rawItems)) {
    if (!item || typeof item !== "object") continue;
    if (isComfortLevel(item.comfort) && !comfort[id]) comfort[id] = item.comfort;
    const rest = { ...item };
    delete rest.comfort;
    items[id] = rest;
  }
  const hearts = resolveHearts(parsed, now);
  return {
    xp: Number(parsed.xp) || 0,
    streak: Number(parsed.streak) || 0,
    lastDay: typeof parsed.lastDay === "string" ? parsed.lastDay : "",
    completed: parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {},
    items,
    comfort,
    hearts: hearts.hearts,
    nextHeartAt: hearts.nextHeartAt,
    owner: typeof parsed.owner === "string" ? parsed.owner : null,
  };
}

export function loadProgress() {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(KEY) || "null"));
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  const next = normalizeProgress(progress);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function isLessonDone(progress, id) {
  return Boolean(progress?.completed?.[id]);
}

export function applyExercise(progress, lesson, exercise, ok) {
  const items = { ...(progress.items || {}) };
  for (const item of itemsInExercise(lesson, exercise)) {
    const id = itemId(item);
    const previous = items[id] || { ...item, correct: 0, miss: 0 };
    const fields = { ...previous };
    delete fields.comfort;
    items[id] = {
      ...fields,
      ...item,
      correct: (Number(previous.correct) || 0) + (ok ? 1 : 0),
      miss: (Number(previous.miss) || 0) + (ok ? 0 : 1),
    };
  }
  return { ...progress, items };
}

export function applyComfort(progress, id, level) {
  const current = normalizeProgress(progress);
  if (!id || typeof id !== "string") return current;
  const comfort = { ...current.comfort };
  if (isComfortLevel(level)) comfort[id] = level;
  else delete comfort[id];
  return { ...current, comfort };
}

export function applyAward(progress, lessonId, { correct, total }) {
  const firstTime = !progress.completed?.[lessonId];
  const perfect = correct === total;
  const xpGain = firstTime ? 10 + correct * 2 + (perfect ? 5 : 0) : 5;
  const today = dayKey(new Date());
  const yesterday = dayKey(shiftDays(new Date(), -1));
  let streak = progress.streak || 0;
  if (progress.lastDay === today) streak = Math.max(streak, 1);
  else if (progress.lastDay === yesterday) streak += 1;
  else streak = 1;
  const next = {
    ...progress,
    xp: (progress.xp || 0) + xpGain,
    streak,
    lastDay: today,
    completed: {
      ...(progress.completed || {}),
      [lessonId]: { correct, total, at: today },
    },
  };
  return { ...next, xpGain, perfect, firstTime };
}

export function mergeProgress(local, remote) {
  const left = normalizeProgress(local);
  const right = normalizeProgress(remote);
  let streak = right.streak;
  let lastDay = right.lastDay;
  if (left.lastDay === right.lastDay) streak = Math.max(left.streak, right.streak);
  else if (left.lastDay > right.lastDay) {
    streak = left.streak;
    lastDay = left.lastDay;
  }
  const completed = { ...right.completed };
  for (const [id, record] of Object.entries(left.completed)) {
    const other = completed[id];
    if (!other || (record.correct || 0) > (other.correct || 0)) completed[id] = record;
  }
  const items = { ...right.items };
  for (const [id, item] of Object.entries(left.items)) {
    const other = items[id];
    if (!other) items[id] = item;
    else {
      items[id] = {
        ...item,
        ...other,
        label: item.label || other.label,
        correct: Math.max(Number(item.correct) || 0, Number(other.correct) || 0),
        miss: Math.max(Number(item.miss) || 0, Number(other.miss) || 0),
      };
    }
  }
  const comfort = { ...left.comfort };
  for (const [id, level] of Object.entries(right.comfort)) {
    if (isComfortLevel(level)) comfort[id] = level;
  }
  const now = Date.now();
  const hearts = pickHeartMerge(left, right, now);
  return normalizeProgress({
    xp: Math.max(left.xp, right.xp),
    streak,
    lastDay,
    completed,
    items,
    comfort,
    hearts: hearts.hearts,
    nextHeartAt: hearts.nextHeartAt,
    owner: left.owner,
  }, now);
}
