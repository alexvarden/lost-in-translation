"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import clsx from "clsx";
import type { Step } from "@/types";
import { getLanguage } from "@/lib/languages";
import { driftBadgeClasses } from "@/lib/drift";
import { DriftChart } from "./DriftChart";

interface ResultsBarProps {
  phrase: string;
  tour: Step[];
  isComplete: boolean;
  shareUrl: string | null;
}

export function ResultsBar({ phrase, tour, isComplete, shareUrl }: ResultsBarProps) {
  const [copied, setCopied] = useState(false);
  const finalStep = tour[tour.length - 1];
  const finalLang = finalStep ? getLanguage(finalStep.languageCode) : null;
  const finalRetention = finalStep?.retentionPct;
  const drift = finalStep?.driftFromOrigin ?? 0;

  const hasResults = isComplete && Boolean(finalStep?.translation);

  async function handleShare() {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // noop
    }
  }

  return (
    <AnimatePresence>
      {hasResults && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          className="glass rounded-2xl p-5 mt-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center gap-5">
            {/* Original vs Final */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-400 mb-1">
                  Original
                </div>
                <p className="text-[15px] text-dark-200 leading-snug truncate md:whitespace-normal">
                  {phrase}
                </p>
              </div>
              <div className="min-w-0">
                <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-400 mb-1 flex items-center gap-1.5">
                  <span>Final</span>
                  {finalLang && (
                    <span className="text-dark-500">· {finalLang.flag} {finalLang.name}</span>
                  )}
                </div>
                <p
                  className={clsx(
                    "text-[15px] leading-snug text-dark-100 truncate md:whitespace-normal",
                    finalLang?.dir === "rtl" && "text-right"
                  )}
                  dir={finalLang?.dir ?? "ltr"}
                >
                  {finalStep?.translation}
                </p>
              </div>
            </div>

            {/* Score + chart */}
            <div className="flex items-center gap-5 shrink-0">
              <div className="flex flex-col items-center">
                <div
                  className={clsx(
                    "tnum text-2xl font-semibold",
                    drift < 0.2
                      ? "text-emerald-300"
                      : drift < 0.4
                      ? "text-amber-300"
                      : "text-crimson-300"
                  )}
                >
                  {finalRetention ?? "—"}%
                </div>
                <div className="text-[10px] uppercase tracking-wider text-dark-500">
                  retained
                </div>
              </div>
              <div className="flex flex-col items-end">
                <DriftChart tour={tour} />
                <div className="text-[10px] text-dark-500 mt-0.5">
                  retention over {tour.length} steps
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                disabled={!shareUrl}
                className={clsx(
                  "btn-ghost h-9 px-3 rounded-lg text-xs font-medium inline-flex items-center gap-1.5",
                  copied && "!text-emerald-300 !border-emerald-500/40"
                )}
              >
                {copied ? (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
                      <path d="M2 8.5V2.5a.5.5 0 0 1 .5-.5h6" stroke="currentColor" strokeWidth="1.2" fill="none" />
                    </svg>
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Badge line */}
          <div
            className={clsx(
              "inline-flex mt-4 items-center gap-1.5 px-2.5 py-1 rounded-full border tnum text-xs",
              driftBadgeClasses(drift)
            )}
          >
            <span>
              {finalRetention !== undefined
                ? drift < 0.2
                  ? "Meaning mostly preserved"
                  : drift < 0.4
                  ? "Meaning has noticeably shifted"
                  : "Meaning has significantly drifted"
                : ""}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
