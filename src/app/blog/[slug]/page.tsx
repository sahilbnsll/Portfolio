import { notFound, redirect } from "next/navigation";
import Markdown from "react-markdown";
import type { Metadata } from "next";
import blogData from "@/data/blog.json";
import blogContentData from "@/data/blog-content.json";
import { getBlogSlug, isExternalBlogPost } from "@/lib/blog-utils";
import { SITE_URL, OG_IMAGE_PATH } from "@/lib/seo";

type Post = {
  title: string;
  description: string;
  date: string;
  comingSoon?: boolean;
  href?: string;
  external?: boolean;
};

type BlogContent = {
  slug: string;
  title: string;
  content: string;
};

const posts = (blogData.posts ?? []) as Post[];
const postContents = (blogContentData.posts ?? []) as BlogContent[];

type Props = { params: { slug: string } | Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts
    .filter((p) => !isExternalBlogPost(p))
    .map((p) => getBlogSlug(p))
    .filter((s): s is string => Boolean(s))
    .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => getBlogSlug(p) === slug);
  if (!post) return { title: "Blog" };

  const title = `${post.title} | Blog | Sahil Bansal`;
  const url = `${SITE_URL}/blog/${slug}`;

  return {
    title: { absolute: title },
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [OG_IMAGE_PATH],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = posts.find((p) => getBlogSlug(p) === slug);
  if (!post) notFound();

  if (post.href && isExternalBlogPost(post)) {
    redirect(post.href);
  }

  const content = postContents.find((p) => p.slug === slug);

  return (
    <article className="mx-auto mt-8 flex max-w-3xl flex-col gap-8 pb-16">
      <div className="space-y-3">
        <a
          href="/blog"
          className="inline-flex text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          ← Back to blog
        </a>
        <h1 className="title text-3xl sm:text-4xl">{post.title}</h1>
        <p className="text-sm text-muted-foreground">{post.description}</p>
      </div>

      {post.comingSoon ? (
        <div className="rounded-xl border border-border/60 bg-card/70 p-5 text-sm text-muted-foreground">
          This article is marked as coming soon.
        </div>
      ) : (
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <Markdown>{content?.content ?? "Content not found for this post yet."}</Markdown>
        </div>
      )}
    </article>
  );
}
