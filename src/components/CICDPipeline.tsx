"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type PipelineStage = {
  id: string;
  label: string;
  icon: string;
  tools: string;
  detail: string;
  duration: string;
  status: "success" | "running" | "pending";
};

const stages: PipelineStage[] = [
  {
    id: "push",
    label: "Push",
    icon: "📤",
    tools: "GitHub + branch protection",
    detail: "Feature branch merged via PR with required reviews. Conventional commits enforced.",
    duration: "~0s",
    status: "success",
  },
  {
    id: "ci",
    label: "CI",
    icon: "⚡",
    tools: "GitHub Actions",
    detail: "Lint, type-check, and unit tests in parallel matrix. Fails fast on first error.",
    duration: "~45s",
    status: "success",
  },
  {
    id: "build",
    label: "Build",
    icon: "🔨",
    tools: "Docker → ECR",
    detail: "Multi-stage Docker build with layer caching. Tagged with git SHA + semver.",
    duration: "~2m",
    status: "success",
  },
  {
    id: "test",
    label: "Test",
    icon: "🧪",
    tools: "Jest + integration",
    detail: "Integration tests hit a real database. Coverage gates enforce minimum thresholds.",
    duration: "~3m",
    status: "success",
  },
  {
    id: "deploy",
    label: "Deploy",
    icon: "🚀",
    tools: "Terraform + Helm",
    detail: "Terraform plan attached to PR. ArgoCD syncs deployment. Rolling update, zero downtime.",
    duration: "~4m",
    status: "success",
  },
  {
    id: "monitor",
    label: "Monitor",
    icon: "📊",
    tools: "Prometheus + Grafana",
    detail: "Post-deploy smoke tests. Alertmanager routes to Slack if error rate exceeds SLO.",
    duration: "∞",
    status: "running",
  },
];

const statusDot: Record<string, string> = {
  success: "bg-emerald-500",
  running: "bg-blue-400 animate-pulse",
  pending: "bg-muted-foreground/50",
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const stageAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function CICDPipeline() {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const active = stages.find((s) => s.id === activeStage);

  return (
    <div className="space-y-3">
      {/* Pipeline flow */}
      <motion.div
        className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-0"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
      >
        {stages.map((stage, i) => (
          <motion.div
            key={stage.id}
            variants={stageAnim}
            className="flex items-center sm:flex-1"
          >
            <button
              onClick={() =>
                setActiveStage(activeStage === stage.id ? null : stage.id)
              }
              className={`flex w-full flex-row items-center gap-3 rounded-lg border p-3 text-left transition-all duration-200 sm:flex-col sm:gap-1 sm:p-3 sm:text-center ${
                activeStage === stage.id
                  ? "border-emerald-500/50 bg-emerald-500/10 scale-[1.02]"
                  : "border-border/40 bg-card/30 hover:border-emerald-500/20 hover:bg-card/50"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 w-1.5 rounded-full ${statusDot[stage.status]}`} />
                <span className="text-lg sm:text-xl">{stage.icon}</span>
              </div>
              <div className="sm:space-y-0.5">
                <span className="block text-xs font-bold text-foreground">
                  {stage.label}
                </span>
                <span className="block font-mono text-[10px] text-muted-foreground">
                  {stage.tools}
                </span>
              </div>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground/60 sm:ml-0">
                {stage.duration}
              </span>
            </button>
            {i < stages.length - 1 && (
              <>
                <motion.span
                  className="hidden px-0.5 text-[10px] text-emerald-500/50 sm:block"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                >
                  →
                </motion.span>
                <div className="mx-auto h-2 w-px bg-border/40 sm:hidden" />
              </>
            )}
          </motion.div>
        ))}
      </motion.div>

      <p className="text-center font-mono text-[10px] text-muted-foreground">
        tap a stage to inspect
      </p>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-emerald-500/20 bg-card/60 p-4">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{active.icon}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">{active.label}</h3>
                  <p className="font-mono text-[11px] text-emerald-400">{active.tools}</p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">{active.duration}</span>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                {active.detail}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary stats */}
      <div className="flex items-center justify-center gap-4 rounded-lg border border-border/30 bg-card/20 px-3 py-2 sm:gap-6">
        {[
          { value: "~10m", label: "Push → Prod" },
          { value: "Daily", label: "Cadence" },
          { value: "0", label: "Manual" },
          { value: "30%↑", label: "Faster" },
        ].map((stat, i, arr) => (
          <div key={stat.label} className="flex items-baseline gap-1.5">
            <span className="font-mono text-xs font-bold text-foreground sm:text-sm">
              {stat.value}
            </span>
            <span className="text-[10px] text-muted-foreground">{stat.label}</span>
            {i < arr.length - 1 && <span className="ml-2 text-border/60 sm:ml-3">·</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
