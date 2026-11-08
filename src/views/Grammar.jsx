import { useEffect, useState } from "react";
import { DRILLS, analyze, makeTiles } from "../gloss.js";
import { LESSONS } from "../data.js";
import { useAccess, useQuietMotion } from "../access.jsx";
import { LessonPlayer } from "../components/Player.jsx";
import { Feedback, GraphicSlot, Pill, Prose, Sheet } from "../components/ui.jsx";

export function Grammar() {
  const [drillId, setDrillId] = useState(DRILLS[0].id);
  const drill = DRILLS.find((item) => item.id === drillId) || DRILLS[0];

  return (
    <div className="space-y-8">
      <header className="max-w-[42rem]">
        <p className="text-[13px] font-medium text-secondary">Module 3</p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Grammar, syntax, and markers</h1>
        <Prose className="mt-4">
          <p>
            A useful beginner order is time, then topic or location, then the comment. TOMORROW STORE YOU GO [q]. The brackets are the face: <span className="whitespace-nowrap">[q]</span> for yes/no, <span className="whitespace-nowrap">[wh-q]</span> for who, what, where, when, why, and how, <span className="whitespace-nowrap">[cond]</span> for an if-clause, <span className="whitespace-nowrap">[rhq]</span> for a rhetorical question, <span className="whitespace-nowrap">[nod]</span> for the release into the result.
          </p>
          <p>
            A condition keeps the eyebrows up through the if-clause, then a nod lets them drop for the result. A rhetorical WHY? replaces because: you ask, and you answer.
          </p>
        </Prose>
        <GraphicSlot id="grammar-desk" className="mt-6" />
      </header>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sentence">
        {DRILLS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === drill.id}
            onClick={() => setDrillId(item.id)}
            className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
              item.id === drill.id ? "bg-ink text-white" : "bg-surface text-ink shadow-soft"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <div className="space-y-4 lg:col-span-5">
          <SentenceStage drill={drill} />
          <details className="rounded-2xl bg-surface px-4 py-3 shadow-soft">
            <summary className="cursor-pointer text-[15px] font-medium">Filmed beginner lesson</summary>
            <div className="mt-3">
              <LessonPlayer lesson={LESSONS.one} />
              <p className="mt-2 text-[13px] leading-5 text-secondary">
                This film is ASL University Lesson 1. It is a reference screening, separate from the sentence builder.
              </p>
            </div>
          </details>
        </div>
        <div className="lg:col-span-7">
          <Builder key={drill.id} drill={drill} />
        </div>
      </section>
    </div>
  );
}

function SentenceStage({ drill }) {
  const { access } = useAccess();
  const quiet = useQuietMotion();
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = drill.stage[Math.min(step, drill.stage.length - 1)];

  useEffect(() => {
    setStep(0);
    setPlaying(false);
  }, [drill.id]);

  useEffect(() => {
    if (!playing || quiet) return undefined;
    const timer = window.setInterval(() => {
      setStep((value) => (value + 1) % drill.stage.length);
    }, 1100 / access.speed);
    return () => window.clearInterval(timer);
  }, [playing, quiet, access.speed, drill.stage.length]);

  return (
    <Sheet>
      <p className="font-serif text-[18px] leading-7">{drill.english}</p>
      <ol className="mt-4 flex flex-wrap gap-2" aria-label="Gloss in order">
        {drill.stage.map((item, index) => (
          <li key={item.gloss}>
            <button
              type="button"
              onClick={() => {
                setPlaying(false);
                setStep(index);
              }}
              className={`rounded-xl px-3 py-2 text-[14px] font-medium tracking-[0.04em] ${
                index === step ? "bg-ink text-white" : "bg-muted text-ink"
              }`}
            >
              {item.gloss}
            </button>
          </li>
        ))}
      </ol>
      <Marker current={current} lexical={access.lexical} />
      <p className="mt-3 text-[15px] leading-6">{current.hint}</p>
      {access.gaze ? (
        <p className="mt-2 text-[14px] leading-6 text-secondary">
          Watch the hands in the filmed lesson, and read the marker here as text. A soft gaze on the upper chest still catches the brows in peripheral vision.
        </p>
      ) : null}
      <div className="mt-4 flex gap-2">
        <Pill
          primary
          onClick={() => {
            if (quiet) {
              setStep((value) => (value + 1) % drill.stage.length);
              return;
            }
            setPlaying((value) => !value);
          }}
        >
          {quiet ? "Next sign" : playing ? "Pause" : "Play the gloss"}
        </Pill>
        <Pill
          onClick={() => {
            setPlaying(false);
            setStep(0);
          }}
        >
          Restart
        </Pill>
      </div>
    </Sheet>
  );
}

function Marker({ current, lexical }) {
  if (lexical && current.tag) {
    return (
      <div className="mt-4 rounded-2xl bg-muted px-4 py-4">
        <p className="text-[13px] font-medium text-secondary">Manual tag</p>
        <p className="mt-1 text-[28px] font-semibold tracking-[0.06em]">{current.tag}</p>
        <p className="mt-1 text-[14px] leading-6 text-secondary">
          Sign this with the hands. The standard face marker is still {current.gloss}. You can produce the tag when the eyebrows are too much to copy.
        </p>
      </div>
    );
  }
  if (!current.brows) return <div className="mt-4 h-2" />;
  return (
    <div className="mt-4 flex items-center gap-4">
      <Brows kind={current.brows} />
      <p className="text-[14px] leading-6 text-secondary">
        {current.brows === "up" && "Brows raised."}
        {current.brows === "down" && "Brows furrowed."}
        {current.brows === "nod" && "A nod. The brows return toward neutral."}
      </p>
    </div>
  );
}

function Brows({ kind }) {
  const brow = kind === "down" ? "M18 28c8 6 16 6 24 0M58 28c8 6 16 6 24 0" : "M18 30c8-8 16-8 24 0M58 30c8-8 16-8 24 0";
  return (
    <svg viewBox="0 0 100 84" className="h-16 w-20" aria-hidden="true">
      <circle cx="50" cy="42" r="36" fill="#F6F5F2" stroke="#1D1D1F" strokeWidth="2" />
      <path d={brow} fill="none" stroke="#1D1D1F" strokeWidth="2.4" strokeLinecap="round" />
      {kind === "nod" ? (
        <path d="M38 58h24" stroke="#007AFF" strokeWidth="2.4" strokeLinecap="round" />
      ) : null}
    </svg>
  );
}

function Builder({ drill }) {
  const tiles = makeTiles(drill);
  const [used, setUsed] = useState([]);
  const [result, setResult] = useState(null);
  const placed = used.map((id) => tiles.find((tile) => tile.id === id)).filter(Boolean);

  const add = (id) => {
    setUsed((current) => (current.includes(id) ? current : [...current, id]));
    setResult(null);
  };
  const remove = (id) => {
    setUsed((current) => current.filter((item) => item !== id));
    setResult(null);
  };

  return (
    <Sheet>
      <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Gloss builder</h2>
      <p className="mt-2 font-serif text-[17px] leading-7">{drill.english}</p>
      <p className="mt-2 text-[14px] leading-6 text-secondary">
        Click signs in the order you would produce them. A few tiles are English words that do not belong in the gloss. Drag works too.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tiles.map((tile) => {
          const spent = used.includes(tile.id);
          return (
            <button
              key={tile.id}
              type="button"
              draggable={!spent}
              disabled={spent}
              onDragStart={(event) => {
                event.dataTransfer.setData("text/plain", tile.id);
                event.dataTransfer.effectAllowed = "copy";
              }}
              onClick={() => add(tile.id)}
              className={`rounded-full px-3 py-1.5 text-[14px] font-medium tracking-[0.03em] ${
                spent ? "bg-muted text-secondary" : "bg-muted text-ink hover:bg-line"
              }`}
            >
              {tile.label}
            </button>
          );
        })}
      </div>
      <div
        className="mt-4 min-h-24 rounded-2xl border border-dashed border-line bg-muted p-3"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const id = event.dataTransfer.getData("text/plain");
          if (id) add(id);
        }}
      >
        <p className="text-[12px] font-medium tracking-[0.04em] text-secondary">YOUR GLOSS</p>
        {placed.length === 0 ? (
          <p className="mt-3 text-[15px] text-secondary">The line is empty.</p>
        ) : (
          <ol className="mt-3 flex flex-wrap gap-2">
            {placed.map((tile) => (
              <li key={tile.id}>
                <button
                  type="button"
                  onClick={() => remove(tile.id)}
                  className="rounded-full bg-surface px-3 py-1.5 text-[14px] font-medium tracking-[0.03em] shadow-soft"
                >
                  {tile.label}
                  <span className="sr-only">, remove</span>
                </button>
              </li>
            ))}
          </ol>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <Pill
          primary
          onClick={() => setResult(analyze(placed.map((tile) => tile.label).join(" "), drill.id))}
        >
          Check this order
        </Pill>
        <Pill
          onClick={() => {
            setUsed([]);
            setResult(null);
          }}
        >
          Clear
        </Pill>
      </div>
      <Feedback result={result} />
      <p className="mt-4 text-[14px] leading-6 text-secondary">
        Model for study: <span className="font-medium tracking-[0.03em] text-ink">{drill.model}</span>
      </p>
    </Sheet>
  );
}
