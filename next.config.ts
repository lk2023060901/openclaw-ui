import type { NextConfig } from "next";
import {
  ACTIVE_SESSIONS_API_PATH,
  AGENTS_API_PATH,
  DEFAULT_GATEWAY_API_BASE_URL,
  GATEWAY_LOGS_API_PATH,
  GATEWAY_STATUS_API_PATH,
  MODELS_API_PATH,
  PAIRINGS_API_PATH,
  joinGatewayApiUrl
} from "./src/lib/gateway/api";

const gatewayApiBaseUrl = process.env.GATEWAY_API_BASE_URL?.trim() || DEFAULT_GATEWAY_API_BASE_URL;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: GATEWAY_STATUS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, GATEWAY_STATUS_API_PATH)
      },
      {
        source: GATEWAY_LOGS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, GATEWAY_LOGS_API_PATH)
      },
      {
        source: ACTIVE_SESSIONS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, ACTIVE_SESSIONS_API_PATH)
      },
      {
        source: AGENTS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, AGENTS_API_PATH)
      },
      {
        source: `${AGENTS_API_PATH}/:agentId/overview`,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, `${AGENTS_API_PATH}/:agentId/overview`)
      },
      {
        source: MODELS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, MODELS_API_PATH)
      },
      {
        source: PAIRINGS_API_PATH,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, PAIRINGS_API_PATH)
      },
      {
        source: `${PAIRINGS_API_PATH}/:kind/:requestId/:action`,
        destination: joinGatewayApiUrl(gatewayApiBaseUrl, `${PAIRINGS_API_PATH}/:kind/:requestId/:action`)
      }
    ];
  }
};

export default nextConfig;
