"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils/cn";

type SearchCommandProps = {
  placeholder: string;
  hint: string;
};

export function SearchCommand({ placeholder, hint }: SearchCommandProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isEditable =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable;

      if ((event.key === "/" && !isEditable) || ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k")) {
        event.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div className="flex items-center">
      <label
        className={cn(
          "group relative flex h-12 items-center overflow-hidden rounded-full border border-border-subtle bg-surface/90 shadow-card backdrop-blur transition-all duration-300",
          focused ? "w-[25rem] border-accent/45 shadow-halo" : "w-[18rem]"
        )}
      >
        <span className="pointer-events-none pl-4 text-text-muted">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="h-full w-full bg-transparent px-3 pr-20 text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
        />
        <span className="absolute right-3 inline-flex items-center gap-1 rounded-full bg-app px-2.5 py-1 text-[11px] font-medium text-text-muted">
          <kbd className="rounded bg-surface-muted px-1.5 py-0.5">/</kbd>
          <span>{hint}</span>
        </span>
      </label>
    </div>
  );
}
