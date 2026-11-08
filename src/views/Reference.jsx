import { useAccess, useQuietMotion } from "../access.jsx";
import { HandDiagram } from "../components/Hand.jsx";
import { BookOpen, Hand, Icon, Type, Users } from "../components/icons.jsx";
import { ExternalLink, GraphicSlot, Sheet } from "../components/ui.jsx";
import { ALPHABET_PAGE, LETTERS, PARAMETERS, VOCAB } from "../data.js";

const SECTION_ICONS = {
  handshapes: Hand,
  grammar: Type,
  social: Users,
};

const byLetter = new Map(LETTERS.map((item) => [item.letter, item]));

function pick(names) {
  return names.map((name) => byLetter.get(name)).filter(Boolean);
}

const alphabet = pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""));
const variants = pick(["Open A", "Open B", "Bent B", "Bent V", "Flat O"]);
const numbers = pick(["1", "3", "Bent 3", "4", "5", "Bent 5", "8", "Open 8"]);
const love = byLetter.get("I love you");
const placed = new Set([...alphabet, ...variants, ...numbers, love].filter(Boolean).map((item) => item.letter));
const extra = LETTERS.filter((item) => !placed.has(item.letter));

const UNPICTURED = ["TWO", "SIX", "SEVEN", "NINE", "TEN", "ELEVEN", "TWELVE"];
const unpictured = UNPICTURED.map((gloss) => VOCAB.find((item) => item.gloss === gloss)).filter(Boolean);

const car = VOCAB.find((item) => item.gloss === "CAR");
const drive = VOCAB.find((item) => item.gloss === "DRIVE");

const rules = [
  {
    title: "Gloss",
    body: "A gloss writes the sign in capital letters. A hyphen joins the English words of one sign, or the letters of a fingerspelled word. Brackets mark the face. ++ asks for a repeat.",
    example: "DON'T-KNOW · J-U-L-E-S · SAFE++ · [q] [rhq] [nod]",
  },
  {
    title: "What drops out",
    body: "Be-verbs, articles, and many uses of to are left out. The signs, the order, and the face carry that work.",
    example: "I FINE · BOOK RED · NICE MEET YOU",
  },
  {
    title: "Time, then topic, then comment",
    body: "Time opens the sentence. The topic, often a place or a thing, comes next. The comment is what you say about it.",
    example: "TOMORROW STORE YOU GO [q]",
  },
  {
    title: "Yes/no and wh-questions",
    body: "A yes/no question raises the brows, written [q]. A wh-question furrows the brows, written [wh-q], and the wh-word usually lands at the end. HOW YOU as a check-in is yes/no, so the brows go up.",
    example: "HOW YOU [q] · STORE YOU GO WHY? [wh-q]",
  },
  {
    title: "Rhetorical questions",
    body: "A reason can take the place of because. Ask WHY? with the brows up, written [rhq], then answer it yourself.",
    example: "PARTY I NOT GO, WHY? [rhq] I TIRED",
  },
  {
    title: "Conditionals",
    body: "The if-clause keeps the brows up. Write [cond], or sign IF. A nod, written [nod], lets the brows drop for the result.",
    example: "[cond] TOMORROW RAIN, [nod] I DESK SIT",
  },
  {
    title: "Negation",
    body: "A headshake negates. NOT comes before the verb, or the two fuse as one sign, NOT-GO.",
    example: "PARTY I NOT GO",
  },
  {
    title: "Spatial indexing",
    body: "Point once to set a person in space. That point becomes the pronoun, and it does not mark gender.",
    example: "SISTER [index-left]",
  },
  {
    title: "Directional verbs",
    body: "The verb travels from the subject’s place to the object’s place. The path names who does it and who receives it.",
    example: "left-GIVE-me BOOK",
  },
  {
    title: "Classifiers",
    body: "Name the thing, then let a handshape stand in for it. CL:B is a flat palm-down hand for a surface. CL:C is a C hand for the cup, set on the near edge.",
    example: "TABLE, CL:B · CUP, CL:C",
  },
  {
    title: "Noun and verb pairs",
    body: "The same hands can name a thing or show the action. The noun is smaller, and often repeated. The verb is larger.",
    example: "CAR is the small wheel. DRIVE turns that wheel.",
    links: [
      car ? { href: car.href, label: "CAR" } : null,
      drive ? { href: drive.href, label: "DRIVE" } : null,
    ].filter(Boolean),
  },
  {
    title: "Role shift",
    body: "To show what someone else does or says, angle your torso and gaze toward the place you indexed for them, sign from that posture, then return to your own.",
    example: "SISTER [index-left]",
  },
];

const pockets = [
  {
    id: "eyes",
    kicker: "Where to look",
    tone: "wide",
    lines: [
      "Look at the face, not the hands. The brows, the mouth, and the head carry grammar, and the hands stay inside that same view. If a steady gaze is too much, rest it on the upper chest and keep the signer in view.",
      "Facial expression is part of the sentence. Raised brows can ask a yes/no question. A headshake can negate.",
    ],
  },
  {
    id: "attention",
    kicker: "Getting attention",
    tone: "offset",
    lines: [
      "Get attention with a wave in the person’s line of sight, a light shoulder tap, or a light flicker. Throwing something and poking are both out.",
    ],
  },
  {
    id: "sightline",
    kicker: "The sightline",
    tone: "rail",
    lines: [
      "Walk behind people who are signing. When the only path crosses in front of them, crouch or wait. A standing body cuts the conversation.",
    ],
  },
  {
    id: "point",
    kicker: "Pointing",
    tone: "slim",
    lines: [
      "Pointing is grammatical. A point is a pronoun: the chest for I, forward for YOU, and a place you have already set for someone else.",
    ],
  },
  {
    id: "hands",
    kicker: "Hands off",
    tone: "ink",
    lines: [
      "Leave the other person’s hands alone. Show a correction on your own hands, and let them try.",
      "Use a sign you know, fingerspell the word, or ask. A made-up sign is not readable.",
    ],
  },
  {
    id: "names",
    kicker: "Names",
    tone: "offset",
    lines: [
      "A name sign is given by a Deaf person. It is not something you assign to yourself.",
      "Fingerspell a name that has no sign, one letter at a time, in order.",
    ],
  },
  {
    id: "talk",
    kicker: "Who you are talking to",
    tone: "wide",
    lines: [
      "Speak to the Deaf person. The interpreter is working the conversation, and the conversation is with the Deaf person.",
      "An interpreter is confidential and is not a participant. A child should not interpret a medical, legal, or other serious conversation.",
    ],
  },
  {
    id: "group",
    kicker: "A group",
    tone: "slim",
    lines: [
      "Sit so everyone can see everyone else, in a circle or a shallow arc. Take one turn at a time.",
    ],
  },
  {
    id: "room",
    kicker: "Keep the face readable",
    tone: "rail",
    lines: [
      "Chewing, a hand over the mouth, and standing in backlight all hide the face.",
      "Ask before you record someone. Wait for a yes.",
    ],
  },
];

const toneClass = {
  wide: "rounded-2xl bg-surface p-5 shadow-soft sm:p-6",
  offset: "rounded-xl border border-line bg-surface p-5 sm:ml-auto sm:max-w-[34rem]",
  slim: "max-w-full rounded-2xl bg-surface p-5 shadow-soft sm:max-w-md",
  ink: "rounded-2xl bg-ink p-5 text-white sm:mr-10 sm:p-6",
  rail: "rounded-r-2xl border-l-4 border-blue bg-surface py-5 pr-5 pl-4 shadow-soft sm:max-w-[36rem]",
};

function ShapeFigure({ item, large = false }) {
  const { access } = useAccess();
  const quiet = useQuietMotion();
  const frame = large ? "h-28 w-24 sm:h-40 sm:w-32" : "h-24 w-20";
  const cols = large
    ? "grid-cols-[6rem_minmax(0,1fr)] sm:grid-cols-[8rem_minmax(0,1fr)]"
    : "grid-cols-[5rem_minmax(0,1fr)]";

  return (
    <div className={`grid items-start gap-3 ${cols}`}>
      <div className={`${frame} max-w-full`}>
        <HandDiagram letter={item.letter} speed={access.speed} quiet={quiet} />
      </div>
      <div className="min-w-0">
        <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em]">{item.letter}</h3>
        <p className="mt-1 text-[0.9375rem] leading-6">{item.summary}</p>
        <p className="mt-1 text-[0.875rem] leading-6 text-secondary">{item.watch}</p>
      </div>
    </div>
  );
}

export function Reference() {
  return (
    <div className="space-y-16">
      <header className="max-w-[40rem]">
        <p className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-secondary">
          <Icon as={BookOpen} size="xs" />
          Quick reference
        </p>
        <h1 className="mt-2 text-[2.125rem] font-semibold tracking-[-0.03em]">Keep these three in view</h1>
        <p className="mt-3 text-[1rem] leading-7 text-secondary">
          The handshapes, the sentence patterns the lessons already practice, and how to be in a signed conversation. The path is still where you drill.
        </p>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="On this page">
          {[
            ["#handshapes", "Handshapes", Hand],
            ["#grammar", "Grammar", Type],
            ["#social", "Social rules", Users],
          ].map(([href, label, NavIcon]) => (
            <a
              key={href}
              href={href}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-[0.875rem] font-medium shadow-soft"
            >
              <Icon as={NavIcon} size="xs" className="text-blue" />
              {label}
            </a>
          ))}
        </nav>
        <GraphicSlot id="reference-hero" className="mt-6" />
      </header>

      <section id="handshapes" className="scroll-mt-52" aria-labelledby="handshapes-title">
        <div className="max-w-[40rem]">
          <p className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-blue">
            <Icon as={SECTION_ICONS.handshapes} size="xs" />
            Handshapes
          </p>
          <h2 id="handshapes-title" className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em]">
            Alphabet, variants, numbers, and I love you
          </h2>
          <p className="mt-3 text-[1rem] leading-7 text-secondary">
            Each picture belongs to one shape. The description sits beside it. J and Z already draw their own path.
          </p>
          <p className="mt-3">
            <ExternalLink href={ALPHABET_PAGE}>Filmed alphabet on Lifeprint</ExternalLink>
          </p>
        </div>

        <Sheet className="mt-6">
          <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em]">Alphabet</h3>
          <div className="mt-2 grid gap-x-8 lg:grid-cols-2">
            {alphabet.map((item) => (
              <div key={item.letter} className="border-b border-[#E5E5EA] py-3">
                <ShapeFigure item={item} />
              </div>
            ))}
          </div>
        </Sheet>

        <div className="mt-8 max-w-[46rem]">
          <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em]">Variants</h3>
          <p className="mt-2 max-w-[36rem] text-[0.9375rem] leading-6 text-secondary">
            These sit next to a letter and change it: the thumb stays out, the fingers spread, or the circle closes.
          </p>
          <div className="mt-2">
            {[...variants, ...extra].map((item, index) => (
              <div key={item.letter} className={index % 2 ? "py-3 sm:ml-14" : "py-3 sm:mr-14"}>
                <ShapeFigure item={item} large />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 border-t border-line pt-8">
          <h3 className="text-[1.125rem] font-semibold tracking-[-0.02em]">Numbers</h3>
          <p className="mt-2 max-w-[38rem] text-[0.9375rem] leading-6 text-secondary">
            The plates below are the number handshapes on this desk. In the number lesson, one through five face you. Six through nine turn the palm out, and the thumb meets the pinky, ring, middle, then index.
          </p>
          <ol className="mt-4 max-w-[44rem] space-y-4">
            {numbers.map((item) => (
              <li key={item.letter}>
                <ShapeFigure item={item} />
              </li>
            ))}
          </ol>
          <div className="mt-8 max-w-[40rem]">
            <h4 className="text-[1rem] font-semibold">No photo yet</h4>
            <p className="mt-1 text-[0.875rem] leading-6 text-secondary">
              These number signs are in the lessons. There is no picture for them here, so the description stands on its own.
            </p>
            <dl className="mt-3">
              {unpictured.map((item) => (
                <div key={item.gloss} className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-3 border-t border-[#E5E5EA] py-3">
                  <dt className="font-semibold tracking-[0.04em]">{item.gloss}</dt>
                  <dd className="min-w-0 text-[0.9375rem] leading-6">
                    {item.manual}
                    <span className="mt-1 block text-[0.875rem] leading-6 text-secondary">{item.params}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {love ? (
          <div className="mt-10 grid items-center gap-6 rounded-[20px] bg-surface p-5 shadow-soft sm:grid-cols-[12rem_minmax(0,1fr)] sm:p-8">
            <div className="mx-auto h-40 w-32 sm:mx-0 sm:h-48 sm:w-40">
              <LoveArt />
            </div>
            <div className="min-w-0">
              <p className="text-[0.8125rem] font-medium text-blue">I love you</p>
              <h3 className="mt-1 text-[1.75rem] font-semibold tracking-[-0.03em]">{love.letter}</h3>
              <p className="mt-2 text-[1rem] leading-7">{love.summary}</p>
              <p className="mt-2 text-[0.9375rem] leading-6 text-secondary">{love.watch}</p>
            </div>
          </div>
        ) : null}
      </section>

      <section id="grammar" className="scroll-mt-52" aria-labelledby="grammar-title">
        <div className="max-w-[40rem]">
          <p className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-blue">
            <Icon as={SECTION_ICONS.grammar} size="xs" />
            Grammar and structure
          </p>
          <h2 id="grammar-title" className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em]">
            The rules the lessons already use
          </h2>
          <p className="mt-3 text-[1rem] leading-7 text-secondary">
            A scan of the path. Build the sentences on the grammar desk. This page does not score them.
          </p>
          <p className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[0.9375rem] font-medium">
            <a href="#/basics" className="text-blue">Gloss notes</a>
            <a href="#/grammar" className="text-blue">Grammar desk</a>
            <a href="#/space" className="text-blue">Signing space</a>
          </p>
        </div>

        <ol className="mt-8 max-w-[46rem]" aria-label="Five parameters">
          {PARAMETERS.map((item, index) => (
            <li key={item.name} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 border-t border-line py-3">
              <span className="font-semibold text-blue">{index + 1}</span>
              <p className="min-w-0 text-[0.9375rem] leading-6">
                <span className="font-semibold">{item.name}. </span>
                <span className="text-secondary">{item.detail}</span>
              </p>
            </li>
          ))}
        </ol>
        <p className="mt-4 max-w-[42rem] text-[0.9375rem] leading-6 text-secondary">
          APPLE twists an X on the cheek. ONION uses that twist at the corner of the eye. K and P are one hand, and P aims it down.
        </p>

        <div className="mt-8 max-w-[48rem] space-y-6">
          {rules.map((rule) => (
            <article key={rule.title} className="border-l-2 border-line pl-4">
              <h3 className="text-[1.0625rem] font-semibold tracking-[-0.02em]">{rule.title}</h3>
              <p className="mt-1 max-w-[40rem] text-[0.9375rem] leading-6 text-secondary">{rule.body}</p>
              <p className="mt-2 inline-block max-w-full rounded-xl bg-surface px-3 py-2 text-[0.9375rem] font-medium leading-6 tracking-[0.03em] break-words shadow-soft">
                {rule.example}
              </p>
              {rule.links?.length ? (
                <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                  {rule.links.map((link) => (
                    <ExternalLink key={link.href} href={link.href}>
                      {link.label} on Lifeprint
                    </ExternalLink>
                  ))}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section id="social" className="scroll-mt-52" aria-labelledby="social-title">
        <div className="max-w-[36rem]">
          <p className="inline-flex items-center gap-1.5 text-[0.8125rem] font-medium text-blue">
            <Icon as={SECTION_ICONS.social} size="xs" />
            Social rules
          </p>
          <h2 id="social-title" className="mt-2 text-[1.75rem] font-semibold tracking-[-0.03em]">
            In the room
          </h2>
          <p className="mt-3 text-[1rem] leading-7 text-secondary">
            A pocket set for being around people who sign. Specific habits, the ones classrooms and community both expect.
          </p>
          <GraphicSlot id="reference-social" className="mt-5" />
        </div>
        <div className="mt-6 space-y-4">
          {pockets.map((card) => (
            <article key={card.id} className={toneClass[card.tone]}>
              <h3 className={`text-[0.8125rem] font-medium ${card.tone === "ink" ? "text-white/70" : "text-secondary"}`}>
                {card.kicker}
              </h3>
              <div className="mt-2 space-y-3">
                {card.lines.map((line) => (
                  <p key={line} className="max-w-[40rem] text-[0.9375rem] leading-6">
                    {line}
                  </p>
                ))}
              </div>
            </article>
          ))}
          <div className="max-w-[40rem] border-t border-line pt-5 sm:ml-8">
            <h3 className="text-[0.8125rem] font-medium text-secondary">The language</h3>
            <ul className="mt-3 space-y-3 text-[0.9375rem] leading-6">
              <li>Deaf, with a capital D, names the community and the culture. Leave “hearing impaired” off this desk.</li>
              <li>ASL is its own grammar. English word order placed on the hands is a different thing. This path uses time, then topic, then comment.</li>
              <li>Regional signs can both be right. WHO has more than one hand form. Copy the person in front of you, and the film when you are studying a citation form.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function LoveArt() {
  const { access } = useAccess();
  const quiet = useQuietMotion();
  return <HandDiagram letter="I love you" speed={access.speed} quiet={quiet} />;
}
