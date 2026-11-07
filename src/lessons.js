import { analyze, normalizeToken, tokenize } from "./gloss.js";
import { TOPIC_UNITS } from "./topics.js";

function choice(prompt, options, answer, explain, extra = {}) {
  return {
    type: "choice",
    prompt,
    options: options.map((label) => ({ id: label, label })),
    answer,
    explain,
    ...extra,
  };
}

function blank(prompt, before, after, options, answer, explain) {
  return { type: "blank", prompt, before, after, options, answer, explain };
}

function bank(prompt, tiles, answer, explain) {
  return { type: "bank", prompt, tiles, answer, explain };
}

function typed(prompt, drillId, model, explain) {
  return { type: "type", prompt, drillId, model, explain };
}

function match(prompt, pairs) {
  return {
    type: "match",
    prompt,
    pairs: pairs.map(([a, b], index) => ({ id: String(index), a, b })),
    explain: "Each English idea has one gloss.",
  };
}

export const UNITS = [
  {
    id: "foundations",
    title: "Foundations",
    guide: "#/basics",
    guideLabel: "Gloss notes",
    lessons: [
      {
        id: "gloss-signs",
        title: "Signs, not spellings",
        tip: "A gloss writes the sign. Capital letters are signs. A hyphen joins English words that are one sign, or the letters of a fingerspelled word.",
        exercises: [
          choice(
            "How does classroom gloss write a sign?",
            ["ALL-CAPS", "In quotation marks", "In sentence case"],
            "ALL-CAPS",
            "BOOK, STORE, and GO are written in capital letters.",
          ),
          choice(
            "DON'T-KNOW in a gloss is…",
            ["One sign", "Two signs", "A fingerspelled word"],
            "One sign",
            "The hyphen means those English words are produced as a single sign.",
          ),
          choice(
            "J-U-L-E-S means…",
            ["Fingerspell the name", "The sign for name", "A classifier for a person"],
            "Fingerspell the name",
            "Hyphens between single letters mean fingerspelling.",
          ),
          choice(
            "What does SAFE++ ask you to do?",
            ["Repeat the sign", "Fingerspell SAFE", "Add a question face"],
            "Repeat the sign",
            "A plus-plus marks repetition, for a plural sense or for intensity.",
          ),
          choice(
            "Which of these is fingerspelling?",
            ["S-A-M", "STORE", "THANK-YOU"],
            "S-A-M",
            "Single letters with hyphens are the manual alphabet. THANK-YOU is one sign.",
          ),
        ],
      },
      {
        id: "gloss-order",
        title: "Time, then topic",
        tip: "A useful beginner order is time, then the topic or place, then the comment. Yes/no questions take [q], with the eyebrows raised.",
        exercises: [
          choice(
            "Where does TOMORROW go in “Are you going to the store tomorrow?”",
            ["First", "After YOU", "At the end, with [q]"],
            "First",
            "Time opens the sentence.",
          ),
          blank(
            "Fill the topic.",
            "TOMORROW",
            "YOU GO [q]",
            ["STORE", "THE", "ARE"],
            "STORE",
            "The place is the topic, and it comes before YOU GO.",
          ),
          bank(
            "Build the gloss.",
            ["TOMORROW", "STORE", "YOU", "GO", "[q]", "THE", "ARE", "GOING"],
            ["TOMORROW", "STORE", "YOU", "GO", "[q]"],
            "Time, place, person, verb, then the yes/no marker.",
          ),
          choice(
            "[q] tells you…",
            ["Yes/no, brows up", "Wh-question, brows down", "A conditional"],
            "Yes/no, brows up",
            "Raised eyebrows and a small forward head tilt are the yes/no marker. The manual tag is QUESTION.",
          ),
          choice(
            "YOU GO is the…",
            ["Comment", "Time marker", "Fingerspelling"],
            "Comment",
            "The comment is what you are saying about the topic.",
          ),
        ],
      },
      {
        id: "gloss-omit",
        title: "What drops out",
        tip: "Gloss leaves out articles, the verb to be, and many small English connectors. The signs, the order, and the face carry that work.",
        exercises: [
          choice(
            "Which word is left out of STORE YOU GO?",
            ["the", "STORE", "GO"],
            "the",
            "Articles are not separate signs.",
          ),
          choice(
            "“I am fine” glosses as…",
            ["I FINE", "I AM FINE", "FINE IS"],
            "I FINE",
            "is, am, and are drop out.",
          ),
          choice(
            "The English word going becomes…",
            ["GO", "GOING", "GO-ING"],
            "GO",
            "The -ing ending is not its own sign here.",
          ),
          choice(
            "A separate TO in “go to the store” is…",
            ["Omitted, or folded into GO-TO", "Always signed as TO", "Fingerspelled"],
            "Omitted, or folded into GO-TO",
            "GO-TO, when you need it, is one sign. A lone TO is the English preposition.",
          ),
          choice(
            "because in “I'm tired, so I'm not going” is handled by…",
            ["A rhetorical WHY?", "The sign BECAUSE", "The sign AND"],
            "A rhetorical WHY?",
            "State it, ask WHY? with [rhq], then answer.",
          ),
        ],
      },
      {
        id: "alphabet",
        title: "Handshapes",
        tip: "These diagrams are schematics. The Lifeprint alphabet is the filmed model. Watch the thumb: that is what separates A from S.",
        exercises: [
          choice(
            "Which letter is this fist? The thumb stands at the side.",
            ["A", "S", "T"],
            "A",
            "A keeps the thumb beside the index. S crosses the thumb in front.",
            { letter: "A" },
          ),
          choice(
            "Which letter crosses the thumb over the fingers?",
            ["S", "A", "B"],
            "S",
            "Same fist as A. The thumb lies across the front.",
            { letter: "S" },
          ),
          choice(
            "Index and middle together, pointing up.",
            ["U", "V", "R"],
            "U",
            "V opens a gap between those two fingers. R crosses them.",
            { letter: "U" },
          ),
          choice(
            "What makes J different from I?",
            ["The pinky traces a J", "The thumb pops out", "The palm turns down"],
            "The pinky traces a J",
            "The handshape stays I. The path is the letter.",
            { letter: "J" },
          ),
          choice(
            "How do you fingerspell Sam?",
            ["S-A-M", "SAM", "S-A-M-M"],
            "S-A-M",
            "One hyphen between each letter. A doubled letter would bounce or slide.",
          ),
        ],
      },
    ],
  },
  {
    id: "words",
    title: "First signs",
    guide: "#/vocab",
    guideLabel: "Vocabulary list",
    lessons: [
      {
        id: "greetings",
        title: "Greetings",
        tip: "A greeting can be one sign even when English uses two words. HOW YOU is a yes/no question.",
        exercises: [
          match("Tap the matching pairs.", [
            ["Hello", "HELLO"],
            ["Thank you", "THANK-YOU"],
            ["Please", "PLEASE"],
            ["Sorry", "SORRY"],
          ]),
          choice(
            "“How are you?” glosses as…",
            ["HOW YOU [q]", "HOW ARE YOU", "YOU HOW?"],
            "HOW YOU [q]",
            "Raised eyebrows, or the manual tag QUESTION.",
          ),
          choice(
            "“I am fine” glosses as…",
            ["I FINE", "I AM FINE", "FINE YOU"],
            "I FINE",
            "The copula drops.",
          ),
          choice(
            "THANK-YOU is…",
            ["One sign", "Two signs", "Fingerspelling"],
            "One sign",
            "The flat hand moves forward from the chin.",
          ),
          choice(
            "NICE MEET YOU leaves out…",
            ["to", "NICE", "YOU"],
            "to",
            "The English to is not a separate sign in this phrase.",
          ),
        ],
      },
      {
        id: "pronouns",
        title: "Points",
        tip: "Pronouns point. I touches your chest. YOU points forward. Another person is a point in the space you already gave them. That point does not mark gender.",
        exercises: [
          choice(
            "The sign I is…",
            ["A point to your chest", "A fingerspelled I", "An open hand on the chin"],
            "A point to your chest",
            "Index finger, a short tap at the center of the chest.",
          ),
          choice(
            "English he, she, and singular they are glossed as…",
            ["IX, a point in space", "HE or SHE", "THEY always"],
            "IX, a point in space",
            "Set the person on the left or the right, then point there.",
          ),
          match("Tap the matching pairs.", [
            ["I / me", "I"],
            ["You", "YOU"],
            ["We", "WE"],
            ["A person in space", "IX"],
          ]),
          choice(
            "[index-left] means…",
            ["Point to the place on your left", "Look left", "Fingerspell LEFT"],
            "Point to the place on your left",
            "The point is the pronoun for whoever you put there.",
          ),
          blank(
            "Finish the gloss for “you”.",
            "",
            "",
            ["YOU", "HE", "THE"],
            "YOU",
            "Point forward. That is the whole pronoun.",
          ),
        ],
      },
      {
        id: "time-words",
        title: "Time signs",
        tip: "TOMORROW arcs forward from the cheek. YESTERDAY moves back. Whichever time you use, it still opens the sentence.",
        exercises: [
          choice(
            "TOMORROW moves…",
            ["Forward from the cheek", "Back toward the shoulder", "Down from the waist"],
            "Forward from the cheek",
            "Thumb on the cheek, then an arc forward.",
          ),
          choice(
            "YESTERDAY moves…",
            ["Back from the cheek", "Forward from the cheek", "In a circle on the chest"],
            "Back from the cheek",
            "The same thumb, sent backward.",
          ),
          match("Tap the matching pairs.", [
            ["Now", "NOW"],
            ["Today", "TODAY"],
            ["Tomorrow", "TOMORROW"],
            ["Yesterday", "YESTERDAY"],
          ]),
          choice(
            "In a sentence, NOW goes…",
            ["At the start", "Next to the verb only", "After [q]"],
            "At the start",
            "Time markers lead.",
          ),
          blank(
            "Yesterday was the store. Gloss the time.",
            "",
            "STORE I GO",
            ["YESTERDAY", "TOMORROW", "NOW"],
            "YESTERDAY",
            "Past time still occupies the first slot.",
          ),
        ],
      },
      {
        id: "questions",
        title: "Question words",
        tip: "WHO, WHAT, WHERE, WHEN, WHY, and HOW take [wh-q]: brows furrowed, and the wh-sign usually lands at the end. HOW YOU as a check-in is the exception. That one is yes/no.",
        exercises: [
          choice(
            "[wh-q] looks like…",
            ["Brows furrowed", "Brows raised", "A nod"],
            "Brows furrowed",
            "That is a different face from the raised brows of [q].",
          ),
          choice(
            "“Why are you going to the store?” ends with…",
            ["WHY? [wh-q]", "[q]", "BECAUSE"],
            "WHY? [wh-q]",
            "The wh-word closes the sentence.",
          ),
          bank(
            "Build the wh-question.",
            ["STORE", "YOU", "GO", "WHY?", "[wh-q]", "[q]", "ARE", "THE"],
            ["STORE", "YOU", "GO", "WHY?", "[wh-q]"],
            "Topic, comment, then WHY with the furrowed-brow marker.",
          ),
          choice(
            "HOW YOU as “how are you?” takes…",
            ["[q]", "[wh-q]", "[rhq]"],
            "[q]",
            "This greeting is a yes/no check-in, so the brows rise.",
          ),
          match("Tap the matching pairs.", [
            ["Who", "WHO"],
            ["What", "WHAT"],
            ["Where", "WHERE"],
            ["When", "WHEN"],
          ]),
        ],
      },
      {
        id: "emotions",
        title: "Feelings",
        tip: "Classrooms often pair these signs with a matching face. The hand still has a citation form. Size, speed, and repetition can carry the feeling when a mirrored face is too much.",
        exercises: [
          match("Tap the matching pairs.", [
            ["Happy", "HAPPY"],
            ["Sad", "SAD"],
            ["Tired", "TIRED"],
            ["Love", "LOVE"],
          ]),
          choice(
            "HAPPY++ means…",
            ["Repeat the sign, more intensity", "Fingerspell happy", "A yes/no question"],
            "Repeat the sign, more intensity",
            "Repetition is a hand-side way to enlarge the feeling.",
          ),
          choice(
            "With manual cues on, SAD is carried by…",
            ["The sign SAD", "A required frown", "The sign [q]"],
            "The sign SAD",
            "A smaller, slower path can do the rest. The face can stay at rest.",
          ),
          choice(
            "TIRED is produced by…",
            ["Bent hands dropping from the shoulders", "A point to the chest", "A wave from the forehead"],
            "Bent hands dropping from the shoulders",
            "Slow the drop to show how tired.",
          ),
          choice(
            "LOVE is…",
            ["Crossed fists on the chest", "The I-L-Y handshape only", "Fingerspelled"],
            "Crossed fists on the chest",
            "The I-L-Y handshape is a different sign. LOVE hugs the fists in.",
          ),
        ],
      },
    ],
  },
  {
    id: "grammar",
    title: "Sentence patterns",
    guide: "#/grammar",
    guideLabel: "Grammar desk",
    lessons: [
      {
        id: "yes-no",
        title: "Yes / no",
        tip: "TOMORROW STORE YOU GO [q]. Time, topic, comment, raised eyebrows. Type it once after you build it.",
        exercises: [
          bank(
            "Are you going to the store tomorrow?",
            ["TOMORROW", "STORE", "YOU", "GO", "[q]", "THE", "ARE", "TO", "GOING"],
            ["TOMORROW", "STORE", "YOU", "GO", "[q]"],
            "Drop the, are, to, and going.",
          ),
          choice(
            "Which tile does not belong in that gloss?",
            ["GOING", "STORE", "[q]"],
            "GOING",
            "Use GO. The English -ing is not a separate sign.",
          ),
          typed(
            "Type the gloss for “Are you going to the store tomorrow?”",
            "store",
            "TOMORROW STORE YOU GO [q]",
            "Capitals, time first, and a question marker.",
          ),
          choice(
            "A question mark or QUESTION can stand in for…",
            ["[q]", "[wh-q]", "[cond]"],
            "[q]",
            "QUESTION is the manual tag. [q] is the written eyebrow raise.",
          ),
          blank(
            "Mark the question.",
            "TOMORROW STORE YOU GO",
            "",
            ["[q]", "[wh-q]", "[nod]"],
            "[q]",
            "This ask is yes/no.",
          ),
        ],
      },
      {
        id: "condition",
        title: "If, then",
        tip: "Keep the eyebrows up through the if-clause, written [cond] or signed as IF. A nod lets them drop for the result.",
        exercises: [
          choice(
            "During the if-clause, the eyebrows…",
            ["Stay raised", "Furrow", "Close"],
            "Stay raised",
            "[cond] covers that whole clause. The manual tag is IF.",
          ),
          bank(
            "If it rains tomorrow, I will sit at my desk.",
            ["[cond]", "TOMORROW", "RAIN", "[nod]", "I", "DESK", "SIT", "IF", "WILL", "AT", "THE"],
            ["[cond]", "TOMORROW", "RAIN", "[nod]", "I", "DESK", "SIT"],
            "Condition, time, rain, nod, then I DESK SIT.",
          ),
          choice(
            "[nod] sits…",
            ["With the result, before SIT", "Before TOMORROW", "After the sentence, as [q]"],
            "With the result, before SIT",
            "The nod releases the if-clause.",
          ),
          choice(
            "Which word is not a sign in this sentence?",
            ["WILL", "RAIN", "DESK"],
            "WILL",
            "will, at, and the drop out.",
          ),
          typed(
            "Type the conditional gloss.",
            "rain",
            "[cond] TOMORROW RAIN, [nod] I DESK SIT",
            "IF can replace [cond]. A missing nod is noted, and the clause order still has to hold.",
          ),
        ],
      },
      {
        id: "because",
        title: "Instead of because",
        tip: "Give the situation, ask WHY? with the eyebrows up, marked [rhq], then answer it yourself.",
        exercises: [
          choice(
            "I'm not going because I'm tired. The connector is…",
            ["WHY? [rhq]", "BECAUSE", "AND"],
            "WHY? [rhq]",
            "You ask a question you will answer.",
          ),
          bank(
            "I'm not going to the party because I'm tired.",
            ["PARTY", "I", "NOT", "GO", "WHY?", "[rhq]", "I", "TIRED", "BECAUSE", "AM"],
            ["PARTY", "I", "NOT", "GO", "WHY?", "[rhq]", "I", "TIRED"],
            "Topic, NOT GO, rhetorical why, then the reason.",
          ),
          choice(
            "NOT goes…",
            ["Before GO", "After GO", "After TIRED"],
            "Before GO",
            "Negation precedes the verb. NOT-GO can also be one sign.",
          ),
          choice(
            "The eyebrows on a rhetorical WHY? are…",
            ["Raised", "Furrowed", "Neutral the whole time"],
            "Raised",
            "[rhq] is a question you answer. [wh-q] is a question you are asking someone else.",
          ),
          typed(
            "Type the rhetorical gloss.",
            "party",
            "PARTY I NOT GO, WHY? [rhq] I TIRED",
            "Leave BECAUSE out.",
          ),
        ],
      },
    ],
  },
  {
    id: "space",
    title: "Space",
    guide: "#/space",
    guideLabel: "Signing-space map",
    lessons: [
      {
        id: "indexing",
        title: "Put someone in space",
        tip: "Point once to set a person, then aim the verb. left-GIVE-me travels from their place to you. This map is from your point of view.",
        exercises: [
          choice(
            "Indexing SISTER on your left is glossed…",
            ["SISTER [index-left]", "LEFT SISTER", "SHE SISTER"],
            "SISTER [index-left]",
            "The point becomes her pronoun.",
          ),
          choice(
            "She gives me the book. The verb travels…",
            ["From her place to you", "From you to her place", "Straight up"],
            "From her place to you",
            "That path is left-GIVE-me.",
          ),
          bank(
            "Sister, on your left, gives you the book.",
            ["SISTER", "[index-left]", "left-GIVE-me", "BOOK", "YOU", "THE", "TO"],
            ["SISTER", "[index-left]", "left-GIVE-me", "BOOK"],
            "Name her, point, then send the verb and the object.",
          ),
          choice(
            "me-GIVE-left means…",
            ["I give it to the person on my left", "They give it to me", "I give it to myself"],
            "I give it to the person on my left",
            "The verb names its own start and end.",
          ),
          blank(
            "Help, from you to the person on your right.",
            "BROTHER [index-right]",
            "",
            ["me-HELP-right", "right-HELP-me", "HELP YOU"],
            "me-HELP-right",
            "You are the start of the path. They are the end.",
          ),
        ],
      },
      {
        id: "classifiers",
        title: "Classifiers",
        tip: "Name the thing, then let a handshape stand in for it. CL:B is a flat palm-down hand for the tabletop. CL:C is a C hand for the cup.",
        exercises: [
          choice(
            "CL:B stands in for…",
            ["A flat surface", "A cup", "A person walking"],
            "A flat surface",
            "Palm down, flat hand, after you have named TABLE.",
          ),
          choice(
            "CL:C stands in for…",
            ["The cup", "The tabletop", "The question"],
            "The cup",
            "A C hand, set on the near edge of the table.",
          ),
          choice(
            "What do you sign before the classifier?",
            ["The name of the thing", "Only the handshape", "[q]"],
            "The name of the thing",
            "TABLE, then CL:B. CUP, then CL:C.",
          ),
          bank(
            "The cup is on the table.",
            ["TABLE", "CL:B", "CUP", "CL:C", "ON", "THE", "[q]"],
            ["TABLE", "CL:B", "CUP", "CL:C"],
            "The written scene is TABLE, CL:B [flat surface], CUP, CL:C [place on edge].",
          ),
          choice(
            "Where does the C hand land?",
            ["On the near edge of the flat hand", "On the forehead", "In the left index point"],
            "On the near edge of the flat hand",
            "The second classifier shows the place of the cup.",
          ),
        ],
      },
      {
        id: "pairs",
        title: "One parameter",
        tip: "Change the place or the handshape and you have a different word. SUMMER wipes the forehead. UGLY twists under the nose.",
        exercises: [
          choice(
            "SUMMER and UGLY. What changes?",
            ["Location and movement", "Only the palm", "Only a brow marker"],
            "Location and movement",
            "Forehead wipe, versus a twist just under the nose.",
          ),
          choice(
            "APPLE and ONION use the same X twist. What changes?",
            ["Location", "Movement", "Palm orientation"],
            "Location",
            "Cheek, versus the corner of the eye.",
          ),
          choice(
            "CANDY and APPLE both happen on the cheek. What changes?",
            ["Handshape", "Location", "A required eyebrow marker"],
            "Handshape",
            "CANDY twists a straight index fingertip. APPLE twists the knuckle of an X.",
          ),
          choice(
            "FATHER and MOTHER share a hand and a tap. What changes?",
            ["Location", "Handshape", "Movement"],
            "Location",
            "Forehead for FATHER. Chin for MOTHER.",
          ),
          choice(
            "A parameter is…",
            ["One piece of a sign: shape, place, path, palm, or face", "An English article", "A fingerspelled letter only"],
            "One piece of a sign: shape, place, path, palm, or face",
            "Change one piece and you may have produced a different word.",
          ),
        ],
      },
    ],
  },
  ...TOPIC_UNITS,
];

export function lessonList() {
  const list = [];
  for (const unit of UNITS) {
    for (const lesson of unit.lessons) {
      list.push({
        ...lesson,
        unitId: unit.id,
        unitTitle: unit.title,
        guide: unit.guide,
        guideLabel: unit.guideLabel,
      });
    }
  }
  return list;
}

export function findLesson(id) {
  return lessonList().find((lesson) => lesson.id === id) || null;
}

export function previousLessonId(id) {
  const list = lessonList();
  const index = list.findIndex((lesson) => lesson.id === id);
  if (index <= 0) return null;
  return list[index - 1].id;
}

export function nextLessonId(id) {
  const list = lessonList();
  const index = list.findIndex((lesson) => lesson.id === id);
  if (index < 0 || index === list.length - 1) return null;
  return list[index + 1].id;
}

export function canonical(input) {
  return tokenize(input)
    .map((token) => {
      const normalized = normalizeToken(token);
      return normalized.questionPunct ? `${normalized.key}?` : normalized.key;
    })
    .join(" ");
}

export function gradeAttempt(exercise, attempt) {
  if (exercise.type === "choice" || exercise.type === "blank") {
    return {
      ok: attempt === exercise.answer,
      correct: exercise.answer,
      detail: exercise.explain,
    };
  }
  if (exercise.type === "bank") {
    const guess = Array.isArray(attempt) ? attempt.join(" ") : "";
    const correct = exercise.answer.join(" ");
    return {
      ok: canonical(guess) === canonical(correct),
      correct,
      detail: exercise.explain,
    };
  }
  if (exercise.type === "type") {
    const result = analyze(attempt, exercise.drillId);
    const wrong = result.notes?.filter((note) => note.tone === "bad").map((note) => note.text) || [];
    return {
      ok: result.status === "pass",
      correct: exercise.model,
      detail: result.status === "pass" ? exercise.explain : wrong[0] || result.summary,
    };
  }
  if (exercise.type === "match") {
    return { ok: true, correct: "", detail: exercise.explain };
  }
  return { ok: false, correct: "", detail: "This exercise has no score." };
}
