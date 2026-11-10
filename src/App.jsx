import { useEffect, useId, useRef, useState } from "react";
import { AccessProvider, useAccess } from "./access.jsx";
import { AccountProvider, useAccount } from "./account.jsx";
import {
  BookOpen,
  BookMarked,
  ClipboardList,
  Eye,
  Hand,
  Home as HomeIcon,
  Icon,
  LogIn,
  Map,
  Moon,
  Settings2,
  Sun,
  Type,
  User,
  X,
} from "./components/icons.jsx";
import { StatsBar } from "./components/StatsBar.jsx";
import { findLesson, previousLessonId } from "./lessons.js";
import { isLessonDone } from "./progress.js";
import { ProgressProvider, useProgress } from "./progress-state.jsx";
import { Account } from "./views/Account.jsx";
import { Basics } from "./views/Basics.jsx";
import { Dictionary } from "./views/Dictionary.jsx";
import { Grammar } from "./views/Grammar.jsx";
import { Guide } from "./views/Guide.jsx";
import { Home } from "./views/Home.jsx";
import { Landing } from "./views/Landing.jsx";
import { Lesson } from "./views/Lesson.jsx";
import { Practice } from "./views/Practice.jsx";
import { Record } from "./views/Record.jsx";
import { Reference } from "./views/Reference.jsx";
import { Space } from "./views/Space.jsx";
import { Vocabulary } from "./views/Vocabulary.jsx";

const ROUTES = [
  { id: "home", label: "Home", href: "#/", icon: HomeIcon },
  { id: "learn", label: "Learn", href: "#/learn", icon: Map },
  { id: "record", label: "Record", href: "#/record", icon: ClipboardList },
  { id: "dictionary", label: "Dictionary", href: "#/dictionary", icon: BookMarked },
  { id: "guide", label: "Guide", href: "#/guide", icon: BookOpen },
  { id: "reference", label: "Reference", href: "#/reference", icon: Hand },
];

const VIEWS = {
  home: Landing,
  learn: Home,
  record: Record,
  dictionary: Dictionary,
  account: Account,
  guide: Guide,
  basics: Basics,
  vocab: Vocabulary,
  grammar: Grammar,
  space: Space,
  practice: Practice,
  reference: Reference,
};

const GUIDE_ROUTES = new Set(["guide", "basics", "vocab", "grammar", "space", "practice"]);

function readRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (hash.startsWith("lesson/")) return { name: "lesson", lessonId: decodeURIComponent(hash.slice("lesson/".length)) };
  const page = hash.split("/")[0];
  if (page === "learn" || page === "path") return { name: "learn", lessonId: "" };
  if (!page || page === "home") return { name: "home", lessonId: "" };
  if (VIEWS[page]) return { name: page, lessonId: "" };
  return { name: "home", lessonId: "" };
}

export default function App() {
  return (
    <AccountProvider>
      <ProgressProvider>
        <AccessProvider>
          <Shell />
        </AccessProvider>
      </ProgressProvider>
    </AccountProvider>
  );
}

function navCurrent(item, routeName) {
  if (item.id === "home") return routeName === "home";
  if (item.id === "learn") return routeName === "learn";
  if (item.id === "record") return routeName === "record";
  if (item.id === "dictionary") return routeName === "dictionary";
  if (item.id === "reference") return routeName === "reference";
  return GUIDE_ROUTES.has(routeName);
}

function Shell() {
  const [route, setRoute] = useState(readRoute);
  const { access, setOpen, dark, toggleDarkMode } = useAccess();
  const { progress } = useProgress();
  const { user } = useAccount();

  useEffect(() => {
    const sync = () => setRoute(readRoute());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  if (route.name === "lesson") {
    const lesson = findLesson(route.lessonId);
    const previous = lesson ? previousLessonId(lesson.id) : null;
    const locked = Boolean(previous && !isLessonDone(progress, previous));
    return (
      <div className="min-h-screen bg-canvas text-ink">
        {lesson && !locked ? (
          <Lesson lesson={lesson} onExit={() => { window.location.hash = "#/learn"; }} />
        ) : (
          <main id="content" className="mx-auto max-w-[40rem] px-5 py-16">
            <h1 className="text-[28px] font-semibold tracking-[-0.03em]">
              {locked ? "Finish the lesson before this one." : "That lesson is not on the path."}
            </h1>
            <a href="#/learn" className="mt-4 inline-flex items-center gap-1.5 font-medium text-blue">
              <Icon as={Map} size="sm" />
              Back to the path
            </a>
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
  const showStats = route.name !== "home";
  const accountCurrent = route.name === "account";
  const accountLabel = user?.email ? "Account" : "Sign in";
  const AccountIcon = user?.email ? User : LogIn;

  return (
    <div className="min-h-screen bg-canvas text-ink">
      <a className="skip" href="#content">
        Skip to content
      </a>
      <header
        className="sticky top-0 z-20 border-b border-line bg-canvas/92 backdrop-blur"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="mx-auto flex max-w-[1120px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-8">
          <a href="#/" className="flex shrink-0 items-center gap-2.5">
            <img
              src="/signspace-logo.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-[9px] object-cover shadow-soft"
            />
            <span className="min-w-0">
              <span className="font-display block text-[18px] leading-5 tracking-[-0.03em] italic sm:text-[20px]">
                SignSpace
              </span>
              <span className="hidden text-[11px] leading-4 tracking-[-0.02em] text-secondary sm:block">
                Inclusive ASL Academy
              </span>
            </span>
          </a>
          {showStats ? <StatsBar className="ml-auto" /> : <span className="ml-auto" />}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-pressed={dark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Light mode" : "Dark mode"}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink shadow-soft transition-opacity duration-150 hover:opacity-80"
          >
            <Icon as={dark ? Sun : Moon} size="xs" className="text-secondary" />
          </button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-surface px-2.5 py-1.5 text-[13px] font-medium shadow-soft transition-opacity duration-150 hover:opacity-80 sm:px-3 sm:text-[14px]"
          >
            <Icon as={Settings2} size="xs" className="text-secondary" />
            Access{status.length ? ` · ${status.join(" · ")}` : ""}
          </button>
        </div>
      </header>
      <main id="content" className="mx-auto w-full max-w-[1120px] overflow-x-hidden px-5 pt-6 pb-10 sm:px-8 sm:pt-8">
        <View />
      </main>
      <footer
        className="border-t border-line"
        style={{ paddingBottom: "calc(5.5rem + env(safe-area-inset-bottom))" }}
      >
        <div className="mx-auto max-w-[1120px] px-5 py-8 sm:px-8">
          <p className="max-w-[44rem] text-[13px] leading-6 text-secondary">
            SignSpace is a study desk for classroom ASL gloss. It sits beside Deaf-led teaching. Filmed lessons are Dr. Bill Vicars, ASL University, played from YouTube. Sign pages open on Lifeprint. The hand diagrams here are original schematics, so check a filmed model before you treat a letter as settled. Regional signs vary.
          </p>
        </div>
      </footer>
      <nav
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-canvas/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        aria-label="Modules"
      >
        <div className="mx-auto flex max-w-[1120px] items-stretch overflow-x-auto px-1.5 pt-1.5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ROUTES.map((item) => {
            const current = navCurrent(item, route.name);
            const NavIcon = item.icon;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={`flex min-w-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[12px] px-1.5 py-2 text-center no-underline transition-colors duration-150 ${
                  current ? "bg-surface text-blue shadow-soft" : "text-secondary"
                }`}
              >
                <Icon as={NavIcon} size="sm" className={current ? "text-blue" : "text-secondary"} />
                <span className={`text-[10px] font-medium leading-3 tracking-[-0.02em] sm:text-[11px] ${current ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
          <a
            href="#/account"
            aria-current={accountCurrent ? "page" : undefined}
            className={`flex min-w-[3.25rem] flex-1 flex-col items-center justify-center gap-0.5 rounded-[12px] px-1.5 py-2 text-center no-underline transition-colors duration-150 ${
              accountCurrent ? "bg-surface text-blue shadow-soft" : "text-secondary"
            }`}
          >
            <Icon as={AccountIcon} size="sm" className={accountCurrent ? "text-blue" : "text-secondary"} />
            <span className={`max-w-[4.5rem] truncate text-[10px] font-medium leading-3 tracking-[-0.02em] sm:text-[11px] ${accountCurrent ? "font-semibold" : ""}`}>
              {accountLabel}
            </span>
          </a>
        </div>
      </nav>
      <AccessDrawer />
    </div>
  );
}

function AccessDrawer() {
  const { access, patch, open, setOpen, dark, toggleDarkMode } = useAccess();
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
        className="absolute top-0 right-0 flex h-full w-full max-w-md flex-col overflow-y-auto bg-surface px-6 py-6 text-ink shadow-lift"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
              <Icon as={Settings2} size="xs" />
              Access
            </p>
            <h2 id={titleId} className="mt-1 text-[24px] font-semibold tracking-[-0.02em]">
              Study settings
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[14px] font-medium"
          >
            <Icon as={X} size="xs" />
            Close
          </button>
        </div>
        <div className="mt-6 space-y-6">
          <Switch
            on={access.lexical}
            onToggle={() => patch({ lexical: !access.lexical })}
            label="Lexical and manual tone cues"
            detail="Show a hand tag — QUESTION, IF, WHY, or the emotion sign — beside the facial marker. Size, speed, and a crisp handshape can carry urgency when you would rather not mirror a face."
            icon={Hand}
          />
          <fieldset>
            <legend className="inline-flex items-center gap-1.5 text-[15px] font-medium">
              <Icon as={Type} size="sm" className="text-secondary" />
              Playback and step speed
            </legend>
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
                  className={`ss-chip px-4 py-2 text-[14px] font-medium ${
                    access.speed === speed ? "ss-chip-on" : "ss-chip-off"
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
            icon={Eye}
          />
          <Switch
            on={access.largeText}
            onToggle={() => patch({ largeText: !access.largeText })}
            label="Larger text"
            detail="Raises the base type size across the academy."
            icon={Type}
          />
          <Switch
            on={access.reduceMotion}
            onToggle={() => patch({ reduceMotion: !access.reduceMotion })}
            label="Reduce motion"
            detail="Stops autoplay of gloss steps and verb paths. You move them yourself. The system reduced-motion setting is honored either way."
            icon={Settings2}
          />
          <Switch
            on={dark}
            onToggle={toggleDarkMode}
            label="Dark mode"
            detail="A night stage for the academy. Uses your system preference until you choose, then remembers the setting with your other access options."
            icon={dark ? Sun : Moon}
          />
          <p className="text-[14px] leading-6 text-secondary">
            Sarcasm has no single universal sign. If a group needs that tone in the hands, fingerspell S-A-R-C-A-S-M or agree on a cue you both recognize. QUESTION and SAD already have citation signs.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Switch({ on, onToggle, label, detail, icon: SwitchIcon }) {
  return (
    <div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="inline-flex items-center gap-2 text-[15px] font-medium">
          {SwitchIcon ? <Icon as={SwitchIcon} size="sm" className="text-secondary" /> : null}
          {label}
        </span>
        <span className={`relative h-7 w-12 shrink-0 rounded-full ${on ? "bg-blue" : "bg-muted"}`}>
          <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-surface shadow ${on ? "left-5" : "left-0.5"}`} />
        </span>
      </button>
      <p className="mt-2 text-[14px] leading-6 text-secondary">{detail}</p>
    </div>
  );
}
