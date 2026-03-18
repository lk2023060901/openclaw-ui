export type Locale = "zh-CN" | "en-US";

export type ThemeMode = "system" | "light" | "dark";

export type ThemeAccent = "claw" | "ocean" | "sunset";

export type NavItem = {
  id: string;
  href: string;
  icon: string;
  label: string;
};

export type HighlightTone = "success" | "warning" | "danger" | "info";

export type HeroData = {
  eyebrow: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  activeContextLabel: string;
  activeContextValue: string;
};

export type StatItem = {
  id: string;
  label: string;
  value: string;
  detail: string;
  tone: HighlightTone;
};

export type AttentionItem = {
  id: string;
  title: string;
  description: string;
  action: string;
  tone: HighlightTone;
  time: string;
};

export type QuickAction = {
  id: string;
  title: string;
  description: string;
  shortcut: string;
};

export type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
};

export type SummaryMetric = {
  id: string;
  label: string;
  value: string;
  detail: string;
};

export type PairingActionKind = "approve" | "reject" | "copy_command" | "details";

export type PairingAction = {
  kind: PairingActionKind;
  label: string;
  disabled?: boolean;
};

export type PairingItem = {
  id: string;
  kind: "device" | "node" | "channel_dm";
  tone: HighlightTone;
  label: string;
  status: string;
  statusTone: HighlightTone;
  title: string;
  description: string;
  detail: string;
  code?: string;
  command?: string;
  primaryAction?: PairingAction;
  secondaryAction?: PairingAction;
};

export type ActiveSessionCard = {
  id: string;
  name: string;
  status: string;
  tone: HighlightTone;
  channel: string;
  model: string;
  lastActive: string;
  action: string;
};

export type AgentCard = {
  id: string;
  name: string;
  emoji: string;
  isDefault: boolean;
  activeSessionCount: string;
  model: string;
  lastActive: string;
  primarySession: string;
  channel: string;
  action: string;
};

export type FooterLink = {
  id: string;
  label: string;
  href: string;
};

export type HeaderMeta = {
  versionLabel: string;
  currentVersion: string;
  updateLabel: string;
  latestVersion: string | null;
  gatewayLabel: string;
  gatewayConnectedText: string;
  gatewayDisconnectedText: string;
  timestampLabel: string;
};

export type DashboardDictionary = {
  productName: string;
  workspaceName: string;
  searchPlaceholder: string;
  searchHint: string;
  headerStatus: string;
  headerMeta: HeaderMeta;
  localeLabel: string;
  themeLabel: string;
  sidebarSectionLabel: string;
  hero: HeroData;
  activeSessionsTitle: string;
  activeSessionsDescription: string;
  activeSessionsHint: string;
  pairingTitle: string;
  pairingDescription: string;
  attentionTitle: string;
  attentionDescription: string;
  quickActionsTitle: string;
  quickActionsDescription: string;
  activityTitle: string;
  activityDescription: string;
  summaryTitle: string;
  summaryDescription: string;
  footerText: string;
  activeSessions: ActiveSessionCard[];
  pairings: PairingItem[];
  stats: StatItem[];
  attention: AttentionItem[];
  quickActions: QuickAction[];
  activity: ActivityItem[];
  summary: SummaryMetric[];
  navigation: NavItem[];
  footerLinks: FooterLink[];
};
