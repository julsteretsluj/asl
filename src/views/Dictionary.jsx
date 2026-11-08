import { useEffect, useMemo, useRef, useState } from "react";
import { wordId } from "../comfort.js";
import { MediaEditor } from "../components/MediaEditor.jsx";
import { SignPlayer } from "../components/Player.jsx";
import { Camera, Icon, ImageOff, Search, Upload, Video } from "../components/icons.jsx";
import { ComfortControl, GraphicSlot, Pill } from "../components/ui.jsx";
import { CATEGORIES, CATEGORY_NOTES, VOCAB } from "../data.js";
import { modelKey, readModel, writeModel } from "../models.js";
import { useProgress } from "../progress-state.jsx";

function useBlobUrl(blob) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : ""), [blob]);
  useEffect(() => {
    if (!url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

function cameraMessage(error) {
  const name = error?.name || "";
  if (name === "NotAllowedError" || name === "PermissionDeniedError" || name === "SecurityError") {
    return "The camera stayed off. Allow it in the browser’s site settings, or upload a photo or a clip instead.";
  }
  if (name === "NotFoundError" || name === "DevicesNotFoundError") {
    return "No camera was found. You can still upload an image or a video.";
  }
  if (name === "NotReadableError" || name === "TrackStartError") {
    return "The camera is in use by another app. Close it there, or upload a file.";
  }
  return "The camera could not start. You can still upload an image or a video.";
}

export function Dictionary() {
  const { progress, setComfort } = useProgress();
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(() => modelKey(VOCAB[0]));
  const [model, setModel] = useState(null);
  const [storeError, setStoreError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraMode, setCameraMode] = useState("");
  const [recording, setRecording] = useState(false);
  const [editor, setEditor] = useState(null);
  const fileRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const mounted = useRef(true);
  const requestRef = useRef(0);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return VOCAB.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (!needle) return true;
      return [item.term, item.gloss, item.category, item.params].join(" ").toLowerCase().includes(needle);
    });
  }, [category, query]);

  const sign = rows.find((item) => modelKey(item) === selected) || rows[0] || null;
  const signKey = sign ? modelKey(sign) : "";
  const imageUrl = useBlobUrl(model?.image || null);
  const videoUrl = useBlobUrl(model?.video || null);

  function releaseCamera() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") {
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {
        /* already stopped */
      }
    }
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setRecording(false);
    setCameraMode("");
  }

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      const recorder = recorderRef.current;
      if (recorder && recorder.state === "recording") {
        recorder.onstop = null;
        try {
          recorder.stop();
        } catch {
          /* already stopped */
        }
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!signKey) return undefined;
    const request = ++requestRef.current;
    setModel(null);
    setStoreError("");
    setCameraError("");
    setEditor(null);
    releaseCamera();
    readModel(signKey)
      .then((row) => {
        if (request === requestRef.current) setModel(row);
      })
      .catch(() => {
        if (request === requestRef.current) setStoreError("Saved clips could not be read on this device.");
      });
    return undefined;
  }, [signKey]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream || !cameraMode) return undefined;
    video.srcObject = stream;
    video.play().catch(() => {});
    return undefined;
  }, [cameraMode]);

  async function persist(patch) {
    if (!sign) return;
    const key = modelKey(sign);
    const request = ++requestRef.current;
    try {
      const next = await writeModel(key, patch);
      if (mounted.current && request === requestRef.current) setModel(next);
    } catch {
      if (mounted.current && request === requestRef.current) setStoreError("The clip could not be saved in this browser.");
    }
  }

  async function openCamera(mode) {
    setCameraError("");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("This browser does not offer a camera here. You can still upload an image or a video.");
      return;
    }
    try {
      if (!streamRef.current) {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
          audio: false,
        });
      }
      setCameraMode(mode);
    } catch (error) {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
      setCameraError(cameraMessage(error));
    }
  }

  function startRecording() {
    const stream = streamRef.current;
    if (!stream) return;
    if (typeof MediaRecorder === "undefined") {
      setCameraError("This browser cannot record video. You can still take a snapshot or upload a file.");
      return;
    }
    const preferred = ["video/webm;codecs=vp9", "video/webm;codecs=vp8", "video/webm", "video/mp4"];
    const mimeType = preferred.find((type) => MediaRecorder.isTypeSupported(type)) || "";
    let recorder;
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      setCameraError("This browser could not record video. You can still take a snapshot or upload a file.");
      return;
    }
    chunksRef.current = [];
    recorder.ondataavailable = (event) => {
      if (event.data?.size) chunksRef.current.push(event.data);
    };
    recorder.onstop = () => {
      const type = recorder.mimeType || mimeType || "video/webm";
      const blob = new Blob(chunksRef.current, { type });
      chunksRef.current = [];
      setRecording(false);
      if (!blob.size) {
        setCameraError("That recording was empty. Try again.");
        return;
      }
      beginEdit(blob, "video");
    };
    recorderRef.current = recorder;
    recorder.start();
    setRecording(true);
    setCameraError("");
  }

  function stopRecording() {
    const recorder = recorderRef.current;
    if (recorder && recorder.state === "recording") recorder.stop();
  }

  function captureFrame() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) {
      setCameraError("The camera has no picture yet. Wait a moment, then try the snapshot again.");
      return;
    }
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          setCameraError("The snapshot could not be saved. Try again, or upload a photo.");
          return;
        }
        beginEdit(blob, "image");
      },
      "image/jpeg",
      0.85,
    );
  }

  async function onUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.type.startsWith("image/")) {
      beginEdit(file, "image");
      setCameraError("");
      return;
    }
    if (file.type.startsWith("video/")) {
      beginEdit(file, "video");
      setCameraError("");
      return;
    }
    setCameraError("Choose an image or a video.");
  }

  function beginEdit(blob, slot) {
    if (!blob) return;
    releaseCamera();
    setEditor({ blob, kind: slot === "image" ? "image" : "video", slot });
    setCameraError("");
  }

  async function applyEdit(nextBlob) {
    if (!sign || !editor) throw new Error("save");
    const key = modelKey(sign);
    const slot = editor.slot;
    const request = ++requestRef.current;
    const next = await writeModel(key, { [slot]: nextBlob });
    if (!mounted.current || request !== requestRef.current) return;
    setModel(next);
    setEditor(null);
    setStoreError("");
  }

  function removeSlot(slot) {
    if (editor?.slot === slot) setEditor(null);
    persist({ [slot]: null });
  }

  function choose(item) {
    setSelected(modelKey(item));
    if (!window.matchMedia("(max-width: 1023px)").matches) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("sign-detail")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  return (
    <div className="min-w-0">
      <header className="max-w-[36rem]">
        <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
          <Icon as={Search} size="xs" />
          Signs
        </p>
        <h1 className="mt-1 text-[34px] font-semibold tracking-[-0.03em]">Dictionary</h1>
        <p className="mt-3 text-[15px] leading-6 text-secondary">
          Every sign on the path, with the parameters written out. Lifeprint keeps the filmed citation. A photo or clip you add stays in this browser.
        </p>
        <GraphicSlot id="dictionary-hero" className="mt-5" />
      </header>

      <div className="mt-8 grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
        <section className="min-w-0 rounded-2xl bg-surface p-4 shadow-soft">
          <label className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary" htmlFor="dictionary-search">
            <Icon as={Search} size="xs" />
            Search
          </label>
          <input
            id="dictionary-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Term or gloss"
            className="mt-2 w-full rounded-full border border-line bg-surface px-4 py-2 text-[15px]"
          />
          <label className="mt-4 block text-[13px] font-medium text-secondary" htmlFor="dictionary-category">
            Category
          </label>
          <select
            id="dictionary-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="mt-2 w-full rounded-xl border border-line bg-surface px-3 py-2 text-[15px]"
          >
            <option value="All">All signs</option>
            {CATEGORIES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {category !== "All" && CATEGORY_NOTES[category] ? (
            <p className="mt-3 text-[14px] leading-6 text-secondary">{CATEGORY_NOTES[category]}</p>
          ) : null}
          <p className="mt-4 text-[12px] text-secondary">
            {rows.length} {rows.length === 1 ? "sign" : "signs"}
          </p>
          {rows.length === 0 ? (
            <div className="mt-3 space-y-3">
              <p className="text-[15px] leading-6">Nothing matches. Try another gloss, or set the category back to all signs.</p>
              <GraphicSlot id="dictionary-search-empty" />
            </div>
          ) : (
            <ul className="mt-2 max-h-[40vh] space-y-1 overflow-y-auto lg:max-h-[32rem]">
              {rows.map((item) => {
                const on = sign && modelKey(item) === modelKey(sign);
                const comfortId = wordId(item.gloss);
                return (
                  <li key={modelKey(item)} className="rounded-xl pb-1">
                    <button
                      type="button"
                      aria-current={on ? "true" : undefined}
                      onClick={() => choose(item)}
                      className={`w-full rounded-xl px-3 py-2 text-left ${on ? "bg-select-soft" : "hover:bg-muted"}`}
                    >
                      <span className="block text-[15px] font-medium">{item.term}</span>
                      <span className="block text-[12px] tracking-[0.04em] text-secondary">
                        {item.gloss}
                        <span className="tracking-normal"> · {item.category}</span>
                      </span>
                    </button>
                    <div className="px-2 pt-1">
                      <ComfortControl
                        label={`Comfort with ${item.term}`}
                        value={progress.comfort?.[comfortId] || ""}
                        onChange={(level) => setComfort(comfortId, level)}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {sign ? (
          <div className="min-w-0 space-y-4">
            <article id="sign-detail" className="rounded-[20px] bg-surface p-5 shadow-soft sm:p-8">
              <p className="text-[13px] font-medium text-blue">{sign.category}</p>
              <h2 className="mt-2 text-[32px] font-semibold tracking-[-0.03em]">{sign.term}</h2>
              <p className="mt-1 break-words text-[15px] tracking-[0.06em] text-secondary">{sign.gloss}</p>
              <div className="mt-5">
                <p className="text-[13px] font-medium text-secondary">Comfort</p>
                <p className="mt-1 max-w-[34rem] text-[14px] leading-6 text-secondary">
                  How this sign feels when you produce it. A lesson check leaves this where you set it.
                </p>
                <div className="mt-2">
                  <ComfortControl
                    label={`Comfort with ${sign.term}`}
                    value={progress.comfort?.[wordId(sign.gloss)] || ""}
                    onChange={(level) => setComfort(wordId(sign.gloss), level)}
                  />
                </div>
              </div>
              <dl className="mt-6 space-y-5">
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Parameters</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.params}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Hand</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.manual}</dd>
                </div>
                <div>
                  <dt className="text-[13px] font-medium text-secondary">Face</dt>
                  <dd className="mt-1 text-[16px] leading-6">{sign.face}</dd>
                </div>
              </dl>
              <div className="mt-6">
                <SignPlayer sign={sign} model={model} />
              </div>
            </article>

            <section className="rounded-[20px] bg-surface p-5 shadow-soft sm:ml-6 sm:p-8">
              <h3 className="text-[20px] font-semibold tracking-[-0.02em]">Your model</h3>
              <p className="mt-2 max-w-[34rem] text-[15px] leading-6 text-secondary">
                Record a clip, grab one frame, or upload a photo or video of this sign. Trim a video or crop the picture, preview it, then apply. It stays on this device for {sign.term}, and it is not sent to a server.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Pill type="button" onClick={() => openCamera("record")} disabled={recording} className="gap-1.5">
                  <Icon as={Video} size="xs" />
                  Record video
                </Pill>
                <Pill type="button" onClick={() => openCamera("snapshot")} disabled={recording} className="gap-1.5">
                  <Icon as={Camera} size="xs" />
                  Take a snapshot
                </Pill>
                <Pill type="button" onClick={() => fileRef.current?.click()} disabled={recording} className="gap-1.5">
                  <Icon as={Upload} size="xs" />
                  Upload image or video
                </Pill>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,video/*"
                  tabIndex={-1}
                  className="sr-only"
                  onChange={onUpload}
                />
              </div>
              {cameraError ? <p className="mt-3 text-[14px] leading-6 text-secondary">{cameraError}</p> : null}
              {storeError ? <p className="mt-3 text-[14px] leading-6 text-secondary">{storeError}</p> : null}
              {editor ? (
                <MediaEditor blob={editor.blob} kind={editor.kind} onCancel={() => setEditor(null)} onApply={applyEdit} />
              ) : null}
              {cameraMode ? (
                <div className="mt-4">
                  <div className="overflow-hidden rounded-xl bg-black">
                    <video ref={videoRef} className="aspect-video w-full" autoPlay muted playsInline />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cameraMode === "record" && !recording ? (
                      <Pill type="button" primary onClick={startRecording}>
                        Start recording
                      </Pill>
                    ) : null}
                    {recording ? (
                      <Pill type="button" primary onClick={stopRecording}>
                        Stop
                      </Pill>
                    ) : null}
                    {cameraMode === "snapshot" ? (
                      <Pill type="button" primary onClick={captureFrame}>
                        Use this frame
                      </Pill>
                    ) : null}
                    <Pill type="button" onClick={releaseCamera} disabled={recording}>
                      Close camera
                    </Pill>
                  </div>
                </div>
              ) : null}
              {imageUrl || videoUrl ? (
                <div className="mt-5 grid gap-4">
                  {imageUrl ? (
                    <figure>
                      <img src={imageUrl} alt={`Your snapshot of ${sign.term}`} className="max-h-80 w-full rounded-xl object-contain bg-muted" />
                      <figcaption className="mt-2 flex items-center justify-between gap-3">
                        <span className="text-[13px] text-secondary">Your snapshot</span>
                        <span className="flex gap-4">
                          <button type="button" className="text-[14px] font-medium text-blue" onClick={() => beginEdit(model.image, "image")}>
                            Crop snapshot
                          </button>
                          <button type="button" className="text-[14px] font-medium text-blue" onClick={() => removeSlot("image")}>
                            Remove snapshot
                          </button>
                        </span>
                      </figcaption>
                    </figure>
                  ) : null}
                  {videoUrl ? (
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-[15px] leading-6 text-secondary">Your video plays in the sign player above.</span>
                      <span className="flex gap-4">
                        <button type="button" className="min-h-11 text-base font-medium text-blue" onClick={() => beginEdit(model.video, "video")}>
                          Trim or crop
                        </button>
                        <button type="button" className="min-h-11 text-base font-medium text-blue" onClick={() => removeSlot("video")}>
                          Remove video
                        </button>
                      </span>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  <p className="inline-flex items-center gap-1.5 text-[14px] leading-6 text-secondary">
                    <Icon as={ImageOff} size="xs" />
                    No snapshot or video saved for this sign yet.
                  </p>
                  <GraphicSlot id="dictionary-model" />
                </div>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </div>
  );
}
