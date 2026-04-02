"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import React from "react";

export default function MainContentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <motion.main
      key={pathname}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="grow"
    >
      {children}
    </motion.main>
  );
}
