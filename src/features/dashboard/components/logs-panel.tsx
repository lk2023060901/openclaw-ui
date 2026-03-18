"use client";

import { useEffect, useMemo, useState } from "react";

import { fetchGatewayLogs } from "@/lib/gateway/logs";
import { cn } from "@/lib/utils/cn";

type LogLevel = "trace" | "debug" | "info" | "warn" | "error" | "fatal";

type LogItem = {
  id: string;
  time: string;
  level: LogLevel;
  source: string;
  message: string;
};

const LEVELS: LogLevel[] = ["trace", "debug", "info", "warn", "error", "fatal"];

const levelClass: Record<LogLevel, string> = {
  trace: "text-slate-400 border-slate-700",
  debug: "text-sky-400 border-sky-500/30",
  info: "text-blue-400 border-blue-500/30",
  warn: "text-amber-400 border-amber-500/30",
  error: "text-red-400 border-red-500/30",
  fatal: "text-rose-400 border-rose-500/30"
};

export function LogsPanel() {
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [cursor, setCursor] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [autoFollow, setAutoFollow] = useState(true);
  const [enabledLevels, setEnabledLevels] = useState<Record<LogLevel, boolean>>({
    trace: true,
    debug: true,
    info: true,
    warn: true,
    error: true,
    fatal: true
  });

  const refreshLogs = async (useCursor: boolean) => {
    setError(false);

    try {
      const response = await fetchGatewayLogs({
        limit: 100,
        cursor: useCursor ? cursor || undefined : undefined
      });

      const nextItems = response.items.map((item, index) => ({
        id: `${item.time}-${index}-${item.subsystem}`,
        time: item.time.slice(11, 19),
        level: item.level.toLowerCase() as LogLevel,
        source: item.subsystem,
        message: item.message
      }));

      setLogs((current) => (useCursor && cursor ? [...current, ...nextItems] : nextItems));
      setCursor(response.next_cursor);
      setLoading(false);
    } catch (requestError) {
      console.error("[gateway-logs] request failed", requestError);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    void refreshLogs(false);
  }, []);

  useEffect(() => {
    if (!autoFollow) {
      return;
    }

    const timer = window.setInterval(() => {
      void refreshLogs(true);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [autoFollow, cursor]);

  const filteredItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return logs.filter((item) => {
      if (!enabledLevels[item.level]) {
        return false;
      }

      if (!keyword) {
        return true;
      }

      return `${item.source} ${item.message}`.toLowerCase().includes(keyword);
    });
  }, [enabledLevels, logs, search]);

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold">Logs</h2>
          <p className="mt-2 text-sm text-text-muted">Gateway file logs</p>
        </div>
        <div className="flex items-center gap-2">
          <label className="mr-1 inline-flex items-center gap-3 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-primary">
            <span>Auto-follow</span>
            <button
              type="button"
              onClick={() => setAutoFollow((current) => !current)}
              className={cn(
                "relative inline-flex h-6 w-11 items-center rounded-full transition",
                autoFollow ? "bg-accent" : "bg-surface-muted"
              )}
            >
              <span
                className={cn(
                  "inline-block h-5 w-5 rounded-full bg-white transition",
                  autoFollow ? "translate-x-5" : "translate-x-1"
                )}
              />
            </button>
          </label>
          <button
            type="button"
            onClick={() => void refreshLogs(true)}
            className="rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm text-text-primary"
          >
            Refresh
          </button>
          <button className="rounded-xl border border-border-subtle bg-surface px-4 py-2 text-sm text-text-primary">
            Export visible
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex min-w-[14rem] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-muted">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs"
            className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

        <div className="flex flex-wrap items-center gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                setEnabledLevels((current) => ({
                  ...current,
                  [level]: !current[level]
                }))
              }
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]",
                enabledLevels[level]
                  ? `${levelClass[level]} bg-surface`
                  : "border-border-subtle text-text-muted opacity-50"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-border-subtle bg-surface">
        <div className="border-b border-border-subtle px-5 py-3 text-sm text-text-muted">
          File: /tmp/openclaw/openclaw-2026-03-16.log
        </div>
        <div className="max-h-[34rem] overflow-auto">
          {loading ? (
            <div className="px-5 py-8 text-sm text-text-muted">正在加载日志...</div>
          ) : error ? (
            <div className="px-5 py-8 text-sm text-danger">日志加载失败</div>
          ) : null}
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[5.5rem_4.5rem_9rem_minmax(0,1fr)] items-start gap-4 border-b border-border-subtle/80 bg-surface-muted/45 px-5 py-3 text-sm"
            >
              <div className="min-w-0 font-mono text-text-secondary">{item.time}</div>
              <div className="min-w-0">
                <span className={cn("rounded-lg border px-2 py-1 text-xs font-semibold", levelClass[item.level])}>
                  {item.level}
                </span>
              </div>
              <div className="min-w-0 whitespace-pre-wrap break-all font-mono leading-6 text-text-secondary">
                {item.source}
              </div>
              <div className="min-w-0 whitespace-pre-wrap break-all font-mono leading-6 text-text-primary">
                {item.message}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
