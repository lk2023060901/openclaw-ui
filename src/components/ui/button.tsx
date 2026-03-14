import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/lib/utils/cn";

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "secondary" | "ghost";
  }
>;

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 focus-visible:ring-offset-2 focus-visible:ring-offset-app",
        variant === "primary" && "bg-accent text-slate-950 shadow-card hover:-translate-y-0.5 hover:shadow-halo",
        variant === "secondary" &&
          "border border-border-subtle bg-surface text-text-primary hover:border-border-strong hover:bg-surface-muted",
        variant === "ghost" && "text-text-secondary hover:bg-surface-muted hover:text-text-primary",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
