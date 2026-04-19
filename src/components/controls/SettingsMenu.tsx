"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import type { AnimationSpeed } from "@/types";

interface SettingsMenuProps {
  speed: AnimationSpeed;
  onSpeedChange: (s: AnimationSpeed) => void;
  showPerStep: boolean;
  onShowPerStepChange: (v: boolean) => void;
}

const SPEEDS: Array<{ value: AnimationSpeed; label: string }> = [
  { value: "slow", label: "Slow" },
  { value: "medium", label: "Medium" },
  { value: "instant", label: "Instant" },
];

export function SettingsMenu({
  speed,
  onSpeedChange,
  showPerStep,
  onShowPerStepChange,
}: SettingsMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label="Settings"
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "w-9 h-9 rounded-lg flex items-center justify-center",
          "glass-subtle hover:border-crimson-500/30 transition-colors",
          open && "border-crimson-500/40"
        )}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-dark-300">
          <path
            d="M7 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0-3v1m0 8v1m3.5-6.5L11 5m-8 4l.5-.5m8 0l.5.5m-9 0L3 9m0-4l-.5-.5m9 0l-.5.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-64 z-40 glass rounded-xl p-3 shadow-xl">
          <div className="mb-3">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-dark-400 mb-1.5">
              Animation speed
            </div>
            <div className="inline-flex p-0.5 rounded-md glass-subtle">
              {SPEEDS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => onSpeedChange(s.value)}
                  className={clsx(
                    "px-2.5 py-1 rounded text-xs transition-colors",
                    speed === s.value
                      ? "bg-crimson-500/15 text-crimson-300 border border-crimson-500/30"
                      : "text-dark-400 border border-transparent hover:text-dark-200"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between gap-2 py-1 cursor-pointer">
            <span className="text-sm text-dark-100">Show per-step retention</span>
            <button
              type="button"
              role="switch"
              aria-checked={showPerStep}
              onClick={() => onShowPerStepChange(!showPerStep)}
              className={clsx(
                "relative w-9 h-5 rounded-full transition-colors",
                showPerStep ? "bg-crimson-500/70" : "bg-dark-700"
              )}
            >
              <span
                className={clsx(
                  "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
                  showPerStep && "translate-x-4"
                )}
              />
            </button>
          </label>
        </div>
      )}
    </div>
  );
}
