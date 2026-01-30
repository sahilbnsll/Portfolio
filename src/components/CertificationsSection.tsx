"use client";

import { motion } from "framer-motion";
import { ExternalLink, Cloud, Zap, GitBranch } from "lucide-react";
import certificationsData from "@/data/certifications.json";
import SectionHeader from "./SectionHeader";

// Unique configuration for each certification
const certConfig: Record<string, { icon: any; colors: { from: string; via: string; to: string } }> = {
    "DevOps on AWS Specialization": {
        icon: Cloud,
        colors: { from: "#f97316", via: "#f59e0b", to: "#eab308" } // orange-amber-yellow
    },
    "Postman API Fundamentals Student Expert": {
        icon: Zap,
        colors: { from: "#ea580c", via: "#ef4444", to: "#f43f5e" } // orange-red-rose
    },
    "Agile with Atlassian Jira": {
        icon: GitBranch,
        colors: { from: "#3b82f6", via: "#6366f1", to: "#8b5cf6" } // blue-indigo-violet
    },
};

export default function CertificationsSection() {
    return (
        <section className="flex flex-col gap-6">
            <SectionHeader title="Certifications" description="Professional certifications and credentials" />

            <div className="grid gap-4 sm:grid-cols-2">
                {certificationsData.certifications.map((cert, index) => {
                    const config = certConfig[cert.name] || { icon: Cloud, colors: { from: "primary", via: "primary", to: "primary" } };
                    const Icon = config.icon;
                    const { from, via, to } = config.colors;

                    return (
                        <motion.a
                            key={cert.credentialId}
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.4,
                                delay: index * 0.1,
                                type: "spring",
                                stiffness: 300,
                                damping: 25
                            }}
                            whileHover={{
                                scale: 1.03,
                                transition: {
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15
                                }
                            }}
                            whileTap={{ scale: 0.97 }}
                            className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 ease-out hover:shadow-2xl"
                        >
                            {/* Vibrant gradient background on hover - ONLY ON HOVER */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-teal-500/0 via-cyan-500/0 to-sky-500/0 opacity-0 transition-all duration-300 group-hover:from-teal-500/15 group-hover:via-cyan-500/15 group-hover:to-sky-500/15 group-hover:opacity-100" />

                            {/* Extra glow layer for depth - ONLY ON HOVER */}
                            <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-transparent via-transparent to-transparent opacity-0 blur-xl transition-all duration-300 group-hover:from-teal-500/20 group-hover:via-cyan-500/20 group-hover:to-sky-500/20 group-hover:opacity-100" />

                            <div className="flex items-start gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 transition-all duration-300 ease-out group-hover:bg-gradient-to-br group-hover:from-teal-500/30 group-hover:via-cyan-500/30 group-hover:to-sky-500/30 group-hover:shadow-lg group-hover:shadow-cyan-500/30">
                                    <Icon className="size-6 text-cyan-500/70 transition-all duration-300 ease-out group-hover:scale-125 group-hover:text-cyan-400 group-hover:rotate-12 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className="text-sm font-semibold leading-tight transition-all duration-300 ease-out group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]">
                                        {cert.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-cyan-400/80">
                                        {cert.organization}
                                    </p>
                                    <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground/60">
                                        {cert.issueDate}
                                    </p>
                                </div>

                                <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_6px_rgba(34,211,238,0.5)]" />
                            </div>

                            <div className="mt-3 rounded bg-muted/50 px-2 py-1 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-teal-500/10 group-hover:via-cyan-500/10 group-hover:to-sky-500/10">
                                <p className="text-xs font-mono text-muted-foreground transition-all duration-300 group-hover:text-foreground/70">
                                    ID: {cert.credentialId}
                                </p>
                            </div>
                        </motion.a>
                    );
                })}
            </div>
        </section>
    );
}
