export interface DriftRequest {
  /** Original text to compare against (always embedded in its source language). */
  a: string;
  /** Candidate text to compare (e.g. current-hop translation back-translated into the origin language). */
  b: string;
}

export interface DriftResponse {
  /** Cosine similarity 0..1 (higher = closer). */
  cosine: number;
  /** Convenience: 100 - normalised drift, clamped 0..100. */
  retention: number;
}

export async function drift(req: DriftRequest, signal?: AbortSignal): Promise<DriftResponse> {
  const res = await fetch("/api/drift", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Drift failed (${res.status})`);
  }
  return (await res.json()) as DriftResponse;
}

/** Client-side cosine helper, used if we ever want to batch embeddings. */
export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  if (na === 0 || nb === 0) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

/**
 * Colour helpers keyed to drift. Used for step badges + connector stroke.
 *  0.00–0.20 → ~green (high retention)
 *  0.20–0.40 → amber
 *  0.40+     → crimson
 */
export function driftTone(distance: number): "good" | "warn" | "hot" {
  if (distance < 0.2) return "good";
  if (distance < 0.4) return "warn";
  return "hot";
}

export function driftStroke(distance: number): string {
  const tone = driftTone(distance);
  if (tone === "good") return "#4ade80"; // green-400
  if (tone === "warn") return "#fbbf24"; // amber-400
  return "#e11d48"; // crimson-500
}

export function driftBadgeClasses(distance: number): string {
  const tone = driftTone(distance);
  if (tone === "good")
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
  if (tone === "warn") return "bg-amber-500/10 text-amber-300 border-amber-500/30";
  return "bg-crimson-500/12 text-crimson-300 border-crimson-500/40";
}
