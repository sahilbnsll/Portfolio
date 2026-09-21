"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Network,
  Boxes,
  Workflow,
  Database,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Code2,
  FileCode,
} from "lucide-react";

export type FlowFilter = "all" | "sftp" | "api";

type DiagramNode = {
  id: string;
  label: string;
  subtitle: string;
  icon: typeof Users;
  tech: string[];
  protocol: string;
  flows: ("sftp" | "api")[];
  challenge: string;
  decision: string;
  metric: { value: string; label: string };
  specCode: { filename: string; code: string };
};

const nodes: DiagramNode[] = [
  {
    id: "ingress",
    label: "Merchant Clients",
    subtitle: "Ingress Traffic",
    icon: Users,
    tech: ["500+ Tenants", "SFTP Clients", "REST Consumers"],
    protocol: "TCP:22 / HTTPS:443",
    flows: ["sftp", "api"],
    challenge:
      "500+ independent merchants requiring isolated credential boundaries, private directory trees, and zero cross-tenant visibility.",
    decision:
      "Per-tenant chroot directory containment with automated credential rotation managed through Terraform and AWS Secrets Manager.",
    metric: { value: "100%", label: "Tenant Isolation" },
    specCode: {
      filename: "transfer-family.tf",
      code: `resource "aws_transfer_user" "merchant" {
  server_id      = aws_transfer_server.sftp.id
  user_name      = each.key
  role           = aws_iam_role.sftp_tenant.arn
  home_directory = "/bucket/tenants/\${each.key}"
}`,
    },
  },
  {
    id: "routing",
    label: "Dual Load Balancer",
    subtitle: "Traffic Ingress",
    icon: Network,
    tech: ["AWS NLB", "AWS ALB", "AWS WAF"],
    protocol: "L4 TCP + L7 HTTP",
    flows: ["sftp", "api"],
    challenge:
      "SFTP runs over raw TCP (port 22) which standard ALBs cannot terminate, while HTTP APIs require WAF inspection and TLS offloading.",
    decision:
      "Dual Ingress Architecture: Network Load Balancer (NLB) handles low-latency TCP:22 SFTP, while Application Load Balancer (ALB) terminates HTTPS with WAF rules.",
    metric: { value: "99.99%", label: "Ingress Uptime" },
    specCode: {
      filename: "dual-lb.tf",
      code: `# NLB for raw TCP:22 (SFTP)
resource "aws_lb_listener" "sftp" {
  load_balancer_arn = aws_lb.nlb.arn
  port              = 22
  protocol          = "TCP"
  default_action { type = "forward" }
}`,
    },
  },
  {
    id: "compute",
    label: "EKS Cluster",
    subtitle: "Compute & Orchestration",
    icon: Boxes,
    tech: ["Kubernetes 1.29", "Karpenter", "Helm"],
    protocol: "mTLS / VPC Mesh",
    flows: ["sftp", "api"],
    challenge:
      "Multi-tenant compute demand with unpredictable burst spikes; static node pools caused either high idle cloud bills or throttling.",
    decision:
      "Namespace-per-tenant Kubernetes partitioning with hard ResourceQuotas and Karpenter for sub-minute just-in-time spot instance provisioning.",
    metric: { value: "40%", label: "Cost Reduction" },
    specCode: {
      filename: "karpenter-nodepool.yaml",
      code: `apiVersion: karpenter.sh/v1beta1
kind: NodePool
metadata:
  name: tenant-burst-pool
spec:
  template:
    spec:
      requirements:
        - key: "karpenter.sh/capacity-type"
          operator: In
          values: ["spot", "on-demand"]`,
    },
  },
  {
    id: "services",
    label: "Async Processing",
    subtitle: "Workers & Queues",
    icon: Workflow,
    tech: ["AWS SQS FIFO", "FastAPI", "Celery"],
    protocol: "Event-Driven",
    flows: ["sftp", "api"],
    challenge:
      "Merchants frequently re-upload batch catalogs or retry webhooks, creating duplicate processing records and data anomalies.",
    decision:
      "Event-driven architecture utilizing AWS SQS FIFO queues with content-based deduplication keys and automated Dead-Letter Queues (DLQ).",
    metric: { value: "0", label: "Duplicate Records" },
    specCode: {
      filename: "sqs-pipeline.tf",
      code: `resource "aws_sqs_queue" "merchant_events" {
  name                        = "merchant-events.fifo"
  fifo_queue                  = true
  content_based_deduplication = true
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dlq.arn
    maxReceiveCount     = 3
  })
}`,
    },
  },
  {
    id: "database",
    label: "Database Layer",
    subtitle: "Data Persistence",
    icon: Database,
    tech: ["PostgreSQL RDS", "PgBouncer", "Read Replicas"],
    protocol: "Postgres Wire / SSL",
    flows: ["sftp", "api"],
    challenge:
      "500+ merchants executing queries against shared database tables without cross-tenant leakage or connection pool exhaustion.",
    decision:
      "PostgreSQL Row-Level Security (RLS) enforcing tenant isolation at the engine level, fronted by PgBouncer transaction connection pooling.",
    metric: { value: "<12ms", label: "P95 Read Latency" },
    specCode: {
      filename: "tenant-rls.sql",
      code: `ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_policy ON transactions
  AS RESTRICTIVE
  USING (tenant_id = current_setting('app.current_tenant_id'));`,
    },
  },
  {
    id: "observability",
    label: "Observability",
    subtitle: "Telemetry & SRE",
    icon: Activity,
    tech: ["Prometheus", "Grafana", "Alertmanager"],
    protocol: "OpenTelemetry / Push",
    flows: ["sftp", "api"],
    challenge:
      "Severe on-call alert fatigue from raw infrastructure alerts across hundreds of noisy per-tenant client workloads.",
    decision:
      "Shifted to Service Level Indicator (SLI) and Error Budget alerting focusing exclusively on user-impacting latency and failure thresholds.",
    metric: { value: "<5m", label: "MTTR Resolution" },
    specCode: {
      filename: "alerts.yaml",
      code: `- alert: HighErrorBudgetBurn
  expr: rate(http_requests_total{status=~"5.."}[5m]) 
        / rate(http_requests_total[5m]) > 0.01
  for: 2m
  labels: { severity: critical }`,
    },
  },
];

const flowOrder = ["ingress", "routing", "compute", "services", "database", "observability"];

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string>("compute");
  const [flowFilter, setFlowFilter] = useState<FlowFilter>("all");
  const [showCode, setShowCode] = useState(false);

  const active = nodes.find((n) => n.id === activeNode) || nodes[2];

  return (
    <div className="space-y-6">
      {/* Top Filter Bar: Interactive Flow Highlighting */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/60 bg-muted/20 p-1 max-w-full">
          <span className="px-2 font-mono text-[11px] font-medium text-muted-foreground whitespace-nowrap">
            Filter Path:
          </span>
          <button
            type="button"
            onClick={() => setFlowFilter("all")}
            className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition-all whitespace-nowrap ${
              flowFilter === "all"
                ? "bg-background text-foreground shadow-sm font-semibold border border-border/50"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Topologies
          </button>
          <button
            type="button"
            onClick={() => setFlowFilter("sftp")}
            className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition-all whitespace-nowrap ${
              flowFilter === "sftp"
                ? "bg-amber-500/15 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            SFTP Batch (TCP:22)
          </button>
          <button
            type="button"
            onClick={() => setFlowFilter("api")}
            className={`rounded-md px-2.5 py-1 font-mono text-[11px] font-medium transition-all whitespace-nowrap ${
              flowFilter === "api"
                ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 font-semibold border border-blue-500/30"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            REST API (HTTPS:443)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Interactive Topology • Click node to inspect</span>
        </div>
      </div>

      {/* Grid of Topology Nodes with Connected Visual Flow */}
      <div className="grid grid-cols-1 min-[340px]:grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6 lg:gap-2">
        {flowOrder.map((id, index) => {
          const node = nodes.find((n) => n.id === id)!;
          const isSelected = activeNode === id;
          const isFilteredOut =
            flowFilter !== "all" && !node.flows.includes(flowFilter);

          const Icon = node.icon;

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative"
            >
              <button
                type="button"
                onClick={() => setActiveNode(id)}
                className={`group relative flex w-full flex-col items-start gap-2.5 rounded-xl border p-3.5 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-emerald-500/80 bg-emerald-500/[0.08] shadow-sm ring-1 ring-emerald-500/40"
                    : isFilteredOut
                      ? "border-border/30 bg-card/20 opacity-40 hover:opacity-75"
                      : "border-border/60 bg-card/50 hover:border-emerald-500/30 hover:bg-card/80"
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      isSelected
                        ? "border-emerald-500/40 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "border-border/50 bg-muted/40 text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  <span className="font-mono text-[9px] text-muted-foreground/80 uppercase tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-[13px] font-bold text-foreground tracking-tight leading-snug">
                    {node.label}
                  </h3>
                  <p className="mt-0.5 font-mono text-[10px] text-muted-foreground line-clamp-1">
                    {node.tech[0]}
                  </p>
                </div>

                <div className="mt-1 flex w-full items-center justify-between border-t border-border/40 pt-2 font-mono text-[10px]">
                  <span className="text-muted-foreground text-[9px]">{node.protocol}</span>
                  <span
                    className={`font-semibold ${
                      isSelected
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  >
                    {node.metric.value}
                  </span>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Deep Dive Inspector Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden rounded-xl border border-border/80 bg-card/60 backdrop-blur-md"
        >
          {/* Inspector Header */}
          <div className="flex flex-col gap-3 border-b border-border/60 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <active.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-base font-bold text-foreground">{active.label}</h4>
                  <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                    {active.protocol}
                  </span>
                </div>
                <p className="font-mono text-xs text-muted-foreground">{active.subtitle}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {active.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border/60 bg-muted/30 px-2.5 py-1 font-mono text-[11px] text-foreground"
                >
                  {t}
                </span>
              ))}
              <button
                type="button"
                onClick={() => setShowCode(!showCode)}
                className="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background px-2.5 py-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
              >
                <Code2 className="h-3 w-3" />
                <span>{showCode ? "Hide Spec" : "View Spec"}</span>
              </button>
            </div>
          </div>

          {/* Inspector Content: Challenge vs Architecture Decision vs Measured Metric */}
          <div className="p-4 sm:p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* Challenge */}
              <div className="rounded-lg border border-amber-500/25 bg-amber-500/[0.03] p-3.5 sm:p-4">
                <div className="mb-2 flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                  <Zap className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                    Engineering Challenge
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                  {active.challenge}
                </p>
              </div>

              {/* Architectural Decision */}
              <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/[0.03] p-3.5 sm:p-4 sm:col-span-2">
                <div className="mb-2 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
                    Architectural Decision & Design
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] leading-relaxed text-muted-foreground">
                  {active.decision}
                </p>
              </div>
            </div>

            {/* Production Outcome Ribbon */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-emerald-500" />
                <span className="text-xs font-semibold text-foreground">
                  Production Impact & Reliability SLA:
                </span>
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {active.metric.value}
                </span>
                <span className="text-muted-foreground">{active.metric.label}</span>
              </div>
            </div>

            {/* Optional IaC / Code Blueprint Drawer */}
            {showCode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden rounded-lg border border-border/80 bg-black/90 p-4 font-mono text-xs text-neutral-300"
              >
                <div className="mb-2 flex items-center justify-between text-[11px] text-muted-foreground border-b border-neutral-800 pb-2">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <FileCode className="h-3.5 w-3.5" />
                    {active.specCode.filename}
                  </span>
                  <span>Production Configuration Snippet</span>
                </div>
                <pre className="overflow-x-auto text-[11px] leading-relaxed text-emerald-400/90 font-mono">
                  <code>{active.specCode.code}</code>
                </pre>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
