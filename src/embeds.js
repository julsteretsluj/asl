/**
 * Curated in-page embeds discovered from public ASL sources.
 * Accuracy first: only films whose title/path matches the gloss.
 * Do not invent ids. Blocked YouTube id PTZ4GpSTLkM stays blocked in video.js.
 */

import { normalizeEmbed, preferReliableEmbed } from "./video.js";

/** @type {Record<string, { provider: string, id?: string, src?: string, source?: string }>} */
export const EMBED_BY_GLOSS = {
  "GRAY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/gray.mp4",
    "source": "SignASL"
  },
  "GRAPE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/grape.mp4",
    "source": "SignASL"
  },
  "HEAD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/head.mp4",
    "source": "SignASL"
  },
  "P-A-R-K": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/park.mp4",
    "source": "SignASL"
  },
  "POINT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/point.mp4",
    "source": "SignASL"
  },
  "ACT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/act.mp4",
    "source": "SignASL"
  },
  "DESCRIBE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/describe.mp4",
    "source": "SignASL"
  },
  "CHARACTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/character.mp4",
    "source": "SignASL"
  },
  "HAPPEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/happen.mp4",
    "source": "SignASL"
  },
  "IDEA": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/idea.mp4",
    "source": "SignASL"
  },
  "THINK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/think.mp4",
    "source": "SignASL"
  },
  "THEORY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/theory.mp4",
    "source": "SignASL"
  },
  "MEAN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/mean.mp4",
    "source": "SignASL"
  },
  "PROUD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/proud.mp4",
    "source": "SignASL"
  },
  "NERVOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/nervous.mp4",
    "source": "SignASL"
  },
  "EMBARRASSED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/embarrassed.mp4",
    "source": "SignASL"
  },
  "FRUSTRATED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/frustrated.mp4",
    "source": "SignASL"
  },
  "BORED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bored.mp4",
    "source": "SignASL"
  },
  "DISAPPOINT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/disappointed.mp4",
    "source": "SignASL"
  },
  "SURPRISE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/surprise.mp4",
    "source": "SignASL"
  },
  "ANXIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/anxious.mp4",
    "source": "SignASL"
  },
  "JEALOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/jealous.mp4",
    "source": "SignASL"
  },
  "CURIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/curious.mp4",
    "source": "SignASL"
  },
  "HOPE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/hope.mp4",
    "source": "SignASL"
  },
  "PATIENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/patience.mp4",
    "source": "SignASL"
  },
  "SERIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/serious.mp4",
    "source": "SignASL"
  },
  "OPINION": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/opinion.mp4",
    "source": "SignASL"
  },
  "AGREE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/agree.mp4",
    "source": "SignASL"
  },
  "DISAGREE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/disagree.mp4",
    "source": "SignASL"
  },
  "BELIEVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/believe.mp4",
    "source": "SignASL"
  },
  "EXAMPLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/example.mp4",
    "source": "SignASL"
  },
  "COMPARE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/compare.mp4",
    "source": "SignASL"
  },
  "IMPORTANT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/important.mp4",
    "source": "SignASL"
  },
  "POSSIBLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/possible.mp4",
    "source": "SignASL"
  },
  "IMPOSSIBLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/impossible.mp4",
    "source": "SignASL"
  },
  "ARGUE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/argue.mp4",
    "source": "SignASL"
  },
  "DISCUSS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/discuss.mp4",
    "source": "SignASL"
  },
  "SUGGEST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/suggest.mp4",
    "source": "SignASL"
  },
  "ACCEPT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/accept.mp4",
    "source": "SignASL"
  },
  "REJECT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/reject.mp4",
    "source": "SignASL"
  },
  "COMPROMISE": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/compromise.mp4",
    "source": "Lifeprint / ASL University"
  },
  "NEGOTIATE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/negotiate.mp4",
    "source": "SignASL"
  },
  "DECIDE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/decide.mp4",
    "source": "SignASL"
  },
  "MEETING": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/meeting.mp4",
    "source": "SignASL"
  },
  "EMAIL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/email.mp4",
    "source": "SignASL"
  },
  "PROJECT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/assignment.mp4",
    "source": "SignASL"
  },
  "DEADLINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/deadline.mp4",
    "source": "SignASL"
  },
  "COMPANY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/business.mp4",
    "source": "SignASL"
  },
  "INTERVIEW": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/interview.mp4",
    "source": "Lifeprint / ASL University"
  },
  "TEAM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/team.mp4",
    "source": "SignASL"
  },
  "CLIENT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/client.mp4",
    "source": "SignASL"
  },
  "PLAN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/plan.mp4",
    "source": "SignASL"
  },
  "GOAL": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/goal.mp4",
    "source": "Lifeprint / ASL University"
  },
  "SUCCESS": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/succeed.mp4",
    "source": "Lifeprint / ASL University"
  },
  "FAIL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/fail.mp4",
    "source": "SignASL"
  },
  "NEWS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/8n5bVu0U2-k.mp4",
    "source": "SignASL"
  },
  "NEWSPAPER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/newspaper.mp4",
    "source": "SignASL"
  },
  "VOTE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/vote.mp4",
    "source": "SignASL"
  },
  "LAW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/law.mp4",
    "source": "SignASL"
  },
  "INFORMATION": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/information.mp4",
    "source": "SignASL"
  },
  "LIE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/lie.mp4",
    "source": "SignASL"
  },
  "END": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/end.mp4",
    "source": "Lifeprint / ASL University"
  },
  "UNDERSTAND": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/understand.mp4",
    "source": "Lifeprint / ASL University"
  },
  "MISUNDERSTAND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/misunderstand.mp4",
    "source": "SignASL"
  },
  "FORGET": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/forget.mp4",
    "source": "SignASL"
  },
  "IDIOM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/idiom.mp4",
    "source": "SignASL"
  },
  "FORMAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/formal.mp4",
    "source": "SignASL"
  },
  "CASUAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/casual.mp4",
    "source": "SignASL"
  },
  "REGISTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/register.mp4",
    "source": "SignASL"
  },
  "CULTURE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/culture.mp4",
    "source": "SignASL"
  },
  "COMMUNITY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/community.mp4",
    "source": "SignASL"
  },
  "INTERPRET": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/interpret.mp4",
    "source": "SignASL"
  },
  "AUDIENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/audience.mp4",
    "source": "SignASL"
  },
  "HELLO": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/hello.mp4",
    "source": "Lifeprint / ASL University"
  },
  "SORRY": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/sorry.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "GRANDMOTHER": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/grandmother.webm",
    "source": "Rochester LSF–ASL project"
  },
  "GRANDFATHER": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/grandfather.webm",
    "source": "Rochester LSF–ASL project"
  },
  "SON": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/son.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "RED": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/red.webm",
    "source": "Rochester LSF–ASL project"
  },
  "PURPLE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/violet_purple.webm",
    "source": "Rochester LSF–ASL project"
  },
  "STRAWBERRY": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/strawberry.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "WATERMELON": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/08/watermelon.webm",
    "source": "Rochester LSF–ASL project"
  },
  "HUNGRY": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/hungry.webm",
    "source": "Rochester LSF–ASL project"
  },
  "COFFEE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/coffee.webm",
    "source": "Rochester LSF–ASL project"
  },
  "TEA": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/tea.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "LAWYER": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/lawyer.webm",
    "source": "Rochester LSF–ASL project"
  },
  "ARTIST": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/artist.webm",
    "source": "Rochester LSF–ASL project"
  },
  "TABLE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/table-1.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "TWO": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/two.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "THREE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/three.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "SIX": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/six.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "SEVEN": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/seven.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "EIGHT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/eight.webm",
    "source": "Rochester LSF–ASL project"
  },
  "NINE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/nine.webm",
    "source": "Rochester LSF–ASL project"
  },
  "TEN": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/ten.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "ELEVEN": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/eleven.webm",
    "source": "Rochester LSF–ASL project"
  },
  "TWELVE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/twelve.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "EYE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/eye.webm",
    "source": "Rochester LSF–ASL project"
  },
  "STOMACH": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/stomach.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "FOOT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/foot.webm",
    "source": "Rochester LSF–ASL project"
  },
  "TRAIN": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/train.mp4",
    "source": "Lifeprint / ASL University"
  },
  "DOLLAR": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/dollars.mp4",
    "source": "Lifeprint / ASL University"
  },
  "ROCK": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/rock.webm",
    "source": "Rochester LSF–ASL project"
  },
  "MOON": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/moon.webm",
    "source": "Rochester LSF–ASL project"
  },
  "EARTH": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/Earth.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "HOTEL": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/hotel-ASL.webm",
    "source": "Rochester LSF–ASL project"
  },
  "Z-O-O": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/zoo.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "RESTAURANT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/restaurant.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "SKILL": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/skilled-1.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "CLEAR": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/clear.mp4",
    "source": "Lifeprint / ASL University"
  },
  "ANALYZE": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/analyze.mp4",
    "source": "Lifeprint / ASL University"
  },
  "PROBLEM": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/problem-1.mp4",
    "source": "Lifeprint / ASL University"
  },
  "RESPECT": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/respect.mp4",
    "source": "Lifeprint / ASL University"
  },
  "ROLE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/role.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "COMMENT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/comment.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "DETAIL": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/detail.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "IMAGINE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/imagine.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "STORY": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/story.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "EXPERIENCE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/experience.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "COMPLICATED": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/complicated.webm",
    "source": "Rochester LSF–ASL project"
  },
  "CONCEPT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/concept.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "DEFINITION": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/definition.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "CONFUSE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/to-be-confused-1.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "CAREER": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/career-path.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "PROFESSION": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/occupation_job-2.webm",
    "source": "Rochester LSF–ASL project"
  },
  "RESPONSIBLE": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/responsible.webm",
    "source": "Rochester LSF–ASL project"
  },
  "PRESENT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/present.mp4",
    "source": "Rochester LSF–ASL project"
  },
  "REPORT": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/2015/07/report.webm",
    "source": "Rochester LSF–ASL project"
  },
  "SUMMARY": {
    "provider": "file",
    "src": "https://projects.lib.rochester.edu/lsf-asl/wp-content/uploads/summary.m4v",
    "source": "Rochester LSF–ASL project"
  },
  "ARTICLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/article.mp4",
    "source": "SignASL"
  },
  "ASSUME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/assume.mp4",
    "source": "SignASL"
  },
  "BEGIN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/begin.mp4",
    "source": "SignASL"
  },
  "CALM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/calm.mp4",
    "source": "SignASL"
  },
  "CHEAP": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/cheap.mp4",
    "source": "SignASL"
  },
  "CONCLUDE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/conclusion.mp4",
    "source": "SignASL"
  },
  "CONTRAST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/contrast.mp4",
    "source": "SignASL"
  },
  "EMPHASIS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/emphasize.mp4",
    "source": "SignASL"
  },
  "EVIDENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/evidence.mp4",
    "source": "SignASL"
  },
  "FACT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/true.mp4",
    "source": "SignASL"
  },
  "FALSE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/false.mp4",
    "source": "SignASL"
  },
  "FOCUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslstudy/mp4/391976778.sd.mp4",
    "source": "SignASL"
  },
  "GOVERNMENT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/government.mp4",
    "source": "SignASL"
  },
  "I": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/i.mp4",
    "source": "SignASL"
  },
  "INFLUENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/influence.mp4",
    "source": "SignASL"
  },
  "LEAF": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/leaf.mp4",
    "source": "SignASL"
  },
  "OBVIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/obvious.mp4",
    "source": "SignASL"
  },
  "OFFICE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/office.mp4",
    "source": "SignASL"
  },
  "PERSPECTIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/perspective.mp4",
    "source": "SignASL"
  },
  "PROVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslstudy/mp4/392427959.sd.mp4",
    "source": "SignASL"
  },
  "QUOTE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/quote.mp4",
    "source": "SignASL"
  },
  "REASON": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/reason.mp4",
    "source": "SignASL"
  },
  "REMEMBER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/remember.mp4",
    "source": "SignASL"
  },
  "RESEARCH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/research.mp4",
    "source": "SignASL"
  },
  "SCARED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/scared.mp4",
    "source": "SignASL"
  },
  "SEEM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/seem.mp4",
    "source": "SignASL"
  },
  "SHIFT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/FpqQnjHPf70.mp4",
    "source": "SignASL"
  },
  "SOLVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/solve.mp4",
    "source": "SignASL"
  },
  "STUDY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/study.mp4",
    "source": "SignASL"
  },
  "TEETH": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/teeth.mp4",
    "source": "Lifeprint / ASL University"
  },
  "TOPIC": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/topic.mp4",
    "source": "SignASL"
  },
  "TRANSLATE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/ids/mp4/2013-11-5000-translate-1500k-ase.mp4",
    "source": "SignASL"
  },
  "TRUE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/true.mp4",
    "source": "SignASL"
  },
  "WINDOW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/window.mp4",
    "source": "SignASL"
  },
  "WORRY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/worry.mp4",
    "source": "SignASL"
  },
  "BUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/bus.mp4",
    "source": "SignASL"
  },
  "CANDY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/candy.mp4",
    "source": "SignASL"
  },
  "CUP": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/cup.mp4",
    "source": "SignASL"
  },
  "FINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/fine.mp4",
    "source": "SignASL"
  },
  "GIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/give.mp4",
    "source": "SignASL"
  },
  "GO": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/go.mp4",
    "source": "SignASL"
  },
  "HAVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/have.mp4",
    "source": "SignASL"
  },
  "HELP": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/help.mp4",
    "source": "SignASL"
  },
  "I-LOVE-YOU": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/I%20love%20you.mp4",
    "source": "SignASL"
  },
  "IN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/in.mp4",
    "source": "SignASL"
  },
  "NICE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/nice.mp4",
    "source": "SignASL"
  },
  "NOT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/not.mp4",
    "source": "SignASL"
  },
  "ONION": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/onion.mp4",
    "source": "SignASL"
  },
  "OPEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/open.mp4",
    "source": "SignASL"
  },
  "PARTY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/party.mp4",
    "source": "SignASL"
  },
  "RIGHT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/right.mp4",
    "source": "SignASL"
  },
  "SAFE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/safety.mp4",
    "source": "SignASL"
  },
  "SAME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/same.mp4",
    "source": "SignASL"
  },
  "SEE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsignbank/mp4/SEE-538.mp4",
    "source": "SignASL"
  },
  "SIT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/sit.mp4",
    "source": "SignASL"
  },
  "SUMMER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/summer.mp4",
    "source": "SignASL"
  },
  "UGLY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/ugly.mp4",
    "source": "SignASL"
  },
  "I FINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/YSTnrscx1UY.mp4",
    "source": "SignASL"
  },
  "YOU": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/you.mp4",
    "source": "SignASL"
  },
  "PLEASE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/please.mp4",
    "source": "SignASL"
  },
  "WE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/we.mp4",
    "source": "SignASL"
  },
  "GOODBYE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/goodbye.mp4",
    "source": "SignASL"
  },
  "GOOD MORNING": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/goodmorning.mp4",
    "source": "SignASL"
  },
  "EXCUSE-ME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/excuse-me.mp4",
    "source": "SignASL"
  },
  "THANK-YOU": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/thank-you.mp4",
    "source": "SignASL"
  },
  "LOVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/DAZB0eVf5t0.mp4",
    "source": "SignASL"
  },
  "ANGRY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/IqfyrDn89iY.mp4",
    "source": "SignASL"
  },
  "HAPPY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/happy.mp4",
    "source": "SignASL"
  },
  "NOW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/g2j70neQ_lI.mp4",
    "source": "SignASL"
  },
  "TIRED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/iZ6EeQqzZl0.mp4",
    "source": "SignASL"
  },
  "SAD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/sad.mp4",
    "source": "SignASL"
  },
  "TODAY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/3BxRfKvfnpU.mp4",
    "source": "SignASL"
  },
  "TOMORROW": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/tomorrow.mp4",
    "source": "Lifeprint / ASL University"
  },
  "NIGHT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/hDcREO5I4Ps.mp4",
    "source": "SignASL"
  },
  "YESTERDAY": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/yesterday.mp4",
    "source": "Lifeprint / ASL University"
  },
  "LATER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/later.mp4",
    "source": "SignASL"
  },
  "MORNING": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/morning.mp4",
    "source": "SignASL"
  },
  "EXCITED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/excited.mp4",
    "source": "SignASL"
  },
  "WHO": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/wKl26BsEAoc.mp4",
    "source": "SignASL"
  },
  "WEEK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/week.mp4",
    "source": "SignASL"
  },
  "WHAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/what.mp4",
    "source": "SignASL"
  },
  "WHEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/when.mp4",
    "source": "SignASL"
  },
  "WHERE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/where.mp4",
    "source": "SignASL"
  },
  "WHY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/why.mp4",
    "source": "SignASL"
  },
  "HOW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/how.mp4",
    "source": "SignASL"
  },
  "PARENTS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/jlqHVbCS4H0.mp4",
    "source": "SignASL"
  },
  "BROTHER": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/brother.mp4",
    "source": "Lifeprint / ASL University"
  },
  "FATHER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/father.mp4",
    "source": "SignASL"
  },
  "MOTHER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/mother.mp4",
    "source": "SignASL"
  },
  "SISTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/sister.mp4",
    "source": "SignASL"
  },
  "BABY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/baby.mp4",
    "source": "SignASL"
  },
  "FAMILY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/family.mp4",
    "source": "SignASL"
  },
  "UNCLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/PqtMCA2lu9w.mp4",
    "source": "SignASL"
  },
  "AUNT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/aunt.mp4",
    "source": "SignASL"
  },
  "WIFE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/HRv4XLlwdcc.mp4",
    "source": "SignASL"
  },
  "COUSIN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/cousin.mp4",
    "source": "SignASL"
  },
  "HOW YOU [q]": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/how.mp4",
    "source": "SignASL"
  },
  "DAUGHTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/daughter.mp4",
    "source": "SignASL"
  },
  "BLUE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/rKtYSjkBB84.mp4",
    "source": "SignASL"
  },
  "HUSBAND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/husband.mp4",
    "source": "SignASL"
  },
  "COLOR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/color.mp4",
    "source": "SignASL"
  },
  "YELLOW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/nK4_8-U-Y9I.mp4",
    "source": "SignASL"
  },
  "GREEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/green.mp4",
    "source": "SignASL"
  },
  "PINK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/aNilWTBIl0g.mp4",
    "source": "SignASL"
  },
  "ORANGE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/orange.mp4",
    "source": "SignASL"
  },
  "WHITE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/v8h6mw4zGys.mp4",
    "source": "SignASL"
  },
  "CHERRY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/rMF0qiUG96M.mp4",
    "source": "SignASL"
  },
  "BROWN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/brown.mp4",
    "source": "SignASL"
  },
  "NICE MEET YOU": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/nice.mp4",
    "source": "SignASL"
  },
  "BLACK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/black.mp4",
    "source": "SignASL"
  },
  "WATER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/-SdOfxGhb0A.mp4",
    "source": "SignASL"
  },
  "PEACH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/peach.mp4",
    "source": "SignASL"
  },
  "APPLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/apple.mp4",
    "source": "SignASL"
  },
  "BANANA": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/banana.mp4",
    "source": "SignASL"
  },
  "EAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/eat.mp4",
    "source": "SignASL"
  },
  "FRUIT": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/fruit.mp4",
    "source": "Lifeprint / ASL University"
  },
  "MILK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/milk.mp4",
    "source": "SignASL"
  },
  "MORE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/fVkzBbQ-whs.mp4",
    "source": "SignASL"
  },
  "FOOD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/food.mp4",
    "source": "SignASL"
  },
  "LIKE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/like.mp4",
    "source": "SignASL"
  },
  "BREAD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/bread.mp4",
    "source": "SignASL"
  },
  "EGG": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/egg.mp4",
    "source": "SignASL"
  },
  "WANT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/want.mp4",
    "source": "SignASL"
  },
  "COOKIE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/cookie.mp4",
    "source": "SignASL"
  },
  "STUDENT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/student.mp4",
    "source": "SignASL"
  },
  "SCHOOL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/school.mp4",
    "source": "SignASL"
  },
  "BOOK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/book.mp4",
    "source": "SignASL"
  },
  "PAPER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/paper.mp4",
    "source": "SignASL"
  },
  "WRITE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/write.mp4",
    "source": "SignASL"
  },
  "READ": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/read.mp4",
    "source": "SignASL"
  },
  "TEACHER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/teacher.mp4",
    "source": "SignASL"
  },
  "TEST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/QCuc-PwehGA.mp4",
    "source": "SignASL"
  },
  "CLASS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/class.mp4",
    "source": "SignASL"
  },
  "PENCIL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/pencil.mp4",
    "source": "SignASL"
  },
  "LEARN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/learn.mp4",
    "source": "SignASL"
  },
  "NURSE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/zcT4miFawiw.mp4",
    "source": "SignASL"
  },
  "WORK": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/work.mp4",
    "source": "Lifeprint / ASL University"
  },
  "POLICE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/TyxYhCL1RSA.mp4",
    "source": "SignASL"
  },
  "LIBRARY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/library.mp4",
    "source": "SignASL"
  },
  "COLLEGE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/college.mp4",
    "source": "SignASL"
  },
  "DESK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/desk.mp4",
    "source": "SignASL"
  },
  "COOK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/cook.mp4",
    "source": "SignASL"
  },
  "DOCTOR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/doctor.mp4",
    "source": "SignASL"
  },
  "BOSS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/boss.mp4",
    "source": "SignASL"
  },
  "FARMER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/farm.mp4",
    "source": "SignASL"
  },
  "BED": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bed.mp4",
    "source": "SignASL"
  },
  "HOUSE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/house.mp4",
    "source": "SignASL"
  },
  "HOME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/home.mp4",
    "source": "SignASL"
  },
  "BATHROOM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bathroom.mp4",
    "source": "SignASL"
  },
  "DOOR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/door.mp4",
    "source": "SignASL"
  },
  "KITCHEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/kitchen.mp4",
    "source": "SignASL"
  },
  "SHIRT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/BLqzpaKkkk4.mp4",
    "source": "SignASL"
  },
  "ROOM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/room.mp4",
    "source": "SignASL"
  },
  "DRESS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/B-_Gi1swFQY.mp4",
    "source": "SignASL"
  },
  "CAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/a3b8LAX68Ho.mp4",
    "source": "SignASL"
  },
  "DOG": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/dog.mp4",
    "source": "SignASL"
  },
  "COAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/coat.mp4",
    "source": "SignASL"
  },
  "CHAIR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/chair.mp4",
    "source": "SignASL"
  },
  "HAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/hat.mp4",
    "source": "SignASL"
  },
  "FISH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/fish.mp4",
    "source": "SignASL"
  },
  "PANTS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/pants.mp4",
    "source": "SignASL"
  },
  "RAIN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/utTSQeTEDxk.mp4",
    "source": "SignASL"
  },
  "BIRD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bird.mp4",
    "source": "SignASL"
  },
  "SUN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/sun.mp4",
    "source": "SignASL"
  },
  "WIND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/RA04zvXojYA.mp4",
    "source": "SignASL"
  },
  "HORSE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/horse.mp4",
    "source": "SignASL"
  },
  "SHOES": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/shoes.mp4",
    "source": "SignASL"
  },
  "WEATHER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/AxL3Q6C73fg.mp4",
    "source": "SignASL"
  },
  "COW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/cow.mp4",
    "source": "SignASL"
  },
  "SNOW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/snow.mp4",
    "source": "SignASL"
  },
  "HAIR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/9j2d2WQsriY.mp4",
    "source": "SignASL"
  },
  "COLD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/cold.mp4",
    "source": "SignASL"
  },
  "ONE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/one.mp4",
    "source": "SignASL"
  },
  "HOT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/hot.mp4",
    "source": "SignASL"
  },
  "FIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/five.mp4",
    "source": "SignASL"
  },
  "FOUR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/four.mp4",
    "source": "SignASL"
  },
  "FACE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/8_GCUYb19w0.mp4",
    "source": "SignASL"
  },
  "NOSE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/nose.mp4",
    "source": "SignASL"
  },
  "MOUTH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/mouth.mp4",
    "source": "SignASL"
  },
  "HEADACHE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/hCePLZW65pQ.mp4",
    "source": "SignASL"
  },
  "SICK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/oe9All9w7Ng.mp4",
    "source": "SignASL"
  },
  "HEART": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/heart.mp4",
    "source": "SignASL"
  },
  "EAR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/ear.mp4",
    "source": "SignASL"
  },
  "HAND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/hand.mp4",
    "source": "SignASL"
  },
  "PILL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/2O4cCgMGpXM.mp4",
    "source": "SignASL"
  },
  "VOMIT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/eyu6rDm1uFM.mp4",
    "source": "SignASL"
  },
  "HOSPITAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/hospital.mp4",
    "source": "SignASL"
  },
  "HURT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/hurt.mp4",
    "source": "SignASL"
  },
  "DIZZY": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/dizzy.mp4",
    "source": "Lifeprint / ASL University"
  },
  "BETTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/better.mp4",
    "source": "SignASL"
  },
  "AIRPLANE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/eD5BTz7lR-o.mp4",
    "source": "SignASL"
  },
  "COUGH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/cough.mp4",
    "source": "SignASL"
  },
  "MEDICINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/medicine.mp4",
    "source": "SignASL"
  },
  "BICYCLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bicycle.mp4",
    "source": "SignASL"
  },
  "CAR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/car.mp4",
    "source": "SignASL"
  },
  "BOAT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/aDt-KNA-v04.mp4",
    "source": "SignASL"
  },
  "DRIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/drive.mp4",
    "source": "SignASL"
  },
  "BUY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/wEPDfmy2M8w.mp4",
    "source": "SignASL"
  },
  "WALK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/walk.mp4",
    "source": "SignASL"
  },
  "MOTORCYCLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/motorcycle.mp4",
    "source": "SignASL"
  },
  "COST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/expensive.mp4",
    "source": "SignASL"
  },
  "SUBWAY": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/subway.mp4",
    "source": "Lifeprint / ASL University"
  },
  "STORE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/store.mp4",
    "source": "SignASL"
  },
  "EXPENSIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/expensive.mp4",
    "source": "SignASL"
  },
  "PAY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/pay.mp4",
    "source": "SignASL"
  },
  "CENT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/penny.mp4",
    "source": "SignASL"
  },
  "BROKE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/broke.mp4",
    "source": "SignASL"
  },
  "SELL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/sell.mp4",
    "source": "SignASL"
  },
  "TREE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/tree.mp4",
    "source": "SignASL"
  },
  "RIVER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/NyaG1U8eSOk.mp4",
    "source": "SignASL"
  },
  "MOUNTAIN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/mountain.mp4",
    "source": "SignASL"
  },
  "FLOWER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/flower.mp4",
    "source": "SignASL"
  },
  "PLAY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/wSj0zfdppNc.mp4",
    "source": "SignASL"
  },
  "STAR": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/star.mp4",
    "source": "SignASL"
  },
  "GRASS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/grass.mp4",
    "source": "SignASL"
  },
  "OCEAN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/ocean.mp4",
    "source": "SignASL"
  },
  "BALL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/ball.mp4",
    "source": "SignASL"
  },
  "FOOTBALL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/football.mp4",
    "source": "SignASL"
  },
  "BASKETBALL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/basketball.mp4",
    "source": "SignASL"
  },
  "PLANT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/plant.mp4",
    "source": "SignASL"
  },
  "MONEY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/money.mp4",
    "source": "SignASL"
  },
  "BASEBALL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/baseball.mp4",
    "source": "SignASL"
  },
  "SWIM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/handspeak/mp4/swim.mp4",
    "source": "SignASL"
  },
  "CHURCH": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/d3oSWkxdHNo.mp4",
    "source": "SignASL"
  },
  "DANCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/dance.mp4",
    "source": "SignASL"
  },
  "GAME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/game.mp4",
    "source": "SignASL"
  },
  "SOCCER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/soccer.mp4",
    "source": "SignASL"
  },
  "CITY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/city.mp4",
    "source": "SignASL"
  },
  "BUILDING": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/_UAPcbyeN_I.mp4",
    "source": "SignASL"
  },
  "RUN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/run.mp4",
    "source": "SignASL"
  },
  "MOVIE": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/movie.mp4",
    "source": "Lifeprint / ASL University"
  },
  "B-U-S": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/bus.mp4",
    "source": "SignASL"
  },
  "STREET": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/street.mp4",
    "source": "SignASL"
  },
  "B-A-N-K": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/bank.mp4",
    "source": "SignASL"
  },
  "IX": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/point.mp4",
    "source": "SignASL"
  },
  "PERSUADE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/convince.mp4",
    "source": "SignASL"
  }
};

/** Resolve a curated embed by gloss string (exact key in EMBED_BY_GLOSS). */
export function resolveEmbed(gloss) {
  if (typeof gloss !== "string" || !gloss.trim()) return null;
  const key = gloss.trim();
  const direct = normalizeEmbed(EMBED_BY_GLOSS[key]);
  if (direct) return direct;
  if (key.endsWith("++")) return resolveEmbed(key.slice(0, -2));
  if (key.endsWith("?")) return resolveEmbed(key.slice(0, -1));
  const directed = key.match(/^(?:me|left|right)-([A-Z][A-Z0-9+-]*)-(?:me|left|right)$/i);
  if (directed) return resolveEmbed(directed[1].toUpperCase());
  return null;
}

/** Attach a clear `video` object onto each sign; keep legacy youtubeId when present. */
export function applyEmbeds(list) {
  return list.map((sign) => {
    const fromMap = resolveEmbed(sign.gloss) || normalizeEmbed(EMBED_BY_GLOSS[sign.gloss]);
    const fromField = normalizeEmbed(sign.video);
    const fromYoutube = normalizeEmbed(sign.youtubeId ? { provider: "youtube", id: sign.youtubeId } : null);
    const video = preferReliableEmbed(fromField, fromMap, fromYoutube);
    if (!video) return sign;
    const nextSign = { ...sign, video };
    if (video.provider === "youtube" && video.id && !nextSign.youtubeId) nextSign.youtubeId = video.id;
    return nextSign;
  });
}
