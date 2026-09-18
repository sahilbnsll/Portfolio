"use client";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { useSound } from "@/hooks/useSound";

export default function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const playClick = useSound("/sounds/click.mp3", 0.25);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      size="icon"
      variant="ghost"
      title={resolvedTheme === "dark" ? "Dark mode (click for light mode)" : "Light mode (click for dark mode)"}
      aria-label={resolvedTheme === "dark" ? "Dark mode (click for light mode)" : "Light mode (click for dark mode)"}
      onClick={() => {
        playClick();
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
      }}
    >
      {resolvedTheme === "dark" ? (
        <MoonIcon className="size-4 text-indigo-400" />
      ) : (
        <SunIcon className="size-4 text-amber-500" />
      )}
      <span className="sr-only">Theme Toggle</span>
    </Button>
  );
}
