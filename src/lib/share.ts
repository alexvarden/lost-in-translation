import type { TranslatorMode } from "@/types";

/**
 * URL state encoding. Keeps the link short by encoding:
 *  - p: phrase
 *  - t: comma-joined language codes (the tour)
 *  - m: mode initial (l/n/p)
 */

export interface SharedState {
  phrase: string;
  tourCodes: string[];
  mode: TranslatorMode;
}

const MODE_TO_INITIAL: Record<TranslatorMode, string> = {
  literal: "l",
  natural: "n",
  poetic: "p",
};

const INITIAL_TO_MODE: Record<string, TranslatorMode> = {
  l: "literal",
  n: "natural",
  p: "poetic",
};

export function encodeShareUrl(state: SharedState, baseUrl: string): string {
  const params = new URLSearchParams();
  params.set("p", state.phrase);
  params.set("t", state.tourCodes.join(","));
  params.set("m", MODE_TO_INITIAL[state.mode]);
  return `${baseUrl}?${params.toString()}`;
}

export function decodeShareUrl(searchParams: URLSearchParams): Partial<SharedState> {
  const result: Partial<SharedState> = {};
  const phrase = searchParams.get("p");
  const tour = searchParams.get("t");
  const mode = searchParams.get("m");
  if (phrase) result.phrase = phrase;
  if (tour) {
    const codes = tour
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (codes.length >= 2) result.tourCodes = codes;
  }
  if (mode && INITIAL_TO_MODE[mode]) result.mode = INITIAL_TO_MODE[mode];
  return result;
}
