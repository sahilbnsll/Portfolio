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
import InteractiveResume from "@/components/InteractiveResume";
import { Button } from "@/components/ui/Button";
import {
  FileDown,
  Box,
  ShieldAlert,
  ScanSearch,
  GitPullRequestArrow,
} from "lucide-react";
import { motion } from "framer-motion";
import { useViewMode } from "@/contexts/ViewModeContext";
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

export default function HomePageClient() {
  const [currentAge, setCurrentAge] = useState<number | null>(null);
  const { isRecruiter } = useViewMode();

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

  if (isRecruiter) {
    return (
      <div className="pb-16 pt-8">
        <header className="mb-8">
          <div className="mb-2 font-mono text-[11px] tracking-widest text-emerald-500">
            $ cat ~/resume.yaml | grep -i &quot;impact&quot;
          </div>
          <h1 className="font-serif text-2xl font-bold sm:text-3xl">
            Interactive Resume
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Click a technology to highlight matching experience.
          </p>
        </header>
        <InteractiveResume />
      </div>
    );
  }

  return (
    <article className="mt-6 flex flex-col gap-12 pb-14 sm:mt-8 sm:gap-16 sm:pb-16">
      <section
        id="top"
        className="relative flex flex-col items-center gap-10 md:flex-row-reverse md:items-center md:justify-between md:gap-12"
      >
        <div className="animate-fade-in-up relative z-10 mx-auto w-full max-w-[220px] self-center sm:max-w-[240px] md:mx-0 md:w-auto md:max-w-none">
          <SwipeCards className="mx-auto md:mr-2 lg:mr-8" />
        </div>

        <div className="animate-fade-in-up-d1 relative z-10 flex w-full max-w-2xl flex-col items-center text-center opacity-0 md:max-w-[32rem] md:items-start md:text-left">
          <h1 className="title text-balance text-[2.65rem] leading-[0.94] sm:text-5xl">
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

          <p className="mt-2.5 text-sm font-medium text-muted-foreground sm:mt-3 sm:text-base">
            {currentAge !== null && <AnimatedNumber target={currentAge} />}
            yo DevOps engineer from India 🇮🇳
          </p>

          <div className="mt-3">
            <AvailableForWorkBadge />
          </div>

          <p className="mt-3.5 max-w-xl text-balance text-sm leading-7 text-muted-foreground sm:mt-4 sm:text-base sm:leading-relaxed">
            {homeContent.introduction.description}
          </p>

          <div className="mt-3 max-w-xl rounded-xl border border-border/50 bg-card/50 px-3.5 py-3 backdrop-blur-sm sm:px-4">
            <p className="text-sm font-bold leading-snug text-foreground sm:text-base">
              Questions about DevOps, reliability, or cloud infra?{" "}
              <span className="text-primary">Ask the chat.</span>
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
              For anything else,{" "}
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

          <section className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:mt-6 sm:gap-4 md:justify-start">
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

      <motion.div {...sectionAnim} className="scroll-mt-28">
        <SkillsSection />
      </motion.div>

      <section id="lab" className="scroll-mt-28">
        <div className="relative rounded-2xl border border-border/40 bg-card/30 p-3 pb-4 backdrop-blur-sm sm:p-6">
          <div className="relative z-10 flex flex-col gap-4">
            <div className="min-w-0 flex-1">
              <InteractiveTerminal className="min-h-[240px] sm:min-h-[320px]" />
            </div>
          </div>
        </div>
      </section>

      <motion.section
        {...sectionAnim}
        className="scroll-mt-28 space-y-6 sm:space-y-8"
      >
        <AboutMe />
        <StatsOverview />
        <CoreSkillsExpertiseSection />
      </motion.section>

      <motion.section
        {...sectionAnim}
        id="projects-preview"
        className="scroll-mt-28"
      >
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="title text-2xl sm:text-3xl">featured projects</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
              Infra and automation work I ship.
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

      <motion.div {...sectionAnim}>
        <Experience />
      </motion.div>

      <motion.div {...sectionAnim}>
        <SkillDependenciesGraph />
      </motion.div>

      <motion.div {...sectionAnim}>
        <CertificationsSection />
      </motion.div>

      <motion.div {...sectionAnim}>
        <TestimonialsSection />
      </motion.div>

      <motion.section {...sectionAnim} className="scroll-mt-28">
        <h2 className="title text-2xl sm:text-3xl">engineering philosophy</h2>
        <p className="mt-1.5 max-w-2xl text-sm text-muted-foreground">
          Defaults I reach for until the problem demands otherwise.
        </p>
        <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {([
            {
              title: "Stateless by Default",
              body: "Push state to databases, caches, object stores. Compute is cheap; state is a liability.",
              Icon: Box,
            },
            {
              title: "Design for Failure",
              body: "Retries, circuit breakers, graceful degradation. If it can't survive a node down at 3 AM, it's not prod-ready.",
              Icon: ShieldAlert,
            },
            {
              title: "Observability > Monitoring",
              body: "Monitoring says it's broken. Observability says why. Structured logs, traces, SLI-driven alerts.",
              Icon: ScanSearch,
            },
            {
              title: "IaC or It Didn't Happen",
              body: "Not in version control? Doesn't exist. Terraform for infra, Actions for pipelines, PRs for changes.",
              Icon: GitPullRequestArrow,
            },
          ] as const).map((p) => (
            <div
              key={p.title}
              className="flex gap-3 rounded-lg border border-border/50 bg-card/40 p-3.5"
            >
              <p.Icon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
              <div>
                <h3 className="text-[13px] font-bold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

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
