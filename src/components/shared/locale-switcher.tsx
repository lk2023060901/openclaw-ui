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
          <path d="M4 5h8" />
          <path d="M8 3v4" />
          <path d="M6 13h12" />
          <path d="M9 5a12 12 0 0 0 6 8" />
          <path d="M12 13a12 12 0 0 0 6-8" />
          <path d="M16 16l4 5" />
          <path d="M14 21l4-10 4 10" />
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
