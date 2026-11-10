import { useMemo, useState } from "react";
import { isLessonDone } from "../progress.js";
import { useProgress } from "../progress-state.jsx";
import { lessonList, unitsForReset } from "../lessons.js";
import { Icon, RotateCcw } from "./icons.jsx";

const SCOPES = [
  {
    id: "all",
    label: "Entire path",
    detail: "Clear every finished lesson, XP, hearts, comfort ratings, and sign stats. Start from the first unit again.",
  },
  {
    id: "current",
    label: "Current unit onward",
    detail: "Clear this unit and every unit after it. Earlier finished units stay done.",
  },
  {
    id: "unit",
    label: "Choose a unit",
    detail: "Clear that unit and every unit after it. Pick where you want to begin again.",
  },
];

function currentUnitId(progress) {
  const list = lessonList();
  const open = list.find((lesson) => !isLessonDone(progress, lesson.id));
  return (open || list[list.length - 1])?.unitId || unitsForReset()[0]?.id || "";
}

export function ProgressReset() {
  const { progress, resetProgress } = useProgress();
  const units = useMemo(() => unitsForReset(), []);
  const activeUnitId = currentUnitId(progress);
  const [scope, setScope] = useState("current");
  const [unitId, setUnitId] = useState(activeUnitId);
  const [confirming, setConfirming] = useState(false);
  const [doneMessage, setDoneMessage] = useState("");

  const selectedUnitId = scope === "current" ? activeUnitId : unitId;
  const selectedUnit = units.find((unit) => unit.id === selectedUnitId) || units[0];
  const lessonIds = scope === "all" ? [] : selectedUnit?.lessonIdsFromHere || [];
  const clearedCount = scope === "all" ? lessonList().length : lessonIds.length;

  function runReset() {
    if (scope === "all") {
      resetProgress({ scope: "all" });
      setDoneMessage("The whole path is clear. Hearts are full. Start again from Unit 1.");
    } else {
      resetProgress({ scope: "unit", lessonIds });
      const title = selectedUnit?.title || "that unit";
      setDoneMessage(`Cleared from ${title} onward (${clearedCount} lessons). Earlier units stay as they were.`);
    }
    setConfirming(false);
  }

  return (
    <section className="mt-10 max-w-md rounded-2xl border border-line bg-surface p-5 shadow-soft">
      <p className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink">
        <Icon as={RotateCcw} size="xs" />
        Reset path
      </p>
      <h2 className="mt-2 text-[22px] font-semibold tracking-[-0.02em]">Start again</h2>
      <p className="mt-2 text-[15px] leading-6 text-secondary">
        Choose how far back to go. Unit resets clear that unit and everything after it on the path. They do not erase your sign-in.
      </p>

      <div className="mt-5 space-y-2" role="radiogroup" aria-label="Reset scope">
        {SCOPES.map((entry) => {
          const on = scope === entry.id;
          return (
            <button
              key={entry.id}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => {
                setScope(entry.id);
                setConfirming(false);
                setDoneMessage("");
                if (entry.id === "current") setUnitId(activeUnitId);
              }}
              className={`w-full rounded-2xl border px-4 py-3 text-left ${
                on ? "border-ink bg-select-soft" : "border-line bg-surface hover:bg-muted"
              }`}
            >
              <span className="block text-[15px] font-semibold text-ink">{entry.label}</span>
              <span className="mt-1 block text-[13px] leading-5 text-secondary">{entry.detail}</span>
            </button>
          );
        })}
      </div>

      {scope === "unit" ? (
        <label className="mt-4 block">
          <span className="text-[14px] font-semibold text-ink">Unit to restart from</span>
          <select
            value={selectedUnitId}
            onChange={(event) => {
              setUnitId(event.target.value);
              setConfirming(false);
              setDoneMessage("");
            }}
            className="mt-2 h-12 w-full rounded-2xl border border-line bg-surface px-4 text-[15px] font-medium text-ink"
          >
            {units.map((unit) => (
              <option key={unit.id} value={unit.id}>
                Unit {unit.index + 1}: {unit.title}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {scope === "current" && selectedUnit ? (
        <p className="mt-4 text-[14px] leading-6 text-ink">
          Current unit: <span className="font-semibold">Unit {selectedUnit.index + 1} · {selectedUnit.title}</span>
        </p>
      ) : null}

      <p className="mt-4 text-[13px] leading-5 text-secondary">
        {scope === "all"
          ? "This clears XP, streak, hearts, comfort, and all lesson completion."
          : `This clears completion for ${clearedCount} lesson${clearedCount === 1 ? "" : "s"} from here to the end. XP and comfort stay.`}
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => {
            setDoneMessage("");
            setConfirming(true);
          }}
          className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full border border-danger bg-danger-soft text-[16px] font-semibold text-danger"
        >
          <Icon as={RotateCcw} size="sm" className="text-danger" />
          {scope === "all" ? "Reset entire path…" : "Reset from this unit…"}
        </button>
      ) : (
        <div className="mt-5 space-y-3 rounded-2xl border border-danger/30 bg-danger-soft p-4">
          <p className="text-[15px] font-semibold text-danger">Confirm reset</p>
          <p className="text-[14px] leading-6 text-ink">
            {scope === "all"
              ? "You will lose all path progress on this device (and on your account when sync saves). This cannot be undone."
              : `Clear Unit ${(selectedUnit?.index ?? 0) + 1} · ${selectedUnit?.title || ""} and every unit after it? Earlier units stay finished.`}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={runReset}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full bg-danger text-[15px] font-semibold text-white"
            >
              Yes, reset
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="inline-flex h-11 flex-1 items-center justify-center rounded-full border border-line bg-surface text-[15px] font-semibold text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {doneMessage ? (
        <p role="status" className="mt-4 text-[14px] leading-6 text-success">
          {doneMessage}
        </p>
      ) : null}
    </section>
  );
}
