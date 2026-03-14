import type { ReactNode } from "react";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import type { DashboardDictionary } from "@/types/dashboard";

export function AppShell({
  dictionary,
  children
}: {
  dictionary: DashboardDictionary;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-app text-text-primary">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top_left,rgba(var(--accent)/0.18),transparent_32%),radial-gradient(circle_at_78%_12%,rgba(var(--info)/0.16),transparent_22%),linear-gradient(180deg,rgba(var(--bg-surface)/0.95),rgba(var(--bg-app)/0.98))]" />
      <div className="flex min-h-screen flex-col">
        <div className="w-full px-4 pt-6 lg:px-6">
          <Header dictionary={dictionary} />
        </div>

        <div className="flex w-full flex-1 px-4 py-6 lg:px-6">
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(220px,16vw)_minmax(0,1fr)]">
          <Sidebar dictionary={dictionary} />
          <main className="min-w-0 flex-1">{children}</main>
          </div>
        </div>

        <Footer dictionary={dictionary} />
      </div>
    </div>
  );
}
