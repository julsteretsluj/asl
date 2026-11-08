import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useAccount } from "./account.jsx";
import {
  applyAward,
  applyComfort,
  applyExercise,
  applySpendHeart,
  emptyProgress,
  loadProgress,
  mergeProgress,
  normalizeProgress,
  saveProgress,
} from "./progress.js";
import { pullProgress, pushProgress } from "./sync.js";

const ProgressContext = createContext(null);

export function ProgressProvider({ children }) {
  const { user, ready } = useAccount();
  const [progress, setProgress] = useState(loadProgress);
  const [syncState, setSyncState] = useState("local");
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const commit = useCallback(
    (next) => {
      const saved = saveProgress(next);
      progressRef.current = saved;
      setProgress(saved);
      if (!user) {
        setSyncState("local");
      } else {
        setSyncState("saving");
        pushProgress(user.uid, user.email, saved)
          .then(() => setSyncState("saved"))
          .catch(() => setSyncState("error"));
      }
      return { ...saved, xpGain: next.xpGain, perfect: next.perfect, firstTime: next.firstTime };
    },
    [user],
  );

  const refreshHearts = useCallback(() => {
    const current = progressRef.current;
    const next = normalizeProgress(current);
    if (next.hearts === current.hearts && next.nextHeartAt === current.nextHeartAt) return current;
    return commit(next);
  }, [commit]);

  useEffect(() => {
    if (!ready || !user) return undefined;
    let cancel = false;
    const uid = user.uid;
    const email = user.email;
    setSyncState("saving");
    pullProgress(uid)
      .then((remote) => {
        if (cancel) return;
        const local = loadProgress();
        const base = local.owner && local.owner !== uid ? emptyProgress() : local;
        const merged = mergeProgress(base, remote);
        merged.owner = uid;
        const saved = saveProgress(merged);
        progressRef.current = saved;
        setProgress(saved);
        return pushProgress(uid, email, saved);
      })
      .then(() => {
        if (!cancel) setSyncState("saved");
      })
      .catch(() => {
        if (!cancel) setSyncState("error");
      });
    return () => {
      cancel = true;
    };
  }, [ready, user]);

  const value = {
    progress,
    syncState,
    refreshHearts,
    spendHeart() {
      return commit(applySpendHeart(progressRef.current));
    },
    recordExercise(lesson, exercise, ok) {
      return commit(applyExercise(progressRef.current, lesson, exercise, ok));
    },
    finishLesson(lessonId, score) {
      return commit(applyAward(progressRef.current, lessonId, score));
    },
    setComfort(id, level) {
      return commit(applyComfort(progressRef.current, id, level));
    },
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
