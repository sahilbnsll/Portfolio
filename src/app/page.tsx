"use client";

import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Socials from "@/components/Socials";
import SwipeCards from "@/components/SwipeCards";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
import AvailableForWorkBadge from "@/components/AvailableForWorkBadge";
import AboutMe from "@/components/AboutMe";
import StatsOverview from "@/components/StatsOverview";
import TestimonialsSection from "@/components/TestimonialsSection";
import SkillDependenciesGraph from "@/components/SkillDependenciesGraph";
import ArchitectureVisualization from "@/components/ArchitectureVisualization";
import CharacterReveal from "@/components/CharacterReveal";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRightIcon,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import homeContent from "@/data/home.json";

const SAHIL_BIRTH_DATE = new Date(2002, 7, 24); // August 24, 2002
const LIMIT = 2; // max show 2

export default function Home() {
  const today = new Date();
  let currentAge = today.getFullYear() - SAHIL_BIRTH_DATE.getFullYear();

  // Adjust age if birthday hasn't occurred yet this year
  const hasHadBirthdayThisYear =
    today.getMonth() > SAHIL_BIRTH_DATE.getMonth() ||
    (today.getMonth() === SAHIL_BIRTH_DATE.getMonth() &&
      today.getDate() >= SAHIL_BIRTH_DATE.getDate());

  if (!hasHadBirthdayThisYear) {
    currentAge--;
  }

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <article className="mt-8 flex flex-col gap-16 pb-16">
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between"
      >
        <motion.div variants={fadeInUp}>
          <SwipeCards className="md:mr-8" />
        </motion.div>

        <motion.div variants={fadeInUp} className="flex max-w-[320px] flex-col sm:max-w-full">
          <div className="relative">
            {/* Background highlight effect */}
            <motion.div
              className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-r from-primary/0 via-accent/20 to-primary/0 blur-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            />
            <h1 className="title text-balance text-4xl sm:text-5xl">
              <CharacterReveal 
                text="infrastructure that scales automatically." 
                delay={0.1}
              />
              <motion.span
                className="inline-block origin-[70%_70%] cursor-pointer ml-2"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1],
                  delay: 0.5
                }}
                whileHover={{
                  rotate: [0, 14, -8, 14, -4, 10, 0],
                  transition: {
                    duration: 2,
                    ease: "easeInOut",
                    times: [0, 0.15, 0.3, 0.45, 0.6, 0.75, 1]
                  }
                }}
              >
                ✨
              </motion.span>
            </h1>
          </div>

          <p className="mt-2 whitespace-nowrap text-sm font-medium sm:text-base">
            <AnimatedNumber target={currentAge} />yo DevOps engineer from India 🇮🇳
          </p>

          {/* Available for work badge */}
          <div className="mt-3 flex items-center gap-2">
            <AvailableForWorkBadge />
          </div>

          <p className="mt-4 max-w-sm text-balance text-sm sm:text-base">
            {homeContent.introduction.description}
          </p>

          <div className="mt-6 flex items-center gap-1">
            <p className="text-balance text-sm font-semibold sm:text-base">
              {homeContent.introduction.chatPrompt}
            </p>
            <ArrowDownRight className="hidden size-5 animate-bounce sm:block" />
            <ArrowDown className="block size-5 animate-bounce sm:hidden" />
          </div>

          <p className="mt-1 text-xs font-light">
            {homeContent.introduction.escalation.text}&nbsp;
            <Link
              href={homeContent.escalationLink.href}
              target="_blank"
              className="link font-semibold underline"
              title={homeContent.escalationLink.title}
            >
              {homeContent.introduction.escalation.linkText}
            </Link>
            &nbsp;
            {homeContent.introduction.escalation.suffix}
          </p>

          <section className="mt-6 flex flex-wrap items-center gap-4">
            <a href="/Sahil_Bansal_Resume.pdf" download="Sahil_Bansal_Resume.pdf">
              <Button className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-primary/30">
                {/* Neon glow background on hover */}
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/0 via-purple-500/0 to-blue-500/0 opacity-0 transition-all duration-300 group-hover:from-primary/20 group-hover:via-purple-500/20 group-hover:to-blue-500/20 group-hover:opacity-100" />
                <FileDown className="mr-2 size-4 transition-all duration-300 group-hover:scale-110" />
                <span className="font-semibold">Download Resume</span>
              </Button>
            </a>
            <Socials />
          </section>
        </motion.div>
      </motion.section>

      <AboutMe />

      <StatsOverview />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <Experience />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <SkillsSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <SkillDependenciesGraph />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <ArchitectureVisualization />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <CertificationsSection />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <TestimonialsSection />
      </motion.div>
    </article>
  );
}
