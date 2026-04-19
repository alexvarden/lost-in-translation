"use client";

import { driftStroke } from "@/lib/drift";
import type { Step } from "@/types";

interface DriftChartProps {
  tour: Step[];
  width?: number;
  height?: number;
}

/**
 * Small inline line chart plotting retention% at each step.
 * Step 0 is always 100% (origin).
 */
export function DriftChart({ tour, width = 260, height = 56 }: DriftChartProps) {
  const points = tour.map((s, i) => ({
    x: i,
    y: s.retentionPct ?? (i === 0 ? 100 : 0),
    hasData: i === 0 || typeof s.retentionPct === "number",
  }));
  const hasAnyData = points.some((p, i) => i > 0 && p.hasData);
  if (!hasAnyData) return null;

  const pad = { left: 6, right: 6, top: 6, bottom: 10 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;
  const nSteps = Math.max(1, tour.length - 1);

  const coords = points.map((p) => ({
    x: pad.left + (p.x / nSteps) * innerW,
    y: pad.top + (1 - p.y / 100) * innerH,
    tone: driftStroke(1 - p.y / 100),
    hasData: p.hasData,
  }));

  const linePath = coords
    .filter((c) => c.hasData)
    .map((c, i) => `${i === 0 ? "M" : "L"}${c.x.toFixed(1)},${c.y.toFixed(1)}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      {/* Baseline 0% */}
      <line
        x1={pad.left}
        y1={pad.top + innerH}
        x2={pad.left + innerW}
        y2={pad.top + innerH}
        stroke="#3d3838"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      {/* Mid-line 50% */}
      <line
        x1={pad.left}
        y1={pad.top + innerH / 2}
        x2={pad.left + innerW}
        y2={pad.top + innerH / 2}
        stroke="#3d3838"
        strokeWidth="0.5"
        strokeDasharray="1 3"
        opacity="0.7"
      />

      {/* Line */}
      {linePath && (
        <path
          d={linePath}
          stroke="#e11d48"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      )}

      {/* Points */}
      {coords.map((c, i) =>
        c.hasData ? (
          <circle
            key={i}
            cx={c.x}
            cy={c.y}
            r={i === 0 || i === coords.length - 1 ? 3 : 2}
            fill={c.tone}
            stroke="#0a0909"
            strokeWidth="1"
          />
        ) : null
      )}
    </svg>
  );
}
