"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { MotionButton } from "@/components/ui/MotionButton";
import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import ImageWithSkeleton from "./ImageWithSkeleton";

interface FeaturedProjectProps {
  name: string;
  description: string;
  image?: string;
  tags?: string[];
  href?: string;
}

export default function FeaturedProject({
  name,
  description,
  image,
  tags = [],
  href,
}: FeaturedProjectProps) {
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
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="mb-16 overflow-hidden rounded-lg border border-border bg-card"
    >
      <div className="grid grid-cols-1 gap-0 md:grid-cols-2">
        {/* Image */}
        {image && (
          <motion.div
            variants={itemVariants}
            className="relative h-64 md:h-80 overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10" />
            <ImageWithSkeleton
              src={image}
              alt={name}
              width={500}
              height={400}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              quality={80}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col justify-between gap-6 p-6 md:p-8"
        >
          <div>
            <motion.span
              variants={itemVariants}
              className="inline-block mb-2 px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
            >
              Featured Project
            </motion.span>

            <motion.h3
              variants={itemVariants}
              className="text-3xl font-bold mb-3 text-balance"
            >
              {name}
            </motion.h3>

            <motion.p
              variants={itemVariants}
              className="text-muted-foreground text-sm md:text-base leading-relaxed"
            >
              {description}
            </motion.p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
              {tags.slice(0, 5).map((tag) => (
                <Badge
                  key={tag}
                  className="px-2 py-1 text-xs"
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
              {tags.length > 5 && (
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  +{tags.length - 5}
                </Badge>
              )}
            </motion.div>
          )}

          {/* CTA */}
          <motion.div variants={itemVariants}>
            <Link href={href || "#"}>
              <MotionButton size="lg" className="gap-2">
                Explore Project
                <ArrowDownRight className="w-4 h-4" />
              </MotionButton>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
