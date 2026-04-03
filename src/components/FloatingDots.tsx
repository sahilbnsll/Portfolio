"use client";

import { cn } from "@/lib/utils";

type FloatingDotsProps = {
  className?: string;
  /** Number of dots (default 14) */
  count?: number;
};

export default function FloatingDots({
  className,
  count = 14,
}: FloatingDotsProps) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
      aria-hidden
    >
      {Array.from({ length: count }, (_, i) => {
        const size = 3 + (i % 4);
        return (
          <span
            key={i}
            className="animate-float-dot absolute rounded-full bg-primary/25 dark:bg-primary/35"
            style={{
              width: size,
              height: size,
              left: `${(i * 13.7 + (i % 3) * 5) % 94}%`,
              top: `${(i * 17.3 + (i % 5) * 7) % 90}%`,
              animationDelay: `${i * 0.35}s`,
              animationDuration: `${7 + (i % 6)}s`,
            }}
          />
        );
      })}
    </div>
  );
}
