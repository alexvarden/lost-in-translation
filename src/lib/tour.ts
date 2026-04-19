import type { Step, Tour } from "@/types";
import { DEFAULT_TOUR_CODES } from "./languages";

/** Generate a stable-ish ID without requiring a crypto polyfill. */
export function newStepId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export function makeStep(languageCode: string): Step {
  return { id: newStepId(), languageCode };
}

export function defaultTour(): Tour {
  return DEFAULT_TOUR_CODES.map((code) => makeStep(code));
}

export function clearRunData(tour: Tour): Tour {
  return tour.map((s) => ({
    id: s.id,
    languageCode: s.languageCode,
  }));
}

export const MIN_STEPS = 2;
export const MAX_STEPS = 12;
