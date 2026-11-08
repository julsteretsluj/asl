import { isComfortLevel, sanitizeComfort } from "./comfort.js";
import { itemId, itemsInExercise } from "./coverage.js";

const KEY = "signspace-path";

/** Shared heart pool: lessons spend these; home shows the same count. */
export const MAX_HEARTS = 5;
/** One heart returns every 3 minutes while below max. */
export const HEART_RESTORE_MS = 3 * 60 * 1000;
/**
 * XP heart packs — fixed prices; grant min(pack, room). Disabled when full or XP too low.
 * Tuned vs ~10–25 XP per lesson.
 */
export const HEART_PACKS = [
  { hearts: 1, xp: 15 },
  { hearts: 3, xp: 40 },
  { hearts: 5, xp: 60 },
];

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
    variantByLesson: {},
    owner: null,
  };
}

function sanitizeVariantByLesson(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const next = {};
  for (const [id, index] of Object.entries(value)) {
    if (!id || typeof id !== "string") continue;
    const n = Math.floor(Number(index));
    if (!Number.isFinite(n) || n < 0) continue;
    next[id] = n;
  }
  return next;
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

/** Hearts that still fit under the max pool. */
export function heartRoom(progress, now = Date.now()) {
  const { hearts } = resolveHearts(progress, now);
  return Math.max(0, MAX_HEARTS - hearts);
}

/** UI helper: cost, how many hearts this pack would add, and why it may be disabled. */
export function heartPackStatus(progress, packHearts, now = Date.now()) {
  const current = normalizeProgress(progress, now);
  const pack = HEART_PACKS.find((entry) => entry.hearts === packHearts);
  if (!pack) {
    return { cost: 0, gained: 0, room: 0, disabled: true, reason: "invalid" };
  }
  const room = Math.max(0, MAX_HEARTS - current.hearts);
  const gained = Math.min(pack.hearts, room);
  if (room <= 0) {
    return { cost: pack.xp, gained: 0, room, disabled: true, reason: "full" };
  }
  if (current.xp < pack.xp) {
    return { cost: pack.xp, gained, room, disabled: true, reason: "xp" };
  }
  return { cost: pack.xp, gained, room, disabled: false, reason: null };
}

/**
 * Spend XP for a heart pack. Charges the fixed pack price; adds min(pack, room).
 * Clears nextHeartAt only when the pool reaches max.
 */
export function applyBuyHearts(progress, packHearts, now = Date.now()) {
  const current = normalizeProgress(progress, now);
  const status = heartPackStatus(current, packHearts, now);
  if (status.disabled || status.gained <= 0) return current;
  const hearts = current.hearts + status.gained;
  const nextHeartAt = hearts >= MAX_HEARTS ? null : current.nextHeartAt || now + HEART_RESTORE_MS;
  return normalizeProgress(
    {
      ...current,
      xp: current.xp - status.cost,
      hearts,
      nextHeartAt,
    },
    now,
  );
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
    variantByLesson: sanitizeVariantByLesson(parsed.variantByLesson),
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

/** Remember which variant index was used; next open/retry advances. */
export function applyLessonVariant(progress, lessonId, variantIndex) {
  const current = normalizeProgress(progress);
  if (!lessonId || typeof lessonId !== "string") return current;
  const index = Math.max(0, Math.floor(Number(variantIndex)) || 0);
  return {
    ...current,
    variantByLesson: {
      ...(current.variantByLesson || {}),
      [lessonId]: index,
    },
  };
}

export function lessonVariantIndex(progress, lessonId) {
  const current = normalizeProgress(progress);
  const raw = current.variantByLesson?.[lessonId];
  const index = Math.floor(Number(raw));
  return Number.isFinite(index) && index >= 0 ? index : 0;
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
  const variantByLesson = { ...(right.variantByLesson || {}) };
  for (const [id, index] of Object.entries(left.variantByLesson || {})) {
    const other = variantByLesson[id];
    if (other === undefined || index > other) variantByLesson[id] = index;
  }
  return normalizeProgress({
    xp: Math.max(left.xp, right.xp),
    streak,
    lastDay,
    completed,
    items,
    comfort,
    hearts: hearts.hearts,
    nextHeartAt: hearts.nextHeartAt,
    variantByLesson,
    owner: left.owner,
  }, now);
}
