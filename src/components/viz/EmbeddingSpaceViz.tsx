"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import {
  CLUSTER_LABEL,
  CLUSTER_PALETTE,
  ENGLISH_WORDS,
  type Cluster,
} from "@/lib/viz-data";
import { createScale, euclidean } from "./viz-utils";

const WIDTH = 640;
const HEIGHT = 420;
const NEIGHBOURS = 3;

export function EmbeddingSpaceViz() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [lockedIdx, setLockedIdx] = useState<number | null>(null);

  const activeIdx = lockedIdx ?? hoveredIdx;
  const scale = useMemo(() => createScale(WIDTH, HEIGHT), []);

  const neighbourIds = useMemo(() => {
    if (activeIdx === null) return new Set<number>();
    const target = ENGLISH_WORDS[activeIdx];
    const dists = ENGLISH_WORDS
      .map((w, i) => ({ i, d: euclidean(w, target) }))
      .filter((p) => p.i !== activeIdx)
      .sort((a, b) => a.d - b.d)
      .slice(0, NEIGHBOURS);
    return new Set(dists.map((p) => p.i));
  }, [activeIdx]);

  const clusters = Object.keys(CLUSTER_LABEL) as Cluster[];

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start">
      <div className="flex-1 min-w-0 w-full">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full h-auto"
          role="img"
          aria-label="A 2D scatter plot of English words, grouped by semantic category."
        >
          {/* Gridlines */}
          <g stroke="#2a2525" strokeWidth="0.5">
            {[-10, -5, 0, 5, 10].map((v) => (
              <g key={v}>
                <line x1={scale.x(v)} y1={scale.padding} x2={scale.x(v)} y2={HEIGHT - scale.padding} />
                <line x1={scale.padding} y1={scale.y(v)} x2={WIDTH - scale.padding} y2={scale.y(v)} />
              </g>
            ))}
          </g>

          {/* Axis labels */}
          <text x={WIDTH / 2} y={HEIGHT - 8} textAnchor="middle" className="fill-dark-500" fontSize="10">
            meaning dimension 1 →
          </text>
          <text
            x={14}
            y={HEIGHT / 2}
            textAnchor="middle"
            className="fill-dark-500"
            fontSize="10"
            transform={`rotate(-90, 14, ${HEIGHT / 2})`}
          >
            meaning dimension 2 →
          </text>

          {/* Neighbour connector lines */}
          {activeIdx !== null && (
            <g stroke={CLUSTER_PALETTE[ENGLISH_WORDS[activeIdx].cluster]} strokeWidth="1" opacity="0.35">
              {[...neighbourIds].map((i) => (
                <line
                  key={i}
                  x1={scale.x(ENGLISH_WORDS[activeIdx].x)}
                  y1={scale.y(ENGLISH_WORDS[activeIdx].y)}
                  x2={scale.x(ENGLISH_WORDS[i].x)}
                  y2={scale.y(ENGLISH_WORDS[i].y)}
                  strokeDasharray="2 3"
                />
              ))}
            </g>
          )}

          {/* Points */}
          {ENGLISH_WORDS.map((w, i) => {
            const isActive = i === activeIdx;
            const isNeighbour = neighbourIds.has(i);
            const dimmed = activeIdx !== null && !isActive && !isNeighbour;
            const fill = CLUSTER_PALETTE[w.cluster];
            return (
              <motion.g
                key={w.text}
                initial={{ opacity: 0, scale: 0.3 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.35, delay: 0.01 * i, type: "spring", stiffness: 180 }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => setLockedIdx((l) => (l === i ? null : i))}
                opacity={dimmed ? 0.28 : 1}
              >
                <circle
                  cx={scale.x(w.x)}
                  cy={scale.y(w.y)}
                  r={isActive ? 6 : 4}
                  fill={fill}
                  stroke={isActive ? "#fff" : "transparent"}
                  strokeWidth={isActive ? 1.5 : 0}
                />
                <text
                  x={scale.x(w.x) + 8}
                  y={scale.y(w.y) + 4}
                  className={clsx(
                    "fill-dark-100 select-none",
                    isActive && "font-semibold"
                  )}
                  fontSize={isActive ? 13 : 11}
                >
                  {w.text}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      {/* Legend + hint */}
      <aside className="w-full lg:w-56 shrink-0 lg:pt-4 lg:pl-2">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-400 mb-2">
          Clusters
        </div>
        <ul className="space-y-1.5">
          {clusters.map((c) => (
            <li key={c} className="flex items-center gap-2 text-xs text-dark-200">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full"
                style={{ background: CLUSTER_PALETTE[c] }}
              />
              {CLUSTER_LABEL[c]}
            </li>
          ))}
        </ul>
        <div className="mt-5 pt-4 border-t border-dark-700/40 text-[11px] text-dark-400 leading-snug">
          {activeIdx !== null ? (
            <>
              <span className="text-dark-100 font-medium">{ENGLISH_WORDS[activeIdx].text}</span>
              <span className="text-dark-500"> · {CLUSTER_LABEL[ENGLISH_WORDS[activeIdx].cluster]}</span>
              <p className="mt-1">
                Highlighted lines show its {NEIGHBOURS} nearest neighbours — the words whose
                meanings are most similar in this space.
              </p>
            </>
          ) : (
            <p>Hover a word to see its nearest neighbours. Click to pin.</p>
          )}
        </div>
      </aside>
    </div>
  );
}
