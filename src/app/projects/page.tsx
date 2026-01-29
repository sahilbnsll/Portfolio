import Projects from "@/components/Projects";
import FeaturedProject from "@/components/FeaturedProject";
import data from "@/data/projects.json";
import { projectSchema } from "@/lib/schemas";

export default async function ProjectPage() {
  const projects = projectSchema.parse(data).projects;
  const featuredProject = projects[0]; // Multi-Tenant Merchant Platform

  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-4">
        <h1 className="title">infrastructure projects.</h1>
        <p className="text-muted-foreground">
          A selection of systems I&apos;ve architected and problems I&apos;ve solved. From zero-downtime migrations to cost optimizations that saved $40k+ annually&mdash;here&apos;s what I&apos;ve shipped.
        </p>
      </div>
      <FeaturedProject
        name={featuredProject.name}
        description={featuredProject.description}
        image={featuredProject.image}
        tags={featuredProject.tags}
        href={`/projects/merchant-platform`}
      />

      <Projects />
    </article>
  );
}
