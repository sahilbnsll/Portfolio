"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * PageTransition
 * ─────────────
 * Wraps every page in a subtle fade + 14px upward slide.
 * Uses pathname as the AnimatePresence key so every navigation
 * triggers an exit → enter cycle.
 *
 * Kept deliberately short (300ms) so it feels snappy, not theatrical.
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        /* keep layout stable; don't collapse height during exit */
        style={{ willChange: "opacity, transform" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
