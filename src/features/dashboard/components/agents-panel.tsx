import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  fetchAgentOverview,
  type AgentOverviewResponse
} from "@/lib/gateway/agents";
import {
  fetchModels,
  type ModelApiItem
} from "@/lib/gateway/models";
import { cn } from "@/lib/utils/cn";
import type { AgentCard } from "@/types/dashboard";

const DEFAULT_FILE_CONTENTS: Record<string, string> = {
  "AGENTS.md": "# AGENTS\n\nDefine the primary responsibilities, communication rules, and escalation boundaries for this agent.\n",
  "SOUL.md": "# SOUL\n\nDescribe the long-term personality, values, and response style of this agent.\n",
  "TOOLS.md": "# TOOLS\n\nList the tools this agent can use, together with permissions and operational constraints.\n",
  "IDENTITY.md": "# IDENTITY\n\nRecord the public-facing name, avatar, and short identity statement.\n",
  "USER.md": "# USER\n\nDocument the target user profile, context, and key operating assumptions.\n",
  "HEARTBEAT.md": "# HEARTBEAT\n\nCapture health check expectations, polling cadence, and failure handling.\n",
  "MEMORY.md": ""
};

const DETAIL_TAB_BASE_CLASS =
  "inline-flex h-10 w-24 items-center justify-center whitespace-nowrap rounded-xl border px-3 text-sm font-medium leading-none transition-colors";

const DETAIL_SUBTAB_BASE_CLASS =
  "inline-flex h-9 w-24 items-center justify-center whitespace-nowrap rounded-full border px-3 text-xs font-semibold leading-none transition-colors";

type ToolProfile = "Minimal" | "Coding" | "Messaging" | "Full" | "Inherit";

type ToolDefinition = {
  id: string;
  name: string;
  description: string;
  source: "CORE" | "PLUGIN";
  pluginLabel?: string;
};

type ToolGroup = {
  id: string;
  label: string;
  tools: ToolDefinition[];
};

const TOOL_GROUPS: ToolGroup[] = [
  {
    id: "files",
    label: "Files",
    tools: [
      { id: "read", name: "read", description: "Read file contents from the workspace.", source: "CORE" },
      { id: "write", name: "write", description: "Write files into the workspace.", source: "CORE" },
      { id: "edit", name: "edit", description: "Edit existing files in place.", source: "CORE" },
      { id: "apply_patch", name: "apply_patch", description: "Apply patch-based file changes.", source: "CORE" }
    ]
  },
  {
    id: "runtime",
    label: "Runtime",
    tools: [
      { id: "exec", name: "exec", description: "Execute commands in the runtime environment.", source: "CORE" },
      { id: "process", name: "process", description: "Inspect and manage running processes.", source: "CORE" }
    ]
  },
  {
    id: "web",
    label: "Web",
    tools: [
      { id: "web_search", name: "web_search", description: "Search the web for fresh information.", source: "CORE" },
      { id: "web_fetch", name: "web_fetch", description: "Fetch and inspect remote web pages.", source: "CORE" }
    ]
  },
  {
    id: "memory",
    label: "Memory",
    tools: [
      { id: "memory_search", name: "memory_search", description: "Search stored memory records.", source: "CORE" },
      { id: "memory_get", name: "memory_get", description: "Read a specific memory record.", source: "CORE" }
    ]
  },
  {
    id: "sessions",
    label: "Sessions",
    tools: [
      { id: "sessions_list", name: "sessions_list", description: "List available sessions.", source: "CORE" },
      { id: "sessions_history", name: "sessions_history", description: "Read session history.", source: "CORE" },
      { id: "sessions_send", name: "sessions_send", description: "Send messages into a session.", source: "CORE" },
      { id: "sessions_spawn", name: "sessions_spawn", description: "Create or branch a session.", source: "CORE" },
      { id: "sessions_yield", name: "sessions_yield", description: "Yield the turn and receive sub-agent results.", source: "CORE" },
      { id: "subagents", name: "subagents", description: "Spawn or coordinate sub-agents.", source: "CORE" },
      { id: "session_status", name: "session_status", description: "Inspect session runtime state.", source: "CORE" }
    ]
  },
  {
    id: "ui",
    label: "UI",
    tools: [
      { id: "browser", name: "browser", description: "Drive browser UI interactions.", source: "CORE" },
      { id: "canvas", name: "canvas", description: "Use canvas-oriented visual tooling.", source: "CORE" }
    ]
  },
  {
    id: "messaging",
    label: "Messaging",
    tools: [{ id: "message", name: "message", description: "Send outbound channel messages.", source: "CORE" }]
  },
  {
    id: "automation",
    label: "Automation",
    tools: [
      { id: "cron", name: "cron", description: "Manage cron and scheduled jobs.", source: "CORE" },
      { id: "gateway", name: "gateway", description: "Operate gateway runtime actions.", source: "CORE" }
    ]
  },
  {
    id: "nodes",
    label: "Nodes",
    tools: [{ id: "nodes", name: "nodes", description: "Inspect and manage connected nodes.", source: "CORE" }]
  },
  {
    id: "agents",
    label: "Agents",
    tools: [{ id: "agents_list", name: "agents_list", description: "Read the multi-agent index.", source: "CORE" }]
  },
  {
    id: "media",
    label: "Media",
    tools: [
      { id: "image", name: "image", description: "Use image-related capabilities.", source: "CORE" },
      { id: "tts", name: "tts", description: "Use text-to-speech capabilities.", source: "CORE" }
    ]
  },
  {
    id: "feishu-bitable",
    label: "Feishu Bitable Ops",
    tools: [
      { id: "bitable_create_app", name: "Bitable Create App", description: "Create a Feishu Bitable app.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_create_field", name: "Bitable Create Field", description: "Create fields in a Feishu Bitable table.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_create_record", name: "Bitable Create Record", description: "Insert records into Feishu Bitable.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_get_meta", name: "Bitable Get Meta", description: "Read Bitable metadata and schema.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_list_fields", name: "Bitable List Fields", description: "List available fields in a Bitable.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_list_records", name: "Bitable List Records", description: "List records in a Bitable table.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" },
      { id: "bitable_update_record", name: "Bitable Update Record", description: "Update existing Bitable records.", source: "PLUGIN", pluginLabel: "Feishu Bitable Ops" }
    ]
  }
];

const ALL_TOOL_IDS = TOOL_GROUPS.flatMap((group) => group.tools.map((tool) => tool.id));

const DEFAULT_ENABLED_TOOL_IDS = new Set([
  "read",
  "write",
  "edit",
  "apply_patch",
  "exec",
  "process",
  "sessions_list",
  "sessions_send",
  "sessions_spawn",
  "canvas"
]);

function createToolAccessMap(enabledIds: Set<string>) {
  return Object.fromEntries(ALL_TOOL_IDS.map((toolId) => [toolId, enabledIds.has(toolId)]));
}

function formatChannelLabel(channel: string) {
  const labels: Record<string, string> = {
    feishu: "Feishu",
    slack: "Slack",
    telegram: "Telegram",
    discord: "Discord",
    webchat: "Web Chat",
    imessage: "iMessage"
  };

  return labels[channel] ?? channel;
}

const TOOL_PRESETS: Record<ToolProfile, Set<string>> = {
  Minimal: new Set(["read", "sessions_list", "session_status"]),
  Coding: new Set([
    "read",
    "write",
    "edit",
    "apply_patch",
    "exec",
    "process",
    "web_search",
    "web_fetch",
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "sessions_spawn",
    "canvas",
    "agents_list"
  ]),
  Messaging: new Set([
    "read",
    "sessions_list",
    "sessions_history",
    "sessions_send",
    "session_status",
    "message",
    "browser",
    "canvas"
  ]),
  Full: new Set(ALL_TOOL_IDS),
  Inherit: new Set(DEFAULT_ENABLED_TOOL_IDS)
};

function visibilityClass(index: number) {
  if (index < 2) {
    return "";
  }

  if (index < 4) {
    return "hidden md:block";
  }

  if (index < 6) {
    return "hidden lg:block";
  }

  if (index < 8) {
    return "hidden xl:block";
  }

  return "hidden";
}

export function AgentsPanel({
  title,
  items,
  loading = false,
  error = false,
  emptyText,
  paginated = true
}: {
  title: string;
  items: AgentCard[];
  loading?: boolean;
  error?: boolean;
  emptyText: string;
  paginated?: boolean;
}) {
  const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(null);
  const [activeDetailTab, setActiveDetailTab] = useState<
    "overview" | "files" | "tools" | "skills" | "channels" | "cron"
  >("overview");
  const [selectedFileName, setSelectedFileName] = useState("AGENTS.md");
  const [savedFileContents, setSavedFileContents] = useState<Record<string, string>>(DEFAULT_FILE_CONTENTS);
  const [draftFileContents, setDraftFileContents] = useState<Record<string, string>>(DEFAULT_FILE_CONTENTS);
  const [isFileEditing, setIsFileEditing] = useState(false);
  const [skillsSourceTab, setSkillsSourceTab] = useState<"workspace" | "clawhub">("workspace");
  const [workspaceSkillsTab, setWorkspaceSkillsTab] = useState<"builtin" | "external">("builtin");
  const [clawhubFilterTab, setClawhubFilterTab] = useState<"all" | "uninstalled" | "installed">("all");
  const [toolSearch, setToolSearch] = useState("");
  const [toolAccess, setToolAccess] = useState<Record<string, boolean>>(() =>
    createToolAccessMap(DEFAULT_ENABLED_TOOL_IDS)
  );
  const [savedToolAccess, setSavedToolAccess] = useState<Record<string, boolean>>(() =>
    createToolAccessMap(DEFAULT_ENABLED_TOOL_IDS)
  );
  const [overviewData, setOverviewData] = useState<AgentOverviewResponse | null>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [overviewError, setOverviewError] = useState(false);
  const [overviewModels, setOverviewModels] = useState<ModelApiItem[]>([]);
  const [overviewModelsError, setOverviewModelsError] = useState(false);
  const [overviewPrimaryModel, setOverviewPrimaryModel] = useState("");
  const [savedOverviewPrimaryModel, setSavedOverviewPrimaryModel] = useState("");
  const [overviewFallbacks, setOverviewFallbacks] = useState<string[]>([]);
  const [savedOverviewFallbacks, setSavedOverviewFallbacks] = useState<string[]>([]);
  const [overviewModelMenuOpen, setOverviewModelMenuOpen] = useState(false);
  const [overviewFallbackMenuOpen, setOverviewFallbackMenuOpen] = useState(false);
  const [toolProfile, setToolProfile] = useState<ToolProfile>("Full");
  const [savedToolProfile, setSavedToolProfile] = useState<ToolProfile>("Full");
  const [toolSource, setToolSource] = useState("global default");
  const [savedToolSource, setSavedToolSource] = useState("global default");
  const [channelsRefreshedAt, setChannelsRefreshedAt] = useState(() => Date.now());
  const [cronRefreshedAt, setCronRefreshedAt] = useState(() => Date.now());
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "idle">("all");
  const [sortMode, setSortMode] = useState<"default" | "name" | "active">("default");
  const [jumpPage, setJumpPage] = useState("");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef<HTMLDivElement | null>(null);
  const overviewModelMenuRef = useRef<HTMLDivElement | null>(null);
  const overviewFallbackMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!filterMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!filterMenuRef.current?.contains(event.target as Node)) {
        setFilterMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [filterMenuOpen]);

  useEffect(() => {
    if (!overviewModelMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!overviewModelMenuRef.current?.contains(event.target as Node)) {
        setOverviewModelMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [overviewModelMenuOpen]);

  useEffect(() => {
    if (!overviewFallbackMenuOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!overviewFallbackMenuRef.current?.contains(event.target as Node)) {
        setOverviewFallbackMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [overviewFallbackMenuOpen]);

  const preparedItems = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    let nextItems = items.filter((item) => {
      if (!keyword) {
        return true;
      }

      return [item.name, item.model, item.channel, item.primarySession, item.id]
        .join(" ")
        .toLowerCase()
        .includes(keyword);
    });

    if (statusFilter === "active") {
      nextItems = nextItems.filter((item) => !item.activeSessionCount.startsWith("0"));
    } else if (statusFilter === "idle") {
      nextItems = nextItems.filter((item) => item.activeSessionCount.startsWith("0"));
    }

    if (sortMode === "name") {
      nextItems = [...nextItems].sort((a, b) => a.name.localeCompare(b.name, "zh-CN"));
    } else if (sortMode === "active") {
      nextItems = [...nextItems].sort((a, b) => {
        const aCount = Number.parseInt(a.activeSessionCount, 10) || 0;
        const bCount = Number.parseInt(b.activeSessionCount, 10) || 0;
        return bCount - aCount;
      });
    }

    return nextItems;
  }, [items, search, sortMode, statusFilter]);

  const pagedItems = useMemo(() => {
    if (!paginated) {
      return items;
    }
    const start = (page - 1) * pageSize;
    return preparedItems.slice(start, start + pageSize);
  }, [items, page, pageSize, paginated, preparedItems]);

  const totalPages = Math.max(1, Math.ceil(preparedItems.length / pageSize));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [pageSize, search, sortMode, statusFilter]);

  useEffect(() => {
    if (selectedAgent) {
      setChannelsRefreshedAt(Date.now());
    }
  }, [selectedAgent]);

  useEffect(() => {
    if (!selectedAgent) {
      return;
    }

    const nextPrimaryModel = selectedAgent.model.replace(/\s*·\s*/g, "/");
    setOverviewPrimaryModel(nextPrimaryModel);
    setSavedOverviewPrimaryModel(nextPrimaryModel);
    setOverviewFallbacks([]);
    setSavedOverviewFallbacks([]);
    setOverviewModelMenuOpen(false);
    setOverviewFallbackMenuOpen(false);
  }, [selectedAgent]);

  const detailTabs = [
    { id: "overview", label: "Overview" },
    { id: "files", label: "Files" },
    { id: "tools", label: "Tools" },
    { id: "skills", label: "Skills" },
    { id: "channels", label: "Channels" },
    { id: "cron", label: "Cron Jobs" }
  ] as const;

  const workspacePath = selectedAgent ? `/Users/liukai/.openclaw/workspace/${selectedAgent.id}-agent` : "";
  const coreFiles = [
    { name: "AGENTS.md", meta: "7.9 KB · 5h ago", status: "ready" },
    { name: "SOUL.md", meta: "1.3 KB · 22h ago", status: "ready" },
    { name: "TOOLS.md", meta: "414 B · 22h ago", status: "ready" },
    { name: "IDENTITY.md", meta: "847 B · 22h ago", status: "ready" },
    { name: "USER.md", meta: "283 B · 22h ago", status: "ready" },
    { name: "HEARTBEAT.md", meta: "1.6 KB · 21h ago", status: "ready" },
    { name: "MEMORY.md", meta: "Missing", status: "missing" }
  ] as const;
  const currentFileMissing = selectedFileName === "MEMORY.md";
  const currentSavedContent = savedFileContents[selectedFileName] ?? "";
  const currentDraftContent = draftFileContents[selectedFileName] ?? "";
  const isCurrentFileDirty = currentDraftContent !== currentSavedContent;
  const workspaceSkills = [
    {
      id: "ws-feishu-doc",
      name: "feishu-doc",
      description: "Feishu document read and write operations for docs, cloud docs, and docx links.",
      source: "workspace",
      category: "external"
    },
    {
      id: "ws-feishu-drive",
      name: "feishu-drive",
      description: "Feishu drive file operations for cloud space, folders, and shared files.",
      source: "workspace",
      category: "external"
    },
    {
      id: "ws-feishu-perm",
      name: "feishu-perm",
      description: "Permission management for documents and files when users mention sharing or collaborators.",
      source: "workspace",
      category: "external"
    },
    {
      id: "ws-browser-control",
      name: "browser-control",
      description: "Built-in browser navigation, capture, and guarded action execution for workspace tasks.",
      source: "workspace",
      category: "builtin"
    },
    {
      id: "ws-exec",
      name: "exec",
      description: "Built-in command execution capability with approval and runtime constraints.",
      source: "workspace",
      category: "builtin"
    }
  ] as const;
  const clawhubSkills = [
    {
      id: "hub-slack-routing",
      name: "slack-routing",
      description: "Channel routing and workspace-specific reply policies for Slack handoffs.",
      installed: true
    },
    {
      id: "hub-telegram-ops",
      name: "telegram-ops",
      description: "Operational helper pack for Telegram support, retries, and media replies.",
      installed: false
    },
    {
      id: "hub-notion-sync",
      name: "notion-sync",
      description: "Read and sync structured knowledge from Notion pages and databases.",
      installed: false
    },
    {
      id: "hub-browser-control",
      name: "browser-control",
      description: "Browser automation actions with guarded navigation and page state capture.",
      installed: true
    }
  ] as const;
  const visibleClawhubSkills = clawhubSkills.filter((item) => {
    if (clawhubFilterTab === "installed") {
      return item.installed;
    }

    if (clawhubFilterTab === "uninstalled") {
      return !item.installed;
    }

    return true;
  });
  const builtinWorkspaceSkills = workspaceSkills.filter((item) => item.category === "builtin");
  const externalWorkspaceSkills = workspaceSkills.filter((item) => item.category === "external");
  const channelItems =
    selectedAgent && selectedAgent.channel && selectedAgent.channel !== "-"
      ? [
          {
            id: selectedAgent.channel,
            label: formatChannelLabel(selectedAgent.channel),
            key: selectedAgent.channel,
            sessionCount: selectedAgent.activeSessionCount,
            primarySession: selectedAgent.primarySession,
            model: selectedAgent.model,
            lastActive: selectedAgent.lastActive
          }
        ]
      : [];
  const agentCronJobs: Array<{
    id: string;
    title: string;
    description: string;
    schedule: string;
    status: string;
    target: string;
    payload: string;
  }> = [];
  const schedulerEnabled = toolAccess.cron;
  const toolKeyword = toolSearch.trim().toLowerCase();
  const visibleToolGroups = TOOL_GROUPS.map((group) => ({
    ...group,
    tools: group.tools.filter((tool) =>
      `${tool.name} ${tool.description}`.toLowerCase().includes(toolKeyword)
    )
  })).filter((group) => group.tools.length > 0);
  const visibleCoreToolGroups = visibleToolGroups.filter((group) =>
    group.tools.some((tool) => tool.source === "CORE")
  );
  const visiblePluginRows = Array.from(
    visibleToolGroups
      .flatMap((group) => group.tools)
      .filter((tool) => tool.source === "PLUGIN")
      .reduce((map, tool) => {
        const key = tool.pluginLabel ?? "Plugin";
        const current = map.get(key) ?? [];
        current.push(tool);
        map.set(key, current);
        return map;
      }, new Map<string, ToolDefinition[]>())
      .entries()
  ).map(([label, tools]) => ({ id: label.toLowerCase().replace(/\s+/g, "-"), label, tools }));
  const totalToolCount = ALL_TOOL_IDS.length;
  const enabledToolCount = ALL_TOOL_IDS.filter((toolId) => toolAccess[toolId]).length;
  const overviewTitle = overviewData?.title ?? "Overview";
  const overviewSubtitle = overviewData?.subtitle ?? "Workspace paths and identity metadata.";
  const overviewWorkspace = overviewData?.workspace ?? workspacePath;
  const overviewPrimaryLabel = overviewData?.primaryModel ?? overviewPrimaryModel;
  const overviewSkillsFilterLabel = overviewData?.skillsFilter.label ?? "all skills";
  const overviewPrimaryFieldLabel = overviewData?.modelSelection.isDefault ? "Primary model (default)" : "Primary model";
  const overviewModelOptions = overviewModels;
  const overviewModelLabelMap = new Map(overviewModels.map((item) => [item.ref, item.label]));
  const selectedOverviewModelLabel =
    overviewModels.find((item) => item.ref === overviewPrimaryModel)?.label ?? overviewPrimaryModel;
  const overviewDirty =
    overviewPrimaryModel !== savedOverviewPrimaryModel ||
    JSON.stringify(overviewFallbacks) !== JSON.stringify(savedOverviewFallbacks);
  const toolsDirty =
    JSON.stringify(toolAccess) !== JSON.stringify(savedToolAccess) ||
    toolProfile !== savedToolProfile ||
    toolSource !== savedToolSource;
  const hasDetailUnsavedChanges = overviewDirty || isCurrentFileDirty || toolsDirty;

  const handleFileSwitch = (nextFileName: string) => {
    if (nextFileName === selectedFileName) {
      return;
    }

    if (isCurrentFileDirty) {
      const shouldSave = window.confirm("当前文件有未保存变更，点击“确定”先保存并切换文件。");
      if (!shouldSave) {
        return;
      }

      setSavedFileContents((current) => ({
        ...current,
        [selectedFileName]: currentDraftContent
      }));
    }

    setSelectedFileName(nextFileName);
    setIsFileEditing(false);
  };

  const applyToolPreset = (preset: ToolProfile) => {
    setToolProfile(preset);
    setToolSource(preset === "Inherit" ? "global default" : "agent override");
    setToolAccess(createToolAccessMap(TOOL_PRESETS[preset]));
  };

  const requestCloseSelectedAgent = () => {
    if (hasDetailUnsavedChanges) {
      const shouldClose = window.confirm(
        "当前页面有未保存更改。建议先保存。点击“确定”关闭，点击“取消”返回继续编辑。"
      );
      if (!shouldClose) {
        return;
      }
    }

    setSelectedAgent(null);
  };

  useEffect(() => {
    if (!selectedAgent) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        requestCloseSelectedAgent();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [hasDetailUnsavedChanges, selectedAgent]);

  const loadOverviewResources = async (agentId: string, agentModel: string, signal?: AbortSignal) => {
    setOverviewLoading(true);
    setOverviewError(false);
    setOverviewModelsError(false);

    try {
      const [overviewResponse, modelsResponse] = await Promise.all([
        fetchAgentOverview(agentId, signal),
        fetchModels(signal)
      ]);
      const fallbackPrimaryModel = agentModel.replace(/\s*·\s*/g, "/");
      const normalizedPrimaryModel =
        overviewResponse.modelSelection?.primary ?? overviewResponse.primaryModel ?? fallbackPrimaryModel;
      const normalizedFallbacks = Array.isArray(overviewResponse.modelSelection?.fallbacks)
        ? overviewResponse.modelSelection.fallbacks
        : [];
      const normalizedOverview: AgentOverviewResponse = {
        title: overviewResponse.title ?? "Overview",
        subtitle: overviewResponse.subtitle ?? "Workspace paths and identity metadata.",
        workspace: overviewResponse.workspace ?? `/Users/liukai/.openclaw/workspace/${agentId}-agent`,
        primaryModel: overviewResponse.primaryModel ?? normalizedPrimaryModel,
        skillsFilter: overviewResponse.skillsFilter ?? {
          mode: "all",
          count: 0,
          label: "all skills"
        },
        modelSelection: {
          primary: normalizedPrimaryModel,
          isDefault: overviewResponse.modelSelection?.isDefault ?? true,
          defaultPrimary: overviewResponse.modelSelection?.defaultPrimary ?? normalizedPrimaryModel,
          fallbacks: normalizedFallbacks
        },
        configState: overviewResponse.configState ?? {
          dirty: false,
          loading: false,
          saving: false
        }
      };

      setOverviewData(normalizedOverview);
      setOverviewModels(modelsResponse.items);
      setOverviewPrimaryModel(normalizedOverview.modelSelection.primary);
      setSavedOverviewPrimaryModel(normalizedOverview.modelSelection.primary);
      setOverviewFallbacks(normalizedOverview.modelSelection.fallbacks);
      setSavedOverviewFallbacks(normalizedOverview.modelSelection.fallbacks);
      setOverviewModelMenuOpen(false);
      setOverviewFallbackMenuOpen(false);
      setOverviewLoading(false);
    } catch (error) {
      console.error("[agent-overview] request failed", error);
      setOverviewData(null);
      setOverviewModels([]);
      setOverviewLoading(false);
      setOverviewError(true);
      setOverviewModelsError(true);
    }
  };

  useEffect(() => {
    if (!selectedAgent || activeDetailTab !== "overview") {
      return;
    }

    let disposed = false;
    const controller = new AbortController();

    void loadOverviewResources(selectedAgent.id, selectedAgent.model, controller.signal).catch(() => {
      if (!disposed) {
        setOverviewLoading(false);
      }
    });

    return () => {
      disposed = true;
      controller.abort();
    };
  }, [activeDetailTab, selectedAgent]);

  return (
    <section className="rounded-[2rem] border border-border-subtle bg-surface/90 p-6 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {paginated ? (
          <>
            <Button className="rounded-xl px-5 py-3">创建智能体</Button>
            <div className="ml-auto flex flex-wrap items-center gap-2">
              <label className="flex min-w-[15rem] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-muted">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="搜索 Agent 名称或 ID"
                  className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                />
              </label>
              <div className="relative" ref={filterMenuRef}>
                <button
                  type="button"
                  onClick={() => setFilterMenuOpen((current) => !current)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition",
                    filterMenuOpen || statusFilter !== "all"
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-subtle bg-surface text-text-secondary hover:bg-surface-muted"
                  )}
                  title="过滤"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                    <path d="M4 5h16l-6 7v5l-4 2v-7z" />
                  </svg>
                </button>

                {filterMenuOpen ? (
                  <div className="absolute right-0 top-12 z-30 w-[18rem] overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-halo">
                    <div className="grid grid-cols-[7rem_1fr]">
                      <div className="border-r border-border-subtle bg-surface-muted/60 p-2">
                        <button
                          type="button"
                          className="flex w-full items-center justify-between rounded-xl bg-surface px-3 py-2 text-sm text-text-primary"
                        >
                          <span>状态</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                            <path d="m9 6 6 6-6 6" />
                          </svg>
                        </button>
                      </div>
                      <div className="p-2">
                        {[
                          { value: "all", label: "全部" },
                          { value: "active", label: "活跃中" },
                          { value: "idle", label: "空闲" }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option.value as "all" | "active" | "idle");
                              setFilterMenuOpen(false);
                            }}
                            className={cn(
                              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                              statusFilter === option.value
                                ? "bg-surface-muted text-accent"
                                : "text-text-primary hover:bg-surface-muted"
                            )}
                          >
                            <span>{option.label}</span>
                            {statusFilter === option.value ? (
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-4 w-4"
                              >
                                <path d="m5 12 4 4 10-10" />
                              </svg>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() =>
                  setSortMode((current) =>
                    current === "default" ? "name" : current === "name" ? "active" : "default"
                  )
                }
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface text-text-secondary transition hover:bg-surface-muted"
                title={sortMode === "default" ? "默认排序" : sortMode === "name" ? "按名称" : "按活跃会话"}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="M8 6h10" />
                  <path d="M8 12h7" />
                  <path d="M8 18h4" />
                  <path d="m4 6 1.5-1.5L7 6" />
                  <path d="M5.5 4.5V19" />
                </svg>
              </button>
            </div>
          </>
        ) : null}
        {!paginated ? <h2 className="text-2xl font-semibold">{title}</h2> : null}
      </div>

      {loading || error || preparedItems.length === 0 ? (
        <div className="mt-4 rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
          {loading ? "正在加载 Agents..." : error ? "Agents 加载失败" : emptyText}
        </div>
      ) : (
        <>
        <div
          className={cn(
            "mt-4 grid gap-4",
            "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {pagedItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "rounded-3xl border border-border-subtle bg-surface-muted/85 p-5",
                !paginated && visibilityClass(index)
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl leading-none">{item.emoji || "AI"}</span>
                    <h3 className="truncate text-lg font-semibold">{item.name}</h3>
                  </div>
                </div>
                <div className="rounded-full bg-info/15 px-3 py-1 text-xs font-semibold text-info">
                  {item.activeSessionCount}
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Model</div>
                  <div className="mt-1 text-sm font-medium text-text-secondary">{item.model}</div>
                </div>

                <div className="rounded-2xl border border-border-subtle/80 bg-surface/80 px-4 py-3">
                  <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Session</div>
                  <div className="mt-1 text-sm font-medium text-text-secondary">{item.channel}</div>
                  <div className="mt-1 truncate text-sm text-text-muted">{item.primarySession}</div>
                </div>

                <div className="flex items-center justify-between gap-3 text-sm">
                  <div>
                    <div className="text-xs uppercase tracking-[0.16em] text-text-muted">Last active</div>
                    <div className="mt-1 font-medium text-text-secondary">{item.lastActive}</div>
                  </div>
                  <Button
                    variant="secondary"
                    className="px-3 py-2"
                    onClick={() => {
                      setSelectedAgent(item);
                      setActiveDetailTab("overview");
                      setSelectedFileName("AGENTS.md");
                      setIsFileEditing(false);
                    }}
                  >
                    {item.action}
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        {paginated ? (
          <div className="mt-4 flex flex-wrap items-center justify-end gap-2 text-sm text-text-muted">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            {Array.from({ length: totalPages }, (_, index) => index + 1)
              .slice(Math.max(0, page - 2), Math.max(0, page - 2) + 3)
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={cn(
                    "inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3",
                    pageNumber === page
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border-subtle bg-surface text-text-primary"
                  )}
                >
                  {pageNumber}
                </button>
              ))}
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
              className="h-10 rounded-xl border border-border-subtle bg-surface px-3 outline-none"
            >
              {[10, 20, 50, 100].map((value) => (
                <option key={value} value={value}>
                  {value} 条/页
                </option>
              ))}
            </select>
            <span>跳至</span>
            <input
              value={jumpPage}
              onChange={(event) => setJumpPage(event.target.value.replace(/[^\d]/g, ""))}
              className="h-10 w-16 rounded-xl border border-border-subtle bg-surface px-3 text-center outline-none"
            />
            <span>页</span>
            <button
              type="button"
              onClick={() => {
                const nextPage = Number(jumpPage);
                if (Number.isFinite(nextPage) && nextPage >= 1 && nextPage <= totalPages) {
                  setPage(nextPage);
                }
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border-subtle bg-surface px-3 text-text-primary"
            >
              跳转
            </button>
          </div>
        ) : null}
        </>
      )}

      {selectedAgent ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/45 p-6 backdrop-blur-sm"
          onClick={requestCloseSelectedAgent}
        >
          <div
            className="w-full max-w-[78rem] overflow-hidden rounded-[2rem] border border-border-subtle bg-surface shadow-halo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-border-subtle px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl leading-none">{selectedAgent.emoji || "AI"}</span>
                <div>
                  <div className="text-lg font-semibold text-text-primary">{selectedAgent.name}</div>
                  <div className="text-sm text-text-muted">{selectedAgent.id}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={requestCloseSelectedAgent}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border-subtle bg-surface-muted text-text-secondary transition hover:text-text-primary"
                aria-label="关闭"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                  <path d="m6 6 12 12" />
                  <path d="m18 6-12 12" />
                </svg>
              </button>
            </div>

            <div className="border-b border-border-subtle px-6 py-3">
              <div className="flex flex-wrap gap-2">
                {detailTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDetailTab(tab.id)}
                    className={cn(
                      DETAIL_TAB_BASE_CLASS,
                      activeDetailTab === tab.id
                        ? "border-accent bg-accent text-slate-950 shadow-card"
                        : "border-border-subtle bg-surface text-text-secondary hover:text-text-primary"
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-[34rem] overflow-hidden p-6">
              <div className="hide-scrollbar h-full overflow-y-auto pr-1">
              {activeDetailTab === "overview" ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-text-primary">{overviewTitle}</h3>
                    <p className="mt-2 text-sm text-text-muted">{overviewSubtitle}</p>
                  </div>

                  {overviewLoading ? (
                    <div className="rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
                      正在加载 Overview...
                    </div>
                  ) : overviewError ? (
                    <div className="rounded-3xl border border-dashed border-border-subtle bg-surface-muted/70 px-6 py-10 text-sm text-text-muted">
                      Overview 加载失败
                    </div>
                  ) : (
                    <>
                      <div className="grid gap-6 xl:grid-cols-3">
                        <button
                          type="button"
                          onClick={() => setActiveDetailTab("files")}
                          className="min-w-0 text-left transition hover:text-accent"
                        >
                          <div className="text-sm text-text-muted">Workspace</div>
                          <div className="mt-2 break-all font-mono text-base font-semibold text-accent">
                            {overviewWorkspace}
                          </div>
                        </button>
                        <div className="min-w-0">
                          <div className="text-sm text-text-muted">Primary Model</div>
                          <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                            {overviewPrimaryLabel}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm text-text-muted">Skills Filter</div>
                          <div className="mt-2 text-base font-semibold text-text-primary">{overviewSkillsFilterLabel}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-sm font-medium text-text-muted">Model Selection</div>
                        <div>
                          <div className="text-sm text-text-muted">{overviewPrimaryFieldLabel}</div>
                          <div className="relative mt-2" ref={overviewModelMenuRef}>
                            <button
                              type="button"
                              onClick={() => setOverviewModelMenuOpen((current) => !current)}
                              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-left text-sm text-text-primary transition hover:border-accent/35"
                            >
                              <span className="truncate font-medium">{selectedOverviewModelLabel}</span>
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className={cn(
                                  "h-4 w-4 shrink-0 text-text-muted transition-transform",
                                  overviewModelMenuOpen ? "rotate-180" : ""
                                )}
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </button>

                            {overviewModelMenuOpen ? (
                              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-halo">
                                <div className="max-h-64 overflow-y-auto p-2">
                                  {overviewModels.length > 0 ? (
                                    overviewModels.map((option) => {
                                      const selected = option.ref === overviewPrimaryModel;
                                      return (
                                        <button
                                          key={option.ref}
                                          type="button"
                                          onClick={() => {
                                            setOverviewPrimaryModel(option.ref);
                                            setOverviewModelMenuOpen(false);
                                          }}
                                          className={cn(
                                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                                            selected
                                              ? "bg-accent/10 text-accent"
                                              : "text-text-primary hover:bg-surface-muted"
                                          )}
                                        >
                                          <span className="truncate">{option.label}</span>
                                          {selected ? (
                                            <svg
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2"
                                              className="ml-3 h-4 w-4 shrink-0"
                                            >
                                              <path d="m5 12 4 4 10-10" />
                                            </svg>
                                          ) : null}
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="px-3 py-3 text-sm text-text-muted">暂无可选模型</div>
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div>
                          <div className="text-sm text-text-muted">Fallbacks</div>
                          <div className="relative mt-2" ref={overviewFallbackMenuRef}>
                            <button
                              type="button"
                              onClick={() => setOverviewFallbackMenuOpen((current) => !current)}
                              className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-border-subtle bg-surface px-4 py-3 text-left text-sm text-text-primary transition hover:border-accent/35"
                            >
                              <div className="flex min-w-0 flex-1 flex-wrap gap-2">
                                {overviewFallbacks.length > 0 ? (
                                  overviewFallbacks.map((item) => (
                                    <span
                                      key={item}
                                      className="inline-flex max-w-full items-center rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary"
                                    >
                                      <span className="truncate">{overviewModelLabelMap.get(item) ?? item}</span>
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-text-muted">请选择回退模型</span>
                                )}
                              </div>
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className={cn(
                                  "h-4 w-4 shrink-0 text-text-muted transition-transform",
                                  overviewFallbackMenuOpen ? "rotate-180" : ""
                                )}
                              >
                                <path d="m6 9 6 6 6-6" />
                              </svg>
                            </button>

                            {overviewFallbackMenuOpen ? (
                              <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-20 overflow-hidden rounded-2xl border border-border-subtle bg-surface shadow-halo">
                                <div className="max-h-64 overflow-y-auto p-2">
                                  {overviewModelOptions.length > 0 ? (
                                    overviewModelOptions.map((option) => {
                                      const selected = overviewFallbacks.includes(option.ref);
                                      return (
                                        <button
                                          key={option.ref}
                                          type="button"
                                          onClick={() =>
                                            setOverviewFallbacks((current) =>
                                              current.includes(option.ref)
                                                ? current.filter((item) => item !== option.ref)
                                                : [...current, option.ref]
                                            )
                                          }
                                          className={cn(
                                            "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition",
                                            selected
                                              ? "bg-accent/10 text-accent"
                                              : "text-text-primary hover:bg-surface-muted"
                                          )}
                                        >
                                          <span className="truncate">{option.label}</span>
                                          <span
                                            className={cn(
                                              "ml-3 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                                              selected
                                                ? "border-accent bg-accent text-slate-950"
                                                : "border-border-subtle bg-surface text-transparent"
                                            )}
                                          >
                                            <svg
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2.2"
                                              className="h-3.5 w-3.5"
                                            >
                                              <path d="m5 12 4 4 10-10" />
                                            </svg>
                                          </span>
                                        </button>
                                      );
                                    })
                                  ) : (
                                    <div className="px-3 py-3 text-sm text-text-muted">暂无可选回退模型</div>
                                  )}
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                          <Button
                            variant="secondary"
                            className="px-4 py-2"
                            onClick={() =>
                              selectedAgent
                                ? void loadOverviewResources(selectedAgent.id, selectedAgent.model)
                                : undefined
                            }
                          >
                            Reload Config
                          </Button>
                          <Button
                            className="px-4 py-2"
                            onClick={() => {
                              setSavedOverviewPrimaryModel(overviewPrimaryModel);
                              setSavedOverviewFallbacks(overviewFallbacks);
                              setOverviewFallbackMenuOpen(false);
                            }}
                          >
                            Save
                          </Button>
                          {overviewModelsError ? (
                            <span className="rounded-full bg-danger/10 px-3 py-1 text-xs font-semibold text-danger">
                              Models 加载失败
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : activeDetailTab === "files" ? (
                <div className="space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">Core Files</h3>
                      <p className="mt-2 text-sm text-text-muted">Bootstrap persona, identity, and tool guidance.</p>
                      <div className="mt-3 text-sm text-text-muted">
                        Workspace:
                        <span className="ml-2 break-all font-mono text-text-primary">{workspacePath}</span>
                      </div>
                    </div>
                    <Button variant="secondary" className="px-4 py-2">
                      Refresh
                    </Button>
                  </div>

                  <div className="grid min-h-[28rem] gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
                    <div className="rounded-3xl border border-border-subtle bg-surface-muted/45 p-3">
                      <div className="space-y-2">
                        {coreFiles.map((file) => (
                          <button
                            key={file.name}
                            type="button"
                            onClick={() => handleFileSwitch(file.name)}
                            className={cn(
                              "flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                              selectedFileName === file.name
                                ? "border-accent/30 bg-surface text-text-primary"
                                : "border-transparent bg-surface/70 text-text-secondary hover:border-border-subtle"
                            )}
                          >
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{file.name}</div>
                              <div className="mt-1 text-xs text-text-muted">{file.meta}</div>
                            </div>
                            {file.status === "missing" ? (
                              <span className="ml-3 shrink-0 rounded-full border border-warning/40 bg-warning/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-warning">
                                Missing
                              </span>
                            ) : null}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-3xl border border-border-subtle bg-surface-muted/45 p-5">
                      <div className="mb-4 flex items-center justify-end gap-2">
                        {isCurrentFileDirty ? (
                          <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-semibold text-warning">
                            未保存
                          </span>
                        ) : null}
                        {isFileEditing ? (
                          <>
                            <Button
                              variant="secondary"
                              className="px-4 py-2"
                              onClick={() => {
                                setDraftFileContents((current) => ({
                                  ...current,
                                  [selectedFileName]: currentSavedContent
                                }));
                                setIsFileEditing(false);
                              }}
                            >
                              取消
                            </Button>
                            <Button
                              className="px-4 py-2"
                              onClick={() => {
                                setSavedFileContents((current) => ({
                                  ...current,
                                  [selectedFileName]: currentDraftContent
                                }));
                                setIsFileEditing(false);
                              }}
                            >
                              保存
                            </Button>
                          </>
                        ) : null}
                      </div>

                      <div
                        role="button"
                        tabIndex={currentFileMissing ? -1 : 0}
                        onClick={() => {
                          if (!currentFileMissing) {
                            setIsFileEditing(true);
                          }
                        }}
                        onKeyDown={(event) => {
                          if (!currentFileMissing && (event.key === "Enter" || event.key === " ")) {
                            event.preventDefault();
                            setIsFileEditing(true);
                          }
                        }}
                        className={cn(
                          "min-h-[22rem] rounded-3xl border border-border-subtle bg-surface p-5 text-sm text-text-muted",
                          currentFileMissing ? "cursor-not-allowed opacity-80" : "cursor-text"
                        )}
                      >
                        {currentFileMissing ? (
                          "文件缺失，当前工作目录下未找到该文件。"
                        ) : isFileEditing ? (
                          <textarea
                            value={currentDraftContent}
                            onChange={(event) =>
                              setDraftFileContents((current) => ({
                                ...current,
                                [selectedFileName]: event.target.value
                              }))
                            }
                            className="h-[22rem] w-full resize-none bg-transparent font-mono leading-7 text-text-primary outline-none"
                            spellCheck={false}
                            autoFocus
                          />
                        ) : (
                          <pre className="whitespace-pre-wrap break-words font-mono leading-7 text-text-primary">
                            {currentSavedContent}
                          </pre>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : activeDetailTab === "skills" ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">Skills</h3>
                      <p className="mt-2 text-sm text-text-muted">Per-agent skills and ClawHub packages.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="secondary" className="px-4 py-2">
                        Refresh
                      </Button>
                      <Button className="px-4 py-2">Save</Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { id: "workspace", label: "Workspace" },
                      { id: "clawhub", label: "ClawHub" }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setSkillsSourceTab(tab.id as "workspace" | "clawhub")}
                        className={cn(
                          DETAIL_TAB_BASE_CLASS,
                          skillsSourceTab === tab.id
                            ? "border-accent bg-accent text-slate-950 shadow-card"
                            : "border-border-subtle bg-surface text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-4">
                    {skillsSourceTab === "clawhub" ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: "all", label: "全部" },
                          { id: "uninstalled", label: "未安装" },
                          { id: "installed", label: "已安装" }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setClawhubFilterTab(tab.id as "all" | "uninstalled" | "installed")}
                            className={cn(
                            DETAIL_SUBTAB_BASE_CLASS,
                            clawhubFilterTab === tab.id
                              ? "border-accent bg-accent text-slate-950 shadow-card"
                              : "border-border-subtle bg-surface text-text-secondary hover:text-text-primary"
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: "builtin", label: "内置技能" },
                          { id: "external", label: "外部技能" }
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setWorkspaceSkillsTab(tab.id as "builtin" | "external")}
                            className={cn(
                            DETAIL_SUBTAB_BASE_CLASS,
                            workspaceSkillsTab === tab.id
                              ? "border-accent bg-accent text-slate-950 shadow-card"
                              : "border-border-subtle bg-surface text-text-secondary hover:text-text-primary"
                            )}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="mt-4 space-y-3">
                      {skillsSourceTab === "workspace"
                        ? (workspaceSkillsTab === "builtin" ? builtinWorkspaceSkills : externalWorkspaceSkills).map(
                            (item) => (
                              <div
                                key={item.id}
                                className="flex items-start justify-between gap-4 rounded-3xl border border-border-subtle bg-surface px-5 py-4"
                              >
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="text-base font-semibold text-text-primary">{item.name}</h4>
                                    <span className="rounded-full border border-border-subtle bg-surface-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                                      {workspaceSkillsTab === "builtin" ? "Built-in" : "Workspace"}
                                    </span>
                                  </div>
                                  <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{item.description}</p>
                                </div>
                                <Button variant="secondary" className="px-4 py-2">
                                  配置
                                </Button>
                              </div>
                            )
                          )
                        : visibleClawhubSkills.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-start justify-between gap-4 rounded-3xl border border-border-subtle bg-surface px-5 py-4"
                            >
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h4 className="text-base font-semibold text-text-primary">{item.name}</h4>
                                  <span className="rounded-full border border-border-subtle bg-surface-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                                    ClawHub
                                  </span>
                                  <span
                                    className={cn(
                                      "rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em]",
                                      item.installed
                                        ? "bg-success/10 text-success"
                                        : "bg-surface-muted text-text-muted"
                                    )}
                                  >
                                    {item.installed ? "已安装" : "未安装"}
                                  </span>
                                </div>
                                <p className="mt-2 max-w-3xl text-sm leading-6 text-text-muted">{item.description}</p>
                              </div>
                              <Button
                                variant={item.installed ? "secondary" : "primary"}
                                className="px-4 py-2"
                              >
                                {item.installed ? "管理" : "安装"}
                              </Button>
                            </div>
                          ))}
                    </div>
                  </div>
                </div>
              ) : activeDetailTab === "tools" ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">Tool Access</h3>
                      <p className="mt-2 text-sm text-text-muted">
                        当前展示的是该 Agent 最终生效的工具权限结果，已启用 {enabledToolCount} / {totalToolCount} 个工具。
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={() => {
                          setToolAccess(createToolAccessMap(new Set(ALL_TOOL_IDS)));
                          setToolSource("agent override");
                        }}
                      >
                        Enable All
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={() => {
                          setToolAccess(createToolAccessMap(new Set()));
                          setToolSource("agent override");
                        }}
                      >
                        Disable All
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={() => {
                          setToolAccess(createToolAccessMap(DEFAULT_ENABLED_TOOL_IDS));
                          setToolProfile("Inherit");
                          setToolSource("global default");
                        }}
                      >
                        Reset
                      </Button>
                      <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={() => {
                          setToolAccess(savedToolAccess);
                          setToolProfile(savedToolProfile);
                          setToolSource(savedToolSource);
                        }}
                      >
                        Reload Config
                      </Button>
                      <Button
                        className="px-4 py-2"
                        onClick={() => {
                          setSavedToolAccess(toolAccess);
                          setSavedToolProfile(toolProfile);
                          setSavedToolSource(toolSource);
                        }}
                      >
                        Save
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-info/30 bg-info/10 px-4 py-3 text-sm text-info">
                    该 Agent 当前使用显式白名单结果。页面展示的是合并后的最终权限；如果配置被策略锁定，应回到配置来源继续调整。
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-3xl border border-border-subtle bg-surface-muted/45 p-5">
                      <div className="text-sm text-text-muted">Profile</div>
                      <div className="mt-2 text-base font-semibold text-text-primary">{toolProfile}</div>
                    </div>
                    <div className="rounded-3xl border border-border-subtle bg-surface-muted/45 p-5">
                      <div className="text-sm text-text-muted">Source</div>
                      <div className="mt-2 text-base font-semibold text-text-primary">{toolSource}</div>
                    </div>
                    <div className="rounded-3xl border border-border-subtle bg-surface-muted/45 p-5">
                      <div className="text-sm text-text-muted">Status</div>
                      <div className="mt-2 text-base font-semibold text-text-primary">
                        {toolsDirty ? "Unsaved changes" : "Synced"}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {(["Minimal", "Coding", "Messaging", "Full", "Inherit"] as ToolProfile[]).map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => applyToolPreset(preset)}
                        className={cn(
                          DETAIL_SUBTAB_BASE_CLASS,
                          toolProfile === preset
                            ? "border-accent bg-accent text-slate-950 shadow-card"
                            : "border-border-subtle bg-surface text-text-secondary hover:text-text-primary"
                        )}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <label className="flex min-w-[18rem] items-center gap-2 rounded-xl border border-border-subtle bg-surface px-3 py-2 text-sm text-text-muted">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-3.5-3.5" />
                      </svg>
                      <input
                        value={toolSearch}
                        onChange={(event) => setToolSearch(event.target.value)}
                        placeholder="Search tools"
                        className="w-full bg-transparent text-text-primary outline-none placeholder:text-text-muted"
                      />
                    </label>
                    <div className="text-sm text-text-muted">
                      {visibleToolGroups.reduce((count, group) => count + group.tools.length, 0)} shown
                    </div>
                  </div>

                  <div className="space-y-4">
                    {visibleCoreToolGroups.map((group) => {
                      const enabledInGroup = group.tools.filter((tool) => toolAccess[tool.id]).length;

                      return (
                        <section
                          key={group.id}
                          className="rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-4"
                        >
                          <div className="mb-4 flex items-center justify-between gap-4">
                            <div>
                              <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                                {group.label}
                              </h4>
                            </div>
                            <div className="text-sm text-text-muted">
                              {enabledInGroup} / {group.tools.length}
                            </div>
                          </div>

                          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                            {group.tools.map((tool) => (
                              <div
                                key={tool.id}
                                className="rounded-3xl border border-border-subtle bg-surface px-4 py-4"
                              >
                                <div className="flex items-start justify-between gap-4">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <div className="text-sm font-semibold text-text-primary">{tool.name}</div>
                                      <span className="rounded-full border border-border-subtle bg-surface-muted px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                                        {tool.source}
                                      </span>
                                    </div>
                                    <p className="mt-2 text-xs leading-5 text-text-muted">{tool.description}</p>
                                  </div>

                                  <button
                                    type="button"
                                    aria-pressed={toolAccess[tool.id]}
                                    onClick={() => {
                                      setToolAccess((current) => ({
                                        ...current,
                                        [tool.id]: !current[tool.id]
                                      }));
                                      setToolSource("agent override");
                                    }}
                                    className={cn(
                                      "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition",
                                      toolAccess[tool.id]
                                        ? "border-success/40 bg-success/20"
                                        : "border-border-subtle bg-surface-muted"
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                                        toolAccess[tool.id] ? "translate-x-6" : "translate-x-1"
                                      )}
                                    />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      );
                    })}

                    {visiblePluginRows.length > 0 ? (
                      <section className="rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-4">
                        <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                          插件列表
                        </div>

                        <div className="space-y-4">
                          {visiblePluginRows.map((plugin) => {
                            const enabledInPlugin = plugin.tools.filter((tool) => toolAccess[tool.id]).length;

                            return (
                              <div
                                key={plugin.id}
                                className="rounded-[1.5rem] border border-border-subtle bg-surface px-5 py-4"
                              >
                                <div className="mb-4 flex items-center justify-between gap-4">
                                  <h4 className="text-sm font-semibold uppercase tracking-[0.16em] text-text-muted">
                                    {plugin.label}
                                  </h4>
                                  <div className="text-sm text-text-muted">
                                    {enabledInPlugin} / {plugin.tools.length}
                                  </div>
                                </div>

                                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                                  {plugin.tools.map((tool) => (
                                    <div
                                      key={tool.id}
                                      className="rounded-3xl border border-border-subtle bg-surface-muted/45 px-4 py-4"
                                    >
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <div className="text-sm font-semibold text-text-primary">{tool.name}</div>
                                            <span className="rounded-full border border-border-subtle bg-surface px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                                              {tool.source}
                                            </span>
                                          </div>
                                          <p className="mt-2 text-xs leading-5 text-text-muted">{tool.description}</p>
                                        </div>

                                        <button
                                          type="button"
                                          aria-pressed={toolAccess[tool.id]}
                                          onClick={() => {
                                            setToolAccess((current) => ({
                                              ...current,
                                              [tool.id]: !current[tool.id]
                                            }));
                                            setToolSource("agent override");
                                          }}
                                          className={cn(
                                            "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full border transition",
                                            toolAccess[tool.id]
                                              ? "border-success/40 bg-success/20"
                                              : "border-border-subtle bg-surface"
                                          )}
                                        >
                                          <span
                                            className={cn(
                                              "inline-block h-5 w-5 rounded-full bg-white shadow-sm transition",
                                              toolAccess[tool.id] ? "translate-x-6" : "translate-x-1"
                                            )}
                                          />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ) : null}
                  </div>
                </div>
              ) : activeDetailTab === "channels" ? (
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                  <section className="h-full rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-5">
                    <h3 className="text-xl font-semibold text-text-primary">Agent Context</h3>
                    <p className="mt-2 text-sm text-text-muted">Workspace, identity, and model configuration.</p>

                    <div className="mt-6 grid gap-5 md:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => setActiveDetailTab("files")}
                        className="rounded-3xl border border-border-subtle bg-surface px-4 py-4 text-left transition hover:border-accent/35 hover:bg-surface-muted"
                      >
                        <div className="text-sm text-text-muted">Workspace</div>
                        <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                          {workspacePath}
                        </div>
                      </button>
                      <div>
                        <div className="text-sm text-text-muted">Primary Model</div>
                        <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                          {selectedAgent.model}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Identity Name</div>
                        <div className="mt-2 text-base font-semibold text-text-primary">{selectedAgent.name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Identity Avatar</div>
                        <div className="mt-2 text-base font-semibold text-text-primary">
                          {selectedAgent.emoji || "—"}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Primary Session</div>
                        <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                          {selectedAgent.primarySession}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-muted">Last Active</div>
                        <div className="mt-2 text-base font-semibold text-text-primary">{selectedAgent.lastActive}</div>
                      </div>
                    </div>
                  </section>

                  <section className="h-full rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-text-primary">Channels</h3>
                        <p className="mt-2 text-sm text-text-muted">Agent-linked channel status snapshot.</p>
                        <div className="mt-3 text-sm text-text-muted">
                          Last refresh: {new Intl.DateTimeFormat("zh-CN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false
                          }).format(new Date(channelsRefreshedAt))}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        className="px-4 py-2"
                        onClick={() => setChannelsRefreshedAt(Date.now())}
                      >
                        Refresh
                      </Button>
                    </div>

                    <div className="mt-6 space-y-3">
                      {channelItems.length > 0 ? (
                        channelItems.map((channel) => (
                          <div
                            key={channel.id}
                            className="rounded-3xl border border-border-subtle bg-surface px-5 py-4"
                          >
                            <div className="text-lg font-semibold text-text-primary">{channel.label}</div>
                            <div className="mt-1 text-sm text-text-muted">{channel.key}</div>

                            <div className="mt-5 grid gap-4 text-sm md:grid-cols-2">
                              <div>
                                <div className="text-text-muted">Active Sessions</div>
                                <div className="mt-1 font-semibold text-text-primary">{channel.sessionCount}</div>
                              </div>
                              <div>
                                <div className="text-text-muted">Primary Model</div>
                                <div className="mt-1 break-all font-mono text-text-primary">{channel.model}</div>
                              </div>
                              <div className="md:col-span-2">
                                <div className="text-text-muted">Primary Session</div>
                                <div className="mt-1 break-all font-mono text-text-primary">
                                  {channel.primarySession}
                                </div>
                              </div>
                              <div>
                                <div className="text-text-muted">Last Active</div>
                                <div className="mt-1 font-semibold text-text-primary">{channel.lastActive}</div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="rounded-3xl border border-dashed border-border-subtle bg-surface px-5 py-10 text-sm text-text-muted">
                          当前 Agent 没有关联频道。
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              ) : activeDetailTab === "cron" ? (
                <div className="space-y-4">
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
                    <section className="h-full rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-5">
                      <h3 className="text-xl font-semibold text-text-primary">Agent Context</h3>
                      <p className="mt-2 text-sm text-text-muted">Workspace and scheduling targets.</p>

                      <div className="mt-6 grid gap-5 md:grid-cols-2">
                        <button
                          type="button"
                          onClick={() => setActiveDetailTab("files")}
                          className="rounded-3xl border border-border-subtle bg-surface px-4 py-4 text-left transition hover:border-accent/35 hover:bg-surface-muted"
                        >
                          <div className="text-sm text-text-muted">Workspace</div>
                          <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                            {workspacePath}
                          </div>
                        </button>
                        <div>
                          <div className="text-sm text-text-muted">Primary Model</div>
                          <div className="mt-2 break-all font-mono text-base font-semibold text-text-primary">
                            {selectedAgent.model}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-text-muted">Identity Name</div>
                          <div className="mt-2 text-base font-semibold text-text-primary">{selectedAgent.name}</div>
                        </div>
                        <div>
                          <div className="text-sm text-text-muted">Identity Avatar</div>
                          <div className="mt-2 text-base font-semibold text-text-primary">—</div>
                        </div>
                        <div>
                          <div className="text-sm text-text-muted">Skills Filter</div>
                          <div className="mt-2 text-base font-semibold text-text-primary">all skills</div>
                        </div>
                        <div>
                          <div className="text-sm text-text-muted">Default</div>
                          <div className="mt-2 text-base font-semibold text-text-primary">
                            {selectedAgent.isDefault ? "yes" : "no"}
                          </div>
                        </div>
                      </div>
                    </section>

                    <section className="h-full rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-text-primary">Scheduler</h3>
                          <p className="mt-2 text-sm text-text-muted">Gateway cron status.</p>
                        </div>
                        <Button
                          variant="secondary"
                          className="px-4 py-2"
                          onClick={() => setCronRefreshedAt(Date.now())}
                        >
                          Refresh
                        </Button>
                      </div>

                      <div className="mt-6 grid gap-4 md:grid-cols-3">
                        <div className="rounded-3xl border border-border-subtle bg-surface px-4 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Enabled</div>
                          <div className="mt-3 text-3xl font-semibold text-text-primary">
                            {schedulerEnabled ? "Yes" : "No"}
                          </div>
                        </div>
                        <div className="rounded-3xl border border-border-subtle bg-surface px-4 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Jobs</div>
                          <div className="mt-3 text-3xl font-semibold text-text-primary">{agentCronJobs.length}</div>
                        </div>
                        <div className="rounded-3xl border border-border-subtle bg-surface px-4 py-4">
                          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">Next wake</div>
                          <div className="mt-3 text-3xl font-semibold text-text-primary">n/a</div>
                        </div>
                      </div>

                      <div className="mt-5 text-sm text-text-muted">
                        Last refresh: {new Intl.DateTimeFormat("zh-CN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false
                        }).format(new Date(cronRefreshedAt))}
                      </div>
                    </section>
                  </div>

                  <section className="rounded-[1.75rem] border border-border-subtle bg-surface-muted/28 p-5">
                    <h3 className="text-xl font-semibold text-text-primary">Agent Cron Jobs</h3>
                    <p className="mt-2 text-sm text-text-muted">Scheduled jobs targeting this agent.</p>

                    <div className="mt-6">
                      {agentCronJobs.length > 0 ? (
                        <div className="space-y-3">
                          {agentCronJobs.map((job) => (
                            <div
                              key={job.id}
                              className="rounded-3xl border border-border-subtle bg-surface px-5 py-4"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                  <div className="text-base font-semibold text-text-primary">{job.title}</div>
                                  <p className="mt-2 text-sm leading-6 text-text-muted">{job.description}</p>
                                  <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                                    <div>
                                      <div className="text-text-muted">Schedule</div>
                                      <div className="mt-1 font-mono text-text-primary">{job.schedule}</div>
                                    </div>
                                    <div>
                                      <div className="text-text-muted">Status</div>
                                      <div className="mt-1 font-semibold text-text-primary">{job.status}</div>
                                    </div>
                                    <div>
                                      <div className="text-text-muted">Target</div>
                                      <div className="mt-1 break-all font-mono text-text-primary">{job.target}</div>
                                    </div>
                                    <div>
                                      <div className="text-text-muted">Payload</div>
                                      <div className="mt-1 break-all font-mono text-text-primary">{job.payload}</div>
                                    </div>
                                  </div>
                                </div>
                                <Button variant="secondary" className="px-4 py-2">
                                  Run Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-dashed border-border-subtle bg-surface px-5 py-10 text-sm text-text-muted">
                          No jobs assigned.
                        </div>
                      )}
                    </div>
                  </section>
                </div>
              ) : (
                <div className="rounded-3xl border border-dashed border-border-subtle bg-surface-muted/55 px-6 py-12 text-sm text-text-muted">
                  {detailTabs.find((tab) => tab.id === activeDetailTab)?.label} 暂未接入真实数据。
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
