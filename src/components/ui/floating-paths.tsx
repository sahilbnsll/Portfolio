"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

function FloatingPathGroup({ position }: { position: number }) {
  const shouldReduceMotion = useReducedMotion();

  const paths = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 10 * position} -${189 + i * 12}C-${
      380 - i * 10 * position
    } -${189 + i * 12} -${312 - i * 10 * position} ${216 - i * 12} ${
      152 - i * 10 * position
    } ${343 - i * 12}C${616 - i * 10 * position} ${470 - i * 12} ${
      684 - i * 10 * position
    } ${875 - i * 12} ${684 - i * 10 * position} ${875 - i * 12}`,
    width: 0.6 + i * 0.05,
    duration: 20 + ((i * 5) % 11),
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      <svg
        className="h-full w-full text-slate-800/20 dark:text-slate-200/30"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {paths.map((path) => (
          <motion.path
            key={`${position}-${path.id}`}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.07 + path.id * 0.016}
            initial={{ pathLength: 0.35, opacity: 0.5 }}
            animate={
              shouldReduceMotion
                ? { pathLength: 1, opacity: 0.45 }
                : {
                    pathLength: 1,
                    opacity: [0.25, 0.7, 0.25],
                    pathOffset: [0, 1, 0],
                  }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : {
                    duration: path.duration,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "linear",
                  }
            }
          />
        ))}
      </svg>
    </div>
  );
}

export function FloatingPathsBackground({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <FloatingPathGroup position={1} />
      <FloatingPathGroup position={-1} />
      {children}
    </div>
  );
}

export default FloatingPathsBackground;

