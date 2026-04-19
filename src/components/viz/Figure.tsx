"use client";

import clsx from "clsx";

interface FigureProps {
  number?: number | string;
  title: string;
  caption?: React.ReactNode;
  children: React.ReactNode;
  /** Lets the figure break out of the prose column to feel editorial. */
  breakout?: boolean;
}

/**
 * Wraps a visualisation in editorial chrome — figure number, title, caption.
 * Matches the rest of the brand shell.
 */
export function Figure({ number, title, caption, children, breakout = false }: FigureProps) {
  return (
    <figure
      className={clsx(
        "my-10 not-prose",
        breakout && "lg:-mx-16"
      )}
    >
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-baseline gap-3 px-5 pt-4 pb-3 border-b border-dark-700/40">
          {number !== undefined && (
            <span className="text-[10px] uppercase tracking-wider font-semibold text-crimson-400 tnum">
              Fig. {number}
            </span>
          )}
          <h3 className="text-sm font-semibold text-dark-100">{title}</h3>
        </div>
        <div className="p-2 sm:p-4">{children}</div>
      </div>
      {caption && (
        <figcaption className="mt-3 px-1 text-xs text-dark-400 leading-relaxed max-w-2xl">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
