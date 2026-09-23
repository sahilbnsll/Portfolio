"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Lock, RotateCw, Plus } from "lucide-react";
import type { ReactNode } from "react";

type BrowserFrameProps = {
  children: ReactNode;
  url?: string;
  className?: string;
};

/** Traffic-light dot that reveals its macOS glyph (close/minimize/zoom) on group hover. */
function TrafficLight({
  color,
  glyphPath,
}: {
  color: string;
  glyphPath: string;
}) {
  return (
    <span
      className="relative flex size-[11px] shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_0.5px_rgba(0,0,0,0.15)]"
      style={{ backgroundColor: color }}
    >
      <svg
        viewBox="0 0 10 10"
        className="size-[6px] opacity-0 transition-opacity duration-150 group-hover/traffic:opacity-100"
        aria-hidden="true"
      >
        <path
          d={glyphPath}
          stroke="rgba(0,0,0,0.55)"
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

export default function BrowserFrame({
  children,
  url = "app.portfolio.local",
  className,
}: BrowserFrameProps) {
  const displayUrl = url.replace(/^https?:\/\//, "");

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-lg ring-1 ring-black/[0.04] dark:ring-white/[0.08]",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-3 border-b border-border/60 bg-gradient-to-b from-muted/70 to-muted/30 px-3 py-2.5">
        <div className="group/traffic flex shrink-0 items-center gap-[7px]">
          <TrafficLight color="#ff5f57" glyphPath="M2.5 2.5L7.5 7.5M7.5 2.5L2.5 7.5" />
          <TrafficLight color="#febc2e" glyphPath="M2.2 5H7.8" />
          <TrafficLight color="#28c840" glyphPath="M2.3 5H7.7M2.3 5L4 3.3M2.3 5L4 6.7M7.7 5L6 3.3M7.7 5L6 6.7" />
        </div>

        {/* Back / forward — decorative, matches real browser chrome */}
        <div className="hidden shrink-0 items-center gap-1 text-muted-foreground/50 min-[420px]:flex">
          <ChevronLeft className="size-3.5" aria-hidden />
          <ChevronRight className="size-3.5" aria-hidden />
        </div>

        {/* Address pill */}
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-md border border-border/50 bg-background/90 px-2.5 py-[5px] shadow-[inset_0_1px_1px_rgba(0,0,0,0.03)]">
          <Lock className="size-2.5 shrink-0 text-muted-foreground/60" aria-hidden />
          <span className="truncate font-mono text-[10px] text-muted-foreground sm:text-[11px]">
            {displayUrl}
          </span>
          <RotateCw className="ml-auto size-2.5 shrink-0 text-muted-foreground/40" aria-hidden />
        </div>

        {/* New-tab affordance — decorative */}
        <div className="hidden shrink-0 text-muted-foreground/40 min-[420px]:block">
          <Plus className="size-3.5" aria-hidden />
        </div>
      </div>
      <div className="relative bg-background">{children}</div>
    </div>
  );
}
