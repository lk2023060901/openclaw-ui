import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PairingItem } from "@/types/dashboard";

export function PendingPairingsPanel({
  title,
  description,
  items
}: {
  title: string;
  description: string;
  items: PairingItem[];
}) {
  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">{description}</p>

      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-3xl border border-border-subtle bg-surface-muted/80 p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <StatusBadge tone={item.tone}>{item.label}</StatusBadge>
                </div>
                <p className="mt-3 text-sm leading-6 text-text-muted">{item.description}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-border-subtle/80 bg-surface/85 px-4 py-3">
              <div className="text-sm font-medium text-text-secondary">{item.detail}</div>
              {item.code ? (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Pairing code</div>
                  <div className="mt-1 text-base font-semibold tracking-[0.16em]">{item.code}</div>
                </div>
              ) : null}
              {item.command ? (
                <div className="mt-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Command</div>
                  <code className="mt-1 block overflow-x-auto rounded-2xl bg-app/80 px-3 py-2 text-sm text-text-secondary">
                    {item.command}
                  </code>
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button>{item.primaryAction}</Button>
              {item.secondaryAction ? <Button variant="secondary">{item.secondaryAction}</Button> : null}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
