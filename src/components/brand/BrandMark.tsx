"use client";

import Link from "next/link";

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact }: BrandMarkProps) {
  return (
    <div
      className={`w-full flex items-center justify-center ${compact ? "mb-3" : "mb-6"}`}
    >
      <Link
        href="/"
        className="flex items-center justify-center w-full group"
        aria-label="AccountCamp - Inicio"
      >
        <span className="font-rounded text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
          AccountCamp
        </span>
      </Link>
    </div>
  );
}
