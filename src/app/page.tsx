"use client";

import Experience from "@/components/Experience";
import LinkWithIcon from "@/components/LinkWithIcon";
import Socials from "@/components/Socials";
import SwipeCards from "@/components/SwipeCards";
import SkillsSection from "@/components/SkillsSection";
import CertificationsSection from "@/components/CertificationsSection";
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
          <h1 className="title text-balance text-4xl sm:text-5xl">
            {homeContent.introduction.greeting}
          </h1>

          <p className="mt-2 whitespace-nowrap text-sm font-medium sm:text-base">
            {currentAge}yo DevOps engineer from India 🇮🇳
          </p>

          {/* Available for work badge */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1.5 text-sm font-medium text-green-600 dark:text-green-400">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-green-500"></span>
              </span>
              Available for work
            </div>
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
              <Button>
                <FileDown className="mr-2 size-4" />
                <span className="font-semibold">Download Resume</span>
              </Button>
            </a>
            <Socials />
          </section>
        </motion.div>
      </motion.section>

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
        <CertificationsSection />
      </motion.div>
    </article>
  );
}
