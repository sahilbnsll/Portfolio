import type { Project } from "@/lib/schemas";

/** Slug from explicit field, href path, or name. */
export function getProjectSlug(project: Project): string | null {
  if (project.slug?.trim()) return project.slug.trim();
  const href = project.href?.trim();
  if (href?.startsWith("/projects/")) {
    const s = href.replace(/^\/projects\//, "").split("/")[0];
    if (s) return s;
  }
  return null;
}

export function getProjectDetailUrl(project: Project): string | null {
  const slug = getProjectSlug(project);
  return slug ? `/projects/${slug}` : null;
}
