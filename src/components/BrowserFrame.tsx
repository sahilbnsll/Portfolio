"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BrowserFrameProps = {
  children: ReactNode;
  url?: string;
  className?: string;
};

export default function BrowserFrame({
  children,
  url = "app.portfolio.local",
  className,
}: BrowserFrameProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-card/80 shadow-lg ring-1 ring-black/[0.04] dark:ring-white/[0.08]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-3 py-2.5">
        <span className="size-2.5 shrink-0 rounded-full bg-[#ff5f57] shadow-sm" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#febc2e] shadow-sm" />
        <span className="size-2.5 shrink-0 rounded-full bg-[#28c840] shadow-sm" />
        <div className="ml-1 min-w-0 flex-1 truncate rounded-md border border-border/50 bg-background/90 px-2.5 py-1 font-mono text-[10px] text-muted-foreground sm:text-[11px]">
          https://{url}
        </div>
      </div>
      <div className="relative bg-background">{children}</div>
    </div>
  );
}
