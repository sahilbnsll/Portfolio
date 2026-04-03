"use client";

import blogData from "@/data/blog.json";
import { motion } from "framer-motion";
import { FileText, Clock } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

type Post = {
  title: string;
  description: string;
  date: string;
  comingSoon?: boolean;
  href?: string;
};

const posts = (blogData.posts ?? []) as Post[];
const intro = blogData.intro as string | undefined;

export default function BlogSection({ className }: { className?: string }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!posts.length) return null;

  return (
    <section id="writing" className={cn("relative scroll-mt-28", className)}>
      <div className="mb-6">
        <h2 className="title text-2xl sm:text-3xl">writing</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {intro ??
            "Long-form notes on migrations, CI/CD, and things that only happen in prod."}
        </p>
      </div>
      <ul className="flex flex-col gap-4">
        {posts.map((post, idx) => (
          <motion.li
            key={post.title}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
            whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.35, delay: idx * 0.05 }}
          >
            <div
              className={cn(
                "group flex flex-col gap-2 rounded-xl border border-border/50 bg-card/50 p-4 transition-colors hover:border-primary/30 hover:bg-card/80 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                post.href && !post.comingSoon && "cursor-pointer",
              )}
            >
              <div className="flex min-w-0 flex-1 gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary">
                  <FileText className="size-5" aria-hidden />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-foreground leading-snug">
                      {post.title}
                    </h3>
                    {post.comingSoon ? (
                      <Badge variant="outline" className="text-[10px]">
                        Coming soon
                      </Badge>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {post.description}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Clock className="size-3.5 shrink-0" aria-hidden />
                    {post.date}
                  </p>
                </div>
              </div>
              {post.href && !post.comingSoon ? (
                <a
                  href={post.href}
                  className="text-sm font-medium text-primary hover:underline sm:shrink-0"
                >
                  Read →
                </a>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
