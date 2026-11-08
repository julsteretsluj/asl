import { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "signspace-access";

const defaultAccess = {
  lexical: false,
  speed: 1,
  gaze: false,
  largeText: false,
  reduceMotion: false,
  darkMode: null,
};

const AccessContext = createContext(null);

function readStored() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (!parsed || typeof parsed !== "object") return defaultAccess;
    const speed = [0.5, 0.75, 1].includes(parsed.speed) ? parsed.speed : 1;
    let darkMode = null;
    if (Object.prototype.hasOwnProperty.call(parsed, "darkMode")) {
      darkMode = parsed.darkMode === null ? null : Boolean(parsed.darkMode);
    }
    return {
      lexical: Boolean(parsed.lexical),
      speed,
      gaze: Boolean(parsed.gaze),
      largeText: Boolean(parsed.largeText),
      reduceMotion: Boolean(parsed.reduceMotion),
      darkMode,
    };
  } catch {
    return defaultAccess;
  }
}

function systemPrefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveDark(darkMode) {
  return darkMode === null ? systemPrefersDark() : darkMode;
}

function applyDarkClass(dark) {
  document.documentElement.classList.toggle("dark", dark);
}

export function AccessProvider({ children }) {
  const [access, setAccess] = useState(readStored);
  const [open, setOpen] = useState(false);
  const [systemDark, setSystemDark] = useState(() =>
    typeof window !== "undefined" ? systemPrefersDark() : false,
  );

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setSystemDark(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(access));
    document.documentElement.classList.toggle("text-lg-mode", access.largeText);
    document.documentElement.classList.toggle("reduce-motion", access.reduceMotion);
    const dark = access.darkMode === null ? systemDark : access.darkMode;
    applyDarkClass(dark);
  }, [access, systemDark]);

  const dark = access.darkMode === null ? systemDark : access.darkMode;

  const value = useMemo(
    () => ({
      access,
      setAccess,
      open,
      setOpen,
      dark,
      patch: (partial) => setAccess((current) => ({ ...current, ...partial })),
      toggleDarkMode: () =>
        setAccess((current) => {
          const next = !resolveDark(current.darkMode);
          return { ...current, darkMode: next };
        }),
    }),
    [access, open, dark],
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
