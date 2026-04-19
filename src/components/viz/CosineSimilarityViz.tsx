"use client";

import { useState } from "react";
import clsx from "clsx";
import { cosineFromAngle, cosineLabel } from "./viz-utils";

const PRESETS: Array<{ angle: number; a: string; b: string }> = [
  { angle: 12, a: "king", b: "queen" },
  { angle: 38, a: "dog", b: "wolf" },
  { angle: 68, a: "dog", b: "tree" },
  { angle: 92, a: "happy", b: "blue" },
  { angle: 148, a: "happy", b: "sad" },
];

const SIZE = 380;
const CENTER = SIZE / 2;
const RADIUS = 150;

export function CosineSimilarityViz() {
  const [angle, setAngle] = useState<number>(38);
  const [labels, setLabels] = useState<{ a: string; b: string }>({
    a: "dog",
    b: "wolf",
  });

  const cos = cosineFromAngle(angle);
  const { label, tone } = cosineLabel(cos);

  // Vector A fixed along +x axis.
  const aEnd = { x: CENTER + RADIUS, y: CENTER };
  // Vector B at `angle` degrees CCW from A.
  const bEnd = {
    x: CENTER + Math.cos((angle * Math.PI) / 180) * RADIUS,
    y: CENTER - Math.sin((angle * Math.PI) / 180) * RADIUS,
  };

  const toneColor = {
    good: "#34d399",
    warn: "#fbbf24",
    hot: "#e11d48",
    cold: "#64748b",
  }[tone];

  // SVG arc for the angle wedge.
  const wedgeStart = `M ${CENTER},${CENTER}`;
  const wedgeLine1 = `L ${CENTER + 40},${CENTER}`;
  const largeArc = angle > 180 ? 1 : 0;
  const arcEnd = {
    x: CENTER + Math.cos((angle * Math.PI) / 180) * 40,
    y: CENTER - Math.sin((angle * Math.PI) / 180) * 40,
  };
  const arc = `A 40,40 0 ${largeArc} 0 ${arcEnd.x},${arcEnd.y}`;
  const wedgePath = `${wedgeStart} ${wedgeLine1} ${arc} Z`;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-[380px] h-auto"
        role="img"
        aria-label="Two vectors meeting at an origin, with the angle between them adjustable."
      >
        {/* Axis circle — shows unit sphere */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={RADIUS}
          fill="none"
          stroke="#2a2525"
          strokeWidth="0.8"
          strokeDasharray="3 4"
        />
        {/* Axes */}
        <line x1={CENTER - RADIUS - 10} y1={CENTER} x2={CENTER + RADIUS + 10} y2={CENTER} stroke="#2a2525" strokeWidth="0.5" />
        <line x1={CENTER} y1={CENTER - RADIUS - 10} x2={CENTER} y2={CENTER + RADIUS + 10} stroke="#2a2525" strokeWidth="0.5" />

        {/* Angle wedge */}
        <path d={wedgePath} fill={toneColor} fillOpacity="0.18" stroke={toneColor} strokeWidth="1" strokeOpacity="0.35" />

        {/* Vector A — muted reference direction */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={aEnd.x}
          y2={aEnd.y}
          stroke="#64748b"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx={aEnd.x} cy={aEnd.y} r="4" fill="#64748b" />
        <text x={aEnd.x + 8} y={aEnd.y + 4} className="fill-dark-300" fontSize="12" fontWeight="600">
          {labels.a}
        </text>

        {/* Vector B — the variable one */}
        <line
          x1={CENTER}
          y1={CENTER}
          x2={bEnd.x}
          y2={bEnd.y}
          stroke={toneColor}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <circle cx={bEnd.x} cy={bEnd.y} r="5" fill={toneColor} />
        <text
          x={bEnd.x + (angle > 90 && angle < 270 ? -8 : 8)}
          y={bEnd.y + 4}
          textAnchor={angle > 90 && angle < 270 ? "end" : "start"}
          className="fill-dark-100"
          fontSize="13"
          fontWeight="600"
        >
          {labels.b}
        </text>

        {/* Origin label */}
        <circle cx={CENTER} cy={CENTER} r="3" fill="#ddd" />
        <text x={CENTER - 10} y={CENTER + 16} className="fill-dark-500" fontSize="10">
          origin
        </text>

        {/* Angle label */}
        <text
          x={CENTER + 50}
          y={CENTER - 8}
          className="fill-dark-300 tnum"
          fontSize="11"
          fontWeight="600"
        >
          {angle}°
        </text>
      </svg>

      <div className="flex-1 min-w-0 w-full lg:pt-3">
        {/* Live readout */}
        <div className="flex items-baseline gap-3 mb-4">
          <div
            className="text-4xl font-semibold tnum"
            style={{ color: toneColor }}
          >
            {cos.toFixed(3)}
          </div>
          <div className="text-xs text-dark-500 uppercase tracking-wider font-semibold">
            cosine similarity
          </div>
        </div>
        <div
          className={clsx(
            "inline-flex items-center px-3 py-1 rounded-full border tnum text-xs mb-4",
            tone === "good" && "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
            tone === "warn" && "bg-amber-500/10 text-amber-300 border-amber-500/30",
            tone === "hot" && "bg-crimson-500/10 text-crimson-300 border-crimson-500/30",
            tone === "cold" && "bg-slate-500/10 text-slate-300 border-slate-500/30"
          )}
        >
          {label}
        </div>

        {/* Angle slider */}
        <div className="mb-5">
          <label className="flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-dark-400 mb-1.5">
            <span>Angle between vectors</span>
            <span className="text-dark-300 tnum">{angle}°</span>
          </label>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full accent-crimson-500"
          />
        </div>

        {/* Preset word pairs */}
        <div className="mt-3">
          <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-400 mb-2">
            Try these word pairs
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={`${p.a}-${p.b}`}
                type="button"
                onClick={() => {
                  setAngle(p.angle);
                  setLabels({ a: p.a, b: p.b });
                }}
                className="px-2.5 py-1 text-xs rounded-full border border-dark-600/40 bg-dark-800/40 text-dark-200 hover:border-crimson-500/40 hover:bg-dark-800/60 transition-colors"
              >
                {p.a} <span className="text-dark-500">↔</span> {p.b}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-dark-700/40 text-[11px] text-dark-400 leading-snug">
          <strong className="text-dark-200">Cosine similarity</strong> is the cosine of the
          angle between two vectors. It ranges from <span className="tnum">-1</span> (opposite)
          to <span className="tnum">1</span> (identical direction). Embedding similarity is
          usually above <span className="tnum">0.3</span> for related text.
        </div>
      </div>
    </div>
  );
}
