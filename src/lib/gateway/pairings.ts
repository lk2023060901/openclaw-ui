import { PAIRINGS_API_PATH } from "@/lib/gateway/api";

export type PairingKind = "device" | "node" | "channel_dm";
export type PairingStatus = "pending" | "approved" | "rejected" | "expired";

export type PairingApiItem = {
  kind: PairingKind;
  id: string;
  title: string;
  status: PairingStatus;
  created_at: string;
  expires_at: string;
  meta: {
    request_id: string;
    device_id: string;
    platform: string;
    version: string;
    role: string;
    requested_scopes: string[];
    node_id: string;
    display_name: string;
    device_family: string;
    model_identifier: string;
    remote_ip: string;
    caps: string[];
    channel: string;
    sender_id: string;
    account_id: string;
    pairing_code: string;
    approve_command: string;
  };
  actions: {
    approvable: boolean;
    rejectable: boolean;
  };
};

export type PairingsResponse = {
  items: PairingApiItem[];
  count: number;
  checked_at: string;
};

export type PairingActionResult = {
  ok: boolean;
};

export async function fetchPairings(
  options?: {
    kind?: PairingKind;
    signal?: AbortSignal;
  }
): Promise<PairingsResponse> {
  const searchParams = new URLSearchParams();
  if (options?.kind) {
    searchParams.set("kind", options.kind);
  }

  const requestPath = searchParams.size > 0 ? `${PAIRINGS_API_PATH}?${searchParams.toString()}` : PAIRINGS_API_PATH;

  const response = await fetch(requestPath, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal: options?.signal
  });

  if (!response.ok) {
    throw new Error(`pairings request failed: ${response.status}`);
  }

  return (await response.json()) as PairingsResponse;
}

export async function approvePairing(kind: Extract<PairingKind, "device" | "node">, requestId: string) {
  return await postPairingAction(kind, requestId, "approve");
}

export async function rejectPairing(kind: Extract<PairingKind, "device" | "node">, requestId: string) {
  return await postPairingAction(kind, requestId, "reject");
}

async function postPairingAction(
  kind: Extract<PairingKind, "device" | "node">,
  requestId: string,
  action: "approve" | "reject"
): Promise<PairingActionResult> {
  const response = await fetch(`${PAIRINGS_API_PATH}/${kind}/${requestId}/${action}`, {
    method: "POST",
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`pairing ${action} failed: ${response.status}`);
  }

  return (await response.json()) as PairingActionResult;
}
