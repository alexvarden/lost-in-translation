"use client";

import clsx from "clsx";

interface RunButtonProps {
  onClick: () => void;
  isRunning: boolean;
  onCancel: () => void;
  disabled?: boolean;
}

export function RunButton({ onClick, isRunning, onCancel, disabled }: RunButtonProps) {
  if (isRunning) {
    return (
      <button
        type="button"
        onClick={onCancel}
        className="btn-ghost h-11 px-6 rounded-xl text-sm font-semibold inline-flex items-center gap-2"
      >
        <Spinner />
        <span>Cancel</span>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        "btn-primary h-11 px-6 rounded-xl text-sm font-semibold",
        "inline-flex items-center gap-2"
      )}
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
        <path d="M4 2.5l7 4.5-7 4.5V2.5z" />
      </svg>
      <span>Run translation</span>
      <kbd className="hidden md:inline-flex items-center ml-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white/70">
        ⌘↵
      </kbd>
    </button>
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
