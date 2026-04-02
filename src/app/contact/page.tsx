"use client";

import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="title">let&apos;s talk infrastructure.</h1>
        </motion.div>
        <motion.p
          className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          I&apos;m most responsive to questions about system reliability, cost
          optimization, scaling infrastructure, and DevOps challenges. Whether
          you&apos;re exploring collaboration, need infrastructure advice, or
          want to discuss how I can contribute to your team, I&apos;m all ears.
          Drop a message below and I&apos;ll get back to you within 24 hours.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ContactForm />
      </motion.div>
    </article>
  );
}
