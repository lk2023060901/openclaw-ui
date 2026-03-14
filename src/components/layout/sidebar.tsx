import Link from "next/link";

import { iconForName } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";
import type { DashboardDictionary } from "@/types/dashboard";

export function Sidebar({ dictionary }: { dictionary: DashboardDictionary }) {
  return (
    <aside className="flex w-full flex-col rounded-[2rem] border border-white/20 bg-slate-950/85 p-5 text-slate-100 shadow-halo lg:min-h-[calc(100vh-3rem)] lg:w-full">
      <div>
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
          {dictionary.productName}
        </div>
        <div className="mt-2 text-2xl font-semibold">{dictionary.workspaceName}</div>
        <p className="mt-3 text-sm leading-6 text-slate-400">{dictionary.headerStatus}</p>
      </div>

      <div className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {dictionary.sidebarSectionLabel}
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        {dictionary.navigation.map((item, index) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition",
              index === 0
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/8 hover:text-white"
            )}
          >
            <span className="text-slate-300">{iconForName(item.icon)}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-white/10 bg-white/5 p-4">
        <div className="text-sm font-medium text-white">Operator mode</div>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Dashboard keeps blockers, quick actions, and current runtime health in one place.
        </p>
      </div>
    </aside>
  );
}
