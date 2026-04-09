"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import VisitStats from "./VisitStats";
import ViewModeToggle from "./ViewModeToggle";

import routesData from "@/data/routes.json";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

type NavLink = {
  name: string;
  href: string;
  title: string;
};

const navLinks: NavLink[] = routesData.routes
  .filter((route) => route.showInNav)
  .map((route) => ({
    name: route.name,
    href: route.path,
    title: route.description,
  }));

function activeHash(): string {
  if (typeof window === "undefined") return "";
  return window.location.hash || "";
}

function isNavActive(pathname: string, hash: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/" && hash === "";
  }
  if (href.startsWith("/#")) {
    return pathname === "/" && hash === href.slice(1);
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const pathname = usePathname();
  const currentPathname = pathname ?? "";
  const prefersReducedMotion = usePrefersReducedMotion();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hash, setHash] = useState("");
  const showViewToggle = currentPathname === "/" || currentPathname === "/resume";

  useEffect(() => {
    setHash(activeHash());
    const onHash = () => setHash(activeHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    setHash(activeHash());
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md backdrop-saturate-150 ${
        prefersReducedMotion ? "" : "animate-slide-down-fade-in"
      }`}
    >
      <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 sm:py-4 md:px-8 lg:px-10">
        <nav className="flex items-center justify-between gap-3">
          <ul className="hidden flex-wrap items-center gap-x-5 gap-y-1 lg:flex xl:gap-x-7">
            {navLinks.map((nav, id) => {
              const active = isNavActive(currentPathname, hash, nav.href);
              const isHashLink = nav.href.startsWith("/#");
              const linkClass = `relative inline-block py-1 text-sm font-medium tracking-wide transition-colors duration-300 ${
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`;
              return (
                <li key={id} className="relative">
                  {isHashLink ? (
                    <a href={nav.href} title={nav.title} className={linkClass}>
                      {nav.name}
                      {active && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  ) : (
                    <a href={nav.href} title={nav.title} className={linkClass}>
                      {nav.name}
                      {active && (
                        <motion.span
                          layoutId="activeNav"
                          className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-foreground"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </a>
                  )}
                </li>
              );
            })}
          </ul>

          <button
            className="rounded-full border border-border/60 bg-background/70 p-2.5 text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-foreground lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>

          <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-1.5 py-1 shadow-sm sm:gap-2 sm:px-2">
            {showViewToggle && (
              <>
                <ViewModeToggle />
                <div className="mx-0.5 h-4 w-px bg-border/60" />
              </>
            )}
            <VisitStats />
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border/40 bg-background/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 md:px-8 lg:px-10">
              <ul className="flex flex-col gap-2 rounded-2xl border border-border/50 bg-card/60 p-2 shadow-lg">
                {navLinks.map((nav, id) => {
                  const active = isNavActive(currentPathname, hash, nav.href);
                  const isHashLink = nav.href.startsWith("/#");
                  const mobileClass = `block rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  }`;
                  return (
                    <li key={id}>
                      {isHashLink ? (
                        <a
                          href={nav.href}
                          title={nav.title}
                          onClick={() => setMobileMenuOpen(false)}
                          className={mobileClass}
                        >
                          {nav.name}
                        </a>
                      ) : (
                        <a
                          href={nav.href}
                          title={nav.title}
                          onClick={() => setMobileMenuOpen(false)}
                          className={mobileClass}
                        >
                          {nav.name}
                        </a>
                      )}
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
