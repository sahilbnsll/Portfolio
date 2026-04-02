"use client";

import Projects from "@/components/Projects";
import { motion } from "framer-motion";

export default function ProjectPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          infrastructure projects.
        </motion.h1>
        <motion.p
          className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          A selection of systems I&apos;ve architected and problems I&apos;ve
          solved. From zero-downtime migrations to cost optimizations that saved
          $40k+ annually. Here&apos;s what I&apos;ve shipped.
        </motion.p>
      </div>

      <Projects />
    </article>
  );
}
