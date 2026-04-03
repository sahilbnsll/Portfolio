"use client";

import Image from "next/image";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

const TECH = [
  { name: "AWS", slug: "amazonaws", color: "232F3E" },
  { name: "Terraform", slug: "terraform", color: "7B42BC" },
  { name: "Docker", slug: "docker", color: "2496ED" },
  { name: "Kubernetes", slug: "kubernetes", color: "326CE5" },
  { name: "GitHub Actions", slug: "githubactions", color: "2088FF" },
  { name: "Prometheus", slug: "prometheus", color: "E6522C" },
] as const;

export default function HeroTechBadges({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        Core stack
      </p>
      <div className="flex flex-wrap gap-2">
        {TECH.map((t) => (
          <span
            key={t.slug}
            title={t.name}
            className={cn(
              "inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/90 px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-accent/50",
              !prefersReducedMotion && "motion-safe:duration-200",
            )}
          >
            <Image
              src={`https://cdn.simpleicons.org/${t.slug}/${t.color}`}
              alt=""
              width={18}
              height={18}
              className="size-[18px] shrink-0"
              unoptimized
            />
            <span className="whitespace-nowrap pr-0.5">{t.name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
