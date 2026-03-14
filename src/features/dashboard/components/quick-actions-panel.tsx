import { Button } from "@/components/ui/button";
import type { QuickAction } from "@/types/dashboard";

export function QuickActionsPanel({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: QuickAction[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-6 grid gap-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-border-subtle bg-surface-muted/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-text-muted">{item.description}</p>
              </div>
              <span className="rounded-full bg-app px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
                {item.shortcut}
              </span>
            </div>
            <div className="mt-4">
              <Button variant="ghost" className="px-0">
                Open
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
