"use client";

import blogData from "@/data/blog.json";
import { motion } from "framer-motion";
import Link from "next/link";
import { isExternalBlogPost } from "@/lib/blog-utils";

type Post = {
  title: string;
  description: string;
  date: string;
  comingSoon?: boolean;
  href?: string;
  external?: boolean;
};

const posts = (blogData.posts ?? []) as Post[];
const intro = blogData.intro as string | undefined;

export default function BlogPage() {
  return (
    <article className="mt-8 flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-2">
        <motion.h1
          className="title"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          blog.
        </motion.h1>
        <motion.p
          className="text-sm leading-relaxed text-muted-foreground sm:text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {intro ??
            "Notes on migrations, automation, and things that broke before breakfast."}
        </motion.p>
      </div>

      {posts.length > 0 ? (
        <ul className="flex flex-col">
          {posts.map((post, idx) => (
            <motion.li
              key={post.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 + idx * 0.05 }}
              className="border-b border-border/30 last:border-0"
            >
              <div className="flex items-baseline justify-between gap-4 py-4">
                <div className="min-w-0 flex-1">
                  <span className="font-medium text-foreground">
                    {post.href ? (
                      isExternalBlogPost(post) ? (
                        <a
                          href={post.href}
                          target="_blank"
                          rel="noreferrer"
                          className="hover:text-primary hover:underline"
                        >
                          {post.title}
                        </a>
                      ) : (
                        <Link
                          href={post.href}
                          className="hover:text-primary hover:underline"
                        >
                          {post.title}
                        </Link>
                      )
                    ) : (
                      post.title
                    )}
                  </span>
                  {post.comingSoon && (
                    <span className="ml-2 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      coming soon
                    </span>
                  )}
                  {!post.comingSoon && post.href && (
                    <span className="ml-2 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                      {isExternalBlogPost(post) ? "external" : "in-site"}
                    </span>
                  )}
                  <p className="mt-1 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </motion.li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          Posts are on the way. Check back soon.
        </p>
      )}
    </article>
  );
}
