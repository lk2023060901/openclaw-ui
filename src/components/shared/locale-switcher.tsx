"use client";

import { IconMenu } from "@/components/shared/icon-menu";
import { useI18n } from "@/lib/i18n/provider";
import type { Locale } from "@/types/dashboard";

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();

  return (
    <IconMenu
      label="Switch language"
      icon={
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3a14 14 0 0 1 0 18" />
          <path d="M12 3a14 14 0 0 0 0 18" />
          <path d="M6 7.5c1.7 1 3.8 1.5 6 1.5s4.3-.5 6-1.5" />
          <path d="M6 16.5c1.7-1 3.8-1.5 6-1.5s4.3.5 6 1.5" />
        </svg>
      }
    >
      <div className="space-y-2">
        {[
          { value: "zh-CN", label: "简体中文" },
          { value: "en-US", label: "English" }
        ].map((item) => (
          <button
            key={item.value}
            type="button"
            role="menuitemradio"
            aria-checked={locale === item.value}
            onClick={() => setLocale(item.value as Locale)}
            className={`flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm transition ${
              locale === item.value
                ? "bg-accent/15 text-text-primary"
                : "text-text-secondary hover:bg-surface-muted hover:text-text-primary"
            }`}
          >
            <span>{item.label}</span>
            {locale === item.value ? <span className="text-sm font-semibold text-accent">✓</span> : null}
          </button>
        ))}
      </div>
    </IconMenu>
  );
}
