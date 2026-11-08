import { BookOpen, ChevronRight, FileText, Hand, Icon, Languages, Map, Type } from "../components/icons.jsx";
import { GraphicSlot, Sheet } from "../components/ui.jsx";
import { GUIDE_DESK_GRAPHIC_IDS } from "../graphics.js";

const desks = [
  {
    href: "#/basics",
    title: "Gloss and the alphabet",
    body: "Conventions, the five parameters, and the schematic alphabet beside the Lesson 1 film.",
    icon: Type,
  },
  {
    href: "#/vocab",
    title: "Vocabulary",
    body: "Greetings through everyday topics, then advanced desks: discourse, depiction, classifiers, abstract ideas, feeling intensity, opinion, debate, professional talk, news, story craft, nuance, and register. A stored film plays on the page. Lifeprint stays as the written page.",
    icon: Languages,
  },
  {
    href: "#/grammar",
    title: "Grammar desk",
    body: "Build the same sentences from tiles, with the model visible.",
    icon: FileText,
  },
  {
    href: "#/space",
    title: "Signing space",
    body: "Index a person, send a directional verb, then set the table and the cup.",
    icon: Map,
  },
  {
    href: "#/practice",
    title: "Open practice",
    body: "Type a gloss with the model hidden, then isolate a minimal pair.",
    icon: Hand,
  },
];

export function Guide() {
  return (
    <div className="max-w-[40rem]">
      <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
        <Icon as={BookOpen} size="xs" />
        Guidebook
      </p>
      <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">The longer notes</h1>
      <p className="mt-4 text-[16px] leading-7 text-secondary">
        Lessons on the path are the practice. These desks hold the explanations, the films, and the maps.
      </p>
      <GraphicSlot id="guide-hero" className="mt-6" />
      <div className="mt-8 space-y-3">
        {desks.map((desk, index) => (
          <a key={desk.href} href={desk.href} className={`block ${index % 2 ? "ml-6" : "mr-8"}`}>
            <Sheet>
              <div className="flex items-start gap-3">
                <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-full bg-muted text-secondary">
                  <Icon as={desk.icon} size="sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="inline-flex items-center gap-1 text-[18px] font-semibold tracking-[-0.02em]">
                    {desk.title}
                    <Icon as={ChevronRight} size="sm" className="text-secondary" />
                  </h2>
                  <p className="mt-1 text-[14px] leading-6 text-secondary">{desk.body}</p>
                  {GUIDE_DESK_GRAPHIC_IDS[index] ? (
                    <GraphicSlot id={GUIDE_DESK_GRAPHIC_IDS[index]} className="mt-4" />
                  ) : null}
                </div>
              </div>
            </Sheet>
          </a>
        ))}
      </div>
    </div>
  );
}
