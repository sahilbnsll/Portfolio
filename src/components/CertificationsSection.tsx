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
        <section id="certifications" className="scroll-mt-28 flex flex-col gap-6">
            <SectionHeader title="Certifications" description="Professional certifications and credentials" />

            <div className="grid gap-4 sm:grid-cols-2">
                {certificationsData.certifications.map((cert, index) => {
                    const config =
                      certConfig[cert.name] || {
                        icon: Cloud,
                        colors: { from: "#8b5cf6", via: "#6366f1", to: "#22c55e" },
                      };
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
                            whileTap={{ scale: 0.99 }}
                            className="group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 p-4 transition-colors duration-300 ease-out"
                            style={
                                {
                                    ["--cert-color" as any]: from,
                                } as any
                            }
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-[color:var(--cert-color)]/25 bg-[color:var(--cert-color)]/10 transition-all duration-300 ease-out group-hover:bg-[color:var(--cert-color)]/25 group-hover:border-[color:var(--cert-color)]/60">
                                    <Icon
                                      className="size-6 transition-all duration-300 ease-out group-hover:scale-125 group-hover:drop-shadow-[0_0_14px_rgba(255,255,255,0.25)]"
                                      style={{ color: "var(--cert-color)" }}
                                    />
                                </div>

                                <div className="flex-1 space-y-1">
                                    <h3 className="text-sm font-semibold leading-tight transition-all duration-300 ease-out group-hover:text-[color:var(--cert-color)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.16)]">
                                        {cert.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-[color:var(--cert-color)]/70">
                                        {cert.organization}
                                    </p>
                                    <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground/60">
                                        {cert.issueDate}
                                    </p>
                                </div>

                                <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-foreground/80" />
                            </div>

                            <div className="mt-3 rounded bg-muted/50 px-2 py-1">
                                <p className="text-xs font-mono text-muted-foreground">
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
