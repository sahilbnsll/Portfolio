"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Switch from "./ui/sky-toggle";
import { useSound } from "@/hooks/useSound";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const playClick = useSound("/sounds/click.mp3", 0.25);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        aria-hidden="true"
        className="inline-flex h-[22px] w-[38px] rounded-full bg-muted/50"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (checked: boolean) => {
    playClick();

    const targetTheme = checked ? "dark" : "light";
    if (typeof document !== "undefined" && "startViewTransition" in document) {
      (document as unknown as { startViewTransition: (cb: () => void) => void }).startViewTransition(() => {
        const root = document.documentElement;
        if (targetTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
        setTheme(targetTheme);
      });
    } else {
      setTheme(targetTheme);
    }
  };

  return (
    <div className="flex h-7 items-center justify-center">
      <Switch
        checked={isDark}
        onChange={(e) => handleToggle(e.target.checked)}
        size="7px"
        aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      />
    </div>
  );
}
