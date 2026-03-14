import Link from "next/link";

import type { DashboardDictionary } from "@/types/dashboard";

export function Footer({ dictionary }: { dictionary: DashboardDictionary }) {
  return (
    <footer className="w-full px-4 pb-6 pt-2 lg:px-6">
      <div className="rounded-[2rem] border border-border-subtle bg-surface/90 px-5 py-4 shadow-card">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl text-sm leading-6 text-text-muted">{dictionary.footerText}</p>
          <div className="flex flex-wrap items-center gap-4">
            {dictionary.footerLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-sm text-text-secondary transition hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
