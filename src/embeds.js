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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/gray.mp4",
    "source": "SignASL"
  },
  "GRAPE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslbricks/mp4/grape.mp4",
    "source": "SignASL"
  },
  "HEAD": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/head.mp4",
    "source": "SignASL"
  },
  "P-A-R-K": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/park.mp4",
    "source": "SignASL"
  },
  "POINT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/point.mp4",
    "source": "SignASL"
  },
  "ACT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/act.mp4",
    "source": "SignASL"
  },
  "DESCRIBE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/describe.mp4",
    "source": "SignASL"
  },
  "CHARACTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/character.mp4",
    "source": "SignASL"
  },
  "HAPPEN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/happen.mp4",
    "source": "SignASL"
  },
  "IDEA": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/idea.mp4",
    "source": "SignASL"
  },
  "THINK": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/think.mp4",
    "source": "SignASL"
  },
  "THEORY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/theory.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/embarrass.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/disappoint.mp4",
    "source": "SignASL"
  },
  "SURPRISE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/surprise.mp4",
    "source": "SignASL"
  },
  "ANXIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/anxious.mp4",
    "source": "SignASL"
  },
  "JEALOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/jealous.mp4",
    "source": "SignASL"
  },
  "CURIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/curious.mp4",
    "source": "SignASL"
  },
  "HOPE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/hope.mp4",
    "source": "SignASL"
  },
  "PATIENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/patience.mp4",
    "source": "SignASL"
  },
  "SERIOUS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/serious.mp4",
    "source": "SignASL"
  },
  "OPINION": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/opinion.mp4",
    "source": "SignASL"
  },
  "AGREE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/agree.mp4",
    "source": "SignASL"
  },
  "DISAGREE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/disagree.mp4",
    "source": "SignASL"
  },
  "BELIEVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/believe.mp4",
    "source": "SignASL"
  },
  "EXAMPLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/example.mp4",
    "source": "SignASL"
  },
  "COMPARE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/compare.mp4",
    "source": "SignASL"
  },
  "IMPORTANT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/important.mp4",
    "source": "SignASL"
  },
  "POSSIBLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/possible.mp4",
    "source": "SignASL"
  },
  "IMPOSSIBLE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/impossible.mp4",
    "source": "SignASL"
  },
  "ARGUE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/argue.mp4",
    "source": "SignASL"
  },
  "DISCUSS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/discuss.mp4",
    "source": "SignASL"
  },
  "SUGGEST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/suggest.mp4",
    "source": "SignASL"
  },
  "ACCEPT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/accept.mp4",
    "source": "SignASL"
  },
  "REJECT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/reject.mp4",
    "source": "SignASL"
  },
  "COMPROMISE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/compromise.mp4",
    "source": "SignASL"
  },
  "NEGOTIATE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/negotiate.mp4",
    "source": "SignASL"
  },
  "DECIDE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/decide.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/project.mp4",
    "source": "SignASL"
  },
  "DEADLINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/due.mp4",
    "source": "SignASL"
  },
  "COMPANY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/company.mp4",
    "source": "SignASL"
  },
  "INTERVIEW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/interview.mp4",
    "source": "SignASL"
  },
  "TEAM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/team.mp4",
    "source": "SignASL"
  },
  "CLIENT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/client.mp4",
    "source": "SignASL"
  },
  "PLAN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/plan.mp4",
    "source": "SignASL"
  },
  "GOAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/goal.mp4",
    "source": "SignASL"
  },
  "SUCCESS": {
    "provider": "file",
    "src": "https://www.lifeprint.com/asl101/videos/succeed.mp4",
    "source": "Lifeprint / ASL University"
  },
  "FAIL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/fail.mp4",
    "source": "SignASL"
  },
  "NEWS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/youtube/mp4/8n5bVu0U2-k.mp4",
    "source": "SignASL"
  },
  "NEWSPAPER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/newspaper.mp4",
    "source": "SignASL"
  },
  "VOTE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/vote.mp4",
    "source": "SignASL"
  },
  "LAW": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/law.mp4",
    "source": "SignASL"
  },
  "INFORMATION": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/information.mp4",
    "source": "SignASL"
  },
  "LIE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/lie.mp4",
    "source": "SignASL"
  },
  "END": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/end.mp4",
    "source": "SignASL"
  },
  "UNDERSTAND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/understand.mp4",
    "source": "SignASL"
  },
  "MISUNDERSTAND": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/misunderstood.mp4",
    "source": "SignASL"
  },
  "FORGET": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/mariekatzenbachschool/mp4/forget.mp4",
    "source": "SignASL"
  },
  "IDIOM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/idiom.mp4",
    "source": "SignASL"
  },
  "FORMAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/formal.mp4",
    "source": "SignASL"
  },
  "CASUAL": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/casual.mp4",
    "source": "SignASL"
  },
  "REGISTER": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/register.mp4",
    "source": "SignASL"
  },
  "CULTURE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/culture.mp4",
    "source": "SignASL"
  },
  "COMMUNITY": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/community.mp4",
    "source": "SignASL"
  },
  "INTERPRET": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/interpret.mp4",
    "source": "SignASL"
  },
  "AUDIENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/audience.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/article.mp4",
    "source": "SignASL"
  },
  "ASSUME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/assume.mp4",
    "source": "SignASL"
  },
  "BEGIN": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/signlanguagestudent/mp4/begin.mp4",
    "source": "SignASL"
  },
  "CALM": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/calm.mp4",
    "source": "SignASL"
  },
  "CHEAP": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/cheap.mp4",
    "source": "SignASL"
  },
  "CONCLUDE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/conclude.mp4",
    "source": "SignASL"
  },
  "CONTRAST": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/contrast.mp4",
    "source": "SignASL"
  },
  "EMPHASIS": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/emphasize.mp4",
    "source": "SignASL"
  },
  "EVIDENCE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/evidence.mp4",
    "source": "SignASL"
  },
  "FACT": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/elementalaslconcepts/mp4/fact.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/influence.mp4",
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
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/teeth.mp4",
    "source": "SignASL"
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/cup.mp4",
    "source": "SignASL"
  },
  "FINE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/startasl/mp4/fine.mp4",
    "source": "SignASL"
  },
  "GIVE": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/give.mp4",
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
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/safe.mp4",
    "source": "SignASL"
  },
  "SAME": {
    "provider": "signasl",
    "src": "https://media.signbsl.com/videos/asl/aslsearch/mp4/same.mp4",
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
