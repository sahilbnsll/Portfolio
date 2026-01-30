"use client";

import Projects from "@/components/Projects";

export default function ProjectPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4">
        <h1 className="title">infrastructure projects.</h1>
        <p className="text-muted-foreground">
          A selection of systems I&apos;ve architected and problems I&apos;ve solved. From zero-downtime migrations to cost optimizations that saved $40k+ annually. Here&apos;s what I&apos;ve shipped.
        </p>
      </div>

      <Projects />
    </article>
  );
}
