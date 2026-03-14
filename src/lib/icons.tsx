import type { ReactNode } from "react";

export function iconForName(name: string): ReactNode {
  const shared = "h-5 w-5";

  switch (name) {
    case "dashboard":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M4 13h7V4H4z" />
          <path d="M13 20h7v-9h-7z" />
          <path d="M13 11h7V4h-7z" />
          <path d="M4 20h7v-5H4z" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M7 10h10" />
          <path d="M7 14h6" />
          <path d="M5 19l-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5z" />
        </svg>
      );
    case "channels":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M8 10a4 4 0 1 1 0 4" />
          <path d="M16 6a8 8 0 1 1 0 12" />
          <circle cx="12" cy="12" r="1.5" />
        </svg>
      );
    case "automation":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M4 12h8" />
          <path d="M12 12l-3-3" />
          <path d="M12 12l-3 3" />
          <path d="M20 6v12" />
          <path d="M16 9l4-3 4 3" transform="translate(-4 0)" />
          <path d="M16 15l4 3 4-3" transform="translate(-4 0)" />
        </svg>
      );
    case "agents":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M12 3l6 3v5c0 4.2-2.6 8-6 10-3.4-2-6-5.8-6-10V6l6-3z" />
          <path d="M9.5 11.5h5" />
          <path d="M12 9v5" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <path d="M12 8.5A3.5 3.5 0 1 1 8.5 12 3.5 3.5 0 0 1 12 8.5z" />
          <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3h.1a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5h.1a1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8v.1a1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={shared}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}
