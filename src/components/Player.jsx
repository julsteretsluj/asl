import { useEffect, useRef } from "react";
import { useAccess } from "../access.jsx";

export function LessonPlayer({ lesson }) {
  const frame = useRef(null);
  const { access, patch } = useAccess();

  useEffect(() => {
    const node = frame.current;
    if (!node) return undefined;
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
  }, [access.speed, lesson.id]);

  return (
    <figure className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
      <div className="aspect-video bg-[#1d1d1f]">
        <iframe
          ref={frame}
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${lesson.id}?enablejsapi=1&rel=0`}
          title={`${lesson.title}, ${lesson.author}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <figcaption className="space-y-3 px-4 py-3">
        <div>
          <p className="text-[15px] font-medium text-ink">{lesson.title}</p>
          <p className="text-[13px] leading-5 text-secondary">
            {lesson.author}. The film starts when you press play.{" "}
            <a href={lesson.href} target="_blank" rel="noreferrer" className="font-medium text-blue">
              Open on YouTube
            </a>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Playback speed">
          {[0.5, 0.75, 1].map((speed) => (
            <button
              key={speed}
              type="button"
              aria-pressed={access.speed === speed}
              onClick={() => patch({ speed })}
              className={`rounded-full px-3 py-1 text-[13px] font-medium ${
                access.speed === speed ? "bg-ink text-white" : "bg-[#f2f2f7] text-ink"
              }`}
            >
              {speed === 1 ? "1×" : `${speed}×`}
            </button>
          ))}
        </div>
        {access.gaze ? (
          <p className="text-[14px] leading-6 text-secondary">
            Soft gaze is on. Keep the signer’s hands and upper chest in view. The face can sit slightly out of a direct stare and still stay available.
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}
