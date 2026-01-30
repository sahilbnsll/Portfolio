"use client";

import { Experience } from "@/lib/schemas";
import TimelineItem from "./TimelineItem";
import { Card, CardContent } from "./ui/Card";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

interface Props {
  experience: Experience[];
  type?: "work" | "education";
}

export default function Timeline({ experience, type = "work" }: Props) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Card>
      <CardContent className="p-0">
        <motion.ul
          className="relative ml-10 border-l"
          variants={prefersReducedMotion ? undefined : containerVariants}
          initial={prefersReducedMotion ? "" : "hidden"}
          whileInView={prefersReducedMotion ? "" : "visible"}
          viewport={{ once: true, amount: 0.1 }}
        >
          {experience.map((exp, id) => (
            <li key={id}>
              <motion.div variants={prefersReducedMotion ? undefined : itemVariants}>
                <TimelineItem experience={exp} type={type} />
              </motion.div>
            </li>
          ))}
        </motion.ul>
      </CardContent>
    </Card>
  );
}
