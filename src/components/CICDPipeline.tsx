"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GitPullRequest,
  Zap,
  Package,
  FlaskConical,
  Rocket,
  Activity,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Clock,
  Sparkles,
} from "lucide-react";

type PipelineStage = {
  id: string;
  label: string;
  subtitle: string;
  icon: typeof GitPullRequest;
  tools: string[];
  duration: string;
  gate: string;
  execution: string;
  rollback: string;
  status: "success" | "running";
};

const stages: PipelineStage[] = [
  {
    id: "push",
    label: "1. PR & Merge",
    subtitle: "Branch Protection",
    icon: GitPullRequest,
    tools: ["GitHub", "CODEOWNERS"],
    duration: "~0s",
    gate: "Strict branch protection requiring 1+ peer review and passing checks on main.",
    execution:
      "Conventional commit enforcement (semantic versioning triggers), automated changelog generation, and merge queue synchronization.",
    rollback: "Instant commit revert via protected PR.",
    status: "success",
  },
  {
    id: "ci",
    label: "2. Fast Matrix CI",
    subtitle: "Static Validation",
    icon: Zap,
    tools: ["GitHub Actions", "Biome", "tsc"],
    duration: "~42s",
    gate: "Fail-fast on any linter warning, type check error, or security secret leak scan.",
    execution:
      "Parallelized matrix execution across multiple runners: ESLint, TypeScript compiler, Trivy security vulnerability scanner, and TruffleHog secrets detection.",
    rollback: "Pipeline terminates immediately; PR merge is strictly blocked.",
    status: "success",
  },
  {
    id: "build",
    label: "3. Docker & Artifact",
    subtitle: "Container Packaging",
    icon: Package,
    tools: ["Docker Buildx", "AWS ECR"],
    duration: "~1m 45s",
    gate: "Hermetic build verification with SHA-256 image digest validation.",
    execution:
      "Multi-stage Docker builds using Buildx cache mounts and GitHub Actions cache backend. Minimal distroless base images tagged with git SHA and semver.",
    rollback: "Build failure prevents registry publishing; previous image remains current.",
    status: "success",
  },
  {
    id: "test",
    label: "4. Integration Suite",
    subtitle: "Verification Gates",
    icon: FlaskConical,
    tools: ["Jest", "Testcontainers", "Postgres"],
    duration: "~2m 50s",
    gate: "80%+ test coverage gate, zero regression tolerance, clean DB migration test.",
    execution:
      "Spins up ephemeral PostgreSQL and Redis instances via Testcontainers. Executes full schema migrations, tenant isolation security tests, and idempotent worker contract runs.",
    rollback: "Artifact rejected; deploy phase is never triggered.",
    status: "success",
  },
  {
    id: "deploy",
    label: "5. GitOps Deploy",
    subtitle: "Continuous Delivery",
    icon: Rocket,
    tools: ["ArgoCD", "Helm", "Terraform"],
    duration: "~3m 15s",
    gate: "Automated pre-sync health checks and canary traffic progression.",
    execution:
      "ArgoCD detects Git manifest commit, performs dry-run diff, and orchestrates zero-downtime rolling update on AWS EKS cluster with Karpenter auto-scaling capacity.",
    rollback: "Automated ArgoCD auto-rollback to previous healthy revision on probe failure.",
    status: "success",
  },
  {
    id: "monitor",
    label: "6. SLO Monitoring",
    subtitle: "Live Telemetry",
    icon: Activity,
    tools: ["Prometheus", "Grafana", "Slack Alertmanager"],
    duration: "Continuous",
    gate: "Post-deployment error budget burn rate and P95 latency sanity threshold.",
    execution:
      "Automated synthetic smoke tests fire against live canary endpoints. Alertmanager validates that 5xx error rate remains below 0.01% of overall ingress traffic.",
    rollback: "Automated P1 page to on-call with automatic traffic diversion.",
    status: "running",
  },
];

export default function CICDPipeline() {
  const [activeStage, setActiveStage] = useState<string>("deploy");
  const active = stages.find((s) => s.id === activeStage) || stages[4];

  return (
    <div className="space-y-6">
      {/* Stages Flow Cards */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
        {stages.map((stage, i) => {
          const Icon = stage.icon;
          const isSelected = activeStage === stage.id;

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => setActiveStage(stage.id)}
              className={`group flex w-full flex-col items-start gap-2 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                isSelected
                  ? "border-blue-500/80 bg-blue-500/[0.08] shadow-sm ring-1 ring-blue-500/40"
                  : "border-border/60 bg-card/50 hover:border-blue-500/30 hover:bg-card/80"
              }`}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                    isSelected
                      ? "border-blue-500/40 bg-blue-500/20 text-blue-600 dark:text-blue-400"
                      : "border-border/50 bg-muted/40 text-muted-foreground group-hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      stage.status === "running"
                        ? "bg-blue-500 animate-pulse"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-mono text-[9px] text-muted-foreground">
                    {stage.duration}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-[13px] font-bold text-foreground tracking-tight leading-snug">
                  {stage.label}
                </h4>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground line-clamp-1">
                  {stage.subtitle}
                </p>
              </div>

              <div className="mt-1 flex w-full items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px] text-muted-foreground">
                <span>{stage.tools[0]}</span>
                <span className="text-[9px] text-blue-600 dark:text-blue-400 font-medium">
                  Gate {i + 1}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Stage Detail Inspector */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden rounded-xl border border-border/80 bg-card/60 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <active.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-foreground">{active.label}</h4>
                  <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 font-mono text-[10px] font-medium text-blue-600 dark:text-blue-400">
                    {active.duration}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{active.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {active.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-foreground"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Details Grid */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Quality Gate */}
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.03] p-3.5 sm:p-4">
                <div className="mb-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                    Verification Gate
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                  {active.gate}
                </p>
              </div>

              {/* Execution details */}
              <div className="rounded-lg border border-blue-500/25 bg-blue-500/[0.03] p-3.5 sm:p-4 sm:col-span-2">
                <div className="mb-2 flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                    Automated Execution
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                  {active.execution}
                </p>
              </div>
            </div>

            {/* Rollback Strategy */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-semibold text-foreground">
                  Failure Recovery & Rollback Action:
                </span>
              </div>
              <span className="font-mono text-xs text-muted-foreground">
                {active.rollback}
              </span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pipeline SLA Metrics */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { value: "< 10m", label: "Push to Production", sub: "Fully automated" },
          { value: "0 Downtime", label: "Rolling Deploys", sub: "Zero dropped requests" },
          { value: "100%", label: "Hermetic Artifacts", sub: "SHA-256 pinned" },
          { value: "Automated", label: "GitOps Rollback", sub: "Health-probe driven" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-border/60 bg-card/30 p-3 text-center sm:p-4"
          >
            <span className="block font-mono text-sm sm:text-base font-bold text-foreground">
              {item.value}
            </span>
            <span className="mt-0.5 block text-xs font-medium text-foreground/80">
              {item.label}
            </span>
            <span className="mt-0.5 block font-mono text-[10px] text-muted-foreground">
              {item.sub}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
