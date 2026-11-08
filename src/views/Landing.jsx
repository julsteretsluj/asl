import { useAccess } from "../access.jsx";
import { ArrowRight, BookOpen, BookMarked, ClipboardList, Hand, Icon, Map } from "../components/icons.jsx";
import { GraphicSlot } from "../components/ui.jsx";

export function Landing() {
  const { access } = useAccess();
  const motion = access.reduceMotion ? "" : "landing-rise";

  return (
    <div className="-mt-2">
      <section
        className={`ss-hero-dots relative -mx-5 overflow-hidden rounded-[24px] px-5 py-14 sm:-mx-8 sm:px-10 sm:py-16 ${motion}`}
      >
        <div className="relative z-[1] flex min-h-[calc(100svh-9rem)] flex-col justify-center">
          <img
            src="/signspace-logo.png"
            alt=""
            width={88}
            height={88}
            className="h-[88px] w-[88px] rounded-[22px] object-cover shadow-lift"
          />
          <p className="font-display mt-8 text-[28px] leading-none tracking-[-0.03em] text-ink italic sm:text-[32px]">
            SignSpace
          </p>
          <h1 className="mt-4 max-w-[16ch] text-[40px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[52px]">
            An inclusive ASL academy for classroom gloss.
          </h1>
          <p className="mt-5 max-w-[34rem] text-[17px] leading-7 text-secondary">
            Short lessons on a path, a guidebook for the five parameters, and room to practice with films that play on the page.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#/learn" className="ss-btn ss-btn-primary">
              <Icon as={Map} size="sm" />
              Continue learning
            </a>
            <a href="#/guide" className="ss-btn ss-btn-secondary">
              <Icon as={BookOpen} size="sm" />
              Open the guidebook
            </a>
          </div>
          <GraphicSlot id="landing-hero" className="mt-10 max-w-[40rem]" />
          <p className="mt-8 max-w-[32rem] text-[14px] leading-6 text-secondary">
            Built with respect for Deaf community practice — look at the face, and treat capital-D Deaf as the community, not just the audiogram.
          </p>
        </div>
      </section>

      <section className={`grid gap-10 border-t border-line py-20 sm:grid-cols-[1.1fr_0.9fr] sm:items-end sm:gap-16 ${motion} landing-delay-1`}>
        <div>
          <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
            <Icon as={Map} size="xs" />
            How lessons work
          </p>
          <h2 className="mt-2 max-w-[16ch] text-[28px] font-medium tracking-[-0.03em]">
            A Duolingo-style path, one short lesson at a time.
          </h2>
          <GraphicSlot id="landing-path" className="mt-6" />
        </div>
        <p className="max-w-[28rem] text-[16px] leading-7 text-secondary">
          Move through nodes with a prompt, then Check. Hearts cover misses; finishing a lesson opens the next. Progress can sync when you sign in, so the path travels with you.
        </p>
      </section>

      <section className={`ss-sheet relative overflow-hidden px-6 py-10 sm:px-10 sm:py-14 ${motion} landing-delay-2`}>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <GraphicSlot id="landing-dictionary" />
          <div className="max-w-[36rem] sm:ml-auto sm:text-right">
            <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary sm:justify-end">
              <Icon as={BookMarked} size="xs" />
              Dictionary &amp; your model
            </p>
            <h2 className="mt-2 text-[28px] font-medium tracking-[-0.03em]">
              Keep signs you care about, with your own film beside them.
            </h2>
            <p className="mt-4 text-[16px] leading-7 text-secondary">
              Look up classroom vocabulary, then attach a personal model when you want your hands in the record — not only the citation film.
            </p>
            <a
              href="#/dictionary"
              className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-blue transition-opacity duration-150 hover:opacity-80"
            >
              Browse the dictionary
              <Icon as={ArrowRight} size="sm" />
            </a>
          </div>
        </div>
      </section>

      <section className={`mt-20 grid gap-12 pb-8 md:grid-cols-2 md:gap-20 ${motion} landing-delay-3`}>
        <div className="md:pt-10">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
            <Icon as={Hand} size="xs" />
            Reference
          </p>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.03em]">
            Handshapes, grammar, and social rules in one quick desk.
          </h2>
          <p className="mt-4 max-w-[28rem] text-[16px] leading-7 text-secondary">
            When you need a parameter, a sentence pattern, or a reminder about how people actually greet and take turns, open Reference instead of leaving the academy.
          </p>
          <GraphicSlot id="landing-reference" className="mt-6 max-w-[28rem]" />
          <a
            href="#/reference"
            className="mt-5 inline-flex items-center gap-1.5 text-[15px] font-medium text-blue transition-opacity duration-150 hover:opacity-80"
          >
            Open reference
            <Icon as={ArrowRight} size="sm" />
          </a>
        </div>
        <div className="rounded-[16px] border border-line bg-cream px-6 py-8 sm:px-8">
          <p className="inline-flex items-center gap-1.5 text-[13px] font-medium text-secondary">
            <Icon as={ClipboardList} size="xs" />
            Guidebook &amp; record
          </p>
          <h2 className="mt-2 text-[28px] font-medium tracking-[-0.03em]">
            Longer notes when a path node is not enough.
          </h2>
          <p className="mt-4 text-[16px] leading-7 text-secondary">
            Gloss conventions, vocabulary desks, grammar, and signing space live in the Guide. Record shows what you have covered and mastered so far.
          </p>
          <GraphicSlot id="landing-guide-record" className="mt-6" />
          <div className="mt-6 flex flex-wrap gap-4">
            <a href="#/guide" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-blue transition-opacity duration-150 hover:opacity-80">
              <Icon as={BookOpen} size="sm" />
              Read the guide
            </a>
            <a href="#/record" className="inline-flex items-center gap-1.5 text-[15px] font-medium text-blue transition-opacity duration-150 hover:opacity-80">
              <Icon as={ClipboardList} size="sm" />
              See your record
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
