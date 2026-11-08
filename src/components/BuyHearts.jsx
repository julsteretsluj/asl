import { useId, useState } from "react";
import { HEART_PACKS, heartPackStatus, MAX_HEARTS } from "../progress.js";
import { useProgress } from "../progress-state.jsx";
import { Heart, Icon, X, Zap } from "./icons.jsx";
import { HeartGlyphs } from "./ui.jsx";

/** Three pack pills: fixed XP cost, grant min(pack, room). */
export function BuyHeartsPacks({ className = "", onBought }) {
  const { progress, buyHearts } = useProgress();
  const room = Math.max(0, MAX_HEARTS - progress.hearts);

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Buy hearts with XP">
        {HEART_PACKS.map((pack) => {
          const status = heartPackStatus(progress, pack.hearts);
          const label = `Buy ${pack.hearts} · ${status.cost} XP`;
          const title =
            status.gained > 0 && status.gained < pack.hearts
              ? `Adds ${status.gained} heart${status.gained === 1 ? "" : "s"} (room left)`
              : undefined;
          return (
            <button
              key={pack.hearts}
              type="button"
              disabled={status.disabled}
              title={title}
              onClick={() => {
                const next = buyHearts(pack.hearts);
                onBought?.(next);
              }}
              className="inline-flex h-10 items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 text-[14px] font-semibold tracking-[-0.02em] text-ink shadow-soft transition-opacity enabled:hover:border-blue enabled:hover:text-blue disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={`Buy ${pack.hearts} heart${pack.hearts === 1 ? "" : "s"} for ${status.cost} XP`}
            >
              <Icon as={Heart} size="xs" className="fill-[#ED1B26] text-[#ED1B26]" />
              {label}
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[12px] leading-4 text-secondary">
        {room <= 0
          ? "Heart pool is full."
          : room < MAX_HEARTS
            ? `Room for ${room} more · packs fill up to ${MAX_HEARTS}.`
            : `${progress.xp} XP available · timer still restores hearts.`}
      </p>
    </div>
  );
}

/** Compact control + sheet for StatsBar / hearts-out. */
export function BuyHeartsControl({ className = "", triggerLabel = "Get hearts" }) {
  const { progress } = useProgress();
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const full = progress.hearts >= MAX_HEARTS;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={full}
        className={`inline-flex items-center gap-1 rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-semibold tracking-[-0.02em] text-ink shadow-soft transition-opacity enabled:hover:border-blue enabled:hover:text-blue disabled:cursor-not-allowed disabled:opacity-40 sm:text-[12px] ${className}`}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Icon as={Heart} size="xs" className="fill-[#ED1B26] text-[#ED1B26]" />
        {triggerLabel}
      </button>
      {open ? <BuyHeartsSheet titleId={titleId} onClose={() => setOpen(false)} /> : null}
    </>
  );
}

export function BuyHeartsSheet({ titleId, onClose, onBought }) {
  const { progress } = useProgress();
  const generatedId = useId();
  const headingId = titleId || generatedId;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/25 p-4 sm:items-center">
      <button type="button" aria-label="Close get hearts" className="absolute inset-0" onClick={onClose} />
      <div
        className="relative w-full max-w-sm rounded-[16px] border border-line bg-surface p-5 text-ink shadow-lift"
        role="dialog"
        aria-modal="true"
        aria-labelledby={headingId}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
              <Icon as={Zap} size="xs" className="text-blue" />
              Spend XP
            </p>
            <h2 id={headingId} className="mt-1 text-[22px] font-semibold tracking-[-0.03em]">
              Get hearts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 text-[13px] font-medium text-secondary"
          >
            <Icon as={X} size="xs" />
            Close
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 rounded-[12px] border border-line bg-canvas/80 px-3 py-2.5">
          <HeartGlyphs count={progress.hearts} className="text-[15px]" />
          <p className="text-[13px] font-medium tabular-nums text-secondary">
            <span className="text-ink">{progress.xp}</span> XP
          </p>
        </div>

        <BuyHeartsPacks
          className="mt-4"
          onBought={(next) => {
            onBought?.(next);
            if ((next?.hearts ?? 0) >= MAX_HEARTS) onClose();
          }}
        />

        <p className="mt-4 text-[13px] leading-5 text-secondary">
          No real money — just XP you’ve earned. Hearts still restore on the timer when you’re below five.
        </p>
      </div>
    </div>
  );
}
