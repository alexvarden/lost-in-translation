"use client";

import clsx from "clsx";
import type { TranslatorMode } from "@/types";

interface ModeSelectorProps {
  value: TranslatorMode;
  onChange: (mode: TranslatorMode) => void;
  disabled?: boolean;
}

const MODES: Array<{ value: TranslatorMode; label: string; desc: string }> = [
  { value: "literal", label: "Literal", desc: "Word-for-word. Preserves idioms as-is." },
  { value: "natural", label: "Natural", desc: "Idiomatic, native-sounding translation." },
  { value: "poetic", label: "Poetic", desc: "Evocative, literary re-imagining." },
];

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <div className="inline-flex p-0.5 rounded-lg glass-subtle" role="tablist">
      {MODES.map((m) => (
        <button
          key={m.value}
          type="button"
          role="tab"
          aria-selected={value === m.value}
          onClick={() => onChange(m.value)}
          disabled={disabled}
          title={m.desc}
          className={clsx(
            "relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
            value === m.value
              ? "bg-crimson-500/15 text-crimson-300 border border-crimson-500/35"
              : "text-dark-400 hover:text-dark-200 border border-transparent",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
