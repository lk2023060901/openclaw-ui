import { iconForName } from "@/lib/icons";
import { cn } from "@/lib/utils/cn";
import type { DashboardDictionary } from "@/types/dashboard";

export function Sidebar({
  dictionary,
  currentNav,
  onNavigate
}: {
  dictionary: DashboardDictionary;
  currentNav: string;
  onNavigate: (navId: string) => void;
}) {
  return (
    <aside className="flex w-full flex-col rounded-[2rem] border border-white/20 bg-slate-950/85 p-5 text-slate-100 shadow-halo lg:min-h-[calc(100vh-3rem)] lg:w-full">
      <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
        {dictionary.sidebarSectionLabel}
      </div>

      <nav className="mt-4 flex flex-col gap-2">
        {dictionary.navigation.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm transition text-left",
              currentNav === item.id
                ? "bg-white/10 text-white"
                : "text-slate-300 hover:bg-white/8 hover:text-white"
            )}
          >
            <span className="text-slate-300">{iconForName(item.icon)}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
