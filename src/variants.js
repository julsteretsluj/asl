/**
 * Lesson exercise variants + attempt shuffle.
 * Prefer an explicit `variants: [listA, listB, listC]` on a lesson.
 * Otherwise derive alternate lists from a single exercises array.
 */

const CHOICE_PROMPT_ALTS = [
  [(p) => p, (p) => p],
  [
    [/Which gloss matches [“"](.+?)[”"]\??/i, 'Pick the classroom gloss for “$1.”'],
    [/“(.+?)” glosses as…?/i, 'How do you gloss “$1”?'],
    [/(.+?) is signed at the…/i, 'Where is $1 produced?'],
    [/(.+?) uses…/i, 'What does $1 use?'],
    [/What does (.+?) (ask|tell|mean|add|show|stand)/i, 'In this lesson, $1 — what does it $2?'],
    [/Which (word|tile|letter|sign) /i, 'Pick which $1 '],
    [/Where does (.+?) go/i, 'In the gloss, where do you put $1?'],
    [/Tap the matching pairs\./i, 'Match each idea to its gloss.'],
    [/Match the pairs\./i, 'Connect each English idea to the gloss.'],
  ],
  [
    [/Which gloss matches [“"](.+?)[”"]\??/i, '“$1” is written as…'],
    [/“(.+?)” glosses as…?/i, 'Choose the gloss for “$1.”'],
    [/(.+?) is signed at the…/i, 'The place for $1 is the…'],
    [/(.+?) uses…/i, 'Pick what $1 is built from.'],
    [/What does (.+?) (ask|tell|mean|add|show|stand)/i, 'What is $1 doing when it $2s?'],
    [/Which (word|tile|letter|sign) /i, 'Which $1 fits here? '],
    [/Where does (.+?) go/i, 'Place $1 in the sentence — where?'],
    [/Tap the matching pairs\./i, 'Pair each English cue with its gloss.'],
    [/Match the pairs\./i, 'Find the matching gloss for each line.'],
  ],
];

const BANK_PROMPT_ALTS = [
  (p) => p,
  (p) => {
    if (/^Build /i.test(p)) return p.replace(/^Build /i, "Assemble ");
    if (/^Tap /i.test(p)) return p.replace(/^Tap /i, "Choose in order: ");
    if (/\?$/.test(p) || /[.!]$/.test(p)) return `Gloss this in signs: ${p}`;
    return `Put the signs in order. ${p}`;
  },
  (p) => {
    if (/^Build /i.test(p)) return p.replace(/^Build /i, "Lay out ");
    if (/^Tap /i.test(p)) return p.replace(/^Tap /i, "Order the signs — ");
    if (/\?$/.test(p) || /[.!]$/.test(p)) return `Signs only — gloss: ${p}`;
    return `Tile the gloss. ${p}`;
  },
];

const BLANK_PROMPT_ALTS = [
  (p) => p,
  (p) => {
    if (/^Fill /i.test(p)) return p.replace(/^Fill /i, "Complete ");
    if (/^Mark /i.test(p)) return p.replace(/^Mark /i, "Choose the marker for ");
    if (/^Gloss /i.test(p)) return p.replace(/^Gloss /i, "Write the gloss piece for ");
    return `Fill what is missing. ${p}`;
  },
  (p) => {
    if (/^Fill /i.test(p)) return p.replace(/^Fill /i, "Supply ");
    if (/^Mark /i.test(p)) return p.replace(/^Mark /i, "Pick the tag for ");
    if (/^Gloss /i.test(p)) return p.replace(/^Gloss /i, "Name the gloss for ");
    return `What belongs in the gap? ${p}`;
  },
];

const MATCH_PROMPTS = [
  "Match the pairs.",
  "Link each English idea to its gloss.",
  "Pair each cue with the classroom gloss.",
];

function applyRegexAlts(prompt, rules) {
  let next = prompt;
  for (const [pattern, replacement] of rules) {
    if (pattern.test(next)) {
      next = next.replace(pattern, replacement);
      break;
    }
  }
  if (next === prompt && !/…$/.test(prompt)) {
    next = `${prompt.replace(/\?$/, "")} — pick carefully.`;
  }
  return next;
}

function optionLabels(exercise) {
  if (exercise.type === "choice") {
    return exercise.options.map((option) => (typeof option === "string" ? option : option.label || option.id));
  }
  if (exercise.type === "blank") return [...exercise.options];
  return [];
}

function collectLabels(exercises) {
  const labels = new Set();
  for (const exercise of exercises) {
    for (const label of optionLabels(exercise)) labels.add(label);
    if (exercise.type === "bank") {
      for (const tile of exercise.tiles || []) labels.add(tile);
      for (const tile of exercise.answer || []) labels.add(tile);
    }
    if (exercise.type === "match") {
      for (const pair of exercise.pairs || []) {
        labels.add(pair.a);
        labels.add(pair.b);
      }
    }
  }
  return [...labels];
}

function collectPairs(exercises) {
  const pairs = [];
  const seen = new Set();
  for (const exercise of exercises) {
    if (exercise.type !== "match") continue;
    for (const pair of exercise.pairs || []) {
      const key = `${pair.a}::${pair.b}`;
      if (seen.has(key)) continue;
      seen.add(key);
      pairs.push([pair.a, pair.b]);
    }
  }
  return pairs;
}

function pickDistractors(pool, answer, count, salt) {
  const others = pool.filter((label) => label !== answer);
  if (others.length === 0) return [];
  const rotated = others.map((_, index) => others[(index + salt) % others.length]);
  const unique = [];
  for (const label of rotated) {
    if (unique.includes(label)) continue;
    unique.push(label);
    if (unique.length >= count) break;
  }
  while (unique.length < count && others.length) {
    unique.push(others[unique.length % others.length]);
  }
  return unique.slice(0, count);
}

function choiceOptions(labels) {
  return labels.map((label) => ({ id: label, label }));
}

function rewriteChoice(exercise, salt, pool) {
  const answer = exercise.answer;
  const current = optionLabels(exercise);
  const needed = Math.max(2, current.length - 1);
  const distractors = pickDistractors(
    pool.length > current.length ? pool : current,
    answer,
    needed,
    salt,
  );
  const labels = [answer, ...distractors.filter((label) => label !== answer)].slice(0, current.length || 3);
  while (labels.length < 3) {
    const extra = current.find((label) => !labels.includes(label));
    if (!extra) break;
    labels.push(extra);
  }
  const rules = CHOICE_PROMPT_ALTS[salt] || CHOICE_PROMPT_ALTS[1];
  let prompt =
    typeof rules[0] === "function" ? rules[0](exercise.prompt) : applyRegexAlts(exercise.prompt, rules);
  if (salt > 0 && prompt === exercise.prompt) {
    prompt = salt === 1 ? `Check this again: ${exercise.prompt}` : `Try this angle: ${exercise.prompt}`;
  }
  return {
    type: "choice",
    prompt,
    options: choiceOptions(labels),
    answer,
    explain: exercise.explain,
    ...(exercise.letter ? { letter: exercise.letter } : {}),
  };
}

function rewriteBlank(exercise, salt, pool) {
  const answer = exercise.answer;
  const current = optionLabels(exercise);
  const distractors = pickDistractors(pool.length ? pool : current, answer, Math.max(2, current.length - 1), salt + 1);
  const options = [answer, ...distractors.filter((label) => label !== answer)].slice(0, Math.max(3, current.length));
  for (const label of current) {
    if (options.length >= Math.max(3, current.length)) break;
    if (!options.includes(label)) options.push(label);
  }
  const promptFn = BLANK_PROMPT_ALTS[salt] || BLANK_PROMPT_ALTS[1];
  let prompt = promptFn(exercise.prompt);
  if (salt > 0 && prompt === exercise.prompt) {
    prompt = salt === 1 ? `Gap check: ${exercise.prompt}` : `Missing piece: ${exercise.prompt}`;
  }
  return {
    type: "blank",
    prompt,
    before: exercise.before,
    after: exercise.after,
    options,
    answer,
    explain: exercise.explain,
  };
}

function rewriteBank(exercise, salt, pool) {
  const answer = [...exercise.answer];
  const extras = pickDistractors(
    [...new Set([...(exercise.tiles || []), ...pool])],
    answer[0],
    Math.max(3, (exercise.tiles || []).length - answer.length),
    salt + 2,
  ).filter((tile) => !answer.includes(tile));
  const tiles = [...answer, ...extras].slice(0, Math.max(answer.length + 2, (exercise.tiles || []).length));
  for (const tile of exercise.tiles || []) {
    if (tiles.length >= (exercise.tiles || []).length) break;
    if (!tiles.includes(tile)) tiles.push(tile);
  }
  const promptFn = BANK_PROMPT_ALTS[salt] || BANK_PROMPT_ALTS[1];
  let prompt = promptFn(exercise.prompt);
  if (salt > 0 && prompt === exercise.prompt) {
    prompt = salt === 1 ? `Order the signs: ${exercise.prompt}` : `Sign order: ${exercise.prompt}`;
  }
  return {
    type: "bank",
    prompt,
    tiles,
    answer,
    explain: exercise.explain,
  };
}

function rewriteMatch(exercise, salt, allPairs) {
  const base = (exercise.pairs || []).map((pair) => [pair.a, pair.b]);
  let pairs = base;
  if (allPairs.length > base.length) {
    const start = (salt * 2) % allPairs.length;
    const picked = [];
    for (let step = 0; step < allPairs.length && picked.length < Math.max(4, base.length); step += 1) {
      picked.push(allPairs[(start + step) % allPairs.length]);
    }
    pairs = picked.slice(0, Math.max(4, base.length));
  } else if (salt > 0 && base.length >= 4) {
    // Rotate pairing order and swap which English cues lead — still different surface list.
    const rotated = base.map((_, index) => base[(index + salt) % base.length]);
    pairs = salt === 2 ? rotated.slice().reverse() : rotated;
  }
  return {
    type: "match",
    prompt: MATCH_PROMPTS[salt] || MATCH_PROMPTS[0],
    pairs: pairs.map(([a, b], index) => ({ id: String(index), a, b })),
    explain: exercise.explain || "Each English idea has one gloss.",
  };
}

function rewriteTyped(exercise, salt) {
  const prompts = [
    exercise.prompt,
    exercise.prompt.replace(/^Type /i, "Enter "),
    exercise.prompt.replace(/^Type /i, "Write "),
  ];
  return {
    type: "type",
    prompt: prompts[salt] || prompts[0],
    drillId: exercise.drillId,
    model: exercise.model,
    explain: exercise.explain,
  };
}

function rewriteExercise(exercise, salt, pool, allPairs) {
  if (exercise.type === "choice") return rewriteChoice(exercise, salt, pool);
  if (exercise.type === "blank") return rewriteBlank(exercise, salt, pool);
  if (exercise.type === "bank") return rewriteBank(exercise, salt, pool);
  if (exercise.type === "match") return rewriteMatch(exercise, salt, allPairs);
  if (exercise.type === "type") return rewriteTyped(exercise, salt);
  return exercise;
}

function cloneExercise(exercise) {
  if (exercise.type === "choice") {
    return {
      ...exercise,
      options: exercise.options.map((option) =>
        typeof option === "string" ? { id: option, label: option } : { ...option },
      ),
    };
  }
  if (exercise.type === "blank") return { ...exercise, options: [...exercise.options] };
  if (exercise.type === "bank") return { ...exercise, tiles: [...exercise.tiles], answer: [...exercise.answer] };
  if (exercise.type === "match") {
    return {
      ...exercise,
      pairs: exercise.pairs.map((pair) => ({ ...pair })),
    };
  }
  return { ...exercise };
}

function buildDerivedVariant(exercises, salt) {
  const pool = collectLabels(exercises);
  const allPairs = collectPairs(exercises);
  return exercises.map((exercise) => rewriteExercise(cloneExercise(exercise), salt, pool, allPairs));
}

function isExerciseList(value) {
  return Array.isArray(value) && value.length > 0 && value.every((item) => item && typeof item.type === "string");
}

function isVariantsList(value) {
  return Array.isArray(value) && value.length > 0 && value.every(isExerciseList);
}

/**
 * Normalize a lesson into at least two exercise lists (preferably three).
 * Explicit `variants` or array-of-arrays `exercises` win; otherwise derive.
 */
export function resolveLessonVariants(lesson) {
  if (!lesson || typeof lesson !== "object") return [[], []];

  let lists = null;
  if (isVariantsList(lesson.variants)) {
    lists = lesson.variants.map((list) => list.map(cloneExercise));
  } else if (isVariantsList(lesson.exercises)) {
    lists = lesson.exercises.map((list) => list.map(cloneExercise));
  } else if (isExerciseList(lesson.exercises)) {
    const base = lesson.exercises.map(cloneExercise);
    lists = [base, buildDerivedVariant(base, 1), buildDerivedVariant(base, 2)];
  } else {
    lists = [[], []];
  }

  while (lists.length < 2) {
    const source = lists[0] || [];
    lists.push(buildDerivedVariant(source.map(cloneExercise), lists.length));
  }

  return lists.map((list) => (list.length ? list : lists[0] || []));
}

export function variantCount(lesson) {
  return resolveLessonVariants(lesson).length;
}

export function exercisesForVariant(lesson, variantIndex = 0) {
  const lists = resolveLessonVariants(lesson);
  if (!lists.length) return [];
  const index = ((Number(variantIndex) || 0) % lists.length + lists.length) % lists.length;
  return lists[index];
}

/** Fisher–Yates shuffle — new array, same exercise object references. */
export function shuffleExercises(list) {
  const copy = [...(list || [])];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

export function nextVariantIndex(current, count) {
  const total = Math.max(1, Number(count) || 1);
  const index = Number(current) || 0;
  return (index + 1) % total;
}

/** Prompt fingerprint for “unique enough” checks across variants. */
export function exerciseFingerprint(exercise) {
  if (!exercise) return "";
  if (exercise.type === "choice") {
    return `choice:${exercise.prompt}|${exercise.answer}|${optionLabels(exercise).join(",")}`;
  }
  if (exercise.type === "blank") {
    return `blank:${exercise.prompt}|${exercise.before}|${exercise.after}|${exercise.answer}`;
  }
  if (exercise.type === "bank") {
    return `bank:${exercise.prompt}|${(exercise.answer || []).join(" ")}`;
  }
  if (exercise.type === "match") {
    return `match:${exercise.prompt}|${(exercise.pairs || []).map((pair) => `${pair.a}=${pair.b}`).join(";")}`;
  }
  if (exercise.type === "type") {
    return `type:${exercise.prompt}|${exercise.drillId}|${exercise.model}`;
  }
  return `${exercise.type}:${exercise.prompt}`;
}
