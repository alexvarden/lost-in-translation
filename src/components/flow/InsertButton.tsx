"use client";

import clsx from "clsx";

interface InsertButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant?: "between" | "end";
}

export function InsertButton({ onClick, disabled, variant = "between" }: InsertButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label="Insert step"
      title="Insert a new step"
      className={clsx(
        "group relative shrink-0 flex items-center justify-center",
        "transition-all duration-200",
        disabled && "opacity-30 cursor-not-allowed",
        variant === "between"
          ? "w-7 h-7 rounded-full text-dark-500 hover:text-crimson-400 hover:scale-110"
          : "w-10 h-10 rounded-full text-dark-400 hover:text-crimson-400 hover:scale-105 border border-dashed border-dark-600/40 hover:border-crimson-500/50"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 2v10M2 7h10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
