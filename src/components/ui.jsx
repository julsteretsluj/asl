import { COMFORT_LEVELS } from "../comfort.js";
import { graphic, graphicLabel } from "../graphics.js";
import { MAX_HEARTS } from "../progress.js";
import { Heart, Icon, ImageOff } from "./icons.jsx";

export function HeartGlyphs({ count, max = MAX_HEARTS, className = "", size = 15 }) {
  const filled = Math.min(max, Math.max(0, count));
  return (
    <span className={`inline-flex items-center gap-0.5 ${className}`} aria-label={`${filled} of ${max} hearts`}>
      {Array.from({ length: max }, (_, index) => (
        <Heart
          key={index}
          size={size}
          strokeWidth={1.75}
          absoluteStrokeWidth
          aria-hidden="true"
          className={index < filled ? "fill-[#ED1B26] text-[#ED1B26]" : "fill-none text-line"}
        />
      ))}
    </span>
  );
}

/**
 * Quiet dashed slot for planned AI art — or the real image when `src` is set (slots 1–23).
 * Prefer `id` from the global sequence in graphics.js (numbers 1..N).
 * Legacy: pass `n` + `label` (+ optional `ratio`) if a registry entry is not ready.
 */
export function GraphicSlot({ id, n, label, ratio = "16 / 9", className = "" }) {
  const entry = id ? graphic(id) : null;
  const number = entry?.n ?? n;
  const caption = entry ? graphicLabel(entry) : number != null ? `#${number} — ${label || "Suggested graphic"}` : label || "Suggested graphic";
  const aspect = entry?.ratio || ratio;
  const src = entry?.src || null;
  const alt = entry?.suggest || label || caption;

  if (src) {
    return (
      <figure
        className={`flex w-full flex-col overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_2px_8px_rgba(0,0,0,0.06)] ${className}`}
        aria-label={caption}
        data-graphic-n={number ?? undefined}
        data-graphic-id={entry?.id || id || undefined}
      >
        {/* Natural image height — no forced aspect crop; whole frame stays visible */}
        <div className="w-full bg-muted">
          <img
            src={src}
            alt={alt}
            className="block h-auto w-full object-contain"
            loading="lazy"
            decoding="async"
          />
        </div>
        <figcaption className="sr-only">{caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure
      className={`flex flex-col overflow-hidden rounded-[16px] border border-dashed border-line bg-cream ${className}`}
      aria-label={caption}
      data-graphic-n={number ?? undefined}
      data-graphic-id={entry?.id || id || undefined}
    >
      <div className="grid w-full place-items-center px-4 py-6 text-center" style={{ aspectRatio: aspect }}>
        <div className="max-w-[24rem]">
          {number != null ? (
            <p className="text-[44px] font-medium leading-none tracking-[-0.04em] text-ink tabular-nums" aria-hidden="true">
              #{number}
            </p>
          ) : (
            <Icon as={ImageOff} size="md" className="mx-auto text-secondary" />
          )}
          {number != null ? (
            <p className="mt-2 text-[15px] font-medium tracking-[-0.02em] text-ink">Graphic {number}</p>
          ) : null}
          <figcaption className="mt-2 text-[12px] font-medium leading-5 text-secondary">{caption}</figcaption>
        </div>
      </div>
    </figure>
  );
}

export function ComfortControl({ value = "", onChange, label }) {
  function move(delta) {
    const index = COMFORT_LEVELS.findIndex((level) => level.id === value);
    const start = index < 0 ? (delta > 0 ? -1 : 0) : index;
    const next = (start + delta + COMFORT_LEVELS.length) % COMFORT_LEVELS.length;
    onChange(COMFORT_LEVELS[next].id);
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={(event) => {
        if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
        event.preventDefault();
        move(event.key === "ArrowRight" ? 1 : -1);
      }}
      className="inline-flex max-w-full flex-wrap gap-0.5 rounded-full bg-muted p-0.5"
    >
      {COMFORT_LEVELS.map((level, index) => {
        const selected = value === level.id;
        return (
          <button
            key={level.id}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!value && index === 0) ? 0 : -1}
            onClick={() => onChange(selected ? "" : level.id)}
            className={`rounded-full px-2.5 py-1 text-left text-[12px] font-medium leading-5 transition-opacity duration-150 ${
              selected ? "bg-blue text-white shadow-soft" : "text-secondary hover:opacity-80"
            }`}
          >
            {level.label}
          </button>
        );
      })}
    </div>
  );
}

export function Pill({ children, primary = false, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium tracking-[-0.02em] transition-opacity duration-150 hover:opacity-80 ${
        primary
          ? "border border-blue-deep bg-gradient-to-b from-[#edf4ff] via-[#a2c7ff] to-[#a2d2f7] text-[#0a0a0a] shadow-lift"
          : "border border-secondary bg-gradient-to-b from-[#fbfbfb] via-[#ededed] to-[#e4e4e4] text-ink shadow-soft dark:from-[#4a4945] dark:via-[#3a3935] dark:to-[#2e2d2a]"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Sheet({ className = "", children }) {
  return (
    <section className={`ss-sheet p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Prose({ children, className = "" }) {
  return (
    <div className={`max-w-[40rem] space-y-4 font-serif text-[17px] leading-[1.7] text-ink ${className}`}>
      {children}
    </div>
  );
}

export function Feedback({ result }) {
  if (!result) return null;
  return (
    <div aria-live="polite" className="mt-4 space-y-2">
      <p className="text-[16px] font-medium text-ink">
        {result.status === "pass"
          ? "This gloss holds."
          : result.status === "revise"
            ? "Revise this gloss."
            : "Nothing checked yet."}
      </p>
      <p className="text-[15px] leading-6 text-ink">{result.summary}</p>
      {result.notes?.length ? (
        <ul className="space-y-1.5">
          {result.notes.map((note) => (
            <li
              key={note.text}
              className={`text-[14px] leading-6 ${note.tone === "bad" ? "text-danger" : "text-secondary"}`}
            >
              {note.tone === "bad" ? "Change: " : "Note: "}
              {note.text}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[15px] font-medium text-blue hover:text-blue-hover"
    >
      {children}
    </a>
  );
}
