import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { AttentionItem } from "@/types/dashboard";

export function AttentionList({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: AttentionItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-border-subtle bg-surface-muted/80 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <StatusBadge tone={item.tone}>{item.time}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
              </div>
              <Button variant="secondary">{item.action}</Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
