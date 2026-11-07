export function Pill({ children, primary = false, className = "", ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-[15px] font-medium transition-colors duration-200 ${
        primary
          ? "bg-blue text-white hover:bg-blue-hover"
          : "border border-line bg-white text-ink hover:bg-[#f7f7fa]"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Sheet({ className = "", children }) {
  return (
    <section className={`rounded-2xl bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.08)] sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

export function Prose({ children, className = "" }) {
  return (
    <div className={`max-w-[40rem] space-y-4 font-serif text-[17px] leading-[1.7] text-ink ${className}`}>
      {children}
    </div>
  );
}

export function Feedback({ result }) {
  if (!result) return null;
  return (
    <div aria-live="polite" className="mt-4 space-y-2">
      <p className="text-[16px] font-medium text-ink">
        {result.status === "pass"
          ? "This gloss holds."
          : result.status === "revise"
            ? "Revise this gloss."
            : "Nothing checked yet."}
      </p>
      <p className="text-[15px] leading-6 text-ink">{result.summary}</p>
      {result.notes?.length ? (
        <ul className="space-y-1.5">
          {result.notes.map((note) => (
            <li
              key={note.text}
              className={`text-[14px] leading-6 ${note.tone === "bad" ? "text-[#7A271A]" : "text-secondary"}`}
            >
              {note.tone === "bad" ? "Change: " : "Note: "}
              {note.text}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function ExternalLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-[15px] font-medium text-blue hover:text-blue-hover"
    >
      {children}
    </a>
  );
}
