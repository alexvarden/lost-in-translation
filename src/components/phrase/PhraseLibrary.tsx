"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { PHRASES, PHRASE_CATEGORIES } from "@/lib/phrases";
import type { PhrasePreset } from "@/types";

interface PhraseLibraryProps {
  open: boolean;
  onClose: () => void;
  onPick: (phrase: PhrasePreset) => void;
}

export function PhraseLibrary({ open, onClose, onPick }: PhraseLibraryProps) {
  const [category, setCategory] = useState<PhrasePreset["category"] | "All">("All");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const items = category === "All" ? PHRASES : PHRASES.filter((p) => p.category === category);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/70 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="glass w-full max-w-2xl max-h-[80vh] rounded-2xl overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-dark-600/40 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-dark-100">Phrase library</h2>
                <p className="mt-1 text-sm text-dark-400">
                  Pick a phrase tuned for interesting drift.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="p-1.5 text-dark-400 hover:text-dark-100"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="px-5 py-3 border-b border-dark-600/30 flex flex-wrap gap-1.5">
              {(["All", ...PHRASE_CATEGORIES] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={clsx(
                    "px-3 py-1 rounded-full text-xs font-medium border transition-colors",
                    category === c
                      ? "bg-crimson-500/15 text-crimson-300 border-crimson-500/40"
                      : "bg-dark-800/40 text-dark-300 border-dark-600/30 hover:border-dark-500/50"
                  )}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto p-3">
              <div className="grid gap-2">
                {items.map((phrase) => (
                  <button
                    key={phrase.id}
                    type="button"
                    onClick={() => {
                      onPick(phrase);
                      onClose();
                    }}
                    className="text-left p-3 rounded-lg border border-dark-600/30 bg-dark-800/30 hover:border-crimson-500/40 hover:bg-dark-800/60 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-[11px] uppercase tracking-wider text-dark-400">
                        {phrase.category}
                      </div>
                    </div>
                    <p className="mt-1 text-[15px] text-dark-100 leading-snug">
                      {phrase.text}
                    </p>
                    {phrase.note && (
                      <p className="mt-1 text-xs text-dark-500 italic">{phrase.note}</p>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
