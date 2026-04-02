"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import VisitStats from "./VisitStats";

import routesData from "@/data/routes.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const navLinks = routesData.routes
  .filter((route) => route.showInNav)
  .map((route) => ({
    name: route.name,
    href: route.path,
    title: route.description,
  }));

export default function Header() {
  const pathname = usePathname();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md backdrop-saturate-150 ${
        prefersReducedMotion ? "" : "animate-slide-down-fade-in"
      }`}
    >
      <div className="mx-auto max-w-3xl px-8 py-5">
        <nav className="flex items-center justify-between">
          {/* Desktop Nav */}
          <ul className="hidden gap-8 sm:flex">
            {navLinks.map((nav, id) => {
              const isActive = pathname === nav.href;
              return (
                <li key={id} className="relative">
                  <a
                    href={nav.href}
                    title={nav.title}
                    className={`relative inline-block py-1 text-sm font-medium tracking-wide transition-colors duration-300 ${
                      isActive
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {nav.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                        transition={{
                          type: "spring",
                          stiffness: 380,
                          damping: 30,
                        }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* Mobile hamburger */}
          <button
            className="relative z-50 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground sm:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-1 sm:gap-3">
            <VisitStats />
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-md sm:hidden"
          >
            <div className="mx-auto max-w-3xl px-8 py-4">
              <ul className="flex flex-col gap-1">
                {navLinks.map((nav, id) => {
                  const isActive = pathname === nav.href;
                  return (
                    <li key={id}>
                      <a
                        href={nav.href}
                        title={nav.title}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                        }`}
                      >
                        {nav.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
