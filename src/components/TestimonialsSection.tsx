"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import testimonialsData from "@/data/testimonials.json";

export default function TestimonialsSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="title text-2xl sm:text-3xl">what others say</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          Feedback from colleagues and leaders I&apos;ve worked with
        </p>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {testimonialsData.testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex flex-col gap-4 rounded-lg border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-border hover:shadow-lg"
          >
            {/* Stars */}
            <div className="flex gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>

            {/* Quote */}
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              &quot;{testimonial.quote}&quot;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/60">
                <span className="text-xs font-bold text-primary-foreground">
                  {testimonial.avatar}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {testimonial.title}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
