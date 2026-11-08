import { VOCAB } from "./data.js";

const GLOSSES = [...new Set(VOCAB.map((item) => item.gloss))].sort((a, b) => b.split(" ").length - a.split(" ").length || b.length - a.length);

const SPECIFIC = {
  "gloss-signs": [
    [0, "gloss-caps", "Signs are written in capital letters"],
    [1, "hyphen-one-sign", "A hyphen can join one sign"],
    [2, "fingerspell-name", "Hyphens between letters mean fingerspelling"],
    [3, "repeat-plus", "++ means repeat the sign"],
    [4, "letters-vs-sign", "Single letters with hyphens are the alphabet"],
  ],
  "gloss-order": [
    [0, "time-first", "Time opens the sentence"],
    [1, "topic-before-comment", "The topic comes before the comment"],
    [2, "yes-no-order", "Yes/no order is time, topic, comment, [q]"],
    [3, "q-brows", "[q] is raised eyebrows"],
    [4, "comment", "The comment is what you say about the topic"],
  ],
  "gloss-omit": [
    [0, "drop-articles", "Articles drop out of gloss"],
    [1, "drop-be", "is, am, and are drop out"],
    [2, "go-not-going", "Use GO, not GOING"],
    [3, "drop-to", "A separate TO is usually omitted"],
    [4, "rhetorical-why", "A reason can be a rhetorical WHY?"],
  ],
  alphabet: [
    [0, "letter-a", "A keeps the thumb beside the fist"],
    [1, "letter-s", "S crosses the thumb in front"],
    [2, "letter-u", "U holds two fingers together"],
    [3, "letter-j", "J keeps the I hand and traces a path"],
    [4, "fingerspell-hyphens", "Fingerspelling puts a hyphen between letters"],
  ],
  "yes-no": [
    [0, "yes-no-build", "Yes/no gloss drops the, are, to, and going"],
    [2, "type-yes-no", "A yes/no gloss can be typed in signs"],
    [3, "question-tag", "QUESTION can stand in for [q]"],
  ],
  condition: [
    [0, "cond-brows", "[cond] keeps the eyebrows raised"],
    [2, "nod-release", "[nod] releases the if-clause"],
    [4, "type-conditional", "IF can replace [cond]"],
  ],
  because: [
    [0, "rhq-instead", "WHY? [rhq] replaces because"],
    [2, "rhq-brows", "A rhetorical WHY? uses raised eyebrows"],
  ],
  indexing: [
    [0, "index-point", "A point sets a person in space"],
    [1, "verb-path", "A directional verb names its start and end"],
    [4, "help-direction", "me-HELP-right starts at you"],
  ],
  classifiers: [
    [0, "cl-b", "CL:B stands in for a flat surface"],
    [1, "cl-c", "CL:C stands in for a cup"],
    [2, "name-then-classifier", "Name the thing, then use the classifier"],
  ],
  pairs: [
    [0, "summer-ugly", "SUMMER and UGLY differ by place and path"],
    [1, "apple-onion", "APPLE and ONION differ by location"],
    [2, "candy-apple", "CANDY and APPLE differ by handshape"],
    [3, "father-mother-place", "FATHER and MOTHER differ by location"],
    [4, "parameter", "A parameter is one piece of a sign"],
  ],
};

function concept(lesson, key, label) {
  return { kind: "concept", key, label, category: lesson.unitTitle || "Concepts" };
}

function tokenize(text) {
  return String(text || "")
    .split(/\s+/)
    .filter(Boolean)
    .map((token) => (token.startsWith("[") ? token.toLowerCase() : token.toUpperCase()));
}

function glossesIn(text) {
  const tokens = tokenize(text);
  const found = [];
  let index = 0;
  while (index < tokens.length) {
    const gloss = GLOSSES.find((candidate) => {
      const parts = tokenize(candidate);
      return parts.every((part, offset) => tokens[index + offset] === part);
    });
    if (!gloss) {
      index += 1;
      continue;
    }
    found.push(gloss);
    index += tokenize(gloss).length;
  }
  return found;
}

function exerciseText(exercise) {
  if (exercise.type === "match") return exercise.pairs.map((pair) => pair.b).join(" ");
  if (exercise.type === "bank") return exercise.answer.join(" ");
  if (exercise.type === "blank") return [exercise.before, exercise.answer, exercise.after].filter(Boolean).join(" ");
  if (exercise.type === "choice") return exercise.answer;
  if (exercise.type === "type") return exercise.model || "";
  return "";
}

function wordItem(gloss) {
  const matches = VOCAB.filter((item) => item.gloss === gloss);
  return {
    kind: "word",
    key: gloss,
    label: matches.length === 1 ? matches[0].term : gloss,
    gloss,
    category: matches[0]?.category || "Signs",
  };
}

export function itemsInExercise(lesson, exercise) {
  const index = lesson.exercises.indexOf(exercise);
  const concepts = (SPECIFIC[lesson.id] || [])
    .filter((row) => row[0] === index)
    .map((row) => concept(lesson, row[1], row[2]));
  if (!SPECIFIC[lesson.id] && lesson.tip && (index === 0 || index === lesson.exercises.length - 1)) {
    concepts.push(concept(lesson, lesson.id, lesson.tip));
  }
  const words = [...new Set(glossesIn(exerciseText(exercise)))].map(wordItem);
  return [...concepts, ...words];
}

export function itemId(item) {
  return `${item.kind}:${item.key}`.replaceAll("/", "-");
}

export function statusOf(item) {
  const correct = Number(item.correct) || 0;
  const miss = Number(item.miss) || 0;
  if (correct + miss <= 0) return "new";
  if (correct >= 2 && correct > miss) return "mastered";
  return "practicing";
}

export function summarize(progress) {
  const items = Object.values(progress.items || {});
  const words = items.filter((item) => item.kind === "word");
  const concepts = items.filter((item) => item.kind === "concept");
  const count = (list, status) => list.filter((item) => statusOf(item) === status).length;
  return {
    words: words.length,
    wordsMastered: count(words, "mastered"),
    concepts: concepts.length,
    conceptsMastered: count(concepts, "mastered"),
  };
}
