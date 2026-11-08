/** Resolve and normalize in-page sign / lesson film embeds. */

const BLOCKED_YOUTUBE_IDS = new Set(["PTZ4GpSTLkM"]);

const PROVIDER_LABEL = {
  youtube: "YouTube · ASL University (Lifeprint)",
  vimeo: "Vimeo",
  file: "Hosted film",
  signasl: "SignASL",
};

export function providerLabel(embed) {
  if (!embed?.provider) return "";
  if (embed.source) return embed.source;
  if ((embed.provider === "file" || embed.provider === "signasl") && embed.src) {
    try {
      const host = new URL(embed.src).hostname.replace(/^www\./, "");
      if (host === "lifeprint.com") return "Lifeprint / ASL University";
      if (host.endsWith("rochester.edu")) return "Rochester LSF–ASL project";
      if (host === "upload.wikimedia.org" || host === "commons.wikimedia.org") return "Wikimedia Commons";
      if (host === "media.signbsl.com" || host === "signasl.org" || host === "signbsl.com") return "SignASL";
    } catch {
      /* fall through */
    }
  }
  return PROVIDER_LABEL[embed.provider] || embed.provider;
}

function youtubeIdFromUrl(value) {
  if (typeof value !== "string" || !value.includes("youtu")) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "youtu.be") return url.pathname.split("/").filter(Boolean)[0] || "";
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (url.pathname.startsWith("/embed/")) return url.pathname.split("/")[2] || "";
      return url.searchParams.get("v") || "";
    }
  } catch {
    return "";
  }
  return "";
}

function vimeoIdFromUrl(value) {
  if (typeof value !== "string" || !/vimeo\.com/i.test(value)) return "";
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "player.vimeo.com" && url.pathname.startsWith("/video/")) {
      return url.pathname.split("/")[2] || "";
    }
    if (host === "vimeo.com") {
      const parts = url.pathname.split("/").filter(Boolean);
      const numeric = parts.find((part) => /^\d{6,}$/.test(part));
      return numeric || "";
    }
  } catch {
    return "";
  }
  return "";
}

export function normalizeYoutubeId(value) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  const id = youtubeIdFromUrl(trimmed) || (/^[A-Za-z0-9_-]{6,}$/.test(trimmed) ? trimmed : "");
  if (!id || BLOCKED_YOUTUBE_IDS.has(id)) return "";
  return id;
}

function isDirectVideoUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    if (!/^https?:$/i.test(url.protocol)) return false;
    return /\.(mp4|webm|ogv|ogg|m4v)(?:$|\?)/i.test(url.pathname);
  } catch {
    return false;
  }
}

function isSignaslSrc(value) {
  if (typeof value !== "string") return false;
  try {
    const host = new URL(value).hostname.replace(/^www\./, "");
    return host === "media.signbsl.com" || host === "signasl.org" || host === "signbsl.com";
  } catch {
    return false;
  }
}

/** Normalize a video field, URL, or legacy id into { provider, id?, src?, source? }. */
export function normalizeEmbed(value) {
  if (!value) return null;

  if (typeof value === "object" && !Array.isArray(value)) {
    const provider = String(value.provider || "").toLowerCase();
    if (provider === "youtube") {
      const id = normalizeYoutubeId(value.id || value.youtubeId || value.src || "");
      if (!id) return null;
      return { provider: "youtube", id, source: value.source || PROVIDER_LABEL.youtube };
    }
    if (provider === "vimeo") {
      const id = String(value.id || vimeoIdFromUrl(value.src || "") || "").replace(/\D/g, "");
      if (!id) return null;
      return { provider: "vimeo", id, source: value.source || PROVIDER_LABEL.vimeo };
    }
    if (provider === "file" || provider === "mp4" || provider === "direct" || provider === "signasl") {
      const src = typeof value.src === "string" ? value.src.trim() : "";
      if (!isDirectVideoUrl(src)) return null;
      const resolved =
        provider === "signasl" || isSignaslSrc(src) ? "signasl" : "file";
      return {
        provider: resolved,
        src,
        source: value.source || providerLabel({ provider: resolved, src }),
      };
    }
    if (value.src && isDirectVideoUrl(value.src)) {
      const inferred = isSignaslSrc(value.src) ? "signasl" : "file";
      return normalizeEmbed({ provider: inferred, src: value.src, source: value.source });
    }
    if (value.id || value.youtubeId) {
      return normalizeEmbed({ provider: "youtube", id: value.id || value.youtubeId, source: value.source });
    }
    return null;
  }

  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  const yt = normalizeYoutubeId(trimmed);
  if (yt) return { provider: "youtube", id: yt, source: PROVIDER_LABEL.youtube };

  const vimeo = vimeoIdFromUrl(trimmed);
  if (vimeo) return { provider: "vimeo", id: vimeo, source: PROVIDER_LABEL.vimeo };

  if (isDirectVideoUrl(trimmed)) {
    const provider = isSignaslSrc(trimmed) ? "signasl" : "file";
    return { provider, src: trimmed, source: providerLabel({ provider, src: trimmed }) };
  }

  return null;
}

function candidatesFromSign(sign) {
  if (!sign || typeof sign !== "object") return [];
  const list = [];
  if (sign.video) list.push(sign.video);
  if (sign.embed) list.push(sign.embed);
  if (sign.youtubeId) list.push({ provider: "youtube", id: sign.youtubeId });
  if (sign.videoId) list.push(sign.videoId);
  if (sign.youtube) list.push(sign.youtube);
  if (sign.vicarsId) list.push({ provider: "youtube", id: sign.vicarsId });
  if (sign.filmId) list.push(sign.filmId);
  if (sign.vimeoId) list.push({ provider: "vimeo", id: sign.vimeoId });
  if (typeof sign.film === "string") list.push(sign.film);
  if (typeof sign.href === "string" && (sign.href.includes("youtu") || sign.href.includes("vimeo"))) {
    list.push(sign.href);
  }
  return list;
}

/** Pick the first usable embed for a dictionary / topic sign. */
export function resolveSignVideo(sign) {
  for (const candidate of candidatesFromSign(sign)) {
    const embed = normalizeEmbed(candidate);
    if (embed) return embed;
  }
  return null;
}

/** Lesson films are YouTube ids today; still accept a full video object. */
export function resolveLessonVideo(lesson) {
  if (!lesson || typeof lesson !== "object") return null;
  if (lesson.video) return normalizeEmbed(lesson.video);
  return normalizeEmbed({ provider: "youtube", id: lesson.id });
}

export function writtenSourceHref(href) {
  if (typeof href !== "string" || !href) return "";
  try {
    const url = new URL(href);
    const host = url.hostname.replace(/^www\./, "");
    if (host === "lifeprint.com") return href;
  } catch {
    return "";
  }
  return "";
}
