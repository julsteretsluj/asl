import { useEffect, useState } from "react";
import { summarize } from "../coverage.js";
import { Check, ChevronRight, Icon, Lock, Map, Play } from "../components/icons.jsx";
import { GraphicSlot } from "../components/ui.jsx";
import { UNIT_GRAPHIC_IDS } from "../graphics.js";
import { findLesson, lessonList, previousLessonId, UNITS } from "../lessons.js";
import { HEART_RESTORE_MS, isLessonDone, MAX_HEARTS, nextHeartLabel } from "../progress.js";
import { useProgress } from "../progress-state.jsx";

export function Home() {
  const { progress, refreshHearts } = useProgress();
  const stats = summarize(progress);
  const [picked, setPicked] = useState(null);
  const [now, setNow] = useState(() => Date.now());
  const list = lessonList();
  const currentId = list.find((lesson) => !isLessonDone(progress, lesson.id))?.id || list[list.length - 1].id;
  const pickedLesson = picked ? findLesson(picked) : null;
  const pickedLocked = pickedLesson ? !canOpen(progress, pickedLesson.id) : false;
  const waitLabel = nextHeartLabel(progress, now);
  const heartsFull = progress.hearts >= MAX_HEARTS;

  useEffect(() => {
    if (heartsFull) return undefined;
    const id = window.setInterval(() => {
      setNow(Date.now());
      refreshHearts();
    }, 1000);
    return () => window.clearInterval(id);
  }, [heartsFull, refreshHearts]);

  return (
    <div>
      <div>
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
          <Icon as={Map} size="xs" />
          Learn
        </p>
        <h1 className="mt-1 text-[34px] font-medium tracking-[-0.03em]">Your path</h1>
      </div>
      <p className="mt-3 max-w-[36rem] text-[15px] leading-6 text-secondary">
        Each node is a short lesson. One prompt, then Check. You share five hearts across the path — a miss costs one, and one returns every {HEART_RESTORE_MS / 60000} minutes. Finish a lesson to open the next one.
      </p>
      <p className="mt-3 text-[14px]">
        <a href="#/record" className="inline-flex items-center gap-1 font-medium text-blue">
          {stats.words} signs covered, {stats.wordsMastered} mastered · {stats.concepts} ideas covered, {stats.conceptsMastered} mastered
          <Icon as={ChevronRight} size="sm" />
        </a>
      </p>

      <div className="relative mx-auto mt-10 max-w-[440px]">
        <div className="absolute top-6 bottom-6 left-1/2 w-px -translate-x-1/2 bg-line" aria-hidden="true" />
        <div className="relative space-y-10">
          {UNITS.map((unit, unitIndex) => (
            <section key={unit.id}>
              <div className={`${unitIndex % 2 ? "ml-10" : "mr-10"} ss-sheet px-4 py-3`}>
                <p className="text-[12px] font-medium text-secondary">Unit {unitIndex + 1}</p>
                <h2 className="text-[18px] font-medium tracking-[-0.02em]">{unit.title}</h2>
                <a href={unit.guide} className="mt-1 inline-flex items-center gap-1 text-[13px] font-medium text-blue">
                  {unit.guideLabel}
                  <Icon as={ChevronRight} size="xs" />
                </a>
                {UNIT_GRAPHIC_IDS[unitIndex] ? (
                  <GraphicSlot id={UNIT_GRAPHIC_IDS[unitIndex]} className="mt-3" />
                ) : null}
              </div>
              <ol className="mt-6 space-y-4">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const done = isLessonDone(progress, lesson.id);
                  const locked = !canOpen(progress, lesson.id);
                  const current = lesson.id === currentId && !done;
                  const side = lessonIndex % 2 === 0 ? "justify-start" : "justify-end";
                  return (
                    <li key={lesson.id} className={`flex ${side}`}>
                      <button
                        type="button"
                        disabled={locked}
                        onClick={() => setPicked(lesson.id)}
                        aria-current={current ? "step" : undefined}
                        className="relative grid w-[148px] justify-items-center gap-2 disabled:cursor-not-allowed"
                      >
                        {current ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-success px-3 py-1 text-[12px] font-semibold text-white shadow-soft">
                            <Icon as={Play} size={12} className="text-white" />
                            Start
                          </span>
                        ) : (
                          <span className="h-6" />
                        )}
                        <span
                          className={`grid h-[72px] w-[72px] place-items-center rounded-full text-[18px] font-medium shadow-soft ${
                            done
                              ? "bg-success text-white"
                              : current
                                ? "bg-surface text-ink ring-4 ring-success"
                                : "bg-muted text-secondary"
                          }`}
                        >
                          {done ? (
                            <Icon as={Check} size="lg" className="text-white" strokeWidth={2.25} />
                          ) : locked ? (
                            <Icon as={Lock} size="md" className="text-secondary" />
                          ) : (
                            lessonIndex + 1
                          )}
                        </span>
                        <span className={`text-center text-[13px] font-medium leading-4 ${locked ? "text-secondary" : "text-ink"}`}>
                          {lesson.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>

      {pickedLesson && !pickedLocked ? (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/20 p-4 sm:items-center">
          <button type="button" aria-label="Close lesson" className="absolute inset-0" onClick={() => setPicked(null)} />
          <div className="relative w-full max-w-md ss-sheet p-5" role="dialog" aria-modal="true" aria-labelledby="start-title">
            <p className="text-[13px] font-medium text-secondary">{pickedLesson.unitTitle}</p>
            <h2 id="start-title" className="mt-1 text-[24px] font-medium tracking-[-0.02em]">
              {pickedLesson.title}
            </h2>
            <p className="mt-3 text-[15px] leading-6">{pickedLesson.tip}</p>
            <p className="mt-2 text-[13px] text-secondary">
              {pickedLesson.exercises.length} exercises · {progress.hearts} of {MAX_HEARTS} hearts
              {waitLabel ? ` · ${waitLabel}` : ""}
            </p>
            {progress.hearts <= 0 ? (
              <p className="mt-4 text-[15px] leading-6 text-secondary">
                Hearts are empty. Wait for one to return, then start this lesson from the path.
              </p>
            ) : (
              <a
                href={`#/lesson/${pickedLesson.id}`}
                className="mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-success text-[16px] font-semibold text-white shadow-lift"
              >
                <Icon as={Play} size="sm" className="text-white" />
                {isLessonDone(progress, pickedLesson.id) ? "Practice again" : "Start"}
              </a>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function canOpen(progress, id) {
  const previous = previousLessonId(id);
  if (!previous) return true;
  return isLessonDone(progress, previous);
}
