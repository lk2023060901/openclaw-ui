import {
  GATEWAY_STATUS_API_PATH,
  joinGatewayApiUrl
} from "@/lib/gateway/api";

export type GatewayHealthStatus =
  | "healthy"
  | "degraded"
  | "disconnected"
  | "starting"
  | "auth_error";

export type GatewayStatusResponse = {
  status: GatewayHealthStatus;
  connected: boolean;
  gateway_version: string;
  latest_version: string | null;
  update_available: boolean;
  checked_at: string;
  last_heartbeat_at: string | null;
  latency_ms: number | null;
};

function resolveGatewayStatusUrl() {
  const baseUrl = process.env.NEXT_PUBLIC_GATEWAY_API_BASE_URL?.trim();
  if (!baseUrl) {
    return GATEWAY_STATUS_API_PATH;
  }

  return joinGatewayApiUrl(baseUrl, GATEWAY_STATUS_API_PATH);
}

export async function fetchGatewayStatus(signal?: AbortSignal): Promise<GatewayStatusResponse> {
  const response = await fetch(resolveGatewayStatusUrl(), {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`gateway status request failed: ${response.status}`);
  }

  return (await response.json()) as GatewayStatusResponse;
}
