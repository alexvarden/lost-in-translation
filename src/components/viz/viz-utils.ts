/** Shared helpers for the embedding-space visualisations. */

export interface VizScale {
  /** Maps data x ∈ [-10, 10] to SVG x. */
  x: (dataX: number) => number;
  /** Maps data y ∈ [-10, 10] to SVG y (inverted so higher data y is rendered higher). */
  y: (dataY: number) => number;
  width: number;
  height: number;
  padding: number;
}

export function createScale(width: number, height: number, padding = 40): VizScale {
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const domain = 10.5; // slight overscan so points never hug the edge
  return {
    width,
    height,
    padding,
    x: (dataX) => padding + ((dataX + domain) / (domain * 2)) * innerW,
    y: (dataY) => padding + innerH - ((dataY + domain) / (domain * 2)) * innerH,
  };
}

export function euclidean(a: { x: number; y: number }, b: { x: number; y: number }): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function cosineFromAngle(angleDeg: number): number {
  return Math.cos((angleDeg * Math.PI) / 180);
}

/** Classify a cosine value into a human label. */
export function cosineLabel(cos: number): { label: string; tone: "good" | "warn" | "hot" | "cold" } {
  if (cos > 0.85) return { label: "nearly identical", tone: "good" };
  if (cos > 0.6) return { label: "closely related", tone: "good" };
  if (cos > 0.3) return { label: "loosely related", tone: "warn" };
  if (cos > 0.0) return { label: "barely related", tone: "hot" };
  if (cos > -0.3) return { label: "unrelated", tone: "cold" };
  return { label: "opposite", tone: "cold" };
}
