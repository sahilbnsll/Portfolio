export type BlogPost = {
  title: string;
  description: string;
  date: string;
  comingSoon?: boolean;
  href?: string;
  external?: boolean;
};

export function getBlogSlug(post: BlogPost): string | null {
  const href = post.href?.trim();
  if (!href) return null;
  if (href.startsWith("/blog/")) {
    const slug = href.replace(/^\/blog\//, "").split("/")[0];
    return slug || null;
  }
  return null;
}

export function isExternalBlogPost(post: BlogPost): boolean {
  if (post.external) return true;
  const href = post.href?.trim() ?? "";
  return href.startsWith("http://") || href.startsWith("https://");
}
