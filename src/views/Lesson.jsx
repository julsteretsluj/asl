import { useEffect, useMemo, useRef, useState } from "react";
import { useAccess } from "../access.jsx";
import { HandDiagram } from "../components/Hand.jsx";
import { gradeAttempt } from "../lessons.js";
import { awardLesson } from "../progress.js";

const HEARTS = 5;

function shuffle(list, seed) {
  const copy = [...list];
  let state = seed + 17;
  for (let index = copy.length - 1; index > 0; index -= 1) {
    state = (state * 9301 + 49297) % 233280;
    const swap = state % (index + 1);
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function Lesson({ lesson, onExit }) {
  const { setOpen } = useAccess();
  const [index, setIndex] = useState(0);
  const [hearts, setHearts] = useState(HEARTS);
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("ask");
  const [grade, setGrade] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const exercise = lesson.exercises[index];
  const ready = isReady(exercise, attempt);
  const busy = useRef(false);

  useEffect(() => {
    setAttempt(null);
    setGrade(null);
    setPhase("ask");
    busy.current = false;
  }, [index]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key !== "Enter" || event.repeat || leaving) return;
      if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLButtonElement) return;
      if (phase === "ask" && ready) check();
      if (phase === "feedback") advance();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (exercise?.type === "match" && attempt === "done" && phase === "ask") check();
  });

  function check() {
    const payload = exercise.type === "bank" ? (attempt || []).map((tile) => tile.label) : attempt;
    const result = gradeAttempt(exercise, payload);
    if (!result.ok) setHearts((value) => Math.max(0, value - 1));
    setGrade(result);
    setPhase("feedback");
  }

  function advance() {
    if (busy.current) return;
    busy.current = true;
    const correct = Boolean(grade?.ok);
    const nextResults = [...results, correct];
    if (!correct && hearts === 0) {
      setResults(nextResults);
      setPhase("hearts");
      return;
    }
    if (index + 1 >= lesson.exercises.length) {
      const score = nextResults.filter(Boolean).length;
      setResults(nextResults);
      setSummary(awardLesson(lesson.id, { correct: score, total: lesson.exercises.length }));
      setPhase("done");
      return;
    }
    setResults(nextResults);
    setAttempt(null);
    setGrade(null);
    setPhase("ask");
    setIndex((value) => value + 1);
  }

  if (phase === "done" && summary) {
    return (
      <Complete
        lesson={lesson}
        summary={summary}
        correct={results.filter(Boolean).length}
        total={lesson.exercises.length}
        onExit={onExit}
      />
    );
  }

  if (phase === "hearts") {
    return (
      <HeartsOut
        correct={results.filter(Boolean).length}
        total={results.length}
        onRetry={() => {
          setIndex(0);
          setHearts(HEARTS);
          setResults([]);
          setSummary(null);
          setAttempt(null);
          setGrade(null);
          setPhase("ask");
          busy.current = false;
        }}
        onExit={onExit}
      />
    );
  }

  const footerTone = phase === "feedback" ? (grade?.ok ? "ok" : "bad") : "idle";

  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-10 bg-canvas/95 px-4 py-3 backdrop-blur sm:px-6">
        <div className="mx-auto flex max-w-[640px] items-center gap-3">
          <button
            type="button"
            onClick={() => setLeaving(true)}
            className="grid h-10 w-10 place-items-center rounded-full text-[20px] text-secondary hover:bg-white"
            aria-label="Leave lesson"
          >
            ×
          </button>
          <div
            className="h-3 flex-1 overflow-hidden rounded-full bg-[#E5E5EA]"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={lesson.exercises.length}
            aria-valuenow={index}
            aria-label="Lesson progress"
          >
            <div
              className="h-full rounded-full bg-[#146C43]"
              style={{ width: `${(index / lesson.exercises.length) * 100}%` }}
            />
          </div>
          <p className="text-[13px] font-medium text-secondary" aria-label={`${hearts} of ${HEARTS} hearts`}>
            <Hearts count={hearts} />
          </p>
          <button type="button" onClick={() => setOpen(true)} className="text-[13px] font-medium text-blue">
            Access
          </button>
        </div>
      </header>

      <main id="content" className="mx-auto w-full max-w-[640px] flex-1 px-5 py-6 sm:px-6">
        <Exercise
          key={index}
          exercise={exercise}
          attempt={attempt}
          setAttempt={setAttempt}
          revealed={phase === "feedback"}
          correctId={grade?.correct}
        />
      </main>

      <footer
        className={`sticky bottom-0 border-t px-5 py-4 sm:px-6 ${
          footerTone === "ok" ? "border-[#146C43]/20 bg-[#E7F6EE]" : footerTone === "bad" ? "border-[#7A271A]/15 bg-[#FDEEEC]" : "border-black/5 bg-canvas"
        }`}
      >
        <div className="mx-auto max-w-[640px]" aria-live="polite">
          {phase === "feedback" && grade ? (
            <>
              <p className={`text-[20px] font-semibold ${grade.ok ? "text-[#146C43]" : "text-[#7A271A]"}`}>
                {grade.ok ? "Correct" : "Correct answer"}
              </p>
              <p className="mt-1 text-[15px] leading-6 text-ink">
                {grade.ok ? grade.detail : grade.correct ? `${grade.correct}. ${grade.detail}` : grade.detail}
              </p>
              <button
                type="button"
                onClick={advance}
                className={`mt-4 h-12 w-full rounded-2xl text-[16px] font-semibold text-white ${
                  grade.ok ? "bg-[#146C43]" : "bg-[#7A271A]"
                }`}
              >
                Continue
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!ready}
              onClick={check}
              className={`h-12 w-full rounded-2xl text-[16px] font-semibold ${
                ready ? "bg-[#146C43] text-white" : "bg-[#E5E5EA] text-[#8E8E93]"
              }`}
            >
              Check
            </button>
          )}
        </div>
      </footer>

      {leaving ? (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/20 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)]" role="dialog" aria-modal="true" aria-labelledby="leave-title">
            <h2 id="leave-title" className="text-[20px] font-semibold tracking-[-0.02em]">
              Leave this lesson?
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-secondary">
              This attempt ends. Hearts and the bar reset. Finished lessons stay on the path.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button type="button" onClick={() => setLeaving(false)} className="h-11 rounded-2xl bg-blue text-[15px] font-semibold text-white">
                Keep going
              </button>
              <button type="button" onClick={onExit} className="h-11 rounded-2xl text-[15px] font-medium text-secondary">
                Leave
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function isReady(exercise, attempt) {
  if (!exercise) return false;
  if (exercise.type === "choice" || exercise.type === "blank") return Boolean(attempt);
  if (exercise.type === "bank") return Array.isArray(attempt) && attempt.length > 0;
  if (exercise.type === "type") return typeof attempt === "string" && attempt.trim().length > 0;
  if (exercise.type === "match") return attempt === "done";
  return false;
}

function Hearts({ count }) {
  return (
    <span className="tracking-[0.15em]">
      {Array.from({ length: HEARTS }, (_, index) => (
        <span key={index} className={index < count ? "text-[#C43B3B]" : "text-[#E5E5EA]"}>
          ♥
        </span>
      ))}
    </span>
  );
}

function Exercise({ exercise, attempt, setAttempt, revealed, correctId }) {
  return (
    <div>
      {exercise.letter ? (
        <div className="mx-auto mb-4 h-[180px] w-[150px]">
          <HandDiagram letter={exercise.letter} quiet />
        </div>
      ) : null}
      <h1 className="text-[26px] font-semibold leading-8 tracking-[-0.03em]">{exercise.prompt}</h1>
      <div className="mt-6">
        {exercise.type === "choice" ? (
          <Choice exercise={exercise} attempt={attempt} setAttempt={setAttempt} revealed={revealed} correctId={correctId} />
        ) : null}
        {exercise.type === "blank" ? (
          <Blank exercise={exercise} attempt={attempt} setAttempt={setAttempt} revealed={revealed} correctId={correctId} />
        ) : null}
        {exercise.type === "bank" ? (
          <Bank exercise={exercise} attempt={attempt || []} setAttempt={setAttempt} />
        ) : null}
        {exercise.type === "type" ? (
          <TypeAnswer attempt={attempt || ""} setAttempt={setAttempt} revealed={revealed} />
        ) : null}
        {exercise.type === "match" ? <Match exercise={exercise} setAttempt={setAttempt} revealed={revealed} /> : null}
      </div>
    </div>
  );
}

function Choice({ exercise, attempt, setAttempt, revealed, correctId }) {
  const options = useMemo(() => shuffle(exercise.options, exercise.prompt.length), [exercise]);
  return (
    <div className="space-y-3" role="radiogroup" aria-label="Answers">
      {options.map((option) => {
        const selected = attempt === option.id;
        const showRight = revealed && option.id === correctId;
        const showWrong = revealed && selected && option.id !== correctId;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={revealed}
            onClick={() => setAttempt(option.id)}
            className={`w-full rounded-2xl border px-4 py-4 text-left text-[17px] font-medium ${
              showRight
                ? "border-[#146C43] bg-[#E7F6EE]"
                : showWrong
                  ? "border-[#7A271A] bg-[#FDEEEC]"
                  : selected
                    ? "border-blue bg-[#F3F8FF]"
                    : "border-line bg-white"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

function Blank({ exercise, attempt, setAttempt, revealed, correctId }) {
  return (
    <div>
      <p className="text-[20px] font-medium tracking-[0.03em]">
        {exercise.before ? <span>{exercise.before} </span> : null}
        <span className="inline-block min-w-16 border-b-2 border-ink px-2 text-blue">{attempt || " "}</span>
        {exercise.after ? <span> {exercise.after}</span> : null}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {exercise.options.map((option) => {
          const selected = attempt === option;
          const showRight = revealed && option === correctId;
          return (
            <button
              key={option}
              type="button"
              disabled={revealed}
              onClick={() => setAttempt(option)}
              className={`rounded-full px-4 py-2 text-[15px] font-medium ${
                showRight ? "bg-[#146C43] text-white" : selected ? "bg-ink text-white" : "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Bank({ exercise, attempt, setAttempt }) {
  const tiles = useMemo(
    () => shuffle(exercise.tiles.map((label, index) => ({ id: `${index}-${label}`, label })), exercise.prompt.length),
    [exercise],
  );
  const used = new Set(attempt.map((item) => item.id));
  const add = (tile) => {
    if (used.has(tile.id)) return;
    setAttempt([...attempt, tile]);
  };
  const remove = (id) => setAttempt(attempt.filter((item) => item.id !== id));
  return (
    <div>
      <div className="min-h-24 rounded-2xl border border-dashed border-line bg-white p-3">
        {attempt.length === 0 ? (
          <p className="text-[15px] text-secondary">Tap the signs in order.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attempt.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => remove(tile.id)}
                className="rounded-xl border border-line bg-[#F7F7FA] px-3 py-2 text-[15px] font-medium tracking-[0.03em]"
              >
                {tile.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            type="button"
            disabled={used.has(tile.id)}
            onClick={() => add(tile)}
            className={`rounded-xl px-3 py-2 text-[15px] font-medium tracking-[0.03em] ${
              used.has(tile.id) ? "bg-transparent text-[#D1D1D6]" : "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
            }`}
          >
            {tile.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TypeAnswer({ attempt, setAttempt, revealed }) {
  return (
    <textarea
      value={attempt}
      onChange={(event) => setAttempt(event.target.value)}
      disabled={revealed}
      spellCheck={false}
      aria-label="ASL gloss"
      placeholder="Type the gloss"
      className="min-h-32 w-full rounded-2xl border border-line bg-white px-4 py-3 text-[18px] tracking-[0.04em]"
    />
  );
}

function Match({ exercise, setAttempt, revealed }) {
  const left = useMemo(() => shuffle(exercise.pairs, 3), [exercise]);
  const right = useMemo(() => shuffle(exercise.pairs, 11), [exercise]);
  const [picked, setPicked] = useState(null);
  const [gone, setGone] = useState([]);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (gone.length === exercise.pairs.length) setAttempt("done");
  }, [gone.length, exercise.pairs.length, setAttempt]);

  function tap(side, id) {
    if (revealed || gone.includes(id)) return;
    if (!picked) {
      setPicked({ side, id });
      return;
    }
    if (picked.side === side) {
      setPicked({ side, id });
      return;
    }
    if (picked.id === id) {
      setGone((current) => [...current, id]);
      setPicked(null);
      return;
    }
    setShake(true);
    setPicked(null);
    window.setTimeout(() => setShake(false), 180);
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${shake ? "shake" : ""}`}>
      {[
        ["a", left],
        ["b", right],
      ].map(([side, column]) => (
        <div key={side} className="space-y-3">
          {column.map((pair) => {
            const hidden = gone.includes(pair.id);
            const selected = picked?.side === side && picked.id === pair.id;
            return (
              <button
                key={pair.id}
                type="button"
                disabled={hidden || revealed}
                onClick={() => tap(side, pair.id)}
                className={`h-14 w-full rounded-2xl border text-[15px] font-medium ${
                  hidden ? "border-transparent bg-transparent text-transparent" : selected ? "border-blue bg-[#F3F8FF]" : "border-line bg-white"
                }`}
              >
                {side === "a" ? pair.a : pair.b}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function Complete({ lesson, summary, correct, total, onExit }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center text-ink">
      <p className="text-[13px] font-medium text-secondary">{lesson.unitTitle}</p>
      <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Lesson complete</h1>
      <p className="mt-3 text-[18px]">{lesson.title}</p>
      <dl className="mt-8 grid w-full max-w-sm grid-cols-3 gap-3 text-center">
        <Stat label="Correct" value={`${correct}/${total}`} />
        <Stat label="XP" value={`+${summary.xpGain}`} />
        <Stat label="Streak" value={`${summary.streak}`} />
      </dl>
      <p className="mt-6 max-w-sm text-[15px] leading-6 text-secondary">
        {summary.perfect
          ? "Every exercise held. The next lesson on the path is open."
          : "Misses stay in the score. The next lesson is open anyway. Replay this one whenever you want the pattern again."}
      </p>
      <button type="button" onClick={onExit} className="mt-8 h-12 w-full max-w-sm rounded-2xl bg-[#146C43] text-[16px] font-semibold text-white">
        Continue
      </button>
    </div>
  );
}

function HeartsOut({ correct, total, onRetry, onExit }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center text-ink">
      <h1 className="text-[34px] font-semibold tracking-[-0.03em]">No hearts left</h1>
      <p className="mt-3 max-w-sm text-[16px] leading-7 text-secondary">
        This attempt stops at {correct} correct of {total} so far. Hearts refill as soon as you start the lesson again. There is no wait.
      </p>
      <button type="button" onClick={onRetry} className="mt-8 h-12 w-full max-w-sm rounded-2xl bg-[#146C43] text-[16px] font-semibold text-white">
        Try the lesson again
      </button>
      <button type="button" onClick={onExit} className="mt-3 h-12 w-full max-w-sm rounded-2xl text-[16px] font-medium text-secondary">
        Back to the path
      </button>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-white px-2 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <dt className="text-[12px] text-secondary">{label}</dt>
      <dd className="mt-1 text-[20px] font-semibold">{value}</dd>
    </div>
  );
}
