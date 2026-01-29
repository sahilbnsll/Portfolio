"use client";

import { Experience } from "@/lib/schemas";
import TimelineItem from "./TimelineItem";
import { Card, CardContent } from "./ui/Card";
import { motion } from "framer-motion";

interface Props {
  experience: Experience[];
  type?: "work" | "education";
}

export default function Timeline({ experience, type = "work" }: Props) {
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

  const lineVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="relative">
          {/* Animated vertical line */}
          <motion.div
            className="absolute left-5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-accent to-transparent"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          />
          <motion.ul
            className="ml-10 border-l border-transparent"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {experience.map((exp, id) => (
              <li key={id}>
                <motion.div variants={itemVariants}>
                  <TimelineItem experience={exp} type={type} />
                </motion.div>
              </li>
            ))}
          </motion.ul>
        </div>
      </CardContent>
    </Card>
  );
}
