const lp = (path) => `https://www.lifeprint.com/asl101/pages-signs/${path}`;

function sign(term, gloss, category, face, manual, params, page) {
  return { term, gloss, category, face, manual, params, href: lp(page) };
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

function lesson(id, title, tip, exercises) {
  return { id, title, tip, exercises };
}

function unit(id, title, guide, lessons) {
  return { id, title, guide, guideLabel: "Word list", lessons };
}

export const TOPIC_CATEGORIES = ["Family", "Colors", "Food", "School", "Jobs", "Home", "Clothes", "Animals", "Weather"];

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
};

export const TOPIC_VOCAB = [
  sign("Mother", "MOTHER", "Family", "None required.", "Open 5-hand. The thumb taps the chin.", "5-hand, thumb on the chin, a short tap.", "m/mother.htm"),
  sign("Father", "FATHER", "Family", "None required.", "Open 5-hand. The thumb taps the forehead.", "5-hand, thumb on the forehead, a short tap.", "f/father.htm"),
  sign("Parents", "PARENTS", "Family", "None required.", "The thumb taps the forehead, then the chin.", "5-hand moves from the forehead to the chin.", "p/parents.htm"),
  sign("Brother", "BROTHER", "Family", "None required.", "Touch the forehead, then bring the two index fingers together for SAME.", "A compound: the male place, then SAME.", "b/brother.htm"),
  sign("Sister", "SISTER", "Family", "None required.", "Touch the chin, then bring the two index fingers together.", "A compound: the female place, then SAME.", "s/sister.htm"),
  sign("Grandmother", "GRANDMOTHER", "Family", "None required.", "Thumb on the chin, then two arcs forward.", "MOTHER’s hand, with two forward arcs.", "g/grandmother.htm"),
  sign("Grandfather", "GRANDFATHER", "Family", "None required.", "Thumb on the forehead, then two arcs forward.", "FATHER’s hand, with two forward arcs.", "g/grandfather.htm"),
  sign("Baby", "BABY", "Family", "None required.", "Fold the arms and rock them.", "Both arms cradle and rock.", "b/baby.htm"),
  sign("Family", "FAMILY", "Family", "None required.", "Two F hands circle out and meet.", "F hands start together, circle, and close.", "f/family.htm"),
  sign("Aunt", "AUNT", "Family", "None required.", "An A hand twists beside the cheek.", "A-hand, a twist near the jaw.", "a/aunt.htm"),
  sign("Uncle", "UNCLE", "Family", "None required.", "A U hand twists beside the temple.", "U-hand, a twist near the forehead.", "u/uncle.htm"),
  sign("Cousin", "COUSIN", "Family", "None required.", "A C hand twists beside the jaw. Some signers raise that place for a male cousin.", "C-hand twists at the side of the jaw.", "c/cousin.htm"),
  sign("Son", "SON", "Family", "None required.", "Start at the forehead and move into the BABY cradle.", "Male place, then the cradle. Often one blended movement.", "s/son.htm"),
  sign("Daughter", "DAUGHTER", "Family", "None required.", "Start at the chin and move into the BABY cradle.", "Female place, then the cradle.", "d/daughter.htm"),
  sign("Wife", "WIFE", "Family", "None required.", "Touch the chin, then clasp the hands.", "Female place, then the clasp of MARRY.", "w/wife.htm"),
  sign("Husband", "HUSBAND", "Family", "None required.", "Touch the forehead, then clasp the hands.", "Male place, then the clasp of MARRY.", "h/husband.htm"),

  sign("Color", "COLOR", "Colors", "None required.", "Wiggle the fingers in front of the mouth.", "5-hand, fingers wiggling at the chin.", "c/color.htm"),
  sign("Red", "RED", "Colors", "None required.", "The index finger brushes down the lips.", "1-hand strokes the lips downward.", "r/red.htm"),
  sign("Blue", "BLUE", "Colors", "None required.", "A B hand twists at the wrist.", "B-hand, a twist in place.", "b/blue.htm"),
  sign("Green", "GREEN", "Colors", "None required.", "A G hand twists at the wrist.", "G-hand, a twist in place.", "g/green.htm"),
  sign("Yellow", "YELLOW", "Colors", "None required.", "A Y hand twists at the wrist.", "Y-hand, a twist in place.", "y/yellow.htm"),
  sign("Orange", "ORANGE", "Colors", "None required.", "Squeeze the hand in front of the mouth, once or twice.", "C or S hand squeezes at the mouth. The fruit uses this same sign.", "o/orange.htm"),
  sign("Purple", "PURPLE", "Colors", "None required.", "A P hand twists away from the chin.", "P-hand, a twist in place.", "p/purple.htm"),
  sign("Pink", "PINK", "Colors", "None required.", "The middle finger of a P hand brushes down the lips.", "P-hand, middle finger strokes the lips.", "p/pink.htm"),
  sign("Black", "BLACK", "Colors", "None required.", "The index finger draws across the forehead.", "1-hand moves across the eyebrow.", "b/black.htm"),
  sign("White", "WHITE", "Colors", "None required.", "An open hand on the chest pulls out and closes.", "5-hand on the chest closes to a flat-O as it moves out.", "w/white.htm"),
  sign("Brown", "BROWN", "Colors", "None required.", "A B hand slides down the cheek.", "B-hand, a slide down the cheek.", "b/brown.htm"),
  sign("Gray", "GRAY", "Colors", "None required.", "Open hands pass through each other.", "Two 5-hands, fingers passing through in front of the chest.", "g/gray.htm"),

  sign("Apple", "APPLE", "Food", "None required.", "Twist the knuckle of a bent index finger on the cheek.", "X-hand twists on the cheek.", "a/apple.htm"),
  sign("Banana", "BANANA", "Food", "None required.", "Mime peeling. One index finger pulls down from the other.", "The dominant index peels away from the non-dominant index.", "b/banana.htm"),
  sign("Orange (fruit)", "ORANGE", "Food", "None required.", "The squeeze at the mouth is the fruit and the color.", "Same squeeze as the color ORANGE.", "o/orange.htm"),
  sign("Grape", "GRAPE", "Food", "None required.", "A claw hand hops down the back of the other hand.", "Claw hand, short hops down the back of the hand.", "g/grape.htm"),
  sign("Strawberry", "STRAWBERRY", "Food", "None required.", "Closed fingers twist once against the mouth.", "Fingers twist at the mouth.", "s/strawberry.htm"),
  sign("Watermelon", "WATERMELON", "Food", "None required.", "Flick the middle finger against the back of the other hand, as if thumping a melon.", "A flick on the back of the hand. Some signers add WATER first.", "w/watermelon.htm"),
  sign("Peach", "PEACH", "Food", "None required.", "Curve an open hand on the cheek, then close it, as if feeling fuzz.", "Open hand closes on the cheek.", "p/peach.htm"),
  sign("Cherry", "CHERRY", "Food", "None required.", "Twist a fingertip on the earlobe.", "A twist at the ear.", "c/cherry.htm"),
  sign("Fruit", "FRUIT", "Food", "None required.", "An F hand twists on the cheek.", "F-hand, a twist on the cheek.", "f/fruit.htm"),
  sign("Water", "WATER", "Food", "None required.", "The index finger of a W hand taps the chin.", "W-hand taps the chin.", "w/water.htm"),
  sign("Milk", "MILK", "Food", "None required.", "A C hand squeezes, as if milking.", "C-hand opens and closes once or twice.", "m/milk.htm"),
  sign("Eat", "EAT", "Food", "None required.", "A flat-O taps the mouth.", "Flat-O, repeated taps at the lips.", "e/eat.htm"),
  sign("Hungry", "HUNGRY", "Food", "None required.", "A C hand draws down the chest.", "C-hand starts at the throat and moves down.", "h/hungry.htm"),
  sign("Food", "FOOD", "Food", "None required.", "A flat-O taps the mouth. It is the same family as EAT.", "Flat-O at the mouth.", "f/food.htm"),
  sign("Bread", "BREAD", "Food", "None required.", "The edge of one hand slices down the back of the other.", "A chopping slide on the back of the hand.", "b/bread.htm"),
  sign("Egg", "EGG", "Food", "None required.", "Both H hands strike, then open, like a crack.", "H-hands hit and separate.", "e/egg.htm"),
  sign("Coffee", "COFFEE", "Food", "None required.", "One S hand grinds on the other.", "Two S-hands, a small circular grind.", "c/coffee.htm"),
  sign("Tea", "TEA", "Food", "None required.", "An F hand stirs inside the other O hand.", "F-hand circles in an O, like a cup.", "t/tea.htm"),
  sign("Cookie", "COOKIE", "Food", "None required.", "Fingertips twist on the opposite palm, as if cutting a cookie.", "A twist of the fingertips on the palm.", "c/cookie.htm"),
  sign("Want", "WANT", "Food", "None required.", "Both open hands pull in and close.", "5-hands become claws as they draw toward the body.", "w/want.htm"),
  sign("Like", "LIKE", "Food", "None required.", "Thumb and middle finger on the chest pull out and close.", "Open-8 on the chest closes as it moves out.", "l/like.htm"),
  sign("More", "MORE", "Food", "None required.", "The fingertips of two flat-O hands tap together.", "Flat-O hands meet at the fingertips.", "m/more.htm"),

  sign("School", "SCHOOL", "School", "None required.", "Clap the hands twice.", "Open hands clap, palm to palm.", "s/school.htm"),
  sign("Teacher", "TEACHER", "School", "None required.", "Flat-O hands move out from the temples, then both flat hands drop along the sides.", "TEACH, then the person ending.", "t/teacher.htm"),
  sign("Student", "STUDENT", "School", "None required.", "Pull from the palm to the forehead, then drop the hands along the sides.", "LEARN, then the person ending.", "s/student.htm"),
  sign("Book", "BOOK", "School", "None required.", "Palms together, then open them like a book.", "Flat hands open from a closed book.", "b/book.htm"),
  sign("Read", "READ", "School", "None required.", "A V hand scans down the other palm.", "V-hand moves down the opposite palm.", "r/read.htm"),
  sign("Write", "WRITE", "School", "None required.", "Mime writing on the opposite palm.", "The dominant hand scribbles on the non-dominant palm.", "w/write.htm"),
  sign("Paper", "PAPER", "School", "None required.", "The heel of one hand brushes up the other palm.", "A brush up the non-dominant palm.", "p/paper.htm"),
  sign("Pencil", "PENCIL", "School", "None required.", "Touch the mouth, then mime writing on the palm.", "Index finger at the lips, then a writing motion.", "p/pencil.htm"),
  sign("Class", "CLASS", "School", "None required.", "Two C hands circle until the palms face each other. The same sign can mean a group.", "C-hands outline a group.", "c/class.htm"),
  sign("Learn", "LEARN", "School", "None required.", "Gather from the opposite palm and bring that hand to the forehead.", "Fingers leave the palm and touch the forehead.", "l/learn.htm"),
  sign("Study", "STUDY", "School", "None required.", "Wiggle the fingers toward the palm, then bring them to the forehead. Repeat.", "A repeated pull from the palm to the forehead.", "s/study.htm"),
  sign("Test", "TEST", "School", "None required.", "Both index fingers draw question marks downward.", "Two 1-hands draw question-mark curves.", "t/test.htm"),
  sign("Library", "LIBRARY", "School", "None required.", "An L hand circles.", "L-hand, a small circle.", "l/library.htm"),
  sign("College", "COLLEGE", "School", "None required.", "One palm claps upward onto the other palm.", "The dominant hand rises and lands on the non-dominant palm.", "c/college.htm"),
  sign("Desk", "DESK", "School", "None required.", "The forearm of one arm taps the forearm of the other, showing a surface.", "Forearms contact, like the top of a desk.", "d/desk.htm"),

  sign("Work", "WORK", "Jobs", "None required.", "Tap one wrist on the other, twice.", "Two S-hands. The dominant wrist taps the other wrist.", "w/work.htm"),
  sign("Doctor", "DOCTOR", "Jobs", "None required.", "An M or D hand taps the pulse.", "Letter hand taps the opposite wrist.", "d/doctor.htm"),
  sign("Nurse", "NURSE", "Jobs", "None required.", "An N hand taps the pulse. Same place as DOCTOR.", "N-hand taps the opposite wrist.", "n/nurse.htm"),
  sign("Police", "POLICE", "Jobs", "None required.", "Tap a C hand on the upper chest, where a badge sits.", "C-hand taps the chest.", "p/police.htm"),
  sign("Cook", "COOK", "Jobs", "None required.", "Both palms flip up, as if turning food. A person ending can mark the job.", "Palm-up hands flip.", "c/cook.htm"),
  sign("Lawyer", "LAWYER", "Jobs", "None required.", "An L hand slides down the opposite palm, then the hands drop along the sides.", "LAW, then the person ending.", "l/lawyer.htm"),
  sign("Artist", "ARTIST", "Jobs", "None required.", "The pinky draws down the opposite palm, then the hands drop along the sides.", "ART, then the person ending.", "a/artist.htm"),
  sign("Boss", "BOSS", "Jobs", "None required.", "A claw hand takes the shoulder, like a person in charge.", "Claw hand on the shoulder.", "b/boss.htm"),
  sign("Farmer", "FARMER", "Jobs", "None required.", "The thumb starts under the chin and moves forward.", "Thumb under the chin slides out.", "f/farmer.htm"),

  sign("Home", "HOME", "Home", "None required.", "A flat-O touches the chin, then the cheek.", "Flat-O, mouth place then cheek place.", "h/home.htm"),
  sign("House", "HOUSE", "Home", "None required.", "Flat hands draw a roof, then the walls.", "Both hands outline a roof.", "h/house.htm"),
  sign("Room", "ROOM", "Home", "None required.", "Both flat hands show the walls of a box.", "Palms in, hands depict the sides of a room.", "r/room.htm"),
  sign("Bed", "BED", "Home", "None required.", "Tilt the head onto the palm.", "Cheek rests on the open hand.", "b/bed.htm"),
  sign("Door", "DOOR", "Home", "None required.", "Two B hands stand together. One swings open.", "B-hands. The dominant hand hinges out.", "d/door.htm"),
  sign("Window", "WINDOW", "Home", "None required.", "Two hands stack. The top one rises, like a sash.", "The upper hand moves up.", "w/window.htm"),
  sign("Kitchen", "KITCHEN", "Home", "None required.", "A K hand flips, palm up, like cooking.", "K-hand flips in place.", "k/kitchen.htm"),
  sign("Bathroom", "BATHROOM", "Home", "None required.", "A T hand shakes.", "T-hand, a small shake.", "b/bathroom.htm"),
  sign("Table", "TABLE", "Home", "None required.", "Both arms pat down, showing the top.", "Forearms or flat hands pat a surface.", "t/table.htm"),
  sign("Chair", "CHAIR", "Home", "None required.", "Two fingers of one hand sit on two fingers of the other.", "A curved H hooks onto the other H.", "c/chair.htm"),

  sign("Shirt", "SHIRT", "Clothes", "None required.", "Pinch the fabric at the upper chest and tug.", "Thumb and index take the shirt.", "s/shirt.htm"),
  sign("Pants", "PANTS", "Clothes", "None required.", "Both open hands slide up the thighs.", "Palms slide up the legs.", "p/pants.htm"),
  sign("Shoes", "SHOES", "Clothes", "None required.", "Two fists tap together.", "S-hands tap.", "s/shoes.htm"),
  sign("Hat", "HAT", "Clothes", "None required.", "Pat the top of the head.", "Open hand pats the head.", "h/hat.htm"),
  sign("Dress", "DRESS", "Clothes", "None required.", "Both hands brush down the torso.", "Open hands sweep down the body.", "d/dress.htm"),
  sign("Coat", "COAT", "Clothes", "None required.", "Both fists move down from the shoulders, as if pulling a coat on.", "A-hands travel down from the shoulders.", "c/coat.htm"),

  sign("Dog", "DOG", "Animals", "None required.", "Pat the thigh, then snap.", "A slap on the leg and a snap.", "d/dog.htm"),
  sign("Cat", "CAT", "Animals", "None required.", "Pinch the cheek and pull the whiskers out.", "Thumb and index draw away from the cheek.", "c/cat.htm"),
  sign("Bird", "BIRD", "Animals", "None required.", "Thumb and index open and close at the mouth, a beak.", "G-hand opens and closes. It can then move away.", "b/bird.htm"),
  sign("Fish", "FISH", "Animals", "None required.", "An open hand swims forward.", "Flat hand, fingers leading, a swimming path.", "f/fish.htm"),
  sign("Horse", "HORSE", "Animals", "None required.", "Thumb at the temple. Two fingers flick forward, the ears.", "U or H hand flicks at the temple.", "h/horse.htm"),
  sign("Cow", "COW", "Animals", "None required.", "A Y hand at the temple twists out, the horn.", "Y-hand twists at the temple.", "c/cow.htm"),

  sign("Rain", "RAIN", "Weather", "None required.", "Claw hands wiggle as they drop.", "Bent 5-hands descend, fingers fluttering.", "r/rain.htm"),
  sign("Sun", "SUN", "Weather", "None required.", "The index finger draws a small circle beside the head.", "1-hand circles at the side of the head.", "s/sun.htm"),
  sign("Snow", "SNOW", "Weather", "None required.", "Open fingers wiggle as the hands descend.", "5-hands flutter downward, palms down.", "s/snow.htm"),
  sign("Wind", "WIND", "Weather", "None required.", "Open hands sweep from side to side.", "Both hands wave sideways.", "w/wind.htm"),
  sign("Hot", "HOT", "Weather", "None required.", "A claw hand at the mouth turns outward.", "Claw at the mouth rotates out, as if throwing heat.", "h/hot.htm"),
  sign("Cold", "COLD", "Weather", "None required.", "Shoulders rise and the fists shiver.", "Two S-hands shake beside the body.", "c/cold.htm"),
  sign("Weather", "WEATHER", "Weather", "None required.", "Two W hands face each other and twist.", "W-hands change orientation.", "w/weather.htm"),
];

export const TOPIC_UNITS = [
  unit("family", "Family", "#/vocab/family", [
    lesson(
      "family-parents",
      "Parents",
      "FATHER taps the forehead. MOTHER taps the chin. BROTHER and SISTER add SAME, the two index fingers coming together.",
      [
        match("Tap the matching pairs.", [
          ["Mother", "MOTHER"],
          ["Father", "FATHER"],
          ["Brother", "BROTHER"],
          ["Sister", "SISTER"],
        ]),
        choice("FATHER is signed at the…", ["Forehead", "Chin", "Chest"], "Forehead", "The thumb of a 5-hand taps the forehead."),
        choice("MOTHER is signed at the…", ["Chin", "Forehead", "Shoulder"], "Chin", "Same hand as FATHER. The place changes."),
        choice("BROTHER adds which sign after the forehead?", ["SAME", "BABY", "COLOR"], "SAME", "The two index fingers come together."),
        choice("SISTER starts at the…", ["Chin", "Forehead", "Ear"], "Chin", "Female place, then SAME."),
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
      ],
    ),
  ]),
  unit("colors", "Colors", "#/vocab/colors", [
    lesson(
      "colors-basic",
      "Four colors",
      "RED brushes the lips. BLUE, GREEN, and YELLOW twist a letter hand.",
      [
        match("Tap the matching pairs.", [
          ["Red", "RED"],
          ["Blue", "BLUE"],
          ["Green", "GREEN"],
          ["Yellow", "YELLOW"],
        ]),
        choice("RED uses…", ["An index finger on the lips", "A B hand twist", "A clap"], "An index finger on the lips", "The finger brushes down."),
        choice("BLUE is…", ["A B hand twisting", "A brush down the cheek", "A roof"], "A B hand twisting", "The letter hand is the memory aid. The twist is the sign."),
        choice("GREEN twists…", ["A G hand", "A Y hand", "An open 5"], "A G hand", "Same twist family as BLUE. The handshape changes."),
        choice("YELLOW uses…", ["A Y hand", "A P hand on the lips", "Two fists"], "A Y hand", "Thumb and pinky out, then twist."),
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
      ],
    ),
  ]),
];
