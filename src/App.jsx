import { useEffect, useId, useRef, useState } from "react";
import { AccessProvider, useAccess } from "./access.jsx";
import { findLesson, previousLessonId } from "./lessons.js";
import { isLessonDone, loadProgress } from "./progress.js";
import { Basics } from "./views/Basics.jsx";
import { Grammar } from "./views/Grammar.jsx";
import { Guide } from "./views/Guide.jsx";
import { Home } from "./views/Home.jsx";
import { Lesson } from "./views/Lesson.jsx";
import { Practice } from "./views/Practice.jsx";
import { Space } from "./views/Space.jsx";
import { Vocabulary } from "./views/Vocabulary.jsx";

const ROUTES = [
  { id: "home", label: "Learn", href: "#/" },
  { id: "guide", label: "Guide", href: "#/guide" },
];

const VIEWS = {
  home: Home,
  guide: Guide,
  basics: Basics,
  vocab: Vocabulary,
  grammar: Grammar,
  space: Space,
  practice: Practice,
};

const GUIDE_ROUTES = new Set(["guide", "basics", "vocab", "grammar", "space", "practice"]);

function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("lesson/")) return { name: "lesson", lessonId: decodeURIComponent(hash.slice("lesson/".length)) };
  const page = hash.split("/")[0];
  if (VIEWS[page]) return { name: page, lessonId: "" };
  return { name: "home", lessonId: "" };
}

export default function App() {
  return (
    <AccessProvider>
      <Shell />
    </AccessProvider>
  );
}

function Shell() {
  const [route, setRoute] = useState(readRoute);
  const { access, setOpen } = useAccess();

  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (route.name === "lesson") {
    const lesson = findLesson(route.lessonId);
    const previous = lesson ? previousLessonId(lesson.id) : null;
    const locked = Boolean(previous && !isLessonDone(loadProgress(), previous));
    return (
      <div className="min-h-screen bg-canvas text-ink">
        {lesson && !locked ? (
          <Lesson lesson={lesson} onExit={() => { window.location.hash = "#/"; }} />
        ) : (
          <main id="content" className="mx-auto max-w-[40rem] px-5 py-16">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em]">
              {locked ? "Finish the lesson before this one." : "That lesson is not on the path."}
            </h1>
            <a href="#/" className="mt-4 inline-block font-medium text-blue">Back to the path</a>
          </main>
        )}
        <AccessDrawer />
      </div>
    );
  }

  const View = VIEWS[route.name];
  const status = [
    access.speed !== 1 ? `${access.speed}×` : "",
    access.lexical ? "manual cues" : "",
    access.gaze ? "soft gaze" : "",
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header className="sticky top-0 z-20 border-b border-black/5 bg-canvas/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
          <a href="#/" className="mr-auto flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-blue text-[13px] font-semibold text-white">
              Ss
            </span>
            <span>
              <span className="block text-[15px] font-semibold leading-5 tracking-[-0.02em]">SignSpace</span>
              <span className="block text-[12px] leading-4 text-secondary">Inclusive ASL Academy</span>
            </span>
          </a>
          <nav className="order-3 flex w-full flex-wrap gap-1 sm:order-none sm:w-auto sm:flex-nowrap" aria-label="Modules">
            {ROUTES.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={
                  item.id === "home"
                    ? route.name === "home" ? "page" : undefined
                    : GUIDE_ROUTES.has(route.name) ? "page" : undefined
                }
                className={`rounded-full px-3 py-1.5 text-[14px] font-medium whitespace-nowrap ${
                  (item.id === "home" ? route.name === "home" : GUIDE_ROUTES.has(route.name))
                    ? "bg-white text-ink shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                    : "text-secondary"
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full border border-line bg-white px-3 py-1.5 text-[14px] font-medium hover:bg-[#f7f7fa]"
          >
            Access{status.length ? ` · ${status.join(" · ")}` : ""}
          </button>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-[1120px] px-5 pt-8 pb-20 sm:px-8">
        <View />
      </main>
      <footer className="border-t border-black/5">
        <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8">
          <p className="max-w-[44rem] text-[13px] leading-6 text-secondary">
            SignSpace is a study desk for classroom ASL gloss. It sits beside Deaf-led teaching. Filmed lessons are Dr. Bill Vicars, ASL University, played from YouTube. Sign pages open on Lifeprint. The hand diagrams here are original schematics, so check a filmed model before you treat a letter as settled. Regional signs vary.
          </p>
        </div>
      </footer>
      <AccessDrawer />
    </div>
  );
}

function AccessDrawer() {
  const { access, patch, open, setOpen } = useAccess();
  const titleId = useId();
  const closeRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const previouslyFocused = document.activeElement;
    closeRef.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll("button, a, input");
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button
        type="button"
        aria-label="Close access settings"
        className="absolute inset-0 bg-black/20"
        onClick={() => setOpen(false)}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-white px-6 py-6 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[13px] font-medium text-secondary">Access</p>
            <h2 id={titleId} className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">
              Study settings
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-full border border-line px-3 py-1.5 text-[14px] font-medium"
          >
            Close
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <Switch
            on={access.lexical}
            onToggle={() => patch({ lexical: !access.lexical })}
            label="Lexical and manual tone cues"
            detail="Show a hand tag — QUESTION, IF, WHY, or the emotion sign — beside the facial marker. Size, speed, and a crisp handshape can carry urgency when you would rather not mirror a face."
          />
          <fieldset>
            <legend className="text-[15px] font-medium">Playback and step speed</legend>
            <p className="mt-1 text-[14px] leading-6 text-secondary">
              0.5× and 0.75× slow the gloss player, fingerspelling steps, verb paths, and the YouTube lesson when the player accepts the rate.
            </p>
            <div className="mt-3 flex gap-2" role="radiogroup" aria-label="Playback speed">
              {[0.5, 0.75, 1].map((speed) => (
                <button
                  key={speed}
                  type="button"
                  role="radio"
                  aria-checked={access.speed === speed}
                  onClick={() => patch({ speed })}
                  className={`rounded-full px-4 py-2 text-[14px] font-medium ${
                    access.speed === speed ? "bg-blue text-white" : "bg-[#f2f2f7] text-ink"
                  }`}
                >
                  {speed === 1 ? "1×" : `${speed}×`}
                </button>
              ))}
            </div>
          </fieldset>
          <Switch
            on={access.gaze}
            onToggle={() => patch({ gaze: !access.gaze })}
            label="Soft-gaze notes"
            detail="Rest your eyes on the hands, the upper chest, or the near shoulder. Keep the signer inside your view. Direct eye contact is a choice, and it is separate from actually watching the language."
          />
          <Switch
            on={access.largeText}
            onToggle={() => patch({ largeText: !access.largeText })}
            label="Larger text"
            detail="Raises the base type size across the academy."
          />
          <Switch
            on={access.reduceMotion}
            onToggle={() => patch({ reduceMotion: !access.reduceMotion })}
            label="Reduce motion"
            detail="Stops autoplay of gloss steps and verb paths. You move them yourself. The system reduced-motion setting is honored either way."
          />
          <p className="text-[14px] leading-6 text-secondary">
            Sarcasm has no single universal sign. If a group needs that tone in the hands, fingerspell S-A-R-C-A-S-M or agree on a cue you both recognize. QUESTION and SAD already have citation signs.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Switch({ on, onToggle, label, detail }) {
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-[15px] font-medium">{label}</span>
        <span className={`relative h-7 w-12 shrink-0 rounded-full ${on ? "bg-blue" : "bg-[#e5e5ea]"}`}>
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow ${on ? "left-5" : "left-0.5"}`} />
        </span>
      </button>
      <p className="mt-2 text-[14px] leading-6 text-secondary">{detail}</p>
    </div>
  );
}
