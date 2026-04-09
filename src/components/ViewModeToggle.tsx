"use client";

import { useViewMode } from "@/contexts/ViewModeContext";
import { motion } from "framer-motion";
import { Terminal, FileText } from "lucide-react";

export default function ViewModeToggle() {
  const { mode, toggleMode } = useViewMode();
  const isEngineer = mode === "engineer";

  return (
    <button
      onClick={toggleMode}
      className="group relative flex h-8 items-center gap-0.5 rounded-full border border-border/60 bg-secondary p-0.5"
      aria-label={`Switch to ${isEngineer ? "resume" : "engineer"} view`}
    >
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          isEngineer ? "text-secondary-foreground" : "text-muted-foreground"
        }`}
      >
        <Terminal className="size-3.5" />
      </span>
      <span
        className={`relative z-10 flex h-7 w-7 items-center justify-center rounded-full transition-colors duration-200 ${
          !isEngineer ? "text-secondary-foreground" : "text-muted-foreground"
        }`}
      >
        <FileText className="size-3.5" />
      </span>
      <motion.span
        className="absolute top-0.5 z-0 h-7 w-7 rounded-full bg-emerald-400"
        initial={false}
        animate={{ left: isEngineer ? 2 : 32 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      />
    </button>
  );
}
