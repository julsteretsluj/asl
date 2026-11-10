import { useState } from "react";
import { PEOPLE, VERBS } from "../data.js";
import { useAccess, useQuietMotion } from "../access.jsx";
import { ExternalLink, GraphicSlot, Pill, Prose, Sheet } from "../components/ui.jsx";

export function Space() {
  const { access } = useAccess();
  const quiet = useQuietMotion();
  const [loci, setLoci] = useState({ left: "", right: "" });
  const [side, setSide] = useState("left");
  const [verb, setVerb] = useState("GIVE");
  const [direction, setDirection] = useState("toward-me");
  const [travel, setTravel] = useState(0);
  const [table, setTable] = useState(false);
  const [cup, setCup] = useState(false);

  const person = loci[side];
  const verbInfo = VERBS.find((item) => item.id === verb) || VERBS[0];
  const gloss = buildGloss({ loci, side, person, verb, direction, object: verbInfo.object });
  const path = motionPath(side, direction);
  const duration = `${(1.7 / access.speed).toFixed(2)}s`;

  return (
    <div className="space-y-10">
      <header className="max-w-[42rem]">
        <p className="text-[13px] font-medium text-secondary">Module 4</p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Space and classifiers</h1>
        <Prose className="mt-4">
          <p>
            People and places live in the space in front of you. Point once to set SISTER on your left, and that point becomes her pronoun. A directional verb then travels. left-GIVE-me starts at her locus and ends at you. me-GIVE-left does the reverse.
          </p>
          <p>
            A classifier is a handshape that stands in for a thing you have already named. TABLE, then CL:B shows the flat top. CUP, then CL:C sets the cup on the near edge.
          </p>
        </Prose>
        <GraphicSlot id="space-desk" className="mt-6 max-w-md" />
      </header>

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <Sheet className="lg:col-span-4">
          <h2 className="text-[20px] font-semibold tracking-[-0.02em]">Index someone</h2>
          <p className="mt-2 text-[14px] leading-6 text-secondary">
            This map is from your point of view. Left on the screen is your left.
          </p>
          <div className="mt-4 space-y-4">
            {["left", "right"].map((slot) => (
              <fieldset key={slot}>
                <legend className="text-[13px] font-medium text-secondary">
                  {slot === "left" ? "Your left" : "Your right"}
                </legend>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PEOPLE.map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={loci[slot] === name}
                      onClick={() => setLoci((current) => ({ ...current, [slot]: current[slot] === name ? "" : name }))}
                      className={`ss-chip ${loci[slot] === name ? "ss-chip-on" : "ss-chip-off"}`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <h3 className="mt-6 text-[16px] font-medium">Send a verb</h3>
          <div className="mt-2 flex flex-wrap gap-1.5" role="group" aria-label="Verb">
            {VERBS.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={verb === item.id}
                onClick={() => setVerb(item.id)}
                className={`ss-chip ${verb === item.id ? "ss-chip-on" : "ss-chip-off"}`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Which side">
            {["left", "right"].map((slot) => (
              <button
                key={slot}
                type="button"
                aria-pressed={side === slot}
                onClick={() => setSide(slot)}
                className={`rounded-full px-3 py-1.5 text-[13px] font-medium ${
                  side === slot ? "bg-blue text-white" : "bg-surface text-ink border border-line"
                }`}
              >
                Use {slot}
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Direction">
            <button
              type="button"
              aria-pressed={direction === "toward-me"}
              onClick={() => setDirection("toward-me")}
              className={`ss-chip px-4 py-2 text-[14px] font-medium ${
                direction === "toward-me" ? "ss-chip-on" : "ss-chip-off"
              }`}
            >
              Toward me
            </button>
            <button
              type="button"
              aria-pressed={direction === "toward-them"}
              onClick={() => setDirection("toward-them")}
              className={`ss-chip px-4 py-2 text-[14px] font-medium ${
                direction === "toward-them" ? "ss-chip-on" : "ss-chip-off"
              }`}
            >
              Toward them
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill
              primary
              onClick={() => {
                if (!person) return;
                setTravel((value) => value + 1);
              }}
            >
              Play the verb
            </Pill>
            <Pill
              onClick={() => {
                setLoci({ left: "", right: "" });
                setTravel(0);
              }}
            >
              Clear people
            </Pill>
          </div>
          {!person ? (
            <p className="mt-3 text-[14px] leading-6 text-secondary">
              Index someone on the {side} first. A directional verb needs a place to leave or to land.
            </p>
          ) : (
            <p className="mt-4 text-[16px] font-medium leading-7 tracking-[0.02em]">
              {gloss.split(", ").map((part) => (
                <span key={part} className="block">
                  {part}
                </span>
              ))}
            </p>
          )}
          <p className="mt-3">
            <ExternalLink href={verbInfo.href}>Lifeprint film for {verbInfo.label}</ExternalLink>
          </p>
        </Sheet>

        <Sheet className="lg:col-span-8 lg:mt-8">
          <SigningMap
            loci={loci}
            path={person ? path : ""}
            travel={travel}
            duration={duration}
            quiet={quiet}
          />
        </Sheet>
      </section>

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em]">Table and cup</h2>
          <Prose className="mt-4">
            <p>
              Name the object, then let the classifier show it. CL:B is a flat hand, palm down, standing in for the tabletop. CL:C is a C hand standing in for the cup. The second hand lands on the near edge of the first.
            </p>
          </Prose>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill
              primary
              onClick={() => {
                setTable(true);
              }}
            >
              Lay the table
            </Pill>
            <Pill
              onClick={() => {
                if (!table) return;
                setCup(true);
              }}
            >
              Set the cup
            </Pill>
            <Pill
              onClick={() => {
                setTable(false);
                setCup(false);
              }}
            >
              Clear the scene
            </Pill>
          </div>
          {!table && cup === false ? (
            <p className="mt-4 text-[15px] leading-6 text-secondary">The scene is empty. Lay the table, then place the cup.</p>
          ) : null}
          <p className="mt-4 text-[18px] font-medium leading-7 tracking-[0.03em]">
            {table && cup
              ? "TABLE, CL:B [flat surface], CUP, CL:C [place on edge]"
              : table
                ? "TABLE, CL:B [flat surface]"
                : "—"}
          </p>
        </div>
        <Sheet className="lg:col-span-6 lg:col-start-7">
          <ClassifierScene table={table} cup={cup} />
          <div className="mt-3 flex gap-4 text-[14px]">
            <ExternalLink href="https://www.lifeprint.com/asl101/pages-signs/t/table.htm">TABLE</ExternalLink>
            <ExternalLink href="https://www.lifeprint.com/asl101/pages-signs/c/cup.htm">CUP</ExternalLink>
          </div>
        </Sheet>
      </section>
    </div>
  );
}

function buildGloss({ loci, side, person, verb, direction, object }) {
  const parts = [];
  if (loci.left) parts.push(`${loci.left} [index-left]`);
  if (loci.right) parts.push(`${loci.right} [index-right]`);
  if (person) {
    const path = direction === "toward-me" ? `${side}-${verb}-me` : `me-${verb}-${side}`;
    parts.push(`${path}${object ? ` ${object}` : ""}`);
  }
  return parts.join(", ");
}

function motionPath(side, direction) {
  const from = side === "left" ? "120,150" : "520,150";
  const me = "320,250";
  if (direction === "toward-me") return `M ${from} Q 320 90 ${me}`;
  return `M ${me} Q 320 90 ${from}`;
}

function SigningMap({ loci, path, travel, duration, quiet }) {
  return (
    <svg viewBox="0 0 640 340" className="h-auto w-full" role="img" aria-label="Signing space from the signer’s point of view.">
      <rect x="0" y="0" width="640" height="340" rx="16" fill="#F7F7FA" />
      <text x="320" y="36" textAnchor="middle" fill="#6E6E73" fontSize="13" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
        Person you are signing with
      </text>
      <Locus x={120} y={150} label={loci.left} empty="Left" />
      <Locus x={520} y={150} label={loci.right} empty="Right" />
      <g>
        <circle cx="320" cy="268" r="18" fill="#F6F5F2" stroke="#1D1D1F" strokeWidth="2" />
        <path d="M286 312c8-22 22-32 34-32s26 10 34 32" fill="none" stroke="#1D1D1F" strokeWidth="2" strokeLinecap="round" />
        <text x="320" y="332" textAnchor="middle" fill="#1D1D1F" fontSize="13" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
          You
        </text>
      </g>
      {path && travel > 0 ? (
        <g key={travel}>
          <path d={path} fill="none" stroke="#007AFF" strokeWidth="2" strokeDasharray="5 6" />
          {quiet ? (
            <circle r="7" fill="#007AFF">
              <animateMotion dur="0.01s" repeatCount="1" path={path} fill="freeze" />
            </circle>
          ) : (
            <circle r="7" fill="#007AFF">
              <animateMotion dur={duration} repeatCount="1" path={path} fill="freeze" />
            </circle>
          )}
        </g>
      ) : (
        <text x="320" y="188" textAnchor="middle" fill="#6E6E73" fontSize="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
          {loci.left || loci.right ? "Play the verb to see it travel." : "The space is empty."}
        </text>
      )}
    </svg>
  );
}

function Locus({ x, y, label, empty }) {
  return (
    <g>
      <circle cx={x} cy={y} r="22" fill="var(--color-surface)" stroke={label ? "var(--color-sky)" : "var(--color-line)"} strokeWidth="2" />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fill="#1D1D1F"
        fontSize="12"
        fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
      >
        {label ? "IX" : empty}
      </text>
      {label ? (
        <text
          x={x}
          y={y + 42}
          textAnchor="middle"
          fill="#1D1D1F"
          fontSize="13"
          fontFamily="-apple-system, BlinkMacSystemFont, sans-serif"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function ClassifierScene({ table, cup }) {
  return (
    <svg viewBox="0 0 420 240" className="h-auto w-full" aria-hidden="true">
      <rect width="420" height="240" rx="16" fill="#F7F7FA" />
      {table ? (
        <g>
          <path d="M70 150 L210 118 L350 150 L210 184 Z" fill="#FFFFFF" stroke="#1D1D1F" strokeWidth="2" />
          <text x="40" y="40" fill="#1D1D1F" fontSize="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
            CL:B
          </text>
          <rect x="48" y="48" width="34" height="22" rx="6" fill="#F6F5F2" stroke="#1D1D1F" strokeWidth="1.6" />
        </g>
      ) : (
        <text x="210" y="124" textAnchor="middle" fill="#6E6E73" fontSize="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
          No surface yet
        </text>
      )}
      {cup ? (
        <g>
          <ellipse cx="300" cy="142" rx="18" ry="8" fill="none" stroke="#007AFF" strokeWidth="3" />
          <path d="M284 142c2 20 8 28 16 28s14-8 16-28" fill="none" stroke="#007AFF" strokeWidth="3" />
          <text x="330" y="40" fill="#1D1D1F" fontSize="14" fontFamily="-apple-system, BlinkMacSystemFont, sans-serif">
            CL:C
          </text>
        </g>
      ) : null}
    </svg>
  );
}
