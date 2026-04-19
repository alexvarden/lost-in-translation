"use client";

import clsx from "clsx";
import { driftStroke } from "@/lib/drift";

interface ConnectorProps {
  /** Drift from prev step, if known. Undefined = dormant / not yet computed. */
  drift?: number;
  isRunning?: boolean;
}

/**
 * A small SVG arrow drawn between step cards.
 * Colour / thickness keyed to the drift between the two steps.
 */
export function Connector({ drift, isRunning }: ConnectorProps) {
  const hasDrift = typeof drift === "number";
  const stroke = hasDrift ? driftStroke(drift!) : "#3d3838";
  const weight = hasDrift ? 1.5 + drift! * 3 : 1.5;

  return (
    <div className="shrink-0 flex items-center" aria-hidden>
      <svg width="36" height="24" viewBox="0 0 36 24" className="overflow-visible">
        <line
          x1="0"
          y1="12"
          x2="30"
          y2="12"
          className={clsx("connector-line", isRunning && "is-running")}
          stroke={stroke}
          strokeWidth={weight}
          strokeLinecap="round"
        />
        <path
          d="M30 6 L36 12 L30 18"
          stroke={stroke}
          strokeWidth={weight}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
