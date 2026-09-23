"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Globe, Github, Linkedin, Coffee } from "lucide-react";
import SystemStatus from "./SystemStatus";
import ReportIssueDialog from "./ReportIssueDialog";

const portfolioUrl = "https://www.sahilbansal.net/";

type FooterLink = {
  label: string;
  href: string;
  isExternal?: boolean;
  isReportModal?: boolean;
};

type FooterColumn = {
  title: string;
  links: FooterLink[];
};

const COLUMNS: FooterColumn[] = [
  {
    title: "Explore",
    links: [
      { label: "Featured Projects", href: "/projects" },
      { label: "Cloud Architecture", href: "/#architecture" },
      { label: "Technical Blog", href: "/blog" },
      { label: "Interactive Resume", href: "/resume" },
    ],
  },
  {
    title: "Connect & Support",
    links: [
      { label: "Book a Strategy Call", href: "https://cal.com/sahilbansal/quick-chat-with-sahil", isExternal: true },
      { label: "Get in Touch", href: "/contact" },
      { label: "Report an Issue", href: "#report", isReportModal: true },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const SOCIAL_LINKS = [
  { url: portfolioUrl, label: "Portfolio", icon: Globe },
  {
    url: "https://x.com/sahilbansalll",
    label: "X",
    icon: () => (
      <svg className="size-[17px] fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  { url: "https://github.com/sahilbnsll", label: "GitHub", icon: Github },
  { url: "https://linkedin.com/in/sahilbansal24", label: "LinkedIn", icon: Linkedin },
  { url: "https://buymeacoffee.com/sahilbansal", label: "Buy Me a Coffee", icon: Coffee },
];

export default function Footer() {
  const [reportOpen, setReportOpen] = useState(false);
  const wordmarkAreaRef = useRef<HTMLDivElement>(null);
  const wordmarkGlowRef = useRef<HTMLParagraphElement>(null);
  const wordmarkRafRef = useRef<number | null>(null);

  const handleWordmarkMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const area = wordmarkAreaRef.current;
    const glow = wordmarkGlowRef.current;
    if (!area || !glow) return;

    const { clientX, clientY } = e;
    if (wordmarkRafRef.current !== null) {
      window.cancelAnimationFrame(wordmarkRafRef.current);
    }

    wordmarkRafRef.current = window.requestAnimationFrame(() => {
      const rect = area.getBoundingClientRect();
      const x = Math.round(((clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((clientY - rect.top) / rect.height) * 100);

      const mask = `radial-gradient(240px circle at ${x}% ${y}%, #fff 0%, #fff 40%, transparent 75%)`;
      glow.style.webkitMaskImage = mask;
      glow.style.maskImage = mask;
      glow.style.opacity = "1";
    });
  };

  const handleWordmarkMouseEnter = () => {
    if (wordmarkGlowRef.current) {
      wordmarkGlowRef.current.style.opacity = "1";
    }
  };

  const handleWordmarkMouseLeave = () => {
    if (wordmarkRafRef.current !== null) {
      window.cancelAnimationFrame(wordmarkRafRef.current);
      wordmarkRafRef.current = null;
    }
    if (wordmarkGlowRef.current) {
      wordmarkGlowRef.current.style.opacity = "0";
    }
  };

  useEffect(() => {
    return () => {
      if (wordmarkRafRef.current !== null) window.cancelAnimationFrame(wordmarkRafRef.current);
    };
  }, []);

  return (
    <footer id="footer" className="relative isolate z-1 mt-20 overflow-clip border-t border-border/40 bg-transparent text-foreground">
      {/* ─── Warm light pooling under the wordmark (LumaCV Signature Glow) ─── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-1 h-[78%] bg-[radial-gradient(125%_100%_at_50%_100%,rgb(196_166_140/16%)_0%,rgb(166_143_184/9%)_36%,transparent_70%)] dark:bg-[radial-gradient(125%_100%_at_50%_100%,rgb(196_166_140/12%)_0%,rgb(166_143_184/7%)_36%,transparent_70%)]"
      />

      <div className="mx-auto grid max-w-5xl grid-cols-[minmax(0,1.7fr)_repeat(2,minmax(0,1fr))] gap-x-12 gap-y-12 px-6 pt-[76px] max-[850px]:grid-cols-2 max-[850px]:gap-y-10 max-[540px]:grid-cols-1 max-[540px]:pt-[52px]">
        {/* ─── Brand Column ─── */}
        <div className="max-[850px]:col-span-full">
          <Link href="/" className="inline-flex items-center gap-[11px] text-[17px] font-semibold tracking-[-0.04em] text-foreground">
            {/* Avatar / Logo */}
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-border/80 bg-muted/40 shadow-sm transition-transform duration-300 hover:scale-105">
              <Image
                src="/avatar.png"
                alt="Sahil Bansal"
                width={32}
                height={32}
                className="h-full w-full object-cover object-top"
                priority
              />
            </div>
            <span className="font-bold tracking-tight">Sahil Bansal</span>
          </Link>

          <p className="mt-[18px] max-w-[310px] text-[14px] leading-[1.7] text-muted-foreground">
            DevOps & Cloud Infrastructure Engineer. Designing resilient cloud architectures, Kubernetes clusters, and automated developer platforms.
          </p>

          {/* Social Links Row */}
          <ul className="mt-6 flex flex-wrap gap-1 text-muted-foreground">
            {SOCIAL_LINKS.map((s) => {
              const Icon = s.icon;
              return (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-grid size-10 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                    aria-label={s.label}
                  >
                    <Icon className="size-[19px]" aria-hidden="true" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ─── 4 Nav Columns (Customized for Portfolio) ─── */}
        {COLUMNS.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h2 className="text-[15px] font-semibold tracking-[-0.03em] text-foreground">
              {column.title}
            </h2>
            <ul className="mt-[18px] space-y-0.5">
              {column.links.map((link) => (
                <li key={link.label}>
                  {link.isReportModal ? (
                    <button
                      type="button"
                      onClick={() => setReportOpen(true)}
                      className="group/link flex min-h-9 w-full items-center justify-start text-left text-[14px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="text-left">{link.label}</span>
                    </button>
                  ) : link.isExternal ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex min-h-9 items-center gap-1 text-left text-[14px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight
                        className="size-3.5 shrink-0 opacity-0 transition-[opacity,transform] duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:opacity-60"
                        aria-hidden="true"
                      />
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="group/link inline-flex min-h-9 items-center gap-1 text-left text-[14px] leading-snug text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span>{link.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      {/* ─── Sub-Footer Line ─── */}
      <div className="mx-auto mt-[68px] flex max-w-6xl items-center justify-between gap-x-8 gap-y-3 border-t border-border/50 px-6 pt-6 text-[12px] text-muted-foreground max-[700px]:flex-col max-[700px]:items-start max-[540px]:mt-12">
        <p>
          Engineered with Next.js, Tailwind CSS & TypeScript.
          <br />
          Released under the{" "}
          <Link
            href="/privacy"
            className="text-foreground underline-offset-[3px] hover:underline"
          >
            MIT License
          </Link>
          .
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <p>
            Designed & Built by{" "}
            <Link
              href="/"
              className="text-foreground underline-offset-[3px] hover:underline"
            >
              Sahil Bansal
            </Link>{" "}
            ·{" "}
            <span className="font-mono tabular-nums text-muted-foreground">
              v2.4.0
            </span>
          </p>
          <span aria-hidden="true" className="text-border">
            ·
          </span>
          <SystemStatus />
        </div>
      </div>

      {/* ─── Oversized Wordmark Watermark with Pixel-Perfect Glowing Reveal ─── */}
      <div className="mx-auto mt-10 max-w-6xl px-6 pb-4 max-[540px]:mt-7">
        <div
          ref={wordmarkAreaRef}
          onMouseMove={handleWordmarkMouseMove}
          onMouseEnter={handleWordmarkMouseEnter}
          onMouseLeave={handleWordmarkMouseLeave}
          className="group relative inline-block w-full select-none overflow-hidden cursor-default"
        >
          {/* Base watermark typography */}
          <p
            aria-hidden="true"
            className="select-none bg-gradient-to-b from-foreground/20 from-30% to-foreground/[0.02] bg-clip-text text-[clamp(36px,13.8vw,175px)] font-bold leading-[0.78] tracking-[-0.07em] text-transparent dark:from-[#f1f0eb] dark:from-40% dark:to-[rgb(241_240_235/4%)]"
          >
            Sahil Bansal
          </p>

          {/* Glowing cursor-reactive gradient watermark */}
          <p
            ref={wordmarkGlowRef}
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #f43f5e 0%, #fb7185 28%, #c084fc 52%, #818cf8 76%, #38bdf8 100%)",
              WebkitMaskImage:
                "radial-gradient(240px circle at 50% 50%, #fff 0%, #fff 40%, transparent 75%)",
              maskImage:
                "radial-gradient(240px circle at 50% 50%, #fff 0%, #fff 40%, transparent 75%)",
            }}
            className="pointer-events-none absolute inset-0 select-none bg-clip-text text-[clamp(36px,13.8vw,175px)] font-bold leading-[0.78] tracking-[-0.07em] text-transparent opacity-0 transition-opacity duration-200 ease-out"
          >
            Sahil Bansal
          </p>
        </div>
      </div>

      {/* ─── In-App Issue / Feedback Reporting Dialog Modal ─── */}
      <ReportIssueDialog open={reportOpen} onOpenChange={setReportOpen} />
    </footer>
  );
}
