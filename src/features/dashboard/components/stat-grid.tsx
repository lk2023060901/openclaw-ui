import { StatusBadge } from "@/components/ui/status-badge";
import type { StatItem } from "@/types/dashboard";

export function StatGrid({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: StatItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <article
            key={item.id}
            className="animate-rise rounded-3xl border border-border-subtle bg-surface-muted/85 p-5"
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-text-muted">{item.label}</div>
              <StatusBadge tone={item.tone}>{item.tone}</StatusBadge>
            </div>
            <div className="mt-4 text-3xl font-semibold tracking-tight">{item.value}</div>
            <p className="mt-3 text-sm leading-6 text-text-secondary">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
