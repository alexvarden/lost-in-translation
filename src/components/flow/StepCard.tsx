"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import type { Step } from "@/types";
import { getLanguage } from "@/lib/languages";
import { LanguagePicker } from "./LanguagePicker";
import { driftBadgeClasses } from "@/lib/drift";

interface StepCardProps {
  step: Step;
  index: number;
  stepNumber: number;
  totalSteps: number;
  isFirst: boolean;
  isActive: boolean;
  canRemove: boolean;
  canDuplicate: boolean;
  disabled: boolean;
  /** ISO code of the origin (first step's) language — used to label the back-translation. */
  originLanguageCode: string;
  onLanguageChange: (code: string) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

export function StepCard({
  step,
  stepNumber,
  totalSteps,
  isFirst,
  isActive,
  canRemove,
  canDuplicate,
  disabled,
  originLanguageCode,
  onLanguageChange,
  onRemove,
  onDuplicate,
}: StepCardProps) {
  const lang = getLanguage(step.languageCode);
  const originLang = getLanguage(originLanguageCode);
  const showBackTranslation =
    !isFirst && step.languageCode !== originLanguageCode && Boolean(step.backTranslation);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: step.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasTranslation = Boolean(step.translation);
  const retention = step.retentionPct;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={clsx(
        "step-card relative w-[300px] min-h-[260px] rounded-2xl p-4 flex flex-col",
        "focus-within:border-crimson-500/40",
        isActive && "is-active",
        isDragging && "is-dragging"
      )}
      layout
    >
      {/* Top bar: drag, step number, remove */}
      <div className="flex items-center gap-2 mb-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={disabled}
          aria-label="Drag to reorder"
          className="p-1 text-dark-400 hover:text-dark-200 cursor-grab active:cursor-grabbing disabled:cursor-not-allowed"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M5 3h1v1H5zM8 3h1v1H8zM5 6h1v1H5zM8 6h1v1H8zM5 9h1v1H5zM8 9h1v1H8z"
              fill="currentColor"
            />
            <path
              d="M5 3v1H4V3h1zm3 0v1H7V3h1zM5 6v1H4V6h1zm3 0v1H7V6h1zM5 9v1H4V9h1zm3 0v1H7V9h1z"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="currentColor"
            />
          </svg>
        </button>
        <div className="flex-1 text-[10px] uppercase tracking-wider font-semibold text-dark-400">
          Step {stepNumber}
          {isFirst && <span className="ml-1.5 text-crimson-400/80">· origin</span>}
          {stepNumber === totalSteps && !isFirst && (
            <span className="ml-1.5 text-crimson-400/80">· final</span>
          )}
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onDuplicate}
            disabled={disabled || !canDuplicate}
            aria-label="Duplicate step"
            className="p-1 text-dark-400 hover:text-dark-200 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Duplicate"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.2" />
              <path d="M2 8.5V2.5a.5.5 0 0 1 .5-.5h6" stroke="currentColor" strokeWidth="1.2" fill="none" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled || !canRemove}
            aria-label="Remove step"
            className="p-1 text-dark-400 hover:text-crimson-400 disabled:opacity-40 disabled:cursor-not-allowed"
            title={canRemove ? "Remove" : "Minimum 2 steps"}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path
                d="M3 3l6 6M9 3l-6 6"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Language picker */}
      <LanguagePicker value={step.languageCode} onChange={onLanguageChange} disabled={disabled} />

      {/* Translation body */}
      <div className="mt-3 flex-1 min-h-[100px]">
        <AnimatePresence mode="wait">
          {step.isResolving ? (
            <motion.div
              key="resolving"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2 text-xs text-crimson-300"
            >
              <Spinner />
              <span>Translating…</span>
            </motion.div>
          ) : step.error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-crimson-400"
            >
              {step.error}
            </motion.div>
          ) : hasTranslation ? (
            <motion.div
              key={`text-${step.translation}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p
                dir={lang.dir}
                lang={lang.code}
                className={clsx(
                  "text-[15px] leading-relaxed text-dark-100",
                  lang.dir === "rtl" && "text-right"
                )}
              >
                {step.translation}
              </p>
              {showBackTranslation && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mt-3 pt-2.5 border-t border-dark-600/30"
                >
                  <div className="flex items-center gap-1 mb-0.5 text-[10px] uppercase tracking-wider text-dark-500">
                    <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden>
                      <path
                        d="M2 2v2.5a1 1 0 0 0 1 1h4M5.5 3.5L7 5 5.5 6.5"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span>In {originLang.name}</span>
                  </div>
                  <p
                    dir={originLang.dir}
                    lang={originLang.code}
                    className="text-[13px] leading-snug text-dark-300 italic"
                  >
                    {step.backTranslation}
                  </p>
                </motion.div>
              )}
              {!isFirst && step.languageCode === originLanguageCode && (
                <div className="mt-2 text-[10px] uppercase tracking-wider text-dark-500">
                  same language as origin
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-dark-500 italic"
            >
              {isFirst ? "Starts with your phrase…" : "Waiting…"}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer: drift badge */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-dark-500" dir={lang.dir}>
          {lang.endonym}
        </span>
        {hasTranslation && typeof retention === "number" && !isFirst && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={clsx(
              "tnum text-[11px] px-2 py-0.5 rounded-full border",
              driftBadgeClasses(step.driftFromOrigin ?? 0)
            )}
            title={`Cosine distance from origin: ${(step.driftFromOrigin ?? 0).toFixed(3)}`}
          >
            {retention}% retained
          </motion.span>
        )}
        {isFirst && hasTranslation && (
          <span className="tnum text-[11px] px-2 py-0.5 rounded-full border bg-dark-800/40 text-dark-300 border-dark-600/40">
            source
          </span>
        )}
      </div>
    </motion.div>
  );
}

function Spinner() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" className="animate-spin">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
      <path
        d="M12 7a5 5 0 0 0-5-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
