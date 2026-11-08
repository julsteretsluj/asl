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

function choice(prompt, options, answer, explain) {
  return {
    type: "choice",
    prompt,
    options: options.map((label) => ({ id: label, label })),
    answer,
    explain,
  };
}

function blank(prompt, before, after, options, answer, explain) {
  return { type: "blank", prompt, before, after, options, answer, explain };
}

function bank(prompt, tiles, answer, explain) {
  return { type: "bank", prompt, tiles, answer, explain };
}

function match(prompt, pairs) {
  return {
    type: "match",
    prompt,
    pairs: pairs.map(([a, b], index) => ({ id: String(index), a, b })),
    explain: "Each English idea has one gloss.",
  };
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

export const MORE_CATEGORIES = ["Numbers", "Body", "Health", "Travel", "Money", "Nature", "Sports", "Places"];

export const MORE_NOTES = {
  Numbers:
    "One through five face you. Six through nine turn the palm out, and the thumb meets a finger: pinky, ring, middle, then index. Ten shakes a thumb. Eleven and twelve flick up from a fist.",
  Body:
    "These signs touch the part or trace it. HAND cuts each wrist with the pinky edge of a flat hand. HEART is two pokes of a bent middle finger. One poke is a different sign.",
  Health:
    "SICK brings bent middle fingers in to the forehead and the stomach. HURT is two index fingers jabbing toward each other, and you can move that jab to the place that hurts. MEDICINE pivots a middle finger in the opposite palm.",
  Travel:
    "CAR is often fingerspelled, and a small steering wheel is the classic sign. BUS is B-U-S. AIRPLANE uses the I-love-you hand with the palm angled down, in a short double move. SUBWAY slides a Y hand under a flat hand.",
  Money:
    "MONEY is a flat-O tapped twice on the palm. BUY takes that hand forward out of the palm. One through nine dollars can be the number with a palm twist. BROKE chops at the neck.",
  Nature:
    "TREE is an open 5 on an upright arm, twisted twice. MOON is a small C made by the index finger and thumb. EARTH rocks on the base hand, which stands for the axis.",
  Sports:
    "PLAY shakes two Y hands. RUN hooks an L hand on the other thumb, and the index fingers flex as the hands move forward. FOOTBALL rams the fingers together twice, like two lines.",
  Places:
    "CITY taps the fingertips of flat hands, shifts, and taps again, like rooftops. CHURCH taps the thumb of a C on the back of a fist. BANK, ZOO, and a recreation PARK are fingerspelled.",
};

export const MORE_VOCAB = [
  sign("One", "ONE", "Numbers", "None required.", "Index finger up. The palm faces you.", "1-hand, palm in. The other fingers are closed.", "o/one.htm", "6GDdm_hL0xk"),
  sign("Two", "TWO", "Numbers", "None required.", "Index and middle fingers up, together. The palm faces you.", "Palm in. Two fingers stay side by side.", "t/two.htm"),
  sign("Three", "THREE", "Numbers", "None required.", "Thumb, index, and middle extend. The palm faces you.", "Palm in. Three digits: thumb plus two fingers.", "t/three.htm"),
  sign("Four", "FOUR", "Numbers", "None required.", "Four fingers up. The thumb is tucked. The palm faces you.", "Palm in. The thumb stays across the palm.", "f/four.htm", "AJL5-IfUXhY"),
  sign("Five", "FIVE", "Numbers", "None required.", "All five fingers spread. The palm faces you.", "Palm in. The hand is open.", "f/five.htm", "7rhyjZEpqVw"),
  sign("Six", "SIX", "Numbers", "None required.", "Palm out. The thumb touches the pinky. The other three fingers stay up.", "Palm out. Thumb to pinky.", "s/six.htm"),
  sign("Seven", "SEVEN", "Numbers", "None required.", "Palm out. The thumb touches the ring finger.", "Palm out. Thumb to ring finger.", "s/seven.htm"),
  sign("Eight", "EIGHT", "Numbers", "None required.", "Palm out. The thumb touches the middle finger.", "Palm out. Thumb to middle finger.", "e/eight.htm"),
  sign("Nine", "NINE", "Numbers", "None required.", "Palm out. The thumb touches the index finger. The other fingers stay up.", "Palm out. Thumb to index.", "n/nine.htm"),
  sign("Ten", "TEN", "Numbers", "None required.", "A fist with the thumb up, shaken side to side.", "Thumb-up fist, a small shake.", "t/ten.htm"),
  sign("Eleven", "ELEVEN", "Numbers", "None required.", "The index finger flicks up from the fist, twice.", "A repeated flick into a 1.", "e/eleven.htm"),
  sign("Twelve", "TWELVE", "Numbers", "None required.", "Index and middle flick up together, twice.", "A repeated flick into a 2.", "t/twelve.htm"),

  sign("Head", "HEAD", "Body", "None required.", "A bent hand pats the side of the forehead.", "Bent hand at the temple, a short pat.", "h/head.htm"),
  sign("Hair", "HAIR", "Body", "None required.", "Thumb and index pinch a bit of hair and tug it lightly.", "A pinch at the hair, a small pull.", "h/hair.htm", "9j2d2WQsriY"),
  sign("Eye", "EYE", "Body", "None required.", "The index finger points to the eye.", "1-hand aimed at the eye.", "e/eye.htm"),
  sign("Nose", "NOSE", "Body", "None required.", "The index finger touches the nose.", "1-hand, a tap on the nose.", "n/nose.htm", "2FpYi18-FiU"),
  sign("Mouth", "MOUTH", "Body", "None required.", "The index finger outlines the lips.", "1-hand circles the mouth.", "m/mouth.htm", "OtK8Jv4U1CE"),
  sign("Ear", "EAR", "Body", "None required.", "The index finger touches the ear.", "1-hand, a tap at the ear.", "e/ear.htm", "Eqq_OZk1Eh4"),
  sign("Face", "FACE", "Body", "None required.", "A 5-hand, palm toward you, circles the face once.", "Palm-back 5, one circle around the face.", "f/face.htm", "8_GCUYb19w0"),
  sign("Teeth", "TEETH", "Body", "A smile shows the teeth. The hand is the sign.", "An X hand moves from one side of the mouth to the other.", "Bent index crosses the teeth.", "t/teeth.htm"),
  sign("Hand", "HAND", "Body", "None required.", "The pinky edge of a flat hand slices one wrist, then the other hand slices back.", "B-hand edge at each wrist.", "h/hand.htm", "upxc0OPGAkY"),
  sign("Stomach", "STOMACH", "Body", "None required.", "Pat the stomach twice. A bent hand can poke it instead.", "Open hand, two pats on the stomach.", "s/stomach.htm"),
  sign("Heart", "HEART", "Body", "None required.", "The bent middle finger of an open hand pokes the chest twice. One larger poke is a different sign.", "Modified 5, middle finger bent, two taps on the chest.", "h/heart.htm", "lPP5FVC08n4"),
  sign("Foot", "FOOT", "Body", "None required.", "The index finger points to the foot.", "1-hand aimed down at the foot.", "f/foot.htm"),

  sign("Sick", "SICK", "Health", "None required.", "Modified 5-hands, middle fingers bent, start just off the forehead and the stomach, then touch.", "Both middle fingers contact the forehead and the stomach.", "s/sick.htm", "oe9All9w7Ng"),
  sign("Hurt", "HURT", "Health", "None required.", "Two index fingers point at each other and twist inward, a jab. Place the jab where it hurts.", "Two 1-hands twist toward each other.", "h/hurt.htm", "xs4k_Qf3BSc"),
  sign("Headache", "HEADACHE", "Health", "None required.", "The HURT jab sits at the forehead. Forms vary. Copy the film.", "Two index fingers jab at the forehead.", "h/headache.htm", "hCePLZW65pQ"),
  sign("Medicine", "MEDICINE", "Health", "None required.", "The middle finger touches the opposite palm, then pivots side to side.", "Open-8 middle finger rocks in the palm.", "m/medicine.htm", "R62C5PdSB1o"),
  sign("Hospital", "HOSPITAL", "Health", "None required.", "An H hand draws a small cross on the shoulder.", "H-hand traces a cross at the shoulder.", "h/hospital.htm", "syueldx2RHQ"),
  sign("Dizzy", "DIZZY", "Health", "A dizzy face helps. The circling hand is the sign.", "A claw hand circles near the upper front of the head.", "Clawed 5, a circle by the forehead.", "d/dizzy.htm", "68igHxkWBfw"),
  sign("Cough", "COUGH", "Health", "None required.", "One form strikes the chest with the thumb side of a fist. Other forms are used. Copy the film.", "A fist contacts the chest. The film picks the form.", "c/cough.htm", "5GZ1yv24OII"),
  sign("Pill", "PILL", "Health", "None required.", "The noun is often fingerspelled. TAKE-PILL flicks a G hand toward the mouth. A smaller double flick can name the pill.", "G-hand flicks toward the mouth.", "p/pill.htm", "2O4cCgMGpXM"),
  sign("Better", "BETTER", "Health", "None required.", "Fingertips of a flat hand touch the chin, then the hand moves up.", "Flat hand leaves the chin on an upward path.", "b/better.htm", "0G80qJqwweI"),
  sign("Vomit", "VOMIT", "Health", "A grimace is common. The hand still has a citation path.", "An open hand starts at the mouth and thrusts out and down. It can also mean a strong distaste.", "5-hand leaves the mouth and moves outward.", "v/vomit.htm", "eyu6rDm1uFM"),

  sign("Car", "CAR", "Travel", "None required.", "Two fists turn a small wheel. Spelling C-A-R is also common, and at speed it can look a little lexicalized.", "Two S-hands mime a short turn of a wheel.", "c/car.htm", "YfwGL0ZIBqE"),
  sign("Bus", "B-U-S", "Travel", "None required.", "Fingerspell B-U-S, quickly. A bent V pulled back twice is a variation, the old bell cord.", "Three letters: B, U, S.", "b/bus.htm", "JGjSwqnSmdA"),
  sign("Train", "TRAIN", "Travel", "None required.", "The dominant H hand slides back and forth on the other H, like wheels on a track.", "Two H-hands. One rubs along the other.", "t/train.htm"),
  sign("Airplane", "AIRPLANE", "Travel", "None required.", "Thumb, index, and pinky are out. The hand moves forward a short way, twice. Angle the palm down so it does not read as I-LOVE-YOU.", "ILY hand, palm angled down, a small double move forward.", "a/airplane.htm", "eD5BTz7lR-o"),
  sign("Bicycle", "BICYCLE", "Travel", "None required.", "Two fists circle forward, the pedals.", "Two S-hands alternate in circles.", "b/bicycle.htm", "8yjqcyk-xwY"),
  sign("Walk", "WALK", "Travel", "None required.", "Both flat hands hang down and alternate forward, the legs.", "Palms in or down, fingers pointing down, an alternating swing.", "w/walk.htm", "5iv2XtBzogU"),
  sign("Drive", "DRIVE", "Travel", "None required.", "The hands turn a wheel. This is the action. The classic CAR sign is that same wheel, held smaller.", "Two fists turn, as if steering.", "d/drive.htm", "_fYdWJp5-to"),
  sign("Motorcycle", "MOTORCYCLE", "Travel", "None required.", "Two fists twist, as if gripping handlebars.", "Both hands twist at the wrists.", "m/motorcycle.htm", "suzyI59Ryh0"),
  sign("Boat", "BOAT", "Travel", "None required.", "Cupped hands meet and move forward, a hull on the water.", "Both hands, palms up, move forward together.", "b/boat.htm", "aDt-KNA-v04"),
  sign("Subway", "SUBWAY", "Travel", "None required.", "A Y hand slides back and forth under a flat hand, a car underground.", "Y-hand under a palm-down hand, a short slide.", "s/subway.htm", "94f1aywB0h8"),

  sign("Money", "MONEY", "Money", "None required.", "A flat-O taps the opposite palm twice, lightly.", "Flat-O on the base palm, two taps.", "m/money.htm", "JfpXG0yxIsU"),
  sign("Dollar", "DOLLAR", "Money", "None required.", "From one to nine, the number twists from palm-out to palm-in. From ten up, sign the number, then one hand slides off the fingertips of the other.", "A palm twist on 1–9, or a slide off the fingers for the separate sign.", "d/dollar.htm"),
  sign("Buy", "BUY", "Money", "None required.", "A flat-O starts in the opposite palm and moves out. The money leaves.", "Flat-O leaves the palm, moving forward.", "b/buy.htm", "wEPDfmy2M8w"),
  sign("Sell", "SELL", "Money", "None required.", "Both flat-O hands point forward and the wrists twist, like setting goods out.", "Two flat-O hands, a small outward twist.", "s/sell.htm", "6QY2WDxRpg4"),
  sign("Store", "STORE", "Money", "None required.", "Both flat-O hands swing outward from the chest, twice.", "Flat-O hands pivot out, a double movement.", "s/store.htm", "CPp1UOM-olA"),
  sign("Cheap", "CHEAP", "Money", "None required.", "The dominant hand brushes down across the opposite palm.", "A downward brush on the palm.", "c/cheap.htm"),
  sign("Expensive", "EXPENSIVE", "Money", "None required.", "A flat-O on the palm opens and flicks upward. The money leaves.", "Flat-O opens as the hand rises off the palm.", "e/expensive.htm", "ZdmmD6ZsQrw"),
  sign("Pay", "PAY", "Money", "None required.", "The index finger starts on the opposite palm and moves out toward the person you pay.", "1-hand leaves the palm and travels forward.", "p/pay.htm", "QsO6GlRytyM"),
  sign("Cost", "COST", "Money", "None required.", "A bent index finger, an X, taps the opposite palm.", "X-hand strikes the palm.", "c/cost.htm", "lxMBjE6rjEA"),
  sign("Cent", "CENT", "Money", "None required.", "The index finger touches the forehead, palm toward you, then the hand pulls away.", "1-hand at the forehead moves out. It is also a form of THINK.", "c/cent.htm", "erCXJxrNtT4"),
  sign("Broke", "BROKE", "Money", "None required.", "The hand chops at the side of the neck. This means you have no money.", "The edge of the hand strikes the neck.", "b/broke.htm", "QklvsnvX34A"),

  sign("Tree", "TREE", "Nature", "None required.", "The forearm stands up. An open 5-hand twists twice, the branches.", "5-hand on an upright arm, two twists.", "t/tree.htm", "DMdPpkiUJso"),
  sign("Flower", "FLOWER", "Nature", "None required.", "A flat-O touches one side of the nose, then the other.", "Flat-O, right side of the nose then left.", "f/flower.htm", "33DHyOmJN1Y"),
  sign("Mountain", "MOUNTAIN", "Nature", "None required.", "A fist taps the back of the other fist, then both hands draw the slopes up and out.", "A tap of the fists, then two hands trace peaks.", "m/mountain.htm", "u3xYMeKi63Y"),
  sign("River", "RIVER", "Nature", "None required.", "Both hands, palms down, flow forward and weave.", "Two flat hands move forward on a wavy path.", "r/river.htm", "NyaG1U8eSOk"),
  sign("Ocean", "OCEAN", "Nature", "None required.", "Both curved hands roll forward. The swells are larger than RIVER.", "Curved hands, a forward roll.", "o/ocean.htm", "puXKd_B3Ggc"),
  sign("Grass", "GRASS", "Nature", "None required.", "The fingers sprout up past the other hand and wiggle, like blades.", "Fingers rise through the base hand and flutter.", "g/grass.htm", "o-GOlFqc_aw"),
  sign("Rock", "ROCK", "Nature", "None required.", "The dominant fist taps the back of the other fist. This is stone, and it is also the start of MOUNTAIN.", "S-hand taps the back of the other S-hand.", "r/rock.htm"),
  sign("Moon", "MOON", "Nature", "None required.", "Index and thumb make a small C, held up like a crescent. Another form taps that C at the eye.", "Modified C in the space beside the head.", "m/moon.htm"),
  sign("Star", "STAR", "Nature", "None required.", "Both index fingers point up and brush past each other, alternating.", "Two 1-hands strike upward in turn.", "s/star.htm", "bJDfhOu2E9U"),
  sign("Earth", "EARTH", "Nature", "None required.", "The base hand is the axis. The dominant hand sits on it and rocks.", "Dominant hand rocks on the non-dominant hand.", "e/earth.htm"),
  sign("Plant", "PLANT", "Nature", "None required.", "A flat-O, the seed, moves down into the other hand. The fingers then rise.", "Flat-O drops in, then the fingers grow up.", "p/plant.htm", "BzW5Uy29n8c"),
  sign("Leaf", "LEAF", "Nature", "None required.", "One index finger holds the other wrist. The open hand waves.", "A 5-hand flutters from the wrist.", "l/leaf.htm"),

  sign("Play", "PLAY", "Sports", "None required.", "Two Y hands shake. This is playing, not a theater play.", "Y-hands twist at the wrists.", "p/play.htm", "wSj0zfdppNc"),
  sign("Ball", "BALL", "Sports", "None required.", "Both curved hands outline a ball.", "Two C-hands meet as if holding a sphere.", "b/ball.htm", "1WX8ohyKYQY"),
  sign("Basketball", "BASKETBALL", "Sports", "None required.", "Both hands mime a ball at the chest, then the wrists flick forward, a shot.", "Two hands hold, then the wrists snap forward.", "b/basketball.htm", "hMTxTnXCzOo"),
  sign("Football", "FOOTBALL", "Sports", "None required.", "The fingers stand up like two lines and ram together, twice.", "Both 5-hands clash at the fingers, a double movement.", "f/football.htm", "jgfU7uDgV0k"),
  sign("Baseball", "BASEBALL", "Sports", "None required.", "Two fists hold a bat and swing.", "Both S-hands swing together.", "b/baseball.htm", "duIAeHtwFI8"),
  sign("Swim", "SWIM", "Sports", "None required.", "Both hands, palms down, sweep out from the center and repeat.", "Palms down, a breaststroke in front of the chest.", "s/swim.htm", "O_61C7CWXBQ"),
  sign("Run", "RUN", "Sports", "None required.", "Both hands are L shapes. One index lies on the other thumb. The hands move forward and the index fingers flex. The moving index wraps that thumb.", "Two L-hands link and travel forward, index fingers flexing.", "r/run.htm", "jPGs28X_O54"),
  sign("Dance", "DANCE", "Sports", "None required.", "A V hand, fingers down, swings over the opposite palm. The fingers are the feet.", "V-hand sweeps across the palm.", "d/dance.htm", "p3UKhedGeTA"),
  sign("Game", "GAME", "Sports", "None required.", "Two thumbs-up fists knock together, the two sides.", "A-hands or thumbs-up fists meet.", "g/game.htm", "17gZsl0jClE"),
  sign("Soccer", "SOCCER", "Sports", "None required.", "A common form shows a ball meeting the bottom of a foot. Forms vary. Copy the film.", "The hands depict a kick. The film picks the form.", "s/soccer.htm", "IWB--Bye4xE"),

  sign("City", "CITY", "Places", "None required.", "The fingertips of flat hands touch, like a roof. The hands shift a little and touch again.", "Flat hands, fingertips meet, move, and meet again.", "c/city.htm", "R6T2OTSZNck"),
  sign("Restaurant", "RESTAURANT", "Places", "None required.", "An R hand taps the side of the mouth.", "R-hand at the lips, a short tap.", "r/restaurant.htm"),
  sign("Church", "CHURCH", "Places", "None required.", "The thumb of a C hand taps the back of the other fist. The tap is up and down, not a circle.", "C-hand thumb on an S-hand, one or two taps.", "c/church.htm", "d3oSWkxdHNo"),
  sign("Movie", "MOVIE", "Places", "None required.", "The dominant hand twists side to side against the other hand. The base hand can stand up or lie palm down.", "A twist against the non-dominant hand.", "m/movie.htm", "3xPiPWg5nhI"),
  sign("Street", "STREET", "Places", "None required.", "Two flat hands, palms facing, move forward together. The same sign is way, path, and road.", "Both B-hands travel forward, palms in.", "s/street.htm", "n9RE7lOpF4w"),
  sign("Building", "BUILDING", "Places", "None required.", "Flat hands stack, one above the other, and rise. The same family can mean the act of building.", "Both hands alternate upward, showing floors.", "b/building.htm", "_UAPcbyeN_I"),
  sign("Hotel", "HOTEL", "Places", "None required.", "An H hand is the flag. The other index finger is the pole.", "H-hand set on a 1-hand.", "h/hotel.htm"),
  sign("Bank", "B-A-N-K", "Places", "None required.", "Fingerspell B-A-N-K. At speed some letters blend. It is still spelling.", "Four letters, produced quickly.", "b/bank.htm", "yxQCw_MF3CQ"),
  sign("Zoo", "Z-O-O", "Places", "None required.", "Fingerspell Z-O-O. The second O can be a small second O, not a new handshape.", "Three letters: Z, O, O.", "z/zoo.htm"),
  sign("Park", "P-A-R-K", "Places", "None required.", "For a recreation place, fingerspell P-A-R-K. Parking a car is a different sign. An area of trees can be TREE, slid along the arm.", "Four letters: P, A, R, K.", "p/park.htm"),
];

export const MORE_UNITS = [
  unit("numbers", "Numbers", "#/vocab/numbers", [
    lesson(
      "numbers-one-five",
      "One through five",
      "These five face you. THREE uses the thumb, the index, and the middle. FOUR tucks the thumb.",
      [
        match("Tap the matching pairs.", [
          ["One", "ONE"],
          ["Two", "TWO"],
          ["Three", "THREE"],
          ["Four", "FOUR"],
        ]),
        choice("ONE through FIVE face…", ["You", "Out, away from you", "The floor"], "You", "The palm is toward the signer."),
        choice("THREE extends…", ["Thumb, index, and middle", "Index, middle, and ring", "All five fingers"], "Thumb, index, and middle", "The thumb is part of three."),
        choice("FOUR keeps the thumb…", ["Tucked across the palm", "Touching the pinky", "Shaking"], "Tucked across the palm", "Four fingers stand up."),
        choice("FIVE is…", ["All five fingers, spread", "A fist with the thumb up", "An index flick"], "All five fingers, spread", "The palm still faces you."),
      
        choice("TWO, like ONE and FIVE, faces…", ["You", "Out", "The floor"], "You", "These five keep the palm toward the signer."),
        choice("FIVE spreads every finger. FOUR…", ["Tucks the thumb", "Uses the thumb as one of three", "Flicks the index"], "Tucks the thumb", "THREE includes the thumb. FOUR keeps it across the palm."),
        blank("Gloss the palm-in hand with every finger spread.", "", "", ["FIVE", "FOUR", "THREE"], "FIVE", "The palm still faces you."),
        bank("Tap three, then four.", ["THREE", "FOUR", "ONE", "FIVE", "TWO"], ["THREE", "FOUR"], "THREE uses the thumb, index, and middle. FOUR tucks the thumb."),
        match("Match the pairs.", [
          ["One", "ONE"],
          ["Two", "TWO"],
          ["Five", "FIVE"],
          ["Three", "THREE"],
        ]),
      ],
    ),
    lesson(
      "numbers-six-twelve",
      "Six through twelve",
      "Six through nine turn the palm out. The thumb tells them apart. Ten shakes. Eleven and twelve flick.",
      [
        match("Tap the matching pairs.", [
          ["Six", "SIX"],
          ["Seven", "SEVEN"],
          ["Eight", "EIGHT"],
          ["Nine", "NINE"],
        ]),
        choice("SIX through NINE face…", ["Out", "You", "The chest"], "Out", "The palm turns away."),
        choice("In SIX the thumb touches…", ["The pinky", "The index", "The forehead"], "The pinky", "Seven moves to the ring finger. Eight to the middle. Nine to the index."),
        choice("TEN is…", ["A thumb shaken side to side", "Two fingers flicked up", "A palm-in five"], "A thumb shaken side to side", "The fist stays closed."),
        choice("TWELVE flicks…", ["Index and middle together", "Only the pinky", "A flat-O on the palm"], "Index and middle together", "ELEVEN flicks the index alone."),
      
        choice("SEVEN, after SIX, touches…", ["The ring finger", "The pinky", "The index"], "The ring finger", "The palm stays out. The thumb moves from pinky to ring to middle to index."),
        choice("ELEVEN flicks…", ["The index, twice", "Index and middle together", "A thumb side to side"], "The index, twice", "TWELVE flicks index and middle. TEN shakes the thumb."),
        blank("Gloss the outward palm with the thumb on the index.", "", "", ["NINE", "SIX", "TEN"], "NINE", "Nine is the last of the palm-out set."),
        bank("Tap ten, then twelve.", ["TEN", "TWELVE", "ELEVEN", "SIX", "NINE"], ["TEN", "TWELVE"], "TEN shakes a thumb. TWELVE flicks index and middle."),
        match("Match the pairs.", [
          ["Six", "SIX"],
          ["Ten", "TEN"],
          ["Eleven", "ELEVEN"],
          ["Twelve", "TWELVE"],
        ]),
      ],
    ),
    lesson(
      "numbers-sentences",
      "Number sentences",
      "The thing comes first. The number is the comment, the way a color is. BOOK THREE means three books.",
      [
        choice("“I have three books.”", ["BOOK THREE I HAVE", "I HAVE THREE BOOKS", "THREE BOOK HAVE I"], "BOOK THREE I HAVE", "Noun, number, then the comment."),
        blank("I want five apples.", "APPLE FIVE", "", ["I WANT", "WANT I", "THE"], "I WANT", "The food and the number are the topic."),
        bank("I want five apples.", ["APPLE", "FIVE", "I", "WANT", "THE", "A"], ["APPLE", "FIVE", "I", "WANT"], "Noun, number, person, verb."),
        choice("“Is it ten?”", ["TEN [q]", "IS IT TEN", "TEN IS?"], "TEN [q]", "Yes/no. The brows rise."),
        bank("Is it twelve?", ["TWELVE", "[q]", "IS", "IT", "THE"], ["TWELVE", "[q]"], "The number, then the question marker."),
      
        choice("“I have five apples” glosses as…", ["APPLE FIVE I HAVE", "I HAVE FIVE APPLES", "FIVE APPLE HAVE I"], "APPLE FIVE I HAVE", "The thing, then the number, then the comment."),
        choice("“Is it three?” glosses as…", ["THREE [q]", "IS IT THREE", "THREE IS?"], "THREE [q]", "Same yes/no pattern as TEN [q]."),
        blank("Three books, and I want them.", "BOOK THREE", "", ["I WANT", "WANT I", "THE"], "I WANT", "The number stays with the noun. the drops."),
        bank("Build “I have five apples.”", ["APPLE", "FIVE", "I", "HAVE", "THE", "A"], ["APPLE", "FIVE", "I", "HAVE"], "Same order as BOOK THREE I HAVE."),
        match("Match the pairs.", [
          ["Book", "BOOK"],
          ["Apple", "APPLE"],
          ["Five", "FIVE"],
          ["Twelve", "TWELVE"],
        ]),
      ],
    ),
  ]),
  unit("body", "Body", "#/vocab/body", [
    lesson(
      "body-face",
      "The face",
      "Point to the part, or trace it. EYE points. NOSE touches. MOUTH outlines the lips. FACE circles with a 5-hand.",
      [
        match("Tap the matching pairs.", [
          ["Head", "HEAD"],
          ["Eye", "EYE"],
          ["Nose", "NOSE"],
          ["Mouth", "MOUTH"],
        ]),
        choice("HEAD uses…", ["A bent hand at the side of the forehead", "A circle of a 5-hand", "A slice at the wrist"], "A bent hand at the side of the forehead", "The pat is at the temple."),
        choice("EYE…", ["Points to the eye", "Circles the whole face", "Pokes the chest twice"], "Points to the eye", "One index finger."),
        choice("MOUTH…", ["Outlines the lips", "Pinches the hair", "Pats the stomach"], "Outlines the lips", "The index finger draws that circle."),
        choice("FACE circles with…", ["A palm-back 5-hand", "An X on the teeth", "Two fists"], "A palm-back 5-hand", "One circle around the face."),
      
        choice("NOSE…", ["Touches the nose", "Circles the whole face", "Outlines the lips"], "Touches the nose", "EYE points. MOUTH outlines. FACE circles."),
        choice("FACE and HEAD. FACE…", ["Circles with a palm-back 5-hand", "Pats the side of the forehead with a bent hand", "Points with the index"], "Circles with a palm-back 5-hand", "HEAD is the bent hand at the temple."),
        blank("Gloss the point.", "", "", ["EYE", "MOUTH", "FACE"], "EYE", "The index finger points to the eye."),
        bank("Tap the lip outline, then the circle around the face.", ["MOUTH", "FACE", "HEAD", "NOSE", "EYE"], ["MOUTH", "FACE"], "MOUTH outlines the lips. FACE circles once."),
        match("Match the pairs.", [
          ["Head", "HEAD"],
          ["Eye", "EYE"],
          ["Nose", "NOSE"],
          ["Face", "FACE"],
        ]),
      ],
    ),
    lesson(
      "body-more",
      "Hands and trunk",
      "HAND slices each wrist with the pinky edge of a flat hand. HEART pokes the chest twice with a bent middle finger. One poke means something else.",
      [
        match("Tap the matching pairs.", [
          ["Ear", "EAR"],
          ["Teeth", "TEETH"],
          ["Hand", "HAND"],
          ["Heart", "HEART"],
        ]),
        choice("TEETH uses…", ["An X hand across the mouth", "A 5-hand circle", "A point at the foot"], "An X hand across the mouth", "The bent index travels from side to side."),
        choice("HAND looks a bit like…", ["Slicing each wrist", "A steering wheel", "A roof"], "Slicing each wrist", "Each flat hand marks the other wrist."),
        choice("HEART pokes the chest…", ["Twice", "Never", "With an open palm only"], "Twice", "One larger poke is a different sign."),
        choice("STOMACH is…", ["Two pats on the stomach", "A cross on the shoulder", "A flick at the ear"], "Two pats on the stomach", "A bent hand can poke instead."),
      
        choice("One poke of that bent middle finger is…", ["A different sign", "HEART", "STOMACH"], "A different sign", "HEART pokes the chest twice."),
        choice("HAND slices with…", ["The pinky edge of a flat hand", "An X across the mouth", "Two pats"], "The pinky edge of a flat hand", "One wrist, then the other."),
        blank("Gloss the two chest pokes.", "", "", ["HEART", "STOMACH", "TEETH"], "HEART", "The bent middle finger pokes twice."),
        bank("Tap the wrist slice, then the two pats on the stomach.", ["HAND", "STOMACH", "HEART", "TEETH", "EAR"], ["HAND", "STOMACH"], "HAND slices each wrist. STOMACH is two pats."),
        match("Match the pairs.", [
          ["Ear", "EAR"],
          ["Teeth", "TEETH"],
          ["Hand", "HAND"],
          ["Heart", "HEART"],
        ]),
      ],
    ),
    lesson(
      "body-sentences",
      "Body sentences",
      "Name the part, then the comment. A color still follows the noun.",
      [
        choice("“The eye is red.”", ["EYE RED", "RED EYE THE", "EYE IS RED"], "EYE RED", "Noun, then color."),
        blank("I have two hands.", "HAND TWO", "", ["I HAVE", "HAVE I", "THE"], "I HAVE", "The part and the number come first."),
        bank("I have two hands.", ["HAND", "TWO", "I", "HAVE", "THE", "A"], ["HAND", "TWO", "I", "HAVE"], "Noun, number, person, verb."),
        choice("HAIR is…", ["A pinch and a light tug", "A slice at the wrist", "A thumb shake"], "A pinch and a light tug", "Thumb and index take a bit of hair."),
        bank("The eye is red.", ["EYE", "RED", "IS", "THE", "A"], ["EYE", "RED"], "Two signs."),
      
        choice("“I have two eyes” glosses as…", ["EYE TWO I HAVE", "I HAVE TWO EYES", "TWO EYE HAVE I"], "EYE TWO I HAVE", "Same order as HAND TWO I HAVE."),
        choice("HAIR is produced by…", ["A pinch and a light tug", "A slice at the wrist", "Two pokes on the chest"], "A pinch and a light tug", "The hand takes a bit of hair."),
        blank("The hair is red.", "HAIR", "", ["RED", "TWO", "IS"], "RED", "A color follows the noun."),
        bank("Build “The hair is red.”", ["HAIR", "RED", "IS", "THE", "A"], ["HAIR", "RED"], "Noun, then color. is drops."),
        match("Match the pairs.", [
          ["Eye", "EYE"],
          ["Hand", "HAND"],
          ["Hair", "HAIR"],
          ["Two", "TWO"],
        ]),
      ],
    ),
  ]),
  unit("health", "Health", "#/vocab/health", [
    lesson(
      "health-sick",
      "Sick and hurt",
      "SICK touches the forehead and the stomach with bent middle fingers. HURT is a jab you can move. A headache puts that jab at the forehead.",
      [
        match("Tap the matching pairs.", [
          ["Sick", "SICK"],
          ["Hurt", "HURT"],
          ["Headache", "HEADACHE"],
          ["Medicine", "MEDICINE"],
        ]),
        choice("SICK contacts…", ["Forehead and stomach", "Both wrists", "The shoulder only"], "Forehead and stomach", "Middle fingers of modified 5-hands."),
        choice("HURT is…", ["Two index fingers jabbing inward", "A flat-O on the palm", "A wave of the fingers"], "Two index fingers jabbing inward", "Move the jab to the place that hurts."),
        choice("HEADACHE places that jab…", ["At the forehead", "On the opposite palm", "At the foot"], "At the forehead", "Same family as HURT. The place changes."),
        choice("MEDICINE pivots…", ["A middle finger in the palm", "An H on the shoulder", "A Y hand"], "A middle finger in the palm", "Side to side, a couple of times."),
      
        choice("You can move the HURT jab. A headache keeps it…", ["At the forehead", "In the opposite palm", "On the stomach only"], "At the forehead", "HEADACHE is that jab at the forehead."),
        choice("MEDICINE uses…", ["A middle finger pivoting in the palm", "Bent middle fingers on the forehead and the stomach", "Two index fingers"], "A middle finger pivoting in the palm", "SICK is the forehead and the stomach."),
        blank("Gloss the jab you can move.", "", "", ["HURT", "SICK", "MEDICINE"], "HURT", "Two index fingers twist toward each other."),
        bank("Tap sick, then the jab at the forehead.", ["SICK", "HEADACHE", "HURT", "MEDICINE"], ["SICK", "HEADACHE"], "SICK touches the forehead and the stomach. HEADACHE places the jab at the forehead."),
        match("Match the pairs.", [
          ["Sick", "SICK"],
          ["Hurt", "HURT"],
          ["Headache", "HEADACHE"],
          ["Medicine", "MEDICINE"],
        ]),
      ],
    ),
    lesson(
      "health-care",
      "Care",
      "HOSPITAL draws a cross on the shoulder with an H. DIZZY circles a claw by the head. BETTER leaves the chin and moves up.",
      [
        match("Tap the matching pairs.", [
          ["Hospital", "HOSPITAL"],
          ["Dizzy", "DIZZY"],
          ["Cough", "COUGH"],
          ["Better", "BETTER"],
        ]),
        choice("HOSPITAL draws…", ["A cross on the shoulder", "A roof", "A wheel"], "A cross on the shoulder", "The handshape is H."),
        choice("DIZZY uses…", ["A claw circling by the head", "Two pats on the stomach", "A flat-O tap"], "A claw circling by the head", "A dizzy face can ride along. The hand is the sign."),
        choice("One form of COUGH…", ["Strikes the chest with the thumb side of a fist", "Flicks a number", "Circles the face"], "Strikes the chest with the thumb side of a fist", "Other forms exist. The film is the one to copy."),
        choice("BETTER moves…", ["Up from the chin", "Down the chest", "Out from the ear"], "Up from the chin", "A flat hand, fingertips at the chin, then up."),
      
        choice("BETTER leaves the chin and…", ["Moves up", "Draws a cross", "Circles a claw"], "Moves up", "HOSPITAL draws the cross. DIZZY circles."),
        choice("COUGH, in the form this lesson uses, contacts…", ["The chest", "The shoulder", "The chin"], "The chest", "The thumb side of a fist strikes the chest."),
        blank("Gloss the cross on the shoulder.", "", "", ["HOSPITAL", "DIZZY", "BETTER"], "HOSPITAL", "An H hand draws a small cross."),
        bank("Tap the claw circling by the head, then the sign that moves up from the chin.", ["DIZZY", "BETTER", "COUGH", "HOSPITAL"], ["DIZZY", "BETTER"], "DIZZY circles. BETTER leaves the chin on an upward path."),
        match("Match the pairs.", [
          ["Hospital", "HOSPITAL"],
          ["Dizzy", "DIZZY"],
          ["Cough", "COUGH"],
          ["Better", "BETTER"],
        ]),
      ],
    ),
    lesson(
      "health-sentences",
      "Health sentences",
      "Time still opens. am drops. A yes/no about how you feel takes [q].",
      [
        choice("“I am sick now.”", ["NOW I SICK", "I AM SICK NOW", "SICK AM I"], "NOW I SICK", "Time first. am drops."),
        blank("Are you sick?", "YOU SICK", "", ["[q]", "[wh-q]", "ARE"], "[q]", "Yes/no, so the brows rise."),
        bank("Are you sick?", ["YOU", "SICK", "[q]", "ARE", "DO"], ["YOU", "SICK", "[q]"], "Person, sign, question marker."),
        choice("“I want medicine.”", ["MEDICINE I WANT", "I WANT THE MEDICINE", "WANT MEDICINE I"], "MEDICINE I WANT", "The thing is the topic."),
        bank("I am dizzy today.", ["TODAY", "I", "DIZZY", "AM", "THE"], ["TODAY", "I", "DIZZY"], "Today leads."),
      
        choice("“Are you dizzy?” glosses as…", ["YOU DIZZY [q]", "ARE YOU DIZZY", "DIZZY YOU?"], "YOU DIZZY [q]", "Same yes/no pattern as YOU SICK [q]."),
        choice("“I want medicine today” opens with…", ["TODAY", "MEDICINE", "I"], "TODAY", "Time still opens."),
        blank("Sick today.", "TODAY I", "", ["SICK", "AM", "THE"], "SICK", "TODAY I SICK. am drops."),
        bank("Build “I want medicine today.”", ["TODAY", "MEDICINE", "I", "WANT", "AM", "THE"], ["TODAY", "MEDICINE", "I", "WANT"], "Time, then the thing, then I WANT."),
        match("Match the pairs.", [
          ["Sick", "SICK"],
          ["Dizzy", "DIZZY"],
          ["Medicine", "MEDICINE"],
          ["Yes/no marker", "[q]"],
        ]),
      ],
    ),
  ]),
  unit("travel", "Travel", "#/vocab/travel", [
    lesson(
      "travel-rides",
      "Rides",
      "CAR can be a small wheel or C-A-R. BUS is spelled. TRAIN is two H hands. AIRPLANE is the I-love-you hand, palm down, moved twice.",
      [
        match("Tap the matching pairs.", [
          ["Car", "CAR"],
          ["Bus", "B-U-S"],
          ["Train", "TRAIN"],
          ["Airplane", "AIRPLANE"],
        ]),
        choice("A classic CAR is…", ["Two fists turning a small wheel", "A Y hand under a palm", "An R at the mouth"], "Two fists turning a small wheel", "Spelling C-A-R is also common."),
        choice("Bill’s recommended BUS is…", ["Fingerspelled B-U-S", "A steering wheel held high", "Two claps"], "Fingerspelled B-U-S", "A bent V pulled backward is a variation."),
        choice("TRAIN slides…", ["One H hand along the other", "A flat-O off the chin", "An index up the cheek"], "One H hand along the other", "The path is back and forth, like a track."),
        choice("AIRPLANE must angle the palm down so it is not…", ["I-LOVE-YOU", "TEN", "MONEY"], "I-LOVE-YOU", "Same family of hand. The palm and the short double move make the plane."),
      
        choice("C-A-R is another way to sign…", ["CAR", "TRAIN", "AIRPLANE"], "CAR", "The classic sign is also a small wheel. Spelling C-A-R is common."),
        choice("AIRPLANE angles the palm down so it does not read as…", ["I-LOVE-YOU", "B-U-S", "TRAIN"], "I-LOVE-YOU", "Thumb, index, and pinky are out. The palm and the short double move make the plane."),
        blank("Gloss the spelled bus.", "", "", ["B-U-S", "CAR", "TRAIN"], "B-U-S", "Three letters: B, U, S."),
        bank("Tap the wheel, then the H hands on a track.", ["CAR", "TRAIN", "B-U-S", "AIRPLANE"], ["CAR", "TRAIN"], "CAR turns a small wheel. TRAIN slides one H hand along the other."),
        match("Match the pairs.", [
          ["Car", "CAR"],
          ["Bus", "B-U-S"],
          ["Train", "TRAIN"],
          ["Airplane", "AIRPLANE"],
        ]),
      ],
    ),
    lesson(
      "travel-move",
      "On the way",
      "WALK alternates the hands like legs. DRIVE turns a wheel. SUBWAY is a Y hand sliding under a flat hand.",
      [
        match("Tap the matching pairs.", [
          ["Walk", "WALK"],
          ["Bicycle", "BICYCLE"],
          ["Boat", "BOAT"],
          ["Subway", "SUBWAY"],
        ]),
        choice("BICYCLE looks like…", ["Two fists circling, the pedals", "A hull moving forward", "A cross on the shoulder"], "Two fists circling, the pedals", "The circles alternate."),
        choice("WALK…", ["Alternates the hands forward", "Shakes a thumb", "Taps the palm twice"], "Alternates the hands forward", "The fingers point down, like legs."),
        choice("MOTORCYCLE twists…", ["Both fists, like handlebars", "A single index finger", "A C on a fist"], "Both fists, like handlebars", "The wrists do the work."),
        choice("SUBWAY slides a Y hand…", ["Under a flat hand", "Across the forehead", "Down the cheek"], "Under a flat hand", "The flat hand is the ground. The Y is the car."),
      
        choice("BOAT in this set is the gloss…", ["BOAT", "SUBWAY", "BICYCLE"], "BOAT", "One ride, one gloss."),
        choice("WALK alternates the hands. BICYCLE…", ["Circles two fists, the pedals", "Slides a Y hand under a flat hand", "Twists handlebars"], "Circles two fists, the pedals", "MOTORCYCLE twists the fists. SUBWAY is the Y hand underneath."),
        blank("Gloss the handlebar twist.", "", "", ["MOTORCYCLE", "WALK", "SUBWAY"], "MOTORCYCLE", "Two fists twist, as if gripping handlebars."),
        bank("Tap the underground slide, then the alternating legs.", ["SUBWAY", "WALK", "BICYCLE", "BOAT"], ["SUBWAY", "WALK"], "SUBWAY slides a Y hand under a flat hand. WALK alternates the hands."),
        match("Match the pairs.", [
          ["Walk", "WALK"],
          ["Bicycle", "BICYCLE"],
          ["Boat", "BOAT"],
          ["Motorcycle", "MOTORCYCLE"],
        ]),
      ],
    ),
    lesson(
      "travel-sentences",
      "Travel sentences",
      "The vehicle or the action can be the topic. Time still comes first when you have it.",
      [
        choice("“I drive tomorrow.”", ["TOMORROW I DRIVE", "I DRIVE TOMORROW", "DRIVE I WILL"], "TOMORROW I DRIVE", "Time opens."),
        blank("Are you walking?", "YOU WALK", "", ["[q]", "[wh-q]", "ARE"], "[q]", "Yes/no."),
        bank("Are you walking?", ["YOU", "WALK", "[q]", "ARE", "DO"], ["YOU", "WALK", "[q]"], "Person, verb, question marker."),
        choice("“I want the bus.”", ["B-U-S I WANT", "I WANT THE BUS", "BUS WANT I"], "B-U-S I WANT", "Spell the bus, then say what you want."),
        bank("I drive tomorrow.", ["TOMORROW", "I", "DRIVE", "WILL", "AM", "TO"], ["TOMORROW", "I", "DRIVE"], "Tomorrow leads."),
      
        choice("“Are you driving tomorrow?” glosses as…", ["TOMORROW YOU DRIVE [q]", "ARE YOU DRIVING TOMORROW", "DRIVE YOU TOMORROW?"], "TOMORROW YOU DRIVE [q]", "Time first. [q] marks the yes/no."),
        choice("“I walk tomorrow” glosses as…", ["TOMORROW I WALK", "I WALK TOMORROW", "WALK I WILL"], "TOMORROW I WALK", "Same order as TOMORROW I DRIVE."),
        blank("The bus tomorrow, and you want it.", "TOMORROW B-U-S", "", ["I WANT", "WANT I", "THE"], "I WANT", "Time, then the vehicle, then the comment."),
        bank("Build “I walk tomorrow.”", ["TOMORROW", "I", "WALK", "WILL", "AM", "TO"], ["TOMORROW", "I", "WALK"], "Time, then I WALK."),
        match("Match the pairs.", [
          ["Drive", "DRIVE"],
          ["Walk", "WALK"],
          ["Bus", "B-U-S"],
          ["Tomorrow", "TOMORROW"],
        ]),
      ],
    ),
  ]),
  unit("money", "Money", "#/vocab/money", [
    lesson(
      "money-buy",
      "Money and buying",
      "MONEY taps a flat-O on the palm twice. BUY moves that hand out of the palm. STORE swings both flat-O hands outward, twice.",
      [
        match("Tap the matching pairs.", [
          ["Money", "MONEY"],
          ["Buy", "BUY"],
          ["Sell", "SELL"],
          ["Store", "STORE"],
        ]),
        choice("MONEY taps…", ["A flat-O on the palm, twice", "The forehead", "The neck"], "A flat-O on the palm, twice", "The tap is light."),
        choice("BUY moves the flat-O…", ["Out of the palm", "Up from the chin", "Under a flat hand"], "Out of the palm", "The money leaves your hand."),
        choice("STORE swings…", ["Both flat-O hands outward, twice", "One index finger", "A wheel"], "Both flat-O hands outward, twice", "The hands pivot from the chest."),
        choice("SELL…", ["Twists both flat-O hands forward", "Chops the neck", "Circles the face"], "Twists both flat-O hands forward", "Like setting goods out."),
      
        choice("BUY and MONEY both use a flat-O. BUY…", ["Moves that hand out of the palm", "Taps the palm twice and stops", "Swings both hands from the chest"], "Moves that hand out of the palm", "MONEY taps twice. STORE swings both flat-O hands outward, twice."),
        choice("SELL moves…", ["Both flat-O hands, twisting forward", "A chop at the neck", "One flat-O, tapped twice and stopped"], "Both flat-O hands, twisting forward", "The wrists turn, like setting goods out."),
        blank("Gloss the double outward swing.", "", "", ["STORE", "BUY", "MONEY"], "STORE", "Both flat-O hands swing outward from the chest, twice."),
        bank("Tap the double palm tap, then the hand that leaves the palm.", ["MONEY", "BUY", "SELL", "STORE"], ["MONEY", "BUY"], "MONEY taps. BUY moves out."),
        match("Match the pairs.", [
          ["Money", "MONEY"],
          ["Buy", "BUY"],
          ["Sell", "SELL"],
          ["Store", "STORE"],
        ]),
      ],
    ),
    lesson(
      "money-price",
      "Price",
      "CHEAP brushes down the palm. EXPENSIVE flicks a flat-O up off that palm. COST taps an X. CENT leaves the forehead. BROKE chops the neck.",
      [
        match("Tap the matching pairs.", [
          ["Cheap", "CHEAP"],
          ["Expensive", "EXPENSIVE"],
          ["Pay", "PAY"],
          ["Cost", "COST"],
        ]),
        choice("CHEAP brushes…", ["Down the palm", "Up off the chin", "Across the forehead"], "Down the palm", "A downward pass."),
        choice("EXPENSIVE…", ["Opens a flat-O and flicks it up", "Taps the palm twice and stops", "Points to the foot"], "Opens a flat-O and flicks it up", "The money seems to leave."),
        choice("COST taps with…", ["An X hand", "A Y hand", "An H hand"], "An X hand", "The bent index strikes the palm."),
        choice("BROKE, when you have no money, chops…", ["The side of the neck", "The wrist", "The palm"], "The side of the neck", "CENT is the one that leaves the forehead."),
      
        choice("CENT, when it means the coin…", ["Leaves the forehead", "Brushes down the palm", "Chops the neck"], "Leaves the forehead", "The index finger touches the forehead, then pulls away."),
        choice("PAY in this set is the gloss…", ["PAY", "COST", "CHEAP"], "PAY", "COST taps an X. CHEAP brushes down."),
        blank("Gloss the neck chop.", "", "", ["BROKE", "EXPENSIVE", "CENT"], "BROKE", "The edge of the hand strikes the side of the neck."),
        bank("Tap the downward palm brush, then the flat-O that flicks up.", ["CHEAP", "EXPENSIVE", "COST", "PAY", "BROKE"], ["CHEAP", "EXPENSIVE"], "CHEAP brushes down. EXPENSIVE opens and flicks up."),
        match("Match the pairs.", [
          ["Cheap", "CHEAP"],
          ["Expensive", "EXPENSIVE"],
          ["Cost", "COST"],
          ["Cent", "CENT"],
        ]),
      ],
    ),
    lesson(
      "money-sentences",
      "Money sentences",
      "The thing, then the price word. One through nine dollars can twist the number instead of a separate DOLLAR.",
      [
        choice("“The book is cheap.”", ["BOOK CHEAP", "CHEAP BOOK IS", "THE BOOK CHEAP"], "BOOK CHEAP", "Noun, then the comment."),
        blank("I am buying coffee tomorrow.", "TOMORROW COFFEE", "", ["I BUY", "BUY I", "THE"], "I BUY", "Time, topic, then the comment."),
        bank(
          "I am buying coffee tomorrow.",
          ["TOMORROW", "COFFEE", "I", "BUY", "AM", "THE"],
          ["TOMORROW", "COFFEE", "I", "BUY"],
          "Tomorrow leads. am drops.",
        ),
        choice("“The store is expensive.”", ["STORE EXPENSIVE", "EXPENSIVE IS STORE", "STORE IS EXPENSIVE"], "STORE EXPENSIVE", "Two signs."),
        bank("I pay.", ["I", "PAY", "AM", "THE", "A"], ["I", "PAY"], "Person, then the verb."),
      
        choice("“The coffee is cheap” glosses as…", ["COFFEE CHEAP", "CHEAP COFFEE IS", "THE COFFEE CHEAP"], "COFFEE CHEAP", "The thing, then the price word. Same order as BOOK CHEAP."),
        choice("“I pay tomorrow” opens with…", ["TOMORROW", "I", "PAY"], "TOMORROW", "Time first when you have it."),
        blank("Buying the book tomorrow.", "TOMORROW BOOK", "", ["I BUY", "BUY I", "THE"], "I BUY", "Time, thing, then I BUY."),
        bank("Build “The coffee is cheap.”", ["COFFEE", "CHEAP", "IS", "THE", "A"], ["COFFEE", "CHEAP"], "Thing, then the price word."),
        match("Match the pairs.", [
          ["Book", "BOOK"],
          ["Coffee", "COFFEE"],
          ["Store", "STORE"],
          ["Pay", "PAY"],
        ]),
      ],
    ),
  ]),
  unit("nature", "Nature", "#/vocab/nature", [
    lesson(
      "nature-land",
      "Land",
      "TREE twists a 5-hand on an upright arm. ROCK taps one fist on the other. MOUNTAIN starts with that tap, then draws the slopes.",
      [
        match("Tap the matching pairs.", [
          ["Tree", "TREE"],
          ["Flower", "FLOWER"],
          ["Rock", "ROCK"],
          ["Mountain", "MOUNTAIN"],
        ]),
        choice("TREE twists…", ["An open 5-hand", "A flat-O on the nose", "Two Y hands"], "An open 5-hand", "The forearm is the trunk. Two twists."),
        choice("FLOWER touches…", ["Each side of the nose", "The chest, twice", "The shoulder"], "Each side of the nose", "A flat-O, one side then the other."),
        choice("ROCK is…", ["A fist tapping the back of the other fist", "A crescent in the air", "A seed dropped into the hand"], "A fist tapping the back of the other fist", "MOUNTAIN begins here, then shows the slopes."),
        choice("GRASS…", ["Wiggles fingers sprouting up", "Rolls curved hands forward", "Slices the wrists"], "Wiggles fingers sprouting up", "The fingers are the blades."),
      
        choice("MOUNTAIN starts like ROCK, then…", ["Draws the slopes", "Twists a 5-hand", "Touches both sides of the nose"], "Draws the slopes", "The fist tap is the rock. The slopes make the mountain."),
        choice("FLOWER uses a flat-O on…", ["Each side of the nose", "The back of a fist", "An upright arm"], "Each side of the nose", "One side of the nose, then the other."),
        blank("Gloss the sprouting fingers.", "", "", ["GRASS", "TREE", "ROCK"], "GRASS", "The fingers rise and wiggle."),
        bank("Tap the fist tap, then the sign that continues into slopes.", ["ROCK", "MOUNTAIN", "TREE", "FLOWER"], ["ROCK", "MOUNTAIN"], "ROCK taps one fist on the other. MOUNTAIN adds the slopes."),
        match("Match the pairs.", [
          ["Tree", "TREE"],
          ["Flower", "FLOWER"],
          ["Rock", "ROCK"],
          ["Grass", "GRASS"],
        ]),
      ],
    ),
    lesson(
      "nature-sky",
      "Water and sky",
      "RIVER weaves forward. OCEAN rolls larger swells. MOON is a small C of index and thumb. EARTH rocks on the base hand.",
      [
        match("Tap the matching pairs.", [
          ["River", "RIVER"],
          ["Ocean", "OCEAN"],
          ["Moon", "MOON"],
          ["Star", "STAR"],
        ]),
        choice("OCEAN differs from RIVER by…", ["Larger rolling swells", "A tap of two fists", "A circle on the face"], "Larger rolling swells", "Both travel forward. The shape of the hand changes."),
        choice("MOON is…", ["A small C held up like a crescent", "An index flick from a fist", "A 5-hand twist"], "A small C held up like a crescent", "Index and thumb make the C. A tap at the eye is another form."),
        choice("STAR…", ["Brushes two index fingers upward", "Pats the stomach", "Chops the neck"], "Brushes two index fingers upward", "The fingers alternate."),
        choice("EARTH…", ["Rocks on the base hand", "Slides under a flat hand", "Taps the palm twice"], "Rocks on the base hand", "The base hand is the axis."),
      
        choice("RIVER, compared with OCEAN…", ["Weaves forward, smaller than the swells", "Rolls larger swells", "Rocks on the base hand"], "Weaves forward, smaller than the swells", "OCEAN rolls larger swells. EARTH rocks on the base hand."),
        choice("STAR brushes…", ["Two index fingers upward", "A small C held up", "Curved hands forward"], "Two index fingers upward", "The fingers alternate. MOON is the small C."),
        blank("Gloss the crescent.", "", "", ["MOON", "STAR", "EARTH"], "MOON", "Index and thumb make a small C."),
        bank("Tap the weaving water, then the larger swells.", ["RIVER", "OCEAN", "MOON", "STAR", "EARTH"], ["RIVER", "OCEAN"], "RIVER weaves. OCEAN rolls."),
        match("Match the pairs.", [
          ["River", "RIVER"],
          ["Ocean", "OCEAN"],
          ["Moon", "MOON"],
          ["Earth", "EARTH"],
        ]),
      ],
    ),
    lesson(
      "nature-sentences",
      "Nature sentences",
      "The outdoor thing is the topic. LIKE and a color stay in the comment.",
      [
        choice("“I like trees.”", ["TREE I LIKE", "I LIKE TREES", "LIKE TREE I"], "TREE I LIKE", "One TREE can stand for the kind."),
        bank("I like trees.", ["TREE", "I", "LIKE", "THE", "A"], ["TREE", "I", "LIKE"], "Topic, person, verb."),
        choice("“The moon is yellow.”", ["MOON YELLOW", "YELLOW MOON THE", "MOON IS YELLOW"], "MOON YELLOW", "Noun, then color."),
        blank("I see a star.", "STAR", "", ["I SEE", "SEE I", "A"], "I SEE", "The star is the topic."),
        bank("The moon is yellow.", ["MOON", "YELLOW", "IS", "THE"], ["MOON", "YELLOW"], "Two signs."),
      
        choice("“I see a tree” glosses as…", ["TREE I SEE", "I SEE A TREE", "SEE TREE I"], "TREE I SEE", "The outdoor thing is the topic. Same comment pattern as STAR I SEE."),
        choice("“The tree is yellow” glosses as…", ["TREE YELLOW", "YELLOW TREE THE", "TREE IS YELLOW"], "TREE YELLOW", "A color stays in the comment, as in MOON YELLOW."),
        blank("I like the moon.", "MOON", "", ["I LIKE", "LIKE I", "THE"], "I LIKE", "Topic, then the comment."),
        bank("Build “The tree is yellow.”", ["TREE", "YELLOW", "IS", "THE", "A"], ["TREE", "YELLOW"], "Noun, then color."),
        match("Match the pairs.", [
          ["Tree", "TREE"],
          ["Moon", "MOON"],
          ["Star", "STAR"],
          ["Yellow", "YELLOW"],
        ]),
      ],
    ),
  ]),
  unit("sports", "Sports", "#/vocab/sports", [
    lesson(
      "sports-play",
      "Play",
      "PLAY shakes two Y hands. This is not the sign for a theater play. BALL outlines a sphere. RUN links two L hands and travels forward.",
      [
        match("Tap the matching pairs.", [
          ["Play", "PLAY"],
          ["Ball", "BALL"],
          ["Run", "RUN"],
          ["Swim", "SWIM"],
        ]),
        choice("PLAY uses…", ["Two shaking Y hands", "A bat swing", "An H on a pole"], "Two shaking Y hands", "Theater is a different sign."),
        choice("BALL…", ["Outlines a sphere with both hands", "Rams the fingers together", "Points to the foot"], "Outlines a sphere with both hands", "The hands are curved."),
        choice("RUN links…", ["Two L hands, then the index fingers flex", "Two flat-O hands on the palm", "A C on a fist"], "Two L hands, then the index fingers flex", "The hands move forward while the fingers flex."),
        choice("SWIM sweeps…", ["Both hands out from the center", "A V over the palm", "An index off the forehead"], "Both hands out from the center", "Palms down, and it repeats."),
      
        choice("PLAY here is not…", ["A theater play", "Two shaking Y hands", "The sign in this lesson"], "A theater play", "Two Y hands shake. That is playing."),
        choice("SWIM and RUN. SWIM…", ["Sweeps both hands out from the center", "Links two L hands", "Outlines a sphere"], "Sweeps both hands out from the center", "RUN links two L hands and travels forward. BALL outlines a sphere."),
        blank("Gloss the sphere.", "", "", ["BALL", "PLAY", "RUN"], "BALL", "Both curved hands outline it."),
        bank("Tap the shaking Y hands, then the linked L hands.", ["PLAY", "RUN", "BALL", "SWIM"], ["PLAY", "RUN"], "PLAY shakes two Y hands. RUN links two L hands."),
        match("Match the pairs.", [
          ["Play", "PLAY"],
          ["Ball", "BALL"],
          ["Run", "RUN"],
          ["Swim", "SWIM"],
        ]),
      ],
    ),
    lesson(
      "sports-games",
      "Games",
      "FOOTBALL rams the fingers together twice. BASEBALL swings two fists. DANCE swings a V, fingers down, over the palm.",
      [
        match("Tap the matching pairs.", [
          ["Football", "FOOTBALL"],
          ["Baseball", "BASEBALL"],
          ["Dance", "DANCE"],
          ["Game", "GAME"],
        ]),
        choice("FOOTBALL…", ["Rams the fingers together twice", "Flicks the wrists as a shot", "Knocks two thumbs once and stops forever"], "Rams the fingers together twice", "The fingers stand in for the lines."),
        choice("BASEBALL…", ["Swings two fists, a bat", "Circles a claw at the head", "Taps a flat-O"], "Swings two fists, a bat", "The fists stay together through the swing."),
        choice("DANCE uses…", ["A V swinging over the palm", "Two Y hands only", "A cross on the shoulder"], "A V swinging over the palm", "The fingers point down, like feet."),
        choice("BASKETBALL flicks…", ["The wrists forward, as a shot", "A G hand at the mouth", "The pinky across a wrist"], "The wrists forward, as a shot", "The hands hold an imaginary ball first."),
      
        choice("GAME in this set is the gloss…", ["GAME", "DANCE", "BASEBALL"], "GAME", "One English name, one gloss."),
        choice("DANCE swings…", ["A V, fingers down, over the palm", "Two fists, a bat", "The fingers together, twice"], "A V, fingers down, over the palm", "BASEBALL swings the fists. FOOTBALL rams the fingers."),
        blank("Gloss the shot.", "", "", ["BASKETBALL", "FOOTBALL", "BASEBALL"], "BASKETBALL", "The wrists flick forward."),
        bank("Tap the bat swing, then the V over the palm.", ["BASEBALL", "DANCE", "FOOTBALL", "GAME", "BASKETBALL"], ["BASEBALL", "DANCE"], "BASEBALL swings two fists. DANCE swings a V."),
        match("Match the pairs.", [
          ["Football", "FOOTBALL"],
          ["Baseball", "BASEBALL"],
          ["Dance", "DANCE"],
          ["Basketball", "BASKETBALL"],
        ]),
      ],
    ),
    lesson(
      "sports-sentences",
      "Sports sentences",
      "Name the game, then say if you like it or want to play.",
      [
        choice("“I like to play basketball.”", ["BASKETBALL I LIKE PLAY", "I LIKE TO PLAY BASKETBALL", "PLAY BASKETBALL LIKE I"], "BASKETBALL I LIKE PLAY", "The game is the topic."),
        blank("Do you like to run?", "RUN YOU LIKE", "", ["[q]", "[wh-q]", "DO"], "[q]", "Yes/no."),
        bank(
          "Do you like to run?",
          ["RUN", "YOU", "LIKE", "[q]", "DO", "TO"],
          ["RUN", "YOU", "LIKE", "[q]"],
          "Topic, person, verb, question marker.",
        ),
        choice("“I want to swim.”", ["SWIM I WANT", "I WANT TO SWIM", "WANT SWIM I"], "SWIM I WANT", "to drops."),
        bank("I want to swim.", ["SWIM", "I", "WANT", "TO", "THE"], ["SWIM", "I", "WANT"], "Three signs."),
      
        choice("“Do you like to swim?” glosses as…", ["SWIM YOU LIKE [q]", "DO YOU LIKE TO SWIM", "YOU LIKE SWIM?"], "SWIM YOU LIKE [q]", "Same order as RUN YOU LIKE [q]. to and do drop."),
        choice("“I like to swim” glosses as…", ["SWIM I LIKE", "I LIKE TO SWIM", "LIKE SWIM I"], "SWIM I LIKE", "The activity is the topic. LIKE stays in the comment."),
        blank("I want to play basketball.", "BASKETBALL I WANT", "", ["PLAY", "TO", "THE"], "PLAY", "Same slots as BASKETBALL I LIKE PLAY. WANT takes the place of LIKE."),
        bank("Build “Do you like to swim?”", ["SWIM", "YOU", "LIKE", "[q]", "DO", "TO"], ["SWIM", "YOU", "LIKE", "[q]"], "Activity, then YOU LIKE, then [q]."),
        match("Match the pairs.", [
          ["Basketball", "BASKETBALL"],
          ["Run", "RUN"],
          ["Swim", "SWIM"],
          ["Like", "LIKE"],
        ]),
      ],
    ),
  ]),
  unit("places", "Places", "#/vocab/places", [
    lesson(
      "places-town",
      "In town",
      "CITY taps flat fingertips, shifts, and taps again. CHURCH taps the thumb of a C on a fist. RESTAURANT taps an R at the mouth.",
      [
        match("Tap the matching pairs.", [
          ["City", "CITY"],
          ["Restaurant", "RESTAURANT"],
          ["Church", "CHURCH"],
          ["Street", "STREET"],
        ]),
        choice("CITY…", ["Taps the fingertips, shifts, and taps again", "Draws one roof and stops", "Spells C-I-T-Y only"], "Taps the fingertips, shifts, and taps again", "The hands read as rooftops."),
        choice("CHURCH taps…", ["The thumb of a C on the back of a fist", "An R at the mouth", "A flag on a pole"], "The thumb of a C on the back of a fist", "Up and down, not a circle."),
        choice("RESTAURANT uses…", ["An R at the mouth", "Two flat hands moving forward", "A twist against the other hand"], "An R at the mouth", "A short tap."),
        choice("STREET is also…", ["Way, path, and road", "Only a highway number", "The sign for RIVER"], "Way, path, and road", "Two flat hands move forward, palms facing."),
      
        choice("STREET is also the sign for…", ["Way, path, and road", "A restaurant", "A church"], "Way, path, and road", "Two flat hands move forward together."),
        choice("RESTAURANT taps…", ["An R at the mouth", "Flat fingertips, twice", "The thumb of a C on a fist"], "An R at the mouth", "CITY taps the fingertips. CHURCH taps the C."),
        blank("Gloss the rooftop taps.", "", "", ["CITY", "CHURCH", "STREET"], "CITY", "The fingertips meet, the hands shift, and they meet again."),
        bank("Tap the R at the mouth, then the C on the fist.", ["RESTAURANT", "CHURCH", "CITY", "STREET"], ["RESTAURANT", "CHURCH"], "RESTAURANT taps an R. CHURCH taps the thumb of a C."),
        match("Match the pairs.", [
          ["City", "CITY"],
          ["Restaurant", "RESTAURANT"],
          ["Church", "CHURCH"],
          ["Street", "STREET"],
        ]),
      ],
    ),
    lesson(
      "places-buildings",
      "Buildings",
      "BUILDING stacks the hands as they rise. HOTEL is a flag: H on an index-finger pole. BANK, ZOO, and a recreation PARK are spelled.",
      [
        match("Tap the matching pairs.", [
          ["Movie", "MOVIE"],
          ["Building", "BUILDING"],
          ["Hotel", "HOTEL"],
          ["Bank", "B-A-N-K"],
        ]),
        choice("MOVIE twists…", ["Against the other hand", "A claw by the head", "Off the chin"], "Against the other hand", "The base hand can stand up or lie palm down."),
        choice("BUILDING…", ["Stacks the hands as they rise", "Chops the neck", "Flicks a G at the mouth"], "Stacks the hands as they rise", "Flat hands show the floors."),
        choice("HOTEL shows…", ["An H flag on an index-finger pole", "A C tapped on a fist", "A wheel"], "An H flag on an index-finger pole", "The base hand is the pole."),
        choice("A recreation park is…", ["Fingerspelled P-A-R-K", "The subway sign", "A fist tap on the chest"], "Fingerspelled P-A-R-K", "Parking a car is a different sign. ZOO is spelled too."),
      
        choice("ZOO, like BANK and a recreation park, is…", ["Fingerspelled", "An H on a pole", "A stack of hands"], "Fingerspelled", "BANK, ZOO, and a recreation PARK are spelled."),
        choice("HOTEL shows a flag. The pole is…", ["An index finger", "A C on a fist", "A wheel"], "An index finger", "The H is the flag. The other index finger is the pole."),
        blank("Gloss the spelled bank.", "", "", ["B-A-N-K", "HOTEL", "MOVIE"], "B-A-N-K", "Four letters, produced quickly."),
        bank("Tap the rising stack, then the flag on the pole.", ["BUILDING", "HOTEL", "MOVIE", "B-A-N-K", "P-A-R-K"], ["BUILDING", "HOTEL"], "BUILDING stacks the hands as they rise. HOTEL is the H flag."),
        match("Match the pairs.", [
          ["Movie", "MOVIE"],
          ["Building", "BUILDING"],
          ["Hotel", "HOTEL"],
          ["Park", "P-A-R-K"],
        ]),
      ],
    ),
    lesson(
      "places-sentences",
      "Place sentences",
      "A place can be the topic, the way STORE and SCHOOL were. Time still opens when you have it.",
      [
        choice("“I am going to church tomorrow.”", ["TOMORROW CHURCH I GO", "I AM GOING TO CHURCH TOMORROW", "CHURCH GO TOMORROW I"], "TOMORROW CHURCH I GO", "Time, place, person, verb."),
        blank("Are you going to the city?", "CITY YOU GO", "", ["[q]", "[wh-q]", "ARE"], "[q]", "Yes/no. to and the drop."),
        bank(
          "Are you going to the city?",
          ["CITY", "YOU", "GO", "[q]", "ARE", "TO", "THE"],
          ["CITY", "YOU", "GO", "[q]"],
          "Place, person, verb, question marker.",
        ),
        choice("“I want a movie.”", ["MOVIE I WANT", "I WANT A MOVIE", "WANT MOVIE I"], "MOVIE I WANT", "a drops."),
        bank("I am going to church tomorrow.", ["TOMORROW", "CHURCH", "I", "GO", "AM", "TO"], ["TOMORROW", "CHURCH", "I", "GO"], "Tomorrow leads."),
      
        choice("“Are you going to church?” glosses as…", ["CHURCH YOU GO [q]", "ARE YOU GOING TO CHURCH", "YOU GO CHURCH?"], "CHURCH YOU GO [q]", "Same order as CITY YOU GO [q]."),
        choice("“I want a movie tomorrow” opens with…", ["TOMORROW", "MOVIE", "I"], "TOMORROW", "Time still opens when you have it."),
        blank("The city tomorrow.", "TOMORROW CITY I", "", ["GO", "WANT", "TO"], "GO", "Time, place, then I GO."),
        bank("Build “I want a movie tomorrow.”", ["TOMORROW", "MOVIE", "I", "WANT", "AM", "TO", "A"], ["TOMORROW", "MOVIE", "I", "WANT"], "Time, topic, then I WANT."),
        match("Match the pairs.", [
          ["Church", "CHURCH"],
          ["City", "CITY"],
          ["Movie", "MOVIE"],
          ["Go", "GO"],
        ]),
      ],
    ),
  ]),
];
