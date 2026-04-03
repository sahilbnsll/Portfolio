"use client";

import { Badge } from "@/components/ui/Badge";
import { Project } from "@/lib/schemas";
import { getProjectSlug } from "@/lib/project-utils";
import Link from "next/link";
import Icon from "./Icon";
import ImageWithSkeleton from "./ImageWithSkeleton";
import BrowserFrame from "./BrowserFrame";
import { ArrowUpRight } from "lucide-react";

interface Props {
  project: Project;
}

const categoryGradients: Record<string, string> = {
  "Infrastructure & DevOps":
    "from-blue-500/20 via-blue-400/10 to-transparent",
  "CI/CD": "from-green-500/20 via-green-400/10 to-transparent",
  Security: "from-red-500/20 via-red-400/10 to-transparent",
  "Data & Analytics":
    "from-purple-500/20 via-purple-400/10 to-transparent",
  "Automation & AI":
    "from-amber-500/20 via-amber-400/10 to-transparent",
};

const categoryColors: Record<string, string> = {
  "Infrastructure & DevOps": "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  "CI/CD": "bg-green-500/10 text-green-600 dark:text-green-400",
  Security: "bg-red-500/10 text-red-600 dark:text-red-400",
  "Data & Analytics":
    "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  "Automation & AI":
    "bg-amber-500/10 text-amber-600 dark:text-amber-400",
};

export function ProjectCard({ project }: Props) {
  const { name, description, image, tags, category, links, summary } = project;
  const slug = getProjectSlug(project);
  // Prefer the explicit href stored in `projects.json` (most reliable) but
  // fall back to the derived slug path.
  const detailUrl = project.href?.trim() ?? (slug ? `/projects/${slug}` : null);
  const safeTags = tags ?? [];
  const gradient =
    categoryGradients[category ?? ""] ??
    "from-gray-500/20 via-gray-400/10 to-transparent";

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border/50 bg-card/60 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_0_1px_rgba(99,102,241,0.35),0_0_45px_rgba(99,102,241,0.22)] dark:hover:border-primary/30 dark:hover:shadow-[0_0_0_1px_rgba(99,102,241,0.45),0_0_55px_rgba(99,102,241,0.35)]">
      {/* Image with gradient overlay */}
      {image && (
        <BrowserFrame
          url={name.toLowerCase().replace(/\s+/g, "-").slice(0, 28)}
          className="rounded-b-none border-0 shadow-none ring-0"
        >
          <div className="relative overflow-hidden">
            <div
              className={`absolute inset-0 z-10 bg-gradient-to-t ${gradient} transition-opacity duration-500 group-hover:opacity-60`}
            />
            <ImageWithSkeleton
              src={image}
              alt={name}
              width={960}
              height={420}
              sizes="(max-width: 1024px) 100vw, 448px"
              quality={78}
              containerClassName="h-44 w-full sm:h-48"
              className="h-44 w-full object-cover object-center transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02] sm:h-48"
            />
          </div>
        </BrowserFrame>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-primary">
            {name}
          </h3>
          {category && (
            <Badge
              className={`shrink-0 whitespace-nowrap px-2 py-0.5 text-[10px] ${
                categoryColors[category] ??
                "bg-gray-500/10 text-gray-600 dark:text-gray-400"
              }`}
              variant="secondary"
            >
              {category}
            </Badge>
          )}
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {(summary || description)
            .replace(/\*\*/g, "")
            .replace(/\n/g, " ")}
        </p>

        {safeTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {[...safeTags]
              .sort()
              .slice(0, 5)
              .map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-1.5 py-0.5 text-[10px]"
                >
                  {tag}
                </Badge>
              ))}
            {safeTags.length > 5 && (
              <Badge
                variant="secondary"
                className="px-1.5 py-0.5 text-[10px]"
              >
                +{safeTags.length - 5}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3 border-t border-border/30 px-5 py-3">
        {detailUrl && (
          <Link
            href={detailUrl}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            Case study
            <ArrowUpRight className="size-3.5" aria-hidden />
          </Link>
        )}
        {links?.map((linkItem, idx) => (
          <Link
            href={linkItem.href}
            key={idx}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name={linkItem.icon} className="size-3.5" />
            {linkItem.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
