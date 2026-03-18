"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode
} from "react";

import { cn } from "@/lib/utils/cn";

export function IconMenu({
  icon,
  label,
  children,
  align = "right"
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  align?: "left" | "right";
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative z-[70]">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-full border border-border-subtle bg-surface text-text-secondary transition",
          open ? "border-accent/40 text-text-primary shadow-card" : "hover:border-border-strong hover:text-text-primary"
        )}
      >
        {icon}
      </button>

      {open ? (
        <div
          id={panelId}
          role="menu"
          className={cn(
            "absolute top-[calc(100%+0.75rem)] z-[80] min-w-[14rem] rounded-[1.5rem] border border-border-subtle bg-surface/95 p-3 shadow-halo backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
