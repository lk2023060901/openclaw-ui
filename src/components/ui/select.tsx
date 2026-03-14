import type { SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils/cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cn(
        "h-10 rounded-2xl border border-border-subtle bg-surface px-3 text-sm text-text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
        props.className
      )}
    />
  );
}
