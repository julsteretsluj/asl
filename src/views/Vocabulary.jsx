import { useEffect, useMemo, useState } from "react";
import { useAccess } from "../access.jsx";
import { wordId } from "../comfort.js";
import { LessonPlayer, SignPlayer } from "../components/Player.jsx";
import { ComfortControl, GraphicSlot, Prose, Sheet } from "../components/ui.jsx";
import { CATEGORIES, CATEGORY_NOTES, LESSONS, VOCAB } from "../data.js";
import { modelKey, readModel } from "../models.js";
import { useProgress } from "../progress-state.jsx";

const SLUGS = {
  greetings: "Greetings",
  pronouns: "Pronouns",
  emotions: "Emotions",
  time: "Time",
  questions: "Question words",
  family: "Family",
  colors: "Colors",
  food: "Food",
  school: "School",
  jobs: "Jobs",
  home: "Home",
  clothes: "Clothes",
  animals: "Animals",
  weather: "Weather",
  numbers: "Numbers",
  body: "Body",
  health: "Health",
  travel: "Travel",
  money: "Money",
  nature: "Nature",
  sports: "Sports",
  places: "Places",
  discourse: "Discourse",
  depict: "Depict",
  classifiers: "Classifiers",
  ideas: "Ideas",
  intensity: "Intensity",
  opinion: "Opinion",
  debate: "Debate",
  professional: "Professional",
  news: "News",
  narrative: "Narrative",
  nuance: "Nuance",
  register: "Register",
};

function categoryFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash.startsWith("vocab")) return "All";
  const slug = decodeURIComponent(hash.slice("vocab".length).replace(/^\//, ""));
  return SLUGS[slug] || "All";
}

export function Vocabulary() {
  const { access } = useAccess();
  const { progress, setComfort } = useProgress();
  const [category, setCategory] = useState(categoryFromHash);

  useEffect(() => {
    const sync = () => setCategory(categoryFromHash());
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  function chooseCategory(item) {
    const slug = Object.entries(SLUGS).find(([, name]) => name === item)?.[0];
    const next = slug ? `#/vocab/${slug}` : "#/vocab";
    if (window.location.hash === next) {
      setCategory(item);
      return;
    }
    window.location.hash = next;
  }
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(VOCAB[0].gloss + VOCAB[0].term);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VOCAB.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!needle) return true;
      return [item.term, item.gloss, item.category, item.params].join(" ").toLowerCase().includes(needle);
    });
  }, [category, query]);

  const current = rows.find((item) => item.gloss + item.term === selected) || rows[0] || null;
  const currentKey = current ? modelKey(current) : "";
  const [model, setModel] = useState(null);

  useEffect(() => {
    if (!currentKey) return undefined;
    let cancel = false;
    setModel(null);

    function load() {
      readModel(currentKey)
        .then((row) => {
          if (!cancel) setModel(row);
        })
        .catch(() => {
          if (!cancel) setModel(null);
        });
    }

    load();
    const onSync = () => load();
    window.addEventListener("signspace-models-changed", onSync);
    return () => {
      cancel = true;
      window.removeEventListener("signspace-models-changed", onSync);
    };
  }, [currentKey]);

  function watchHere(id) {
    setSelected(id);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.requestAnimationFrame(() => {
      document.getElementById("vocab-detail")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
    });
  }

  return (
    <div className="space-y-8">
      <header className="grid items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="text-[13px] font-medium text-secondary">Module 2</p>
          <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Vocabulary</h1>
          <Prose className="mt-4">
            <p>
              Each row is a sign you can look up, not an English word with a gesture attached. The facial column tells you the classroom non-manual. With manual cues on, that column switches to a hand-side way to carry the same meaning.
            </p>
          </Prose>
          <GraphicSlot id="vocab-desk" className="mt-6" />
        </div>
        <div className="lg:col-span-5">
          <LessonPlayer lesson={LESSONS.two} />
        </div>
      </header>

      <Sheet>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Category">
            {["All", ...CATEGORIES].map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => chooseCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-[13px] font-semibold ${
                  category === item
                    ? "border-ink bg-ink text-white"
                    : "border-line bg-surface text-ink hover:bg-muted"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <label className="block text-[14px]">
            <span className="sr-only">Search vocabulary</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a sign or a gloss"
              className="w-full rounded-full border border-line px-4 py-2 sm:w-64"
            />
          </label>
        </div>
        {category !== "All" ? (
          <p className="mt-4 max-w-[46rem] text-[15px] leading-6 text-secondary">{CATEGORY_NOTES[category]}</p>
        ) : null}

        {rows.length === 0 ? (
          <p className="mt-8 text-[16px] leading-7">
            Nothing in this set matches. Try HELLO, a category, or clear the search.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">ASL vocabulary with gloss, markers, and in-page video</caption>
              <thead>
                <tr className="border-b border-line text-[13px] text-secondary">
                  <th scope="col" className="py-2 pr-3 font-medium">Term</th>
                  <th scope="col" className="py-2 pr-3 font-medium">ASL gloss</th>
                  <th scope="col" className="py-2 pr-3 font-medium">{access.lexical ? "Manual cue" : "Facial marker"}</th>
                  <th scope="col" className="py-2 pr-3 font-medium">Video</th>
                  <th scope="col" className="py-2 font-medium">Comfort</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const id = item.gloss + item.term;
                  const on = current && id === current.gloss + current.term;
                  return (
                    <tr
                      key={id}
                      className={`border-b border-line ${on ? "bg-select-soft" : ""}`}
                    >
                      <th scope="row" className="py-3 pr-3 text-[15px] font-medium">
                        <button
                          type="button"
                          className="text-left"
                          aria-pressed={on}
                          onClick={() => setSelected(id)}
                        >
                          {item.term}
                        </button>
                      </th>
                      <td className="py-3 pr-3 text-[14px] tracking-[0.04em]">{item.gloss}</td>
                      <td className="py-3 pr-3 text-[14px] leading-5 text-secondary">
                        {access.lexical ? item.manual : item.face}
                      </td>
                      <td className="py-3 pr-3">
                        <button type="button" className="min-h-11 text-base font-medium text-blue" onClick={() => watchHere(id)}>
                          Watch here
                        </button>
                      </td>
                      <td className="py-3">
                        <ComfortControl
                          label={`Comfort with ${item.term}`}
                          value={progress.comfort?.[wordId(item.gloss)] || ""}
                          onChange={(level) => setComfort(wordId(item.gloss), level)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Sheet>

      {current ? (
        <Sheet className="lg:ml-auto lg:w-[86%]">
          <div id="vocab-detail">
            <p className="text-[13px] font-medium text-secondary">{current.category}</p>
            <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">{current.gloss}</h2>
            <div className="mt-4">
              <p className="text-[13px] font-medium text-secondary">Comfort</p>
              <p className="mt-1 max-w-[40rem] text-[14px] leading-6 text-secondary">
                How this sign feels when you produce it. A lesson check leaves this where you set it.
              </p>
              <div className="mt-2">
                <ComfortControl
                  label={`Comfort with ${current.term}`}
                  value={progress.comfort?.[wordId(current.gloss)] || ""}
                  onChange={(level) => setComfort(wordId(current.gloss), level)}
                />
              </div>
            </div>
            <p className="mt-3 max-w-[40rem] text-[16px] leading-7">{current.params}</p>
            <p className="mt-3 max-w-[40rem] text-[15px] leading-6 text-secondary">
              {access.lexical ? current.manual : current.face}
            </p>
            <div className="mt-5">
              <SignPlayer sign={current} model={model} />
            </div>
          </div>
        </Sheet>
      ) : null}
    </div>
  );
}
