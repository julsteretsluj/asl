const KEY = "signspace-path";

function empty() {
  return { xp: 0, streak: 0, lastDay: "", completed: {} };
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

export function loadProgress() {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!parsed || typeof parsed !== "object") return empty();
    return {
      xp: Number(parsed.xp) || 0,
      streak: Number(parsed.streak) || 0,
      lastDay: typeof parsed.lastDay === "string" ? parsed.lastDay : "",
      completed: parsed.completed && typeof parsed.completed === "object" ? parsed.completed : {},
    };
  } catch {
    return empty();
  }
}

function save(progress) {
  localStorage.setItem(KEY, JSON.stringify(progress));
  return progress;
}

export function isLessonDone(progress, id) {
  return Boolean(progress.completed[id]);
}

export function awardLesson(lessonId, { correct, total }) {
  const progress = loadProgress();
  const firstTime = !progress.completed[lessonId];
  const perfect = correct === total;
  const xpGain = firstTime ? 10 + correct * 2 + (perfect ? 5 : 0) : 5;
  const today = dayKey(new Date());
  const yesterday = dayKey(shiftDays(new Date(), -1));
  let streak = progress.streak;
  if (progress.lastDay === today) {
    streak = Math.max(streak, 1);
  } else if (progress.lastDay === yesterday) {
    streak += 1;
  } else {
    streak = 1;
  }
  const next = {
    xp: progress.xp + xpGain,
    streak,
    lastDay: today,
    completed: {
      ...progress.completed,
      [lessonId]: { correct, total, at: today },
    },
  };
  save(next);
  return { ...next, xpGain, perfect, firstTime };
}
