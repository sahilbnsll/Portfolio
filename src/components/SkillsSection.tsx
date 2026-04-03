"use client";

import skillsData from "@/data/skills.json";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { getToolIcon } from "@/lib/tool-icons";

// Flatten all skills from all categories into a unique list
const allSkills = Array.from(
  new Map(
    skillsData.categories
      .flatMap((cat) => cat.skills)
      .map((s) => [s.name, s]),
  ).values(),
);

export default function SkillsSection({ className }: { className?: string }) {
  const coreSkills = [
    "AWS",
    "Kubernetes",
    "Docker",
    "Terraform",
    "Prometheus",
    "Grafana",
    "n8n",
    "Supabase",
  ];
  const preferred = allSkills.filter((s) => coreSkills.includes(s.name));
  const skillsToRender =
    preferred.length > 0 ? preferred : allSkills.slice(0, coreSkills.length);

  return (
    <section className={cn("scroll-mt-28", className)}>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {skillsToRender.map((skill) => {
          const icon = getToolIcon(skill.name);
          return (
            <motion.div
              key={skill.name}
              whileHover={{ y: -3, scale: 1.02 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="group relative flex flex-col items-center justify-between gap-2 rounded-xl border border-border/60 bg-card/70 px-3 py-3 text-center text-xs font-medium text-foreground backdrop-blur-sm transition-all duration-300 cursor-pointer"
              title={skill.description}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg sm:h-9 sm:w-9">
                <div className="flex h-full w-full items-center justify-center rounded-lg bg-background/30 transition-all duration-300 group-hover:bg-primary/10">
                  {icon && (
                    <img
                      src={icon.url}
                      alt={`${skill.name} icon`}
                      className="size-4 sm:size-5 grayscale opacity-70 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 group-hover:drop-shadow-[0_0_16px_rgba(255,255,255,0.22)]"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
              <span className="mt-1 line-clamp-1 transition-colors duration-300 group-hover:text-primary">
                {skill.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
