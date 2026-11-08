import { useEffect, useMemo, useRef, useState } from "react";
import { useAccess } from "../access.jsx";
import { HandDiagram } from "../components/Hand.jsx";
import { ArrowRight, Check, Clock3, Icon, Settings2, Sparkles, X } from "../components/icons.jsx";
import { BuyHeartsPacks } from "../components/BuyHearts.jsx";
import { GraphicSlot, HeartGlyphs } from "../components/ui.jsx";
import { exercisesForVariant, gradeAttempt, shuffleExercises } from "../lessons.js";
import { HEART_RESTORE_MS, lessonVariantIndex, nextHeartLabel } from "../progress.js";
import { useProgress } from "../progress-state.jsx";

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

function startDeck(lesson, variantIndex) {
  const variant = exercisesForVariant(lesson, variantIndex);
  return {
    variantIndex,
    variantExercises: variant,
    deck: shuffleExercises(variant),
  };
}

export function Lesson({ lesson, onExit }) {
  const { setOpen } = useAccess();
  const { progress, spendHeart, refreshHearts, recordExercise, finishLesson, rotateLessonVariant } = useProgress();
  // Bootstrap once on mount: pick persisted variant, then shuffle that list for this attempt only.
  const [variantIndex, setVariantIndex] = useState(() => lessonVariantIndex(progress, lesson.id));
  const [variantExercises, setVariantExercises] = useState(() => exercisesForVariant(lesson, lessonVariantIndex(progress, lesson.id)));
  const [deck, setDeck] = useState(() => shuffleExercises(exercisesForVariant(lesson, lessonVariantIndex(progress, lesson.id))));
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState([]);
  const [phase, setPhase] = useState("ask");
  const [grade, setGrade] = useState(null);
  const [summary, setSummary] = useState(null);
  const [leaving, setLeaving] = useState(false);
  const [attempt, setAttempt] = useState(null);
  const hearts = progress.hearts;
  const exercise = deck[index];
  const ready = isReady(exercise, attempt);
  const busy = useRef(false);
  const checked = useRef(false);
  const rotatedOnFail = useRef(false);
  const trackingLesson = useMemo(
    () => ({ ...lesson, exercises: deck, variantExercises }),
    [lesson, deck, variantExercises],
  );

  function beginAttempt(nextVariantIndex) {
    const started = startDeck(lesson, nextVariantIndex);
    setVariantIndex(started.variantIndex);
    setVariantExercises(started.variantExercises);
    setDeck(started.deck);
    setIndex(0);
    setResults([]);
    setSummary(null);
    setAttempt(null);
    setGrade(null);
    setPhase("ask");
    busy.current = false;
    checked.current = false;
    rotatedOnFail.current = false;
  }

  useEffect(() => {
    setAttempt(null);
    setGrade(null);
    setPhase("ask");
    busy.current = false;
    checked.current = false;
  }, [index]);

  useEffect(() => {
    if (phase !== "ask" || hearts > 0) return;
    setPhase("hearts");
  }, [phase, hearts]);

  useEffect(() => {
    if (phase !== "hearts" || rotatedOnFail.current) return;
    rotatedOnFail.current = true;
    rotateLessonVariant(lesson);
  }, [phase, lesson, rotateLessonVariant]);

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
    if (checked.current || phase !== "ask") return;
    if (hearts <= 0) {
      setPhase("hearts");
      return;
    }
    checked.current = true;
    const payload = exercise.type === "bank" ? (attempt || []).map((tile) => tile.label) : attempt;
    const result = gradeAttempt(exercise, payload);
    recordExercise(trackingLesson, exercise, result.ok);
    if (!result.ok) spendHeart();
    setGrade(result);
    setPhase("feedback");
  }

  function advance() {
    if (busy.current) return;
    busy.current = true;
    const correct = Boolean(grade?.ok);
    const nextResults = [...results, correct];
    if (!correct && progress.hearts <= 0) {
      setResults(nextResults);
      setPhase("hearts");
      return;
    }
    if (index + 1 >= deck.length) {
      const score = nextResults.filter(Boolean).length;
      setResults(nextResults);
      setSummary(finishLesson(lesson.id, { correct: score, total: deck.length }, lesson));
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
        total={deck.length}
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
          const next = refreshHearts();
          if ((next?.hearts ?? 0) <= 0) return;
          beginAttempt(lessonVariantIndex(next, lesson.id));
        }}
        onExit={onExit}
        refreshHearts={refreshHearts}
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
            className="grid h-10 w-10 place-items-center rounded-full text-secondary hover:bg-surface"
            aria-label="Leave lesson"
          >
            <Icon as={X} size="md" />
          </button>
          <div
            className="h-3 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={deck.length}
            aria-valuenow={index}
            aria-label="Lesson progress"
          >
            <div
              className="h-full rounded-full bg-success"
              style={{ width: `${(index / deck.length) * 100}%` }}
            />
          </div>
          <p className="text-[13px] font-medium text-secondary">
            <HeartGlyphs count={hearts} />
          </p>
          <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-1 text-[13px] font-medium text-blue">
            <Icon as={Settings2} size="xs" />
            Access
          </button>
        </div>
      </header>

      <main id="content" className="mx-auto w-full max-w-[640px] flex-1 px-5 py-6 sm:px-6">
        <Exercise
          key={`${variantIndex}-${index}-${exercise?.prompt || index}`}
          exercise={exercise}
          attempt={attempt}
          setAttempt={setAttempt}
          revealed={phase === "feedback"}
          correctId={grade?.correct}
        />
      </main>

      <footer
        className={`sticky bottom-0 border-t px-5 py-4 sm:px-6 ${
          footerTone === "ok" ? "border-success/20 bg-success-soft" : footerTone === "bad" ? "border-danger/15 bg-danger-soft" : "border-line bg-canvas"
        }`}
      >
        <div className="mx-auto max-w-[640px]" aria-live="polite">
          {phase === "feedback" && grade ? (
            <>
              <p className={`text-[20px] font-semibold ${grade.ok ? "text-success" : "text-danger"}`}>
                {grade.ok ? "Correct" : "Correct answer"}
              </p>
              <p className="mt-1 text-[15px] leading-6 text-ink">
                {grade.ok ? grade.detail : grade.correct ? `${grade.correct}. ${grade.detail}` : grade.detail}
              </p>
              <button
                type="button"
                onClick={advance}
                className={`mt-4 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold text-white ${
                  grade.ok ? "bg-success" : "bg-danger"
                }`}
              >
                Continue
                <Icon as={ArrowRight} size="sm" className="text-white" />
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={!ready}
              onClick={check}
              className={`inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-semibold ${
                ready ? "bg-success text-white" : "bg-muted text-secondary"
              }`}
            >
              <Icon as={Check} size="sm" className={ready ? "text-white" : "text-secondary"} />
              Check
            </button>
          )}
        </div>
      </footer>

      {leaving ? (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/20 p-4 sm:items-center">
          <div className="w-full max-w-sm rounded-2xl bg-surface p-5 shadow-soft" role="dialog" aria-modal="true" aria-labelledby="leave-title">
            <h2 id="leave-title" className="text-[20px] font-semibold tracking-[-0.02em]">
              Leave this lesson?
            </h2>
            <p className="mt-2 text-[15px] leading-6 text-secondary">
              This attempt ends and the bar resets. Spent hearts stay spent until they restore on the timer. Finished lessons stay on the path.
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
                ? "border-success bg-success-soft"
                : showWrong
                  ? "border-danger bg-danger-soft"
                  : selected
                    ? "border-blue bg-select-soft"
                    : "border-line bg-surface"
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
                showRight ? "bg-success text-white" : selected ? "bg-ink text-white" : "bg-surface text-ink shadow-soft"
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
      <div className="min-h-24 rounded-2xl border border-dashed border-line bg-surface p-3">
        {attempt.length === 0 ? (
          <p className="text-[15px] text-secondary">Tap the signs in order.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {attempt.map((tile) => (
              <button
                key={tile.id}
                type="button"
                onClick={() => remove(tile.id)}
                className="rounded-xl border border-line bg-muted px-3 py-2 text-[15px] font-medium tracking-[0.03em]"
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
              used.has(tile.id) ? "bg-transparent text-line" : "bg-surface text-ink shadow-soft"
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
      className="min-h-32 w-full rounded-2xl border border-line bg-surface px-4 py-3 text-[18px] tracking-[0.04em]"
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
                  hidden ? "border-transparent bg-transparent text-transparent" : selected ? "border-blue bg-select-soft" : "border-line bg-surface"
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
      <Icon as={Sparkles} size="xl" className="text-success" />
      <p className="mt-3 text-[13px] font-medium text-secondary">{lesson.unitTitle}</p>
      <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Lesson complete</h1>
      <p className="mt-3 text-[18px]">{lesson.title}</p>
      <GraphicSlot id="lesson-complete" className="mt-6 w-full max-w-sm" />
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
      <button
        type="button"
        onClick={onExit}
        className="mt-8 inline-flex h-12 w-full max-w-sm items-center justify-center gap-2 rounded-2xl bg-success text-[16px] font-semibold text-white"
      >
        Continue
        <Icon as={ArrowRight} size="sm" className="text-white" />
      </button>
    </div>
  );
}

function HeartsOut({ correct, total, onRetry, onExit, refreshHearts }) {
  const { progress } = useProgress();
  const [now, setNow] = useState(() => Date.now());
  const label = nextHeartLabel(progress, now);
  const canRetry = progress.hearts > 0;

  useEffect(() => {
    const id = window.setInterval(() => {
      setNow(Date.now());
      refreshHearts();
    }, 1000);
    return () => window.clearInterval(id);
  }, [refreshHearts]);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas px-6 text-center text-ink">
      <HeartGlyphs count={progress.hearts} size={28} />
      <h1 className="mt-4 text-[34px] font-semibold tracking-[-0.03em]">No hearts left</h1>
      <GraphicSlot id="hearts-out" className="mt-5 w-full max-w-sm" />
      <p className="mt-3 max-w-sm text-[16px] leading-7 text-secondary">
        This attempt stops at {correct} correct of {total} so far. One heart returns every{" "}
        {HEART_RESTORE_MS / 60000} minutes, or spend XP below — no real money.
      </p>
      {label ? (
        <p className="mt-4 inline-flex items-center gap-1.5 text-[18px] font-semibold tabular-nums text-ink" aria-live="polite">
          <Icon as={Clock3} size="sm" className="text-secondary" />
          {label}
        </p>
      ) : null}

      <div className="mt-6 w-full max-w-sm rounded-[16px] border border-line bg-surface p-4 shadow-soft">
        <p className="text-[13px] font-medium text-secondary">{progress.xp} XP available</p>
        <BuyHeartsPacks className="mt-3" />
      </div>

      {canRetry ? (
        <button type="button" onClick={onRetry} className="mt-8 h-12 w-full max-w-sm rounded-2xl bg-success text-[16px] font-semibold text-white">
          Try the lesson again
        </button>
      ) : (
        <button type="button" onClick={onExit} className="mt-8 h-12 w-full max-w-sm rounded-2xl bg-blue text-[16px] font-semibold text-white">
          Back to the path
        </button>
      )}
      {canRetry ? (
        <button type="button" onClick={onExit} className="mt-3 h-12 w-full max-w-sm rounded-2xl text-[16px] font-medium text-secondary">
          Back to the path
        </button>
      ) : null}
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-surface px-2 py-4 shadow-soft">
      <dt className="text-[12px] text-secondary">{label}</dt>
      <dd className="mt-1 text-[20px] font-semibold">{value}</dd>
    </div>
  );
}
