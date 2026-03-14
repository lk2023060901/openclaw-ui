import type { ActivityItem } from "@/types/dashboard";

export function ActivityFeed({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: ActivityItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>
      <div className="mt-6 space-y-4">
        {items.map((item, index) => (
          <article key={item.id} className="relative rounded-3xl border border-border-subtle bg-surface-muted/80 p-5 pl-14">
            <div className="absolute left-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
              {index + 1}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-semibold">{item.title}</h3>
              <span className="text-xs uppercase tracking-[0.18em] text-text-muted">{item.time}</span>
            </div>
            <p className="mt-2 text-sm leading-6 text-text-muted">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
