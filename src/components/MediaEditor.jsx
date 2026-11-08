import { useEffect, useId, useRef, useState } from "react";
import {
  clamp,
  contentRect,
  finiteDuration,
  formatTime,
  fullCrop,
  moveCrop,
  renderImage,
  renderVideo,
  resolveKind,
  roundTime,
  videoEditNeeded,
} from "../media-edit.js";
import { Pill } from "./ui.jsx";

const HANDLES = [
  { id: "nw", label: "Top left", className: "left-1 top-1 cursor-nwse-resize" },
  { id: "n", label: "Top", className: "left-1/2 top-1 -translate-x-1/2 cursor-ns-resize" },
  { id: "ne", label: "Top right", className: "right-1 top-1 cursor-nesw-resize" },
  { id: "e", label: "Right", className: "right-1 top-1/2 -translate-y-1/2 cursor-ew-resize" },
  { id: "se", label: "Bottom right", className: "right-1 bottom-1 cursor-nwse-resize" },
  { id: "s", label: "Bottom", className: "left-1/2 bottom-1 -translate-x-1/2 cursor-ns-resize" },
  { id: "sw", label: "Bottom left", className: "left-1 bottom-1 cursor-nesw-resize" },
  { id: "w", label: "Left", className: "left-1 top-1/2 -translate-y-1/2 cursor-ew-resize" },
];

const OPEN_ERROR = "This file couldn’t be opened. Try a different image or video.";
const EDIT_ERROR = "Couldn’t finish that edit. Try again, or cancel.";
const SAVE_ERROR = "Couldn’t save that model.";

export function MediaEditor({ blob, kind = "video", onCancel, onApply }) {
  const resolved = resolveKind(blob, kind);
  const titleId = useId();
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const trackRef = useRef(null);
  const layoutRef = useRef(contentRect(0, 0, 0, 0));
  const applyWrapRef = useRef(null);
  const preparedRef = useRef(null);
  const exportingRef = useRef(false);

  const [objectUrl, setObjectUrl] = useState("");
  const [media, setMedia] = useState(null);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);
  const [crop, setCrop] = useState(null);
  const [failed, setFailed] = useState("");
  const [phase, setPhase] = useState("edit");
  const [working, setWorking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [previewBlob, setPreviewBlob] = useState(null);
  const [box, setBox] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  useEffect(() => {
    const url = URL.createObjectURL(blob);
    preparedRef.current = null;
    setObjectUrl(url);
    setMedia(null);
    setCrop(null);
    setDuration(0);
    setStart(0);
    setEnd(0);
    setFailed("");
    setPhase("edit");
    setPreviewBlob(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
    return () => URL.revokeObjectURL(url);
  }, [blob]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !media) return undefined;
    const measure = () => setBox({ w: stage.clientWidth, h: stage.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [media, phase]);

  useEffect(() => {
    if (phase === "preview") applyWrapRef.current?.querySelector("button")?.focus();
  }, [phase]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const layout = contentRect(box.w, box.h, media?.w || 0, media?.h || 0);
  layoutRef.current = layout;
  const frame = media && crop ? crop : null;

  function pointFromEvent(event) {
    const rect = stageRef.current.getBoundingClientRect();
    const current = layoutRef.current;
    return {
      x: (event.clientX - rect.left - current.offsetX) / current.scale,
      y: (event.clientY - rect.top - current.offsetY) / current.scale,
    };
  }

  function updateCrop(next) {
    setCrop(next);
    setPhase("edit");
    setPreviewBlob(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }

  function beginDrag(event, mode) {
    if (!crop || !media) return;
    event.preventDefault();
    event.stopPropagation();
    const point = pointFromEvent(event);
    const snapshot = { mode, x: point.x, y: point.y, crop: { ...crop }, media };
    const move = (ev) => {
      const current = pointFromEvent(ev);
      updateCrop(moveCrop(snapshot.crop, snapshot.mode, current.x - snapshot.x, current.y - snapshot.y, snapshot.media));
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function nudgeCrop(event) {
    if (!crop || !media) return;
    const step = event.shiftKey ? 16 : 4;
    let dx = 0;
    let dy = 0;
    if (event.key === "ArrowLeft") dx = -step;
    else if (event.key === "ArrowRight") dx = step;
    else if (event.key === "ArrowUp") dy = -step;
    else if (event.key === "ArrowDown") dy = step;
    else return;
    event.preventDefault();
    const mode = event.altKey ? "se" : "move";
    updateCrop(moveCrop(crop, mode, mode === "se" ? dx : dx, mode === "se" ? dy : dy, media));
  }

  function changeStart(value) {
    const next = clamp(roundTime(value), 0, Math.max(0, end - 0.1));
    setStart(next);
    setPhase("edit");
    clearPreview();
    const video = videoRef.current;
    if (video && Math.abs(video.currentTime - next) > 0.05) video.currentTime = next;
  }

  function changeEnd(value) {
    const next = clamp(roundTime(value), start + 0.1, duration || value);
    setEnd(next);
    setPhase("edit");
    clearPreview();
  }

  function clearPreview() {
    setPreviewBlob(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return "";
    });
  }

  async function onVideoReady(event) {
    const video = event.currentTarget;
    if (!blob || preparedRef.current === blob) return;
    preparedRef.current = blob;
    try {
      const length = await finiteDuration(video);
      if (!video.videoWidth || !video.videoHeight || !(length > 0)) {
        setFailed(OPEN_ERROR);
        return;
      }
      setMedia({ w: video.videoWidth, h: video.videoHeight });
      setDuration(length);
      setStart(0);
      setEnd(Math.min(length, roundTime(length) || length));
      setCrop(fullCrop(video.videoWidth, video.videoHeight));
      if (Math.abs(video.currentTime) > 0.05) video.currentTime = 0;
    } catch {
      setFailed(OPEN_ERROR);
    }
  }

  function onImageReady(event) {
    const img = event.currentTarget;
    if (!img.naturalWidth || !img.naturalHeight) {
      setFailed(OPEN_ERROR);
      return;
    }
    setMedia({ w: img.naturalWidth, h: img.naturalHeight });
    setCrop(fullCrop(img.naturalWidth, img.naturalHeight));
  }

  function playRange() {
    const video = videoRef.current;
    if (!video) return;
    const begin = () => video.play().catch(() => setFailed("Couldn’t play that clip."));
    if (Math.abs(video.currentTime - start) > 0.08) {
      const onSeeked = () => {
        video.removeEventListener("seeked", onSeeked);
        begin();
      };
      video.addEventListener("seeked", onSeeked);
      video.currentTime = start;
      return;
    }
    begin();
  }

  function onTimeUpdate(event) {
    const video = event.currentTarget;
    if (exportingRef.current) return;
    if (end && video.currentTime >= end) {
      video.pause();
      if (video.currentTime > end) video.currentTime = end;
    }
  }

  function timeFromClient(clientX) {
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return ratio * duration;
  }

  function beginTrim(event, mode) {
    event.preventDefault();
    event.stopPropagation();
    const snapshot = {
      mode,
      start,
      end,
      span: Math.max(0.1, end - start),
      origin: timeFromClient(event.clientX),
      length: duration,
    };
    const move = (ev) => {
      const time = timeFromClient(ev.clientX);
      if (snapshot.mode === "start") {
        const next = clamp(roundTime(time), 0, snapshot.end - 0.1);
        setStart(next);
        const video = videoRef.current;
        if (video && !exportingRef.current) video.currentTime = next;
      } else if (snapshot.mode === "end") {
        setEnd(clamp(roundTime(time), snapshot.start + 0.1, snapshot.length));
      } else {
        const nextStart = clamp(roundTime(snapshot.start + (time - snapshot.origin)), 0, Math.max(0, snapshot.length - snapshot.span));
        setStart(nextStart);
        setEnd(Math.min(snapshot.length, roundTime(nextStart + snapshot.span)));
      }
      setPhase("edit");
      clearPreview();
    };
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  async function preview() {
    if (!media || working) return;
    setWorking(true);
    setFailed("");
    exportingRef.current = true;
    const video = videoRef.current;
    const primed = video && resolved === "video" ? video.play() : null;
    try {
      if (primed) {
        await primed;
        video.pause();
      }
      let next = blob;
      if (resolved === "image") {
        next = await renderImage(blob, crop);
      } else {
        const selection = { start, end, crop };
        if (videoEditNeeded({ duration, width: media.w, height: media.h }, selection)) {
          next = await renderVideo(video, selection);
        }
      }
      const url = URL.createObjectURL(next);
      setPreviewBlob(next);
      setPreviewUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return url;
      });
      setPhase("preview");
    } catch {
      setFailed(EDIT_ERROR);
    } finally {
      exportingRef.current = false;
      setWorking(false);
    }
  }

  async function apply() {
    if (!previewBlob || saving) return;
    setSaving(true);
    setFailed("");
    try {
      await onApply(previewBlob);
    } catch {
      setFailed(SAVE_ERROR);
      setSaving(false);
    }
  }

  const stageStyle = media
    ? {
        aspectRatio: `${media.w} / ${media.h}`,
        width: `min(100%, ${(440 * media.w) / media.h}px)`,
      }
    : { aspectRatio: "16 / 9", width: "100%" };

  return (
    <div className="mt-4" role="region" aria-labelledby={titleId}>
      <h3 id={titleId} className="text-[20px] font-semibold tracking-[-0.02em]">
        {resolved === "video" ? "Trim and crop" : "Crop"}
      </h3>
      <p className="mt-1 max-w-[36rem] text-[14px] leading-6 text-secondary">
        {resolved === "video"
          ? "Drag the in and out handles, or type a start and end. Drag the frame to keep the part of the sign you want. Preview it, then apply."
          : "Drag the frame to keep the part of the picture you want. Preview it, then apply."}
      </p>

      {failed ? (
        <p role="alert" className="mt-3 text-[15px] leading-6 text-ink">
          {failed}
        </p>
      ) : null}

      {phase === "preview" && previewUrl ? (
        <div className="mt-4">
          {resolved === "video" ? (
            <video
              src={previewUrl}
              controls
              playsInline
              className="w-full max-w-[640px] rounded-2xl bg-[#1d1d1f]"
            />
          ) : (
            <img
              src={previewUrl}
              alt="Cropped preview of your sign"
              className="max-h-[440px] w-full max-w-[640px] rounded-2xl bg-[#1d1d1f] object-contain"
            />
          )}
          <p className="mt-3 text-[14px] leading-6 text-secondary">This is the model that will be saved.</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Pill type="button" onClick={onCancel} disabled={saving}>
              Cancel
            </Pill>
            <Pill
              type="button"
              onClick={() => {
                setPhase("edit");
              }}
              disabled={saving}
            >
              Back to edit
            </Pill>
            <span ref={applyWrapRef}>
              <Pill type="button" primary onClick={apply} disabled={saving}>
                {saving ? "Saving…" : "Apply"}
              </Pill>
            </span>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <div ref={stageRef} className="relative mx-auto overflow-hidden rounded-2xl bg-[#1d1d1f]" style={stageStyle}>
              {objectUrl && resolved === "video" ? (
                <video
                  ref={videoRef}
                  src={objectUrl}
                  playsInline
                  onLoadedData={onVideoReady}
                  onError={() => setFailed(OPEN_ERROR)}
                  onTimeUpdate={onTimeUpdate}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : null}
              {objectUrl && resolved === "image" ? (
                <img
                  src={objectUrl}
                  alt=""
                  onLoad={onImageReady}
                  onError={() => setFailed(OPEN_ERROR)}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : null}
              {frame && media ? (
                <>
                  <div className="pointer-events-none absolute bg-black/45" style={{ left: layout.offsetX, top: layout.offsetY, width: layout.w, height: Math.max(0, frame.y * layout.scale) }} />
                  <div className="pointer-events-none absolute bg-black/45" style={{ left: layout.offsetX, top: layout.offsetY + (frame.y + frame.h) * layout.scale, width: layout.w, height: Math.max(0, layout.h - (frame.y + frame.h) * layout.scale) }} />
                  <div className="pointer-events-none absolute bg-black/45" style={{ left: layout.offsetX, top: layout.offsetY + frame.y * layout.scale, width: Math.max(0, frame.x * layout.scale), height: Math.max(0, frame.h * layout.scale) }} />
                  <div className="pointer-events-none absolute bg-black/45" style={{ left: layout.offsetX + (frame.x + frame.w) * layout.scale, top: layout.offsetY + frame.y * layout.scale, width: Math.max(0, layout.w - (frame.x + frame.w) * layout.scale), height: Math.max(0, frame.h * layout.scale) }} />
                <div
                  role="application"
                  tabIndex={0}
                  aria-label="Crop frame. Drag to move it. Arrow keys nudge it."
                  onPointerDown={(event) => beginDrag(event, "move")}
                  onKeyDown={nudgeCrop}
                  className="absolute touch-none border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.35)]"
                  style={{
                    left: layout.offsetX + frame.x * layout.scale,
                    top: layout.offsetY + frame.y * layout.scale,
                    width: Math.max(1, frame.w * layout.scale),
                    height: Math.max(1, frame.h * layout.scale),
                  }}
                >
                  <div className="pointer-events-none absolute inset-0">
                    <span className="absolute left-1/3 top-0 h-full w-px bg-white/35" />
                    <span className="absolute left-2/3 top-0 h-full w-px bg-white/35" />
                    <span className="absolute left-0 top-1/3 h-px w-full bg-white/35" />
                    <span className="absolute left-0 top-2/3 h-px w-full bg-white/35" />
                  </div>
                  {HANDLES.map((handle) => (
                    <button
                      key={handle.id}
                      type="button"
                      aria-label={`${handle.label} crop handle`}
                      onPointerDown={(event) => beginDrag(event, handle.id)}
                      className={`absolute z-10 grid h-8 w-8 place-items-center touch-none ${handle.className}`}
                    >
                      <span className="block h-3.5 w-3.5 rounded-full border-2 border-blue bg-surface shadow-soft" />
                    </button>
                  ))}
                </div>
                </>
              ) : null}
              {working ? (
                <p className="absolute inset-x-0 bottom-3 z-20 mx-auto w-fit rounded-full bg-surface/95 px-3 py-1.5 text-[13px] font-medium text-ink shadow-soft">
                  Making the preview…
                </p>
              ) : null}
            </div>
          </div>

          {resolved === "video" && duration > 0 ? (
            <div className="mt-4">
              <div className="flex flex-wrap items-end gap-4">
                <label className="text-[13px] font-medium text-secondary">
                  Start
                  <input
                    type="number"
                    min={0}
                    max={Math.max(0, end - 0.1)}
                    step={0.1}
                    value={Number.isFinite(start) ? start : 0}
                    aria-label="Start time in seconds"
                    onChange={(event) => changeStart(Number(event.target.value))}
                    className="mt-1 block w-28 rounded-xl border border-line bg-surface px-3 py-2 text-[15px] text-ink"
                  />
                </label>
                <label className="text-[13px] font-medium text-secondary">
                  End
                  <input
                    type="number"
                    min={start + 0.1}
                    max={duration}
                    step={0.1}
                    value={Number.isFinite(end) ? end : 0}
                    aria-label="End time in seconds"
                    onChange={(event) => changeEnd(Number(event.target.value))}
                    className="mt-1 block w-28 rounded-xl border border-line bg-surface px-3 py-2 text-[15px] text-ink"
                  />
                </label>
                <p className="pb-2 text-[13px] text-secondary">
                  {formatTime(start)} – {formatTime(end)} of {formatTime(duration)}
                </p>
              </div>
              <div ref={trackRef} className="relative mt-3 h-11">
                <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-muted" />
                <button
                  type="button"
                  aria-label="Trimmed range"
                  onPointerDown={(event) => beginTrim(event, "range")}
                  className="absolute top-1/2 z-[1] h-8 -translate-y-1/2"
                  style={{
                    left: `${duration ? (start / duration) * 100 : 0}%`,
                    width: `${duration ? ((end - start) / duration) * 100 : 0}%`,
                  }}
                >
                  <span className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-blue" />
                </button>
                <TrimHandle
                  label="In point"
                  value={start}
                  min={0}
                  max={Math.max(0, end - 0.1)}
                  percent={duration ? (start / duration) * 100 : 0}
                  onPointerDown={(event) => beginTrim(event, "start")}
                  onKey={(delta) => changeStart(start + delta)}
                />
                <TrimHandle
                  label="Out point"
                  value={end}
                  min={start + 0.1}
                  max={duration}
                  percent={duration ? (end / duration) * 100 : 100}
                  onPointerDown={(event) => beginTrim(event, "end")}
                  onKey={(delta) => changeEnd(end + delta)}
                />
              </div>
              <div className="mt-2">
                <Pill type="button" onClick={playRange} disabled={!media || working}>
                  Play the trimmed range
                </Pill>
              </div>
            </div>
          ) : null}

          <div className="mt-2">
            <button
              type="button"
              onClick={() => media && updateCrop(fullCrop(media.w, media.h))}
              className="text-[14px] font-medium text-blue"
            >
              Reset the frame
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Pill type="button" onClick={onCancel} disabled={working}>
              Cancel
            </Pill>
            <Pill type="button" primary onClick={preview} disabled={!media || working}>
              {working ? "Making the preview…" : "Preview result"}
            </Pill>
          </div>
        </>
      )}
    </div>
  );
}

function TrimHandle({ label, value, min, max, percent, onPointerDown, onKey }) {
  return (
    <button
      type="button"
      role="slider"
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={formatTime(value)}
      onPointerDown={onPointerDown}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
          event.preventDefault();
          onKey(-0.1);
        } else if (event.key === "ArrowRight" || event.key === "ArrowUp") {
          event.preventDefault();
          onKey(0.1);
        }
      }}
      className="absolute top-1/2 z-10 h-11 w-11 -translate-x-1/2 -translate-y-1/2 touch-none"
      style={{ left: `${percent}%` }}
    >
      <span className="mx-auto block h-[22px] w-[22px] rounded-full border-2 border-blue bg-surface shadow-soft" />
    </button>
  );
}
