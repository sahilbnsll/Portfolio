"use client";

import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import certificationsData from "@/data/certifications.json";

export default function CertificationsSection() {
    return (
        <section className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h2 className="title text-2xl sm:text-3xl">Certifications</h2>
                <p className="text-sm text-muted-foreground sm:text-base">
                    Professional certifications and credentials
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                {certificationsData.certifications.map((cert, index) => (
                    <motion.a
                        key={cert.credentialId}
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{
                            scale: 1.03,
                            transition: { duration: 0.3, ease: "easeOut" }
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="group relative overflow-hidden rounded-xl border border-border bg-card p-4 transition-all duration-300 ease-out hover:border-primary/60 hover:bg-primary/5 hover:shadow-xl"
                    >
                        {/* Hover glow effect */}
                        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 opacity-0 transition-all duration-300 group-hover:from-primary/10 group-hover:via-primary/20 group-hover:to-primary/10 group-hover:opacity-100" />

                        <div className="flex items-start gap-3">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-all duration-300 ease-out group-hover:bg-primary/30">
                                <Award className="size-6 text-primary/70 transition-all duration-300 ease-out group-hover:scale-110 group-hover:text-primary group-hover:rotate-12" />
                            </div>

                            <div className="flex-1 space-y-1">
                                <h3 className="text-sm font-semibold leading-tight transition-all duration-300 ease-out group-hover:text-primary">
                                    {cert.name}
                                </h3>
                                <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground/60">
                                    {cert.organization}
                                </p>
                                <p className="text-xs text-muted-foreground transition-all duration-300 group-hover:text-foreground/60">
                                    {cert.issueDate}
                                </p>
                            </div>

                            <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-all duration-300 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary" />
                        </div>

                        <div className="mt-3 rounded bg-muted/50 px-2 py-1 transition-all duration-300 group-hover:bg-primary/10">
                            <p className="text-xs font-mono text-muted-foreground transition-all duration-300 group-hover:text-foreground/70">
                                ID: {cert.credentialId}
                            </p>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    );
}
