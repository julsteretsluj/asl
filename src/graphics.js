/**
 * Global SignSpace AI-art slots — one sequence across the app.
 * Numbers (n) are stable: keep existing ids/n fixed; append new slots at the end.
 * Render with <GraphicSlot id="…" /> from components/ui.jsx.
 */
/** Public URL for filled slots (graphicN.png → /graphics/N.png). */
export function graphicPublicSrc(n) {
  return n >= 1 && n <= 23 ? `/graphics/${n}.png` : null;
}

export const GRAPHICS = [
  {
    id: "landing-hero",
    n: 1,
    src: "/graphics/1.png",
    where: "#/ · hero atmosphere",
    why: "Gives the purpose home a calm visual plane under the brand and headline.",
    suggest:
      "16:9 soft wide photo of two people signing across a café table, natural window light, calm neutrals, no text overlay",
    ratio: "16 / 9",
  },
  {
    id: "landing-path",
    n: 2,
    src: "/graphics/2.png",
    where: "#/ · How lessons work",
    why: "Shows what the Duolingo-style path feels like before someone opens Learn.",
    suggest:
      "4:3 soft 3D illustration of a vertical lesson path with round nodes, muted green current node, cream background, no UI chrome",
    ratio: "4 / 3",
  },
  {
    id: "landing-dictionary",
    n: 3,
    src: "/graphics/3.png",
    where: "#/ · Dictionary & your model",
    why: "Hints that personal models sit beside citation films.",
    suggest:
      "1:1 quiet square photo of hands framing a smartphone camera mid-sign, soft desk light, shallow depth of field, no logos",
    ratio: "1 / 1",
  },
  {
    id: "landing-reference",
    n: 4,
    src: "/graphics/4.png",
    where: "#/ · Reference strip",
    why: "Marks the desk where handshapes and social rules live.",
    suggest:
      "3:2 editorial illustration of a circle of people signing in warm room light, soft flat color, respectful posture, no text",
    ratio: "3 / 2",
  },
  {
    id: "landing-guide-record",
    n: 5,
    src: "/graphics/5.png",
    where: "#/ · Guidebook & record strip",
    why: "Separates longer notes and the personal record from the short path.",
    suggest:
      "16:10 top-down soft photo of an open notebook beside a laptop showing hand diagrams, cool gray desk, no readable text",
    ratio: "16 / 10",
  },
  {
    id: "unit-foundations",
    n: 6,
    src: "/graphics/6.png",
    where: "#/learn · Unit 1 Foundations card",
    why: "Gives the foundations unit a topic cover before the alphabet desk.",
    suggest:
      "4:3 soft illustration of open hands forming the letter A beside a quiet notebook, warm daylight, no text",
    ratio: "4 / 3",
  },
  {
    id: "unit-words",
    n: 7,
    src: "/graphics/7.png",
    where: "#/learn · Unit 2 First signs card",
    why: "Sets a classroom mood for first vocabulary lessons.",
    suggest:
      "4:3 calm photo of a classroom whiteboard with faint gloss lines out of focus, cool gray tones, no readable words",
    ratio: "4 / 3",
  },
  {
    id: "unit-grammar",
    n: 8,
    src: "/graphics/8.png",
    where: "#/learn · Unit 3 Sentence patterns card",
    why: "Hints at signing space before grammar drills unlock.",
    suggest:
      "4:3 abstract soft 3D ribbons suggesting signing space around a torso silhouette, muted blue-gray, no faces",
    ratio: "4 / 3",
  },
  {
    id: "unit-space",
    n: 9,
    src: "/graphics/9.png",
    where: "#/learn · Unit 4 Space card",
    why: "Signals practice-ready space work on the path.",
    suggest:
      "4:3 intimate still life of a coffee mug and phone on a desk ready for practice, natural light, no logos",
    ratio: "4 / 3",
  },
  {
    id: "dictionary-hero",
    n: 10,
    src: "/graphics/10.png",
    where: "#/dictionary · page hero",
    why: "Gives the dictionary a visual identity above the search list.",
    suggest:
      "21:9 wide soft hero of a signer mid-gloss beside a faint dictionary page silhouette, cool daylight, no readable text",
    ratio: "21 / 9",
  },
  {
    id: "dictionary-search-empty",
    n: 11,
    src: "/graphics/11.png",
    where: "#/dictionary · no search matches",
    why: "Softens the empty search list when nothing matches.",
    suggest:
      "1:1 empty-state illustration of empty search rings around a resting handshape, soft gray-blue, square, no text",
    ratio: "1 / 1",
  },
  {
    id: "dictionary-model",
    n: 12,
    src: "/graphics/12.png",
    where: "#/dictionary · empty Your model",
    why: "Fills the empty personal-model area until a clip is saved.",
    suggest:
      "16:9 empty model frame — soft photo of a phone on a stand facing an empty chair, cool studio light, no UI chrome",
    ratio: "16 / 9",
  },
  {
    id: "guide-hero",
    n: 13,
    src: "/graphics/13.png",
    where: "#/guide · guidebook intro",
    why: "Separates long-form desks from the short lesson path.",
    suggest:
      "21:9 wide atmospheric photo of an open guidebook on a wooden desk with soft window light, calm neutrals, no readable print",
    ratio: "21 / 9",
  },
  {
    id: "guide-basics",
    n: 14,
    src: "/graphics/14.png",
    where: "#/guide · Gloss and the alphabet card",
    why: "Preview art for the alphabet desk entry.",
    suggest:
      "16:10 soft macro photo of fingers forming letter B against a pale notebook, natural side light, no text",
    ratio: "16 / 10",
  },
  {
    id: "guide-vocab",
    n: 15,
    src: "/graphics/15.png",
    where: "#/guide · Vocabulary card",
    why: "Preview art for the vocabulary desk entry.",
    suggest:
      "16:10 calm still-life of flashcards fanned beside a quiet coffee cup, warm desk light, blank cards only",
    ratio: "16 / 10",
  },
  {
    id: "guide-grammar",
    n: 16,
    src: "/graphics/16.png",
    where: "#/guide · Grammar desk card",
    why: "Preview art for the grammar tile builder.",
    suggest:
      "16:10 abstract flat illustration of gloss tiles arranging into a sentence arc, muted blue and gray, no readable letters",
    ratio: "16 / 10",
  },
  {
    id: "guide-space",
    n: 17,
    src: "/graphics/17.png",
    where: "#/guide · Signing space card",
    why: "Preview art for loci and classifiers.",
    suggest:
      "16:10 soft 3D diagram of a torso bubble with left/right locus dots, cool gray studio, no labels",
    ratio: "16 / 10",
  },
  {
    id: "guide-practice",
    n: 18,
    src: "/graphics/18.png",
    where: "#/guide · Open practice card",
    why: "Preview art for free practice.",
    suggest:
      "16:10 photo of hands mid-practice in front of a blurred laptop screen, shallow depth, cool daylight, no UI text",
    ratio: "16 / 10",
  },
  {
    id: "lesson-complete",
    n: 19,
    src: "/graphics/19.png",
    where: "#/lesson/* · Lesson complete",
    why: "Celebrates finishing without loud confetti or neon.",
    suggest:
      "16:9 soft celebratory still of open palms catching warm morning light, gentle bokeh, muted greens, no confetti clutter, no text",
    ratio: "16 / 9",
  },
  {
    id: "hearts-out",
    n: 20,
    src: "/graphics/20.png",
    where: "#/lesson/* · No hearts left",
    why: "Softens the wait for a heart restore.",
    suggest:
      "4:3 quiet illustration of five outline hearts on a soft gray desk, one slowly filling with warm rose, no neon, no text",
    ratio: "4 / 3",
  },
  {
    id: "record-empty",
    n: 21,
    src: "/graphics/21.png",
    where: "#/record · empty covered list",
    why: "Encourages first lesson checks when nothing is covered yet.",
    suggest:
      "4:3 empty-state illustration of a blank ledger with a faint hand silhouette watermark, soft gray-blue, no text",
    ratio: "4 / 3",
  },
  {
    id: "reference-social",
    n: 22,
    src: "/graphics/22.png",
    where: "#/reference · Social rules",
    why: "Makes “in the room” habits feel human, not only prose.",
    suggest:
      "16:9 respectful editorial photo of a small circle of people signing, soft window light, calm room, faces partially turned, no text",
    ratio: "16 / 9",
  },
  {
    id: "basics-desk",
    n: 23,
    src: "/graphics/23.png",
    where: "#/basics · desk header",
    why: "Anchors the alphabet / parameters desk with a visual cue.",
    suggest:
      "16:9 clean illustration of A–E handshapes as soft schematic plates on a white desk, blue accent dots, no letters as typography overlays",
    ratio: "16 / 9",
  },
  {
    id: "vocab-desk",
    n: 24,
    where: "#/vocab · desk header",
    why: "Gives the topic map a welcoming cover image.",
    suggest:
      "16:9 collage-like soft photo: coffee cup, family silhouette, color swatches, school book — all slightly out of focus, no labels",
    ratio: "16 / 9",
  },
  {
    id: "grammar-desk",
    n: 25,
    where: "#/grammar · desk header",
    why: "Visual for building gloss from tiles.",
    suggest:
      "3:2 top-down of gloss tile chips arranged into a short sentence line on a pale desk, soft shadows, chips blank or abstract marks only",
    ratio: "3 / 2",
  },
  {
    id: "space-desk",
    n: 26,
    where: "#/space · desk header",
    why: "Shows loci and directional space before the interactive map.",
    suggest:
      "1:1 abstract 3D scene of left/right signing loci as soft glowing orbs in front of a torso silhouette, calm blue-gray light, no text",
    ratio: "1 / 1",
  },
  {
    id: "practice-desk",
    n: 27,
    where: "#/practice · desk header",
    why: "Marks free practice as a quieter workspace.",
    suggest:
      "16:9 photo of an empty practice desk with a notepad and soft lamp, evening study mood, no readable writing",
    ratio: "16 / 9",
  },
  {
    id: "account-welcome",
    n: 28,
    where: "#/account · sign-in",
    why: "Welcomes sync without looking like a generic auth template.",
    suggest:
      "4:3 quiet illustration of a keycard resting on a pale desk beside a closed notebook, soft daylight, no brand marks",
    ratio: "4 / 3",
  },
  {
    id: "record-hero",
    n: 29,
    where: "#/record · page hero",
    why: "Gives the covered-signs record a quiet journal mood.",
    suggest:
      "21:9 soft wide photo of a progress journal open on a gray desk with a pen resting across blank lines, natural light, no readable writing",
    ratio: "21 / 9",
  },
  {
    id: "record-filter-empty",
    n: 30,
    where: "#/record · empty filtered view",
    why: "Softens “nothing in this filter” without looking broken.",
    suggest:
      "16:9 quiet abstract of filter chips floating above an empty tray, muted Apple gray palette, no labels",
    ratio: "16 / 9",
  },
  {
    id: "reference-hero",
    n: 31,
    where: "#/reference · page hero",
    why: "Frames the quick-reference desk before handshapes begin.",
    suggest:
      "21:9 wide calm photo of a reference desk with handshape plates faintly out of focus, soft gray canvas, no readable labels",
    ratio: "21 / 9",
  },
  {
    id: "account-signed-in",
    n: 32,
    where: "#/account · signed in",
    why: "Celebrates sync quietly when the account is already open.",
    suggest:
      "16:9 soft abstract of a synced cloud silhouette dissolving into a notebook page, cool gray-blue, no logos",
    ratio: "16 / 9",
  },
];

/** Unit card art ids in path order (Unit 1…4). */
export const UNIT_GRAPHIC_IDS = ["unit-foundations", "unit-words", "unit-grammar", "unit-space"];

/** Guidebook desk card art ids in desk order. */
export const GUIDE_DESK_GRAPHIC_IDS = ["guide-basics", "guide-vocab", "guide-grammar", "guide-space", "guide-practice"];

const byId = new Map(GRAPHICS.map((entry) => [entry.id, entry]));

/** Look up a slot by stable id. */
export function graphic(id) {
  const entry = byId.get(id);
  if (!entry) throw new Error(`Unknown graphic slot: ${id}`);
  return entry;
}

/** Visible + accessible label: “#3 — Suggested: …” */
export function graphicLabel(entry) {
  return `#${entry.n} — Suggested: ${entry.suggest}`;
}
