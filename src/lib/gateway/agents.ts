import { AGENTS_API_PATH } from "@/lib/gateway/api";

export type AgentApiItem = {
  id: string;
  name: string;
  identity_name: string;
  identity_emoji: string;
  identity_avatar_url: string;
  active_session_count: number;
  latest_model_provider: string;
  latest_model: string;
  last_active_at: string;
  primary_session: {
    session_key: string;
    channel: string;
    model_provider: string;
    model: string;
    updated_at: string;
  } | null;
};

export type AgentsResponse = {
  default_id: string;
  main_key: string;
  scope: string;
  items: AgentApiItem[];
  count: number;
  checked_at: string;
};

export type AgentOverviewResponse = {
  title: string;
  subtitle: string;
  workspace: string;
  primaryModel: string;
  skillsFilter: {
    mode: string;
    count: number;
    label: string;
  };
  modelSelection: {
    primary: string;
    isDefault: boolean;
    defaultPrimary: string;
    fallbacks: string[];
  };
  configState: {
    dirty: boolean;
    loading: boolean;
    saving: boolean;
  };
};

export async function fetchAgents(signal?: AbortSignal): Promise<AgentsResponse> {
  const response = await fetch(AGENTS_API_PATH, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`agents request failed: ${response.status}`);
  }

  return (await response.json()) as AgentsResponse;
}

export async function fetchAgentOverview(agentId: string, signal?: AbortSignal): Promise<AgentOverviewResponse> {
  const response = await fetch(`${AGENTS_API_PATH}/${encodeURIComponent(agentId)}/overview`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`agent overview request failed: ${response.status}`);
  }

  return (await response.json()) as AgentOverviewResponse;
}
