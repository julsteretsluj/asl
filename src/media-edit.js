export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function roundTime(value) {
  return Math.round(value * 10) / 10;
}

export function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00.0";
  const mins = Math.floor(seconds / 60);
  const rest = seconds - mins * 60;
  return `${mins}:${rest.toFixed(1).padStart(4, "0")}`;
}

export function resolveKind(blob, kind) {
  if (blob?.type?.startsWith("image/")) return "image";
  if (blob?.type?.startsWith("video/")) return "video";
  return kind === "image" ? "image" : "video";
}

export function fullCrop(width, height) {
  return { x: 0, y: 0, w: width, h: height };
}

export function normalizeCrop(crop, width, height) {
  const boundsW = Math.max(1, width || 1);
  const boundsH = Math.max(1, height || 1);
  const source = crop || fullCrop(boundsW, boundsH);
  let w = Number(source.w);
  let h = Number(source.h);
  if (!Number.isFinite(w) || w <= 0) w = boundsW;
  if (!Number.isFinite(h) || h <= 0) h = boundsH;
  w = clamp(w, 1, boundsW);
  h = clamp(h, 1, boundsH);
  let x = Number(source.x);
  let y = Number(source.y);
  if (!Number.isFinite(x)) x = 0;
  if (!Number.isFinite(y)) y = 0;
  x = clamp(x, 0, boundsW - w);
  y = clamp(y, 0, boundsH - h);
  return { x, y, w, h };
}

export function moveCrop(base, mode, dx, dy, bounds) {
  const minW = Math.min(bounds.w, Math.max(32, Math.round(bounds.w * 0.12)));
  const minH = Math.min(bounds.h, Math.max(32, Math.round(bounds.h * 0.12)));
  let x = base.x;
  let y = base.y;
  let w = base.w;
  let h = base.h;

  if (mode === "move") {
    x += dx;
    y += dy;
  } else {
    if (mode.includes("w")) {
      const nextW = w - dx;
      if (nextW < minW) {
        x += w - minW;
        w = minW;
      } else {
        x += dx;
        w = nextW;
      }
    }
    if (mode.includes("e")) w += dx;
    if (mode.includes("n")) {
      const nextH = h - dy;
      if (nextH < minH) {
        y += h - minH;
        h = minH;
      } else {
        y += dy;
        h = nextH;
      }
    }
    if (mode.includes("s")) h += dy;
  }

  w = Math.max(minW, w);
  h = Math.max(minH, h);

  if (mode === "move") {
    x = clamp(x, 0, Math.max(0, bounds.w - w));
    y = clamp(y, 0, Math.max(0, bounds.h - h));
  } else {
    if (x < 0) {
      w += x;
      x = 0;
    }
    if (y < 0) {
      h += y;
      y = 0;
    }
    if (x + w > bounds.w) w = bounds.w - x;
    if (y + h > bounds.h) h = bounds.h - y;
    w = Math.max(Math.min(minW, bounds.w), Math.min(w, bounds.w - x));
    h = Math.max(Math.min(minH, bounds.h), Math.min(h, bounds.h - y));
    if (x + w > bounds.w) x = bounds.w - w;
    if (y + h > bounds.h) y = bounds.h - h;
    x = clamp(x, 0, Math.max(0, bounds.w - w));
    y = clamp(y, 0, Math.max(0, bounds.h - h));
  }

  return { x, y, w, h };
}

export function sameFrame(crop, width, height) {
  const frame = normalizeCrop(crop, width, height);
  const edge = Math.max(4, Math.min(width, height) * 0.015);
  return frame.x <= edge && frame.y <= edge && width - (frame.x + frame.w) <= edge && height - (frame.y + frame.h) <= edge;
}

export function videoEditNeeded(meta, selection) {
  const duration = meta.duration || 0;
  const start = selection.start || 0;
  const end = selection.end ?? duration;
  const trimmed = start > 0.12 || duration - end > 0.12;
  const cropped = !sameFrame(selection.crop, meta.width, meta.height);
  return trimmed || cropped;
}

export function contentRect(boxW, boxH, mediaW, mediaH) {
  if (!boxW || !boxH || !mediaW || !mediaH) {
    return { scale: 1, offsetX: 0, offsetY: 0, w: boxW || 0, h: boxH || 0 };
  }
  const scale = Math.min(boxW / mediaW, boxH / mediaH);
  const w = mediaW * scale;
  const h = mediaH * scale;
  return {
    scale,
    offsetX: (boxW - w) / 2,
    offsetY: (boxH - h) / 2,
    w,
    h,
  };
}

function waitEvent(target, eventName) {
  return new Promise((resolve, reject) => {
    const onEvent = (event) => {
      cleanup();
      if (eventName === "error") reject(event.error || new Error("edit failed"));
      else resolve(event);
    };
    const cleanup = () => {
      target.removeEventListener(eventName, onEvent);
    };
    target.addEventListener(eventName, onEvent);
  });
}

export function finiteDuration(video) {
  return new Promise((resolve, reject) => {
    const known = () => Number.isFinite(video.duration) && video.duration > 0 && video.duration < 1e6;
    if (known()) {
      resolve(video.duration);
      return;
    }
    let seekingHome = false;
    const timer = setTimeout(() => {
      cleanup();
      if (known()) resolve(video.duration);
      else reject(new Error("duration"));
    }, 5000);
    const cleanup = () => {
      clearTimeout(timer);
      video.removeEventListener("durationchange", onKnown);
      video.removeEventListener("timeupdate", onUpdate);
      video.removeEventListener("seeked", onSeeked);
    };
    const onKnown = () => {
      if (!known() || seekingHome) return;
      seekingHome = true;
      try {
        video.currentTime = 0;
      } catch {
        cleanup();
        resolve(video.duration);
      }
    };
    const onSeeked = () => {
      if (!seekingHome) return;
      cleanup();
      resolve(known() ? video.duration : 0);
    };
    const onUpdate = () => {
      if (known()) onKnown();
    };
    video.addEventListener("durationchange", onKnown);
    video.addEventListener("timeupdate", onUpdate);
    video.addEventListener("seeked", onSeeked);
    try {
      video.currentTime = 1e101;
    } catch {
      cleanup();
      reject(new Error("duration"));
    }
  });
}

function seek(video, time) {
  return new Promise((resolve) => {
    if (Math.abs(video.currentTime - time) < 0.03) {
      resolve();
      return;
    }
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    video.addEventListener("seeked", onSeeked);
    video.currentTime = Math.max(0, time);
  });
}

function even(value) {
  return Math.max(2, Math.round(value / 2) * 2);
}

function pickRecorder(stream) {
  const types = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
  const mimeType = types.find((type) => {
    try {
      return MediaRecorder.isTypeSupported(type);
    } catch {
      return false;
    }
  });
  // Keep exports lean for Firestore chunk sync (~2.5 MB free-account cap).
  if (mimeType) return new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 900_000 });
  return new MediaRecorder(stream, { videoBitsPerSecond: 900_000 });
}

export async function renderImage(blob, crop) {
  const url = URL.createObjectURL(blob);
  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("open"));
      img.src = url;
    });
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    if (!width || !height) throw new Error("open");
    const frame = normalizeCrop(crop, width, height);
    if (sameFrame(frame, width, height)) return blob;
    const maxEdge = 1920;
    const scale = Math.min(1, maxEdge / Math.max(frame.w, frame.h));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(frame.w * scale));
    canvas.height = Math.max(1, Math.round(frame.h * scale));
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, frame.x, frame.y, frame.w, frame.h, 0, 0, canvas.width, canvas.height);
    const out = await new Promise((resolve, reject) => {
      canvas.toBlob((next) => (next ? resolve(next) : reject(new Error("crop"))), "image/jpeg", 0.82);
    });
    return out;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function renderVideo(video, selection) {
  const width = video.videoWidth;
  const height = video.videoHeight;
  const duration = Number.isFinite(video.duration) && video.duration > 0 && video.duration < 1e6 ? video.duration : selection.end;
  if (!width || !height || !(duration > 0)) throw new Error("open");
  if (typeof MediaRecorder === "undefined" || !HTMLCanvasElement.prototype.captureStream) {
    throw new Error("unsupported");
  }

  const startAt = clamp(selection.start || 0, 0, Math.max(0, duration - 0.1));
  const endAt = clamp(selection.end ?? duration, startAt + 0.1, duration);
  const frame = normalizeCrop(selection.crop, width, height);
  const maxEdge = 960;
  const scale = Math.min(1, maxEdge / Math.max(frame.w, frame.h));
  const canvas = document.createElement("canvas");
  canvas.width = even(frame.w * scale);
  canvas.height = even(frame.h * scale);
  const ctx = canvas.getContext("2d", { alpha: false });
  const draw = () => {
    ctx.drawImage(video, frame.x, frame.y, frame.w, frame.h, 0, 0, canvas.width, canvas.height);
  };

  const previousRate = video.playbackRate;
  video.pause();
  video.playbackRate = 1;
  await seek(video, startAt);
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 280);
    if (video.requestVideoFrameCallback) {
      video.requestVideoFrameCallback(() => {
        clearTimeout(timer);
        resolve();
      });
    } else {
      requestAnimationFrame(() => requestAnimationFrame(() => {
        clearTimeout(timer);
        resolve();
      }));
    }
  });
  draw();

  const stream = canvas.captureStream(30);
  const recorder = pickRecorder(stream);
  const chunks = [];
  recorder.addEventListener("dataavailable", (event) => {
    if (event.data && event.data.size) chunks.push(event.data);
  });
  const stopped = waitEvent(recorder, "stop");
  const failed = waitEvent(recorder, "error");
  recorder.start(100);

  try {
    await video.play();
  } catch (error) {
    if (recorder.state !== "inactive") recorder.stop();
    stream.getTracks().forEach((track) => track.stop());
    video.playbackRate = previousRate;
    throw error;
  }

  await new Promise((resolve) => {
    let settled = false;
    let raf = 0;
    const finish = () => {
      if (settled) return;
      settled = true;
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      video.removeEventListener("ended", finish);
      resolve();
    };
    const tick = () => {
      draw();
      if (video.ended || video.currentTime >= endAt - 0.02) {
        finish();
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    video.addEventListener("ended", finish);
    raf = requestAnimationFrame(tick);
    const timer = setTimeout(finish, (endAt - startAt) * 1000 + 1500);
  });

  video.pause();
  video.playbackRate = previousRate;
  if (recorder.state === "recording") recorder.stop();
  await Promise.race([
    stopped,
    failed.then((error) => {
      throw error;
    }),
  ]);
  stream.getTracks().forEach((track) => track.stop());
  const out = new Blob(chunks, { type: recorder.mimeType || "video/webm" });
  if (out.size < 80) throw new Error("empty");
  return out;
}
