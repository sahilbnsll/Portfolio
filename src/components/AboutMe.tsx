"use client";

import { motion } from "framer-motion";
import { Zap, Target, TrendingUp } from "lucide-react";

export default function AboutMe() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const iconVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
    hover: { scale: 1.1, rotate: 5 }
  };

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="flex flex-col gap-8 rounded-lg bg-gradient-to-br from-card/80 to-card/40 p-8 backdrop-blur-sm border border-border/50 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl"
          animate={{ y: [0, 30, 0], x: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Header */}
      <div className="relative z-10 flex flex-col gap-3">
        <h2 className="title text-2xl sm:text-3xl">why devops?</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          My journey, philosophy, and what drives me
        </p>
      </div>

      {/* Content Cards */}
      <div className="relative z-10 flex flex-col gap-8 text-sm sm:text-base leading-relaxed text-foreground/90">
        <motion.div 
          className="flex gap-4 p-4 rounded-lg border border-border/30 bg-background/50 hover:border-accent/50 transition-all duration-300"
          whileHover={{ translateX: 8 }}
        >
          <motion.div variants={iconVariants} className="flex-shrink-0">
            <Zap className="size-6 text-accent" />
          </motion.div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-semibold text-foreground">My Journey</h3>
            <p>
              I fell in love with DevOps when I realized deployments were the invisible bottleneck. Teams shipped code, but getting it to production safely and reliably? That&apos;s where the real problem lived. I became obsessed with removing that friction building systems where infrastructure gets out of the way so engineers can focus on shipping.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex gap-4 p-4 rounded-lg border border-border/30 bg-background/50 hover:border-accent/50 transition-all duration-300"
          whileHover={{ translateX: 8 }}
        >
          <motion.div variants={iconVariants} className="flex-shrink-0">
            <Target className="size-6 text-primary" />
          </motion.div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-semibold text-foreground">My Philosophy</h3>
            <p>
              I believe infrastructure should be boring. Not in a boring-as-in-uninteresting way, but in a boring-as-in-it-just-works way. No surprises at 3am. No manual firefighting. I design systems with reliability and automation at the core, where scaling happens invisibly and observability tells the story of what&apos;s happening before it becomes a problem.
            </p>
          </div>
        </motion.div>

        <motion.div 
          className="flex gap-4 p-4 rounded-lg border border-border/30 bg-background/50 hover:border-accent/50 transition-all duration-300"
          whileHover={{ translateX: 8 }}
        >
          <motion.div variants={iconVariants} className="flex-shrink-0">
            <TrendingUp className="size-6 text-green-500" />
          </motion.div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-semibold text-foreground">What I Value</h3>
            <p>
              I&apos;m passionate about infrastructure that&apos;s reproducible, observable, and cost-conscious. I love solving problems that have scale (500+ users, millions of requests). I value teams that care about operational excellence and aren&apos;t afraid to question &quot;the way we&apos;ve always done it.&quot; Give me a problem where reliability matters, and I&apos;ll obsess over getting it right.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
