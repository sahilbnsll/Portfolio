"use client";

import { useMemo } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import skillsData from "@/data/skills.json";
import { getToolIcon } from "@/lib/tool-icons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Cloud,
  Boxes,
  GitBranch,
  Eye,
  Database,
  Code2,
  Shield,
  Layers,
} from "lucide-react";

const CORE_SKILL_CATEGORIES = [
  "Cloud & Infrastructure",
  "Infrastructure as Code",
  "CI/CD & Automation",
  "Observability & Monitoring",
  "Data Engineering",
  "Databases",
  "Programming & Scripting",
  "Security & DevSecOps",
] as const;

type CategoryName = (typeof CORE_SKILL_CATEGORIES)[number];

const categoryMeta: Record<
  CategoryName,
  { color: string; Icon: (props: { className?: string }) => JSX.Element; key: string }
> = {
  "Cloud & Infrastructure": { color: "#3b82f6", Icon: Cloud as any, key: "cloud" },
  "Infrastructure as Code": { color: "#10b981", Icon: Boxes as any, key: "iac" },
  "CI/CD & Automation": { color: "#22c55e", Icon: GitBranch as any, key: "cicd" },
  "Observability & Monitoring": { color: "#8b5cf6", Icon: Eye as any, key: "obs" },
  "Data Engineering": { color: "#f59e0b", Icon: Layers as any, key: "data-eng" },
  Databases: { color: "#60a5fa", Icon: Database as any, key: "db" },
  "Programming & Scripting": { color: "#f97316", Icon: Code2 as any, key: "code" },
  "Security & DevSecOps": { color: "#ef4444", Icon: Shield as any, key: "sec" },
};

export default function CoreSkillsExpertiseSection({
  className,
}: {
  className?: string;
}) {
  const categories = skillsData.categories ?? [];

  const items = useMemo(() => {
    const byName = new Map(categories.map((c) => [c.name, c.skills.length]));
    return CORE_SKILL_CATEGORIES.map((name) => {
      const count = byName.get(name) ?? 0;
      return { name, count, meta: categoryMeta[name] };
    });
  }, [categories]);

  return (
    <section
      id="skills-expertise"
      className={className}
    >
      <div className="flex flex-col gap-2">
        <h2 className="title text-2xl sm:text-3xl">Skills & Expertise</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Technologies and tools I work with
        </p>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {items.map((item, idx) => {
          const { Icon, color, key } = item.meta;
          const category = categories.find((c) => c.name === item.name);
          return (
            <Dialog key={key}>
              <DialogTrigger asChild>
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="group relative rounded-xl border border-border/50 bg-card/60 p-4 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  type="button"
                  aria-label={`Show skills: ${item.name}`}
                  style={
                    {
                      ["--skill-color" as any]: color,
                    } as CSSProperties
                  }
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-[color:var(--skill-color)]/30 bg-background/30 transition-all duration-300 group-hover:bg-[color:var(--skill-color)]/20 group-hover:border-[color:var(--skill-color)]/60">
                      <Icon
                        style={{ color: "var(--skill-color)" }}
                        className="size-5 opacity-70 transition-all duration-300 group-hover:opacity-100 group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.22)] group-hover:scale-110"
                        aria-hidden
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-semibold text-foreground">
                        {item.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-muted-foreground">
                        {item.count} skills
                      </div>
                    </div>
                  </div>
                </motion.button>
              </DialogTrigger>
              <DialogContent
                style={
                  {
                    ["--skill-color" as any]: color,
                  } as CSSProperties
                }
                className="border-border/60 bg-card/70 backdrop-blur-sm"
              >
                <DialogHeader>
                  <DialogTitle>{item.name}</DialogTitle>
                  <DialogDescription>
                    {category?.skills.length ?? 0} skills in this lane
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {(category?.skills ?? []).map((s) => (
                    <div
                      key={s.name}
                      className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs text-foreground/90 transition-colors hover:border-[color:var(--skill-color)]/70 hover:bg-[color:var(--skill-color)]/10"
                      title={s.description}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <span className="flex size-5 items-center justify-center rounded-md border border-[color:var(--skill-color)]/35 bg-[color:var(--skill-color)]/10">
                            {getToolIcon(s.name) ? (
                              <img
                                src={getToolIcon(s.name)!.url}
                                alt={`${s.name} icon`}
                                className="size-3.5 object-contain"
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-[10px]">•</span>
                            )}
                          </span>
                          <span className="truncate font-medium">{s.name}</span>
                        </div>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {s.level}%
                        </span>
                      </div>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/50">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${s.level}%`,
                            backgroundColor: `var(--skill-color)`,
                          }}
                        />
                      </div>
                      <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-muted-foreground">
                        {s.description}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-end gap-2">
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40"
                    >
                      Close
                    </button>
                  </DialogClose>
                  <DialogClose asChild>
                    <button
                      type="button"
                      className="rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground hover:opacity-90"
                      onClick={() => {
                        document
                          .getElementById("skill-graph")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                    >
                      View in graph
                    </button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </section>
  );
}

