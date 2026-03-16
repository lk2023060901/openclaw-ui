import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";
import type { AgentCard } from "@/types/dashboard";

function visibilityClass(index: number) {
  if (index < 2) {
    return "";
  }

  if (index < 4) {
    return "hidden md:block";
  }

  if (index < 6) {
    return "hidden lg:block";
  }

  if (index < 8) {
    return "hidden xl:block";
  }

  return "hidden";
}

export function AgentsPanel({
  title,
  items,
  loading = false,
  error = false,
  emptyText,
  paginated = true
}: {
  title: string;
  items: AgentCard[];
  loading?: boolean;
  error?: boolean;
  emptyText: string;
  paginated?: boolean;
}) {
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "idle">("all");
  const [sortMode, setSortMode] = useState<"default" | "name" | "active">("default");
  const [jumpPage, setJumpPage] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!filterMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterMenuRef.current?.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [filterMenuOpen]);

  const preparedItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    let nextItems = items.filter((item) => {
      if (!keyword) {
        return true;
      }

      return [item.name, item.model, item.channel, item.primarySession, item.id]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    if (statusFilter === "active") {
      nextItems = nextItems.filter((item) => !item.activeSessionCount.startsWith("0"));
    } else if (statusFilter === "idle") {
      nextItems = nextItems.filter((item) => item.activeSessionCount.startsWith("0"));
    }

    if (sortMode === "name") {
      nextItems = [...nextItems].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    } else if (sortMode === "active") {
      nextItems = [...nextItems].sort((a, b) => {
        const aCount = Number.parseInt(a.activeSessionCount, 10) || 0;
        const bCount = Number.parseInt(b.activeSessionCount, 10) || 0;
        return bCount - aCount;
      });
    }

    return nextItems;
  }, [items, search, sortMode, statusFilter]);

  const pagedItems = useMemo(() => {
    if (!paginated) {
      return items;
    }
    const start = (page - 1) * pageSize;
    return preparedItems.slice(start, start + pageSize);
  }, [items, page, pageSize, paginated, preparedItems]);

  const totalPages = Math.max(1, Math.ceil(preparedItems.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search, sortMode, statusFilter]);

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {paginated ? (
          <>
            <Button className="rounded-xl px-5 py-3">创建智能体</Button>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label className="flex min-w-[15rem] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索 Agent 名称或 ID"
                  className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                />
              </label>
              <div className="relative" ref={filterMenuRef}>
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((current) => !current)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
                    filterMenuOpen || statusFilter !== "all"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted"
                  )}
                  title="过滤"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M4 5h16l-6 7v5l-4 2v-7z" />
                  </svg>
                </button>

                {filterMenuOpen ? (
                  <div className="absolute right-0 top-12 z-30 w-[18rem] overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-halo">
                    <div className="grid grid-cols-[7rem_1fr]">
                      <div className="border-r border-border-subtle bg-surface-muted/60 p-2">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2 text-sm text-text-primary"
                        >
                          <span>状态</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path d="m9 6 6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2">
                        {[
                          { value: "all", label: "全部" },
                          { value: "active", label: "活跃中" },
                          { value: "idle", label: "空闲" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option.value as "all" | "active" | "idle");
                              setFilterMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                              statusFilter === option.value
                                ? "bg-surface-muted text-accent"
                                : "text-text-primary hover:bg-surface-muted"
                            )}
                          >
                            <span>{option.label}</span>
                            {statusFilter === option.value ? (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path d="m5 12 4 4 10-10" />
                              </svg>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSortMode((current) =>
                    current === "default" ? "name" : current === "name" ? "active" : "default"
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-secondary transition hover:bg-surface-muted"
                title={sortMode === "default" ? "默认排序" : sortMode === "name" ? "按名称" : "按活跃会话"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M8 6h10" />
                  <path d="M8 12h7" />
                  <path d="M8 18h4" />
                  <path d="m4 6 1.5-1.5L7 6" />
                  <path d="M5.5 4.5V19" />
                </svg>
              </button>
            </div>
          </>
        ) : null}
        {!paginated ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
      </div>

      {loading || error || preparedItems.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
          {loading ? "正在加载 Agents..." : error ? "Agents 加载失败" : emptyText}
        </div>
      ) : (
        <>
        <div
          className={cn(
            "mt-4 grid gap-4",
            "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {pagedItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "rounded-3xl border border-border-subtle bg-surface-muted/85 p-5",
                !paginated && visibilityClass(index)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{item.emoji || "AI"}</span>
                    <h3 className="truncate text-lg font-semibold">{item.name}</h3>
                  </div>
                </div>
                <div className="rounded-full bg-info/15 px-3 py-1 text-xs font-semibold text-info">
                  {item.activeSessionCount}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Model</div>
                  <div className="mt-1 text-sm font-medium text-text-secondary">{item.model}</div>
                </div>

                <div className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Session</div>
                  <div className="mt-1 text-sm font-medium text-text-secondary">{item.channel}</div>
                  <div className="mt-1 truncate text-sm text-text-muted">{item.primarySession}</div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Last active</div>
                    <div className="mt-1 font-medium text-text-secondary">{item.lastActive}</div>
                  </div>
                  <Button variant="secondary" className="px-3 py-2">
                    {item.action}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {paginated ? (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-sm text-text-muted">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, page - 2), Math.max(0, page - 2) + 3)
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3",
                    pageNumber === page
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-subtle bg-surface text-text-primary"
                  )}
                >
                  {pageNumber}
                </button>
              ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="h-10 rounded-xl border border-border-subtle bg-surface px-3 outline-none"
            >
              {[10, 20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value} 条/页
                </option>
              ))}
            </select>
            <span>跳至</span>
            <input
              value={jumpPage}
              onChange={(event) => setJumpPage(event.target.value.replace(/[^\d]/g, ""))}
              className="h-10 w-16 rounded-xl border border-border-subtle bg-surface px-3 text-center outline-none"
            />
            <span>页</span>
            <button
              type="button"
              onClick={() => {
                const nextPage = Number(jumpPage);
                if (Number.isFinite(nextPage) && nextPage >= 1 && nextPage <= totalPages) {
                  setPage(nextPage);
                }
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border-subtle bg-surface px-3 text-text-primary"
            >
              跳转
            </button>
          </div>
        ) : null}
        </>
      )}
    </section>
  );
}
