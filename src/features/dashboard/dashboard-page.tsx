"use client";

import { AppShell } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import { ActiveSessionsPanel } from "@/features/dashboard/components/active-sessions-panel";
import { AttentionList } from "@/features/dashboard/components/attention-list";
import { ActivityFeed } from "@/features/dashboard/components/activity-feed";
import { PendingPairingsPanel } from "@/features/dashboard/components/pending-pairings-panel";
import { QuickActionsPanel } from "@/features/dashboard/components/quick-actions-panel";
import { SummaryPanel } from "@/features/dashboard/components/summary-panel";

export function DashboardPage() {
  const { dictionary } = useI18n();

  return (
    <AppShell dictionary={dictionary}>
      <div className="grid gap-6">
        <ActiveSessionsPanel
          title={dictionary.activeSessionsTitle}
          description={dictionary.activeSessionsDescription}
          hint={dictionary.activeSessionsHint}
          items={dictionary.activeSessions}
        />

        <PendingPairingsPanel
          title={dictionary.pairingTitle}
          description={dictionary.pairingDescription}
          items={dictionary.pairings}
        />

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <AttentionList
            title={dictionary.attentionTitle}
            description={dictionary.attentionDescription}
            items={dictionary.attention}
          />
          <QuickActionsPanel
            title={dictionary.quickActionsTitle}
            description={dictionary.quickActionsDescription}
            items={dictionary.quickActions}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
          <ActivityFeed
            title={dictionary.activityTitle}
            description={dictionary.activityDescription}
            items={dictionary.activity}
          />
          <SummaryPanel
            title={dictionary.summaryTitle}
            description={dictionary.summaryDescription}
            items={dictionary.summary}
          />
        </div>
      </div>
    </AppShell>
  );
}
