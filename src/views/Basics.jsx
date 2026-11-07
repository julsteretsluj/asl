import { useEffect, useState } from "react";
import { ALPHABET_PAGE, LESSONS, LETTERS } from "../data.js";
import { spellGloss, spellLetters } from "../gloss.js";
import { useAccess, useQuietMotion } from "../access.jsx";
import { HandDiagram } from "../components/Hand.jsx";
import { LessonPlayer } from "../components/Player.jsx";
import { ExternalLink, Pill, Prose, Sheet } from "../components/ui.jsx";

export function Basics() {
  const { access } = useAccess();
  const quiet = useQuietMotion();
  const [letter, setLetter] = useState("A");
  const [playKey, setPlayKey] = useState(0);
  const [name, setName] = useState("Jules");
  const [spellIndex, setSpellIndex] = useState(-1);
  const [spelling, setSpelling] = useState(false);
  const active = LETTERS.find((item) => item.letter === letter) || LETTERS[0];
  const letters = spellLetters(name);

  useEffect(() => {
    if (!spelling) return undefined;
    const sequence = spellLetters(name);
    if (sequence.length === 0) return undefined;
    let index = 0;
    const show = (at) => {
      setLetter(sequence[at]);
      setSpellIndex(at);
      setPlayKey((key) => key + 1);
    };
    show(0);
    if (quiet || sequence.length === 1) {
      setSpelling(false);
      return undefined;
    }
    const timer = window.setInterval(() => {
      index += 1;
      if (index >= sequence.length) {
        window.clearInterval(timer);
        setSpelling(false);
        return;
      }
      show(index);
    }, 900 / access.speed);
    return () => window.clearInterval(timer);
  }, [spelling, name, access.speed, quiet]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key = event.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        setLetter(key);
        setPlayKey((value) => value + 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const doubles = letters.filter((item, index) => index > 0 && item === letters[index - 1]);

  return (
    <div className="space-y-12">
      <header className="max-w-[40rem]">
        <p className="text-[13px] font-medium text-secondary">Module 1</p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Gloss, parameters, fingerspelling</h1>
        <Prose className="mt-4">
          <p>
            A gloss writes the sign, not the English spelling. BOOK is one sign. <span className="whitespace-nowrap">DON&apos;T-KNOW</span> is one sign made of two English words. <span className="whitespace-nowrap">J-U-L-E-S</span> is fingerspelling, with a hyphen between letters. <span className="whitespace-nowrap">SAFE++</span> repeats the sign for intensity or a plural sense.
          </p>
        </Prose>
      </header>

      <section className="grid items-start gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <LessonPlayer lesson={LESSONS.one} />
          <p className="mt-3 text-[13px] leading-5 text-secondary">
            Lesson 1 is a beginner film from ASL University. The alphabet studio on the right is this site’s schematic, for rehearsal between looks at a filmed model.
          </p>
        </div>
        <Sheet className="lg:col-span-7">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-semibold tracking-[-0.02em]">Alphabet studio</h2>
              <p className="mt-1 text-[14px] text-secondary">Choose a letter, or type one. Diagrams are schematic.</p>
            </div>
            <ExternalLink href={ALPHABET_PAGE}>Filmed alphabet on Lifeprint</ExternalLink>
          </div>
          <div className="mt-4 grid grid-cols-7 gap-1.5 sm:grid-cols-9" role="group" aria-label="Manual alphabet">
            {LETTERS.map((item) => (
              <button
                key={item.letter}
                type="button"
                aria-pressed={item.letter === letter}
                onClick={() => {
                  setLetter(item.letter);
                  setPlayKey((value) => value + 1);
                  setSpelling(false);
                }}
                className={`h-11 rounded-xl text-[15px] font-medium ${
                  item.letter === letter ? "bg-ink text-white" : "bg-[#f2f2f7] text-ink hover:bg-[#e8e8ed]"
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>
          <div className="mt-6 grid items-center gap-4 sm:grid-cols-[180px_1fr]">
            <div className="mx-auto h-[220px] w-[180px]">
              <HandDiagram letter={letter} playKey={playKey} speed={access.speed} quiet={quiet} />
            </div>
            <div>
              <p className="text-[28px] font-semibold tracking-[-0.03em]">{active.letter}</p>
              <p className="mt-2 text-[16px] leading-7">{active.summary}</p>
              <p className="mt-2 text-[14px] leading-6 text-secondary">{active.watch}</p>
              <Pill
                className="mt-4"
                onClick={() => setPlayKey((value) => value + 1)}
              >
                {active.motion ? "Replay the path" : "Show this handshape"}
              </Pill>
            </div>
          </div>
          <form
            className="mt-6 border-t border-line pt-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!letters.length) return;
              setSpellIndex(-1);
              setSpelling(true);
            }}
          >
            <label htmlFor="spell-name" className="text-[15px] font-medium">
              Fingerspell a name
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              <input
                id="spell-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setSpelling(false);
                  setSpellIndex(-1);
                }}
                className="min-w-[12rem] flex-1 rounded-xl border border-line px-3 py-2 text-[16px]"
                autoComplete="off"
                spellCheck={false}
              />
              <Pill primary type="submit">
                Step through
              </Pill>
              {spelling ? (
                <Pill type="button" onClick={() => setSpelling(false)}>
                  Stop
                </Pill>
              ) : null}
            </div>
            <p className="mt-3 text-[18px] font-medium tracking-[0.08em]">{spellGloss(name) || "—"}</p>
            {doubles.length ? (
              <p className="mt-2 text-[14px] leading-6 text-secondary">
                A repeated letter, {doubles[0]}, gets a small slide or bounce so the second one stays visible.
              </p>
            ) : null}
          </form>
        </Sheet>
      </section>

      <section className="grid gap-6 lg:grid-cols-12">
        <Sheet className="lg:col-span-7">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">What the gloss leaves out</h2>
          <ul className="mt-4 space-y-3 text-[15px] leading-6">
            <li>
              <span className="font-medium">Articles.</span> a, an, and the are omitted.
            </li>
            <li>
              <span className="font-medium">Many prepositions.</span> to, of, and at usually disappear. The verb and the location show the relationship. GO-TO, when you need it, is one sign.
            </li>
            <li>
              <span className="font-medium">The copula.</span> is, are, was, and were are omitted. I FINE is a complete comment.
            </li>
            <li>
              <span className="font-medium">And and because.</span> A sequence, a pause, or a rhetorical WHY? does that work. See the grammar desk.
            </li>
          </ul>
        </Sheet>
        <Sheet className="lg:col-span-5 lg:mt-10">
          <h2 className="text-[22px] font-semibold tracking-[-0.02em]">One sign, five parts</h2>
          <p className="mt-3 text-[15px] leading-6 text-secondary">
            Every sign is a handshape, in a location, with a movement, a palm orientation, and whatever the face or a manual tag adds. Change one part and you may have a different word. The practice arena isolates that with SUMMER and UGLY.
          </p>
          <a href="#/practice" className="mt-4 inline-block text-[15px] font-medium text-blue">
            Open the minimal pairs
          </a>
        </Sheet>
      </section>
    </div>
  );
}
