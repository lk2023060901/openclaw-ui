import { GATEWAY_LOGS_API_PATH } from "@/lib/gateway/api";

export type GatewayLogApiItem = {
  time: string;
  level: string;
  subsystem: string;
  message: string;
  raw: string;
};

export type GatewayLogsResponse = {
  items: GatewayLogApiItem[];
  count: number;
  next_cursor: string;
  has_more: boolean;
  checked_at: string;
};

export async function fetchGatewayLogs(options?: {
  limit?: number;
  cursor?: string;
  signal?: AbortSignal;
}): Promise<GatewayLogsResponse> {
  const searchParams = new URLSearchParams();
  searchParams.set("limit", String(options?.limit ?? 100));

  if (options?.cursor) {
    searchParams.set("cursor", options.cursor);
  }

  const response = await fetch(`${GATEWAY_LOGS_API_PATH}?${searchParams.toString()}`, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal: options?.signal
  });

  if (!response.ok) {
    throw new Error(`gateway logs request failed: ${response.status}`);
  }

  return (await response.json()) as GatewayLogsResponse;
}
