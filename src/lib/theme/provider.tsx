"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";

import type { ThemeAccent, ThemeMode } from "@/types/dashboard";

type ThemeContextValue = {
  mode: ThemeMode;
  accent: ThemeAccent;
  setMode: (mode: ThemeMode) => void;
  setAccent: (accent: ThemeAccent) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const MODE_KEY = "openclaw-ui.theme.mode";
const ACCENT_KEY = "openclaw-ui.theme.accent";

function applyTheme(mode: ThemeMode, accent: ThemeAccent) {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "system" && prefersDark);

  root.classList.toggle("dark", isDark);
  root.dataset.theme = accent;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<ThemeAccent>("claw");

  useEffect(() => {
    const nextMode = (localStorage.getItem(MODE_KEY) as ThemeMode | null) ?? "system";
    const nextAccent = (localStorage.getItem(ACCENT_KEY) as ThemeAccent | null) ?? "claw";
    setModeState(nextMode);
    setAccentState(nextAccent);
    applyTheme(nextMode, nextAccent);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme(nextMode, nextAccent);

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      accent,
      setMode: (nextMode: ThemeMode) => {
        setModeState(nextMode);
        localStorage.setItem(MODE_KEY, nextMode);
        applyTheme(nextMode, accent);
      },
      setAccent: (nextAccent: ThemeAccent) => {
        setAccentState(nextAccent);
        localStorage.setItem(ACCENT_KEY, nextAccent);
        applyTheme(mode, nextAccent);
      }
    }),
    [accent, mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
