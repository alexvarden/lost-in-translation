"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CLUSTER_PALETTE, CROSS_LINGUAL_WORDS } from "@/lib/viz-data";
import { createScale, euclidean } from "./viz-utils";

const WIDTH = 640;
const HEIGHT = 380;

const TARGET_LANGS = [
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
] as const;

const SOURCE_CONCEPTS = ["dog", "cat", "red", "blue", "happy", "run"] as const;

export function TranslationAsNavigationViz() {
  const [concept, setConcept] = useState<(typeof SOURCE_CONCEPTS)[number]>("dog");
  const [targetLang, setTargetLang] = useState<string>("es");

  const scale = useMemo(() => createScale(WIDTH, HEIGHT), []);

  const source = CROSS_LINGUAL_WORDS.find(
    (w) => w.concept === concept && w.lang === "en"
  );

  // Find the nearest point in the target language to the source
  const target = useMemo(() => {
    if (!source) return null;
    const candidates = CROSS_LINGUAL_WORDS.filter((w) => w.lang === targetLang);
    if (candidates.length === 0) return null;
    let best = candidates[0];
    let bestDist = euclidean(source, best);
    for (const c of candidates) {
      const d = euclidean(source, c);
      if (d < bestDist) {
        best = c;
        bestDist = d;
      }
    }
    return best;
  }, [source, targetLang]);

  // Only words in the source or target language get full opacity
  const relevantLangs = new Set(["en", targetLang]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-400">
            Translate
          </span>
          <select
            value={concept}
            onChange={(e) => setConcept(e.target.value as typeof concept)}
            className="glass-subtle px-2.5 py-1 rounded-md text-sm text-dark-100 border focus:border-crimson-500/50 focus:outline-none"
          >
            {SOURCE_CONCEPTS.map((c) => (
              <option key={c} value={c}>
                {c} (en)
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider font-semibold text-dark-400">
            into
          </span>
          <div className="inline-flex p-0.5 rounded-md glass-subtle">
            {TARGET_LANGS.map((t) => (
              <button
                key={t.code}
                type="button"
                onClick={() => setTargetLang(t.code)}
                className={
                  targetLang === t.code
                    ? "px-2.5 py-1 rounded text-xs bg-crimson-500/15 text-crimson-300 border border-crimson-500/30"
                    : "px-2.5 py-1 rounded text-xs text-dark-400 border border-transparent hover:text-dark-200"
                }
              >
                {t.flag} {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full h-auto"
        role="img"
        aria-label="An animated arrow showing translation as the nearest-neighbour target-language word to a source word."
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

        {/* All points — dimmed for non-relevant languages */}
        {CROSS_LINGUAL_WORDS.map((w, i) => {
          const isRelevant = relevantLangs.has(w.lang);
          const isSource = source && w.concept === concept && w.lang === "en";
          const isTarget = target && w.text === target.text && w.lang === target.lang;
          const fill = CLUSTER_PALETTE[w.cluster];
          const highlight = isSource || isTarget;
          return (
            <motion.g
              key={`${w.lang}-${w.text}-${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: isRelevant ? (highlight ? 1 : 0.7) : 0.18 }}
              transition={{ duration: 0.25 }}
            >
              <circle
                cx={scale.x(w.x)}
                cy={scale.y(w.y)}
                r={highlight ? 6 : 3.5}
                fill={fill}
                stroke={highlight ? "#fff" : "transparent"}
                strokeWidth={highlight ? 1.5 : 0}
              />
              <text
                x={scale.x(w.x) + 6}
                y={scale.y(w.y) + 3.5}
                className="fill-dark-100 select-none"
                fontSize={highlight ? 13 : 10}
                fontWeight={highlight ? 700 : 400}
              >
                {w.text}
              </text>
            </motion.g>
          );
        })}

        {/* The translation arrow — source to nearest target */}
        <AnimatePresence mode="wait">
          {source && target && (
            <motion.g key={`${concept}-${targetLang}`}>
              <motion.line
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                x1={scale.x(source.x)}
                y1={scale.y(source.y)}
                x2={scale.x(target.x)}
                y2={scale.y(target.y)}
                stroke="#e11d48"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="4 3"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.35, type: "spring" }}
                cx={scale.x(target.x)}
                cy={scale.y(target.y)}
                r="10"
                fill="none"
                stroke="#e11d48"
                strokeWidth="1"
                opacity="0.6"
              />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <div className="text-[11px] text-dark-400 leading-snug px-1">
        When an LLM translates, it finds the point in the target language that&apos;s
        closest to the meaning of the source word. Here, the nearest{" "}
        <strong className="text-dark-200">{target?.text ?? "—"}</strong> ({targetLang})
        to <strong className="text-dark-200">{source?.text ?? "—"}</strong> (en) is
        just a short step across the embedding space.
      </div>
    </div>
  );
}
