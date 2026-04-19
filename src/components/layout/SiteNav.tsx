"use client";

import Link from "next/link";
import clsx from "clsx";

interface SiteNavProps {
  current: "demo" | "explainer";
}

const LINKS: Array<{ id: SiteNavProps["current"]; label: string; href: string }> = [
  { id: "demo", label: "Demo", href: "/" },
  { id: "explainer", label: "How it works", href: "/explainer" },
];

export function SiteNav({ current }: SiteNavProps) {
  return (
    <nav className="inline-flex p-0.5 rounded-lg glass-subtle" aria-label="Main">
      {LINKS.map((link) => {
        const active = current === link.id;
        return (
          <Link
            key={link.id}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={clsx(
              "px-3 py-1.5 rounded-md text-xs font-medium transition-colors border",
              active
                ? "bg-crimson-500/15 text-crimson-300 border-crimson-500/35"
                : "text-dark-400 hover:text-dark-200 border-transparent"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
