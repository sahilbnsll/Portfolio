"use client";

import { motion } from "framer-motion";

export default function AboutMe() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <motion.section
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-100px" }}
      variants={fadeInUp}
      className="flex flex-col gap-6 rounded-lg bg-card/50 p-8 backdrop-blur-sm border border-border/50"
    >
      <div className="flex flex-col gap-3">
        <h2 className="title text-2xl sm:text-3xl">why devops?</h2>
        <p className="text-sm text-muted-foreground sm:text-base">
          My journey and philosophy
        </p>
      </div>

      <div className="flex flex-col gap-6 text-sm sm:text-base leading-relaxed text-foreground/90">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground">My Journey</h3>
          <p>
            I fell in love with DevOps when I realized deployments were the invisible bottleneck. Teams shipped code, but getting it to production safely and reliably? That&apos;s where the real problem lived. I became obsessed with removing that friction—building systems where infrastructure gets out of the way so engineers can focus on shipping.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground">My Philosophy</h3>
          <p>
            I believe infrastructure should be boring. Not in a boring-as-in-uninteresting way, but in a boring-as-in-it-just-works way. No surprises at 3am. No manual firefighting. I design systems with reliability and automation at the core, where scaling happens invisibly and observability tells the story of what&apos;s happening before it becomes a problem.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground">What I Value</h3>
          <p>
            I&apos;m passionate about infrastructure that&apos;s reproducible, observable, and cost-conscious. I love solving problems that have scale (500+ users, millions of requests). I value teams that care about operational excellence and aren&apos;t afraid to question &quot;the way we&apos;ve always done it.&quot; Give me a problem where reliability matters, and I&apos;ll obsess over getting it right.
          </p>
        </div>
      </div>
    </motion.section>
  );
}
