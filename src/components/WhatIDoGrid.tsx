"use client";

import { motion } from "framer-motion";
import { Cloud, GitBranch, LineChart, Boxes } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    title: "Cloud architecture",
    body: "Multi-account AWS, HA ingress, cost-aware scaling—designed so teams ship without babysitting the control plane.",
    icon: Cloud,
  },
  {
    title: "CI/CD & delivery",
    body: "GitHub Actions, semantic releases, parallel tests, and caches that actually help—not pipeline theater.",
    icon: GitBranch,
  },
  {
    title: "Observability",
    body: "Prometheus, Grafana, SLIs that match on-call runbooks—find the signal before the customer does.",
    icon: LineChart,
  },
  {
    title: "IaC & platform",
    body: "Terraform-first, documented modules, and migrations away from ClickOps without freezing the org.",
    icon: Boxes,
  },
] as const;

export default function WhatIDoGrid({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      id="expertise"
      className={cn("relative scroll-mt-28", className)}
    >
      <div className="relative z-10 flex flex-col gap-6">
        <div>
          <h2 className="title text-2xl sm:text-3xl">what i do</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
            Four lanes visitors can scan in seconds—then we can go deep on
            Kubernetes trivia if you really want.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ITEMS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.35, delay: idx * 0.06 }}
                className="group relative overflow-hidden rounded-xl border border-border/50 bg-card/60 p-5 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card/80"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-5" aria-hidden />
                </div>
                <h3 className="font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
