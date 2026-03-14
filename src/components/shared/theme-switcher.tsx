"use client";

import type { ReactNode } from "react";

import { useTheme } from "@/lib/theme/provider";
import type { ThemeMode } from "@/types/dashboard";

export function ThemeSwitcher() {
  const { mode, setMode } = useTheme();

  const items: Array<{
    value: ThemeMode;
    label: string;
    icon: ReactNode;
  }> = [
    {
      value: "light",
      label: "Light",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path d="M12 3v2.5" />
          <path d="M12 18.5V21" />
          <path d="M4.9 4.9l1.8 1.8" />
          <path d="M17.3 17.3l1.8 1.8" />
          <path d="M3 12h2.5" />
          <path d="M18.5 12H21" />
          <path d="M4.9 19.1l1.8-1.8" />
          <path d="M17.3 6.7l1.8-1.8" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      )
    },
    {
      value: "dark",
      label: "Dark",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )
    },
    {
      value: "system",
      label: "System",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8" />
          <path d="M12 16v4" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface/80 px-2 py-1">
      {items.map((item) => (
        <button
          key={item.value}
          type="button"
          aria-label={item.label}
          aria-pressed={mode === item.value}
          onClick={() => setMode(item.value)}
          className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
            mode === item.value
              ? "border-accent/40 bg-accent/15 text-text-primary"
              : "border-transparent text-text-secondary hover:border-border-strong hover:bg-surface-muted hover:text-text-primary"
          }`}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
