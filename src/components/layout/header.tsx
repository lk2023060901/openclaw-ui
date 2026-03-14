"use client";

import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { SearchCommand } from "@/components/shared/search-command";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import type { DashboardDictionary } from "@/types/dashboard";

export function Header({ dictionary }: { dictionary: DashboardDictionary }) {
  const [timestamp, setTimestamp] = useState("");
  const gatewayConnected = true;

  useEffect(() => {
    const formatNow = () =>
      new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      }).format(new Date());

    setTimestamp(formatNow());
    const timer = window.setInterval(() => setTimestamp(formatNow()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <header className="rounded-[2rem] border border-border-subtle bg-white/65 p-4 shadow-card backdrop-blur-xl dark:bg-surface/80">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white dark:bg-white dark:text-slate-950">
            <span className="text-lg font-semibold">OC</span>
          </div>
          <div className="min-w-0">
            <div className="text-lg font-semibold">{dictionary.productName}</div>
            <div className="text-sm text-text-muted">{dictionary.workspaceName}</div>
          </div>
        </div>

        <div className="xl:ml-4">
          <SearchCommand placeholder={dictionary.searchPlaceholder} hint={dictionary.searchHint} />
        </div>

        <div className="flex flex-wrap items-center gap-3 xl:ml-auto xl:justify-end">
          <div className="rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span className="mr-2 text-text-muted">{dictionary.headerMeta.versionLabel}</span>
            <span className="font-semibold text-text-primary">{dictionary.headerMeta.currentVersion}</span>
            {dictionary.headerMeta.latestVersion ? (
              <span className="ml-3 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                {dictionary.headerMeta.updateLabel} {dictionary.headerMeta.latestVersion}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                gatewayConnected ? "bg-success" : "bg-danger"
              }`}
            />
            <span className="font-semibold text-text-primary">
              {gatewayConnected
                ? dictionary.headerMeta.gatewayConnectedText
                : dictionary.headerMeta.gatewayDisconnectedText}
            </span>
          </div>

          <div className="rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span className="mr-2 text-text-muted">{dictionary.headerMeta.timestampLabel}</span>
            <span className="font-semibold text-text-primary">{timestamp}</span>
          </div>

          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
