import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils/cn";
import type { ActiveSessionCard } from "@/types/dashboard";

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

  return "hidden xl:block";
}

export function ActiveSessionsPanel({
  title,
  description,
  hint,
  items
}: {
  title: string;
  description: string;
  hint: string;
  items: ActiveSessionCard[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-white/70 p-6 shadow-halo backdrop-blur-xl dark:bg-surface/85 sm:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Dashboard</div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-4 text-base leading-7 text-text-secondary">{description}</p>
        </div>
        <p className="max-w-sm text-sm leading-6 text-text-muted">{hint}</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className={cn(
              "animate-rise rounded-3xl border border-border-subtle bg-surface-muted/85 p-5",
              visibilityClass(index)
            )}
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-lg font-semibold">{item.name}</h2>
                <p className="mt-1 text-sm text-text-muted">{item.channel}</p>
              </div>
              <StatusBadge tone={item.tone}>{item.status}</StatusBadge>
            </div>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-4 py-3">
                <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Model</div>
                <div className="mt-1 text-sm font-medium text-text-secondary">{item.model}</div>
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
    </section>
  );
}
