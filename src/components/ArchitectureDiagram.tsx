"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DiagramNode = {
  id: string;
  label: string;
  icon: string;
  tech: string;
  challenge: string;
  decision: string;
};

const nodes: DiagramNode[] = [
  {
    id: "users",
    label: "Merchants",
    icon: "👤",
    tech: "500+ SFTP connections",
    challenge: "Isolated credentials and directory access per tenant without cross-tenant data leakage.",
    decision: "Per-tenant chroot jails with automated credential rotation via Terraform.",
  },
  {
    id: "alb",
    label: "Load Balancer",
    icon: "⚖️",
    tech: "ALB + NLB",
    challenge: "SFTP is TCP, not HTTP — ALB can't handle it alone.",
    decision: "Dual LB: NLB for SFTP (TCP:22), ALB for HTTP APIs.",
  },
  {
    id: "eks",
    label: "EKS",
    icon: "☸️",
    tech: "Kubernetes + Helm",
    challenge: "Multi-tenant workloads with strict resource isolation and burst scaling.",
    decision: "Namespace-per-tenant, ResourceQuotas, Karpenter autoscaling.",
  },
  {
    id: "services",
    label: "Services",
    icon: "⚙️",
    tech: "SFTP / API / Workers",
    challenge: "Idempotent async processing — duplicate uploads can't produce duplicate records.",
    decision: "Event-driven with SQS, idempotency keys in Supabase, DLQ for failures.",
  },
  {
    id: "db",
    label: "Database",
    icon: "🗄️",
    tech: "PostgreSQL RDS",
    challenge: "500+ tenants in shared tables with isolation and query performance.",
    decision: "Row-level security, PgBouncer pooling, read replicas.",
  },
  {
    id: "monitoring",
    label: "Observability",
    icon: "📊",
    tech: "Prometheus + Grafana",
    challenge: "Alert fatigue from noisy per-tenant metrics across 500+ merchants.",
    decision: "SLI-based alerting (latency, error rate) with tenant drill-down.",
  },
];

const flowOrder = ["users", "alb", "eks", "services", "db", "monitoring"];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const nodeAnim = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
};

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const active = nodes.find((n) => n.id === activeNode);

  return (
    <div className="space-y-3">
      {/* Flow grid with animated connectors */}
      <motion.div
        className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6 lg:gap-0"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={stagger}
      >
        {flowOrder.map((id, i) => {
          const node = nodes.find((n) => n.id === id)!;
          const isActive = activeNode === id;
          return (
            <motion.div
              key={id}
              variants={nodeAnim}
              className="flex items-center"
            >
              <button
                onClick={() => setActiveNode(isActive ? null : id)}
                className={`flex w-full flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-all duration-200 ${
                  isActive
                    ? "border-emerald-500/60 bg-emerald-500/10 shadow-lg shadow-emerald-500/10 scale-[1.03]"
                    : "border-border/50 bg-card/40 hover:border-emerald-500/30 hover:bg-card/60"
                }`}
              >
                <span className="text-xl leading-none">{node.icon}</span>
                <span className="text-[11px] font-bold text-foreground sm:text-xs">
                  {node.label}
                </span>
                <span className="font-mono text-[9px] text-muted-foreground sm:text-[10px]">
                  {node.tech}
                </span>
              </button>
              {i < flowOrder.length - 1 && (
                <div className="hidden w-4 items-center justify-center lg:flex">
                  <motion.span
                    className="text-xs text-emerald-500/60"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                  >
                    →
                  </motion.span>
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <p className="text-center font-mono text-[10px] text-muted-foreground">
        tap a component to inspect
      </p>

      {/* Detail panel */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -6, height: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-emerald-500/20 bg-card/60 p-4 sm:p-5">
              <div className="mb-3 flex items-center gap-2.5">
                <span className="text-xl">{active.icon}</span>
                <div>
                  <h3 className="text-sm font-bold text-foreground">{active.label}</h3>
                  <p className="font-mono text-[11px] text-emerald-400">{active.tech}</p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="border-l-2 border-amber-500/40 pl-3">
                  <p className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-400/80">
                    Challenge
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {active.challenge}
                  </p>
                </div>
                <div className="border-l-2 border-emerald-500/40 pl-3">
                  <p className="mb-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80">
                    Decision
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    {active.decision}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
