import { ACTIVE_SESSIONS_API_PATH } from "@/lib/gateway/api";

export type ActiveSessionStatus = "running" | "ok" | "error" | "timeout";

export type ActiveSessionApiItem = {
  session_key: string;
  title: string;
  channel: string;
  model_provider: string;
  model: string;
  status: ActiveSessionStatus;
  updated_at: string;
  last_to: string | null;
  last_account_id: string | null;
  aborted_last_run: boolean;
};

export type ActiveSessionsResponse = {
  items: ActiveSessionApiItem[];
  count: number;
  checked_at: string;
};

type FetchActiveSessionsParams = {
  activeMinutes?: number;
  limit?: number;
  signal?: AbortSignal;
};

export async function fetchActiveSessions({
  activeMinutes = 180,
  limit = 20,
  signal
}: FetchActiveSessionsParams = {}): Promise<ActiveSessionsResponse> {
  const searchParams = new URLSearchParams({
    active_minutes: String(activeMinutes),
    limit: String(limit)
  });

  const response = await fetch(`${ACTIVE_SESSIONS_API_PATH}?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`active sessions request failed: ${response.status}`);
  }

  return (await response.json()) as ActiveSessionsResponse;
}
