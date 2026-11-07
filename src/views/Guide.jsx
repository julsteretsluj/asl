import { Sheet } from "../components/ui.jsx";

const desks = [
  {
    href: "#/basics",
    title: "Gloss and the alphabet",
    body: "Conventions, the five parameters, and the schematic alphabet beside the Lesson 1 film.",
  },
  {
    href: "#/vocab",
    title: "Vocabulary",
    body: "Greetings, family, colors, food, school, jobs, home, clothes, animals, and weather. Each row links to a Lifeprint film.",
  },
  {
    href: "#/grammar",
    title: "Grammar desk",
    body: "Build the same sentences from tiles, with the model visible.",
  },
  {
    href: "#/space",
    title: "Signing space",
    body: "Index a person, send a directional verb, then set the table and the cup.",
  },
  {
    href: "#/practice",
    title: "Open practice",
    body: "Type a gloss with the model hidden, then isolate a minimal pair.",
  },
];

export function Guide() {
  return (
    <div className="max-w-[40rem]">
      <p className="text-[13px] font-medium text-secondary">Guidebook</p>
      <h1 className="mt-2 text-[34px] font-semibold tracking-[-0.03em]">The longer notes</h1>
      <p className="mt-4 text-[16px] leading-7 text-secondary">
        Lessons on the path are the practice. These desks hold the explanations, the films, and the maps.
      </p>
      <div className="mt-8 space-y-3">
        {desks.map((desk, index) => (
          <a key={desk.href} href={desk.href} className={`block ${index % 2 ? "ml-6" : "mr-8"}`}>
            <Sheet>
              <h2 className="text-[18px] font-semibold tracking-[-0.02em]">{desk.title}</h2>
              <p className="mt-1 text-[14px] leading-6 text-secondary">{desk.body}</p>
            </Sheet>
          </a>
        ))}
      </div>
    </div>
  );
}
