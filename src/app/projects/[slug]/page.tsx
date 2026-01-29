"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft, Shield, Zap, Users, DollarSign, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import caseStudies from "@/data/case-studies.json";
import { notFound } from "next/navigation";

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

const iconMap: Record<string, React.ComponentType<any>> = {
  shield: Shield,
  zap: Zap,
  users: Users,
  "dollar-sign": DollarSign,
  "check-circle": CheckCircle2,
};

export default function CaseStudyPage({ params }: CaseStudyPageProps) {
  const caseStudy = caseStudies.case_studies.find(
    (cs) => cs.slug === params.slug
  );

  if (!caseStudy) {
    notFound();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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
    <article className="mt-8 flex flex-col gap-16 pb-16">
      {/* Back Button */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
      </motion.div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="secondary">{caseStudy.project_category}</Badge>
            <Badge variant="outline">{caseStudy.status}</Badge>
          </div>
          <h1 className="title text-4xl sm:text-5xl">{caseStudy.title}</h1>
          <p className="text-lg text-muted-foreground">{caseStudy.subtitle}</p>
        </motion.div>

        {caseStudy.featured_image && (
          <motion.div variants={itemVariants} className="relative h-96 w-full overflow-hidden rounded-lg">
            <Image
              src={caseStudy.featured_image}
              alt={caseStudy.title}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        )}

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Timeline", value: caseStudy.timeline },
            { label: "Status", value: caseStudy.status },
            { label: "Team Size", value: caseStudy.team_size },
            { label: "Category", value: caseStudy.project_category },
          ].map((stat, idx) => (
            <div key={idx} className="rounded-lg bg-card/50 p-4 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                {stat.label}
              </p>
              <p className="font-semibold">{stat.value}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Problem Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <h2 className="title text-2xl sm:text-3xl mb-4">{caseStudy.problem.title}</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            {caseStudy.problem.description}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-lg">Pain Points</h3>
          <ul className="space-y-2">
            {caseStudy.problem.pain_points.map((point, idx) => (
              <li key={idx} className="flex gap-3">
                <span className="text-accent font-bold">•</span>
                <span className="text-sm">{point}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {caseStudy.problem.business_impact && (
          <motion.div
            variants={itemVariants}
            className="rounded-lg bg-orange-500/10 border border-orange-500/20 p-4"
          >
            <p className="text-sm font-semibold text-orange-500">
              💼 Business Impact
            </p>
            <p className="text-sm text-foreground mt-2">
              {caseStudy.problem.business_impact}
            </p>
          </motion.div>
        )}
      </motion.section>

      {/* Solution Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>
          <h2 className="title text-2xl sm:text-3xl mb-4">{caseStudy.solution.title}</h2>
          <p className="text-base sm:text-lg text-muted-foreground mb-6">
            {caseStudy.solution.description}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-lg">Approach</h3>
          <div className="space-y-3">
            {caseStudy.solution.approach.map((item, idx) => (
              <div key={idx} className="rounded-lg border border-border/50 bg-card/30 p-4">
                <h4 className="font-semibold text-accent mb-2">{item.name}</h4>
                <p className="text-sm text-muted-foreground">{item.details}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-lg">Tech Stack</h3>
          <div className="flex flex-wrap gap-2">
            {caseStudy.solution.tech_stack.map((tech, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* Results Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.h2 variants={itemVariants} className="title text-2xl sm:text-3xl">
          {caseStudy.results.title}
        </motion.h2>

        {/* Key Metrics */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {caseStudy.results.metrics.map((metric, idx) => {
            const Icon = iconMap[metric.icon] || Zap;
            return (
              <div key={idx} className="rounded-lg border border-border/50 bg-card/50 p-4">
                <Icon className="size-5 mb-2 text-accent" />
                <p className="text-2xl sm:text-3xl font-bold mb-1">
                  {metric.value}
                </p>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  {metric.label}
                </p>
                <p className="text-xs text-muted-foreground">{metric.description}</p>
              </div>
            );
          })}
        </motion.div>

        {/* Qualitative Impact */}
        <motion.div variants={itemVariants} className="space-y-3">
          <h3 className="font-semibold text-lg">Qualitative Impact</h3>
          <ul className="space-y-2">
            {caseStudy.results.qualitative_impact.map((impact, idx) => (
              <li key={idx} className="flex gap-3">
                <CheckCircle2 className="size-5 text-accent flex-shrink-0 mt-0.5" />
                <span className="text-sm">{impact}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </motion.section>

      {/* Lessons Learned Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.h2 variants={itemVariants} className="title text-2xl sm:text-3xl">
          Lessons Learned
        </motion.h2>

        <motion.div variants={itemVariants} className="space-y-4">
          {caseStudy.lessons_learned.map((lesson, idx) => (
            <div key={idx} className="rounded-lg border border-accent/20 bg-accent/5 p-4">
              <h3 className="font-semibold mb-2">{lesson.title}</h3>
              <p className="text-sm text-muted-foreground">{lesson.insight}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* Tech Deep Dive */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-6"
      >
        <motion.h2 variants={itemVariants} className="title text-2xl sm:text-3xl">
          Technologies Deep Dive
        </motion.h2>

        <motion.div variants={itemVariants} className="space-y-4">
          {caseStudy.technologies_deep_dive.map((tech, idx) => (
            <div key={idx} className="rounded-lg border border-border/50 bg-card/30 p-4">
              <h3 className="font-semibold text-accent mb-2">{tech.name}</h3>
              <p className="text-sm text-muted-foreground">{tech.why}</p>
            </div>
          ))}
        </motion.div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="flex flex-col gap-4 rounded-lg bg-card/50 border border-border/50 p-8 text-center"
      >
        <motion.div variants={itemVariants}>
          <h3 className="font-semibold text-lg mb-2">Want to discuss this work?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            I love diving deep into architecture decisions and technical trade-offs.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2 bg-accent text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            Let&apos;s Talk
          </Link>
        </motion.div>
      </motion.section>
    </article>
  );
}
