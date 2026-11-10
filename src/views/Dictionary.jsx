import { useEffect, useMemo, useState } from "react";
import { useAccount } from "../account.jsx";
import { wordId } from "../comfort.js";
import { ModelPresence, SignModelCapture } from "../components/SignModelCapture.jsx";
import { Icon, Search } from "../components/icons.jsx";
import { ComfortControl, GraphicSlot } from "../components/ui.jsx";
import { CATEGORIES, CATEGORY_NOTES, VOCAB } from "../data.js";
import { modelKey, readModel } from "../models.js";
import { useProgress } from "../progress-state.jsx";

export function Dictionary() {
  const { user } = useAccount();
  const { progress, setComfort } = useProgress();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => modelKey(VOCAB[0]));
  const [hasModel, setHasModel] = useState(false);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VOCAB.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!needle) return true;
      return [item.term, item.gloss, item.category, item.params].join(" ").toLowerCase().includes(needle);
    });
  }, [category, query]);

  const sign = rows.find((item) => modelKey(item) === selected) || rows[0] || null;
  const signKey = sign ? modelKey(sign) : "";

  useEffect(() => {
    if (!signKey) {
      setHasModel(false);
      return undefined;
    }
    let cancel = false;
    function load() {
      readModel(signKey)
        .then((row) => {
          if (!cancel) setHasModel(Boolean(row?.image || row?.video));
        })
        .catch(() => {
          if (!cancel) setHasModel(false);
        });
    }
    load();
    window.addEventListener("signspace-models-changed", load);
    return () => {
      cancel = true;
      window.removeEventListener("signspace-models-changed", load);
    };
  }, [signKey]);

  function choose(item) {
    setSelected(modelKey(item));
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("sign-detail")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="min-w-0">
      <header className="max-w-[36rem]">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
          <Icon as={Search} size="xs" />
          Signs
        </p>
        <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.03em]">Dictionary</h1>
        <p className="mt-3 text-[15px] leading-6 text-secondary">
          Every sign on the path, with the parameters written out. Lifeprint keeps the filmed citation. A photo or clip you add stays on this device
          {user ? ", and on your account when you are signed in" : ""}.
        </p>
        <GraphicSlot id="dictionary-hero" className="mt-5" />
      </header>

      <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <section className="min-w-0 rounded-2xl bg-surface p-4 shadow-soft">
          <label className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary" htmlFor="dictionary-search">
            <Icon as={Search} size="xs" />
            Search
          </label>
          <input
            id="dictionary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Term or gloss"
            className="mt-2 w-full rounded-full border border-line bg-surface px-4 py-2 text-[15px]"
          />
          <label className="mt-4 block text-[13px] font-medium text-secondary" htmlFor="dictionary-category">
            Category
          </label>
          <select
            id="dictionary-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-[15px]"
          >
            <option value="All">All signs</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {category !== "All" && CATEGORY_NOTES[category] ? (
            <p className="mt-3 text-[14px] leading-6 text-secondary">{CATEGORY_NOTES[category]}</p>
          ) : null}
          <p className="mt-4 text-[12px] text-secondary">
            {rows.length} {rows.length === 1 ? "sign" : "signs"}
          </p>
          {rows.length === 0 ? (
            <div className="mt-3 space-y-3">
              <p className="text-[15px] leading-6">Nothing matches. Try another gloss, or set the category back to all signs.</p>
              <GraphicSlot id="dictionary-search-empty" />
            </div>
          ) : (
            <ul className="mt-2 max-h-[40vh] space-y-1 overflow-y-auto lg:max-h-[32rem]">
              {rows.map((item) => {
                const on = sign && modelKey(item) === modelKey(sign);
                const comfortId = wordId(item.gloss);
                return (
                  <li key={modelKey(item)} className="rounded-xl pb-1">
                    <button
                      type="button"
                      aria-current={on ? "true" : undefined}
                      onClick={() => choose(item)}
                      className={`w-full rounded-xl px-3 py-2 text-left ${on ? "bg-select-soft" : "hover:bg-muted"}`}
                    >
                      <span className="flex items-center justify-between gap-2">
                        <span className="block min-w-0 text-[15px] font-medium">{item.term}</span>
                        <ModelPresence sign={item} />
                      </span>
                      <span className="block text-[12px] tracking-[0.04em] text-secondary">
                        {item.gloss}
                        <span className="tracking-normal"> · {item.category}</span>
                      </span>
                    </button>
                    <div className="px-2 pt-1">
                      <ComfortControl
                        label={`Comfort with ${item.term}`}
                        value={progress.comfort?.[comfortId] || ""}
                        onChange={(level) => setComfort(comfortId, level)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {sign ? (
          <div className="min-w-0 space-y-4">
            <article id="sign-detail" className="rounded-[20px] bg-surface p-5 shadow-soft sm:p-8">
              <p className="text-[13px] font-medium text-blue">{sign.category}</p>
              <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em]">{sign.term}</h2>
              <p className="mt-1 break-words text-[15px] tracking-[0.06em] text-secondary">{sign.gloss}</p>
              <div className="mt-5">
                <p className="text-[13px] font-medium text-secondary">Comfort</p>
                <p className="mt-1 max-w-[34rem] text-[14px] leading-6 text-secondary">
                  How this sign feels when you produce it. A lesson check leaves this where you set it.
                </p>
                <div className="mt-2">
                  <ComfortControl
                    label={`Comfort with ${sign.term}`}
                    value={progress.comfort?.[wordId(sign.gloss)] || ""}
                    onChange={(level) => setComfort(wordId(sign.gloss), level)}
                  />
                </div>
              </div>

              <div className="mt-8 border-t border-line pt-6">
                <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Your model</h3>
                <p className="mt-2 max-w-[34rem] text-[15px] leading-6 text-secondary">
                  Watch the filmed model, then record, snapshot, or upload. Trim or crop before you apply. It stays on this device for {sign.term}
                  {user
                    ? ", and is saved to your account so it follows you on other devices."
                    : ". Sign in to keep it on your account across devices."}
                </p>
                <div className="mt-4">
                  <SignModelCapture
                    key={signKey}
                    sign={sign}
                    onSaved={(next) => setHasModel(Boolean(next?.image || next?.video))}
                  />
                </div>
              </div>

              <dl className="mt-8 space-y-5 border-t border-line pt-6">
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Parameters</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.params}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Hand</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.manual}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Face</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.face}</dd>
                </div>
              </dl>
            </article>

            {!hasModel ? (
              <div className="sm:ml-6">
                <GraphicSlot id="dictionary-model" />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
