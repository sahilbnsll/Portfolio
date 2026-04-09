"use client";

import { motion } from "framer-motion";

export default function SystemStatus() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 font-mono text-[10px] text-muted-foreground/70 sm:justify-start">
      <span className="flex items-center gap-1.5">
        <motion.span
          className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500"
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        All Systems Operational
      </span>
      <span className="hidden sm:inline">·</span>
      <span>Uptime 99.99%</span>
      <span className="hidden sm:inline">·</span>
      <span>Edge: Vercel BOM1</span>
    </div>
  );
}
