import type { TranslatorMode } from "@/types";

export interface TranslateRequest {
  text: string;
  from: string;
  to: string;
  mode: TranslatorMode;
}

export interface TranslateResponse {
  translated: string;
  latencyMs: number;
}

export async function translate(req: TranslateRequest, signal?: AbortSignal): Promise<TranslateResponse> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (!res.ok) {
    const msg = await safeErrorMessage(res);
    throw new Error(`Translate failed (${res.status}): ${msg}`);
  }
  return (await res.json()) as TranslateResponse;
}

async function safeErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data?.error ?? res.statusText;
  } catch {
    return res.statusText;
  }
}
