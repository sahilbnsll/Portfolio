"use client";

import homeContent from "@/data/home.json";
import { Badge } from "@/components/ui/Badge";
import { Hammer } from "lucide-react";
import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const building = homeContent.currentlyBuilding as
  | {
      title: string;
      headline: string;
      body: string;
      tags: string[];
    }
  | undefined;

export default function CurrentlyBuildingSection({
  className,
}: {
  className?: string;
}) {
  const prefersReducedMotion = usePrefersReducedMotion();
  if (!building) return null;

  return (
    <section
      id="building"
      className={cn("relative scroll-mt-28", className)}
    >
      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4 }}
        className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-card/50 p-6 shadow-md backdrop-blur-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <Hammer className="size-5" aria-hidden />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                {building.title}
              </p>
              <h2 className="title mt-1 text-2xl sm:text-3xl">
                {building.headline}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                {building.body}
              </p>
            </div>
          </div>
        </div>
        {building.tags?.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {building.tags.map((t) => (
              <Badge key={t} variant="secondary" className="font-normal">
                {t}
              </Badge>
            ))}
          </div>
        ) : null}
      </motion.div>
    </section>
  );
}
