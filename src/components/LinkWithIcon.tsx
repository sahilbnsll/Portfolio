import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type LinkWithIconProps = {
  href: string;
  icon?: React.ReactNode;
  position: "left" | "right";
  text?: string;
  className?: string;
  ariaLabel?: string;
};

export default function LinkWithIcon({
  href,
  icon,
  position,
  text,
  className,
  ariaLabel,
}: LinkWithIconProps) {
  return (
    <Link
      href={href}
      className={cn("link flex items-center gap-2 font-light", className)}
      aria-label={ariaLabel || text}
    >
      {position === "left" && icon}
      <span>{text}</span>
      {position === "right" && icon}
    </Link>
  );
}
