"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CLUSTER_PALETTE,
  CROSS_LINGUAL_CONCEPTS,
  CROSS_LINGUAL_WORDS,
  type VizWord,
} from "@/lib/viz-data";
import { createScale } from "./viz-utils";

const WIDTH = 640;
const HEIGHT = 420;

export function CrossLingualViz() {
  const [showBonds, setShowBonds] = useState(true);
  const scale = useMemo(() => createScale(WIDTH, HEIGHT), []);

  const pointsByConcept = useMemo(() => {
    const map = new Map<string, VizWord[]>();
    for (const w of CROSS_LINGUAL_WORDS) {
      if (!w.concept) continue;
      if (!map.has(w.concept)) map.set(w.concept, []);
      map.get(w.concept)!.push(w);
    }
    return map;
  }, []);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-end gap-2 px-2">
        <label className="inline-flex items-center gap-2 text-xs text-dark-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showBonds}
            onChange={(e) => setShowBonds(e.target.checked)}
            className="accent-crimson-500"
          />
          <span>Show concept bonds</span>
        </label>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="A 2D scatter plot showing translations of the same concept clustering together."
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

        {/* Bonds: thin lines connecting all translations of the same concept */}
        <AnimatePresence>
          {showBonds &&
            CROSS_LINGUAL_CONCEPTS.map((concept) => {
              const words = pointsByConcept.get(concept) ?? [];
              if (words.length < 2) return null;
              // Draw a star from the concept's centroid to each word
              const cx = words.reduce((s, w) => s + w.x, 0) / words.length;
              const cy = words.reduce((s, w) => s + w.y, 0) / words.length;
              const firstCluster = words[0]?.cluster;
              const color = firstCluster ? CLUSTER_PALETTE[firstCluster] : "#888";
              return (
                <motion.g
                  key={concept}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.55 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {words.map((w) => (
                    <line
                      key={w.text}
                      x1={scale.x(cx)}
                      y1={scale.y(cy)}
                      x2={scale.x(w.x)}
                      y2={scale.y(w.y)}
                      stroke={color}
                      strokeWidth="0.8"
                      strokeDasharray="2 2"
                    />
                  ))}
                  <circle
                    cx={scale.x(cx)}
                    cy={scale.y(cy)}
                    r="2"
                    fill={color}
                    opacity="0.4"
                  />
                </motion.g>
              );
            })}
        </AnimatePresence>

        {/* Points */}
        {CROSS_LINGUAL_WORDS.map((w, i) => {
          const fill = CLUSTER_PALETTE[w.cluster];
          const isEnglish = w.lang === "en";
          return (
            <motion.g
              key={`${w.concept}-${w.lang}-${w.text}`}
              initial={{ opacity: 0, scale: 0.3 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.3, delay: 0.015 * i, type: "spring", stiffness: 200 }}
            >
              <circle
                cx={scale.x(w.x)}
                cy={scale.y(w.y)}
                r={isEnglish ? 4.5 : 3}
                fill={fill}
                stroke={isEnglish ? "#fff" : "transparent"}
                strokeWidth={isEnglish ? 1 : 0}
              />
              <text
                x={scale.x(w.x) + 6}
                y={scale.y(w.y) + 3.5}
                className="fill-dark-100 select-none"
                fontSize={isEnglish ? 12 : 10}
                fontWeight={isEnglish ? 600 : 400}
              >
                {w.text}
              </text>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
