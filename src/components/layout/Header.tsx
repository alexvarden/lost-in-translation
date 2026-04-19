"use client";

import Link from "next/link";

interface HeaderProps {
  rightSlot?: React.ReactNode;
  /**
   * When true, the brand wordmark is rendered as an <h1> (use on pages with no
   * other primary heading). Default false — most pages have their own <h1>.
   */
  asPageHeading?: boolean;
}

export function Header({ rightSlot, asPageHeading = false }: HeaderProps) {
  const Wordmark = asPageHeading ? "h1" : "span";
  return (
    <header className="flex items-center justify-between pb-5 border-b border-dark-700/40">
      <Link href="/" className="flex items-center gap-3 group" aria-label="Lost in Translation — home">
        <CraneMark />
        <div>
          <Wordmark className="block text-lg font-semibold text-dark-100 leading-none group-hover:text-crimson-300 transition-colors">
            Lost in Translation
          </Wordmark>
          <span className="block text-xs text-dark-400 mt-1">
            Watch meaning melt as a phrase travels through language.
          </span>
        </div>
      </Link>
      {rightSlot}
    </header>
  );
}

function CraneMark() {
  // Minimal nod to the origami crane wireframe in Crane brand samples.
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="text-crimson-500" fill="none">
      <path
        d="M4 22 L16 6 L28 22 M10 22 L16 16 L22 22 M16 16 L16 26"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="6" r="1.6" fill="currentColor" />
      <circle cx="4" cy="22" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="28" cy="22" r="1.2" fill="currentColor" opacity="0.5" />
      <circle cx="16" cy="16" r="1.2" fill="currentColor" opacity="0.7" />
      <circle cx="16" cy="26" r="1.2" fill="currentColor" opacity="0.5" />
    </svg>
  );
}
