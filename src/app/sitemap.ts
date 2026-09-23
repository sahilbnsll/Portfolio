import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import projectsData from "@/data/projects.json";
import blogData from "@/data/blog.json";
import { projectSchema } from "@/lib/schemas";
import { getProjectSlug } from "@/lib/project-utils";
import { getBlogSlug, isExternalBlogPost, type BlogPost } from "@/lib/blog-utils";

const parsedProjects = projectSchema.parse(projectsData);
const posts = (blogData.posts ?? []) as BlogPost[];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/projects`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/resume`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = parsedProjects.projects
    .map((p) => getProjectSlug(p))
    .filter((slug): slug is string => Boolean(slug))
    .map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((p) => !p.comingSoon && !isExternalBlogPost(p))
    .map((p) => ({ slug: getBlogSlug(p), date: p.date }))
    .filter((p): p is { slug: string; date: string } => Boolean(p.slug))
    .map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly",
      priority: 0.6,
    }));

  return [...staticRoutes, ...projectRoutes, ...blogRoutes];
}
