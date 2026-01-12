"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import skillsData from "@/data/skills.json";
import {
    Cloud,
    Container,
    FileCode,
    Activity,
    Database,
    Code,
    Shield,
    Boxes,
} from "lucide-react";

// Icon mapping for each category
const categoryIcons: Record<string, any> = {
    "Cloud & Infrastructure": Cloud,
    "Infrastructure as Code": FileCode,
    "CI/CD & Automation": Boxes,
    "Observability & Monitoring": Activity,
    "Data Engineering": Database,
    "Databases": Database,
    "Programming & Scripting": Code,
    "Security & DevSecOps": Shield,
};

export default function SkillsSection() {
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="title text-2xl sm:text-3xl">Skills & Expertise</h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Technologies and tools I work with
                </p>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {skillsData.categories.map((category, index) => {
                    const Icon = categoryIcons[category.name] || Code;
                    const isSelected = selectedCategory === index;

                    return (
                        <motion.button
                            key={category.name}
                            onClick={() => setSelectedCategory(isSelected ? null : index)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{
                                scale: 1.08,
                                transition: { duration: 0.3, ease: "easeOut" }
                            }}
                            whileTap={{ scale: 0.98 }}
                            className={`group relative overflow-hidden rounded-xl border p-6 transition-all duration-300 ease-out ${isSelected
                                    ? "border-primary bg-primary/10 shadow-lg"
                                    : "border-border bg-card hover:border-primary/60 hover:bg-primary/5 hover:shadow-xl"
                                }`}
                        >
                            {/* Hover glow effect */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-all duration-300 group-hover:from-primary/10 group-hover:via-primary/20 group-hover:to-primary/10 group-hover:opacity-100" />

                            {/* Icon */}
                            <div className="mb-3 flex justify-center">
                                <div className={`rounded-lg p-3 transition-all duration-300 ease-out ${isSelected
                                        ? "bg-primary/20"
                                        : "bg-primary/10 group-hover:bg-primary/30"
                                    }`}>
                                    <Icon className={`size-8 transition-all duration-300 ease-out ${isSelected
                                            ? "text-primary scale-110"
                                            : "text-primary/70 group-hover:text-primary group-hover:scale-110 group-hover:rotate-3"
                                        }`} />
                                </div>
                            </div>

                            {/* Category Name */}
                            <h3 className={`text-center text-sm font-semibold transition-all duration-300 ease-out ${isSelected
                                    ? "text-primary"
                                    : "text-foreground group-hover:text-primary"
                                }`}>
                                {category.name}
                            </h3>

                            {/* Skill Count */}
                            <p className="mt-1 text-center text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground/60">
                                {category.skills.length} skills
                            </p>
                        </motion.button>
                    );
                })}
            </div>

            {/* Selected Category Details */}
            {selectedCategory !== null && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="rounded-lg border border-border bg-card p-4"
                >
                    <h3 className="mb-3 text-lg font-semibold">
                        {skillsData.categories[selectedCategory].name}
                    </h3>
                    <div className="grid gap-3">
                        {skillsData.categories[selectedCategory].skills.map((skill, idx) => (
                            <motion.div
                                key={skill.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: idx * 0.05 }}
                                className="flex items-center gap-3"
                            >
                                <div className="flex-1">
                                    <div className="mb-1 flex items-center justify-between">
                                        <span className="text-sm font-medium">{skill.name}</span>
                                        <span className="text-xs text-muted-foreground">{skill.level}%</span>
                                    </div>
                                    <div className="h-2 overflow-hidden rounded-full bg-muted">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.level}%` }}
                                            transition={{ duration: 1, delay: idx * 0.05, ease: "easeOut" }}
                                            className="h-full rounded-full bg-gradient-to-r from-primary to-primary/80"
                                        />
                                    </div>
                                    <p className="mt-1 text-xs text-muted-foreground">{skill.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}
        </section>
    );
}
