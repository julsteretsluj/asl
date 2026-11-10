import { useEffect, useMemo, useRef } from "react";
import { useAccess } from "../access.jsx";
import {
  normalizeYoutubeId,
  providerLabel,
  resolveLessonVideo,
  resolveSignVideo,
  writtenSourceHref,
} from "../video.js";

function videoBlob(value) {
  if (typeof Blob === "undefined" || !(value instanceof Blob)) return null;
  if (value.type && !value.type.startsWith("video/")) return null;
  return value.size ? value : null;
}

function userVideoBlob(model) {
  if (!model || typeof model !== "object") return null;
  const imageAsVideo =
    model.image instanceof Blob && model.image.type.startsWith("video/") ? model.image : null;
  return (
    videoBlob(model.video) ||
    videoBlob(model.clip) ||
    videoBlob(model.recording) ||
    videoBlob(model.snapshot) ||
    videoBlob(imageAsVideo)
  );
}

function useBlobUrl(blob) {
  const url = useMemo(() => (blob ? URL.createObjectURL(blob) : ""), [blob]);
  useEffect(() => {
    if (!url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url]);
  return url;
}

function useYouTubeRate(frame, videoId) {
  const { access } = useAccess();

  useEffect(() => {
    const node = frame.current;
    if (!node || !videoId) return undefined;
    const send = () => {
      node.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: "setPlaybackRate",
          args: [access.speed],
        }),
        "*",
      );
    };
    node.addEventListener("load", send);
    const timer = window.setTimeout(send, 600);
    return () => {
      node.removeEventListener("load", send);
      window.clearTimeout(timer);
    };
  }, [access.speed, videoId, frame]);
}

function SpeedRow() {
  const { access, patch } = useAccess();
  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Playback speed">
      {[0.5, 0.75, 1].map((speed) => (
        <button
          key={speed}
          type="button"
          aria-pressed={access.speed === speed}
          onClick={() => patch({ speed })}
          className={`min-h-11 rounded-full px-4 text-base font-medium ${
            access.speed === speed ? "bg-ink text-white" : "bg-muted text-ink"
          }`}
        >
          {speed === 1 ? "1×" : `${speed}×`}
        </button>
      ))}
    </div>
  );
}

function YouTubeEmbed({ videoId, title, framed = true }) {
  const frame = useRef(null);
  useYouTubeRate(frame, videoId);
  if (!videoId) return null;
  return (
    <div className={`aspect-video overflow-hidden bg-[#1D1D1F] ${framed ? "rounded-2xl" : ""}`}>
      <iframe
        ref={frame}
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0`}
        title={title}
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function VimeoEmbed({ videoId, title, framed = true }) {
  if (!videoId) return null;
  return (
    <div className={`aspect-video overflow-hidden bg-[#1D1D1F] ${framed ? "rounded-2xl" : ""}`}>
      <iframe
        className="h-full w-full"
        src={`https://player.vimeo.com/video/${videoId}`}
        title={title}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        loading="lazy"
      />
    </div>
  );
}

function BlobFilm({ src, label, framed = true }) {
  const node = useRef(null);
  const { access } = useAccess();
  const speed = useRef(access.speed);
  speed.current = access.speed;

  useEffect(() => {
    if (node.current) node.current.playbackRate = access.speed;
  }, [access.speed, src]);

  return (
    <div>
      <div className={`overflow-hidden bg-[#1D1D1F] ${framed ? "rounded-2xl" : ""}`}>
        <video
          ref={node}
          src={src}
          controls
          playsInline
          className="aspect-video w-full"
          aria-label={label}
          onLoadedMetadata={(event) => {
            event.currentTarget.playbackRate = speed.current;
          }}
        />
      </div>
      <div className="mt-3">
        <SpeedRow />
      </div>
    </div>
  );
}

function CitationFilm({ embed, title, framed = true }) {
  if (!embed) return null;
  if (embed.provider === "youtube") {
    return <YouTubeEmbed videoId={embed.id} title={title} framed={framed} />;
  }
  if (embed.provider === "vimeo") {
    return <VimeoEmbed videoId={embed.id} title={title} framed={framed} />;
  }
  if (embed.provider === "file" || embed.provider === "signasl") {
    return <BlobFilm src={embed.src} label={title} framed={framed} />;
  }
  return null;
}

function Attribution({ embed }) {
  const label = providerLabel(embed);
  if (!label) return null;
  return <p className="mt-2 text-[0.8125rem] leading-5 text-secondary">Source: {label}</p>;
}

export function LessonPlayer({ lesson }) {
  const { access } = useAccess();
  const embed = resolveLessonVideo(lesson);
  const videoId = embed?.provider === "youtube" ? normalizeYoutubeId(embed.id) : "";

  return (
    <figure className="overflow-hidden rounded-2xl bg-surface shadow-soft">
      {embed ? (
        <CitationFilm embed={embed} title={`${lesson.title}, ${lesson.author}`} framed={false} />
      ) : (
        <div className="flex aspect-video items-center rounded-2xl bg-muted px-6">
          <p className="text-base leading-6 text-secondary">This film has no in-page video yet.</p>
        </div>
      )}
      <figcaption className="space-y-3 px-4 py-3">
        <div>
          <p className="text-[15px] font-medium text-ink">{lesson.title}</p>
          <p className="text-[13px] leading-5 text-secondary">
            {lesson.author}. The film starts when you press play.{" "}
            <a href={lesson.href} target="_blank" rel="noreferrer" className="font-medium text-blue">
              Open on YouTube
            </a>
          </p>
          {embed ? <Attribution embed={embed} /> : null}
        </div>
        {videoId || embed?.provider === "vimeo" ? <SpeedRow /> : null}
        {access.gaze ? (
          <p className="text-[14px] leading-6 text-secondary">
            Soft gaze is on. Keep the signer’s hands and upper chest in view. The face can sit slightly out of a direct stare and still stay available.
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

/** Citation embed only — watch before recording. Empty frame when no film exists. */
export function SignCitation({ sign, showSource = true, className = "" }) {
  const embed = resolveSignVideo(sign);
  const source = writtenSourceHref(sign?.href);
  const needsSpeed = embed && (embed.provider === "youtube" || embed.provider === "vimeo");

  return (
    <div className={className}>
      {embed ? (
        <CitationFilm embed={embed} title={`${sign.term}, ${sign.gloss}`} />
      ) : (
        <div className="flex aspect-video items-center rounded-2xl bg-muted px-6">
          <p className="text-base leading-6 text-secondary">This sign has no in-page video yet.</p>
        </div>
      )}
      {needsSpeed ? (
        <div className="mt-3">
          <SpeedRow />
        </div>
      ) : null}
      {embed ? <Attribution embed={embed} /> : null}
      {showSource && source ? (
        <p className="mt-3">
          <a href={source} target="_blank" rel="noreferrer" className="text-base font-medium text-blue hover:text-blue-hover">
            Lifeprint page for {sign.term}
          </a>
          <span className="mt-1 block text-[0.8125rem] leading-5 text-secondary">Opens in a new tab.</span>
        </p>
      ) : null}
    </div>
  );
}

function UserModelFilm({ sign, model }) {
  const ownVideo = userVideoBlob(model);
  const videoUrl = useBlobUrl(ownVideo);
  const imageUrl = useBlobUrl(model?.image && !ownVideo ? model.image : null);

  if (videoUrl) {
    return <BlobFilm src={videoUrl} label={`Your video of ${sign.term}`} />;
  }
  if (imageUrl) {
    return (
      <div className="overflow-hidden rounded-2xl bg-muted">
        <img
          src={imageUrl}
          alt={`Your snapshot of ${sign.term}`}
          className="aspect-video w-full object-contain"
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-video items-center rounded-2xl bg-muted px-6">
      <p className="text-base leading-6 text-secondary">No personal model saved yet.</p>
    </div>
  );
}

/**
 * Side-by-side (md+) or stacked: filmed citation vs the learner’s saved model.
 * If there is no embed, only the user model (or placeholder + user) is shown.
 */
export function SignModelCompare({ sign, model, className = "" }) {
  const embed = resolveSignVideo(sign);
  const hasUser = Boolean(userVideoBlob(model) || model?.image);

  if (!embed && !hasUser) {
    return (
      <div className={`flex aspect-video items-center rounded-2xl bg-muted px-6 ${className}`}>
        <p className="text-base leading-6 text-secondary">This sign has no in-page video yet.</p>
      </div>
    );
  }

  if (!embed && hasUser) {
    return (
      <div className={className}>
        <p className="mb-2 text-[13px] font-medium text-secondary">Your model</p>
        <UserModelFilm sign={sign} model={model} />
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 ${className}`}>
      <div className="min-w-0">
        <p className="mb-2 text-[13px] font-medium text-secondary">Filmed model</p>
        <SignCitation sign={sign} showSource={false} />
      </div>
      <div className="min-w-0">
        <p className="mb-2 text-[13px] font-medium text-secondary">Your model</p>
        {hasUser ? (
          <UserModelFilm sign={sign} model={model} />
        ) : (
          <div className="flex aspect-video items-center rounded-2xl bg-muted px-6">
            <p className="text-base leading-6 text-secondary">Save a recording or upload to compare here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function SignPlayer({ sign, model }) {
  const ownVideo = userVideoBlob(model);
  const hasUser = Boolean(ownVideo || model?.image);

  if (hasUser) {
    return <SignModelCompare sign={sign} model={model} />;
  }

  return <SignCitation sign={sign} />;
}
