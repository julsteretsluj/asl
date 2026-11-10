/**
 * Clear task framing for lesson questions.
 * Keeps prompts unambiguous and shows a short “what to do” line in the UI.
 */

const ALREADY_CLEAR =
  /^(choose|pick|select|which|what|where|how|why|when|who|build|assemble|lay out|order|gloss this|gloss the|match|link|pair|tap|type|enter|write|fill|complete|supply|name|mark|check|try|put|signs only|tile|connect|find|place|in this lesson|the place for|pick what|gap check|missing piece|sign order|order the signs|assemble|lay out)/i;

function stripWrapQuotes(value) {
  const trimmed = String(value || "").trim();
  const match = trimmed.match(/^[“"](.+?)[”"]\.?$/);
  return match ? match[1].trim() : trimmed.replace(/[.?!]$/, "").trim();
}

function looksLikeEnglishCue(prompt) {
  const p = String(prompt || "").trim();
  if (!p) return false;
  if (ALREADY_CLEAR.test(p)) return false;
  if (/^[“"].+[”"]\.?$/.test(p)) return true;
  if (/^(Are|Is|Do|Does|Did|Can|Will|Would|Should)\b/.test(p)) return true;
  if (/^[A-Z]/.test(p) && /[.?!]$/.test(p) && !/^[A-Z][A-Z0-9+_-]{0,18}\b(?:\s+is…|\s*…)?$/.test(p)) {
    // Short English sentences / statements used as gloss targets.
    const words = p.replace(/[“”".?!]/g, "").split(/\s+/);
    if (words.length >= 2 && words.length <= 14) return true;
  }
  return false;
}

function formEllipsisPrompt(prompt) {
  const p = String(prompt || "").trim();
  const match = p.match(/^([A-Z][A-Z0-9+_-]*(?:\+\+)?(?:\?)?)\s*(?:is…|…)$/);
  if (!match) return "";
  return `How is ${match[1]} produced? Pick the best description of the form.`;
}

/** Short setup line shown under the prompt. */
export function taskBrief(exercise) {
  if (!exercise || typeof exercise !== "object") return "Answer the question.";
  switch (exercise.type) {
    case "choice":
      if (exercise.quizFromFilm) {
        return "Play the film, then pick the gloss that matches. Tap Check when you are sure.";
      }
      return "Choose one answer. Tap Check when you are sure.";
    case "blank":
      return "Fill the gap: tap the missing gloss piece below.";
    case "bank": {
      const need = Array.isArray(exercise.answer) ? exercise.answer.length : 0;
      if (need > 1) {
        return `Build the gloss: tap ${need} signs in order. Tap a chosen tile to remove it.`;
      }
      return "Build the gloss: tap the signs in order. Tap a chosen tile to remove it.";
    }
    case "match":
      return "Tap one English idea, then tap the matching ASL gloss. Clear every pair.";
    case "type":
      return "Type the ASL gloss in capital letters. Drop English words like THE, A, and IS.";
    default:
      return "Answer the question.";
  }
}

/** Rewrite terse / ambiguous prompts into clear task language. Idempotent. */
export function clarifyPrompt(exercise) {
  if (!exercise || typeof exercise !== "object") return "";
  const type = exercise.type;
  const raw = String(exercise.prompt || "").trim();
  if (!raw) return "";

  const formPrompt = formEllipsisPrompt(raw);
  if (formPrompt) return formPrompt;

  if (type === "match" && /^(Match the pairs|Tap the matching pairs)\.?$/i.test(raw)) {
    return "Match each English idea with its ASL gloss.";
  }

  if (type === "bank" && /^Build\s+[“"'‘]/i.test(raw)) {
    return raw.replace(/^Build\s+/i, "Build the ASL gloss for ");
  }
  if (type === "bank" && /^Tap\s+/i.test(raw) && !/^Tap the (signs|matching)/i.test(raw)) {
    // Already names what to tap — keep the cue, make the job explicit.
    return `Tap the signs in order: ${raw.replace(/^Tap\s+/i, "")}`;
  }

  if (type === "blank") {
    const glossForm = raw.match(/^Gloss the (.+?)\.?$/i);
    if (glossForm) {
      return `Pick the gloss for this form: ${glossForm[1]}.`;
    }
    if (/^Fill the comment\.?$/i.test(raw)) {
      return "Fill the missing gloss in the comment slot.";
    }
    if (/^Time opens the sentence\.?$/i.test(raw)) {
      return "Time comes first. Pick the time gloss that opens this sentence.";
    }
    if (/^Rhetorical setup often marked…?$/i.test(raw)) {
      return "Rhetorical questions often mark WHY. Pick what fills the setup.";
    }
    if (!ALREADY_CLEAR.test(raw) && !/[?]$/.test(raw) && /^[A-Z]/.test(raw) && /[.]$/.test(raw)) {
      return `Complete this gloss. ${raw}`;
    }
  }

  if (type === "type") {
    if (/^Type the conditional gloss\.?$/i.test(raw)) {
      return "Type the full conditional gloss for the sentence in this drill.";
    }
    if (/^Type the rhetorical gloss\.?$/i.test(raw)) {
      return "Type the full rhetorical gloss for the sentence in this drill.";
    }
    if (/^Type /i.test(raw)) return raw;
    return `Type this ASL gloss: ${raw}`;
  }

  if ((type === "choice" || type === "bank") && looksLikeEnglishCue(raw)) {
    const quoted = raw.match(/^[“"](.+?)[”"]\.?$/);
    const cue = quoted ? `“${stripWrapQuotes(quoted[1])}.”` : raw;
    if (type === "bank") {
      if (/^Build the ASL gloss for /i.test(raw)) return raw;
      if (/^Build /i.test(raw) || /^Gloss /i.test(raw) || /^Tap /i.test(raw)) {
        return raw.replace(/^Build\s+/i, "Build the ASL gloss for ");
      }
      return `Build the ASL gloss for ${cue.startsWith("“") ? cue : `this English: ${cue}`}`;
    }
    if (/^(Which|What|Where|How|Choose|Pick|Select)\b/i.test(raw)) return raw;
    return `Choose the ASL gloss for ${cue.startsWith("“") ? cue : `this English: ${cue}`}`;
  }

  if (type === "choice" && / glosses as…?$/i.test(raw)) {
    const inner = raw.replace(/\s*glosses as…?$/i, "").trim();
    return `Choose the ASL gloss for ${inner}.`;
  }

  if (type === "bank" && !ALREADY_CLEAR.test(raw) && !/^Build /i.test(raw)) {
    if (/^[A-Z][A-Z0-9+_-]*(?:\s+[A-Z][A-Z0-9+_-]*){1,8}$/.test(raw)) {
      return `Build this gloss in order: ${raw}`;
    }
  }

  return raw;
}

/** Presentable exercise with clarified prompt + task brief. */
export function presentExercise(exercise) {
  if (!exercise || typeof exercise !== "object") return exercise;
  const prompt = clarifyPrompt(exercise);
  return {
    ...exercise,
    prompt,
    brief: taskBrief({ ...exercise, prompt }),
  };
}

export function stripPromptQuotes(value) {
  return stripWrapQuotes(value);
}
