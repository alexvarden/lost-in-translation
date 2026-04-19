"use client";

import { motion } from "framer-motion";
import { DRIFT_WALK } from "@/lib/viz-data";

const HERO_WIDTH = 1000;
const HERO_HEIGHT = 320;

/**
 * Decorative hero graphic for the article: a faint ambient drift walk behind
 * an oversized title. Shares the DRIFT_WALK data so the visual is consistent
 * with Section 5, but rendered here as an atmospheric background.
 */
export function ExplainerHero() {
  // Map drift coords (x: -6..6, y: -4..4) to the hero viewport.
  const xScale = (x: number) => 80 + ((x + 6) / 12) * (HERO_WIDTH - 160);
  const yScale = (y: number) => 50 + ((y + 4) / 8) * (HERO_HEIGHT - 100);

  return (
    <div className="relative">
      {/* Background drift graphic */}
      <div className="absolute inset-0 -z-10 opacity-60">
        <svg
          viewBox={`0 0 ${HERO_WIDTH} ${HERO_HEIGHT}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          {/* Origin halo */}
          <g>
            {[40, 80, 130].map((r) => (
              <circle
                key={r}
                cx={xScale(DRIFT_WALK[0].x)}
                cy={yScale(DRIFT_WALK[0].y)}
                r={r}
                fill="none"
                stroke="#4ade80"
                strokeOpacity={0.11}
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Dashed walk path */}
          {DRIFT_WALK.slice(1).map((step, i) => {
            const prev = DRIFT_WALK[i];
            return (
              <motion.line
                key={i}
                x1={xScale(prev.x)}
                y1={yScale(prev.y)}
                x2={xScale(step.x)}
                y2={yScale(step.y)}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.45 }}
                transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: "easeInOut" }}
                stroke="#e11d48"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="6 5"
              />
            );
          })}

          {/* Step dots */}
          {DRIFT_WALK.map((s, i) => (
            <motion.g
              key={`dot-${i}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.2, type: "spring", stiffness: 200 }}
            >
              <circle
                cx={xScale(s.x)}
                cy={yScale(s.y)}
                r={i === 0 ? 7 : 5}
                fill={i === 0 ? "#4ade80" : "#e11d48"}
                stroke="#0a0909"
                strokeWidth="3"
              />
              <text
                x={xScale(s.x) + 10}
                y={yScale(s.y) + 4}
                className="fill-dark-400"
                fontSize={11}
                fontWeight={500}
              >
                {s.flag}
              </text>
            </motion.g>
          ))}
        </svg>
      </div>

      {/* Foreground content */}
      <div className="relative max-w-3xl pt-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-[11px] uppercase tracking-[0.2em] text-crimson-400 font-semibold mb-5"
        >
          The Lost-in-Translation explainer
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.08] text-dark-50 mb-5"
        >
          How translation{" "}
          <span className="text-crimson-400">actually</span> works.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-lg text-dark-300 leading-snug max-w-xl"
        >
          A visual tour of <strong className="text-dark-100">embedding spaces</strong>,{" "}
          <strong className="text-dark-100">cosine similarity</strong>, and why meaning
          drifts when a phrase travels through many languages.
        </motion.p>
      </div>
    </div>
  );
}
