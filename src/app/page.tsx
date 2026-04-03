"use client";

import Experience from "@/components/Experience";
import AboutMe from "@/components/AboutMe";
import Socials from "@/components/Socials";
import SwipeCards from "@/components/SwipeCards";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import AvailableForWorkBadge from "@/components/AvailableForWorkBadge";
import TestimonialsSection from "@/components/TestimonialsSection";
import SkillDependenciesGraph from "@/components/SkillDependenciesGraph";
import CharacterReveal from "@/components/CharacterReveal";
import AnimatedNumber from "@/components/AnimatedNumber";
import InteractiveTerminal from "@/components/InteractiveTerminal";
import Projects from "@/components/Projects";
import StatsOverview from "@/components/StatsOverview";
import CoreSkillsExpertiseSection from "@/components/CoreSkillsExpertiseSection";
import { Button } from "@/components/ui/Button";
import { FileDown } from "lucide-react";
import { motion } from "framer-motion";

import homeContent from "@/data/home.json";
import blogData from "@/data/blog.json";
import { useEffect, useState } from "react";
import { isExternalBlogPost } from "@/lib/blog-utils";

const SAHIL_BIRTH_DATE = new Date(2002, 7, 24);

const sectionAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

type BlogPost = {
  title: string;
  description?: string;
  date: string;
  comingSoon?: boolean;
  href?: string;
  external?: boolean;
};
const blogPosts = (blogData.posts ?? []) as BlogPost[];

export default function Home() {
  const [currentAge, setCurrentAge] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    let age = today.getFullYear() - SAHIL_BIRTH_DATE.getFullYear();
    const hasHadBirthdayThisYear =
      today.getMonth() > SAHIL_BIRTH_DATE.getMonth() ||
      (today.getMonth() === SAHIL_BIRTH_DATE.getMonth() &&
        today.getDate() >= SAHIL_BIRTH_DATE.getDate());
    if (!hasHadBirthdayThisYear) age--;
    setCurrentAge(age);
  }, []);

  return (
    <article className="mt-8 flex flex-col gap-20 pb-16">
      {/* ── Hero ── */}
      <section
        id="top"
        className="relative flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between"
      >
        <div className="animate-fade-in-up relative z-10">
          <SwipeCards className="md:mr-8" />
        </div>

        <div className="animate-fade-in-up-d1 relative z-10 flex max-w-[320px] flex-col opacity-0 sm:max-w-full">
          <h1 className="title text-balance text-4xl sm:text-5xl">
            <CharacterReveal text="hi, sahil here. " delay={0.1} />
            <motion.span
              className="ml-2 inline-block origin-[70%_70%] cursor-pointer"
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
              transition={{
                duration: 2,
                ease: "easeInOut",
                times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
                delay: 0.5,
              }}
              whileHover={{
                rotate: [0, 14, -8, 14, -4, 10, 0],
                transition: {
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1],
                },
              }}
            >
              👋
            </motion.span>
          </h1>

          <p className="mt-2 whitespace-nowrap text-sm font-medium text-muted-foreground sm:text-base">
            {currentAge !== null && <AnimatedNumber target={currentAge} />}
            yo DevOps engineer from India 🇮🇳
          </p>

          <div className="mt-3 flex items-center gap-2">
            <AvailableForWorkBadge />
          </div>

          <p className="mt-4 max-w-xl text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            {homeContent.introduction.description}
          </p>

          <div className="mt-3 max-w-xl">
            <p className="text-base font-bold leading-snug text-foreground sm:text-lg">
              Questions about DevOps, reliability,
              <br />
              or cloud infrastructure? Ask the chat.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              For anything else, let&apos;s{" "}
              <a
                href={homeContent.escalationLink.href}
                className="underline underline-offset-4 hover:text-primary"
                title={homeContent.escalationLink.title}
              >
                connect directly
              </a>
              .
            </p>
          </div>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href="/Sahil_Bansal_Resume.pdf"
              download="Sahil_Bansal_Resume.pdf"
            >
              <Button className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
                <FileDown className="mr-2 size-4 transition-transform duration-300 group-hover:scale-110" />
                <span className="font-semibold">Download Resume</span>
              </Button>
            </a>
            <Socials />
          </section>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <motion.div {...sectionAnim} className="scroll-mt-28">
        <SkillsSection />
      </motion.div>

      {/* ── Command Playground ── */}
      <section id="lab" className="scroll-mt-28">
        <div className="relative rounded-2xl border border-border/40 bg-card/30 p-4 pb-5 backdrop-blur-sm sm:p-6">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="min-w-0 flex-1">
              <InteractiveTerminal className="min-h-[260px] sm:min-h-[320px]" />
            </div>
            {/* No extra helper text (keeps terminal looking clean/pro). */}
          </div>
        </div>
      </section>

      {/* ── DevOps impact stats & Tech Stack ── */}
      <motion.section {...sectionAnim} className="scroll-mt-28 space-y-8">
        <AboutMe />
        <StatsOverview />
        <CoreSkillsExpertiseSection />
      </motion.section>

      {/* ── Featured Projects ── */}
      <motion.section
        {...sectionAnim}
        id="projects-preview"
        className="scroll-mt-28"
      >
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="title text-2xl sm:text-3xl">featured projects</h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
              A quick snapshot of the kind of infra and automation work I ship.
            </p>
          </div>
          <Projects limit={2} showFilters={false} compact />
          <a
            href="/projects"
            className="inline-flex w-fit text-sm font-semibold text-primary hover:underline"
          >
            More projects →
          </a>
        </div>
      </motion.section>

      {/* ── Experience ── */}
      <motion.div {...sectionAnim}>
        <Experience />
      </motion.div>

      {/* ── Skill Dependencies Graph ── */}
      <motion.div {...sectionAnim}>
        <SkillDependenciesGraph />
      </motion.div>

      {/* ── Certifications ── */}
      <motion.div {...sectionAnim}>
        <CertificationsSection />
      </motion.div>

      {/* ── Testimonials ── */}
      <motion.div {...sectionAnim}>
        <TestimonialsSection />
      </motion.div>

      {/* ── Recent Posts (minimal) ── */}
      {blogPosts.length > 0 && (
        <motion.section {...sectionAnim} className="scroll-mt-28">
          <h2 className="title text-2xl sm:text-3xl">recent posts</h2>
          <ul className="mt-4 flex flex-col gap-0">
            {blogPosts.slice(0, 2).map((post) => (
              <li
                key={post.title}
                className="flex items-baseline justify-between gap-4 border-b border-border/30 py-3 last:border-0"
              >
                <span className="text-sm font-medium text-foreground">
                  {post.href && !post.comingSoon ? (
                    isExternalBlogPost(post) ? (
                      <a
                        href={post.href}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary hover:underline"
                      >
                        {post.title}
                      </a>
                    ) : (
                      <a
                        href={post.href}
                        className="hover:text-primary hover:underline"
                      >
                        {post.title}
                      </a>
                    )
                  ) : (
                    post.title
                  )}
                  {post.comingSoon && (
                    <span className="ml-2 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] font-normal text-muted-foreground">
                      soon
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="/blog"
            className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
          >
            All posts →
          </a>
        </motion.section>
      )}
    </article>
  );
}
