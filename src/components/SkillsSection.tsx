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
    Workflow,
    Eye,
    Layers,
    Lock,
    Server,
    Terminal,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

// Icon and color mapping for each category
const categoryConfig: Record<string, { icon: any; colors: { from: string; via: string; to: string } }> = {
    "Cloud & Infrastructure": {
        icon: Cloud,
        colors: { from: "#0ea5e9", via: "#3b82f6", to: "#6366f1" } // sky-blue-indigo
    },
    "Infrastructure as Code": {
        icon: FileCode,
        colors: { from: "#a855f7", via: "#d946ef", to: "#ec4899" } // purple-fuchsia-pink
    },
    "CI/CD & Automation": {
        icon: Workflow,
        colors: { from: "#22c55e", via: "#10b981", to: "#14b8a6" } // green-emerald-teal
    },
    "Observability & Monitoring": {
        icon: Eye,
        colors: { from: "#f59e0b", via: "#f97316", to: "#ef4444" } // amber-orange-red
    },
    "Data Engineering": {
        icon: Layers,
        colors: { from: "#8b5cf6", via: "#a855f7", to: "#6366f1" } // violet-purple-indigo
    },
    "Databases": {
        icon: Database,
        colors: { from: "#06b6d4", via: "#3b82f6", to: "#0ea5e9" } // cyan-blue-sky
    },
    "Programming & Scripting": {
        icon: Terminal,
        colors: { from: "#84cc16", via: "#22c55e", to: "#10b981" } // lime-green-emerald
    },
    "Security & DevSecOps": {
        icon: Lock,
        colors: { from: "#f43f5e", via: "#ef4444", to: "#f97316" } // rose-red-orange
    },
};

type Category = {
    name: string;
    skills: Array<{
        name: string;
        level: number;
        description: string;
    }>;
};

export default function SkillsSection() {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCategoryClick = (category: Category) => {
        setSelectedCategory(category);
        setIsDialogOpen(true);
    };

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
                    const config = categoryConfig[category.name] || { icon: Code, colors: { from: "primary", via: "primary", to: "primary" } };
                    const Icon = config.icon;
                    const { from, via, to } = config.colors;

                    return (
                        <motion.button
                            key={category.name}
                            onClick={() => handleCategoryClick(category)}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{
                                duration: 0.3,
                                delay: index * 0.04,
                                type: "spring",
                                stiffness: 300,
                                damping: 20
                            }}
                            whileHover={{
                                scale: 1.05,
                                transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15
                                }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 ease-out hover:shadow-2xl"
                            style={{
                                ['--skill-from' as any]: from,
                                ['--skill-via' as any]: via,
                                ['--skill-to' as any]: to
                            }}
                        >
                            {/* Animated gradient background on hover - ONLY ON HOVER */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-all duration-300 group-hover:from-primary/15 group-hover:via-purple-500/15 group-hover:to-blue-500/15 group-hover:opacity-100" />

                            {/* Extra vibrant glow layer - ONLY ON HOVER */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-transparent to-transparent opacity-0 blur-xl transition-all duration-300 group-hover:from-primary/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 group-hover:opacity-100" />

                            {/* Icon */}
                            <div className="mb-3 flex justify-center">
                                <div className="rounded-lg bg-primary/10 p-3 transition-all duration-300 ease-out group-hover:bg-gradient-to-br group-hover:from-primary/30 group-hover:via-purple-500/30 group-hover:to-blue-500/30 group-hover:shadow-lg group-hover:shadow-primary/30">
                                    <Icon className="size-8 text-primary/70 transition-all duration-300 ease-out group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                </div>
                            </div>

                            {/* Category Name */}
                            <h3 className="text-center text-sm font-semibold text-foreground transition-all duration-300 ease-out group-hover:text-primary group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]">
                                {category.name}
                            </h3>

                            {/* Skill Count */}
                            <p className="mt-1 text-center text-xs text-muted-foreground transition-all duration-300 group-hover:text-primary/80">
                                {category.skills.length} skills
                            </p>
                        </motion.button>
                    );
                })}
            </div>

            {/* Skills Dialog Modal */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-h-[70vh] max-w-md overflow-y-auto">
                    {selectedCategory && (
                        <>
                            <DialogHeader>
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const config = categoryConfig[selectedCategory.name] || { icon: Code, colors: { from: "primary", via: "primary", to: "primary" } };
                                        const Icon = config.icon;
                                        return (
                                            <div className="rounded-lg bg-primary/10 p-2">
                                                <Icon className="size-5 text-primary" />
                                            </div>
                                        );
                                    })()}
                                    <DialogTitle className="text-lg">{selectedCategory.name}</DialogTitle>
                                </div>
                                <DialogDescription className="text-xs">
                                    {selectedCategory.skills.length} skills in this category
                                </DialogDescription>
                            </DialogHeader>

                            <div className="mt-3 grid gap-3">
                                {selectedCategory.skills.map((skill, idx) => (
                                    <motion.div
                                        key={skill.name}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.25,
                                            delay: idx * 0.03,
                                            type: "spring",
                                            stiffness: 300,
                                            damping: 25
                                        }}
                                        className="rounded-lg border border-border bg-card p-3 transition-all duration-200 hover:border-primary/40 hover:shadow-md hover:shadow-primary/10"
                                    >
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="text-sm font-medium">{skill.name}</span>
                                            <span className="text-xs text-muted-foreground">{skill.level}%</span>
                                        </div>
                                        <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${skill.level}%` }}
                                                transition={{
                                                    duration: 0.8,
                                                    delay: idx * 0.03,
                                                    type: "spring",
                                                    stiffness: 100,
                                                    damping: 15
                                                }}
                                                className="h-full rounded-full bg-gradient-to-r from-primary via-purple-500 to-blue-500"
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground">{skill.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
}
