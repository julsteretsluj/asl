import { useEffect, useState } from "react";
import { MAX_HEARTS, nextHeartLabel } from "../progress.js";
import { useProgress } from "../progress-state.jsx";
import { BuyHeartsControl } from "./BuyHearts.jsx";
import { Flame, Icon, Zap } from "./icons.jsx";
import { HeartGlyphs } from "./ui.jsx";

/** Compact streak / XP / hearts strip for main chrome (not fullscreen lessons). */
export function StatsBar({ className = "" }) {
  const { progress, refreshHearts } = useProgress();
  const [now, setNow] = useState(() => Date.now());
  const heartsFull = progress.hearts >= MAX_HEARTS;
  const waitLabel = nextHeartLabel(progress, now);
  const streakLabel = progress.streak
    ? `${progress.streak} day${progress.streak === 1 ? "" : "s"}`
    : "—";

  useEffect(() => {
    if (heartsFull) return undefined;
    const id = window.setInterval(() => {
      setNow(Date.now());
      refreshHearts();
    }, 1000);
    return () => window.clearInterval(id);
  }, [heartsFull, refreshHearts]);

  return (
    <div
      className={`min-w-0 rounded-[12px] border border-line bg-surface/90 px-3 py-1.5 shadow-soft sm:px-3.5 ${className}`}
      aria-label="Progress"
    >
      <div className="flex items-center justify-end gap-3 sm:gap-4">
        <div role="status" aria-live="polite" className="flex min-w-0 items-center gap-3 sm:gap-4">
          <dl className="flex min-w-0 items-center gap-3 sm:gap-4">
            <Stat
              label="Streak"
              value={streakLabel}
              icon={<Icon as={Flame} size="xs" className="text-[#FF8D28]" />}
            />
            <Stat
              label="XP"
              value={String(progress.xp)}
              icon={<Icon as={Zap} size="xs" className="text-blue" />}
            />
            <div className="min-w-0">
              <dt className="text-[10px] font-medium leading-3 tracking-[-0.02em] text-secondary sm:text-[11px] sm:leading-4">
                Hearts
              </dt>
              <dd className="mt-0.5 leading-none">
                <HeartGlyphs count={progress.hearts} className="text-[14px] sm:text-[15px]" />
              </dd>
            </div>
          </dl>
          {waitLabel ? (
            <p className="hidden shrink-0 text-right text-[11px] font-medium leading-4 tracking-[-0.02em] text-secondary sm:block sm:text-[12px]">
              {waitLabel}
            </p>
          ) : null}
        </div>
        <BuyHeartsControl />
      </div>
      {waitLabel ? (
        <p className="mt-1 text-right text-[11px] font-medium leading-3 tracking-[-0.02em] text-secondary sm:hidden">
          {waitLabel}
        </p>
      ) : null}
    </div>
  );
}

function Stat({ label, value, icon }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1 text-[10px] font-medium leading-3 tracking-[-0.02em] text-secondary sm:text-[11px] sm:leading-4">
        {icon}
        {label}
      </dt>
      <dd className="mt-0.5 truncate text-[14px] font-semibold leading-5 tracking-[-0.02em] text-ink sm:text-[15px]">
        {value}
      </dd>
    </div>
  );
}
