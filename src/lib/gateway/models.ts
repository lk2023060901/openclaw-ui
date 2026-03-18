import { MODELS_API_PATH } from "@/lib/gateway/api";

export type ModelApiItem = {
  ref: string;
  provider: string;
  id: string;
  name: string;
  label: string;
  alias: string;
  configured: boolean;
  context_window: number;
  reasoning: boolean;
  input: string[];
};

export type ModelsResponse = {
  items: ModelApiItem[];
  count: number;
  checked_at: string;
};

export async function fetchModels(signal?: AbortSignal): Promise<ModelsResponse> {
  const response = await fetch(MODELS_API_PATH, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store",
    signal
  });

  if (!response.ok) {
    throw new Error(`models request failed: ${response.status}`);
  }

  return (await response.json()) as ModelsResponse;
}
