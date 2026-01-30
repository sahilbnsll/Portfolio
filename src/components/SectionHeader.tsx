"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface SectionHeaderProps {
  title: string;
  description: string;
}

export default function SectionHeader({ title, description }: SectionHeaderProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="title text-2xl sm:text-3xl">{title}</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-2"
    >
      <h2 className="title text-2xl sm:text-3xl">{title}</h2>
      <p className="text-sm text-muted-foreground sm:text-base">
        {description}
      </p>
    </motion.div>
  );
}
