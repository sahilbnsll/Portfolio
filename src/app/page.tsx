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
import CharacterReveal from "@/components/CharacterReveal";
import AnimatedNumber from "@/components/AnimatedNumber";
import { Button } from "@/components/ui/Button";
import {
  ArrowDown,
  ArrowDownRight,
  FileDown,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

import homeContent from "@/data/home.json";
import { useEffect, useState } from "react";

const SAHIL_BIRTH_DATE = new Date(2002, 7, 24); // August 24, 2002

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const sectionAnim = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" as const },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

export default function Home() {
  const [currentAge, setCurrentAge] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date();
    let age = today.getFullYear() - SAHIL_BIRTH_DATE.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > SAHIL_BIRTH_DATE.getMonth() ||
      (today.getMonth() === SAHIL_BIRTH_DATE.getMonth() &&
        today.getDate() >= SAHIL_BIRTH_DATE.getDate());

    if (!hasHadBirthdayThisYear) {
      age--;
    }

    setCurrentAge(age);
  }, []);

  return (
    <article className="mt-8 flex flex-col gap-20 pb-16">
      {/* Hero Section */}
      <motion.section
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        className="flex flex-col items-start gap-8 md:flex-row-reverse md:items-center md:justify-between"
      >
        <motion.div variants={fadeInUp}>
          <SwipeCards className="md:mr-8" />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="flex max-w-[320px] flex-col sm:max-w-full"
        >
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

          <p className="mt-4 max-w-sm text-balance text-sm leading-relaxed text-muted-foreground sm:text-base">
            {homeContent.introduction.description}
          </p>

          <div className="mt-6 flex items-center gap-1">
            <p className="text-balance text-sm font-semibold sm:text-base">
              {homeContent.introduction.chatPrompt}
            </p>
            <ArrowDownRight className="hidden size-5 animate-bounce sm:block" />
            <ArrowDown className="block size-5 animate-bounce sm:hidden" />
          </div>

          <p className="mt-1 text-xs text-muted-foreground">
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
        </motion.div>
      </motion.section>

      {/* About Me */}
      <motion.div {...sectionAnim}>
        <AboutMe />
      </motion.div>

      {/* Stats */}
      <StatsOverview />

      {/* Experience */}
      <motion.div {...sectionAnim}>
        <Experience />
      </motion.div>

      {/* Skills */}
      <motion.div {...sectionAnim}>
        <SkillsSection />
      </motion.div>

      {/* Skill Dependencies Graph */}
      <motion.div {...sectionAnim}>
        <SkillDependenciesGraph />
      </motion.div>

      {/* Certifications */}
      <motion.div {...sectionAnim}>
        <CertificationsSection />
      </motion.div>

      {/* Testimonials */}
      <motion.div {...sectionAnim}>
        <TestimonialsSection />
      </motion.div>
    </article>
  );
}
