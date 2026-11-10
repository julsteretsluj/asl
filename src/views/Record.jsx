import { useEffect, useMemo, useState } from "react";
import { useAccount } from "../account.jsx";
import { COMFORT_LEVELS, comfortCounts } from "../comfort.js";
import { ModelPresence, SignModelCapture } from "../components/SignModelCapture.jsx";
import { AlertCircle, CheckCircle2, ClipboardList, Filter as FilterIcon, Icon, LogIn, Star, Upload, User, Video } from "../components/icons.jsx";
import { ComfortControl, GraphicSlot, Pill } from "../components/ui.jsx";
import { itemId, statusOf, summarize } from "../coverage.js";
import { VOCAB } from "../data.js";
import { listModels, modelKey } from "../models.js";
import { useProgress } from "../progress-state.jsx";

const STATUS = {
  mastered: { label: "Mastered", className: "bg-success-soft text-success", icon: Star },
  practicing: { label: "Practicing", className: "bg-muted text-ink", icon: CheckCircle2 },
};

/** Map a covered word row to the dictionary sign used for personal models. */
export function signFromRecordItem(item) {
  if (!item || item.kind !== "word" || !item.gloss) return null;
  const matches = VOCAB.filter((entry) => entry.gloss === item.gloss);
  if (matches.length === 1) return matches[0];
  if (matches.length > 1) {
    return matches.find((entry) => entry.term === item.label) || matches[0];
  }
  return { gloss: item.gloss, term: item.label || item.gloss, category: item.category || "Signs" };
}

function useModelKeys() {
  const [keys, setKeys] = useState(() => new Set());

  useEffect(() => {
    let cancel = false;
    function load() {
      listModels()
        .then((rows) => {
          if (cancel) return;
          const next = new Set();
          for (const row of rows) {
            if (row?.image || row?.video) next.add(row.id);
          }
          setKeys(next);
        })
        .catch(() => {
          if (!cancel) setKeys(new Set());
        });
    }
    load();
    window.addEventListener("signspace-models-changed", load);
    return () => {
      cancel = true;
      window.removeEventListener("signspace-models-changed", load);
    };
  }, []);

  return keys;
}

function needsPersonalModel(item, modelKeys) {
  if (item.kind !== "word") return false;
  const status = statusOf(item);
  if (status !== "mastered" && status !== "practicing") return false;
  const sign = signFromRecordItem(item);
  if (!sign) return false;
  return !modelKeys.has(modelKey(sign));
}

export function Record() {
  const { user } = useAccount();
  const { progress, syncState, setComfort } = useProgress();
  const [kind, setKind] = useState("all");
  const [level, setLevel] = useState("all");
  const [comfort, setComfortFilter] = useState("all");
  const [captureKey, setCaptureKey] = useState("");
  const modelKeys = useModelKeys();
  const stats = summarize(progress);
  const totals = comfortCounts(progress.comfort);
  const groups = useMemo(() => groupItems(progress, kind, level, comfort), [progress, kind, level, comfort]);
  const urgent = useMemo(() => {
    const items = Object.values(progress.items || {}).filter((item) => needsPersonalModel(item, modelKeys));
    return items.sort((a, b) => {
      const rank = (item) => (statusOf(item) === "mastered" ? 0 : 1);
      return rank(a) - rank(b) || a.label.localeCompare(b.label);
    });
  }, [progress, modelKeys]);
  const empty = stats.words + stats.concepts === 0;

  return (
    <div className="max-w-[46rem]">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
            <Icon as={ClipboardList} size="xs" />
            Record
          </p>
          <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.03em]">What you’ve met</h1>
        </div>
        <a href="#/account" className="inline-flex items-center gap-1.5 text-[14px] font-medium text-blue">
          <Icon as={user ? User : LogIn} size="xs" />
          {user ? user.email : "Sign in"}
        </a>
      </div>
      <p className="mt-4 max-w-[38rem] text-[16px] leading-7 text-secondary">
        A sign or idea is covered once you check it in a lesson. It is mastered after two correct checks, with more correct than missed.
        Comfort — Not comfortable, Learning, Comfortable, or Confident — stays where you set it when a check is recorded.
        Add your own model on any sign below; it stays on this device
        {user ? ", and on your account when you are signed in" : ""}.
        {syncState === "saved" ? " This copy is in your account." : " On this device it stays even before you sign in."}
      </p>
      <GraphicSlot id="record-hero" className="mt-5" />

      <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Signs covered" value={stats.words} />
        <Stat label="Signs mastered" value={stats.wordsMastered} />
        <Stat label="Ideas covered" value={stats.concepts} />
        <Stat label="Ideas mastered" value={stats.conceptsMastered} />
      </dl>

      <dl className="mt-3 flex flex-wrap gap-2">
        {COMFORT_LEVELS.map((entry) => (
          <div key={entry.id} className="inline-flex items-baseline gap-2 rounded-full bg-surface px-3 py-1.5 shadow-soft">
            <dt className="text-[13px] text-secondary">{entry.label}</dt>
            <dd className="text-[13px] font-semibold">{totals[entry.id]}</dd>
          </div>
        ))}
      </dl>

      {urgent.length > 0 ? (
        <section className="mt-8" aria-labelledby="needs-model-title">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-danger-soft text-danger" aria-hidden="true">
              <Icon as={AlertCircle} size={14} />
            </span>
            <h2 id="needs-model-title" className="text-[18px] font-semibold tracking-[-0.02em]">
              Needs your model
            </h2>
          </div>
          <p className="mt-1 text-[14px] leading-6 text-secondary">
            Practicing or mastered signs that still need a personal recording or upload.
          </p>
          <ul className="mt-3 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-soft">
            {urgent.map((item) => {
              const status = STATUS[statusOf(item)];
              const sign = signFromRecordItem(item);
              const key = sign ? modelKey(sign) : "";
              const capturing = key && captureKey === key;
              return (
                <li key={`urgent:${item.kind}:${item.key}`} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[16px] font-medium">
                        <span className="inline-flex text-danger" title="Needs your model" aria-label="Needs your model">
                          <Icon as={AlertCircle} size={16} />
                        </span>
                        <span className="truncate">{item.label}</span>
                      </p>
                      <p className="text-[13px] text-secondary">
                        {item.gloss} · {status.label}
                      </p>
                    </div>
                    {status ? (
                      <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${status.className}`}>
                        <Icon as={status.icon} size={12} />
                        {status.label}
                      </span>
                    ) : null}
                  </div>
                  {sign ? (
                    <div className="mt-3">
                      {capturing ? (
                        <SignModelCapture sign={sign} compact snapshot onClose={() => setCaptureKey("")} />
                      ) : (
                        <div className="flex flex-wrap items-center gap-2">
                          <Pill type="button" className="gap-1.5 !px-3 !py-1.5 !text-[13px]" onClick={() => setCaptureKey(key)}>
                            <Icon as={Video} size="xs" />
                            Record
                          </Pill>
                          <Pill type="button" className="gap-1.5 !px-3 !py-1.5 !text-[13px]" onClick={() => setCaptureKey(key)}>
                            <Icon as={Upload} size="xs" />
                            Upload
                          </Pill>
                        </div>
                      )}
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="ss-filter-bar mt-6 space-y-3 rounded-2xl p-4" aria-label="Record filters">
        <p className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink">
          <Icon as={FilterIcon} size="sm" />
          Filters
        </p>
        <div className="flex flex-col gap-3">
          <Filter
            label="Kind"
            value={kind}
            onChange={setKind}
            options={[["all", "Everything"], ["word", "Signs"], ["concept", "Ideas"]]}
          />
          <Filter
            label="Stage"
            value={level}
            onChange={setLevel}
            options={[["all", "Any stage"], ["mastered", "Mastered"], ["practicing", "Practicing"]]}
          />
          <Filter
            label="Comfort"
            value={comfort}
            onChange={setComfortFilter}
            options={[["all", "Any comfort"], ...COMFORT_LEVELS.map((entry) => [entry.id, entry.label])]}
          />
        </div>
      </section>

      {empty ? (
        <div className="mt-8 space-y-4">
          <p className="text-[16px] leading-7">Check a lesson and the signs you meet will show up here.</p>
          <GraphicSlot id="record-empty" />
        </div>
      ) : groups.length === 0 ? (
        <div className="mt-8 space-y-4">
          <p className="text-[16px] leading-7">Nothing in this view yet. Try another filter.</p>
          <GraphicSlot id="record-filter-empty" />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <section key={group.category}>
              <h2 className="text-[13px] font-medium text-secondary">{group.category}</h2>
              <ul className="mt-2 divide-y divide-line overflow-hidden rounded-2xl bg-surface shadow-soft">
                {group.items.map((item) => {
                  const status = STATUS[statusOf(item)];
                  const sign = signFromRecordItem(item);
                  const key = sign ? modelKey(sign) : "";
                  const capturing = key && captureKey === key;
                  const urgentRow = needsPersonalModel(item, modelKeys);
                  return (
                    <li key={`${item.kind}:${item.key}`} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="flex items-center gap-2 text-[16px] font-medium">
                            {urgentRow ? (
                              <span className="inline-flex text-danger" title="Needs your model" aria-label="Needs your model">
                                <Icon as={AlertCircle} size={16} />
                              </span>
                            ) : null}
                            <span className="truncate">{item.label}</span>
                          </p>
                          <p className="text-[13px] text-secondary">
                            {item.kind === "word" ? item.gloss : "Concept"} · {item.correct || 0} correct · {item.miss || 0} missed
                          </p>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          {sign ? <ModelPresence sign={sign} /> : null}
                          {status ? (
                            <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${status.className}`}>
                              <Icon as={status.icon} size={12} />
                              {status.label}
                            </span>
                          ) : null}
                        </div>
                      </div>
                      {item.kind === "word" ? (
                        <div className="mt-3">
                          <ComfortControl
                            label={`Comfort with ${item.label}`}
                            value={progress.comfort?.[itemId(item)] || ""}
                            onChange={(next) => setComfort(itemId(item), next)}
                          />
                        </div>
                      ) : null}
                      {sign ? (
                        <div className="mt-3">
                          {capturing ? (
                            <SignModelCapture sign={sign} compact snapshot onClose={() => setCaptureKey("")} />
                          ) : (
                            <div className="flex flex-wrap items-center gap-2">
                              <Pill type="button" className="gap-1.5 !px-3 !py-1.5 !text-[13px]" onClick={() => setCaptureKey(key)}>
                                <Icon as={Video} size="xs" />
                                Record
                              </Pill>
                              <Pill type="button" className="gap-1.5 !px-3 !py-1.5 !text-[13px]" onClick={() => setCaptureKey(key)}>
                                <Icon as={Upload} size="xs" />
                                Upload
                              </Pill>
                            </div>
                          )}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function groupItems(progress, kind, level, comfortLevel) {
  const comfort = progress.comfort || {};
  const items = Object.values(progress.items || {}).filter((item) => {
    if (kind !== "all" && item.kind !== kind) return false;
    const status = statusOf(item);
    if (status === "new") return false;
    if (level !== "all" && status !== level) return false;
    if (comfortLevel !== "all" && comfort[itemId(item)] !== comfortLevel) return false;
    return true;
  });
  const byCategory = new Map();
  for (const item of items) {
    const category = item.category || "Other";
    const list = byCategory.get(category) || [];
    list.push(item);
    byCategory.set(category, list);
  }
  return [...byCategory.entries()]
    .map(([category, list]) => ({
      category,
      items: list.sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl bg-surface px-3 py-4 shadow-soft">
      <dt className="text-[12px] text-secondary">{label}</dt>
      <dd className="mt-1 text-[22px] font-semibold">{value}</dd>
    </div>
  );
}

function Filter({ label, value, onChange, options }) {
  return (
    <div>
      {label ? <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-ink">{label}</p> : null}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label={label || "Filter"}>
        {options.map(([id, optionLabel]) => {
          const on = value === id;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(id)}
              className={`ss-chip ${on ? "ss-chip-on" : "ss-chip-off"}`}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
}
