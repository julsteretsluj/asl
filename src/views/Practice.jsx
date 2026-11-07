import { useState } from "react";
import { PAIRS } from "../data.js";
import { DRILLS, analyze } from "../gloss.js";
import { ExternalLink, Feedback, Pill, Sheet } from "../components/ui.jsx";

export function Practice() {
  return (
    <div className="space-y-14">
      <header className="max-w-[40rem]">
        <p className="text-[13px] font-medium text-secondary">Practice arena</p>
        <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">Write the gloss, then isolate a parameter</h1>
        <p className="mt-4 text-[16px] leading-7 text-secondary">
          The builder on the grammar desk shows a model. Here the model stays hidden until you ask, or until the sentence holds.
        </p>
      </header>
      <Translate />
      <Pairs />
    </div>
  );
}

function Translate() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [passed, setPassed] = useState({});
  const drill = DRILLS[index];
  const passCount = DRILLS.filter((item) => passed[item.id]).length;

  const load = (next) => {
    setIndex(next);
    setText("");
    setResult(null);
    setShowModel(false);
  };

  return (
    <section className="grid items-start gap-6 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Translate the sentence</h2>
        <p className="mt-3 text-[15px] leading-6 text-secondary">
          {passCount} of {DRILLS.length} sentences hold in this sitting.
        </p>
        <ol className="mt-4 space-y-2">
          {DRILLS.map((item, itemIndex) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => load(itemIndex)}
                className={`w-full rounded-xl px-3 py-2 text-left text-[14px] ${
                  itemIndex === index ? "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]" : "text-secondary"
                }`}
              >
                {item.title}
                {passed[item.id] ? " · holds" : ""}
              </button>
            </li>
          ))}
        </ol>
      </div>
      <Sheet className="lg:col-span-8">
        <p className="text-[13px] font-medium text-secondary">
          {index + 1} of {DRILLS.length}
        </p>
        <p className="mt-2 font-serif text-[22px] leading-8">{drill.english}</p>
        <label htmlFor="gloss-input" className="mt-5 block text-[14px] font-medium">
          ASL gloss
        </label>
        <textarea
          id="gloss-input"
          value={text}
          onChange={(event) => {
            setText(event.target.value);
            setResult(null);
          }}
          spellCheck={false}
          className="mt-2 min-h-32 w-full rounded-2xl border border-line px-4 py-3 text-[16px] tracking-[0.04em]"
          placeholder="TOMORROW STORE YOU GO [q]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <Pill
            primary
            onClick={() => {
              const next = analyze(text, drill.id);
              setResult(next);
              if (next.status === "pass") {
                setPassed((current) => ({ ...current, [drill.id]: true }));
                setShowModel(true);
              }
            }}
          >
            Check gloss
          </Pill>
          <Pill onClick={() => setText(text.toUpperCase())}>Make caps</Pill>
          <Pill onClick={() => setShowModel(true)}>Show the model gloss</Pill>
        </div>
        <Feedback result={result} />
        {showModel ? (
          <p className="mt-4 text-[16px] font-medium tracking-[0.04em]">{drill.model}</p>
        ) : null}
      </Sheet>
    </section>
  );
}

function Pairs() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState("");
  const pair = PAIRS[index];
  const locked = Boolean(choice);

  return (
    <section>
      <div className="max-w-[36rem]">
        <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Minimal pairs</h2>
        <p className="mt-3 text-[15px] leading-6 text-secondary">
          Pair {index + 1} of {PAIRS.length}. One parameter, or one pair of parameters, is doing the distinguishing.
        </p>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-12">
        {pair.signs.map((sign, signIndex) => (
          <Sheet key={sign.gloss} className={signIndex === 0 ? "lg:col-span-6" : "lg:col-span-5 lg:col-start-8 lg:mt-8"}>
            <h3 className="text-[24px] font-semibold tracking-[0.04em]">{sign.gloss}</h3>
            <dl className="mt-3 space-y-2 text-[14px] leading-6">
              <Row label="Handshape" value={sign.shape} />
              <Row label="Location" value={sign.where} />
              <Row label="Movement" value={sign.move} />
              <Row label="Palm" value={sign.palm} />
            </dl>
            <p className="mt-3">
              <ExternalLink href={sign.href}>Lifeprint film</ExternalLink>
            </p>
          </Sheet>
        ))}
      </div>
      <fieldset className="mt-6 max-w-[40rem]">
        <legend className="text-[18px] font-medium leading-7">{pair.question}</legend>
        <div className="mt-3 space-y-2">
          {pair.choices.map((option) => {
            const selected = choice === option.id;
            const correct = option.id === pair.answer;
            return (
              <label
                key={option.id}
                className={`flex cursor-pointer items-start gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_2px_8px_rgba(0,0,0,0.08)] ${
                  locked && correct ? "ring-2 ring-blue" : ""
                }`}
              >
                <input
                  type="radio"
                  name={pair.id}
                  className="mt-1"
                  checked={selected}
                  disabled={locked}
                  onChange={() => setChoice(option.id)}
                />
                <span className="text-[15px] leading-6">
                  {option.label}
                  {locked && correct ? " · this is the contrast" : ""}
                  {locked && selected && !correct ? " · look again at the rows above" : ""}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {locked ? (
        <div className="mt-4 max-w-[40rem]">
          <p className="text-[16px] leading-7">{pair.why}</p>
          <Pill
            className="mt-4"
            onClick={() => {
              setChoice("");
              setIndex((value) => (value + 1) % PAIRS.length);
            }}
          >
            {index === PAIRS.length - 1 ? "Review from SUMMER and UGLY" : "Next pair"}
          </Pill>
        </div>
      ) : (
        <p className="mt-4 text-[14px] text-secondary">Choose the parameter that separates the signs.</p>
      )}
    </section>
  );
}

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[7.5rem_1fr] gap-2">
      <dt className="text-secondary">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}
