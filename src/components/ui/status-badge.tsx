import { cn } from "@/lib/utils/cn";
import type { HighlightTone } from "@/types/dashboard";

const toneClass: Record<HighlightTone, string> = {
  success: "bg-success/15 text-success",
  warning: "bg-warning/15 text-warning",
  danger: "bg-danger/15 text-danger",
  info: "bg-info/15 text-info"
};

export function StatusBadge({ tone, children }: { tone: HighlightTone; children: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
        toneClass[tone]
      )}
    >
      {children}
    </span>
  );
}
