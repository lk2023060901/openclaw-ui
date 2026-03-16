"use client";

import { useEffect, useState } from "react";

import { LocaleSwitcher } from "@/components/shared/locale-switcher";
import { SearchCommand } from "@/components/shared/search-command";
import { ThemeSwitcher } from "@/components/shared/theme-switcher";
import { fetchGatewayStatus, type GatewayHealthStatus, type GatewayStatusResponse } from "@/lib/gateway/status";
import type { DashboardDictionary } from "@/types/dashboard";

const GATEWAY_STATUS_POLL_MS = 30_000;

function resolveGatewayTone(status: GatewayHealthStatus, connected: boolean) {
  if (!connected) {
    return "bg-danger";
  }

  switch (status) {
    case "healthy":
      return "bg-success";
    case "degraded":
      return "bg-warning";
    case "starting":
      return "bg-info";
    case "auth_error":
      return "bg-danger";
    case "disconnected":
    default:
      return "bg-danger";
  }
}

export function Header({ dictionary }: { dictionary: DashboardDictionary }) {
  const [timestamp, setTimestamp] = useState("");
  const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusResponse | null>(null);
  const [gatewayUnavailable, setGatewayUnavailable] = useState(false);

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

  useEffect(() => {
    let disposed = false;

    const loadStatus = async () => {
      try {
        const nextStatus = await fetchGatewayStatus();
        if (!disposed) {
          if (process.env.NODE_ENV !== "production") {
            console.log("[gateway-status] response", nextStatus);
          }
          setGatewayStatus(nextStatus);
          setGatewayUnavailable(false);
        }
      } catch (error) {
        if (!disposed) {
          if (process.env.NODE_ENV !== "production") {
            console.error("[gateway-status] request failed", error);
          }
          setGatewayStatus(null);
          setGatewayUnavailable(true);
        }
      }
    };

    void loadStatus();
    const timer = window.setInterval(() => {
      void loadStatus();
    }, GATEWAY_STATUS_POLL_MS);

    return () => {
      disposed = true;
      window.clearInterval(timer);
    };
  }, []);

  const connected = gatewayStatus?.connected ?? !gatewayUnavailable;
  const gatewayToneClass = resolveGatewayTone(gatewayStatus?.status ?? "healthy", connected);
  const currentVersion = gatewayStatus?.gateway_version ?? dictionary.headerMeta.currentVersion;
  const latestVersion =
    gatewayStatus?.update_available === true ? gatewayStatus.latest_version : null;

  return (
    <header className="relative z-40 overflow-visible rounded-[2rem] border border-border-subtle bg-white/65 p-4 shadow-card backdrop-blur-xl dark:bg-surface/80">
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

        <div className="flex flex-wrap items-center gap-3 xl:ml-auto xl:justify-end">
          <SearchCommand placeholder={dictionary.searchPlaceholder} />

          <div className="rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{currentVersion}</span>
            {latestVersion ? (
              <span className="ml-3 rounded-full bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent">
                {dictionary.headerMeta.updateLabel} {latestVersion}
              </span>
            ) : null}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span className={`h-2.5 w-2.5 rounded-full ${gatewayToneClass}`} />
            <span className="font-semibold text-text-primary">
              {connected
                ? dictionary.headerMeta.gatewayConnectedText
                : dictionary.headerMeta.gatewayDisconnectedText}
            </span>
          </div>

          <div className="inline-flex shrink-0 items-center rounded-full border border-border-subtle bg-surface px-4 py-2 text-sm text-text-secondary">
            <span className="whitespace-nowrap font-semibold tabular-nums text-text-primary">{timestamp}</span>
          </div>

          <LocaleSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
