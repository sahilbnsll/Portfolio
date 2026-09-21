"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ArchitectureDiagram from "@/components/ArchitectureDiagram";
import CICDPipeline from "@/components/CICDPipeline";
import { Network, GitBranch, ShieldCheck, Zap, Server, Activity } from "lucide-react";

export default function ArchitectureShowcase() {
  const [activeTab, setActiveTab] = useState<"topology" | "pipeline">("topology");

  return (
    <div className="rounded-2xl border border-border/80 bg-card/40 p-4 sm:p-6 backdrop-blur-sm shadow-sm">
      {/* Navigation & Systems Badge Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 pb-5">
        <div className="flex flex-col min-[440px]:inline-flex min-[440px]:flex-row w-full sm:w-auto rounded-xl border border-border/70 bg-muted/40 p-1">
          <button
            type="button"
            onClick={() => setActiveTab("topology")}
            className={`flex items-center justify-center min-[440px]:justify-start gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === "topology"
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Network className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">Cloud Topology & Ingress</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pipeline")}
            className={`flex items-center justify-center min-[440px]:justify-start gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
              activeTab === "pipeline"
                ? "bg-background text-foreground shadow-sm border border-border/60"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GitBranch className="h-3.5 w-3.5 text-blue-500 shrink-0" />
            <span className="truncate">GitOps CI/CD Delivery</span>
          </button>
        </div>

        {/* Live architectural guarantees */}
        <div className="hidden items-center gap-4 font-mono text-[11px] text-muted-foreground lg:flex">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Multi-Tenant Isolation
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-amber-500" />
            Zero-Downtime Deploys
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            <Activity className="h-3.5 w-3.5 text-blue-500" />
            99.99% Availability
          </span>
        </div>
      </div>

      {/* Main Tab Panels */}
      <AnimatePresence mode="wait">
        {activeTab === "topology" ? (
          <motion.div
            key="topology"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <ArchitectureDiagram />
          </motion.div>
        ) : (
          <motion.div
            key="pipeline"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <CICDPipeline />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
