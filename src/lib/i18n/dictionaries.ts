import type { DashboardDictionary, Locale } from "@/types/dashboard";

const zhCN: DashboardDictionary = {
  productName: "OpenClaw UI",
  workspaceName: "Control Center",
  searchPlaceholder: "搜索页面、动作、状态，或按 /、Ctrl+K、Cmd+K",
  searchHint: "快捷入口",
  headerStatus: "Gateway 已连接，本地工作区运行正常",
  headerMeta: {
    versionLabel: "OpenClaw 版本",
    currentVersion: "v2026.3.13",
    updateLabel: "可更新",
    latestVersion: "v2026.3.14",
    gatewayLabel: "网关状态",
    gatewayConnectedText: "网关已连接",
    gatewayDisconnectedText: "网关未连接",
    timestampLabel: "当前时间"
  },
  localeLabel: "语言",
  themeLabel: "主题",
  sidebarSectionLabel: "主导航",
  hero: {
    eyebrow: "Dashboard",
    title: "让新手先看到能不能用，再决定去哪里操作",
    description:
      "把原来散落在 chat、sessions、channels、cron、agents、config 里的关键信息收敛为一个首页。这里先看状态、阻塞事项、快速入口和最近活动，再进入具体模块。",
    primaryAction: "继续聊天",
    secondaryAction: "处理阻塞事项",
    activeContextLabel: "当前主会话",
    activeContextValue: "main · claude-sonnet · thinking medium"
  },
  activeSessionsTitle: "活跃 Sessions",
  activeSessionsDescription: "这里先看最近仍在运行或等待处理的会话，不展示 token 成本，重点突出状态、来源频道、模型和最近活跃时间。",
  activeSessionsHint: "只显示首页两行，超出部分进入 Workspace 查看完整列表。",
  pairingTitle: "待配对与待授权",
  pairingDescription: "把浏览器设备配对和频道 DM 配对统一收在这里。设备项后续可直接调用网关批准，频道项当前先显示配对码和命令。",
  attentionTitle: "待处理事项",
  attentionDescription: "所有会阻塞使用或自动化的内容，都应该在这里集中出现并直接给出动作。",
  quickActionsTitle: "快速操作",
  quickActionsDescription: "高频动作采用统一按钮样式，避免每个模块各自定义入口。",
  activityTitle: "最近活动",
  activityDescription: "用时间线承接运行、配置、渠道与审批事件。",
  summaryTitle: "运行摘要",
  summaryDescription: "这里展示可理解的业务摘要，而不是直接抛出原始 JSON 或日志流。",
  footerText: "Dashboard 原型面向多语言、多主题和后续真实 Gateway API 对接设计。",
  stats: [
    { id: "gateway", label: "Gateway", value: "Online", detail: "127.0.0.1 · 最后同步 12 秒前", tone: "success" },
    { id: "channels", label: "Channels", value: "6 / 8", detail: "2 个渠道需要补登录或修复配置", tone: "warning" },
    { id: "approvals", label: "Approvals", value: "3", detail: "2 个设备配对，1 个 exec 审批待处理", tone: "warning" },
    { id: "automation", label: "Automation", value: "14", detail: "13 个任务正常，1 个 Cron 最近失败", tone: "info" }
  ],
  activeSessions: [
    { id: "main-feishu", name: "销售线索跟进", status: "运行中", tone: "success", channel: "飞书", model: "anthropic · claude-sonnet", lastActive: "刚刚", action: "打开" },
    { id: "ops-slack", name: "运维告警分流", status: "等待处理", tone: "warning", channel: "Slack", model: "openai · gpt-5", lastActive: "2 分钟前", action: "打开" },
    { id: "support-telegram", name: "海外客服接待", status: "运行中", tone: "success", channel: "Telegram", model: "anthropic · claude-sonnet", lastActive: "4 分钟前", action: "打开" },
    { id: "recruit-wecom", name: "候选人初筛", status: "空闲", tone: "info", channel: "企业微信", model: "openai · gpt-5-mini", lastActive: "11 分钟前", action: "打开" },
    { id: "discord-devrel", name: "开发者社区答疑", status: "等待处理", tone: "warning", channel: "Discord", model: "google · gemini-2.5-pro", lastActive: "17 分钟前", action: "打开" },
    { id: "webchat-growth", name: "官网访客转化", status: "运行中", tone: "success", channel: "Web Chat", model: "anthropic · claude-haiku", lastActive: "23 分钟前", action: "打开" },
    { id: "imessage-vip", name: "VIP 客户回访", status: "异常", tone: "danger", channel: "iMessage", model: "openai · gpt-5", lastActive: "31 分钟前", action: "打开" },
    { id: "slack-finance", name: "财务日报播报", status: "空闲", tone: "info", channel: "Slack", model: "anthropic · claude-sonnet", lastActive: "44 分钟前", action: "打开" }
  ],
  pairings: [
    {
      id: "device-macbook-pro",
      kind: "device",
      tone: "warning",
      label: "设备配对",
      title: "Safari on macOS 请求访问控制台",
      description: "新浏览器设备首次连接 Gateway，需要确认后才允许继续使用 Dashboard。",
      detail: "请求 ID · req_8f3b2d1c · 1 分钟前",
      primaryAction: "批准设备",
      secondaryAction: "拒绝"
    },
    {
      id: "device-ipad",
      kind: "device",
      tone: "warning",
      label: "设备配对",
      title: "iPad Pro 请求操作权限",
      description: "该设备已通过身份校验，但还没有被加入已配对列表。",
      detail: "请求 ID · req_c91a4e82 · 6 分钟前",
      primaryAction: "批准设备",
      secondaryAction: "拒绝"
    },
    {
      id: "feishu-pairing",
      kind: "channel",
      tone: "info",
      label: "频道配对",
      title: "飞书 DM 配对码待处理",
      description: "未知发送者触发了 DM pairing，当前 Web UI 先展示配对信息和建议命令。",
      detail: "渠道 · Feishu · Open ID ou_29f3... · 刚刚",
      code: "JPD6D53R",
      command: "openclaw pairing approve feishu JPD6D53R",
      primaryAction: "复制命令",
      secondaryAction: "查看详情"
    },
    {
      id: "slack-pairing",
      kind: "channel",
      tone: "info",
      label: "频道配对",
      title: "Slack DM 配对码待处理",
      description: "当前还没有 channel.pair.approve RPC，所以先引导管理员通过现有命令完成。",
      detail: "渠道 · Slack · User U04A... · 4 分钟前",
      code: "SLK8M4Q2",
      command: "openclaw pairing approve slack SLK8M4Q2",
      primaryAction: "复制命令",
      secondaryAction: "查看详情"
    }
  ],
  attention: [
    { id: "pairing", title: "发现新设备等待配对", description: "来自 Safari on macOS，需要一次性确认后才能持续访问控制台。", action: "审批设备", tone: "warning", time: "刚刚" },
    { id: "telegram", title: "Telegram 登录未完成", description: "渠道已配置但未完成登录，当前无法接收消息。", action: "继续登录", tone: "danger", time: "5 分钟前" },
    { id: "cron", title: "nightly-sync 任务失败", description: "最近一次运行因模型路由 fallback 失败中断，建议检查自动化配置。", action: "查看任务", tone: "warning", time: "12 分钟前" }
  ],
  quickActions: [
    { id: "chat", title: "开始新会话", description: "进入 Workspace 并创建新聊天。", shortcut: "G C" },
    { id: "workspace", title: "打开工作区", description: "继续当前主会话，查看工具流与侧边配置。", shortcut: "G W" },
    { id: "channels", title: "连接渠道", description: "补全 Telegram、Discord、Slack 等接入。", shortcut: "G H" },
    { id: "logs", title: "查看日志", description: "进入高级诊断页定位失败原因。", shortcut: "G L" }
  ],
  activity: [
    { id: "1", title: "会话 main 已恢复", description: "用户从 Dashboard 进入后可直接继续上一次上下文。", time: "1 分钟前" },
    { id: "2", title: "配置已应用", description: "channels.slack 和 automation.cron 的新配置已经写入并生效。", time: "8 分钟前" },
    { id: "3", title: "Agent tools 目录已刷新", description: "新的 tools catalog 已同步到运行时视图。", time: "21 分钟前" },
    { id: "4", title: "Channels 快照更新", description: "WhatsApp 与 Discord 运行状态已重新拉取。", time: "34 分钟前" }
  ],
  summary: [
    { id: "sessions", label: "活跃会话", value: "12", detail: "其中 4 个最近 30 分钟内有消息" },
    { id: "usage", label: "今日 Tokens", value: "1.28M", detail: "成本约 $18.40，较昨日下降 7%" },
    { id: "skills", label: "启用 Skills", value: "18", detail: "2 个被 allowlist 限制，建议转移到高级区" },
    { id: "nextCron", label: "下次自动化", value: "22:30", detail: "nightly-report 将使用 main session 执行" }
  ],
  navigation: [
    { id: "dashboard", href: "#", icon: "dashboard", label: "Dashboard" },
    { id: "workspace", href: "#", icon: "chat", label: "Workspace" },
    { id: "channels", href: "#", icon: "channels", label: "Channels" },
    { id: "automation", href: "#", icon: "automation", label: "Automation" },
    { id: "agents", href: "#", icon: "agents", label: "Agents" },
    { id: "settings", href: "#", icon: "settings", label: "Settings" }
  ],
  footerLinks: [
    { id: "docs", label: "文档", href: "#" },
    { id: "api", label: "API 规划", href: "#" },
    { id: "design", label: "Design Tokens", href: "#" }
  ]
};

const enUS: DashboardDictionary = {
  productName: "OpenClaw UI",
  workspaceName: "Control Center",
  searchPlaceholder: "Search pages, actions, status, or press /, Ctrl+K, Cmd+K",
  searchHint: "Quick access",
  headerStatus: "Gateway connected and local workspace is healthy",
  headerMeta: {
    versionLabel: "OpenClaw version",
    currentVersion: "v2026.3.13",
    updateLabel: "Update available",
    latestVersion: "v2026.3.14",
    gatewayLabel: "Gateway status",
    gatewayConnectedText: "Gateway connected",
    gatewayDisconnectedText: "Gateway disconnected",
    timestampLabel: "Current time"
  },
  localeLabel: "Language",
  themeLabel: "Theme",
  sidebarSectionLabel: "Main navigation",
  hero: {
    eyebrow: "Dashboard",
    title: "Show whether the system is usable before showing where everything lives",
    description:
      "This dashboard pulls the important parts of chat, sessions, channels, cron, agents, and config into one first screen. Start with readiness, blockers, shortcuts, and recent activity, then drill into detail pages.",
    primaryAction: "Resume Chat",
    secondaryAction: "Resolve Blockers",
    activeContextLabel: "Current main session",
    activeContextValue: "main · claude-sonnet · thinking medium"
  },
  activeSessionsTitle: "Active sessions",
  activeSessionsDescription: "Use this section to scan the sessions still running or waiting right now. It avoids token and cost details and prioritizes state, channel, model, and recency.",
  activeSessionsHint: "The dashboard shows only two rows. Open Workspace to view the full list.",
  pairingTitle: "Pending pairing and authorization",
  pairingDescription: "Unify browser device pairing and channel DM pairing here. Device items can map to gateway approval flows, while channel items currently surface pairing codes and the suggested command.",
  attentionTitle: "Needs attention",
  attentionDescription: "Anything that blocks usage or automation should surface here with a direct action.",
  quickActionsTitle: "Quick actions",
  quickActionsDescription: "High-frequency actions share one button system instead of being redefined by each module.",
  activityTitle: "Recent activity",
  activityDescription: "Use a timeline to combine runtime, configuration, channel, and approval events.",
  summaryTitle: "Operational summary",
  summaryDescription: "Show understandable product metrics here rather than raw JSON snapshots or log streams.",
  footerText: "This Dashboard prototype is designed for localization, theming, and future Gateway API integration.",
  stats: [
    { id: "gateway", label: "Gateway", value: "Online", detail: "127.0.0.1 · last sync 12s ago", tone: "success" },
    { id: "channels", label: "Channels", value: "6 / 8", detail: "2 channels still need auth or config repair", tone: "warning" },
    { id: "approvals", label: "Approvals", value: "3", detail: "2 device pairings and 1 exec approval pending", tone: "warning" },
    { id: "automation", label: "Automation", value: "14", detail: "13 jobs healthy, 1 cron failed recently", tone: "info" }
  ],
  activeSessions: [
    { id: "main-feishu", name: "Lead follow-up", status: "Running", tone: "success", channel: "Feishu", model: "anthropic · claude-sonnet", lastActive: "Just now", action: "Open" },
    { id: "ops-slack", name: "Ops alert triage", status: "Waiting", tone: "warning", channel: "Slack", model: "openai · gpt-5", lastActive: "2 min ago", action: "Open" },
    { id: "support-telegram", name: "Global support desk", status: "Running", tone: "success", channel: "Telegram", model: "anthropic · claude-sonnet", lastActive: "4 min ago", action: "Open" },
    { id: "recruit-wecom", name: "Candidate screening", status: "Idle", tone: "info", channel: "WeCom", model: "openai · gpt-5-mini", lastActive: "11 min ago", action: "Open" },
    { id: "discord-devrel", name: "Developer community replies", status: "Waiting", tone: "warning", channel: "Discord", model: "google · gemini-2.5-pro", lastActive: "17 min ago", action: "Open" },
    { id: "webchat-growth", name: "Website conversion desk", status: "Running", tone: "success", channel: "Web Chat", model: "anthropic · claude-haiku", lastActive: "23 min ago", action: "Open" },
    { id: "imessage-vip", name: "VIP client follow-up", status: "Error", tone: "danger", channel: "iMessage", model: "openai · gpt-5", lastActive: "31 min ago", action: "Open" },
    { id: "slack-finance", name: "Finance daily brief", status: "Idle", tone: "info", channel: "Slack", model: "anthropic · claude-sonnet", lastActive: "44 min ago", action: "Open" }
  ],
  pairings: [
    {
      id: "device-macbook-pro",
      kind: "device",
      tone: "warning",
      label: "Device pairing",
      title: "Safari on macOS requested control access",
      description: "A new browser device is connecting to the Gateway and needs approval before it can keep using the dashboard.",
      detail: "Request ID · req_8f3b2d1c · 1 min ago",
      primaryAction: "Approve device",
      secondaryAction: "Reject"
    },
    {
      id: "device-ipad",
      kind: "device",
      tone: "warning",
      label: "Device pairing",
      title: "iPad Pro requested operator access",
      description: "This device passed identity checks but is not yet in the paired devices list.",
      detail: "Request ID · req_c91a4e82 · 6 min ago",
      primaryAction: "Approve device",
      secondaryAction: "Reject"
    },
    {
      id: "feishu-pairing",
      kind: "channel",
      tone: "info",
      label: "Channel pairing",
      title: "Feishu DM pairing code pending",
      description: "An unknown sender hit DM pairing. The Web UI currently surfaces the code and suggested command instead of one-click approval.",
      detail: "Channel · Feishu · Open ID ou_29f3... · Just now",
      code: "JPD6D53R",
      command: "openclaw pairing approve feishu JPD6D53R",
      primaryAction: "Copy command",
      secondaryAction: "View details"
    },
    {
      id: "slack-pairing",
      kind: "channel",
      tone: "info",
      label: "Channel pairing",
      title: "Slack DM pairing code pending",
      description: "There is no channel.pair.approve RPC yet, so the current flow still points admins to the existing command path.",
      detail: "Channel · Slack · User U04A... · 4 min ago",
      code: "SLK8M4Q2",
      command: "openclaw pairing approve slack SLK8M4Q2",
      primaryAction: "Copy command",
      secondaryAction: "View details"
    }
  ],
  attention: [
    { id: "pairing", title: "New device pairing request detected", description: "Safari on macOS needs one approval before it can keep using the control UI.", action: "Approve device", tone: "warning", time: "Just now" },
    { id: "telegram", title: "Telegram login is incomplete", description: "The channel is configured but cannot receive messages until login finishes.", action: "Continue login", tone: "danger", time: "5 min ago" },
    { id: "cron", title: "nightly-sync failed", description: "The latest run stopped on a model fallback failure and needs an automation review.", action: "Inspect job", tone: "warning", time: "12 min ago" }
  ],
  quickActions: [
    { id: "chat", title: "Start a new chat", description: "Open Workspace and create a fresh session.", shortcut: "G C" },
    { id: "workspace", title: "Open workspace", description: "Continue the current main session with stream and side config.", shortcut: "G W" },
    { id: "channels", title: "Connect channels", description: "Finish Telegram, Discord, Slack, and other integrations.", shortcut: "G H" },
    { id: "logs", title: "Open logs", description: "Jump to advanced diagnostics when something breaks.", shortcut: "G L" }
  ],
  activity: [
    { id: "1", title: "Session main restored", description: "Users can continue the last active context directly from Dashboard.", time: "1 min ago" },
    { id: "2", title: "Configuration applied", description: "New channels.slack and automation.cron values are live.", time: "8 min ago" },
    { id: "3", title: "Agent tools catalog refreshed", description: "The runtime tools view has been synced with the latest catalog.", time: "21 min ago" },
    { id: "4", title: "Channel snapshot updated", description: "WhatsApp and Discord runtime health were pulled again.", time: "34 min ago" }
  ],
  summary: [
    { id: "sessions", label: "Active sessions", value: "12", detail: "4 of them received messages in the last 30 minutes" },
    { id: "usage", label: "Tokens today", value: "1.28M", detail: "Estimated cost $18.40, down 7% from yesterday" },
    { id: "skills", label: "Enabled skills", value: "18", detail: "2 are constrained by allowlists and should stay in advanced mode" },
    { id: "nextCron", label: "Next automation", value: "22:30", detail: "nightly-report will run on the main session" }
  ],
  navigation: [
    { id: "dashboard", href: "#", icon: "dashboard", label: "Dashboard" },
    { id: "workspace", href: "#", icon: "chat", label: "Workspace" },
    { id: "channels", href: "#", icon: "channels", label: "Channels" },
    { id: "automation", href: "#", icon: "automation", label: "Automation" },
    { id: "agents", href: "#", icon: "agents", label: "Agents" },
    { id: "settings", href: "#", icon: "settings", label: "Settings" }
  ],
  footerLinks: [
    { id: "docs", label: "Docs", href: "#" },
    { id: "api", label: "API plan", href: "#" },
    { id: "design", label: "Design tokens", href: "#" }
  ]
};

const dictionaries: Record<Locale, DashboardDictionary> = {
  "zh-CN": zhCN,
  "en-US": enUS
};

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
