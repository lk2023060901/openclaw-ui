import type { SummaryMetric } from "@/types/dashboard";

export function SummaryPanel({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: SummaryMetric[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <article key={item.id} className="rounded-3xl border border-border-subtle bg-surface-muted/80 p-5">
            <div className="text-sm text-text-muted">{item.label}</div>
            <div className="mt-3 text-2xl font-semibold tracking-tight">{item.value}</div>
            <p className="mt-2 text-sm leading-6 text-text-muted">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
