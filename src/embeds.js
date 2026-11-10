/**
 * Curated in-page embeds discovered from public ASL sources.
 * Accuracy first: only films whose title/path matches the gloss.
 * Do not invent ids. Blocked YouTube id PTZ4GpSTLkM stays blocked in video.js.
 */

import { normalizeEmbed, preferReliableEmbed } from "./video.js";

/** @type {Record<string, { provider: string, id?: string, src?: string, source?: string }>} */
export const EMBED_BY_GLOSS = {
  "GRAY": {
    "provider": "youtube",
    "id": "jvq-s7ZhhUE",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "GRAPE": {
    "provider": "youtube",
    "id": "NZ68mfHiZa8",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "HEAD": {
    "provider": "youtube",
    "id": "9HK6J9Hbt8o",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "P-A-R-K": {
    "provider": "youtube",
    "id": "jVvRN6qR6Ww",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "POINT": {
    "provider": "youtube",
    "id": "rB5jmbR8kGs",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "ACT": {
    "provider": "youtube",
    "id": "ZaxcUQkJ2a4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DESCRIBE": {
    "provider": "youtube",
    "id": "DX0BM9zZrEg",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "CHARACTER": {
    "provider": "youtube",
    "id": "NkjPhszaj1M",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "HAPPEN": {
    "provider": "youtube",
    "id": "FsM-D-NCNdc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "IDEA": {
    "provider": "youtube",
    "id": "mM752iAos2w",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "THINK": {
    "provider": "youtube",
    "id": "NdTKb3Kig88",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "THEORY": {
    "provider": "youtube",
    "id": "4m5MuYO0ppg",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "MEAN": {
    "provider": "youtube",
    "id": "moMl2Po7R1o",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "PROUD": {
    "provider": "youtube",
    "id": "v74BSmAB5Uk",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "NERVOUS": {
    "provider": "youtube",
    "id": "FH4vSmX7SfU",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "EMBARRASSED": {
    "provider": "youtube",
    "id": "k8D2AzVJlVI",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "FRUSTRATED": {
    "provider": "youtube",
    "id": "VMa7HT0xoXo",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "BORED": {
    "provider": "youtube",
    "id": "6_5BxE7yBEo",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DISAPPOINT": {
    "provider": "youtube",
    "id": "JIJgW88jfVg",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "SURPRISE": {
    "provider": "youtube",
    "id": "yI9TVB-bw-s",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "ANXIOUS": {
    "provider": "youtube",
    "id": "HCUx0LzZeTQ",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "JEALOUS": {
    "provider": "youtube",
    "id": "Kniz_YHJxp4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "CURIOUS": {
    "provider": "youtube",
    "id": "8bSKteXE0ds",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "HOPE": {
    "provider": "youtube",
    "id": "aOyZk0caisk",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "PATIENCE": {
    "provider": "youtube",
    "id": "DAmZuOt9FnY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "SERIOUS": {
    "provider": "youtube",
    "id": "ynO66DC858s",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "OPINION": {
    "provider": "youtube",
    "id": "Q7fu5OmLAsw",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "AGREE": {
    "provider": "youtube",
    "id": "mfgzZNvZo9w",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DISAGREE": {
    "provider": "youtube",
    "id": "_sQbTlIJZuc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "BELIEVE": {
    "provider": "youtube",
    "id": "XVEPT0LvK7Y",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "EXAMPLE": {
    "provider": "youtube",
    "id": "DnIb38DHk30",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "COMPARE": {
    "provider": "youtube",
    "id": "4OqSADr7ZtY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "IMPORTANT": {
    "provider": "youtube",
    "id": "2NEoRZDobDs",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "POSSIBLE": {
    "provider": "youtube",
    "id": "kPjFRjpaTm4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "IMPOSSIBLE": {
    "provider": "youtube",
    "id": "Qau2mlInMlA",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "ARGUE": {
    "provider": "youtube",
    "id": "8Z3hSIy8rv0",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DISCUSS": {
    "provider": "youtube",
    "id": "C14Fp4_CWOY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "SUGGEST": {
    "provider": "youtube",
    "id": "eYHJPyjnrF4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "ACCEPT": {
    "provider": "youtube",
    "id": "pHBb2dnUoEY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "REJECT": {
    "provider": "youtube",
    "id": "NRQTQZk7QQY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "COMPROMISE": {
    "provider": "youtube",
    "id": "iDBgJS7x0x8",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "NEGOTIATE": {
    "provider": "youtube",
    "id": "SbWQ4Kullt0",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DECIDE": {
    "provider": "youtube",
    "id": "yTG3xGGdp34",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "MEETING": {
    "provider": "youtube",
    "id": "eE54fUNJYj4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "EMAIL": {
    "provider": "youtube",
    "id": "QPKfFDenOPg",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "PROJECT": {
    "provider": "youtube",
    "id": "owElWnIFa8g",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "DEADLINE": {
    "provider": "youtube",
    "id": "bYZGYNudDlk",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "COMPANY": {
    "provider": "youtube",
    "id": "HhFub08UPjM",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "INTERVIEW": {
    "provider": "youtube",
    "id": "TbzxFG60_fo",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "TEAM": {
    "provider": "youtube",
    "id": "5gTq_ttM6Qo",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "CLIENT": {
    "provider": "youtube",
    "id": "TexlaPhXLps",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "PLAN": {
    "provider": "youtube",
    "id": "GgrbUMCbHKQ",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "GOAL": {
    "provider": "youtube",
    "id": "8t9-34ZHDAE",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "SUCCESS": {
    "provider": "youtube",
    "id": "SrzPozIawec",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "FAIL": {
    "provider": "youtube",
    "id": "9ot5XLpjI3A",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "NEWS": {
    "provider": "youtube",
    "id": "8n5bVu0U2-k",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "NEWSPAPER": {
    "provider": "youtube",
    "id": "GdZpOlYWKnM",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "VOTE": {
    "provider": "youtube",
    "id": "4jJq0AU7oXM",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "LAW": {
    "provider": "youtube",
    "id": "OZy1ugYqyyc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "INFORMATION": {
    "provider": "youtube",
    "id": "YA7ivlU-N2A",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "LIE": {
    "provider": "youtube",
    "id": "G9p7iePeqpE",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "END": {
    "provider": "youtube",
    "id": "SiRvPUToJvw",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "UNDERSTAND": {
    "provider": "youtube",
    "id": "5N10dIavSYc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "MISUNDERSTAND": {
    "provider": "youtube",
    "id": "mFVyXLUcnEw",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "FORGET": {
    "provider": "youtube",
    "id": "1vXrp5awuHc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "IDIOM": {
    "provider": "youtube",
    "id": "oTI91eigNSo",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "FORMAL": {
    "provider": "youtube",
    "id": "ZRvT5EAkKkE",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "CASUAL": {
    "provider": "youtube",
    "id": "JaDJ2pg8aJc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "REGISTER": {
    "provider": "youtube",
    "id": "GlNPrxYeGKM",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "CULTURE": {
    "provider": "youtube",
    "id": "AwKzqXd1isc",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "COMMUNITY": {
    "provider": "youtube",
    "id": "hkLqlMTF9n4",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "INTERPRET": {
    "provider": "youtube",
    "id": "uhygNx8qHyY",
    "source": "YouTube · ASL University (Lifeprint)"
  },
  "AUDIENCE": {
    "provider": "youtube",
    "id": "xJgSeKFtLQA",
    "source": "YouTube · ASL University (Lifeprint)"
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
    // Prefer SignASL / direct files over YouTube so filmed models play when YouTube iframes stall.
    const video = preferReliableEmbed(fromField, fromMap, fromYoutube);
    if (!video) return sign;
    const next = { ...sign, video };
    if (video.provider === "youtube" && video.id && !next.youtubeId) next.youtubeId = video.id;
    return next;
  });
}
