import { clarifyPrompt } from "./exerciseCopy.js";
import { applyEmbeds } from "./embeds.js";
import { materializeCoreGaps, materializeExtras, withFilmLessons } from "./unit-film.js";
import { ADVANCED_CATEGORIES, ADVANCED_NOTES, ADVANCED_UNITS, ADVANCED_VOCAB } from "./topics-advanced.js";
import { MORE_CATEGORIES, MORE_NOTES, MORE_UNITS, MORE_VOCAB } from "./topics-more.js";
import { normalizeEmbed } from "./video.js";

const lp = (path) => `https://www.lifeprint.com/asl101/pages-signs/${path}`;

function sign(term, gloss, category, face, manual, params, page, film) {
  const row = { term, gloss, category, face, manual, params, href: lp(page) };
  const embed =
    normalizeEmbed(film) ||
    (typeof film === "string" && film ? normalizeEmbed({ provider: "youtube", id: film }) : null);
  if (embed) {
    row.video = embed;
    if (embed.provider === "youtube" && embed.id) row.youtubeId = embed.id;
  }
  return row;
}

function choice(prompt, options, answer, explain, extra = {}) {
  const exercise = {
    type: "choice",
    prompt,
    options: options.map((label) => ({ id: label, label })),
    answer,
    explain,
    ...extra,
  };
  exercise.prompt = clarifyPrompt(exercise);
  return exercise;
}

function blank(prompt, before, after, options, answer, explain, extra = {}) {
  const exercise = { type: "blank", prompt, before, after, options, answer, explain, ...extra };
  exercise.prompt = clarifyPrompt(exercise);
  return exercise;
}

function bank(prompt, tiles, answer, explain, extra = {}) {
  const exercise = { type: "bank", prompt, tiles, answer, explain, ...extra };
  exercise.prompt = clarifyPrompt(exercise);
  return exercise;
}

function match(prompt, pairs, extra = {}) {
  const exercise = {
    type: "match",
    prompt,
    pairs: pairs.map(([a, b], index) => ({ id: String(index), a, b })),
    explain: "Each English idea has one matching ASL gloss.",
    ...extra,
  };
  exercise.prompt = clarifyPrompt(exercise);
  return exercise;
}

function lesson(id, title, tip, ...rest) {
  if (rest.length > 1 && rest.every((entry) => Array.isArray(entry))) {
    return { id, title, tip, variants: rest };
  }
  const first = rest[0];
  if (
    Array.isArray(first) &&
    first.length > 0 &&
    Array.isArray(first[0]) &&
    first[0][0] &&
    typeof first[0][0].type === "string"
  ) {
    return { id, title, tip, variants: first };
  }
  return { id, title, tip, exercises: first };
}

function unit(id, title, guide, lessons) {
  return { id, title, guide, guideLabel: "Word list", lessons };
}

export const TOPIC_CATEGORIES = ["Family", "Colors", "Food", "School", "Jobs", "Home", "Clothes", "Animals", "Weather", ...MORE_CATEGORIES, ...ADVANCED_CATEGORIES];

export const TOPIC_NOTES = {
  Family:
    "Male signs in this set sit on the forehead. Female signs sit on the chin. GRANDMOTHER and GRANDFATHER add two forward arcs. The film is the citation form.",
  Colors:
    "RED brushes the lips. Most other colors twist a letter handshape. A color usually follows the noun: BOOK RED.",
  Food:
    "APPLE, ONION, and FRUIT happen on the cheek with different handshapes. EAT and FOOD share a flat-O at the mouth. HUNGRY draws down the chest.",
  School:
    "SCHOOL is two claps. TEACHER and STUDENT end with the person marker, both flat hands dropping along the sides of the body.",
  Jobs:
    "WORK taps one wrist on the other. DOCTOR and NURSE both take a pulse. The handshape is what separates them.",
  Home:
    "HOME touches the chin, then the cheek. HOUSE draws a roof. ROOM shows the walls of a box.",
  Clothes:
    "These signs touch the clothing or trace it. A color follows the noun: SHIRT BLUE.",
  Animals:
    "Each animal uses a different place: the thigh, the cheek, the mouth, the temple. The film shows the citation form.",
  Weather:
    "Weather signs depict what you see or feel. Time still opens the sentence: TOMORROW RAIN.",
  ...MORE_NOTES,
  ...ADVANCED_NOTES,
};

const TOPIC_BASE = [
  sign("Mother", "MOTHER", "Family", "None required.", "Open 5-hand. The thumb taps the chin.", "5-hand, thumb on the chin, a short tap.", "m/mother.htm", "qUkCg3rtEws"),
  sign("Father", "FATHER", "Family", "None required.", "Open 5-hand. The thumb taps the forehead.", "5-hand, thumb on the forehead, a short tap.", "f/father.htm", "UnAiMqWCzNs"),
  sign("Parents", "PARENTS", "Family", "None required.", "The thumb taps the forehead, then the chin.", "5-hand moves from the forehead to the chin.", "p/parents.htm", "jlqHVbCS4H0"),
  sign("Brother", "BROTHER", "Family", "None required.", "Touch the forehead, then bring the two index fingers together for SAME.", "A compound: the male place, then SAME.", "b/brother.htm", "G0fzmn3pQng"),
  sign("Sister", "SISTER", "Family", "None required.", "Touch the chin, then bring the two index fingers together.", "A compound: the female place, then SAME.", "s/sister.htm", "0z2_gcB5OJ8"),
  sign("Same", "SAME", "Family", "None required.", "Two index fingers come together side by side.", "1-hands meet, tips pointing forward.", "s/same.htm"),
  sign("Grandmother", "GRANDMOTHER", "Family", "None required.", "Thumb on the chin, then two arcs forward.", "MOTHER’s hand, with two forward arcs.", "g/grandmother.htm"),
  sign("Grandfather", "GRANDFATHER", "Family", "None required.", "Thumb on the forehead, then two arcs forward.", "FATHER’s hand, with two forward arcs.", "g/grandfather.htm"),
  sign("Baby", "BABY", "Family", "None required.", "Fold the arms and rock them.", "Both arms cradle and rock.", "b/baby.htm", "UdYuyDhyzfI"),
  sign("Family", "FAMILY", "Family", "None required.", "Two F hands circle out and meet.", "F hands start together, circle, and close.", "f/family.htm", "SxrxUgeTt00"),
  sign("Aunt", "AUNT", "Family", "None required.", "An A hand twists beside the cheek.", "A-hand, a twist near the jaw.", "a/aunt.htm", "hKMiNTRhOi4"),
  sign("Uncle", "UNCLE", "Family", "None required.", "A U hand twists beside the temple.", "U-hand, a twist near the forehead.", "u/uncle.htm", "PqtMCA2lu9w"),
  sign("Cousin", "COUSIN", "Family", "None required.", "A C hand twists beside the jaw. Some signers raise that place for a male cousin.", "C-hand twists at the side of the jaw.", "c/cousin.htm", "e9-jd3sf6us"),
  sign("Son", "SON", "Family", "None required.", "Start at the forehead and move into the BABY cradle.", "Male place, then the cradle. Often one blended movement.", "s/son.htm"),
  sign("Daughter", "DAUGHTER", "Family", "None required.", "Start at the chin and move into the BABY cradle.", "Female place, then the cradle.", "d/daughter.htm", "hJD5uIn7ZHg"),
  sign("Wife", "WIFE", "Family", "None required.", "Touch the chin, then clasp the hands.", "Female place, then the clasp of MARRY.", "w/wife.htm", "HRv4XLlwdcc"),
  sign("Husband", "HUSBAND", "Family", "None required.", "Touch the forehead, then clasp the hands.", "Male place, then the clasp of MARRY.", "h/husband.htm", "TYTsqVZU1dk"),

  sign("Color", "COLOR", "Colors", "None required.", "Wiggle the fingers in front of the mouth.", "5-hand, fingers wiggling at the chin.", "c/color.htm", "Wzio7B5VT_I"),
  sign("Red", "RED", "Colors", "None required.", "The index finger brushes down the lips.", "1-hand strokes the lips downward.", "r/red.htm"),
  sign("Blue", "BLUE", "Colors", "None required.", "A B hand twists at the wrist.", "B-hand, a twist in place.", "b/blue.htm", "rKtYSjkBB84"),
  sign("Green", "GREEN", "Colors", "None required.", "A G hand twists at the wrist.", "G-hand, a twist in place.", "g/green.htm", "WrkXE5l6udM"),
  sign("Yellow", "YELLOW", "Colors", "None required.", "A Y hand twists at the wrist.", "Y-hand, a twist in place.", "y/yellow.htm", "nK4_8-U-Y9I"),
  sign("Orange", "ORANGE", "Colors", "None required.", "Squeeze the hand in front of the mouth, once or twice.", "C or S hand squeezes at the mouth. The fruit uses this same sign.", "o/orange.htm", "SDnFN2Bsc-w"),
  sign("Purple", "PURPLE", "Colors", "None required.", "A P hand twists away from the chin.", "P-hand, a twist in place.", "p/purple.htm"),
  sign("Pink", "PINK", "Colors", "None required.", "The middle finger of a P hand brushes down the lips.", "P-hand, middle finger strokes the lips.", "p/pink.htm", "aNilWTBIl0g"),
  sign("Black", "BLACK", "Colors", "None required.", "The index finger draws across the forehead.", "1-hand moves across the eyebrow.", "b/black.htm", "MRzsRtr8zQc"),
  sign("White", "WHITE", "Colors", "None required.", "An open hand on the chest pulls out and closes.", "5-hand on the chest closes to a flat-O as it moves out.", "w/white.htm", "v8h6mw4zGys"),
  sign("Brown", "BROWN", "Colors", "None required.", "A B hand slides down the cheek.", "B-hand, a slide down the cheek.", "b/brown.htm", "PrniQgULERg"),
  sign("Gray", "GRAY", "Colors", "None required.", "Open hands pass through each other.", "Two 5-hands, fingers passing through in front of the chest.", "g/gray.htm"),

  sign("Apple", "APPLE", "Food", "None required.", "Twist the knuckle of a bent index finger on the cheek.", "X-hand twists on the cheek.", "a/apple.htm", "3wIiujOP6Ag"),
  sign("Onion", "ONION", "Food", "None required.", "Twist an X hand at the corner of the eye, where tears start.", "X-hand twists at the eye corner.", "o/onion.htm"),
  sign("Candy", "CANDY", "Food", "None required.", "Twist the tip of a straight index finger on the cheek.", "1-hand tip twists on the cheek.", "c/candy.htm"),
  sign("Banana", "BANANA", "Food", "None required.", "Mime peeling. One index finger pulls down from the other.", "The dominant index peels away from the non-dominant index.", "b/banana.htm", "rdIxbPqmlOQ"),
  sign("Orange (fruit)", "ORANGE", "Food", "None required.", "The squeeze at the mouth is the fruit and the color.", "Same squeeze as the color ORANGE.", "o/orange.htm", "SDnFN2Bsc-w"),
  sign("Grape", "GRAPE", "Food", "None required.", "A claw hand hops down the back of the other hand.", "Claw hand, short hops down the back of the hand.", "g/grape.htm"),
  sign("Strawberry", "STRAWBERRY", "Food", "None required.", "Closed fingers twist once against the mouth.", "Fingers twist at the mouth.", "s/strawberry.htm"),
  sign("Watermelon", "WATERMELON", "Food", "None required.", "Flick the middle finger against the back of the other hand, as if thumping a melon.", "A flick on the back of the hand. Some signers add WATER first.", "w/watermelon.htm"),
  sign("Peach", "PEACH", "Food", "None required.", "Curve an open hand on the cheek, then close it, as if feeling fuzz.", "Open hand closes on the cheek.", "p/peach.htm", "XLv8TfJs_Ds"),
  sign("Cherry", "CHERRY", "Food", "None required.", "Twist a fingertip on the earlobe.", "A twist at the ear.", "c/cherry.htm", "rMF0qiUG96M"),
  sign("Fruit", "FRUIT", "Food", "None required.", "An F hand twists on the cheek.", "F-hand, a twist on the cheek.", "f/fruit.htm", "GF5UtlyLuyw"),
  sign("Water", "WATER", "Food", "None required.", "The index finger of a W hand taps the chin.", "W-hand taps the chin.", "w/water.htm", "-SdOfxGhb0A"),
  sign("Milk", "MILK", "Food", "None required.", "A C hand squeezes, as if milking.", "C-hand opens and closes once or twice.", "m/milk.htm", "quk_XoRtZWk"),
  sign("Eat", "EAT", "Food", "None required.", "A flat-O taps the mouth.", "Flat-O, repeated taps at the lips.", "e/eat.htm", "UN35zGy_MNM"),
  sign("Hungry", "HUNGRY", "Food", "None required.", "A C hand draws down the chest.", "C-hand starts at the throat and moves down.", "h/hungry.htm"),
  sign("Food", "FOOD", "Food", "None required.", "A flat-O taps the mouth. It is the same family as EAT.", "Flat-O at the mouth.", "f/food.htm", "o4yq26HwlAo"),
  sign("Bread", "BREAD", "Food", "None required.", "The edge of one hand slices down the back of the other.", "A chopping slide on the back of the hand.", "b/bread.htm", "ZL0F8bLp8HY"),
  sign("Egg", "EGG", "Food", "None required.", "Both H hands strike, then open, like a crack.", "H-hands hit and separate.", "e/egg.htm", "uEvKmWqFE-4"),
  sign("Coffee", "COFFEE", "Food", "None required.", "One S hand grinds on the other.", "Two S-hands, a small circular grind.", "c/coffee.htm"),
  sign("Tea", "TEA", "Food", "None required.", "An F hand stirs inside the other O hand.", "F-hand circles in an O, like a cup.", "t/tea.htm"),
  sign("Cookie", "COOKIE", "Food", "None required.", "Fingertips twist on the opposite palm, as if cutting a cookie.", "A twist of the fingertips on the palm.", "c/cookie.htm", "6JW3ODCZkBQ"),
  sign("Want", "WANT", "Food", "None required.", "Both open hands pull in and close.", "5-hands become claws as they draw toward the body.", "w/want.htm", "IRUlCZ9jRjM"),
  sign("Like", "LIKE", "Food", "None required.", "Thumb and middle finger on the chest pull out and close.", "Open-8 on the chest closes as it moves out.", "l/like.htm", "8uIg8r1awC4"),
  sign("More", "MORE", "Food", "None required.", "The fingertips of two flat-O hands tap together.", "Flat-O hands meet at the fingertips.", "m/more.htm", "fVkzBbQ-whs"),

  sign("School", "SCHOOL", "School", "None required.", "Clap the hands twice.", "Open hands clap, palm to palm.", "s/school.htm", "vuE3RN10AGA"),
  sign("Teacher", "TEACHER", "School", "None required.", "Flat-O hands move out from the temples, then both flat hands drop along the sides.", "TEACH, then the person ending.", "t/teacher.htm", "CrUCwJklAUA"),
  sign("Student", "STUDENT", "School", "None required.", "Pull from the palm to the forehead, then drop the hands along the sides.", "LEARN, then the person ending.", "s/student.htm", "0E3YmyCR6EY"),
  sign("Book", "BOOK", "School", "None required.", "Palms together, then open them like a book.", "Flat hands open from a closed book.", "b/book.htm", "SUlKivg4SDg"),
  sign("Read", "READ", "School", "None required.", "A V hand scans down the other palm.", "V-hand moves down the opposite palm.", "r/read.htm", "XfZkO61GcqI"),
  sign("Write", "WRITE", "School", "None required.", "Mime writing on the opposite palm.", "The dominant hand scribbles on the non-dominant palm.", "w/write.htm", "puR1m49pgzI"),
  sign("Paper", "PAPER", "School", "None required.", "The heel of one hand brushes up the other palm.", "A brush up the non-dominant palm.", "p/paper.htm", "6ehdJgZp-eM"),
  sign("Pencil", "PENCIL", "School", "None required.", "Touch the mouth, then mime writing on the palm.", "Index finger at the lips, then a writing motion.", "p/pencil.htm", "2B3O856BsIw"),
  sign("Class", "CLASS", "School", "None required.", "Two C hands circle until the palms face each other. The same sign can mean a group.", "C-hands outline a group.", "c/class.htm", "L2KfrlugnC4"),
  sign("Learn", "LEARN", "School", "None required.", "Gather from the opposite palm and bring that hand to the forehead.", "Fingers leave the palm and touch the forehead.", "l/learn.htm", "78mzpzvN9tc"),
  sign("Study", "STUDY", "School", "None required.", "Wiggle the fingers toward the palm, then bring them to the forehead. Repeat.", "A repeated pull from the palm to the forehead.", "s/study.htm"),
  sign("Test", "TEST", "School", "None required.", "Both index fingers draw question marks downward.", "Two 1-hands draw question-mark curves.", "t/test.htm", "QCuc-PwehGA"),
  sign("Library", "LIBRARY", "School", "None required.", "An L hand circles.", "L-hand, a small circle.", "l/library.htm", "CSaOomMxWl4"),
  sign("College", "COLLEGE", "School", "None required.", "One palm claps upward onto the other palm.", "The dominant hand rises and lands on the non-dominant palm.", "c/college.htm", "G0IHRXJ8VVY"),
  sign("Desk", "DESK", "School", "None required.", "The forearm of one arm taps the forearm of the other, showing a surface.", "Forearms contact, like the top of a desk.", "d/desk.htm", "kmPYzPuPLWc"),
  sign("Go", "GO", "School", "None required.", "Index fingers point forward and move out together.", "Two 1-hands move forward from near the body.", "g/go.htm"),
  sign("Have", "HAVE", "School", "None required.", "Fingertips of both open hands tap the chest.", "Bent hands contact the chest.", "h/have.htm"),
  sign("See", "SEE", "School", "None required.", "A V hand moves forward from under the eye.", "V-hand starts at the cheekbone and moves out.", "s/see.htm"),
  sign("Give", "GIVE", "School", "None required. Aim the path from giver to receiver.", "Flat-O hands move along the path from one person to another.", "Flat-O or open hands travel from start locus to end locus.", "g/give.htm"),
  sign("Help", "HELP", "School", "None required. Aim the path from helper to the person helped.", "A fist on an open palm rises and moves along a path.", "A-hand on the non-dominant palm; the whole stack moves.", "h/help.htm"),
  sign("Not", "NOT", "School", "A headshake often travels with NOT.", "A thumb under the chin flicks forward.", "A-hand, thumb under the chin, flicks out.", "n/not.htm"),
  sign("In", "IN", "School", "None required.", "Fingertips of one hand tuck into the other cupped hand.", "Dominant fingertips enter the non-dominant C or O.", "i/in.htm"),
  sign("Party", "PARTY", "School", "None required.", "Both P hands swing side to side.", "P-hands swing at the wrists.", "p/party.htm"),
  sign("Safe", "SAFE", "School", "None required.", "Crossed S hands at the wrists pull apart and open.", "S-hands uncross and open.", "s/safe.htm"),
  sign("Bus", "BUS", "School", "None required.", "Follow the citation film for the form you use in class.", "Handshape and path per the film.", "b/bus.htm"),

  sign("Work", "WORK", "Jobs", "None required.", "Tap one wrist on the other, twice.", "Two S-hands. The dominant wrist taps the other wrist.", "w/work.htm", "mJrUYRjvrew"),
  sign("Doctor", "DOCTOR", "Jobs", "None required.", "An M or D hand taps the pulse.", "Letter hand taps the opposite wrist.", "d/doctor.htm", "IEVgcJA3JWk"),
  sign("Nurse", "NURSE", "Jobs", "None required.", "An N hand taps the pulse. Same place as DOCTOR.", "N-hand taps the opposite wrist.", "n/nurse.htm", "zcT4miFawiw"),
  sign("Police", "POLICE", "Jobs", "None required.", "Tap a C hand on the upper chest, where a badge sits.", "C-hand taps the chest.", "p/police.htm", "TyxYhCL1RSA"),
  sign("Cook", "COOK", "Jobs", "None required.", "Both palms flip up, as if turning food. A person ending can mark the job.", "Palm-up hands flip.", "c/cook.htm", "DPOkRwo1a6A"),
  sign("Lawyer", "LAWYER", "Jobs", "None required.", "An L hand slides down the opposite palm, then the hands drop along the sides.", "LAW, then the person ending.", "l/lawyer.htm"),
  sign("Artist", "ARTIST", "Jobs", "None required.", "The pinky draws down the opposite palm, then the hands drop along the sides.", "ART, then the person ending.", "a/artist.htm"),
  sign("Boss", "BOSS", "Jobs", "None required.", "A claw hand takes the shoulder, like a person in charge.", "Claw hand on the shoulder.", "b/boss.htm", "wlhbw8q_5yU"),
  sign("Farmer", "FARMER", "Jobs", "None required.", "The thumb starts under the chin and moves forward.", "Thumb under the chin slides out.", "f/farmer.htm", "bZ7XMX9GV4M"),

  sign("Home", "HOME", "Home", "None required.", "A flat-O touches the chin, then the cheek.", "Flat-O, mouth place then cheek place.", "h/home.htm", "WSHD1XX7kWk"),
  sign("House", "HOUSE", "Home", "None required.", "Flat hands draw a roof, then the walls.", "Both hands outline a roof.", "h/house.htm", "lBSZYk72vmY"),
  sign("Room", "ROOM", "Home", "None required.", "Both flat hands show the walls of a box.", "Palms in, hands depict the sides of a room.", "r/room.htm", "ByET2PW3OrQ"),
  sign("Bed", "BED", "Home", "None required.", "Tilt the head onto the palm.", "Cheek rests on the open hand.", "b/bed.htm", "12eeoE4uG_k"),
  sign("Door", "DOOR", "Home", "None required.", "Two B hands stand together. One swings open.", "B-hands. The dominant hand hinges out.", "d/door.htm", "Knbs0MwdQvg"),
  sign("Open", "OPEN", "Home", "None required.", "Two flat hands start together and swing open.", "B-hands hinge apart, like opening.", "o/open.htm"),
  sign("Cup", "CUP", "Home", "None required.", "A C hand sits on the opposite palm, then can move like a cup.", "C-hand on the palm for the vessel.", "c/cup.htm"),
  sign("Window", "WINDOW", "Home", "None required.", "Two hands stack. The top one rises, like a sash.", "The upper hand moves up.", "w/window.htm"),
  sign("Kitchen", "KITCHEN", "Home", "None required.", "A K hand flips, palm up, like cooking.", "K-hand flips in place.", "k/kitchen.htm", "JC_rj5vboN0"),
  sign("Bathroom", "BATHROOM", "Home", "None required.", "A T hand shakes.", "T-hand, a small shake.", "b/bathroom.htm", "2xdhyJEgXdI"),
  sign("Table", "TABLE", "Home", "None required.", "Both arms pat down, showing the top.", "Forearms or flat hands pat a surface.", "t/table.htm"),
  sign("Chair", "CHAIR", "Home", "None required.", "Two fingers of one hand sit on two fingers of the other.", "A curved H hooks onto the other H.", "c/chair.htm", "xNrwgoCz9SU"),
  sign("Sit", "SIT", "Home", "None required.", "Two fingers of one hand hook over two fingers of the other.", "Curved H sits on the non-dominant H.", "s/sit.htm"),

  sign("Shirt", "SHIRT", "Clothes", "None required.", "Pinch the fabric at the upper chest and tug.", "Thumb and index take the shirt.", "s/shirt.htm", "BLqzpaKkkk4"),
  sign("Pants", "PANTS", "Clothes", "None required.", "Both open hands slide up the thighs.", "Palms slide up the legs.", "p/pants.htm", "-V0Dkeyno2s"),
  sign("Shoes", "SHOES", "Clothes", "None required.", "Two fists tap together.", "S-hands tap.", "s/shoes.htm", "Yoi_OLX0IEs"),
  sign("Hat", "HAT", "Clothes", "None required.", "Pat the top of the head.", "Open hand pats the head.", "h/hat.htm", "bul0cjvDEEE"),
  sign("Dress", "DRESS", "Clothes", "None required.", "Both hands brush down the torso.", "Open hands sweep down the body.", "d/dress.htm", "B-_Gi1swFQY"),
  sign("Coat", "COAT", "Clothes", "None required.", "Both fists move down from the shoulders, as if pulling a coat on.", "A-hands travel down from the shoulders.", "c/coat.htm", "HWMc-nzJ2MQ"),

  sign("Dog", "DOG", "Animals", "None required.", "Pat the thigh, then snap.", "A slap on the leg and a snap.", "d/dog.htm", "IbpJtH_QssM"),
  sign("Cat", "CAT", "Animals", "None required.", "Pinch the cheek and pull the whiskers out.", "Thumb and index draw away from the cheek.", "c/cat.htm", "a3b8LAX68Ho"),
  sign("Bird", "BIRD", "Animals", "None required.", "Thumb and index open and close at the mouth, a beak.", "G-hand opens and closes. It can then move away.", "b/bird.htm", "1ZEAGpAH284"),
  sign("Fish", "FISH", "Animals", "None required.", "An open hand swims forward.", "Flat hand, fingers leading, a swimming path.", "f/fish.htm", "3xKLhk4NgCs"),
  sign("Horse", "HORSE", "Animals", "None required.", "Thumb at the temple. Two fingers flick forward, the ears.", "U or H hand flicks at the temple.", "h/horse.htm", "xCJGQseQ3Fw"),
  sign("Cow", "COW", "Animals", "None required.", "A Y hand at the temple twists out, the horn.", "Y-hand twists at the temple.", "c/cow.htm", "I2_nB2cXP58"),

  sign("Rain", "RAIN", "Weather", "None required.", "Claw hands wiggle as they drop.", "Bent 5-hands descend, fingers fluttering.", "r/rain.htm", "utTSQeTEDxk"),
  sign("Summer", "SUMMER", "Weather", "None required.", "An index finger wipes across the forehead, then can flick out.", "1-hand wipes the forehead.", "s/summer.htm"),
  sign("Sun", "SUN", "Weather", "None required.", "The index finger draws a small circle beside the head.", "1-hand circles at the side of the head.", "s/sun.htm", "fnYd3XHdEPI"),
  sign("Snow", "SNOW", "Weather", "None required.", "Open fingers wiggle as the hands descend.", "5-hands flutter downward, palms down.", "s/snow.htm", "glF8fDZPiOc"),
  sign("Wind", "WIND", "Weather", "None required.", "Open hands sweep from side to side.", "Both hands wave sideways.", "w/wind.htm", "RA04zvXojYA"),
  sign("Hot", "HOT", "Weather", "None required.", "A claw hand at the mouth turns outward.", "Claw at the mouth rotates out, as if throwing heat.", "h/hot.htm", "00cPyUsrC6M"),
  sign("Cold", "COLD", "Weather", "None required.", "Shoulders rise and the fists shiver.", "Two S-hands shake beside the body.", "c/cold.htm", "vHgjYI-ig2s"),
  sign("Weather", "WEATHER", "Weather", "None required.", "Two W hands face each other and twist.", "W-hands change orientation.", "w/weather.htm", "AxL3Q6C73fg"),
];

const TOPIC_EXISTING = new Set([
  ...TOPIC_BASE.map((row) => row.gloss),
  ...MORE_VOCAB.map((row) => row.gloss),
  ...ADVANCED_VOCAB.map((row) => row.gloss),
]);

const TOPIC_EXTRA = [
  ...materializeExtras(
    sign,
    ["Family", "Colors", "Food", "Jobs", "Home", "Clothes", "Animals", "Weather"],
    TOPIC_EXISTING,
  ),
  ...materializeCoreGaps(sign, TOPIC_EXISTING),
];

export const TOPIC_VOCAB = applyEmbeds([...TOPIC_BASE, ...TOPIC_EXTRA, ...MORE_VOCAB, ...ADVANCED_VOCAB]);

const TOPIC_UNITS_RAW = [
  unit("family", "Family", "#/vocab/family", [
    lesson(
      "family-parents",
      "Parents",
      "FATHER taps the forehead. MOTHER taps the chin. BROTHER and SISTER add SAME, the two index fingers coming together.",
      [
        match(
          "Tap the matching pairs.",
          [
            ["Mother", "MOTHER"],
            ["Father", "FATHER"],
            ["Brother", "BROTHER"],
            ["Sister", "SISTER"],
          ],
          { modelGloss: "MOTHER", modelTerm: "Mother" },
        ),
        choice("FATHER is signed at the…", ["Forehead", "Chin", "Chest"], "Forehead", "The thumb of a 5-hand taps the forehead.", { modelGloss: "FATHER", modelTerm: "Father" }),
        choice("MOTHER is signed at the…", ["Chin", "Forehead", "Shoulder"], "Chin", "Same hand as FATHER. The place changes.", { modelGloss: "MOTHER", modelTerm: "Mother" }),
        choice("BROTHER adds which sign after the forehead?", ["SAME", "BABY", "COLOR"], "SAME", "The two index fingers come together.", { modelGloss: "BROTHER", modelTerm: "Brother" }),
        choice("SISTER starts at the…", ["Chin", "Forehead", "Ear"], "Chin", "Female place, then SAME.", { modelGloss: "SISTER", modelTerm: "Sister" }),
      
        choice("SAME, after the forehead, finishes…", ["BROTHER", "MOTHER", "SISTER"], "BROTHER", "BROTHER is the forehead, then the two index fingers together.", { modelGloss: "BROTHER", modelTerm: "Brother" }),
        choice("The chin, then SAME, is…", ["SISTER", "FATHER", "BROTHER"], "SISTER", "SISTER starts at the female place.", { modelGloss: "SISTER", modelTerm: "Sister" }),
        blank("Gloss the forehead tap.", "", "", ["FATHER", "MOTHER", "SAME"], "FATHER", "The thumb taps the forehead.", { modelGloss: "FATHER", modelTerm: "Father" }),
        bank("Tap the chin sign, then the forehead sign.", ["MOTHER", "FATHER", "BROTHER", "SISTER", "SAME"], ["MOTHER", "FATHER"], "MOTHER is the chin. FATHER is the forehead.", { modelGloss: "MOTHER", modelTerm: "Mother" }),
        match(
          "Match the pairs.",
          [
            ["Chin", "MOTHER"],
            ["Forehead", "FATHER"],
            ["Forehead, then SAME", "BROTHER"],
            ["Chin, then SAME", "SISTER"],
          ],
          { modelGloss: "FATHER", modelTerm: "Father" },
        ),
      ],
    ),
    lesson(
      "family-more",
      "More family",
      "GRANDMOTHER and GRANDFATHER keep the parent hand and add two arcs forward. AUNT, UNCLE, and COUSIN twist a letter hand.",
      [
        match("Tap the matching pairs.", [
          ["Grandmother", "GRANDMOTHER"],
          ["Grandfather", "GRANDFATHER"],
          ["Aunt", "AUNT"],
          ["Uncle", "UNCLE"],
        ]),
        choice("What does GRANDMOTHER add to the MOTHER hand?", ["Two arcs forward", "A clap", "A twist on the cheek"], "Two arcs forward", "The thumb stays on the chin for the start."),
        choice("BABY is…", ["A cradle and a rock", "A point to the chin", "Two claps"], "A cradle and a rock", "The arms hold an imaginary baby."),
        choice("COUSIN uses…", ["A C hand twisting at the jaw", "A 5-hand on the chest", "A snap"], "A C hand twisting at the jaw", "Some signers raise that place for a male cousin."),
        choice("FAMILY shows…", ["Hands circling and meeting", "A roof", "A badge on the chest"], "Hands circling and meeting", "Two F hands outline the group, then close."),
      
        choice("GRANDFATHER, like GRANDMOTHER, adds…", ["Two arcs forward", "A clap", "A twist on the cheek"], "Two arcs forward", "The parent hand stays. Two arcs move forward."),
        choice("AUNT, UNCLE, and COUSIN are signed as…", ["A letter hand, twisting", "Two arcs forward", "A cradle and a rock"], "A letter hand, twisting", "The letter changes with the relative. COUSIN uses a C at the jaw."),
        blank("Gloss the cradle and rock.", "", "", ["BABY", "FAMILY", "COUSIN"], "BABY", "Fold the arms and rock them."),
        bank("Tap the cousin sign, then the family sign.", ["COUSIN", "FAMILY", "AUNT", "BABY"], ["COUSIN", "FAMILY"], "COUSIN twists a C at the jaw. FAMILY circles the hands until they meet."),
        match("Match the pairs.", [
          ["Baby", "BABY"],
          ["Cousin", "COUSIN"],
          ["Family", "FAMILY"],
          ["Aunt", "AUNT"],
        ]),
      ],
    ),
    lesson(
      "family-sentences",
      "Family sentences",
      "Name the person, then the comment. is and my drop. Time still opens the sentence.",
      [
        choice("“Mother is happy.”", ["MOTHER HAPPY", "MY MOTHER IS HAPPY", "HAPPY IS MOTHER"], "MOTHER HAPPY", "is and my are not separate signs here."),
        blank("Tomorrow I see my sister.", "TOMORROW", "I SEE", ["SISTER", "MY", "THE"], "SISTER", "The person is the topic, before I SEE."),
        bank(
          "Tomorrow I see my sister.",
          ["TOMORROW", "SISTER", "I", "SEE", "MY", "THE", "WILL"],
          ["TOMORROW", "SISTER", "I", "SEE"],
          "Time, topic, then the comment.",
        ),
        choice("“Is Father a teacher?”", ["FATHER TEACHER [q]", "IS FATHER A TEACHER", "TEACHER FATHER?"], "FATHER TEACHER [q]", "Raised eyebrows ask the yes/no. The article drops."),
        bank(
          "Is Father a teacher?",
          ["FATHER", "TEACHER", "[q]", "IS", "A", "YOU"],
          ["FATHER", "TEACHER", "[q]"],
          "Topic, comment, then the question marker.",
        ),
      
        choice("my and is drop. “My mother is happy” glosses as…", ["MOTHER HAPPY", "MY MOTHER IS HAPPY", "HAPPY IS MOTHER"], "MOTHER HAPPY", "Name the person, then the comment."),
        choice("A yes/no about sister being happy ends with…", ["[q]", "IS", "MY"], "[q]", "Raised eyebrows mark the question."),
        blank("Time opens the sentence.", "", "SISTER I SEE", ["TOMORROW", "MY", "THE"], "TOMORROW", "TOMORROW still comes first."),
        bank("Build “Is sister happy?”", ["SISTER", "HAPPY", "[q]", "IS", "MY", "THE"], ["SISTER", "HAPPY", "[q]"], "Person, comment, then [q]. is drops."),
        match("Match the pairs.", [
          ["Mother", "MOTHER"],
          ["Father", "FATHER"],
          ["Sister", "SISTER"],
          ["Teacher", "TEACHER"],
        ]),
      ],
    ),
  ]),
  unit("colors", "Colors", "#/vocab/colors", [
    lesson(
      "colors-basic",
      "Four colors",
      "RED brushes the lips. BLUE, GREEN, and YELLOW twist a letter hand.",
      [
        match(
          "Tap the matching pairs.",
          [
            ["Red", "RED"],
            ["Blue", "BLUE"],
            ["Green", "GREEN"],
            ["Yellow", "YELLOW"],
          ],
          { modelGloss: "RED", modelTerm: "Red" },
        ),
        choice("RED uses…", ["An index finger on the lips", "A B hand twist", "A clap"], "An index finger on the lips", "The finger brushes down.", { modelGloss: "RED", modelTerm: "Red" }),
        choice("BLUE is…", ["A B hand twisting", "A brush down the cheek", "A roof"], "A B hand twisting", "The letter hand is the memory aid. The twist is the sign.", { modelGloss: "BLUE", modelTerm: "Blue" }),
        choice("GREEN twists…", ["A G hand", "A Y hand", "An open 5"], "A G hand", "Same twist family as BLUE. The handshape changes.", { modelGloss: "GREEN", modelTerm: "Green" }),
        choice("YELLOW uses…", ["A Y hand", "A P hand on the lips", "Two fists"], "A Y hand", "Thumb and pinky out, then twist.", { modelGloss: "YELLOW", modelTerm: "Yellow" }),
      
        choice("RED, BLUE, GREEN, and YELLOW. Which one brushes the lips?", ["RED", "BLUE", "GREEN"], "RED", "The index finger brushes down the lips. The others twist a letter hand.", { modelGloss: "RED", modelTerm: "Red" }),
        choice("BLUE and GREEN share a twist. GREEN changes the hand to…", ["A G hand", "A B hand", "A Y hand"], "A G hand", "Same twist family. The handshape is the letter.", { modelGloss: "GREEN", modelTerm: "Green" }),
        blank("Gloss the Y-hand twist.", "", "", ["YELLOW", "BLUE", "RED"], "YELLOW", "A Y hand twists at the wrist."),
        bank("Tap the lip brush, then the B-hand twist.", ["RED", "BLUE", "GREEN", "YELLOW"], ["RED", "BLUE"], "RED brushes the lips. BLUE twists a B hand."),
        match("Match the pairs.", [
          ["Lips", "RED"],
          ["B hand", "BLUE"],
          ["G hand", "GREEN"],
          ["Y hand", "YELLOW"],
        ]),
      ],
    ),
    lesson(
      "colors-more",
      "More colors",
      "PINK brushes the lips with a P hand. PURPLE twists that P away from the face. BLACK crosses the forehead. BROWN slides down the cheek.",
      [
        match("Tap the matching pairs.", [
          ["Orange", "ORANGE"],
          ["Purple", "PURPLE"],
          ["Black", "BLACK"],
          ["White", "WHITE"],
        ]),
        choice("ORANGE is…", ["A squeeze at the mouth", "A twist of a B hand", "A pat on the head"], "A squeeze at the mouth", "The fruit uses this same squeeze."),
        choice("How does PINK differ from PURPLE?", ["PINK brushes the lips", "PINK taps the wrist", "They use different places on the chest"], "PINK brushes the lips", "PURPLE twists the P hand in place."),
        choice("BLACK moves…", ["Across the forehead", "Down the cheek", "Out from the chest"], "Across the forehead", "The index finger draws that line."),
        choice("WHITE…", ["Closes as it leaves the chest", "Twists a W at the chin", "Claps twice"], "Closes as it leaves the chest", "An open hand becomes a flat-O."),
      
        choice("BROWN slides…", ["Down the cheek", "Across the forehead", "Out from the chest"], "Down the cheek", "BROWN slides down the cheek. BLACK crosses the forehead."),
        choice("PINK and RED both meet the lips. PINK uses…", ["A P hand", "An index finger only", "A twist away from the face"], "A P hand", "PURPLE twists that P away. PINK brushes the lips with it."),
        blank("Gloss the forehead line.", "", "", ["BLACK", "WHITE", "ORANGE"], "BLACK", "The index finger draws across the forehead."),
        bank("Tap the mouth squeeze, then the sign that closes as it leaves the chest.", ["ORANGE", "WHITE", "PURPLE", "BLACK"], ["ORANGE", "WHITE"], "ORANGE squeezes at the mouth. WHITE closes on the way out from the chest."),
        match("Match the pairs.", [
          ["Pink", "PINK"],
          ["Brown", "BROWN"],
          ["Purple", "PURPLE"],
          ["White", "WHITE"],
        ]),
      ],
    ),
    lesson(
      "colors-sentences",
      "Color sentences",
      "The noun comes first. The color is the comment. BOOK RED means the book is red.",
      [
        choice("“The book is red.”", ["BOOK RED", "RED BOOK", "THE BOOK IS RED"], "BOOK RED", "Noun, then color. The article and is drop."),
        blank("The shirt is blue.", "SHIRT", "", ["BLUE", "RED", "THE"], "BLUE", "The color follows the noun."),
        bank("The shirt is blue.", ["SHIRT", "BLUE", "THE", "IS", "COLOR"], ["SHIRT", "BLUE"], "Two signs. The color is the comment."),
        choice("“I want the blue shirt.”", ["SHIRT BLUE I WANT", "I WANT THE BLUE SHIRT", "BLUE I SHIRT WANT"], "SHIRT BLUE I WANT", "Describe it, then say what you want."),
        bank(
          "I want the blue shirt.",
          ["SHIRT", "BLUE", "I", "WANT", "THE", "A"],
          ["SHIRT", "BLUE", "I", "WANT"],
          "Noun, color, person, verb.",
        ),
      
        choice("“The book is red.” Which gloss puts the color in the comment?", ["BOOK RED", "RED BOOK", "IS RED"], "BOOK RED", "The noun comes first. The color follows."),
        choice("the drops out of “I want the blue shirt.” The gloss keeps…", ["SHIRT BLUE I WANT", "THE SHIRT BLUE", "I WANT THE"], "SHIRT BLUE I WANT", "Noun, color, then the comment."),
        blank("The book is red.", "BOOK", "", ["RED", "BLUE", "THE"], "RED", "Color is the comment."),
        bank("Build “I want the red book.”", ["BOOK", "RED", "I", "WANT", "THE", "IS", "A"], ["BOOK", "RED", "I", "WANT"], "Same order as SHIRT BLUE I WANT."),
        match("Match the pairs.", [
          ["Book", "BOOK"],
          ["Red", "RED"],
          ["Shirt", "SHIRT"],
          ["Blue", "BLUE"],
        ]),
      ],
    ),
  ]),
  unit("food", "Food", "#/vocab/food", [
    lesson(
      "food-fruit",
      "Fruit",
      "APPLE twists an X on the cheek. BANANA peels. GRAPE hops down the back of the hand.",
      [
        match("Tap the matching pairs.", [
          ["Apple", "APPLE"],
          ["Banana", "BANANA"],
          ["Grape", "GRAPE"],
          ["Strawberry", "STRAWBERRY"],
        ]),
        choice("APPLE twists…", ["The knuckle of an X on the cheek", "A straight finger on the ear", "A C at the mouth"], "The knuckle of an X on the cheek", "ONION uses that twist at the eye. APPLE stays on the cheek."),
        choice("BANANA…", ["Peels one index from the other", "Squeezes at the mouth", "Claps"], "Peels one index from the other", "The movement is the peel."),
        choice("GRAPE hops…", ["Down the back of the hand", "Across the forehead", "On the chest"], "Down the back of the hand", "A claw hand makes short hops."),
        choice("The fruit ORANGE and the color ORANGE…", ["Share the squeeze at the mouth", "Use different hands", "Are fingerspelled"], "Share the squeeze at the mouth", "One sign covers both in this lesson."),
      
        choice("STRAWBERRY in this set is the gloss…", ["STRAWBERRY", "GRAPE", "BANANA"], "STRAWBERRY", "One English name, one gloss."),
        choice("BANANA and APPLE use different paths. BANANA…", ["Peels one index from the other", "Twists an X on the cheek", "Hops down the back of the hand"], "Peels one index from the other", "APPLE is the X twist. GRAPE is the hop."),
        blank("Gloss the hop down the back of the hand.", "", "", ["GRAPE", "APPLE", "ORANGE"], "GRAPE", "A claw hand hops down the back of the other hand."),
        bank("Tap the cheek twist, then the fruit that shares the color’s squeeze.", ["APPLE", "ORANGE", "BANANA", "GRAPE"], ["APPLE", "ORANGE"], "APPLE twists an X on the cheek. The fruit ORANGE squeezes at the mouth."),
        match("Match the pairs.", [
          ["Apple", "APPLE"],
          ["Banana", "BANANA"],
          ["Grape", "GRAPE"],
          ["Orange", "ORANGE"],
        ]),
      ],
    ),
    lesson(
      "food-meals",
      "Drinks and meals",
      "WATER taps a W on the chin. MILK squeezes. EAT and FOOD tap a flat-O at the mouth. HUNGRY draws down the chest.",
      [
        match("Tap the matching pairs.", [
          ["Water", "WATER"],
          ["Milk", "MILK"],
          ["Bread", "BREAD"],
          ["Coffee", "COFFEE"],
        ]),
        choice("HUNGRY moves…", ["A C hand down the chest", "A W hand on the chin", "Two fists together"], "A C hand down the chest", "The path is down the front of the body."),
        choice("EAT and FOOD…", ["Tap a flat-O at the mouth", "Slice the back of the hand", "Grind two fists"], "Tap a flat-O at the mouth", "They belong to one family."),
        choice("BREAD looks like…", ["Slicing the back of the hand", "Stirring a cup", "A cradle"], "Slicing the back of the hand", "The edge of the hand is the knife."),
        choice("COFFEE looks like…", ["Grinding one fist on the other", "A squeeze at the cheek", "A clap"], "Grinding one fist on the other", "Small circles, like a mill."),
      
        choice("MILK looks like…", ["A squeeze", "A W hand on the chin", "A grind of two fists"], "A squeeze", "WATER taps a W on the chin. COFFEE grinds."),
        choice("EAT and FOOD share…", ["A flat-O at the mouth", "A slice on the back of the hand", "A C hand down the chest"], "A flat-O at the mouth", "HUNGRY is the C hand drawing down the chest."),
        blank("Gloss the chin tap with a W.", "", "", ["WATER", "MILK", "BREAD"], "WATER", "The index finger of a W hand taps the chin."),
        bank("Tap hungry, then the sign that slices the back of the hand.", ["HUNGRY", "BREAD", "COFFEE", "WATER", "EAT"], ["HUNGRY", "BREAD"], "HUNGRY draws down the chest. BREAD slices the back of the hand."),
        match("Match the pairs.", [
          ["Water", "WATER"],
          ["Milk", "MILK"],
          ["Eat", "EAT"],
          ["Food", "FOOD"],
        ]),
      ],
    ),
    lesson(
      "food-sentences",
      "Food sentences",
      "Time first when there is a time. Then the food, then what you do with it.",
      [
        choice("“I am hungry now.”", ["NOW I HUNGRY", "I AM HUNGRY NOW", "HUNGRY AM I"], "NOW I HUNGRY", "Time opens. am drops."),
        blank("I like apples.", "", "I LIKE", ["APPLE", "ONION", "THE"], "APPLE", "The food is the topic."),
        bank("I like apples.", ["APPLE", "I", "LIKE", "THE", "A"], ["APPLE", "I", "LIKE"], "Topic, then who, then the verb."),
        choice("“I want coffee tomorrow.”", ["TOMORROW COFFEE I WANT", "I WANT COFFEE TOMORROW", "COFFEE WANT I"], "TOMORROW COFFEE I WANT", "Time, topic, comment."),
        bank(
          "I want coffee tomorrow.",
          ["TOMORROW", "COFFEE", "I", "WANT", "THE", "A", "AM"],
          ["TOMORROW", "COFFEE", "I", "WANT"],
          "Tomorrow leads.",
        ),
      
        choice("“I like coffee.” The food is the topic, so the gloss is…", ["COFFEE I LIKE", "I LIKE COFFEE", "LIKE COFFEE I"], "COFFEE I LIKE", "The food comes before what you do with it."),
        choice("am drops. “I am hungry tomorrow” opens with…", ["TOMORROW", "I", "HUNGRY"], "TOMORROW", "Time first, when there is a time."),
        blank("Hungry now.", "NOW I", "", ["HUNGRY", "AM", "THE"], "HUNGRY", "NOW I HUNGRY. am drops."),
        bank("Build “I want apples now.”", ["NOW", "APPLE", "I", "WANT", "THE", "A", "AM"], ["NOW", "APPLE", "I", "WANT"], "Time, then the food, then I WANT."),
        match("Match the pairs.", [
          ["Apple", "APPLE"],
          ["Coffee", "COFFEE"],
          ["Hungry", "HUNGRY"],
          ["Like", "LIKE"],
        ]),
      ],
    ),
  ]),
  unit("school", "School", "#/vocab/school", [
    lesson(
      "school-people",
      "School people",
      "SCHOOL is two claps. TEACHER and STUDENT finish with the person marker: both flat hands drop along the sides.",
      [
        match("Tap the matching pairs.", [
          ["School", "SCHOOL"],
          ["Teacher", "TEACHER"],
          ["Student", "STUDENT"],
          ["Book", "BOOK"],
        ]),
        choice("SCHOOL is…", ["Two claps", "A twist on the cheek", "A point to the chest"], "Two claps", "Palm meets palm."),
        choice("TEACHER starts with…", ["Flat-O hands leaving the temples", "A clap", "A badge"], "Flat-O hands leaving the temples", "That is TEACH. The person ending follows."),
        choice("The person ending is…", ["Both flat hands dropping along the sides", "A question face", "A fingerspelled -ER"], "Both flat hands dropping along the sides", "STUDENT uses it after LEARN."),
        choice("BOOK…", ["Opens like a book", "Scans with a V", "Draws a question mark"], "Opens like a book", "Closed palms, then open."),
      
        choice("STUDENT, like TEACHER, finishes with…", ["The person ending", "Two claps", "A V on the palm"], "The person ending", "Both flat hands drop along the sides."),
        choice("BOOK is…", ["Palms opening", "Two claps", "Flat-O hands leaving the temples"], "Palms opening", "The hands open like a book."),
        blank("Gloss the two claps.", "", "", ["SCHOOL", "TEACHER", "STUDENT"], "SCHOOL", "Open hands clap, twice."),
        bank("Tap the person who starts at the temples, then the sign for the place.", ["TEACHER", "SCHOOL", "STUDENT", "BOOK"], ["TEACHER", "SCHOOL"], "TEACHER starts with flat-O hands leaving the temples. SCHOOL is the claps."),
        match("Match the pairs.", [
          ["School", "SCHOOL"],
          ["Teacher", "TEACHER"],
          ["Student", "STUDENT"],
          ["Book", "BOOK"],
        ]),
      ],
    ),
    lesson(
      "school-study",
      "Study signs",
      "LEARN gathers from the palm up to the forehead. READ scans that palm with a V. TEST draws question marks.",
      [
        match("Tap the matching pairs.", [
          ["Read", "READ"],
          ["Write", "WRITE"],
          ["Learn", "LEARN"],
          ["Test", "TEST"],
        ]),
        choice("READ uses…", ["A V scanning the palm", "Two claps", "A cradle"], "A V scanning the palm", "The V moves down the page."),
        choice("WRITE is…", ["Scribbling on the palm", "A twist of a G", "A roof"], "Scribbling on the palm", "The non-dominant palm is the page."),
        choice("LEARN moves…", ["From the palm to the forehead", "From the forehead out in arcs", "Down the chest"], "From the palm to the forehead", "You take something from the page and bring it in."),
        choice("TEST looks like…", ["Index fingers drawing question marks", "A pulse at the wrist", "A snap"], "Index fingers drawing question marks", "Both hands draw the curve."),
      
        choice("WRITE and READ both use the palm. WRITE…", ["Scribbles on the palm", "Scans with a V", "Draws question marks in the air"], "Scribbles on the palm", "READ is the V. TEST is the question-mark path."),
        choice("TEST uses…", ["Index fingers drawing question marks", "A pull from the palm to the forehead", "Two claps"], "Index fingers drawing question marks", "LEARN is the pull up to the forehead."),
        blank("Gloss the pull from the palm to the forehead.", "", "", ["LEARN", "READ", "WRITE"], "LEARN", "Gather from the palm, then bring that hand to the forehead."),
        bank("Tap the sign that scans the palm, then the sign that scribbles on it.", ["READ", "WRITE", "LEARN", "TEST"], ["READ", "WRITE"], "READ uses a V. WRITE scribbles."),
        match("Match the pairs.", [
          ["Read", "READ"],
          ["Write", "WRITE"],
          ["Learn", "LEARN"],
          ["Test", "TEST"],
        ]),
      ],
    ),
    lesson(
      "school-sentences",
      "School sentences",
      "SCHOOL can be the place topic, the way STORE was. Time still comes first.",
      [
        choice("“I am going to school tomorrow.”", ["TOMORROW SCHOOL I GO", "I AM GOING TO SCHOOL TOMORROW", "SCHOOL GO I"], "TOMORROW SCHOOL I GO", "Time, place, person, verb."),
        blank("Are you going to school tomorrow?", "TOMORROW SCHOOL YOU GO", "", ["[q]", "[wh-q]", "THE"], "[q]", "This is a yes/no, so the eyebrows rise."),
        bank(
          "Are you going to school tomorrow?",
          ["TOMORROW", "SCHOOL", "YOU", "GO", "[q]", "ARE", "TO", "THE"],
          ["TOMORROW", "SCHOOL", "YOU", "GO", "[q]"],
          "Same order as the store question. The place changed.",
        ),
        choice("“I read the book.”", ["BOOK I READ", "I READ THE BOOK", "READ BOOK I"], "BOOK I READ", "The book is the topic."),
        bank("I read the book.", ["BOOK", "I", "READ", "THE", "A"], ["BOOK", "I", "READ"], "Topic, person, verb."),
      
        choice("Without a time word, “I am going to school” glosses as…", ["SCHOOL I GO", "I AM GOING TO SCHOOL", "GO SCHOOL I"], "SCHOOL I GO", "The place is the topic. am, to, and going drop."),
        choice("“I read the book tomorrow” opens with…", ["TOMORROW", "BOOK", "I"], "TOMORROW", "Time still comes first."),
        blank("Tomorrow, the book.", "TOMORROW BOOK I", "", ["READ", "GO", "THE"], "READ", "BOOK is the topic. READ is the comment."),
        bank("Build “I read the book tomorrow.”", ["TOMORROW", "BOOK", "I", "READ", "THE", "A", "ARE"], ["TOMORROW", "BOOK", "I", "READ"], "Time, topic, then I READ."),
        match("Match the pairs.", [
          ["School", "SCHOOL"],
          ["Book", "BOOK"],
          ["Read", "READ"],
          ["Go", "GO"],
        ]),
      ],
    ),
  ]),
  unit("jobs", "Jobs", "#/vocab/jobs", [
    lesson(
      "jobs-care",
      "Work and care",
      "WORK taps one S-hand wrist on the other. DOCTOR and NURSE both tap the pulse. The letter hand changes.",
      [
        match("Tap the matching pairs.", [
          ["Work", "WORK"],
          ["Doctor", "DOCTOR"],
          ["Nurse", "NURSE"],
          ["Police", "POLICE"],
        ]),
        choice("WORK is…", ["Wrists tapping", "A squeeze at the mouth", "Two claps"], "Wrists tapping", "Dominant wrist on the other wrist, twice."),
        choice("DOCTOR and NURSE differ by…", ["Handshape", "A required eyebrow marker", "Location only"], "Handshape", "Both tap the wrist. M or D, versus N."),
        choice("POLICE taps…", ["The upper chest", "The chin", "The thigh"], "The upper chest", "The place of a badge."),
        choice("A pulse tap with an N hand is…", ["NURSE", "DOCTOR", "BOSS"], "NURSE", "DOCTOR uses M or D in that same place."),
      
        choice("The wrist tap in this set is…", ["WORK", "POLICE", "NURSE"], "WORK", "One S-hand wrist taps the other. NURSE taps the pulse with an N hand."),
        choice("WORK taps…", ["One wrist on the other", "The upper chest", "The chin"], "One wrist on the other", "Two S-hands. POLICE is the chest tap."),
        blank("Gloss the badge tap.", "", "", ["POLICE", "NURSE", "WORK"], "POLICE", "A C hand taps the upper chest."),
        bank("Tap the N-hand pulse, then the wrist tap.", ["NURSE", "WORK", "DOCTOR", "POLICE"], ["NURSE", "WORK"], "NURSE is the N hand on the pulse. WORK is the wrists."),
        match("Match the pairs.", [
          ["Work", "WORK"],
          ["Doctor", "DOCTOR"],
          ["Nurse", "NURSE"],
          ["Police", "POLICE"],
        ]),
      ],
    ),
    lesson(
      "jobs-more",
      "More jobs",
      "COOK flips the hands. LAWYER and ARTIST take a sign on the palm, then the person ending. BOSS is a claw on the shoulder.",
      [
        match("Tap the matching pairs.", [
          ["Cook", "COOK"],
          ["Lawyer", "LAWYER"],
          ["Artist", "ARTIST"],
          ["Farmer", "FARMER"],
        ]),
        choice("COOK looks like…", ["Flipping food", "Tapping a badge", "A book opening"], "Flipping food", "Palms start up and turn."),
        choice("LAWYER slides…", ["An L down the palm, then the person ending", "A Y from the cheek", "Two arcs from the chin"], "An L down the palm, then the person ending", "The slide is LAW."),
        choice("BOSS is…", ["A claw on the shoulder", "A twist of a B on the cheek", "A clap"], "A claw on the shoulder", "The hand marks a person in charge."),
        choice("FARMER moves…", ["The thumb forward from under the chin", "Down the chest", "Across the forehead"], "The thumb forward from under the chin", "The path leaves the chin."),
      
        choice("ARTIST, like LAWYER, finishes with…", ["The person ending", "A claw on the shoulder", "A thumb from the chin"], "The person ending", "A sign on the palm, then both hands drop along the sides."),
        choice("BOSS is signed at the…", ["Shoulder", "Palm", "Chin"], "Shoulder", "A claw hand takes the shoulder."),
        blank("Gloss the food flip.", "", "", ["COOK", "FARMER", "LAWYER"], "COOK", "Both palms flip up."),
        bank("Tap the shoulder sign, then the thumb that moves out from the chin.", ["BOSS", "FARMER", "COOK", "ARTIST"], ["BOSS", "FARMER"], "BOSS is the claw. FARMER slides the thumb forward."),
        match("Match the pairs.", [
          ["Cook", "COOK"],
          ["Lawyer", "LAWYER"],
          ["Artist", "ARTIST"],
          ["Boss", "BOSS"],
        ]),
      ],
    ),
    lesson(
      "jobs-sentences",
      "Job sentences",
      "Name the work, then the person. A yes/no about someone else’s job takes [q].",
      [
        choice("“I am a doctor.”", ["I DOCTOR", "I AM A DOCTOR", "DOCTOR AM I"], "I DOCTOR", "am and a drop."),
        blank("Do you work?", "YOU WORK", "", ["[q]", "[wh-q]", "DO"], "[q]", "Yes/no. The brows rise."),
        bank("Do you work?", ["YOU", "WORK", "[q]", "DO", "A", "ARE"], ["YOU", "WORK", "[q]"], "Person, verb, question marker."),
        choice("“She is a nurse” needs a person set in space first. The job gloss is…", ["NURSE", "DOCTOR", "WORK"], "NURSE", "Point to her place, then sign NURSE."),
        bank("I am a doctor.", ["I", "DOCTOR", "AM", "A", "THE"], ["I", "DOCTOR"], "Two signs."),
      
        choice("“Are you a doctor?” glosses as…", ["YOU DOCTOR [q]", "ARE YOU A DOCTOR", "DOCTOR YOU?"], "YOU DOCTOR [q]", "Same yes/no pattern as YOU WORK [q]. a and are drop."),
        choice("“I am a nurse” glosses as…", ["I NURSE", "I AM A NURSE", "NURSE AM I"], "I NURSE", "Name the work after the person. am drops."),
        blank("Mark the yes/no about work.", "YOU WORK", "", ["[q]", "[wh-q]", "DO"], "[q]", "A yes/no about the job takes [q]."),
        bank("Build “Are you a nurse?”", ["YOU", "NURSE", "[q]", "ARE", "A", "DO", "THE"], ["YOU", "NURSE", "[q]"], "Person, job, then [q]."),
        match("Match the pairs.", [
          ["Doctor", "DOCTOR"],
          ["Nurse", "NURSE"],
          ["Work", "WORK"],
          ["Yes/no marker", "[q]"],
        ]),
      ],
    ),
  ]),
  unit("home", "Home", "#/vocab/home", [
    lesson(
      "home-places",
      "House and rooms",
      "HOME touches the chin, then the cheek. HOUSE draws a roof. ROOM shows a box. BED is your cheek on your hand.",
      [
        match("Tap the matching pairs.", [
          ["Home", "HOME"],
          ["House", "HOUSE"],
          ["Room", "ROOM"],
          ["Bed", "BED"],
        ]),
        choice("HOME touches…", ["Chin, then cheek", "Forehead only", "The wrist"], "Chin, then cheek", "A flat-O makes both contacts."),
        choice("HOUSE outlines…", ["A roof", "A beard", "A book"], "A roof", "The hands meet at a peak, then move down."),
        choice("ROOM shows…", ["The walls of a box", "A sash going up", "A cradle"], "The walls of a box", "Both flat hands, palms in."),
        choice("BED is…", ["The cheek on the palm", "A clap", "A twist at the ear"], "The cheek on the palm", "The head tilts to rest."),
      
        choice("HOME touches the chin, then…", ["The cheek", "The forehead", "The wrist"], "The cheek", "A flat-O, mouth place then cheek place."),
        choice("ROOM shows the walls. HOUSE shows…", ["A roof", "A cheek on a palm", "A box and a sash"], "A roof", "BED is the cheek on the palm."),
        blank("Gloss the cheek on the palm.", "", "", ["BED", "ROOM", "HOUSE"], "BED", "Tilt the head onto the palm."),
        bank("Tap the roof, then the box.", ["HOUSE", "ROOM", "HOME", "BED"], ["HOUSE", "ROOM"], "HOUSE draws a roof. ROOM shows the walls."),
        match("Match the pairs.", [
          ["Home", "HOME"],
          ["House", "HOUSE"],
          ["Room", "ROOM"],
          ["Bed", "BED"],
        ]),
      ],
    ),
    lesson(
      "home-more",
      "Doors and rooms",
      "DOOR swings one B hand open. WINDOW lifts the top hand. KITCHEN flips a K. BATHROOM shakes a T.",
      [
        match("Tap the matching pairs.", [
          ["Door", "DOOR"],
          ["Window", "WINDOW"],
          ["Kitchen", "KITCHEN"],
          ["Bathroom", "BATHROOM"],
        ]),
        choice("DOOR…", ["Swings open like a hinge", "Draws a roof", "Taps the chin twice"], "Swings open like a hinge", "Two B hands start together."),
        choice("WINDOW…", ["Lifts the upper hand", "Shakes a T", "Opens a book"], "Lifts the upper hand", "The top hand is the sash."),
        choice("KITCHEN flips…", ["A K hand", "A T hand", "A 5-hand on the chest"], "A K hand", "The flip is the cook."),
        choice("BATHROOM shakes…", ["A T hand", "A K hand", "Two fists"], "A T hand", "A small repeated shake."),
      
        choice("WINDOW and DOOR. WINDOW…", ["Lifts the upper hand", "Swings one B hand open", "Shakes a T"], "Lifts the upper hand", "DOOR is the hinge. BATHROOM shakes a T."),
        choice("KITCHEN and BATHROOM differ by…", ["Handshape", "A roof", "A question marker"], "Handshape", "KITCHEN flips a K. BATHROOM shakes a T."),
        blank("Gloss the hinge.", "", "", ["DOOR", "WINDOW", "KITCHEN"], "DOOR", "One B hand swings open."),
        bank("Tap the T-hand shake, then the K-hand flip.", ["BATHROOM", "KITCHEN", "DOOR", "WINDOW"], ["BATHROOM", "KITCHEN"], "BATHROOM shakes a T. KITCHEN flips a K."),
        match("Match the pairs.", [
          ["Door", "DOOR"],
          ["Window", "WINDOW"],
          ["Kitchen", "KITCHEN"],
          ["Bathroom", "BATHROOM"],
        ]),
      ],
    ),
    lesson(
      "home-sentences",
      "Home sentences",
      "HOME and KITCHEN can be the place topic, the way STORE and SCHOOL were.",
      [
        choice("“I am going home now.”", ["NOW HOME I GO", "I AM GOING HOME NOW", "HOME GO NOW I"], "NOW HOME I GO", "Time, place, person, verb."),
        blank("I eat in the kitchen.", "KITCHEN", "", ["I EAT", "EAT I", "THE KITCHEN"], "I EAT", "The place is the topic. in and the drop."),
        bank("I eat in the kitchen.", ["KITCHEN", "I", "EAT", "IN", "THE"], ["KITCHEN", "I", "EAT"], "Place, person, verb."),
        choice("“The door is open” starts with…", ["DOOR", "OPEN DOOR THE", "IS"], "DOOR", "Name the thing, then the comment."),
        bank("I am going home now.", ["NOW", "HOME", "I", "GO", "AM", "TO"], ["NOW", "HOME", "I", "GO"], "Now leads."),
      
        choice("in and the drop. “I eat in the kitchen” glosses as…", ["KITCHEN I EAT", "I EAT IN THE KITCHEN", "EAT IN KITCHEN"], "KITCHEN I EAT", "The room is the place topic."),
        choice("“I am going home” with no time word glosses as…", ["HOME I GO", "I AM GOING HOME", "GO HOME I"], "HOME I GO", "HOME is the topic. am and going drop. NOW leads only when you have it."),
        blank("Going home now.", "NOW HOME", "", ["I GO", "GO I", "AM"], "I GO", "Time, place, then the comment."),
        bank("Build “I am going home now.”", ["NOW", "HOME", "I", "GO", "AM", "TO", "THE"], ["NOW", "HOME", "I", "GO"], "NOW opens. HOME is the topic. I GO is the comment."),
        match("Match the pairs.", [
          ["Home", "HOME"],
          ["Kitchen", "KITCHEN"],
          ["Door", "DOOR"],
          ["Eat", "EAT"],
        ]),
      ],
    ),
  ]),
  unit("clothes", "Clothes", "#/vocab/clothes", [
    lesson(
      "clothes-core",
      "What you wear",
      "These signs touch the thing or trace it. SHIRT tugs the chest. PANTS slide up the legs. SHOES tap two fists. HAT pats the head.",
      [
        match("Tap the matching pairs.", [
          ["Shirt", "SHIRT"],
          ["Pants", "PANTS"],
          ["Shoes", "SHOES"],
          ["Hat", "HAT"],
        ]),
        choice("SHIRT…", ["Tugs the fabric at the chest", "Pats the head", "Slides up the legs"], "Tugs the fabric at the chest", "Thumb and index take the shirt."),
        choice("PANTS move…", ["Up the thighs", "Down from the shoulders", "Across the forehead"], "Up the thighs", "Both hands trace the legs."),
        choice("SHOES are…", ["Two fists tapping", "A V on the palm", "A C at the mouth"], "Two fists tapping", "The fists stand in for the pair."),
        choice("HAT…", ["Pats the head", "Brushes the lips", "Claps"], "Pats the head", "The place is the top of the head."),
      
        choice("PANTS and SHIRT. PANTS…", ["Slide up the legs", "Tug the chest", "Pat the head"], "Slide up the legs", "SHIRT tugs the fabric. HAT pats the head."),
        choice("SHOES are two fists. HAT is…", ["A pat on the head", "A tug at the chest", "A slide up the thigh"], "A pat on the head", "The sign touches the thing it names."),
        blank("Gloss the tug at the chest.", "", "", ["SHIRT", "PANTS", "SHOES"], "SHIRT", "Thumb and index take the shirt."),
        bank("Tap the head pat, then the two tapping fists.", ["HAT", "SHOES", "SHIRT", "PANTS"], ["HAT", "SHOES"], "HAT pats the head. SHOES taps two fists."),
        match("Match the pairs.", [
          ["Shirt", "SHIRT"],
          ["Pants", "PANTS"],
          ["Shoes", "SHOES"],
          ["Hat", "HAT"],
        ]),
      ],
    ),
    lesson(
      "clothes-more",
      "Coat and dress",
      "DRESS brushes down the body. COAT pulls down from the shoulders. A color still follows the noun.",
      [
        choice("DRESS moves…", ["Down the torso", "Up the legs", "Out from the temples"], "Down the torso", "Both hands sweep down."),
        choice("COAT looks like…", ["Pulling a coat on from the shoulders", "A badge tap", "A book opening"], "Pulling a coat on from the shoulders", "The fists travel down."),
        choice("“The shirt is blue.”", ["SHIRT BLUE", "BLUE SHIRT", "SHIRT IS BLUE"], "SHIRT BLUE", "Noun, then color."),
        choice("“The shoes are black.”", ["SHOES BLACK", "BLACK SHOES ARE", "THE SHOES BLACK"], "SHOES BLACK", "Same noun-then-color order."),
        blank("The hat is red.", "HAT", "", ["RED", "BLUE", "IS"], "RED", "The color is the comment."),
      
        choice("COAT moves…", ["Down from the shoulders", "Down the torso, brushing", "Up the legs"], "Down from the shoulders", "DRESS brushes down the body. COAT pulls on from the shoulders."),
        choice("“The coat is black” still puts the color…", ["After the noun", "Before the noun", "In place of COAT"], "After the noun", "A color follows the noun, as in SHIRT BLUE."),
        blank("The coat is black.", "COAT", "", ["BLACK", "RED", "IS"], "BLACK", "Noun, then color. is drops."),
        bank("Build “The dress is red.”", ["DRESS", "RED", "IS", "THE", "BLUE"], ["DRESS", "RED"], "Same order as HAT RED."),
        match("Match the pairs.", [
          ["Dress", "DRESS"],
          ["Coat", "COAT"],
          ["Red", "RED"],
          ["Black", "BLACK"],
        ]),
      ],
    ),
    lesson(
      "clothes-sentences",
      "Clothes sentences",
      "Describe the clothing, then say what you want or like.",
      [
        choice("“I want the blue shirt.”", ["SHIRT BLUE I WANT", "I WANT BLUE SHIRT THE", "WANT I SHIRT"], "SHIRT BLUE I WANT", "Noun, color, person, verb."),
        bank(
          "I want the blue shirt.",
          ["SHIRT", "BLUE", "I", "WANT", "THE", "A"],
          ["SHIRT", "BLUE", "I", "WANT"],
          "The color stays with the noun.",
        ),
        blank("I like the red hat.", "HAT RED", "", ["I LIKE", "LIKE I", "THE"], "I LIKE", "Topic first, then the comment."),
        bank("I like the red hat.", ["HAT", "RED", "I", "LIKE", "THE"], ["HAT", "RED", "I", "LIKE"], "Four signs, in that order."),
        choice("Which tile does not belong in HAT RED?", ["IS", "HAT", "RED"], "IS", "is is not a sign in this gloss."),
      
        choice("“I want the red hat” glosses as…", ["HAT RED I WANT", "I WANT THE RED HAT", "RED HAT I WANT"], "HAT RED I WANT", "Clothing, color, then the comment. the drops."),
        choice("IS does not belong in…", ["HAT RED", "The English sentence “the hat is red”", "A color comment"], "HAT RED", "is drops. The gloss is the noun and the color."),
        blank("I like the blue shirt.", "SHIRT BLUE", "", ["I LIKE", "LIKE I", "IS"], "I LIKE", "Describe the clothing, then say what you like."),
        bank("Build “I want the red hat.”", ["HAT", "RED", "I", "WANT", "THE", "A", "IS"], ["HAT", "RED", "I", "WANT"], "Noun, color, then I WANT."),
        match("Match the pairs.", [
          ["Shirt", "SHIRT"],
          ["Hat", "HAT"],
          ["Want", "WANT"],
          ["Like", "LIKE"],
        ]),
      ],
    ),
  ]),
  unit("animals", "Animals", "#/vocab/animals", [
    lesson(
      "animals-pets",
      "Pets",
      "DOG slaps the thigh and snaps. CAT pulls whiskers from the cheek. BIRD is a beak at the mouth. FISH swims forward.",
      [
        match("Tap the matching pairs.", [
          ["Dog", "DOG"],
          ["Cat", "CAT"],
          ["Bird", "BIRD"],
          ["Fish", "FISH"],
        ]),
        choice("DOG is…", ["A slap on the thigh and a snap", "A twist on the cheek", "A roof"], "A slap on the thigh and a snap", "The snap finishes the sign."),
        choice("CAT pulls…", ["Whiskers from the cheek", "A horn from the temple", "A sash up"], "Whiskers from the cheek", "Thumb and index draw out."),
        choice("BIRD is…", ["A beak at the mouth", "A swim forward", "Two fists"], "A beak at the mouth", "Thumb and index open and close."),
        choice("FISH…", ["Swims forward", "Draws a question mark", "Taps the chin"], "Swims forward", "The fingers lead."),
      
        choice("FISH and BIRD. FISH…", ["Swims forward", "Opens a beak at the mouth", "Slaps the thigh"], "Swims forward", "BIRD is the beak. DOG is the slap and the snap."),
        choice("CAT pulls whiskers from the cheek. DOG…", ["Slaps the thigh and snaps", "Swims forward", "Pinches the cheek and holds still"], "Slaps the thigh and snaps", "Each animal uses its own place."),
        blank("Gloss the beak.", "", "", ["BIRD", "FISH", "CAT"], "BIRD", "Thumb and index open and close at the mouth."),
        bank("Tap the whisker sign, then the swimming sign.", ["CAT", "FISH", "DOG", "BIRD"], ["CAT", "FISH"], "CAT pulls the whiskers. FISH swims forward."),
        match("Match the pairs.", [
          ["Dog", "DOG"],
          ["Cat", "CAT"],
          ["Bird", "BIRD"],
          ["Fish", "FISH"],
        ]),
      ],
    ),
    lesson(
      "animals-more",
      "More animals",
      "HORSE flicks two fingers at the temple, the ears. COW twists a Y at the temple, the horn. Same place. Different hand.",
      [
        choice("HORSE and COW share…", ["The temple", "The cheek", "The chest"], "The temple", "The handshape tells them apart."),
        choice("HORSE flicks…", ["Two fingers, like ears", "A Y hand", "A claw down the chest"], "Two fingers, like ears", "The thumb stays at the temple."),
        choice("COW uses…", ["A Y hand twisting out", "An X on the cheek", "A snap"], "A Y hand twisting out", "The twist is the horn."),
        choice("A color still follows the animal.", ["DOG BROWN", "BROWN DOG THE", "DOG IS BROWN"], "DOG BROWN", "Noun, then color."),
        blank("The cat is white.", "CAT", "", ["WHITE", "BLACK", "IS"], "WHITE", "The color is the comment."),
      
        choice("Same place, the temple. COW changes the hand to…", ["A Y hand", "Two flicking fingers", "An X on the cheek"], "A Y hand", "HORSE flicks two fingers, the ears. COW twists a Y, the horn."),
        choice("A color still follows the animal. “The horse is brown” glosses as…", ["HORSE BROWN", "BROWN HORSE", "HORSE IS BROWN"], "HORSE BROWN", "Same order as DOG BROWN."),
        blank("The cow is white.", "COW", "", ["WHITE", "BROWN", "IS"], "WHITE", "Noun, then color."),
        bank("Tap the ear flick, then the horn.", ["HORSE", "COW", "DOG", "CAT"], ["HORSE", "COW"], "HORSE flicks two fingers at the temple. COW twists a Y there."),
        match("Match the pairs.", [
          ["Horse", "HORSE"],
          ["Cow", "COW"],
          ["Brown", "BROWN"],
          ["White", "WHITE"],
        ]),
      ],
    ),
    lesson(
      "animals-sentences",
      "Animal sentences",
      "The animal is the topic. LIKE and WANT stay in the comment.",
      [
        choice("“I like dogs.”", ["DOG I LIKE", "I LIKE DOGS", "LIKE DOG I"], "DOG I LIKE", "One DOG can stand for the kind of animal."),
        bank("I like dogs.", ["DOG", "I", "LIKE", "THE", "A"], ["DOG", "I", "LIKE"], "Topic, person, verb."),
        choice("“I want a cat.”", ["CAT I WANT", "I WANT A CAT", "WANT CAT I"], "CAT I WANT", "a drops."),
        bank("I want a cat.", ["CAT", "I", "WANT", "A", "THE"], ["CAT", "I", "WANT"], "Three signs."),
        blank("The bird is yellow.", "BIRD", "", ["YELLOW", "BLUE", "IS"], "YELLOW", "Noun, then color."),
      
        choice("“I like cats” glosses as…", ["CAT I LIKE", "I LIKE CATS", "LIKE CAT I"], "CAT I LIKE", "The animal is the topic. LIKE stays in the comment."),
        choice("“The dog is yellow” glosses as…", ["DOG YELLOW", "YELLOW DOG THE", "DOG IS YELLOW"], "DOG YELLOW", "A color follows the animal, as in BIRD YELLOW."),
        blank("I want a bird.", "BIRD", "", ["I WANT", "WANT I", "A"], "I WANT", "Topic, then the comment."),
        bank("Build “I like cats.”", ["CAT", "I", "LIKE", "THE", "A", "IS"], ["CAT", "I", "LIKE"], "Same order as DOG I LIKE."),
        match("Match the pairs.", [
          ["Dog", "DOG"],
          ["Cat", "CAT"],
          ["Bird", "BIRD"],
          ["Like", "LIKE"],
        ]),
      ],
    ),
  ]),
  unit("weather", "Weather", "#/vocab/weather", [
    lesson(
      "weather-sky",
      "Sky",
      "RAIN and SNOW both fall. RAIN uses claw hands. SNOW uses open wiggling fingers. SUN circles beside the head. WIND sweeps sideways.",
      [
        match("Tap the matching pairs.", [
          ["Rain", "RAIN"],
          ["Snow", "SNOW"],
          ["Sun", "SUN"],
          ["Wind", "WIND"],
        ]),
        choice("RAIN uses…", ["Claw hands dropping", "A circle beside the head", "Fists shivering"], "Claw hands dropping", "The fingers flutter as the hands fall."),
        choice("SNOW differs from RAIN by…", ["Open fingers, still falling", "A twist at the wrist", "A clap"], "Open fingers, still falling", "The path is still down."),
        choice("SUN…", ["Circles beside the head", "Taps the wrist", "Draws a roof"], "Circles beside the head", "The index finger makes the circle."),
        choice("WIND moves…", ["Side to side", "Chin to cheek", "Palm to forehead"], "Side to side", "Both open hands sweep."),
      
        choice("SUN and WIND. SUN…", ["Circles beside the head", "Sweeps side to side", "Falls with claw hands"], "Circles beside the head", "WIND sweeps sideways. RAIN falls."),
        choice("SNOW and RAIN both fall. SNOW uses…", ["Open wiggling fingers", "Claw hands", "A circle beside the head"], "Open wiggling fingers", "RAIN uses claw hands."),
        blank("Gloss the sideways sweep.", "", "", ["WIND", "SUN", "RAIN"], "WIND", "Open hands sweep from side to side."),
        bank("Tap the claw-hand rain, then the open-finger snow.", ["RAIN", "SNOW", "SUN", "WIND"], ["RAIN", "SNOW"], "Both fall. The handshape tells them apart."),
        match("Match the pairs.", [
          ["Rain", "RAIN"],
          ["Snow", "SNOW"],
          ["Sun", "SUN"],
          ["Wind", "WIND"],
        ]),
      ],
    ),
    lesson(
      "weather-feel",
      "Hot and cold",
      "HOT throws a claw hand out from the mouth. COLD hunches the shoulders and shakes the fists. WEATHER twists two W hands.",
      [
        choice("HOT starts…", ["At the mouth", "At the wrist", "On the thigh"], "At the mouth", "The claw turns outward."),
        choice("COLD looks like…", ["Shivering fists", "A squeeze at the mouth", "A book"], "Shivering fists", "The shoulders come up."),
        choice("WEATHER uses…", ["Two W hands twisting", "A T hand shaking", "An index on the lips"], "Two W hands twisting", "The hands face each other, then change."),
        choice("“It is hot today.”", ["TODAY HOT", "IT IS HOT TODAY", "HOT IS TODAY"], "TODAY HOT", "Time first. it and is drop."),
        blank("Today it is cold.", "TODAY", "", ["COLD", "HOT", "IS"], "COLD", "The feeling is the comment."),
      
        choice("COLD and HOT. COLD…", ["Shakes the fists", "Throws a claw from the mouth", "Twists two W hands"], "Shakes the fists", "HOT starts at the mouth. WEATHER twists two W hands."),
        choice("“It is cold today” puts TODAY…", ["First", "After COLD", "In place of COLD"], "First", "The gloss is TODAY COLD. is drops."),
        blank("Hot today.", "TODAY", "", ["HOT", "COLD", "IS"], "HOT", "Time opens. The feeling is the comment."),
        bank("Build “It is cold today.”", ["TODAY", "COLD", "IS", "HOT", "WEATHER"], ["TODAY", "COLD"], "TODAY opens. is drops. The feeling is the comment."),
        match("Match the pairs.", [
          ["Hot", "HOT"],
          ["Cold", "COLD"],
          ["Weather", "WEATHER"],
          ["Today", "TODAY"],
        ]),
      ],
    ),
    lesson(
      "weather-sentences",
      "Weather sentences",
      "A yes/no about tomorrow’s weather is time, then the weather, then [q].",
      [
        choice("“Will it rain tomorrow?”", ["TOMORROW RAIN [q]", "WILL IT RAIN TOMORROW", "RAIN TOMORROW?"], "TOMORROW RAIN [q]", "Time, weather, raised eyebrows."),
        bank(
          "Will it rain tomorrow?",
          ["TOMORROW", "RAIN", "[q]", "WILL", "IT", "THE"],
          ["TOMORROW", "RAIN", "[q]"],
          "Three pieces. will and it drop.",
        ),
        choice("“It snowed yesterday.”", ["YESTERDAY SNOW", "IT SNOWED YESTERDAY", "SNOW YESTERDAY DID"], "YESTERDAY SNOW", "Time opens. The English ending drops."),
        blank("Is it windy today?", "TODAY WIND", "", ["[q]", "[wh-q]", "IS"], "[q]", "Yes/no, so [q]."),
        bank("Is it windy today?", ["TODAY", "WIND", "[q]", "IS", "IT"], ["TODAY", "WIND", "[q]"], "Time, weather, question marker."),
      
        choice("“Will it snow tomorrow?” glosses as…", ["TOMORROW SNOW [q]", "WILL IT SNOW TOMORROW", "SNOW TOMORROW?"], "TOMORROW SNOW [q]", "Time, then the weather, then [q]."),
        choice("“It rained yesterday” glosses as…", ["YESTERDAY RAIN", "IT RAINED YESTERDAY", "RAIN YESTERDAY DID"], "YESTERDAY RAIN", "Same order as YESTERDAY SNOW."),
        blank("Snow today, as a yes/no.", "TODAY SNOW", "", ["[q]", "[wh-q]", "IS"], "[q]", "A yes/no about the weather takes [q]."),
        bank("Build “Will it snow tomorrow?”", ["TOMORROW", "SNOW", "[q]", "WILL", "IT", "THE"], ["TOMORROW", "SNOW", "[q]"], "Time, weather, raised eyebrows."),
        match("Match the pairs.", [
          ["Tomorrow", "TOMORROW"],
          ["Yesterday", "YESTERDAY"],
          ["Rain", "RAIN"],
          ["Snow", "SNOW"],
        ]),
      ],
    ),
  ]),
  ...MORE_UNITS,
  ...ADVANCED_UNITS,
];

export const TOPIC_UNITS = withFilmLessons(TOPIC_UNITS_RAW, TOPIC_VOCAB, {
  lesson,
  choice,
  match,
});
