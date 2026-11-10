/**
 * Pad each unit’s vocabulary to ≥25 terms and build filmed intro lessons.
 * New lesson ids only — existing path progress stays valid.
 */

export const MIN_UNIT_TERMS = 25;

/** Extra [term, gloss, lifeprintPath?, youtubeId?] rows by category. */
export const EXTRA_BY_CATEGORY = {
  Family: [
    ["Boy", "BOY", "b/boy.htm"],
    ["Girl", "GIRL", "g/girl.htm"],
    ["Man", "MAN", "m/man.htm"],
    ["Woman", "WOMAN", "w/woman.htm"],
    ["Child", "CHILD", "c/child.htm"],
    ["Children", "CHILDREN", "c/children.htm"],
    ["Friend", "FRIEND", "f/friend.htm"],
    ["Marry", "MARRY", "m/marry.htm"],
  ],
  Colors: [
    ["Gold", "GOLD", "g/gold.htm"],
    ["Silver", "SILVER", "s/silver.htm"],
    ["Dark", "DARK", "d/dark.htm"],
    ["Light", "LIGHT", "l/light.htm"],
    ["Tan", "TAN", "t/tan.htm"],
    ["Bright", "BRIGHT", "b/bright.htm"],
    ["Rainbow", "RAINBOW", "r/rainbow.htm"],
    ["Colorful", "COLORFUL", "c/colorful.htm"],
    ["Shadow", "SHADOW", "s/shadow.htm"],
    ["Pale", "PALE", "p/pale.htm"],
    ["Shiny", "SHINY", "s/shiny.htm"],
    ["Dull", "DULL", "d/dull.htm"],
    ["Paint", "PAINT", "p/paint.htm"],
  ],
  Food: [
    ["Pizza", "PIZZA", "p/pizza.htm"],
    ["Hamburger", "HAMBURGER", "h/hamburger.htm"],
    ["Sandwich", "SANDWICH", "s/sandwich.htm"],
    ["Soup", "SOUP", "s/soup.htm"],
    ["Salad", "SALAD", "s/salad.htm"],
    ["Rice", "RICE", "r/rice.htm"],
    ["Butter", "BUTTER", "b/butter.htm"],
    ["Cheese", "CHEESE", "c/cheese.htm"],
    ["Sugar", "SUGAR", "s/sugar.htm"],
    ["Salt", "SALT", "s/salt.htm"],
    ["Drink", "DRINK", "d/drink.htm"],
    ["Full", "FULL", "f/full.htm"],
    ["Delicious", "DELICIOUS", "d/delicious.htm"],
  ],
  Jobs: [
    ["Teacher", "TEACHER", "t/teacher.htm"],
    ["Student", "STUDENT", "s/student.htm"],
    ["Firefighter", "FIREFIGHTER", "f/firefighter.htm"],
    ["Soldier", "SOLDIER", "s/soldier.htm"],
    ["Pilot", "PILOT", "p/pilot.htm"],
    ["Driver", "DRIVER", "d/driver.htm"],
    ["Waiter", "WAITER", "w/waiter.htm"],
    ["Engineer", "ENGINEER", "e/engineer.htm"],
    ["Scientist", "SCIENTIST", "s/scientist.htm"],
    ["Actor", "ACTOR", "a/actor.htm"],
    ["Musician", "MUSICIAN", "m/musician.htm"],
    ["Writer", "WRITER", "w/writer.htm"],
    ["Manager", "MANAGER", "m/manager.htm"],
    ["Secretary", "SECRETARY", "s/secretary.htm"],
    ["Dentist", "DENTIST", "d/dentist.htm"],
    ["Job", "JOB", "j/job.htm"],
    ["Mechanic", "MECHANIC", "m/mechanic.htm"],
    ["Baker", "BAKER", "b/baker.htm"],
    ["Barber", "BARBER", "b/barber.htm"],
    ["Librarian", "LIBRARIAN", "l/librarian.htm"],
  ],
  Home: [
    ["Apartment", "APARTMENT", "a/apartment.htm"],
    ["Living room", "LIVING-ROOM", "l/livingroom.htm"],
    ["Garage", "GARAGE", "g/garage.htm"],
    ["Yard", "YARD", "y/yard.htm"],
    ["Floor", "FLOOR", "f/floor.htm"],
    ["Wall", "WALL", "w/wall.htm"],
    ["Roof", "ROOF", "r/roof.htm"],
    ["Stairs", "STAIRS", "s/stairs.htm"],
    ["Closet", "CLOSET", "c/closet.htm"],
    ["Couch", "COUCH", "c/couch.htm"],
    ["Lamp", "LAMP", "l/lamp.htm"],
    ["Phone", "PHONE", "p/phone.htm"],
    ["Computer", "COMPUTER", "c/computer.htm"],
  ],
  Clothes: [
    ["Socks", "SOCKS", "s/socks.htm"],
    ["Skirt", "SKIRT", "s/skirt.htm"],
    ["Jacket", "JACKET", "j/jacket.htm"],
    ["Sweater", "SWEATER", "s/sweater.htm"],
    ["Tie", "TIE", "t/tie.htm"],
    ["Belt", "BELT", "b/belt.htm"],
    ["Gloves", "GLOVES", "g/gloves.htm"],
    ["Scarf", "SCARF", "s/scarf.htm"],
    ["Glasses", "GLASSES", "g/glasses.htm"],
    ["Underwear", "UNDERWEAR", "u/underwear.htm"],
    ["Pajamas", "PAJAMAS", "p/pajamas.htm"],
    ["Uniform", "UNIFORM", "u/uniform.htm"],
    ["Jewelry", "JEWELRY", "j/jewelry.htm"],
    ["Necklace", "NECKLACE", "n/necklace.htm"],
    ["Ring", "RING", "r/ring.htm"],
    ["Watch", "WATCH", "w/watch.htm"],
    ["Purse", "PURSE", "p/purse.htm"],
    ["Backpack", "BACKPACK", "b/backpack.htm"],
    ["Clothes", "CLOTHES", "c/clothes.htm"],
  ],
  Animals: [
    ["Pig", "PIG", "p/pig.htm"],
    ["Sheep", "SHEEP", "s/sheep.htm"],
    ["Chicken", "CHICKEN", "c/chicken.htm"],
    ["Duck", "DUCK", "d/duck.htm"],
    ["Rabbit", "RABBIT", "r/rabbit.htm"],
    ["Mouse", "MOUSE", "m/mouse.htm"],
    ["Frog", "FROG", "f/frog.htm"],
    ["Snake", "SNAKE", "s/snake.htm"],
    ["Turtle", "TURTLE", "t/turtle.htm"],
    ["Bear", "BEAR", "b/bear.htm"],
    ["Lion", "LION", "l/lion.htm"],
    ["Tiger", "TIGER", "t/tiger.htm"],
    ["Elephant", "ELEPHANT", "e/elephant.htm"],
    ["Monkey", "MONKEY", "m/monkey.htm"],
    ["Animal", "ANIMAL", "a/animal.htm"],
    ["Pet", "PET", "p/pet.htm"],
    ["Zoo", "ZOO", "z/zoo.htm"],
    ["Butterfly", "BUTTERFLY", "b/butterfly.htm"],
    ["Spider", "SPIDER", "s/spider.htm"],
  ],
  Weather: [
    ["Cloud", "CLOUD", "c/cloud.htm"],
    ["Storm", "STORM", "s/storm.htm"],
    ["Thunder", "THUNDER", "t/thunder.htm"],
    ["Lightning", "LIGHTNING", "l/lightning.htm"],
    ["Fog", "FOG", "f/fog.htm"],
    ["Rainbow", "RAINBOW", "r/rainbow.htm"],
    ["Temperature", "TEMPERATURE", "t/temperature.htm"],
    ["Warm", "WARM", "w/warm.htm"],
    ["Cool", "COOL", "c/cool.htm"],
    ["Freeze", "FREEZE", "f/freeze.htm"],
    ["Wet", "WET", "w/wet.htm"],
    ["Dry", "DRY", "d/dry.htm"],
    ["Spring", "SPRING", "s/spring.htm"],
    ["Fall", "FALL", "f/fall.htm"],
    ["Winter", "WINTER", "w/winter.htm"],
    ["Season", "SEASON", "s/season.htm"],
    ["Umbrella", "UMBRELLA", "u/umbrella.htm"],
    ["Flood", "FLOOD", "f/flood.htm"],
    ["Drought", "DROUGHT", "d/drought.htm"],
    ["Humidity", "HUMIDITY", "h/humidity.htm"],
  ],
  Numbers: [
    ["Thirteen", "THIRTEEN", "t/thirteen.htm"],
    ["Fourteen", "FOURTEEN", "f/fourteen.htm"],
    ["Fifteen", "FIFTEEN", "f/fifteen.htm"],
    ["Sixteen", "SIXTEEN", "s/sixteen.htm"],
    ["Seventeen", "SEVENTEEN", "s/seventeen.htm"],
    ["Eighteen", "EIGHTEEN", "e/eighteen.htm"],
    ["Nineteen", "NINETEEN", "n/nineteen.htm"],
    ["Twenty", "TWENTY", "t/twenty.htm"],
    ["Hundred", "HUNDRED", "h/hundred.htm"],
    ["Thousand", "THOUSAND", "t/thousand.htm"],
    ["Number", "NUMBER", "n/number.htm"],
    ["First", "FIRST", "f/first.htm"],
    ["Last", "LAST", "l/last.htm"],
    ["Half", "HALF", "h/half.htm"],
    ["None", "NONE", "n/none.htm"],
  ],
  Body: [
    ["Arm", "ARM", "a/arm.htm"],
    ["Leg", "LEG", "l/leg.htm"],
    ["Knee", "KNEE", "k/knee.htm"],
    ["Shoulder", "SHOULDER", "s/shoulder.htm"],
    ["Back", "BACK", "b/back.htm"],
    ["Neck", "NECK", "n/neck.htm"],
    ["Finger", "FINGER", "f/finger.htm"],
    ["Thumb", "THUMB", "t/thumb.htm"],
    ["Toe", "TOE", "t/toe.htm"],
    ["Bone", "BONE", "b/bone.htm"],
    ["Blood", "BLOOD", "b/blood.htm"],
    ["Body", "BODY", "b/body.htm"],
    ["Skin", "SKIN", "s/skin.htm"],
  ],
  Health: [
    ["Healthy", "HEALTHY", "h/healthy.htm"],
    ["Fever", "FEVER", "f/fever.htm"],
    ["Cold (illness)", "COLD++", "c/cold.htm"],
    ["Allergy", "ALLERGY", "a/allergy.htm"],
    ["Pain", "PAIN", "p/pain.htm"],
    ["Bleed", "BLEED", "b/bleed.htm"],
    ["Break", "BREAK", "b/break.htm"],
    ["Surgery", "SURGERY", "s/surgery.htm"],
    ["Ambulance", "AMBULANCE", "a/ambulance.htm"],
    ["Doctor", "DOCTOR", "d/doctor.htm"],
    ["Nurse", "NURSE", "n/nurse.htm"],
    ["Patient", "PATIENT", "p/patient.htm"],
    ["Sleep", "SLEEP", "s/sleep.htm"],
    ["Wake", "WAKE", "w/wake.htm"],
    ["Rest", "REST", "r/rest.htm"],
    ["Exercise", "EXERCISE", "e/exercise.htm"],
  ],
  Travel: [
    ["Go", "GO", "g/go.htm"],
    ["Come", "COME", "c/come.htm"],
    ["Leave", "LEAVE", "l/leave.htm"],
    ["Arrive", "ARRIVE", "a/arrive.htm"],
    ["Trip", "TRIP", "t/trip.htm"],
    ["Vacation", "VACATION", "v/vacation.htm"],
    ["Ticket", "TICKET", "t/ticket.htm"],
    ["Airport", "AIRPORT", "a/airport.htm"],
    ["Station", "STATION", "s/station.htm"],
    ["Map", "MAP", "m/map.htm"],
    ["Far", "FAR", "f/far.htm"],
    ["Near", "NEAR", "n/near.htm"],
    ["Lost", "LOST", "l/lost.htm"],
    ["Direction", "DIRECTION", "d/direction.htm"],
    ["Highway", "HIGHWAY", "h/highway.htm"],
    ["Traffic", "TRAFFIC", "t/traffic.htm"],
  ],
  Money: [
    ["Rich", "RICH", "r/rich.htm"],
    ["Poor", "POOR", "p/poor.htm"],
    ["Save", "SAVE", "s/save.htm"],
    ["Spend", "SPEND", "s/spend.htm"],
    ["Borrow", "BORROW", "b/borrow.htm"],
    ["Lend", "LEND", "l/lend.htm"],
    ["Owe", "OWE", "o/owe.htm"],
    ["Bill", "BILL", "b/bill.htm"],
    ["Check", "CHECK", "c/check.htm"],
    ["Credit card", "CREDIT-CARD", "c/creditcard.htm"],
    ["Wallet", "WALLET", "w/wallet.htm"],
    ["Free", "FREE", "f/free.htm"],
    ["Price", "PRICE", "p/price.htm"],
    ["Tax", "TAX", "t/tax.htm"],
    ["Tip", "TIP", "t/tip.htm"],
  ],
  Nature: [
    ["Sky", "SKY", "s/sky.htm"],
    ["Forest", "FOREST", "f/forest.htm"],
    ["Lake", "LAKE", "l/lake.htm"],
    ["Beach", "BEACH", "b/beach.htm"],
    ["Island", "ISLAND", "i/island.htm"],
    ["Hill", "HILL", "h/hill.htm"],
    ["Valley", "VALLEY", "v/valley.htm"],
    ["Fire", "FIRE", "f/fire.htm"],
    ["Water", "WATER", "w/water.htm"],
    ["Dirt", "DIRT", "d/dirt.htm"],
    ["Garden", "GARDEN", "g/garden.htm"],
    ["Farm", "FARM", "f/farm.htm"],
    ["World", "WORLD", "w/world.htm"],
    ["Environment", "ENVIRONMENT", "e/environment.htm"],
  ],
  Sports: [
    ["Team", "TEAM", "t/team.htm"],
    ["Win", "WIN", "w/win.htm"],
    ["Lose", "LOSE", "l/lose.htm"],
    ["Score", "SCORE", "s/score.htm"],
    ["Coach", "COACH", "c/coach.htm"],
    ["Practice", "PRACTICE", "p/practice.htm"],
    ["Race", "RACE", "r/race.htm"],
    ["Jump", "JUMP", "j/jump.htm"],
    ["Throw", "THROW", "t/throw.htm"],
    ["Catch", "CATCH", "c/catch.htm"],
    ["Kick", "KICK", "k/kick.htm"],
    ["Hit", "HIT", "h/hit.htm"],
    ["Sport", "SPORT", "s/sport.htm"],
    ["Athlete", "ATHLETE", "a/athlete.htm"],
    ["Gym", "GYM", "g/gym.htm"],
    ["Exercise", "EXERCISE", "e/exercise.htm"],
  ],
  Places: [
    ["Home", "HOME", "h/home.htm"],
    ["School", "SCHOOL", "s/school.htm"],
    ["Store", "STORE", "s/store.htm"],
    ["Library", "LIBRARY", "l/library.htm"],
    ["Hospital", "HOSPITAL", "h/hospital.htm"],
    ["Office", "OFFICE", "o/office.htm"],
    ["Museum", "MUSEUM", "m/museum.htm"],
    ["Park", "PARK", "p/park.htm"],
    ["Beach", "BEACH", "b/beach.htm"],
    ["Country", "COUNTRY", "c/country.htm"],
    ["Town", "TOWN", "t/town.htm"],
    ["Address", "ADDRESS", "a/address.htm"],
    ["Bridge", "BRIDGE", "b/bridge.htm"],
    ["Airport", "AIRPORT", "a/airport.htm"],
    ["Market", "MARKET", "m/market.htm"],
    ["Theater", "THEATER", "t/theater.htm"],
    ["Factory", "FACTORY", "f/factory.htm"],
    ["Farm", "FARM", "f/farm.htm"],
    ["Gym", "GYM", "g/gym.htm"],
    ["Stadium", "STADIUM", "s/stadium.htm"],
    ["Library", "LIBRARY", "l/library.htm"],
    ["Post office", "POST-OFFICE", "p/postoffice.htm"],
  ],
  Greetings: [
    ["Welcome", "WELCOME", "w/welcome.htm"],
    ["Good afternoon", "GOOD AFTERNOON", "g/goodafternoon.htm"],
    ["Good night", "GOOD NIGHT", "g/goodnight.htm"],
    ["See you later", "SEE YOU LATER", "s/seeyoulater.htm"],
    ["Take care", "TAKE-CARE", "t/takecare.htm"],
    ["Congratulations", "CONGRATULATIONS", "c/congratulations.htm"],
    ["Good luck", "GOOD-LUCK", "g/goodluck.htm"],
    ["Yes", "YES", "y/yes.htm"],
    ["No", "NO", "n/no.htm"],
    ["Maybe", "MAYBE", "m/maybe.htm"],
    ["Of course", "OF-COURSE", "o/ofcourse.htm"],
    ["Really", "REALLY", "r/really.htm"],
  ],
  Pronouns: [
    ["Me", "ME", "m/me.htm"],
    ["My", "MY", "m/my.htm"],
    ["Your", "YOUR", "y/your.htm"],
    ["His", "HIS", "h/his.htm"],
    ["Her", "HER", "h/her.htm"],
    ["Their", "THEIR", "t/their.htm"],
    ["Our", "OUR", "o/our.htm"],
    ["They", "THEY", "t/they.htm"],
    ["Them", "THEM", "t/them.htm"],
    ["Someone", "SOMEONE", "s/someone.htm"],
    ["Everyone", "EVERYONE", "e/everyone.htm"],
    ["Nobody", "NOBODY", "n/nobody.htm"],
    ["Myself", "MYSELF", "m/myself.htm"],
    ["Yourself", "YOURSELF", "y/yourself.htm"],
    ["Itself", "ITSELF", "i/itself.htm"],
    ["People", "PEOPLE", "p/people.htm"],
    ["Person", "PERSON", "p/person.htm"],
    ["Other", "OTHER", "o/other.htm"],
    ["Both", "BOTH", "b/both.htm"],
    ["All", "ALL", "a/all.htm"],
    ["This", "THIS", "t/this.htm"],
  ],
  Emotions: [
    ["Love", "LOVE", "l/love.htm"],
    ["Hate", "HATE", "h/hate.htm"],
    ["Mad", "MAD", "m/mad.htm"],
    ["Upset", "UPSET", "u/upset.htm"],
    ["Glad", "GLAD", "g/glad.htm"],
    ["Feel", "FEEL", "f/feel.htm"],
    ["Miss", "MISS", "m/miss.htm"],
    ["Lonely", "LONELY", "l/lonely.htm"],
    ["Shy", "SHY", "s/shy.htm"],
    ["Brave", "BRAVE", "b/brave.htm"],
    ["Funny", "FUNNY", "f/funny.htm"],
    ["Silly", "SILLY", "s/silly.htm"],
    ["Crazy", "CRAZY", "c/crazy.htm"],
    ["Confused", "CONFUSED", "c/confused.htm"],
    ["Frustrated", "FRUSTRATED", "f/frustrated.htm"],
    ["Proud", "PROUD", "p/proud.htm"],
    ["Embarrassed", "EMBARRASSED", "e/embarrassed.htm"],
    ["Jealous", "JEALOUS", "j/jealous.htm"],
    ["Hope", "HOPE", "h/hope.htm"],
    ["Worried", "WORRY", "w/worry.htm"],
    ["Calm", "CALM", "c/calm.htm"],
    ["Nervous", "NERVOUS", "n/nervous.htm"],
  ],
  Time: [
    ["Hour", "HOUR", "h/hour.htm"],
    ["Minute", "MINUTE", "m/minute.htm"],
    ["Day", "DAY", "d/day.htm"],
    ["Month", "MONTH", "m/month.htm"],
    ["Year", "YEAR", "y/year.htm"],
    ["Weekend", "WEEKEND", "w/weekend.htm"],
    ["Monday", "MONDAY", "m/monday.htm"],
    ["Tuesday", "TUESDAY", "t/tuesday.htm"],
    ["Wednesday", "WEDNESDAY", "w/wednesday.htm"],
    ["Thursday", "THURSDAY", "t/thursday.htm"],
    ["Friday", "FRIDAY", "f/friday.htm"],
    ["Saturday", "SATURDAY", "s/saturday.htm"],
    ["Sunday", "SUNDAY", "s/sunday.htm"],
    ["Always", "ALWAYS", "a/always.htm"],
    ["Never", "NEVER", "n/never.htm"],
    ["Sometimes", "SOMETIMES", "s/sometimes.htm"],
    ["Before", "BEFORE", "b/before.htm"],
    ["After", "AFTER", "a/after.htm"],
  ],
  "Question words": [
    ["Which", "WHICH", "w/which.htm"],
    ["How many", "HOW-MANY", "h/howmany.htm"],
    ["How much", "HOW-MUCH", "h/howmuch.htm"],
    ["How long", "HOW-LONG", "h/howlong.htm"],
    ["How often", "HOW-OFTEN", "h/howoften.htm"],
    ["What for", "WHAT-FOR", "w/whatfor.htm"],
    ["For what", "FOR-WHAT", "f/forwhat.htm"],
    ["Who for", "WHO-FOR", "w/whofor.htm"],
    ["Whose", "WHOSE", "w/whose.htm"],
    ["What kind", "WHAT-KIND", "w/whatkind.htm"],
    ["Where from", "WHERE-FROM", "w/wherefrom.htm"],
    ["Question", "QUESTION", "q/question.htm"],
    ["Answer", "ANSWER", "a/answer.htm"],
    ["Ask", "ASK", "a/ask.htm"],
    ["Tell", "TELL", "t/tell.htm"],
    ["Explain", "EXPLAIN", "e/explain.htm"],
    ["Understand", "UNDERSTAND", "u/understand.htm"],
    ["Know", "KNOW", "k/know.htm"],
    ["Don't know", "DON'T-KNOW", "d/dontknow.htm"],
  ],
  Discourse: [
    ["Introduce", "INTRODUCE", "i/introduce.htm"],
    ["Continue", "CONTINUE", "c/continue.htm"],
    ["Interrupt", "INTERRUPT", "i/interrupt.htm"],
    ["Respond", "RESPOND", "r/respond.htm"],
    ["Clarify", "CLARIFY", "c/clarify.htm"],
    ["Repeat", "REPEAT", "r/repeat.htm"],
    ["List", "LIST", "l/list.htm"],
    ["Order", "ORDER", "o/order.htm"],
    ["Connect", "CONNECT", "c/connect.htm"],
    ["Separate", "SEPARATE", "s/separate.htm"],
    ["Background", "BACKGROUND", "b/background.htm"],
    ["Foreground", "FOREGROUND", "f/foreground.htm"],
    ["Aside", "ASIDE", "a/aside.htm"],
    ["Main", "MAIN", "m/main.htm"],
    ["Side", "SIDE", "s/side.htm"],
  ],
  Depict: [
    ["Show", "SHOW", "s/show.htm"],
    ["Draw", "DRAW", "d/draw.htm"],
    ["Mime", "MIME", "m/mime.htm"],
    ["Size", "SIZE", "s/size.htm"],
    ["Shape", "SHAPE", "s/shape.htm"],
    ["Path", "PATH", "p/path.htm"],
    ["Manner", "MANNER", "m/manner.htm"],
    ["Scene", "SCENE", "s/scene.htm"],
    ["Role", "ROLE", "r/role.htm"],
    ["Copy", "COPY", "c/copy.htm"],
    ["Create", "CREATE", "c/create.htm"],
    ["Visual", "VISUAL", "v/visual.htm"],
    ["Depict", "DEPICT", "d/depict.htm"],
    ["Embody", "EMBODY", "e/embody.htm"],
    ["Gesture", "GESTURE", "g/gesture.htm"],
    ["Demonstrate", "DEMONSTRATE", "d/demonstrate.htm"],
    ["Illustrate", "ILLUSTRATE", "i/illustrate.htm"],
    ["Portray", "PORTRAY", "p/portray.htm"],
  ],
  Classifiers: [
    ["Classifier", "CLASSIFIER", "c/classifier.htm"],
    ["Vehicle", "VEHICLE", "v/vehicle.htm"],
    ["Person", "PERSON", "p/person.htm"],
    ["Surface", "SURFACE", "s/surface.htm"],
    ["Object", "OBJECT", "o/object.htm"],
    ["Handle", "HANDLE", "h/handle.htm"],
    ["Flat", "FLAT", "f/flat.htm"],
    ["Round", "ROUND", "r/round.htm"],
    ["Thin", "THIN", "t/thin.htm"],
    ["Thick", "THICK", "t/thick.htm"],
    ["Long", "LONG", "l/long.htm"],
    ["Short", "SHORT", "s/short.htm"],
    ["Tall", "TALL", "t/tall.htm"],
    ["Small", "SMALL", "s/small.htm"],
    ["Large", "LARGE", "l/large.htm"],
    ["Move", "MOVE", "m/move.htm"],
  ],
  Ideas: [
    ["Know", "KNOW", "k/know.htm"],
    ["Learn", "LEARN", "l/learn.htm"],
    ["Teach", "TEACH", "t/teach.htm"],
    ["Remember", "REMEMBER", "r/remember.htm"],
    ["Forget", "FORGET", "f/forget.htm"],
    ["Wonder", "WONDER", "w/wonder.htm"],
    ["Decide", "DECIDE", "d/decide.htm"],
    ["Plan", "PLAN", "p/plan.htm"],
    ["Invent", "INVENT", "i/invent.htm"],
    ["Discover", "DISCOVER", "d/discover.htm"],
    ["Logic", "LOGIC", "l/logic.htm"],
    ["Smart", "SMART", "s/smart.htm"],
    ["Stupid", "STUPID", "s/stupid.htm"],
    ["Curious", "CURIOUS", "c/curious.htm"],
    ["Doubt", "DOUBT", "d/doubt.htm"],
    ["Reason", "REASON", "r/reason.htm"],
    ["Guess", "GUESS", "g/guess.htm"],
    ["Realize", "REALIZE", "r/realize.htm"],
    ["Imagine", "IMAGINE", "i/imagine.htm"],
    ["Focus", "FOCUS", "f/focus.htm"],
    ["Concept", "CONCEPT", "c/concept.htm"],
    ["Theory", "THEORY", "t/theory.htm"],
    ["Analyze", "ANALYZE", "a/analyze.htm"],
    ["Definition", "DEFINITION", "d/definition.htm"],
  ],
  Intensity: [
    ["Very", "VERY", "v/very.htm"],
    ["Really", "REALLY", "r/really.htm"],
    ["Almost", "ALMOST", "a/almost.htm"],
    ["Hard", "HARD", "h/hard.htm"],
    ["Easy", "EASY", "e/easy.htm"],
    ["Strong", "STRONG", "s/strong.htm"],
    ["Weak", "WEAK", "w/weak.htm"],
    ["Fast", "FAST", "f/fast.htm"],
    ["Slow", "SLOW", "s/slow.htm"],
    ["More", "MORE", "m/more.htm"],
    ["Less", "LESS", "l/less.htm"],
    ["Too", "TOO", "t/too.htm"],
    ["Enough", "ENOUGH", "e/enough.htm"],
    ["Extreme", "EXTREME", "e/extreme.htm"],
  ],
  Opinion: [
    ["Prefer", "PREFER", "p/prefer.htm"],
    ["Favor", "FAVOR", "f/favor.htm"],
    ["Support", "SUPPORT", "s/support.htm"],
    ["Oppose", "OPPOSE", "o/oppose.htm"],
    ["Judge", "JUDGE", "j/judge.htm"],
    ["Value", "VALUE", "v/value.htm"],
    ["Worth", "WORTH", "w/worth.htm"],
    ["Fair", "FAIR", "f/fair.htm"],
    ["Unfair", "UNFAIR", "u/unfair.htm"],
    ["Right", "RIGHT", "r/right.htm"],
    ["Wrong", "WRONG", "w/wrong.htm"],
    ["Better", "BETTER", "b/better.htm"],
    ["Worse", "WORSE", "w/worse.htm"],
    ["Best", "BEST", "b/best.htm"],
    ["Worst", "WORST", "w/worst.htm"],
  ],
  Debate: [
    ["Claim", "CLAIM", "c/claim.htm"],
    ["Challenge", "CHALLENGE", "c/challenge.htm"],
    ["Defend", "DEFEND", "d/defend.htm"],
    ["Attack", "ATTACK", "a/attack.htm"],
    ["Win", "WIN", "w/win.htm"],
    ["Lose", "LOSE", "l/lose.htm"],
    ["Fair", "FAIR", "f/fair.htm"],
    ["Bias", "BIAS", "b/bias.htm"],
    ["Fact", "FACT", "f/fact.htm"],
    ["Opinion", "OPINION", "o/opinion.htm"],
    ["Evidence", "EVIDENCE", "e/evidence.htm"],
    ["Source", "SOURCE", "s/source.htm"],
    ["Agree", "AGREE", "a/agree.htm"],
    ["Disagree", "DISAGREE", "d/disagree.htm"],
    ["Vote", "VOTE", "v/vote.htm"],
    ["Argue", "ARGUE", "a/argue.htm"],
    ["Discuss", "DISCUSS", "d/discuss.htm"],
    ["Persuade", "PERSUADE", "p/persuade.htm"],
    ["Compromise", "COMPROMISE", "c/compromise.htm"],
    ["Negotiate", "NEGOTIATE", "n/negotiate.htm"],
    ["Suggest", "SUGGEST", "s/suggest.htm"],
    ["Accept", "ACCEPT", "a/accept.htm"],
    ["Reject", "REJECT", "r/reject.htm"],
    ["Prove", "PROVE", "p/prove.htm"],
    ["Decide", "DECIDE", "d/decide.htm"],
    ["Convince", "CONVINCE", "c/convince.htm"],
    ["Counter", "COUNTER", "c/counter.htm"],
  ],
  Professional: [
    ["Work", "WORK", "w/work.htm"],
    ["Boss", "BOSS", "b/boss.htm"],
    ["Employee", "EMPLOYEE", "e/employee.htm"],
    ["Hire", "HIRE", "h/hire.htm"],
    ["Fire", "FIRE", "f/fire.htm"],
    ["Promote", "PROMOTE", "p/promote.htm"],
    ["Salary", "SALARY", "s/salary.htm"],
    ["Schedule", "SCHEDULE", "s/schedule.htm"],
    ["Task", "TASK", "t/task.htm"],
    ["Report", "REPORT", "r/report.htm"],
    ["Meeting", "MEETING", "m/meeting.htm"],
    ["Email", "EMAIL", "e/email.htm"],
    ["Call", "CALL", "c/call.htm"],
    ["Business", "BUSINESS", "b/business.htm"],
    ["Company", "COMPANY", "c/company.htm"],
    ["Career", "CAREER", "c/career.htm"],
  ],
  News: [
    ["Announce", "ANNOUNCE", "a/announce.htm"],
    ["Broadcast", "BROADCAST", "b/broadcast.htm"],
    ["Headline", "HEADLINE", "h/headline.htm"],
    ["Journalist", "JOURNALIST", "j/journalist.htm"],
    ["Camera", "CAMERA", "c/camera.htm"],
    ["Interview", "INTERVIEW", "i/interview.htm"],
    ["Public", "PUBLIC", "p/public.htm"],
    ["Secret", "SECRET", "s/secret.htm"],
    ["Rumor", "RUMOR", "r/rumor.htm"],
    ["Update", "UPDATE", "u/update.htm"],
    ["Event", "EVENT", "e/event.htm"],
    ["History", "HISTORY", "h/history.htm"],
    ["Future", "FUTURE", "f/future.htm"],
    ["Past", "PAST", "p/past.htm"],
    ["Today", "TODAY", "t/today.htm"],
  ],
  Narrative: [
    ["Story", "STORY", "s/story.htm"],
    ["Tell", "TELL", "t/tell.htm"],
    ["Listen", "LISTEN", "l/listen.htm"],
    ["Chapter", "CHAPTER", "c/chapter.htm"],
    ["Character", "CHARACTER", "c/character.htm"],
    ["Setting", "SETTING", "s/setting.htm"],
    ["Plot", "PLOT", "p/plot.htm"],
    ["Conflict", "CONFLICT", "c/conflict.htm"],
    ["Resolve", "RESOLVE", "r/resolve.htm"],
    ["Moral", "MORAL", "m/moral.htm"],
    ["Fiction", "FICTION", "f/fiction.htm"],
    ["True", "TRUE", "t/true.htm"],
    ["Once", "ONCE", "o/once.htm"],
    ["Then", "THEN", "t/then.htm"],
    ["Finally", "FINALLY", "f/finally.htm"],
    ["Begin", "BEGIN", "b/begin.htm"],
    ["End", "END", "e/end.htm"],
    ["Summary", "SUMMARY", "s/summary.htm"],
    ["Happen", "HAPPEN", "h/happen.htm"],
    ["Experience", "EXPERIENCE", "e/experience.htm"],
  ],
  Nuance: [
    ["Almost", "ALMOST", "a/almost.htm"],
    ["Kind of", "KIND-OF", "k/kindof.htm"],
    ["Sort of", "SORT-OF", "s/sortof.htm"],
    ["Basically", "BASICALLY", "b/basically.htm"],
    ["Exactly", "EXACTLY", "e/exactly.htm"],
    ["Roughly", "ROUGHLY", "r/roughly.htm"],
    ["Subtle", "SUBTLE", "s/subtle.htm"],
    ["Direct", "DIRECT", "d/direct.htm"],
    ["Indirect", "INDIRECT", "i/indirect.htm"],
    ["Hint", "HINT", "h/hint.htm"],
    ["Joke", "JOKE", "j/joke.htm"],
    ["Sarcasm", "SARCASM", "s/sarcasm.htm"],
    ["Tone", "TONE", "t/tone.htm"],
    ["Style", "STYLE", "s/style.htm"],
    ["Flavor", "FLAVOR", "f/flavor.htm"],
    ["Idiom", "IDIOM", "i/idiom.htm"],
    ["Obvious", "OBVIOUS", "o/obvious.htm"],
    ["Serious", "SERIOUS", "s/serious.htm"],
    ["Clear", "CLEAR", "c/clear.htm"],
    ["Complicated", "COMPLICATED", "c/complicated.htm"],
  ],
  Register: [
    ["Polite", "POLITE", "p/polite.htm"],
    ["Rude", "RUDE", "r/rude.htm"],
    ["Formal", "FORMAL", "f/formal.htm"],
    ["Casual", "CASUAL", "c/casual.htm"],
    ["Respect", "RESPECT", "r/respect.htm"],
    ["Honor", "HONOR", "h/honor.htm"],
    ["Title", "TITLE", "t/title.htm"],
    ["Name", "NAME", "n/name.htm"],
    ["Sign name", "SIGN-NAME", "s/signname.htm"],
    ["Deaf", "DEAF", "d/deaf.htm"],
    ["Hearing", "HEARING", "h/hearing.htm"],
    ["Interpreter", "INTERPRETER", "i/interpreter.htm"],
    ["Translate", "TRANSLATE", "t/translate.htm"],
    ["Language", "LANGUAGE", "l/language.htm"],
    ["Culture", "CULTURE", "c/culture.htm"],
    ["Community", "COMMUNITY", "c/community.htm"],
    ["Audience", "AUDIENCE", "a/audience.htm"],
    ["Influence", "INFLUENCE", "i/influence.htm"],
    ["Experience", "EXPERIENCE", "e/experience.htm"],
    ["Skill", "SKILL", "s/skill.htm"],
    ["Register", "REGISTER", "r/register.htm"],
    ["Interpret", "INTERPRET", "i/interpret.htm"],
    ["Formality", "FORMALITY", "f/formality.htm"],
  ],
};

/** Core path units that are not category-backed get a filmed sign set. */
export const CORE_UNIT_SIGNS = {
  foundations: [
    ["Book", "BOOK"],
    ["Store", "STORE"],
    ["Go", "GO"],
    ["Hello", "HELLO"],
    ["Thank you", "THANK-YOU"],
    ["Please", "PLEASE"],
    ["Sorry", "SORRY"],
    ["Yes", "YES"],
    ["No", "NO"],
    ["Name", "NAME"],
    ["I", "I"],
    ["You", "YOU"],
    ["What", "WHAT"],
    ["Where", "WHERE"],
    ["Who", "WHO"],
    ["When", "WHEN"],
    ["Why", "WHY"],
    ["How", "HOW"],
    ["Today", "TODAY"],
    ["Tomorrow", "TOMORROW"],
    ["Yesterday", "YESTERDAY"],
    ["Want", "WANT"],
    ["Have", "HAVE"],
    ["Like", "LIKE"],
    ["Need", "NEED"],
    ["Know", "KNOW"],
    ["Don't know", "DON'T-KNOW"],
    ["Understand", "UNDERSTAND"],
    ["Learn", "LEARN"],
    ["Teach", "TEACH"],
  ],
  words: [
    ["Hello", "HELLO"],
    ["Goodbye", "GOODBYE"],
    ["Thank you", "THANK-YOU"],
    ["Please", "PLEASE"],
    ["Sorry", "SORRY"],
    ["Excuse me", "EXCUSE-ME"],
    ["Fine", "FINE"],
    ["Nice", "NICE"],
    ["I love you", "I-LOVE-YOU"],
    ["Welcome", "WELCOME"],
    ["Yes", "YES"],
    ["No", "NO"],
    ["I", "I"],
    ["You", "YOU"],
    ["We", "WE"],
    ["They", "THEY"],
    ["My", "MY"],
    ["Your", "YOUR"],
    ["Happy", "HAPPY"],
    ["Sad", "SAD"],
    ["Angry", "ANGRY"],
    ["Tired", "TIRED"],
    ["Love", "LOVE"],
    ["Scared", "SCARED"],
    ["Excited", "EXCITED"],
    ["Now", "NOW"],
    ["Today", "TODAY"],
    ["Tomorrow", "TOMORROW"],
    ["Yesterday", "YESTERDAY"],
    ["Who", "WHO"],
    ["What", "WHAT"],
    ["Where", "WHERE"],
    ["When", "WHEN"],
    ["Why", "WHY"],
    ["How", "HOW"],
  ],
  grammar: [
    ["If", "IF"],
    ["Because", "BECAUSE"],
    ["Why", "WHY"],
    ["Question", "QUESTION"],
    ["Yes", "YES"],
    ["No", "NO"],
    ["Can", "CAN"],
    ["Can't", "CAN'T"],
    ["Must", "MUST"],
    ["Should", "SHOULD"],
    ["Will", "WILL"],
    ["Finish", "FINISH"],
    ["Not", "NOT"],
    ["Nothing", "NOTHING"],
    ["Something", "SOMETHING"],
    ["Happen", "HAPPEN"],
    ["Before", "BEFORE"],
    ["After", "AFTER"],
    ["During", "DURING"],
    ["While", "WHILE"],
    ["Then", "THEN"],
    ["So", "SO"],
    ["But", "BUT"],
    ["Or", "OR"],
    ["And", "AND"],
    ["For", "FOR"],
    ["With", "WITH"],
    ["Without", "WITHOUT"],
  ],
  space: [
    ["Index", "IX"],
    ["Point", "POINT"],
    ["Left", "LEFT"],
    ["Right", "RIGHT"],
    ["Here", "HERE"],
    ["There", "THERE"],
    ["Near", "NEAR"],
    ["Far", "FAR"],
    ["Give", "GIVE"],
    ["Help", "HELP"],
    ["Show", "SHOW"],
    ["Look", "LOOK"],
    ["See", "SEE"],
    ["Come", "COME"],
    ["Go", "GO"],
    ["Bring", "BRING"],
    ["Take", "TAKE"],
    ["Put", "PUT"],
    ["Move", "MOVE"],
    ["Stay", "STAY"],
    ["Sit", "SIT"],
    ["Stand", "STAND"],
    ["Meet", "MEET"],
    ["Same", "SAME"],
    ["Different", "DIFFERENT"],
    ["Next to", "NEXT-TO"],
    ["On", "ON"],
    ["Under", "UNDER"],
    ["In", "IN"],
    ["Out", "OUT"],
  ],
};

/** Create sign rows for missing extras in the given categories. */
export function materializeExtras(signFn, categories, existingGlosses = []) {
  const have = new Set([...(existingGlosses || [])].map(glossKey));
  const rows = [];
  for (const category of categories) {
    for (const entry of EXTRA_BY_CATEGORY[category] || []) {
      const [term, gloss, page = "", film = ""] = entry;
      const key = glossKey(gloss);
      if (!key || have.has(key)) continue;
      have.add(key);
      const path =
        page ||
        `${key.charAt(0).toLowerCase()}/${key.toLowerCase().replace(/[^a-z0-9]+/g, "")}.htm`;
      rows.push(
        signFn(
          term,
          key,
          category,
          "None required.",
          "Follow the filmed model for the citation form used in class.",
          "Citation form from the film.",
          path,
          film || undefined,
        ),
      );
    }
  }
  return rows;
}

/** Ensure CORE_UNIT_SIGNS glosses exist somewhere in vocab. */
export function materializeCoreGaps(signFn, existingGlosses = []) {
  const have = new Set([...(existingGlosses || [])].map(glossKey));
  const rows = [];
  for (const list of Object.values(CORE_UNIT_SIGNS)) {
    if (!list) continue;
    for (const [term, gloss] of list) {
      const key = glossKey(gloss);
      if (!key || have.has(key)) continue;
      have.add(key);
      const path = `${key.charAt(0).toLowerCase()}/${key.toLowerCase().replace(/[^a-z0-9]+/g, "")}.htm`;
      rows.push(
        signFn(
          term,
          key,
          "Foundations",
          "None required.",
          "Follow the filmed model for the citation form used in class.",
          "Citation form from the film.",
          path,
        ),
      );
    }
  }
  return rows;
}

export const UNIT_CATEGORY = {
  family: "Family",
  colors: "Colors",
  food: "Food",
  school: "School",
  jobs: "Jobs",
  home: "Home",
  clothes: "Clothes",
  animals: "Animals",
  weather: "Weather",
  numbers: "Numbers",
  body: "Body",
  health: "Health",
  travel: "Travel",
  money: "Money",
  nature: "Nature",
  sports: "Sports",
  places: "Places",
  discourse: "Discourse",
  depict: "Depict",
  classifiers: "Classifiers",
  ideas: "Ideas",
  intensity: "Intensity",
  opinion: "Opinion",
  debate: "Debate",
  professional: "Professional",
  news: "News",
  narrative: "Narrative",
  nuance: "Nuance",
  register: "Register",
};

function glossKey(gloss) {
  return String(gloss || "").trim().toUpperCase();
}

/** Build padded category lists from existing vocab + extras (deduped by gloss). */
export function padCategoryVocab(existingByCategory) {
  const out = {};
  for (const [category, extras] of Object.entries(EXTRA_BY_CATEGORY)) {
    const have = new Map();
    for (const row of existingByCategory[category] || []) {
      have.set(glossKey(row.gloss), row);
    }
    for (const [term, gloss, page, film] of extras) {
      const key = glossKey(gloss);
      if (have.has(key)) continue;
      have.set(key, { term, gloss: key, category, page: page || "", film: film || "" });
    }
    out[category] = [...have.values()];
  }
  for (const [category, rows] of Object.entries(existingByCategory)) {
    if (!out[category]) out[category] = [...rows];
  }
  return out;
}

function uniqueSigns(rows) {
  const seen = new Set();
  const list = [];
  for (const row of rows) {
    const gloss = glossKey(row.gloss || row[1]);
    const term = row.term || row[0] || gloss;
    if (!gloss || seen.has(gloss)) continue;
    seen.add(gloss);
    list.push({ term, gloss });
  }
  return list;
}

/**
 * One filmed intro lesson: match batches + one watch-and-choose per term.
 * factories: { lesson, choice, match }
 */
export function buildFilmLesson(id, title, tip, signs, factories) {
  const { lesson, choice, match } = factories;
  const all = uniqueSigns(signs);
  const list = all.length <= 35 ? all : all.slice(0, 35);
  const exercises = [];
  const pool = list.map((s) => s.gloss);

  for (let i = 0; i < list.length; i += 5) {
    const batch = list.slice(i, i + 5);
    if (batch.length < 2) continue;
    exercises.push(
      match(
        "Match each English word with its ASL gloss.",
        batch.map((s) => [s.term, s.gloss]),
        { modelGloss: batch[0].gloss, modelTerm: batch[0].term },
      ),
    );
  }

  for (const sign of list) {
    const distractors = pool.filter((g) => g !== sign.gloss).slice(0, 3);
    while (distractors.length < 3) {
      const filler = ["BOOK", "GO", "HAVE", "WANT", "LIKE"].find((g) => g !== sign.gloss && !distractors.includes(g));
      if (!filler) break;
      distractors.push(filler);
    }
    exercises.push(
      choice(
        "Watch the film, then choose the matching gloss.",
        [sign.gloss, ...distractors],
        sign.gloss,
        `${sign.gloss} is the classroom gloss for ${sign.term}.`,
        {
          modelGloss: sign.gloss,
          modelTerm: sign.term,
          // Identify from film: show unlabeled video on the question, do not spoil the answer.
          quizFromFilm: true,
        },
      ),
    );
  }

  return lesson(id, title, tip, exercises);
}

/** Append a film lesson to each unit (new ids only). */
export function withFilmLessons(units, vocabRows, factories) {
  const byCategory = {};
  for (const row of vocabRows) {
    const cat = row.category || "Signs";
    (byCategory[cat] ||= []).push(row);
  }

  return units.map((unit) => {
    const filmId = `${unit.id}-film`;
    if ((unit.lessons || []).some((lesson) => lesson.id === filmId)) return unit;

    let signs = [];
    if (CORE_UNIT_SIGNS[unit.id]) {
      signs = CORE_UNIT_SIGNS[unit.id].map(([term, gloss]) => ({ term, gloss }));
    } else {
      const category = UNIT_CATEGORY[unit.id];
      signs = byCategory[category] || [];
      for (const [term, gloss] of EXTRA_BY_CATEGORY[category] || []) {
        signs.push({ term, gloss });
      }
    }

    signs = uniqueSigns(signs);
    if (signs.length < MIN_UNIT_TERMS && CORE_UNIT_SIGNS.foundations) {
      // Top up from foundations pool without changing category teaching focus.
      const filler = CORE_UNIT_SIGNS.foundations.map(([term, gloss]) => ({ term, gloss }));
      signs = uniqueSigns([...signs, ...filler]);
    }
    if (signs.length < 2) return unit;

    const film = buildFilmLesson(
      filmId,
      `${unit.title} on film`,
      `Match English to gloss, then identify each sign from its film without the label shown.`,
      signs,
      factories,
    );

    return {
      ...unit,
      lessons: [film, ...(unit.lessons || [])],
    };
  });
}
