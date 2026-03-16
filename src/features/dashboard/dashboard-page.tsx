"use client";

import { useEffect, useState } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { useI18n } from "@/lib/i18n/provider";
import { ActiveSessionsPanel } from "@/features/dashboard/components/active-sessions-panel";
import { AgentsPanel } from "@/features/dashboard/components/agents-panel";
import { PendingPairingsPanel } from "@/features/dashboard/components/pending-pairings-panel";
import {
  fetchAgents,
  type AgentApiItem
} from "@/lib/gateway/agents";
import {
  approvePairing,
  fetchPairings,
  type PairingKind,
  rejectPairing,
  type PairingApiItem
} from "@/lib/gateway/pairings";
import { fetchActiveSessions, type ActiveSessionApiItem } from "@/lib/gateway/sessions";
import type {
  ActiveSessionCard,
  AgentCard,
  HighlightTone,
  PairingAction,
  PairingItem
} from "@/types/dashboard";

function formatRelativeTime(value: string, locale: string) {
  const target = new Date(value).getTime();
  if (!Number.isFinite(target)) {
    return locale === "zh-CN" ? "刚刚" : "Just now";
  }

  const diffMinutes = Math.max(0, Math.round((Date.now() - target) / 60_000));
  if (diffMinutes < 1) {
    return locale === "zh-CN" ? "刚刚" : "Just now";
  }
  if (diffMinutes < 60) {
    return locale === "zh-CN" ? `${diffMinutes} 分钟前` : `${diffMinutes} min ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return locale === "zh-CN" ? `${diffHours} 小时前` : `${diffHours} hr ago`;
  }

  const diffDays = Math.round(diffHours / 24);
  return locale === "zh-CN" ? `${diffDays} 天前` : `${diffDays} day ago`;
}

function mapSessionTone(status: ActiveSessionApiItem["status"]): HighlightTone {
  switch (status) {
    case "running":
      return "success";
    case "ok":
      return "info";
    case "timeout":
      return "warning";
    case "error":
    default:
      return "danger";
  }
}

function mapSessionStatusLabel(status: ActiveSessionApiItem["status"], locale: string) {
  if (locale === "zh-CN") {
    switch (status) {
      case "running":
        return "运行中";
      case "ok":
        return "正常";
      case "timeout":
        return "超时";
      case "error":
      default:
        return "异常";
    }
  }

  switch (status) {
    case "running":
      return "Running";
    case "ok":
      return "OK";
    case "timeout":
      return "Timeout";
    case "error":
    default:
      return "Error";
  }
}

function mapChannelLabel(channel: string, locale: string) {
  const normalized = channel.trim().toLowerCase();
  const zhLabels: Record<string, string> = {
    feishu: "飞书",
    slack: "Slack",
    telegram: "Telegram",
    discord: "Discord",
    imessage: "iMessage",
    wecom: "企业微信",
    webchat: "Web Chat"
  };
  const enLabels: Record<string, string> = {
    feishu: "Feishu",
    slack: "Slack",
    telegram: "Telegram",
    discord: "Discord",
    imessage: "iMessage",
    wecom: "WeCom",
    webchat: "Web Chat"
  };

  const table = locale === "zh-CN" ? zhLabels : enLabels;
  return table[normalized] ?? channel;
}

function toSessionCard(item: ActiveSessionApiItem, locale: string): ActiveSessionCard {
  return {
    id: item.session_key,
    name: item.title || item.session_key,
    status: mapSessionStatusLabel(item.status, locale),
    tone: mapSessionTone(item.status),
    channel: mapChannelLabel(item.channel, locale),
    model: `${item.model_provider} · ${item.model}`,
    lastActive: formatRelativeTime(item.updated_at, locale),
    action: locale === "zh-CN" ? "打开" : "Open"
  };
}

function shortenSessionKey(value: string) {
  if (value.length <= 28) {
    return value;
  }

  return `${value.slice(0, 24)}...`;
}

function toAgentCard(agent: AgentApiItem, locale: string): AgentCard {
  const primarySession = agent.primary_session;

  return {
    id: agent.id,
    name: agent.identity_name || agent.name || agent.id,
    emoji: agent.identity_emoji || "AI",
    activeSessionCount:
      locale === "zh-CN"
        ? `${agent.active_session_count} 个活跃会话`
        : `${agent.active_session_count} active`,
    model:
      agent.latest_model_provider && agent.latest_model
        ? `${agent.latest_model_provider} · ${agent.latest_model}`
        : "-",
    lastActive: formatRelativeTime(agent.last_active_at, locale),
    primarySession: primarySession ? shortenSessionKey(primarySession.session_key) : "-",
    channel: primarySession ? mapChannelLabel(primarySession.channel, locale) : "-",
    action: locale === "zh-CN" ? "查看" : "View"
  };
}

function mapPairingTone(kind: PairingApiItem["kind"]): HighlightTone {
  switch (kind) {
    case "channel_dm":
      return "info";
    case "node":
      return "info";
    case "device":
    default:
      return "warning";
  }
}

function mapPairingKindLabel(kind: PairingApiItem["kind"], locale: string) {
  if (locale === "zh-CN") {
    switch (kind) {
      case "device":
        return "设备配对";
      case "node":
        return "节点配对";
      case "channel_dm":
      default:
        return "频道配对";
    }
  }

  switch (kind) {
    case "device":
      return "Device pairing";
    case "node":
      return "Node pairing";
    case "channel_dm":
    default:
      return "Channel pairing";
  }
}

function mapPairingStatusTone(status: PairingApiItem["status"]): HighlightTone {
  switch (status) {
    case "approved":
      return "success";
    case "rejected":
      return "danger";
    case "expired":
      return "info";
    case "pending":
    default:
      return "warning";
  }
}

function mapPairingStatusLabel(status: PairingApiItem["status"], locale: string) {
  if (locale === "zh-CN") {
    switch (status) {
      case "approved":
        return "已批准";
      case "rejected":
        return "已拒绝";
      case "expired":
        return "已过期";
      case "pending":
      default:
        return "待处理";
    }
  }

  switch (status) {
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    case "expired":
      return "Expired";
    case "pending":
    default:
      return "Pending";
  }
}

function toPairingCard(item: PairingApiItem, locale: string): PairingItem {
  const relativeCreatedAt = formatRelativeTime(item.created_at, locale);
  const requestedScopes = item.meta.requested_scopes?.join(", ") || "-";
  const requestId = item.meta.request_id || item.id;

  let description = "";
  let detail = "";

  if (item.kind === "channel_dm") {
    const channel = mapChannelLabel(item.meta.channel || item.title, locale);
    description =
      locale === "zh-CN"
        ? `渠道 ${channel} · 发送者 ${item.meta.sender_id || "-"} · 账号 ${item.meta.account_id || "-"}`
        : `Channel ${channel} · sender ${item.meta.sender_id || "-"} · account ${item.meta.account_id || "-"}`;
    detail =
      locale === "zh-CN"
        ? `创建于 ${relativeCreatedAt}`
        : `Created ${relativeCreatedAt}`;
  } else if (item.kind === "node") {
    description =
      locale === "zh-CN"
        ? `节点 ${item.meta.node_id || "-"} · 角色 ${item.meta.role || "-"} · scopes ${requestedScopes}`
        : `Node ${item.meta.node_id || "-"} · role ${item.meta.role || "-"} · scopes ${requestedScopes}`;
    detail =
      locale === "zh-CN"
        ? `请求 ID · ${requestId} · ${relativeCreatedAt}`
        : `Request ID · ${requestId} · ${relativeCreatedAt}`;
  } else {
    description =
      locale === "zh-CN"
        ? `平台 ${item.meta.platform || "-"} · 角色 ${item.meta.role || "-"} · scopes ${requestedScopes}`
        : `Platform ${item.meta.platform || "-"} · role ${item.meta.role || "-"} · scopes ${requestedScopes}`;
    detail =
      locale === "zh-CN"
        ? `请求 ID · ${requestId} · ${relativeCreatedAt}`
        : `Request ID · ${requestId} · ${relativeCreatedAt}`;
  }

  const primaryAction =
    item.kind === "channel_dm"
      ? item.meta.approve_command
        ? {
            kind: "copy_command" as const,
            label: locale === "zh-CN" ? "复制命令" : "Copy command"
          }
        : undefined
      : item.actions.approvable
        ? {
            kind: "approve" as const,
            label: locale === "zh-CN" ? "批准" : "Approve"
          }
        : undefined;

  const secondaryAction =
    item.kind === "channel_dm"
      ? undefined
      : item.actions.rejectable
        ? {
            kind: "reject" as const,
            label: locale === "zh-CN" ? "拒绝" : "Reject"
          }
        : undefined;

  return {
    id: item.id,
    kind: item.kind,
    tone: mapPairingTone(item.kind),
    label: mapPairingKindLabel(item.kind, locale),
    status: mapPairingStatusLabel(item.status, locale),
    statusTone: mapPairingStatusTone(item.status),
    title: item.title,
    description,
    detail,
    code: item.meta.pairing_code || undefined,
    command: item.meta.approve_command || undefined,
    primaryAction,
    secondaryAction
  };
}

export function DashboardPage() {
  const { dictionary, locale } = useI18n();
  const [currentNav, setCurrentNav] = useState("dashboard");
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [agentsLoading, setAgentsLoading] = useState(true);
  const [agentsError, setAgentsError] = useState(false);
  const [activeSessions, setActiveSessions] = useState<ActiveSessionCard[]>([]);
  const [activeSessionsLoading, setActiveSessionsLoading] = useState(true);
  const [activeSessionsError, setActiveSessionsError] = useState(false);
  const [activePairingKind, setActivePairingKind] = useState<PairingKind>("device");
  const [pairingsByKind, setPairingsByKind] = useState<Record<PairingKind, PairingItem[]>>({
    device: [],
    node: [],
    channel_dm: []
  });
  const [loadedPairingKinds, setLoadedPairingKinds] = useState<Record<PairingKind, boolean>>({
    device: false,
    node: false,
    channel_dm: false
  });
  const [pairingsLoading, setPairingsLoading] = useState(true);
  const [pairingsError, setPairingsError] = useState(false);
  const [busyActionId, setBusyActionId] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();

    const loadAgents = async () => {
      if (!disposed) {
        setAgentsLoading(true);
        setAgentsError(false);
      }

      try {
        const agentsResponse = await fetchAgents(controller.signal);

        if (!disposed) {
          setAgents(
            agentsResponse.items.map((item) => toAgentCard(item, locale))
          );
          setAgentsLoading(false);
          console.log("[agents] response", agentsResponse);
        }
      } catch (error) {
        if (!disposed) {
          console.error("[agents] request failed", error);
          setAgents([]);
          setAgentsLoading(false);
          setAgentsError(true);
        }
      }
    };

    void loadAgents();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [locale]);

  useEffect(() => {
    let disposed = false;

    const loadActiveSessions = async () => {
      if (!disposed) {
        setActiveSessionsLoading(true);
        setActiveSessionsError(false);
      }
      try {
        const response = await fetchActiveSessions({
          activeMinutes: 180,
          limit: 20
        });
        if (!disposed) {
          console.log("[active-sessions] response", response);
          setActiveSessions(response.items.map((item) => toSessionCard(item, locale)));
          setActiveSessionsLoading(false);
        }
      } catch (error) {
        if (!disposed) {
          console.error("[active-sessions] request failed", error);
          setActiveSessions([]);
          setActiveSessionsLoading(false);
          setActiveSessionsError(true);
        }
      }
    };

    void loadActiveSessions();

    return () => {
      disposed = true;
    };
  }, [locale]);

  useEffect(() => {
    let disposed = false;
    const controller = new AbortController();

    const loadPairings = async () => {
      if (loadedPairingKinds[activePairingKind]) {
        setPairingsLoading(false);
        setPairingsError(false);
        return;
      }

      if (!disposed) {
        setPairingsLoading(true);
        setPairingsError(false);
      }
      try {
        const response = await fetchPairings({
          kind: activePairingKind,
          signal: controller.signal
        });
        if (!disposed) {
          console.log("[pairings] response", response);
          const nextItems = response.items
            .filter((item) => item.kind === activePairingKind)
            .map((item) => toPairingCard(item, locale));
          setPairingsByKind((current) => ({
            ...current,
            [activePairingKind]: nextItems
          }));
          setLoadedPairingKinds((current) => ({
            ...current,
            [activePairingKind]: true
          }));
          setPairingsLoading(false);
        }
      } catch (error) {
        if (!disposed) {
          console.error("[pairings] request failed", error);
          setPairingsByKind((current) => ({
            ...current,
            [activePairingKind]: []
          }));
          setPairingsLoading(false);
          setPairingsError(true);
        }
      }
    };

    void loadPairings();

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [activePairingKind, loadedPairingKinds, locale]);

  const handlePairingAction = async (item: PairingItem, action: PairingAction) => {
    const actionId = `${item.id}:${action.kind}`;
    setBusyActionId(actionId);

    try {
      if (action.kind === "copy_command") {
        if (item.command) {
          await navigator.clipboard.writeText(item.command);
        }
        return;
      }

      const requestId = item.id.split(":").slice(1).join(":");
      if ((item.kind === "device" || item.kind === "node") && requestId) {
        if (action.kind === "approve") {
          await approvePairing(item.kind, requestId);
        }
        if (action.kind === "reject") {
          await rejectPairing(item.kind, requestId);
        }
      }

      const response = await fetchPairings({
        kind: activePairingKind
      });
      console.log("[pairings] response", response);
      setPairingsByKind((current) => ({
        ...current,
        [activePairingKind]: response.items
          .filter((entry) => entry.kind === activePairingKind)
          .map((entry) => toPairingCard(entry, locale))
      }));
      setPairingsError(false);
    } catch (error) {
      console.error("[pairings] action failed", error);
    } finally {
      setBusyActionId(null);
    }
  };

  return (
    <AppShell dictionary={dictionary} currentNav={currentNav} onNavigate={setCurrentNav}>
      <div className="grid gap-6">
        {currentNav === "agents" ? (
          <AgentsPanel
            title="Agents"
            items={agents}
            loading={agentsLoading}
            error={agentsError}
            emptyText={locale === "zh-CN" ? "暂无 Agent" : "No agents"}
          />
        ) : currentNav === "dashboard" ? (
          <>
            <AgentsPanel
              title="Agents"
              items={agents}
              loading={agentsLoading}
              error={agentsError}
              emptyText={locale === "zh-CN" ? "暂无 Agent" : "No agents"}
              paginated={false}
            />

            <ActiveSessionsPanel
              title={dictionary.activeSessionsTitle}
              items={activeSessions}
              loading={activeSessionsLoading}
              error={activeSessionsError}
              emptyText={locale === "zh-CN" ? "暂无活跃会话" : "No active sessions"}
            />

            <PendingPairingsPanel
              title={dictionary.pairingTitle}
              activeKind={activePairingKind}
              onKindChange={setActivePairingKind}
              items={pairingsByKind[activePairingKind]}
              loading={pairingsLoading}
              error={pairingsError}
              emptyText={locale === "zh-CN" ? "暂无待配对项" : "No pending pairings"}
              onAction={handlePairingAction}
              busyActionId={busyActionId}
            />
          </>
        ) : (
          <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
            <h2 className="text-2xl font-semibold">
              {dictionary.navigation.find((item) => item.id === currentNav)?.label ?? "Section"}
            </h2>
          </section>
        )}
      </div>
    </AppShell>
  );
}
