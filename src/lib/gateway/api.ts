export const DEFAULT_GATEWAY_API_BASE_URL = "http://127.0.0.1:18080";

export const GATEWAY_STATUS_API_PATH = "/api/v1/gateway/status";
export const GATEWAY_LOGS_API_PATH = "/api/v1/gateway/logs";
export const ACTIVE_SESSIONS_API_PATH = "/api/v1/sessions/active";
export const PAIRINGS_API_PATH = "/api/v1/pairings";
export const AGENTS_API_PATH = "/api/v1/agents";
export const MODELS_API_PATH = "/api/v1/models";

export function joinGatewayApiUrl(baseUrl: string, path: string) {
  return `${baseUrl.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}
