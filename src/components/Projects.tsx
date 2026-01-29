"use client";

import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { ProjectCard } from "./ProjectCard";
import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import { X } from "lucide-react";

interface Props {
  limit?: number;
}

export default function Projects({ limit }: Props) {
  let projects = projectSchema.parse(data).projects;
  if (limit) {
    projects = projects.slice(0, limit);
  }

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Load filter from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("projectFilter");
    if (stored && stored !== "all") {
      setSelectedCategory(stored);
    }
    setMounted(true);
  }, []);

  // Persist filter selection to localStorage
  const handleCategoryChange = (cat: string | null) => {
    setSelectedCategory(cat);
    if (cat) {
      localStorage.setItem("projectFilter", cat);
    } else {
      localStorage.setItem("projectFilter", "all");
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if ((p as any).category) set.add((p as any).category);
    });
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (!selectedCategory || selectedCategory === "All") return projects;
    return projects.filter((p) => (p as any).category === selectedCategory);
  }, [projects, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
         type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <motion.section
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      {/* Filter Buttons */}
      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground md:text-sm">
          Filter:
        </span>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat || (cat === "All" && !selectedCategory);
            return (
              <button
                key={cat}
                onClick={() =>
                  handleCategoryChange(cat === "All" ? null : cat)
                }
                className={`
                  px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground border-accent shadow-md hover:shadow-lg hover:scale-105"
                      : "border-border bg-background text-foreground hover:border-accent hover:bg-accent/5"
                  }
                `}
              >
                {cat}
              </button>
            );
          })}
        </div>
        {/* Clear Filter Button */}
        {selectedCategory && (
          <motion.button
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "auto" }}
            exit={{ opacity: 0, width: 0 }}
            onClick={() => handleCategoryChange(null)}
            className="ml-auto flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground transition-all duration-200 hover:border-accent hover:text-foreground md:ml-0"
            title="Clear filter"
          >
            <X className="size-3" />
            <span className="hidden sm:inline">Clear</span>
          </motion.button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8">
        {mounted && filtered.length > 0 ? (
          filtered.map((project, id) => (
            <motion.div key={`${project.name}-${id}`} variants={itemVariants}>
              <ProjectCard project={project} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-full py-8 text-center text-muted-foreground"
          >
            <p className="text-sm">No projects found in this category.</p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
