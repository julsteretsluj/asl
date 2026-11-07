const ENGLISH_FUNCTION = new Set([
  "A",
  "AN",
  "THE",
  "IS",
  "ARE",
  "WAS",
  "WERE",
  "AM",
  "IM",
  "I'M",
  "OF",
  "AND",
  "BECAUSE",
  "WILL",
  "BE",
  "AT",
  "TO",
  "THEN",
  "GOING",
  "DO",
  "DOES",
  "DID",
  "IT",
  "MY",
  "ON",
  "FOR",
  "FROM",
  "WITH",
  "SO",
  "BUT",
  "OR",
]);

export const DRILLS = [
  {
    id: "store",
    title: "Yes / no",
    english: "Are you going to the store tomorrow?",
    model: "TOMORROW STORE YOU GO [q]",
    pass: "Time opens, the store is the topic, YOU GO is the comment, and the question is marked.",
    tiles: ["TOMORROW", "STORE", "YOU", "GO", "[q]", "THE", "ARE", "TO", "GOING"],
    stage: [
      { gloss: "TOMORROW", hint: "Time. This sign opens the sentence." },
      { gloss: "STORE", hint: "Topic. Name the place before you say what happens there." },
      { gloss: "YOU", hint: "The person, inside the comment." },
      { gloss: "GO", hint: "The action." },
      {
        gloss: "[q]",
        hint: "Yes/no question. Eyebrows raise, and the head tips slightly forward.",
        tag: "QUESTION",
        brows: "up",
      },
    ],
  },
  {
    id: "rain",
    title: "If / then",
    english: "If it rains tomorrow, I will sit at my desk.",
    model: "[cond] TOMORROW RAIN, [nod] I DESK SIT",
    pass: "The if-clause is marked, and the result follows it.",
    tiles: ["[cond]", "TOMORROW", "RAIN", "[nod]", "I", "DESK", "SIT", "IF", "WILL", "AT", "THE"],
    stage: [
      {
        gloss: "[cond]",
        hint: "Raised eyebrows through the whole if-clause.",
        tag: "IF",
        brows: "up",
      },
      { gloss: "TOMORROW", hint: "Time still comes first, inside the condition." },
      { gloss: "RAIN", hint: "The condition itself." },
      {
        gloss: "[nod]",
        hint: "A nod releases the eyebrows and starts the result.",
        tag: "NOD",
        brows: "nod",
      },
      { gloss: "I", hint: "Who, in the result." },
      { gloss: "DESK", hint: "Place before the verb." },
      { gloss: "SIT", hint: "The result." },
    ],
  },
  {
    id: "party",
    title: "Rhetorical why",
    english: "I'm not going to the party because I'm tired.",
    model: "PARTY I NOT GO, WHY? [rhq] I TIRED",
    pass: "The reason is a rhetorical question: situation, WHY?, then the answer.",
    tiles: ["PARTY", "I", "NOT", "GO", "WHY?", "[rhq]", "I", "TIRED", "BECAUSE", "AM"],
    stage: [
      { gloss: "PARTY", hint: "Topic. The event you are declining." },
      { gloss: "I", hint: "Who." },
      { gloss: "NOT", hint: "Negation before the verb." },
      { gloss: "GO", hint: "The comment." },
      {
        gloss: "WHY? [rhq]",
        hint: "You ask and you will answer. Eyebrows rise on WHY.",
        tag: "WHY",
        brows: "up",
      },
      { gloss: "I", hint: "Start the reason as its own short clause." },
      { gloss: "TIRED", hint: "The answer. This replaces because." },
    ],
  },
  {
    id: "why",
    title: "Wh-question",
    english: "Why are you going to the store?",
    model: "STORE YOU GO WHY? [wh-q]",
    pass: "The place is the topic, YOU GO is the comment, and WHY closes the question.",
    tiles: ["STORE", "YOU", "GO", "WHY?", "[wh-q]", "ARE", "THE", "TO", "[q]"],
    stage: [
      { gloss: "STORE", hint: "Topic first." },
      { gloss: "YOU", hint: "Person." },
      { gloss: "GO", hint: "Action." },
      {
        gloss: "WHY? [wh-q]",
        hint: "Wh-questions furrow the eyebrows. The wh-sign usually lands at the end.",
        tag: "WHY",
        brows: "down",
      },
    ],
  },
];

export function tokenize(input) {
  if (!input || !String(input).trim()) return [];
  return String(input)
    .trim()
    .replace(/[“”]/g, '"')
    .replace(/[’]/g, "'")
    .replace(/,/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

export function normalizeToken(token) {
  const compact = String(token).trim();
  const questionPunct = compact.endsWith("?");
  const core = compact.replace(/\?+$/g, "");
  const bracket = core.startsWith("[") && core.endsWith("]");
  const key = bracket ? core.toLowerCase() : core.toUpperCase();
  return {
    raw: token,
    key,
    questionPunct,
    isMarker: bracket,
    hasLower: /[a-z]/.test(core) && !bracket,
  };
}

function indexOfKey(tokens, key) {
  return tokens.findIndex((token) => token.key === key);
}

function verbIndex(tokens) {
  const goTo = indexOfKey(tokens, "GO-TO");
  if (goTo >= 0) return goTo;
  return indexOfKey(tokens, "GO");
}

function warnExtras(tokens, allowed, notes) {
  const extras = [];
  for (const token of tokens) {
    if (allowed.has(token.key) || ENGLISH_FUNCTION.has(token.key)) continue;
    if (!extras.includes(token.key)) extras.push(token.key);
  }
  if (extras.length) {
    notes.push({
      tone: "warn",
      text: `These signs are outside this sentence: ${extras.join(", ")}.`,
    });
  }
}

function gradeStore(tokens, notes) {
  const keys = tokens.map((token) => token.key);
  for (const need of ["TOMORROW", "STORE", "YOU"]) {
    if (!keys.includes(need)) {
      notes.push({ tone: "bad", text: `Add ${need}.` });
    }
  }
  const verbAt = verbIndex(tokens);
  if (verbAt < 0 && !keys.includes("GOING")) {
    notes.push({ tone: "bad", text: "Add the verb GO, or the single sign GO-TO." });
  }
  const time = indexOfKey(tokens, "TOMORROW");
  const topic = indexOfKey(tokens, "STORE");
  const person = indexOfKey(tokens, "YOU");
  if (time >= 0 && topic >= 0 && person >= 0 && verbAt >= 0) {
    if (!(time < topic && topic < person && person < verbAt)) {
      notes.push({
        tone: "bad",
        text: "Use this order: TOMORROW, then STORE, then YOU GO.",
      });
    }
  }
  const firstContent = tokens.findIndex((token) => !token.isMarker && token.key !== "QUESTION");
  if (time >= 0 && firstContent !== time) {
    notes.push({
      tone: "bad",
      text: "TOMORROW opens the sentence. Time is signed before the topic.",
    });
  }
  const asked = tokens.some(
    (token) => token.key === "[q]" || token.questionPunct || token.key === "QUESTION",
  );
  if (!asked) {
    notes.push({
      tone: "bad",
      text: "Mark the yes/no question with [q], a question mark, or the manual tag QUESTION.",
    });
  } else if (!tokens.some((token) => token.key === "[q]" || token.questionPunct)) {
    notes.push({
      tone: "warn",
      text: "QUESTION is the manual tag. Add [q] when you also want the raised eyebrows written down.",
    });
  }
  if (keys.includes("[wh-q]")) {
    notes.push({
      tone: "bad",
      text: "[wh-q] furrows the brows for who, what, where, when, why, and how. This sentence is yes/no, so it takes [q].",
    });
  }
  if (keys.includes("WHY")) {
    notes.push({
      tone: "bad",
      text: "WHY would make a wh-question. This English sentence asks for yes or no.",
    });
  }
  warnExtras(
    tokens,
    new Set(["TOMORROW", "STORE", "YOU", "GO", "GO-TO", "[q]", "QUESTION"]),
    notes,
  );
}

function gradeRain(tokens, notes) {
  const keys = tokens.map((token) => token.key);
  for (const need of ["TOMORROW", "RAIN", "I", "DESK", "SIT"]) {
    if (!keys.includes(need)) notes.push({ tone: "bad", text: `Add ${need}.` });
  }
  const condAt = tokens.findIndex((token) => token.key === "[cond]" || token.key === "IF");
  if (condAt < 0) {
    notes.push({
      tone: "bad",
      text: "Mark the if-clause with [cond], or open it with the manual tag IF.",
    });
  }
  const rain = indexOfKey(tokens, "RAIN");
  const sit = indexOfKey(tokens, "SIT");
  const desk = indexOfKey(tokens, "DESK");
  const tomorrow = indexOfKey(tokens, "TOMORROW");
  if (condAt >= 0 && rain >= 0 && condAt > rain) {
    notes.push({
      tone: "bad",
      text: "Put the condition marker before RAIN. The eyebrows stay up through that clause.",
    });
  }
  if (tomorrow >= 0 && rain >= 0 && tomorrow > rain) {
    notes.push({ tone: "bad", text: "Inside the condition, TOMORROW still comes before RAIN." });
  }
  if (rain >= 0 && sit >= 0 && rain > sit) {
    notes.push({ tone: "bad", text: "Finish RAIN before the result SIT." });
  }
  if (desk >= 0 && sit >= 0 && desk > sit) {
    notes.push({ tone: "bad", text: "DESK is the place. Sign it before SIT." });
  }
  if (!keys.includes("[nod]")) {
    notes.push({
      tone: "warn",
      text: "A nod can release the if-clause. Write [nod] before I DESK SIT.",
    });
  } else if (sit >= 0 && indexOfKey(tokens, "[nod]") > sit) {
    notes.push({ tone: "warn", text: "Move [nod] so it lands with the result, before SIT." });
  }
  if (keys.includes("IF") && !keys.includes("[cond]")) {
    notes.push({
      tone: "warn",
      text: "IF is a manual tag. [cond] is the written marker for raised eyebrows on the if-clause.",
    });
  }
  if (keys.includes("IF") && keys.includes("[cond]")) {
    notes.push({
      tone: "warn",
      text: "IF and [cond] mark the same clause. One of them is enough.",
    });
  }
  warnExtras(
    tokens,
    new Set(["[cond]", "IF", "TOMORROW", "RAIN", "[nod]", "NOD", "I", "DESK", "SIT"]),
    notes,
  );
}

function gradeParty(tokens, notes) {
  const keys = tokens.map((token) => token.key);
  if (keys.includes("BECAUSE")) {
    notes.push({
      tone: "bad",
      text: "Leave BECAUSE out. Give the situation, ask WHY? with [rhq], then answer it.",
    });
  }
  for (const need of ["PARTY", "WHY", "TIRED"]) {
    if (!keys.includes(need)) notes.push({ tone: "bad", text: `Add ${need}.` });
  }
  const iCount = keys.filter((key) => key === "I").length;
  if (iCount === 0) notes.push({ tone: "bad", text: "Add I." });
  if (iCount === 1) {
    notes.push({
      tone: "warn",
      text: "The model repeats I before the reason: I TIRED.",
    });
  }
  const hasNotGo = keys.includes("NOT-GO") || (keys.includes("NOT") && keys.includes("GO"));
  if (!hasNotGo) {
    notes.push({ tone: "bad", text: "The comment is NOT GO, or the single sign NOT-GO." });
  }
  const party = indexOfKey(tokens, "PARTY");
  const go = keys.includes("NOT-GO") ? indexOfKey(tokens, "NOT-GO") : indexOfKey(tokens, "GO");
  const notAt = indexOfKey(tokens, "NOT");
  const why = indexOfKey(tokens, "WHY");
  const tired = indexOfKey(tokens, "TIRED");
  if (party >= 0 && go >= 0 && party > go) {
    notes.push({ tone: "bad", text: "PARTY is the topic. Sign it before NOT GO." });
  }
  if (notAt >= 0 && go >= 0 && keys.includes("GO") && notAt > go) {
    notes.push({ tone: "bad", text: "Put NOT before GO." });
  }
  if (why >= 0 && go >= 0 && why < go) {
    notes.push({ tone: "bad", text: "Finish NOT GO before the rhetorical WHY?." });
  }
  if (why >= 0 && tired >= 0 && why > tired) {
    notes.push({ tone: "bad", text: "Ask WHY?, then answer with TIRED." });
  }
  if (!keys.includes("[rhq]")) {
    notes.push({
      tone: "bad",
      text: "Mark that WHY? with [rhq]. You are asking a question you will answer yourself, with raised eyebrows.",
    });
  }
  warnExtras(
    tokens,
    new Set(["PARTY", "I", "NOT", "GO", "NOT-GO", "WHY", "[rhq]", "TIRED"]),
    notes,
  );
}

function gradeWhy(tokens, notes) {
  const keys = tokens.map((token) => token.key);
  for (const need of ["STORE", "YOU", "WHY"]) {
    if (!keys.includes(need)) notes.push({ tone: "bad", text: `Add ${need}.` });
  }
  const verbAt = verbIndex(tokens);
  if (verbAt < 0) notes.push({ tone: "bad", text: "Add GO." });
  const store = indexOfKey(tokens, "STORE");
  const you = indexOfKey(tokens, "YOU");
  const why = indexOfKey(tokens, "WHY");
  if (store >= 0 && you >= 0 && verbAt >= 0 && why >= 0) {
    if (!(store < you && you < verbAt && verbAt < why)) {
      notes.push({
        tone: "bad",
        text: "Order the gloss STORE YOU GO WHY?. The wh-word closes the sentence.",
      });
    }
  }
  if (!keys.includes("[wh-q]")) {
    notes.push({
      tone: "bad",
      text: "Add [wh-q]. Wh-questions furrow the eyebrows, which is a different mark from yes/no [q].",
    });
  }
  if (keys.includes("[q]")) {
    notes.push({
      tone: "bad",
      text: "[q] is the yes/no marker. This question uses WHY, so the marker is [wh-q].",
    });
  }
  warnExtras(tokens, new Set(["STORE", "YOU", "GO", "GO-TO", "WHY", "[wh-q]"]), notes);
}

const GRADERS = {
  store: gradeStore,
  rain: gradeRain,
  party: gradeParty,
  why: gradeWhy,
};

export function analyze(input, drillId) {
  const drill = DRILLS.find((item) => item.id === drillId);
  if (!drill) {
    return { status: "empty", summary: "Choose a sentence.", notes: [] };
  }
  const tokens = tokenize(input).map(normalizeToken);
  if (tokens.length === 0) {
    return {
      status: "empty",
      summary: "Write the gloss in signs, then check it.",
      notes: [],
    };
  }

  const notes = [];
  if (tokens.some((token) => token.hasLower)) {
    notes.push({
      tone: "warn",
      text: "Classroom gloss writes signs in ALL-CAPS. Markers stay in brackets, like [q].",
    });
  }

  const keys = tokens.map((token) => token.key);
  let functionHits = keys.filter((key) => ENGLISH_FUNCTION.has(key));
  if (functionHits.includes("GOING")) {
    notes.push({
      tone: "bad",
      text: "Use GO. The English word going does not keep -ing in this gloss.",
    });
    functionHits = functionHits.filter((key) => key !== "GOING");
  }
  if (functionHits.includes("TO") && (keys.includes("GO") || keys.includes("GO-TO"))) {
    notes.push({
      tone: "bad",
      text: "Write GO, or the single sign GO-TO. A separate TO is an English preposition.",
    });
    functionHits = functionHits.filter((key) => key !== "TO");
  }
  if (drill.id === "party") {
    functionHits = functionHits.filter((key) => key !== "BECAUSE");
  }
  const uniqueFunctions = [...new Set(functionHits)];
  if (uniqueFunctions.length) {
    notes.push({
      tone: "bad",
      text: `Leave out the English function word${uniqueFunctions.length > 1 ? "s" : ""}: ${uniqueFunctions.join(", ")}.`,
    });
  }

  GRADERS[drill.id](tokens, notes);
  const bad = notes.some((note) => note.tone === "bad");
  return {
    status: bad ? "revise" : "pass",
    summary: bad
      ? "The order or the word list still needs a change."
      : drill.pass,
    notes,
    gloss: tokens.map((token) => (token.questionPunct ? `${token.key}?` : token.key)).join(" "),
  };
}

export function makeTiles(drill) {
  return drill.tiles.map((label, index) => ({
    id: `${drill.id}-${index}`,
    label,
  }));
}

export function spellGloss(text) {
  const letters = String(text).toUpperCase().replace(/[^A-Z]/g, "").slice(0, 24);
  return letters.split("").join("-");
}

export function spellLetters(text) {
  return String(text)
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 24)
    .split("");
}
