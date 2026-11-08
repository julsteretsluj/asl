import { analyze, normalizeToken, tokenize } from "./gloss.js";
import { TOPIC_UNITS } from "./topics.js";
import {
  exercisesForVariant,
  resolveLessonVariants,
  shuffleExercises,
  variantCount,
} from "./variants.js";

export { exercisesForVariant, resolveLessonVariants, shuffleExercises, variantCount };

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
        
          choice("STORE in a gloss is…", ["One sign", "Fingerspelling", "An English article"], "One sign", "Capitals name a sign. STORE is one sign."),
          choice("THANK-YOU uses a hyphen because it is…", ["One sign", "Two signs", "Three letters"], "One sign", "The English words are produced as a single sign."),
          blank("Mark the repetition.", "SAFE", "", ["++", "S-A-M", "STORE"], "++", "Plus-plus asks you to repeat the sign."),
          bank("Two signs, not fingerspelling. Tap store, then thank-you.", ["STORE", "THANK-YOU", "S-A-M", "J-U-L-E-S"], ["STORE", "THANK-YOU"], "STORE and THANK-YOU are signs. The hyphenated letters are fingerspelling."),
          match("Match the pairs.", [
            ["Don't know", "DON'T-KNOW"],
            ["Sam", "S-A-M"],
            ["Store", "STORE"],
            ["Repeat the sign", "SAFE++"],
          ]),
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
        
          choice("What opens the store question?", ["TOMORROW", "STORE", "YOU"], "TOMORROW", "Time is first."),
          choice("YOU GO, after the place, is the…", ["Comment", "Time", "Yes/no marker"], "Comment", "The comment is what you say about the topic."),
          blank("Mark the yes/no.", "TOMORROW STORE YOU GO", "", ["[q]", "GOING", "THE"], "[q]", "Raised eyebrows, written [q]."),
          bank("Build the comment only: the person, then the verb.", ["YOU", "GO", "TOMORROW", "STORE", "[q]", "ARE"], ["YOU", "GO"], "YOU GO is the comment. Time and the place stay outside it."),
          match("Match the pairs.", [
            ["Time", "TOMORROW"],
            ["Topic", "STORE"],
            ["Comment", "YOU GO"],
            ["Yes/no marker", "[q]"],
          ]),
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
        
          choice("is, am, and are…", ["Drop out", "Stay as IS", "Become [q]"], "Drop out", "The verb to be is not a separate sign here."),
          choice("GO-TO, when you need it, is…", ["One sign", "The English word to", "Fingerspelling"], "One sign", "A lone TO is the preposition. GO-TO folds that path into one sign."),
          blank("Gloss “I am fine.”", "I", "", ["FINE", "AM", "IS"], "FINE", "The copula drops."),
          bank("Build “I am fine.” Leave am and is out.", ["I", "FINE", "AM", "IS", "THE"], ["I", "FINE"], "I and FINE. The be-verb is not signed."),
          match("Match the pairs.", [
            ["I am fine", "I FINE"],
            ["going", "GO"],
            ["the store", "STORE"],
            ["go to", "GO-TO"],
          ]),
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
        
          choice("V, next to U, opens…", ["A gap between the two fingers", "The thumb across the fist", "A pinky path"], "A gap between the two fingers", "U keeps index and middle together. V separates them.", {"letter":"V"}),
          choice("Before the pinky traces a J, the handshape is…", ["I", "U", "S"], "I", "J keeps the I hand. The path is the letter.", {"letter":"I"}),
          blank("Fingerspell Sam.", "", "", ["S-A-M", "SAM", "S-A-M-M"], "S-A-M", "One hyphen between each letter."),
          bank("Tap the fist with the thumb at the side, then the two fingers that stay together.", ["A", "U", "S", "J"], ["A", "U"], "A keeps the thumb beside the index. U holds two fingers together."),
          match("Match the pairs.", [
            ["Thumb at the side", "A"],
            ["Thumb across the fingers", "S"],
            ["Two fingers together", "U"],
            ["Pinky traces the letter", "J"],
          ]),
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
        
          choice("PLEASE in this set is…", ["One sign", "Two signs", "Fingerspelling"], "One sign", "A greeting can be one sign."),
          choice("“I am fine” leaves out…", ["am", "I", "FINE"], "am", "The copula drops. The gloss is I FINE."),
          blank("Mark the check-in.", "HOW YOU", "", ["[q]", "ARE", "FINE"], "[q]", "HOW YOU is a yes/no question."),
          bank("Build “How are you?”", ["HOW", "YOU", "[q]", "ARE", "AM"], ["HOW", "YOU", "[q]"], "HOW YOU, then the raised-eyebrow marker. are drops."),
          match("Match the pairs.", [
            ["Hello", "HELLO"],
            ["Please", "PLEASE"],
            ["Sorry", "SORRY"],
            ["I am fine", "I FINE"],
          ]),
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
        
          choice("YOU is produced by…", ["A point forward", "A point to your chest", "A fingerspelled U"], "A point forward", "The index finger points to the person."),
          choice("A point in space does not mark…", ["Gender", "The person you already placed", "Your own chest"], "Gender", "he, she, and singular they share IX."),
          blank("Gloss me.", "", "", ["I", "IX", "THE"], "I", "I touches your chest."),
          bank("Yourself, then the person on your left.", ["I", "[index-left]", "YOU", "HE", "THE"], ["I", "[index-left]"], "I is your chest. [index-left] is the place you already set."),
          match("Match the pairs.", [
            ["Point to your chest", "I"],
            ["Point forward", "YOU"],
            ["We", "WE"],
            ["Point on your left", "[index-left]"],
          ]),
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
        
          choice("TODAY, like every time sign here, goes…", ["At the start", "After GO", "After the place"], "At the start", "Whichever time you use, it opens the sentence."),
          choice("TOMORROW and YESTERDAY both start…", ["On the cheek", "On the chest", "At the waist"], "On the cheek", "The thumb is on the cheek. Forward is tomorrow. Back is yesterday."),
          blank("Today, the store.", "", "STORE I GO", ["TODAY", "YESTERDAY", "TOMORROW"], "TODAY", "Time still takes the first slot."),
          bank("Build “Tomorrow I go to the store.”", ["TOMORROW", "STORE", "I", "GO", "YESTERDAY", "NOW"], ["TOMORROW", "STORE", "I", "GO"], "Time, place, then I GO."),
          match("Match the pairs.", [
            ["Forward from the cheek", "TOMORROW"],
            ["Back from the cheek", "YESTERDAY"],
            ["Now", "NOW"],
            ["Today", "TODAY"],
          ]),
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
        
          choice("WHO, WHAT, WHERE, and WHEN usually land…", ["At the end", "At the start", "In place of the verb"], "At the end", "The wh-sign closes the question, with [wh-q]."),
          choice("Furrowed brows on a real why-question are written…", ["[wh-q]", "[q]", "[rhq]"], "[wh-q]", "[q] is yes/no. [rhq] is a question you answer yourself."),
          blank("The check-in, not a wh-question.", "HOW YOU", "", ["[q]", "[wh-q]", "[rhq]"], "[q]", "HOW YOU as “how are you?” raises the brows."),
          bank("Build “Where are you going?” about the store.", ["STORE", "YOU", "GO", "WHERE", "[wh-q]", "[q]", "ARE", "THE"], ["STORE", "YOU", "GO", "WHERE", "[wh-q]"], "Topic, comment, then WHERE with the furrowed-brow marker."),
          match("Match the pairs.", [
            ["Who", "WHO"],
            ["What", "WHAT"],
            ["Why", "WHY?"],
            ["How are you?", "HOW YOU [q]"],
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
        
          choice("A larger HAPPY, carried by the hands, is…", ["HAPPY++", "HAPPY with [q]", "A fingerspelled happy"], "HAPPY++", "Repetition enlarges the feeling."),
          choice("The I-L-Y handshape is…", ["A different sign", "The sign LOVE", "The sign SAD"], "A different sign", "LOVE hugs crossed fists on the chest."),
          blank("Intensify the sign.", "HAPPY", "", ["++", "[q]", "SAD"], "++", "Plus-plus is the repeat."),
          bank("Tap love, then the repeated happy sign.", ["LOVE", "HAPPY++", "SAD", "TIRED", "[q]"], ["LOVE", "HAPPY++"], "LOVE is the crossed fists. HAPPY++ repeats the sign."),
          match("Match the pairs.", [
            ["Bent hands drop from the shoulders", "TIRED"],
            ["Crossed fists on the chest", "LOVE"],
            ["The sign, with the face at rest", "SAD"],
            ["Repeat for a larger feeling", "HAPPY++"],
          ]),
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
        
          choice("the, are, to, and going…", ["Drop out", "Open the sentence", "Replace [q]"], "Drop out", "The gloss keeps TOMORROW STORE YOU GO [q]."),
          choice("In that gloss, STORE is the…", ["Topic", "Time", "Question marker"], "Topic", "Time first, then the place, then YOU GO."),
          blank("The verb, not the English -ing.", "TOMORROW STORE YOU", "[q]", ["GO", "GOING", "ARE"], "GO", "Use GO."),
          bank("Build the yes/no again. Leave the, are, to, and going out.", ["TOMORROW", "STORE", "YOU", "GO", "[q]", "THE", "ARE", "TO", "GOING"], ["TOMORROW", "STORE", "YOU", "GO", "[q]"], "Time, topic, comment, raised eyebrows."),
          match("Match the pairs.", [
            ["Time", "TOMORROW"],
            ["Topic", "STORE"],
            ["Verb", "GO"],
            ["Yes/no marker", "[q]"],
          ]),
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
        
          choice("The manual tag IF stands in for…", ["[cond]", "[nod]", "WILL"], "[cond]", "IF and [cond] mark the same raised brows on the if-clause."),
          choice("will, at, and the…", ["Drop out", "Come before TOMORROW", "Replace RAIN"], "Drop out", "They are not signs in this sentence."),
          blank("Release the if-clause.", "[cond] TOMORROW RAIN", "I DESK SIT", ["[nod]", "[q]", "WILL"], "[nod]", "The nod sits with the result, before SIT."),
          bank("Build the conditional again. Leave will, at, and the out.", ["[cond]", "TOMORROW", "RAIN", "[nod]", "I", "DESK", "SIT", "IF", "WILL", "AT", "THE"], ["[cond]", "TOMORROW", "RAIN", "[nod]", "I", "DESK", "SIT"], "Condition, time, rain, nod, then I DESK SIT."),
          match("Match the pairs.", [
            ["Raised brows on the if-clause", "[cond]"],
            ["Manual tag for that clause", "IF"],
            ["Nod with the result", "[nod]"],
            ["The result", "SIT"],
          ]),
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
        
          choice("AM in “I am tired”…", ["Drops out", "Opens the sentence", "Replaces WHY?"], "Drops out", "The reason is I TIRED."),
          choice("After WHY? [rhq], you sign the reason. That reason is…", ["I TIRED", "BECAUSE I TIRED", "NOT GO"], "I TIRED", "You answer the question you just asked."),
          blank("Negate the verb.", "PARTY I", "GO", ["NOT", "AM", "BECAUSE"], "NOT", "NOT comes before GO."),
          bank("Build the reason only.", ["I", "TIRED", "BECAUSE", "AM", "WHY?", "[rhq]"], ["I", "TIRED"], "Leave BECAUSE and AM out."),
          match("Match the pairs.", [
            ["The event", "PARTY"],
            ["Not going", "NOT GO"],
            ["Rhetorical why", "WHY? [rhq]"],
            ["The reason", "I TIRED"],
          ]),
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
        
          choice("right-HELP-me sends the help…", ["From their place to you", "From you to their place", "Straight up"], "From their place to you", "The start is named first. me at the end means the path arrives at you."),
          choice("YOU, THE, and TO in the sister sentence…", ["Drop out", "Come before SISTER", "Replace the point"], "Drop out", "The gloss is SISTER [index-left] left-GIVE-me BOOK."),
          blank("The object.", "SISTER [index-left] left-GIVE-me", "", ["BOOK", "THE", "YOU"], "BOOK", "Name her, point, send the verb, then the object."),
          bank("I give the book to the person on my left.", ["me-GIVE-left", "BOOK", "left-GIVE-me", "YOU", "THE", "TO"], ["me-GIVE-left", "BOOK"], "The verb names the path. BOOK is the object."),
          match("Match the pairs.", [
            ["Sister on your left", "SISTER [index-left]"],
            ["She gives me", "left-GIVE-me"],
            ["I give to my left", "me-GIVE-left"],
            ["I help the person on my right", "me-HELP-right"],
          ]),
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
        
          choice("ON and THE in “the cup is on the table”…", ["Drop out", "Come before TABLE", "Replace CL:B"], "Drop out", "Name the things, then let the handshapes stand in."),
          choice("You sign CUP…", ["Before CL:C", "After CL:C", "Instead of the C hand"], "Before CL:C", "Name the thing, then the classifier."),
          blank("The flat surface.", "TABLE", "", ["CL:B", "CL:C", "ON"], "CL:B", "Palm down, after you have named TABLE."),
          bank("Name the cup, then the handshape that stands in for it.", ["CUP", "CL:C", "TABLE", "CL:B", "ON", "THE", "[q]"], ["CUP", "CL:C"], "CUP, then CL:C."),
          match("Match the pairs.", [
            ["The table", "TABLE"],
            ["A flat surface", "CL:B"],
            ["The cup", "CUP"],
            ["A C hand for the cup", "CL:C"],
          ]),
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
        
          choice("SUMMER is signed at the…", ["Forehead", "Under the nose", "Cheek"], "Forehead", "SUMMER wipes the forehead. UGLY twists under the nose."),
          choice("APPLE and ONION keep the same X twist. ONION changes the…", ["Location", "Movement", "Palm orientation"], "Location", "APPLE is on the cheek. ONION is at the corner of the eye."),
          blank("MOTHER’s place.", "", "", ["Chin", "Forehead", "Cheek"], "Chin", "FATHER taps the forehead. MOTHER taps the chin. Same hand, different place."),
          bank("Same X twist. Tap the cheek sign, then the one at the corner of the eye.", ["APPLE", "ONION", "CANDY", "SUMMER", "UGLY"], ["APPLE", "ONION"], "Cheek, then the corner of the eye."),
          match("Match the pairs.", [
            ["Wipes the forehead", "SUMMER"],
            ["Twists under the nose", "UGLY"],
            ["Straight index on the cheek", "CANDY"],
            ["Forehead tap", "FATHER"],
          ]),
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
      const variants = resolveLessonVariants(lesson);
      list.push({
        ...lesson,
        unitId: unit.id,
        unitTitle: unit.title,
        guide: unit.guide,
        guideLabel: unit.guideLabel,
        variants,
        exercises: variants[0] || [],
      });
    }
  }
  return list;
}

/** Active exercise list for an attempt: variant index, then caller may shuffle. */
export function lessonExercises(lesson, variantIndex = 0) {
  return exercisesForVariant(lesson, variantIndex);
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
