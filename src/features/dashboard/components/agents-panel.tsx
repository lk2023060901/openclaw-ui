import { useEffect, useMemo, useState } from "react";

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
  const [pageSize, setPageSize] = useState(8);
  const [page, setPage] = useState(1);

  const pagedItems = useMemo(() => {
    if (!paginated) {
      return items;
    }
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize, paginated]);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">{title}</h2>
        {paginated ? (
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
            className="rounded-full border border-border-subtle bg-surface px-3 py-2 text-sm text-text-primary outline-none"
          >
            {[4, 6, 8].map((value) => (
              <option key={value} value={value}>
                {value}/页
              </option>
            ))}
          </select>
        ) : null}
      </div>

      {loading || error || items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
          {loading ? "正在加载 Agents..." : error ? "Agents 加载失败" : emptyText}
        </div>
      ) : (
        <>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pagedItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "rounded-3xl border border-border-subtle bg-surface-muted/85 p-5",
                visibilityClass(index)
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
          <div className="mt-4 flex items-center justify-between gap-3 text-sm text-text-muted">
            <Button
              variant="secondary"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
            >
              上一页
            </Button>
            <span>
              {page}/{totalPages}
            </span>
            <Button
              variant="secondary"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            >
              下一页
            </Button>
          </div>
        ) : null}
        </>
      )}
    </section>
  );
}
