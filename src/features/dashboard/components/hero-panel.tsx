import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { HeroData } from "@/types/dashboard";

export function HeroPanel({ hero }: { hero: HeroData }) {
  return (
    <section className="animate-rise rounded-[2rem] border border-border-subtle bg-white/70 p-6 shadow-halo backdrop-blur-xl dark:bg-surface/85 sm:p-8">
      <StatusBadge tone="info">{hero.eyebrow}</StatusBadge>
      <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
        {hero.title}
      </h1>
      <p className="mt-5 max-w-3xl text-base leading-7 text-text-secondary sm:text-lg">
        {hero.description}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button>{hero.primaryAction}</Button>
        <Button variant="secondary">{hero.secondaryAction}</Button>
      </div>
      <div className="mt-8 rounded-3xl border border-border-subtle bg-surface-muted/80 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-text-muted">{hero.activeContextLabel}</div>
        <div className="mt-2 text-lg font-semibold">{hero.activeContextValue}</div>
      </div>
    </section>
  );
}
