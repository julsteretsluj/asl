import { useMemo, useState } from "react";
import { useAccount } from "../account.jsx";
import { COMFORT_LEVELS, comfortCounts } from "../comfort.js";
import { CheckCircle2, ClipboardList, Filter as FilterIcon, Icon, LogIn, Star, User } from "../components/icons.jsx";
import { ComfortControl, GraphicSlot } from "../components/ui.jsx";
import { itemId, statusOf, summarize } from "../coverage.js";
import { useProgress } from "../progress-state.jsx";

const STATUS = {
  mastered: { label: "Mastered", className: "bg-success-soft text-success", icon: Star },
  practicing: { label: "Practicing", className: "bg-muted text-ink", icon: CheckCircle2 },
};

export function Record() {
  const { user } = useAccount();
  const { progress, syncState, setComfort } = useProgress();
  const [kind, setKind] = useState("all");
  const [level, setLevel] = useState("all");
  const [comfort, setComfortFilter] = useState("all");
  const stats = summarize(progress);
  const totals = comfortCounts(progress.comfort);
  const groups = useMemo(() => groupItems(progress, kind, level, comfort), [progress, kind, level, comfort]);
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

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-secondary">
          <Icon as={FilterIcon} size="xs" />
          Filters
        </span>
        <Filter value={kind} onChange={setKind} options={[["all", "Everything"], ["word", "Signs"], ["concept", "Ideas"]]} />
        <Filter value={level} onChange={setLevel} options={[["all", "Any stage"], ["mastered", "Mastered"], ["practicing", "Practicing"]]} />
        <Filter
          value={comfort}
          onChange={setComfortFilter}
          options={[["all", "Any comfort"], ...COMFORT_LEVELS.map((entry) => [entry.id, entry.label])]}
        />
      </div>

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
                  return (
                    <li key={`${item.kind}:${item.key}`} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[16px] font-medium">{item.label}</p>
                          <p className="text-[13px] text-secondary">
                            {item.kind === "word" ? item.gloss : "Concept"} · {item.correct || 0} correct · {item.miss || 0} missed
                          </p>
                        </div>
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1 text-[12px] font-semibold ${status.className}`}>
                          <Icon as={status.icon} size={12} />
                          {status.label}
                        </span>
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

function Filter({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1 rounded-full bg-surface p-1 shadow-soft">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          aria-pressed={value === id}
          onClick={() => onChange(id)}
          className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${value === id ? "bg-ink text-white" : "text-secondary"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
