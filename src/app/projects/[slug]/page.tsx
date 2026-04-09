import { notFound } from "next/navigation";
import Image from "next/image";
import Markdown from "react-markdown";
import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";
import { getProjectSlug } from "@/lib/project-utils";
import { Badge } from "@/components/ui/Badge";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import BrowserFrame from "@/components/BrowserFrame";

const parsed = projectSchema.parse(data);

function normalizeCaseStudyDescription(markdown: string) {
  return markdown
    .replace(/\n\*\*Solution:\*\*/g, "\n\n**Solution:**")
    .replace(/\n\*\*Impact:\*\*/g, "\n\n**Impact:**");
}

function CaseStudySection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-12 rounded-2xl border border-border/50 bg-card/30 p-6 sm:p-7">
      <div className="mb-6 space-y-2">
        <h2 className="font-serif text-2xl font-bold">{title}</h2>
        <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      {children}
    </section>
  );
}

function SectionEmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-background/40 p-4">
      <p className="text-sm leading-relaxed text-muted-foreground">{message}</p>
    </div>
  );
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
    title: project.name,
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
  const architecture = detail?.architecture ?? [];
  const decisions = detail?.decisions ?? [];
  const pipeline = detail?.pipeline ?? [];
  const incidents = detail?.incidents ?? [];
  const architectureMermaid = detail?.architectureMermaid?.trim();

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

      {detail?.results && detail.results.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-bold">Results</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {detail.results.map((result) => (
              <div
                key={result}
                className="rounded-xl border border-border/60 bg-card/50 p-4"
              >
                <p className="text-sm font-semibold text-foreground leading-relaxed">{result}</p>
              </div>
            ))}
          </div>
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

      <CaseStudySection
        title="Decisions"
        description="Key trade-offs and design calls that shaped the final delivery."
      >
        {decisions.length > 0 ? (
          <div className="space-y-3">
            {decisions.map((d) => (
              <div
                key={d.title}
                className="rounded-xl border border-border/60 bg-background/60 p-4"
              >
                <h3 className="text-sm font-bold text-foreground">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Context: </span>
                  {d.context}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Decision: </span>
                  {d.decision}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmptyState message="Decision records were not published for this case study, but the project summary above captures the main outcome." />
        )}
      </CaseStudySection>

      <CaseStudySection
        title="Architecture"
        description="The primary system boundaries, runtime pieces, and how the project was structured in production."
      >
        <div className="space-y-6">
          {architecture.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {architecture.map((item) => (
                <div
                  key={`${item.title}-${item.component}`}
                  className="rounded-xl border border-border/60 bg-background/60 p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {item.component}
                  </p>
                  <h3 className="mt-2 text-sm font-bold text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          ) : null}

          {architectureMermaid ? (
            <div className="rounded-xl border border-border/60 bg-zinc-950 p-4 shadow-inner">
              <p className="mb-3 text-xs leading-relaxed text-zinc-300">
                Mermaid source. Paste into{" "}
                <a
                  href="https://mermaid.live"
                  className="font-medium text-emerald-300 underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  mermaid.live
                </a>{" "}
                to visualize the diagram.
              </p>
              <pre className="max-h-[420px] overflow-auto font-mono text-[11px] leading-relaxed text-zinc-100 sm:text-xs">
                {architectureMermaid}
              </pre>
            </div>
          ) : null}

          {architecture.length === 0 && !architectureMermaid ? (
            <SectionEmptyState message="Architecture specifics are intentionally summarized for this project, but the overview and stack sections above outline the implementation shape." />
          ) : null}
        </div>
      </CaseStudySection>

      <CaseStudySection
        title="Pipeline"
        description="How changes moved from development through validation and deployment."
      >
        {pipeline.length > 0 ? (
          <div className="flex flex-col gap-0">
            {pipeline.map((step, i) => (
              <div key={`${step.stage}-${step.tool}`} className="flex items-stretch gap-3">
                <div className="flex flex-col items-center">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-emerald-500/40 bg-emerald-500/10 text-xs font-bold text-emerald-500">
                    {i + 1}
                  </div>
                  {i < pipeline.length - 1 ? (
                    <div className="w-px flex-1 bg-border/50" />
                  ) : null}
                </div>
                <div className="pb-5">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-sm font-bold text-foreground">{step.stage}</h3>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      {step.tool}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmptyState message="The delivery pipeline is not fully documented for this project, but deployment details are reflected in the shipped outcome and supporting notes above." />
        )}
      </CaseStudySection>

      <CaseStudySection
        title="Incidents"
        description="Operational failures, rehearsals, or recovery moments that changed how the system was run."
      >
        {incidents.length > 0 ? (
          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.title}
                className="rounded-xl border border-border/60 bg-background/60 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-foreground">{inc.title}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[10px] font-bold ${
                      inc.severity === "P1"
                        ? "bg-rose-500/15 text-rose-500"
                        : inc.severity === "P2"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {inc.severity}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Resolution: </span>
                  {inc.resolution}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Lesson: </span>
                  {inc.lesson}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <SectionEmptyState message="No public incident notes were added for this case study. The implementation was stable enough that there were no notable production learnings to document here." />
        )}
      </CaseStudySection>

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
