import { useEffect, useMemo, useRef, useState } from "react";
import { useAccount } from "../account.jsx";
import { clearModelMedia, saveModelMedia } from "../model-sync.js";
import {
  MODEL_TOO_LARGE,
  MAX_MODEL_BYTES,
  assertModelSize,
  modelKey,
  readModel,
} from "../models.js";
import { resolveSignVideo } from "../video.js";
import { MediaEditor } from "./MediaEditor.jsx";
import { SignCitation, SignModelCompare } from "./Player.jsx";
import { Camera, Icon, Upload, Video } from "./icons.jsx";
import { Pill } from "./ui.jsx";

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

/** Compact presence chip for lists — thumbnail when a snapshot exists, else a video icon. */
export function ModelPresence({ sign, className = "" }) {
  const [model, setModel] = useState(null);
  const key = sign ? modelKey(sign) : "";
  const imageUrl = useBlobUrl(model?.image || null);

  useEffect(() => {
    if (!key) {
      setModel(null);
      return undefined;
    }
    let cancel = false;
    function load() {
      readModel(key)
        .then((row) => {
          if (!cancel) setModel(row);
        })
        .catch(() => {
          if (!cancel) setModel(null);
        });
    }
    load();
    window.addEventListener("signspace-models-changed", load);
    return () => {
      cancel = true;
      window.removeEventListener("signspace-models-changed", load);
    };
  }, [key]);

  if (!model?.image && !model?.video) return null;

  return (
    <span
      className={`inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-secondary ${className}`}
      title={`Your model for ${sign.term || sign.gloss}`}
      aria-label={`Your model for ${sign.term || sign.gloss}`}
    >
      {imageUrl ? (
        <img src={imageUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <Icon as={Video} size={14} />
      )}
    </span>
  );
}

/**
 * Film first → Record / Upload / Snapshot → MediaEditor → side-by-side compare.
 * compact: smaller pills (Record page / lesson). snapshot: keep Snapshot when compact.
 */
export function SignModelCapture({ sign, compact = false, snapshot = false, onSaved, onClose }) {
  const { user } = useAccount();
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
  const signKey = sign ? modelKey(sign) : "";
  const hasUserModel = Boolean(model?.image || model?.video);
  const hasEmbed = Boolean(sign && resolveSignVideo(sign));
  const busy = Boolean(editor || cameraMode);

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

    function load() {
      readModel(signKey)
        .then((row) => {
          if (request === requestRef.current) setModel(row);
        })
        .catch(() => {
          if (request === requestRef.current) setStoreError("Saved clips could not be read on this device.");
        });
    }

    load();
    const onSync = () => load();
    const onNote = (event) => {
      const message = event?.detail?.message;
      if (message && request === requestRef.current) setStoreError(message);
    };
    window.addEventListener("signspace-models-changed", onSync);
    window.addEventListener("signspace-models-sync-note", onNote);
    return () => {
      window.removeEventListener("signspace-models-changed", onSync);
      window.removeEventListener("signspace-models-sync-note", onNote);
    };
  }, [signKey]);

  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream || !cameraMode) return undefined;
    video.srcObject = stream;
    video.play().catch(() => {});
    return undefined;
  }, [cameraMode]);

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
      const options = mimeType
        ? { mimeType, videoBitsPerSecond: 900_000 }
        : { videoBitsPerSecond: 900_000 };
      recorder = new MediaRecorder(stream, options);
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
      0.8,
    );
  }

  async function onUpload(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (file.size > MAX_MODEL_BYTES) {
      setCameraError(MODEL_TOO_LARGE);
      return;
    }
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
    if (blob.size > MAX_MODEL_BYTES) {
      setCameraError(MODEL_TOO_LARGE);
      return;
    }
    releaseCamera();
    setEditor({ blob, kind: slot === "image" ? "image" : "video", slot });
    setCameraError("");
  }

  async function applyEdit(nextBlob) {
    if (!sign || !editor) throw new Error("save");
    assertModelSize(nextBlob);
    const slot = editor.slot;
    const request = ++requestRef.current;
    const { model: next, cloudNote } = await saveModelMedia(user?.uid || null, sign, slot, nextBlob);
    if (!mounted.current || request !== requestRef.current) return;
    setModel(next);
    setEditor(null);
    setStoreError(cloudNote);
    onSaved?.(next);
  }

  async function removeSlot(slot) {
    if (!sign) return;
    if (editor?.slot === slot) setEditor(null);
    const request = ++requestRef.current;
    try {
      const { model: next, cloudNote } = await clearModelMedia(user?.uid || null, sign, slot);
      if (!mounted.current || request !== requestRef.current) return;
      setModel(next);
      setStoreError(cloudNote);
      onSaved?.(next);
    } catch {
      if (mounted.current && request === requestRef.current) {
        setStoreError("The clip could not be saved in this browser.");
      }
    }
  }

  if (!sign) return null;

  const showSnapshot = !compact || snapshot;

  return (
    <div className={compact ? "mt-3 space-y-4" : "space-y-4"}>
      {!busy ? (
        hasUserModel ? (
          <SignModelCompare sign={sign} model={model} />
        ) : (
          <div>
            <p className="mb-2 text-[13px] font-medium text-secondary">Filmed model</p>
            <SignCitation sign={sign} showSource={!compact} />
            <p className="mt-3 text-[14px] leading-6 text-secondary">
              {hasEmbed
                ? "Watch the filmed model first, then record or upload your own."
                : "No filmed model is available yet. You can still record or upload your own."}
            </p>
          </div>
        )
      ) : null}

      {!editor ? (
        <div className="flex flex-wrap items-center gap-2">
          <Pill type="button" onClick={() => openCamera("record")} disabled={recording} className="gap-1.5 !px-3 !py-1.5 !text-[13px]">
            <Icon as={Video} size="xs" />
            {model?.video ? "Replace video" : "Record"}
          </Pill>
          {showSnapshot ? (
            <Pill
              type="button"
              onClick={() => openCamera("snapshot")}
              disabled={recording}
              className={compact ? "gap-1.5 !px-3 !py-1.5 !text-[13px] max-[389px]:hidden" : "gap-1.5 !px-3 !py-1.5 !text-[13px]"}
            >
              <Icon as={Camera} size="xs" />
              {compact ? "Snapshot" : "Take a snapshot"}
            </Pill>
          ) : null}
          <Pill type="button" onClick={() => fileRef.current?.click()} disabled={recording} className="gap-1.5 !px-3 !py-1.5 !text-[13px]">
            <Icon as={Upload} size="xs" />
            Upload
          </Pill>
          <input
            ref={fileRef}
            type="file"
            accept="image/*,video/*"
            tabIndex={-1}
            className="sr-only"
            onChange={onUpload}
          />
          {onClose ? (
            <button type="button" className="text-[13px] font-medium text-secondary" onClick={onClose} disabled={recording}>
              Close
            </button>
          ) : null}
        </div>
      ) : null}

      {cameraError ? <p className="text-[14px] leading-6 text-secondary">{cameraError}</p> : null}
      {storeError ? <p className="text-[14px] leading-6 text-secondary">{storeError}</p> : null}

      {editor ? (
        <MediaEditor blob={editor.blob} kind={editor.kind} onCancel={() => setEditor(null)} onApply={applyEdit} />
      ) : null}

      {cameraMode ? (
        <div>
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

      {!busy && hasUserModel ? (
        <div className="flex flex-wrap gap-3 text-[13px]">
          {model.image ? (
            <button type="button" className="font-medium text-blue" onClick={() => beginEdit(model.image, "image")}>
              Crop snapshot
            </button>
          ) : null}
          {model.video ? (
            <button type="button" className="font-medium text-blue" onClick={() => beginEdit(model.video, "video")}>
              Trim or crop
            </button>
          ) : null}
          {model.image ? (
            <button type="button" className="font-medium text-secondary" onClick={() => removeSlot("image")}>
              Remove snapshot
            </button>
          ) : null}
          {model.video ? (
            <button type="button" className="font-medium text-secondary" onClick={() => removeSlot("video")}>
              Remove video
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
