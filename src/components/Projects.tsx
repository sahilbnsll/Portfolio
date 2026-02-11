"use client";

import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { ProjectCard } from "./ProjectCard";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  limit?: number;
}

export default function Projects({ limit }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Mount effect for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  const allProjects = useMemo(() => {
    let p = projectSchema.parse(data).projects;
    return limit ? p.slice(0, limit) : p;
  }, [limit]);

  const categories = useMemo(() => {
    const cats = new Set(allProjects.map((p) => (p as any).category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [allProjects]);

  const filteredProjects = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") {
      return allProjects;
    }
    return allProjects.filter((p) => (p as any).category === selectedCategory);
  }, [allProjects, selectedCategory]);

  const handleCategoryClick = (cat: string | null) => {
    setSelectedCategory(cat);
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
            Filter:
          </span>
          <div className="flex flex-wrap gap-2">
            {["All", "Infrastructure & DevOps", "CI/CD", "Security", "Data & Analytics"].map((cat) => (
              <div
                key={cat}
                className="px-3 py-1.5 text-xs font-medium rounded-full border border-border bg-background text-foreground animate-pulse"
              />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 rounded-lg border border-border bg-card animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
          Filter:
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = cat === "All" ? selectedCategory === null : selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat === "All" ? null : cat)}
                type="button"
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200 ${isActive
                    ? "bg-accent text-accent-foreground border-accent shadow-md hover:shadow-lg hover:scale-105"
                    : "border-border bg-background text-foreground hover:border-accent hover:bg-accent/5"
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {/* Clear Filter Button */}
        {selectedCategory && (
          <button
            onClick={() => handleCategoryClick(null)}
            type="button"
            className="ml-auto flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-accent hover:text-foreground md:ml-0"
            title="Clear filter"
          >
            <X className="size-3" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        <AnimatePresence>
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, idx) => (
              <motion.div
                key={`${project.name}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative"
              >
                {/* Spotlight glow effect on hover */}
                <motion.div
                  className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-accent/0 via-accent/20 to-accent/0 opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100 -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                <ProjectCard project={project} />
              </motion.div>
            ))
          ) : (
            <motion.div
              key="no-projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="col-span-full py-8 text-center text-muted-foreground"
            >
              <p className="text-sm">No projects found in this category.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
