import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "signspace-access";

const defaultAccess = {
  lexical: false,
  speed: 1,
  gaze: false,
  largeText: false,
  reduceMotion: false,
};

const AccessContext = createContext(null);

function readStored() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return defaultAccess;
    const speed = [0.5, 0.75, 1].includes(parsed.speed) ? parsed.speed : 1;
    return {
      lexical: Boolean(parsed.lexical),
      speed,
      gaze: Boolean(parsed.gaze),
      largeText: Boolean(parsed.largeText),
      reduceMotion: Boolean(parsed.reduceMotion),
    };
  } catch {
    return defaultAccess;
  }
}

export function AccessProvider({ children }) {
  const [access, setAccess] = useState(readStored);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
    document.documentElement.classList.toggle("text-lg-mode", access.largeText);
    document.documentElement.classList.toggle("reduce-motion", access.reduceMotion);
  }, [access]);

  const value = useMemo(
    () => ({
      access,
      setAccess,
      open,
      setOpen,
      patch: (partial) => setAccess((current) => ({ ...current, ...partial })),
    }),
    [access, open],
  );

  return <AccessContext.Provider value={value}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const value = useContext(AccessContext);
  if (!value) throw new Error("useAccess must be used inside AccessProvider");
  return value;
}

export function useQuietMotion() {
  const { access } = useAccess();
  const [system, setSystem] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setSystem(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  return access.reduceMotion || system;
}
