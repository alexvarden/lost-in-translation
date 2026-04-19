"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { groupLanguages, getLanguage } from "@/lib/languages";
import clsx from "clsx";

interface LanguagePickerProps {
  value: string;
  onChange: (code: string) => void;
  disabled?: boolean;
}

export function LanguagePicker({ value, onChange, disabled }: LanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = getLanguage(value);
  const groups = useMemo(() => groupLanguages(query), [query]);

  // Flat list for keyboard nav
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

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

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // autofocus input
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = flat[activeIndex];
      if (pick) {
        onChange(pick.code);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left",
          "glass-subtle transition-colors",
          "hover:border-crimson-500/40",
          open && "border-crimson-500/50",
          disabled && "opacity-60 cursor-not-allowed"
        )}
      >
        <span className="text-lg leading-none">{current.flag}</span>
        <span className="flex-1 text-sm font-medium text-dark-100 truncate">{current.name}</span>
        <svg
          className={clsx("w-3 h-3 text-dark-400 transition-transform", open && "rotate-180")}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-80 max-h-[420px] overflow-auto rounded-xl glass shadow-2xl"
            onKeyDown={handleKey}
          >
            <div className="sticky top-0 z-10 p-2 border-b border-dark-600/40 bg-dark-900/80 backdrop-blur-md">
              <input
                ref={inputRef}
                type="text"
                placeholder="Search 40 languages…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKey}
                className="w-full bg-dark-800/60 border border-dark-600/40 rounded-md px-3 py-1.5 text-sm text-dark-100 placeholder:text-dark-400 focus:border-crimson-500/60 focus:outline-none"
              />
            </div>

            <div className="py-1">
              {groups.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-dark-400">No matches</div>
              )}

              {groups.map((group) => (
                <div key={group.script} className="pb-1">
                  <div className="px-3 pt-2 pb-1 text-[10px] font-semibold uppercase tracking-wider text-dark-400">
                    {group.label}
                  </div>
                  {group.items.map((lang) => {
                    const flatIndex = flat.findIndex((l) => l.code === lang.code);
                    const isActive = flatIndex === activeIndex;
                    const isSelected = lang.code === value;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onChange(lang.code);
                          setOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(flatIndex)}
                        className={clsx(
                          "w-full flex items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                          isActive && "bg-crimson-500/10",
                          isSelected && "text-crimson-300"
                        )}
                      >
                        <span className="text-base leading-none">{lang.flag}</span>
                        <span className="flex-1 truncate">
                          <span className="text-dark-100">{lang.name}</span>
                          <span className="ml-2 text-dark-400 text-xs" dir={lang.dir}>
                            {lang.endonym}
                          </span>
                        </span>
                        {isSelected && (
                          <svg className="w-3 h-3 text-crimson-400" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
