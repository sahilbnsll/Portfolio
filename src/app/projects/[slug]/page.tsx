import { notFound } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { getProjectSlug } from "@/lib/project-utils";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import BrowserFrame from "@/components/BrowserFrame";

const parsed = projectSchema.parse(data);

function normalizeCaseStudyDescription(markdown: string) {
  return markdown
    .replace(/\n\*\*Solution:\*\*/g, "\n\n**Solution:**")
    .replace(/\n\*\*Impact:\*\*/g, "\n\n**Impact:**");
}

export function generateStaticParams() {
  return parsed.projects
    .map((p) => getProjectSlug(p))
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
}

type Props = { params: { slug: string } | Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = parsed.projects.find((p) => getProjectSlug(p) === slug);
  if (!project) return { title: "Project" };
  return {
    title: `${project.name} | Sahil Bansal`,
    description: project.description.replace(/\*\*/g, "").slice(0, 160),
  };
}

export default async function ProjectCaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const requestedSlug = slug
    .trim()
    .toLowerCase()
    // Be tolerant if someone passes `/projects/<slug>`-like values.
    .replace(/^\/?projects\//, "")
    .replace(/^\//, "")
    .split("/")[0];

  const project = parsed.projects.find((p) => {
    const slugA = getProjectSlug(p)?.toLowerCase();
    const slugB = p.slug?.trim().toLowerCase();
    const slugFromHref = p.href?.trim().startsWith("/projects/")
      ? p.href.trim().replace(/^\/projects\//, "").split("/")[0].toLowerCase()
      : undefined;
    return (
      slugA === requestedSlug ||
      slugB === requestedSlug ||
      slugFromHref === requestedSlug
    );
  });
  if (!project) notFound();

  const detail = project.detail;
  const caseStudySlug = getProjectSlug(project)!;

  return (
    <article className="mx-auto max-w-3xl pb-16 pt-8">
      <a
        href="/projects"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden />
        All projects
      </a>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {project.category && (
            <Badge variant="secondary">{project.category}</Badge>
          )}
          <span className="font-mono text-xs text-muted-foreground">
            /projects/{caseStudySlug}
          </span>
        </div>
        <h1 className="title text-3xl sm:text-4xl">{project.name}</h1>
        {project.metrics && project.metrics.length > 0 && (
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {project.metrics.map((m) => (
              <li
                key={m}
                className="rounded-lg border border-border/60 bg-card/80 px-3 py-2 text-sm font-medium"
              >
                {m}
              </li>
            ))}
          </ul>
        )}
      </header>

      {project.image && (
        <BrowserFrame url={`project.${caseStudySlug}.local`} className="mt-10">
          <div className="relative aspect-[16/9] w-full bg-muted">
            <Image
              src={project.image}
              alt=""
              fill
              className="object-cover"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        </BrowserFrame>
      )}

      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
        <Markdown>{normalizeCaseStudyDescription(project.description)}</Markdown>
      </div>

      {detail?.overview && (
        <section className="mt-12">
          <h2 className="mb-3 font-serif text-2xl font-bold">Overview</h2>
          <p className="text-muted-foreground leading-relaxed">{detail.overview}</p>
        </section>
      )}

      {detail?.beforeAfter && detail.beforeAfter.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-bold">Before / after</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {detail.beforeAfter.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-border/60 bg-card/50 p-4"
              >
                <h3 className="font-semibold text-foreground">{row.label}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium text-rose-600 dark:text-rose-400">Before: </span>
                  {row.before}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">After: </span>
                  {row.after}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {detail?.stackHighlights && detail.stackHighlights.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-3 font-serif text-2xl font-bold">Stack</h2>
          <div className="flex flex-wrap gap-2">
            {detail.stackHighlights.map((s) => (
              <Badge key={s} variant="outline">
                {s}
              </Badge>
            ))}
          </div>
        </section>
      )}

      {detail?.architectureMermaid?.trim() && (
        <section className="mt-12">
          <h2 className="mb-2 font-serif text-2xl font-bold">Architecture</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Mermaid diagram source—paste into{" "}
            <a
              href="https://mermaid.live"
              className="font-medium text-primary underline"
              target="_blank"
              rel="noreferrer"
            >
              mermaid.live
            </a>
            , VS Code, or your docs toolchain.
          </p>
          <pre className="max-h-[420px] overflow-auto rounded-xl border border-border/60 bg-zinc-950 p-4 font-mono text-[11px] leading-relaxed text-zinc-100 shadow-inner sm:text-xs">
            {detail.architectureMermaid.trim()}
          </pre>
        </section>
      )}

      <footer className="mt-14 flex flex-wrap gap-4 border-t border-border/40 pt-8">
        <a
          href="/contact"
          className="text-sm font-semibold text-primary hover:underline"
        >
          Discuss this project →
        </a>
        <a
          href="/projects"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Back to grid
        </a>
      </footer>
    </article>
  );
}
