"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ChatToggle from "./ChatToggle";
import ThemeToggle from "./ThemeToggle";

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
                <li key={id} className="link relative">
                  <Link
                    href={nav.href}
                    title={nav.title}
                    className={`transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    {nav.name}
                  </Link>
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-purple-500 to-blue-500 animate-in fade-in slide-in-from-bottom-2 duration-300" />
                  )}
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2 sm:gap-4">
            <ChatToggle />
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
