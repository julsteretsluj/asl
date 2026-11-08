import { collection, deleteField, doc, getDoc, getDocs, writeBatch } from "firebase/firestore";
import { isComfortLevel, sanitizeComfort } from "./comfort.js";
import { db } from "./firebase.js";

export async function pullProgress(uid) {
  const root = await getDoc(doc(db, "learners", uid));
  const data = root.exists() ? root.data() : {};
  const lessons = await getDocs(collection(db, "learners", uid, "lessons"));
  const items = await getDocs(collection(db, "learners", uid, "items"));
  const completed = {};
  lessons.forEach((entry) => {
    completed[entry.id] = entry.data();
  });
  const itemMap = {};
  const comfortFromItems = {};
  items.forEach((entry) => {
    const row = entry.data() || {};
    if (isComfortLevel(row.comfort)) comfortFromItems[entry.id] = row.comfort;
    const correct = Number(row.correct) || 0;
    const miss = Number(row.miss) || 0;
    if (correct + miss <= 0) return;
    const rest = { ...row };
    delete rest.comfort;
    itemMap[entry.id] = rest;
  });
  const comfort = data.comfort && typeof data.comfort === "object" && !Array.isArray(data.comfort)
    ? sanitizeComfort(data.comfort)
    : comfortFromItems;
  return {
    xp: Number(data.xp) || 0,
    streak: Number(data.streak) || 0,
    lastDay: typeof data.lastDay === "string" ? data.lastDay : "",
    completed,
    items: itemMap,
    comfort,
    // Omit hearts when absent so normalizeProgress migrates to a full pool.
    ...(data.hearts !== undefined && data.hearts !== null ? { hearts: data.hearts } : {}),
    ...(typeof data.nextHeartAt === "number" ? { nextHeartAt: data.nextHeartAt } : {}),
    ...(data.variantByLesson && typeof data.variantByLesson === "object" && !Array.isArray(data.variantByLesson)
      ? { variantByLesson: data.variantByLesson }
      : {}),
  };
}

export async function pushProgress(uid, email, progress) {
  const batch = writeBatch(db);
  const comfort = sanitizeComfort(progress.comfort);
  batch.set(
    doc(db, "learners", uid),
    {
      email: email || "",
      xp: progress.xp || 0,
      streak: progress.streak || 0,
      lastDay: progress.lastDay || "",
      comfort,
      hearts: progress.hearts,
      nextHeartAt: progress.nextHeartAt == null ? null : progress.nextHeartAt,
      variantByLesson: progress.variantByLesson || {},
      updatedAt: new Date().toISOString(),
    },
    { merge: true },
  );
  for (const [id, lesson] of Object.entries(progress.completed || {})) {
    batch.set(doc(db, "learners", uid, "lessons", id), {
      correct: lesson.correct,
      total: lesson.total,
      at: lesson.at,
    });
  }
  for (const [id, item] of Object.entries(progress.items || {})) {
    batch.set(
      doc(db, "learners", uid, "items", id),
      {
        kind: item.kind,
        key: item.key,
        label: item.label,
        gloss: item.gloss || "",
        category: item.category || "",
        correct: item.correct || 0,
        miss: item.miss || 0,
        comfort: comfort[id] || deleteField(),
      },
      { merge: true },
    );
  }
  for (const [id, level] of Object.entries(comfort)) {
    if (progress.items?.[id]) continue;
    batch.set(doc(db, "learners", uid, "items", id), { comfort: level }, { merge: true });
  }
  await batch.commit();
}
