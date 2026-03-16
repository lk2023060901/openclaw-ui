"use client";

import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type { PairingAction, PairingItem } from "@/types/dashboard";

export function PendingPairingsPanel({
  title,
  activeKind,
  onKindChange,
  items,
  loading = false,
  error = false,
  emptyText,
  onAction,
  busyActionId
}: {
  title: string;
  activeKind: PairingItem["kind"];
  onKindChange: (kind: PairingItem["kind"]) => void;
  items: PairingItem[];
  loading?: boolean;
  error?: boolean;
  emptyText: string;
  onAction?: (item: PairingItem, action: PairingAction) => void;
  busyActionId?: string | null;
}) {
  const kindTabs: Array<{ kind: PairingItem["kind"]; label: string }> = [
    { kind: "device", label: "Device" },
    { kind: "node", label: "Node" },
    { kind: "channel_dm", label: "Channel DM" }
  ];

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <h2 className="text-xl font-semibold">{title}</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {kindTabs.map((tab) => (
          <Button
            key={tab.kind}
            variant={activeKind === tab.kind ? "primary" : "secondary"}
            className="px-3 py-2"
            onClick={() => onKindChange(tab.kind)}
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {loading || error || items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
          {loading ? "正在加载待配对..." : error ? "待配对加载失败" : emptyText}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
          当前标签下暂无数据
        </div>
      ) : (
        <div className="mt-4 grid gap-4 xl:grid-cols-2">
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
                    <StatusBadge tone={item.statusTone}>{item.status}</StatusBadge>
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
                {item.primaryAction ? (
                  <Button
                    disabled={
                      item.primaryAction.disabled || busyActionId === `${item.id}:${item.primaryAction.kind}`
                    }
                    onClick={() => onAction?.(item, item.primaryAction!)}
                  >
                    {item.primaryAction.label}
                  </Button>
                ) : null}
                {item.secondaryAction ? (
                  <Button
                    variant="secondary"
                    disabled={
                      item.secondaryAction.disabled || busyActionId === `${item.id}:${item.secondaryAction.kind}`
                    }
                    onClick={() => onAction?.(item, item.secondaryAction!)}
                  >
                    {item.secondaryAction.label}
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
