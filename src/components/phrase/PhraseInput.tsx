"use client";

import clsx from "clsx";

interface PhraseInputProps {
  value: string;
  onChange: (value: string) => void;
  onOpenLibrary: () => void;
  disabled?: boolean;
}

export function PhraseInput({ value, onChange, onOpenLibrary, disabled }: PhraseInputProps) {
  return (
    <div className="w-full flex items-stretch gap-2">
      <div className="flex-1 relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={500}
          placeholder="Type a phrase…"
          className={clsx(
            "w-full h-12 px-4 pr-24 rounded-xl",
            "glass-subtle text-dark-100 placeholder:text-dark-500",
            "focus:border-crimson-500/60 focus:outline-none",
            "transition-colors",
            disabled && "opacity-60"
          )}
        />
        <div className="absolute top-1/2 -translate-y-1/2 right-3 text-[10px] tnum text-dark-500">
          {value.length}/500
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenLibrary}
        disabled={disabled}
        className="shrink-0 h-12 px-4 rounded-xl btn-ghost text-sm font-medium flex items-center gap-2"
        title="Open phrase library"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 2h7a2 2 0 0 1 2 2v8a2 2 0 0 0-2-2H2V2z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
            fill="none"
          />
          <path
            d="M5 5h3M5 7h4M5 9h2"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        <span>Library</span>
      </button>
    </div>
  );
}
