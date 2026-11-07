import { useState } from "react";
import { findLesson, lessonList, previousLessonId, UNITS } from "../lessons.js";
import { isLessonDone, loadProgress } from "../progress.js";

export function Home() {
  const [progress, setProgress] = useState(loadProgress);
  const [picked, setPicked] = useState(null);
  const list = lessonList();
  const currentId = list.find((lesson) => !isLessonDone(progress, lesson.id))?.id || list[list.length - 1].id;
  const pickedLesson = picked ? findLesson(picked) : null;
  const pickedLocked = pickedLesson ? !canOpen(progress, pickedLesson.id) : false;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[13px] font-medium text-secondary">Learn</p>
          <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.03em]">Your path</h1>
        </div>
        <dl className="flex gap-6 text-right">
          <div>
            <dt className="text-[12px] text-secondary">Streak</dt>
            <dd className="text-[20px] font-semibold">{progress.streak ? `${progress.streak} day${progress.streak === 1 ? "" : "s"}` : "—"}</dd>
          </div>
          <div>
            <dt className="text-[12px] text-secondary">XP</dt>
            <dd className="text-[20px] font-semibold">{progress.xp}</dd>
          </div>
        </dl>
      </div>
      <p className="mt-3 max-w-[36rem] text-[15px] leading-6 text-secondary">
        Each node is a short lesson. One prompt, then Check. Five hearts. A miss costs a heart, and they refill when you start again. Finish a lesson to open the next one.
      </p>

      <div className="relative mx-auto mt-10 max-w-[440px]">
        <div className="absolute top-6 bottom-6 left-1/2 w-px -translate-x-1/2 bg-[#D1D1D6]" aria-hidden="true" />
        <div className="relative space-y-10">
          {UNITS.map((unit, unitIndex) => (
            <section key={unit.id}>
              <div className={`${unitIndex % 2 ? "ml-10" : "mr-10"} rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)]`}>
                <p className="text-[12px] font-medium text-secondary">Unit {unitIndex + 1}</p>
                <h2 className="text-[18px] font-semibold tracking-[-0.02em]">{unit.title}</h2>
                <a href={unit.guide} className="mt-1 inline-block text-[13px] font-medium text-blue">
                  {unit.guideLabel}
                </a>
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
                          <span className="rounded-full bg-[#146C43] px-3 py-1 text-[12px] font-semibold text-white">Start</span>
                        ) : (
                          <span className="h-6" />
                        )}
                        <span
                          className={`grid h-[72px] w-[72px] place-items-center rounded-full text-[18px] font-semibold shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
                            done
                              ? "bg-[#146C43] text-white"
                              : current
                                ? "bg-white text-ink ring-4 ring-[#146C43]"
                                : "bg-[#E8E8ED] text-[#8E8E93]"
                          }`}
                        >
                          {done ? "✓" : locked ? "·" : lessonIndex + 1}
                        </span>
                        <span className={`text-center text-[13px] font-medium leading-4 ${locked ? "text-[#8E8E93]" : "text-ink"}`}>
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
          <div className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" role="dialog" aria-modal="true" aria-labelledby="start-title">
            <p className="text-[13px] font-medium text-secondary">{pickedLesson.unitTitle}</p>
            <h2 id="start-title" className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">
              {pickedLesson.title}
            </h2>
            <p className="mt-3 text-[15px] leading-6">{pickedLesson.tip}</p>
            <p className="mt-2 text-[13px] text-secondary">{pickedLesson.exercises.length} exercises · 5 hearts</p>
            <a
              href={`#/lesson/${pickedLesson.id}`}
              className="mt-5 flex h-12 items-center justify-center rounded-2xl bg-[#146C43] text-[16px] font-semibold text-white"
              onClick={() => setProgress(loadProgress())}
            >
              {isLessonDone(progress, pickedLesson.id) ? "Practice again" : "Start"}
            </a>
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
