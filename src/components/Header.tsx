"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";
import VisitStats from "./VisitStats";

import routesData from "@/data/routes.json";

const navLinks = routesData.routes
  .filter((route) => route.showInNav)
  .map((route) => ({
    name: route.name,
    href: route.path,
    title: route.description,
  }));

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl px-8 py-6">
        <nav className="flex items-center justify-between">
          <ul className="flex gap-4 sm:gap-8">
            {navLinks.map((nav, id) => {
              const isActive = pathname === nav.href;
              return (
                <li key={id} className="link relative group">
                  <Link
                    href={nav.href}
                    title={nav.title}
                    className={`relative inline-block transition-colors duration-500 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <span className="relative z-10">{nav.name}</span>
                    {/* 3D white underline with depth effect on hover */}
                    {!isActive && (
                      <>
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black dark:bg-white transition-all duration-500 ease-out group-hover:w-full"
                          style={{ transform: 'translateY(2px)' }} />
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black/50 dark:bg-white/50 blur-[2px] transition-all duration-500 ease-out group-hover:w-full"
                          style={{ transform: 'translateY(3px)' }} />
                        <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-black/30 dark:bg-white/30 blur-[4px] transition-all duration-500 ease-out group-hover:w-full"
                          style={{ transform: 'translateY(4px)' }} />
                      </>
                    )}
                  </Link>
                  {/* Active indicator - pure white */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-black dark:bg-white animate-in fade-in slide-in-from-bottom-2 duration-300" />
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2 sm:gap-4">
            <VisitStats />
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
