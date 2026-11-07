import { useEffect, useMemo, useState } from "react";
import { CATEGORIES, CATEGORY_NOTES, LESSONS, VOCAB } from "../data.js";
import { useAccess } from "../access.jsx";
import { LessonPlayer } from "../components/Player.jsx";
import { ExternalLink, Prose, Sheet } from "../components/ui.jsx";

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
};

function categoryFromHash() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  if (!hash.startsWith("vocab")) return "All";
  const slug = decodeURIComponent(hash.slice("vocab".length).replace(/^\//, ""));
  return SLUGS[slug] || "All";
}

export function Vocabulary() {
  const { access } = useAccess();
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
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  category === item ? "bg-ink text-white" : "bg-[#f2f2f7] text-ink"
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
              <caption className="sr-only">ASL vocabulary with gloss, markers, and film links</caption>
              <thead>
                <tr className="border-b border-line text-[13px] text-secondary">
                  <th scope="col" className="py-2 pr-3 font-medium">Term</th>
                  <th scope="col" className="py-2 pr-3 font-medium">ASL gloss</th>
                  <th scope="col" className="py-2 pr-3 font-medium">{access.lexical ? "Manual cue" : "Facial marker"}</th>
                  <th scope="col" className="py-2 font-medium">Video</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((item) => {
                  const id = item.gloss + item.term;
                  const on = current && id === current.gloss + current.term;
                  return (
                    <tr
                      key={id}
                      className={`border-b border-[#ececf1] ${on ? "bg-[#f5f9ff]" : ""}`}
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
                      <td className="py-3">
                        <ExternalLink href={item.href}>Lifeprint</ExternalLink>
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
          <p className="text-[13px] font-medium text-secondary">{current.category}</p>
          <h2 className="mt-1 text-[26px] font-semibold tracking-[-0.02em]">{current.gloss}</h2>
          <p className="mt-3 max-w-[40rem] text-[16px] leading-7">{current.params}</p>
          <p className="mt-3 max-w-[40rem] text-[15px] leading-6 text-secondary">
            {access.lexical ? current.manual : current.face}
          </p>
          <p className="mt-4">
            <ExternalLink href={current.href}>Open the Lifeprint film for {current.term}</ExternalLink>
          </p>
        </Sheet>
      ) : null}
    </div>
  );
}
