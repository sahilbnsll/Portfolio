"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import careerData from "@/data/career.json";
import educationData from "@/data/education.json";
import skillsData from "@/data/skills.json";
import projectsData from "@/data/projects.json";
import { FileDown, Search, Cloud, GitBranch, Container, Shield, Terminal, Activity, Workflow } from "lucide-react";

const filterTags = [
  { label: "AWS", icon: Cloud },
  { label: "Terraform", icon: GitBranch },
  { label: "Kubernetes", icon: Container },
  { label: "Docker", icon: Container },
  { label: "GitHub Actions", icon: Workflow },
  { label: "Prometheus", icon: Activity },
  { label: "CI/CD", icon: Terminal },
  { label: "Auth0", icon: Shield },
];

type Position = {
  org: string;
  logo: string;
  title: string;
  start: string;
  end?: string;
  bullets: string[];
};

const positions: Position[] = (careerData.career ?? []).flatMap((org) =>
  (org.positions ?? []).map((pos) => ({
    org: org.name,
    logo: org.logo,
    title: pos.title,
    start: pos.start,
    end: (pos as any).end as string | undefined,
    bullets: pos.description ?? [],
  })),
);

const education = (educationData.education ?? []).flatMap((org) =>
  (org.positions ?? []).map((pos) => ({
    org: org.name,
    logo: org.logo,
    title: pos.title,
    start: pos.start,
    end: (pos as any).end as string | undefined,
    bullets: pos.description ?? [],
  })),
);

const coreSkills = (skillsData.categories ?? [])
  .flatMap((c) => (c.skills ?? []))
  .filter((s: any) => s.level >= 80)
  .map((s: any) => s.name as string);

const projects = (projectsData.projects ?? []).map((p: any) => ({
  name: p.name,
  slug: p.slug,
  summary: p.summary ?? "",
  tags: p.tags ?? [],
  metrics: p.metrics ?? [],
  image: p.image ?? null,
}));

function textMatchesFilter(text: string, filter: string): boolean {
  const lower = text.toLowerCase();
  const filterLower = filter.toLowerCase();
  if (lower.includes(filterLower)) return true;
  const aliases: Record<string, string[]> = {
    aws: ["ec2", "ecs", "eks", "rds", "s3", "iam", "vpc", "lambda", "cloudfront", "cloudformation", "ecr", "efs", "sso"],
    terraform: ["iac", "infrastructure as code", "clickops"],
    kubernetes: ["k8s", "eks", "pod", "helm", "kubectl", "karpenter"],
    docker: ["container", "multi-stage"],
    "github actions": ["ci/cd", "workflow", "pipeline"],
    prometheus: ["alertmanager", "observability", "monitoring", "metrics"],
    "ci/cd": ["pipeline", "deploy", "github actions", "jenkins", "azure devops"],
    auth0: ["sso", "authentication", "identity"],
  };
  const terms = aliases[filterLower] ?? [filterLower];
  return terms.some((t) => lower.includes(t));
}

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function InteractiveResume() {
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const allFilters = useMemo(() => {
    const filters = [...activeFilters];
    if (searchQuery.trim()) filters.push(searchQuery.trim());
    return filters;
  }, [activeFilters, searchQuery]);

  const hasFilters = allFilters.length > 0;

  const toggleFilter = (tag: string) => {
    setActiveFilters((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  return (
    <motion.div className="space-y-8" initial="hidden" animate="show" variants={stagger}>
      {/* ── Header ── */}
      <motion.div variants={fadeUp} className="flex items-start gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-border/60">
          <Image src="/img/sahil1.jpeg" alt="Sahil Bansal" fill className="object-cover" sizes="80px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-foreground">Sahil Bansal</h2>
            <a
              href="/Sahil_Bansal_Resume.pdf"
              download="Sahil_Bansal_Resume.pdf"
              className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-zinc-900 transition-colors hover:bg-emerald-400"
            >
              <FileDown className="size-3.5" />
              PDF
            </a>
          </div>
          <p className="mt-0.5 text-sm font-medium text-emerald-500 dark:text-emerald-400">
            DevOps &amp; Cloud Infrastructure Engineer
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Building reliable, cost-efficient cloud systems. AWS infrastructure,
            Terraform IaC, CI/CD automation, and production observability.
          </p>
        </div>
      </motion.div>

      {/* ── Filter bar with search ── */}
      <motion.div variants={fadeUp} className="sticky top-16 z-40">
        <div className="rounded-lg border border-border/60 bg-background/90 p-3 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 rounded-md border border-border/40 bg-card/60 px-3 py-1.5">
            <Search className="size-3.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills (e.g. Kafka, Python, EKS...)"
              className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground/60"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-xs text-muted-foreground hover:text-foreground">
                ✕
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filterTags.map(({ label, icon: Icon }) => {
              const isActive = activeFilters.includes(label);
              return (
                <button
                  key={label}
                  onClick={() => toggleFilter(label)}
                  className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-all ${
                    isActive
                      ? "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 ring-1 ring-emerald-500/40"
                      : "bg-secondary text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  <Icon className="size-3" />
                  {label}
                </button>
              );
            })}
            {hasFilters && (
              <button
                onClick={() => { setActiveFilters([]); setSearchQuery(""); }}
                className="rounded-full px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Core Skills ── */}
      <motion.section variants={fadeUp}>
        <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Core Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {coreSkills.map((skill) => {
            const isHighlighted = hasFilters && allFilters.some((f) => textMatchesFilter(skill, f));
            return (
              <span
                key={skill}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-all ${
                  isHighlighted
                    ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-500 dark:text-emerald-400"
                    : hasFilters
                      ? "border-border/30 bg-card/30 text-muted-foreground/40"
                      : "border-border/50 bg-card/50 text-foreground"
                }`}
              >
                {skill}
              </span>
            );
          })}
        </div>
      </motion.section>

      {/* ── Experience (waterfall timeline) ── */}
      <motion.section variants={fadeUp}>
        <h3 className="mb-6 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Experience
        </h3>
        <div className="relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border/50 sm:left-1/2 sm:-translate-x-px" />

          <div className="space-y-8">
            {positions.map((pos, idx) => {
              const isLeft = idx % 2 === 0;
              const hasMatches = !hasFilters || pos.bullets.some((b) => allFilters.some((f) => textMatchesFilter(b, f)));

              return (
                <div
                  key={`${pos.org}-${pos.title}`}
                  className={`relative flex items-start gap-4 transition-all ${!hasMatches ? "opacity-25" : ""} ${
                    isLeft ? "sm:flex-row" : "sm:flex-row-reverse"
                  }`}
                >
                  {/* Timeline dot */}
                  <div className="absolute left-4 z-10 -translate-x-1/2 sm:left-1/2">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full border-2 border-border bg-background">
                      <Image src={pos.logo} alt={pos.org} fill className="object-contain p-0.5" sizes="32px" />
                    </div>
                  </div>

                  {/* Content card */}
                  <div className={`ml-10 w-full rounded-lg border border-border/50 bg-card/40 p-4 sm:ml-0 sm:w-[calc(50%-2rem)] ${
                    isLeft ? "" : ""
                  }`}>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-foreground">{pos.title}</h4>
                        <p className="text-xs text-muted-foreground">{pos.org}</p>
                      </div>
                      <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {pos.start}{pos.end ? ` – ${pos.end}` : " – Now"}
                      </span>
                    </div>
                    <ul className="mt-3 space-y-1.5">
                      {pos.bullets.map((bullet, i) => {
                        const isMatch = !hasFilters || allFilters.some((f) => textMatchesFilter(bullet, f));
                        return (
                          <li key={i} className={`flex items-start gap-2 text-[13px] leading-relaxed transition-all ${
                            isMatch ? "text-foreground" : "text-muted-foreground/30"
                          }`}>
                            <span className={`mt-1.5 h-1 w-1 shrink-0 rounded-full ${
                              isMatch && hasFilters ? "bg-emerald-500" : "bg-muted-foreground/40"
                            }`} />
                            {bullet}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Education ── */}
      <motion.section variants={fadeUp}>
        <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Education
        </h3>
        {education.map((edu) => (
          <div key={`${edu.org}-${edu.title}`} className="rounded-lg border border-border/50 bg-card/40 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-md border border-border/40">
                  <Image src={edu.logo} alt={edu.org} fill className="object-contain p-0.5" sizes="32px" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-foreground">{edu.title}</h4>
                  <p className="text-xs text-muted-foreground">{edu.org}</p>
                </div>
              </div>
              <span className="shrink-0 font-mono text-[11px] text-muted-foreground">{edu.start} – {edu.end}</span>
            </div>
            <ul className="mt-3 space-y-1">
              {edu.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-[13px] leading-relaxed text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/40" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </motion.section>

      {/* ── Key Projects with thumbnails ── */}
      <motion.section variants={fadeUp}>
        <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Projects
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {projects.slice(0, 6).map((proj) => {
            const tagMatch = hasFilters && allFilters.some((f) =>
              proj.tags.some((t: string) => textMatchesFilter(t, f)) || textMatchesFilter(proj.summary, f),
            );
            const dimmed = hasFilters && !tagMatch;
            return (
              <a
                key={proj.slug}
                href={`/projects/${proj.slug}`}
                className={`group block overflow-hidden rounded-lg border border-border/50 bg-card/40 transition-all hover:border-emerald-500/30 ${
                  dimmed ? "opacity-25" : ""
                }`}
              >
                {proj.image && (
                  <div className="relative aspect-[16/9] w-full bg-muted">
                    <Image src={proj.image} alt="" fill className="object-cover transition-transform group-hover:scale-105" sizes="(max-width: 640px) 100vw, 50vw" />
                  </div>
                )}
                <div className="p-3.5">
                  <h4 className="text-sm font-bold text-foreground">{proj.name}</h4>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">{proj.summary}</p>
                  {proj.metrics.length > 0 && (
                    <p className="mt-2 font-mono text-[11px] font-medium text-emerald-500 dark:text-emerald-400">{proj.metrics[0]}</p>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      </motion.section>
    </motion.div>
  );
}
