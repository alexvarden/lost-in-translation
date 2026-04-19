"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DRIFT_WALK } from "@/lib/viz-data";
import { euclidean } from "./viz-utils";

const WIDTH = 640;
const HEIGHT = 360;
const HOP_DURATION_MS = 900;

function driftColor(distance: number): string {
  if (distance < 1.0) return "#4ade80"; // green
  if (distance < 2.5) return "#fbbf24"; // amber
  return "#e11d48"; // crimson
}

export function DriftWalkViz() {
  const [currentStep, setCurrentStep] = useState<number>(DRIFT_WALK.length - 1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  // Custom scales — this walk uses a smaller coordinate domain than the
  // word-space visualisations, so we want tighter bounds.
  const customX = (dx: number) => {
    const innerW = WIDTH - 80;
    return 40 + ((dx + 6) / 12) * innerW;
  };
  const customY = (dy: number) => {
    const innerH = HEIGHT - 80;
    return 40 + innerH - ((dy + 4) / 8) * innerH;
  };

  const stepsShown = DRIFT_WALK.slice(0, currentStep + 1);

  function play() {
    setCurrentStep(0);
    setIsPlaying(true);
  }

  // Auto-advance during playback
  useEffect(() => {
    if (!isPlaying) return;
    if (currentStep >= DRIFT_WALK.length - 1) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      setCurrentStep((s) => s + 1);
    }, HOP_DURATION_MS);
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentStep]);

  const origin = DRIFT_WALK[0];
  const current = DRIFT_WALK[currentStep];
  const distance = euclidean(origin, current);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={play}
            disabled={isPlaying}
            className="btn-primary h-9 px-4 rounded-lg text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-60"
          >
            <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
              <path d="M3 2l6 3.5L3 9V2z" />
            </svg>
            {isPlaying ? "Walking…" : "Replay walk"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentStep(DRIFT_WALK.length - 1);
            }}
            className="btn-ghost h-9 px-3 rounded-lg text-xs font-medium"
          >
            Jump to end
          </button>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-dark-400">
          <span>
            step <span className="tnum text-dark-100 font-semibold">{currentStep + 1}</span> /{" "}
            {DRIFT_WALK.length}
          </span>
          <span className="h-4 w-px bg-dark-600/60" />
          <span>
            distance from origin{" "}
            <span className="tnum font-semibold" style={{ color: driftColor(distance) }}>
              {distance.toFixed(2)}
            </span>
          </span>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="An animated walk through embedding space, showing how each translation hop accumulates drift from the origin phrase."
      >
        {/* Gridlines */}
        <g stroke="#2a2525" strokeWidth="0.5">
          {[-6, -3, 0, 3, 6].map((v) => (
            <line key={`x${v}`} x1={customX(v)} y1={40} x2={customX(v)} y2={HEIGHT - 40} />
          ))}
          {[-4, -2, 0, 2, 4].map((v) => (
            <line key={`y${v}`} x1={40} y1={customY(v)} x2={WIDTH - 40} y2={customY(v)} />
          ))}
        </g>

        {/* Origin halo — shows where the phrase started */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {[1.5, 2.8, 4.2].map((r) => (
            <circle
              key={r}
              cx={customX(origin.x)}
              cy={customY(origin.y)}
              r={r * 10}
              fill="none"
              stroke="#4ade80"
              strokeOpacity={0.14}
              strokeWidth="1"
            />
          ))}
        </motion.g>

        {/* Path lines connecting consecutive steps */}
        <AnimatePresence>
          {stepsShown.slice(1).map((s, i) => {
            const prev = stepsShown[i];
            const cur = s;
            const d = euclidean(origin, cur);
            const col = driftColor(d);
            return (
              <motion.line
                key={`${i}-${cur.langCode}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.9 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                x1={customX(prev.x)}
                y1={customY(prev.y)}
                x2={customX(cur.x)}
                y2={customY(cur.y)}
                stroke={col}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="5 4"
              />
            );
          })}
        </AnimatePresence>

        {/* Points for each step shown so far */}
        {stepsShown.map((s, i) => {
          const d = euclidean(origin, s);
          const col = i === 0 ? "#4ade80" : driftColor(d);
          const isCurrent = i === currentStep;
          return (
            <motion.g
              key={`pt-${i}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            >
              <circle
                cx={customX(s.x)}
                cy={customY(s.y)}
                r={isCurrent ? 8 : 5}
                fill={col}
                stroke="#0a0909"
                strokeWidth="2"
              />
              <text
                x={customX(s.x) + 12}
                y={customY(s.y) + 4}
                className="fill-dark-100 select-none"
                fontSize={12}
                fontWeight={isCurrent ? 700 : 500}
              >
                {s.flag} {s.langName}
              </text>
            </motion.g>
          );
        })}

        {/* Legend / origin label */}
        <text x={customX(origin.x) - 12} y={customY(origin.y) - 14} className="fill-emerald-300" fontSize="10" fontWeight="600">
          origin
        </text>
      </svg>

      {/* Meaning ticker */}
      <div className="glass-subtle rounded-lg p-3">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-500">
            step {currentStep + 1}
          </span>
          <span className="text-[11px] text-dark-400">
            {current.flag} {current.langName}
          </span>
        </div>
        <p className="text-[14px] text-dark-100 leading-snug italic">
          &ldquo;{current.label}&rdquo;
        </p>
      </div>
    </div>
  );
}
