"use client";

import { Button } from "./ui/Button";
import { CalendarDays, CalendarRange, CalendarCheck, BarChart3, X, RefreshCw } from "lucide-react";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Sparkline from "./ui/Sparkline";
import StatDelta from "./ui/StatDelta";

interface Stats {
  today: number;
  week: number;
  month: number;
  todayDelta?: number;
  weekDelta?: number;
  monthDelta?: number;
  todayTrend?: number[];
  weekTrend?: number[];
  monthTrend?: number[];
  // pageviews
  pageViews?: {
    today: number;
    week: number;
    month: number;
  };
  todayPageviewTrend?: number[];
  weekPageviewTrend?: number[];
  monthPageviewTrend?: number[];
}

export default function VisitStats() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeMetric, setActiveMetric] = useState<"visitors" | "pageviews">(
    "visitors",
  );
  const [stats, setStats] = useState<Stats>({
    today: 0,
    week: 0,
    month: 0,
    todayDelta: 0,
    weekDelta: 0,
    monthDelta: 0,
    todayTrend: [],
    weekTrend: [],
    monthTrend: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  // For animated counters
  const [displayStats, setDisplayStats] = useState({ today: 0, week: 0, month: 0 });
  const [displayPVs, setDisplayPVs] = useState({ today: 0, week: 0, month: 0 });
  const animRefsVisitors = useRef<{ [key: string]: NodeJS.Timeout | null }>({
    today: null,
    week: null,
    month: null,
  });
  const animRefsPV = useRef<{ [key: string]: NodeJS.Timeout | null }>({
    today: null,
    week: null,
    month: null,
  });

  const animateCount = useCallback((key: keyof typeof displayStats, to: number) => {
    if (animRefsVisitors.current[key]) {
      clearInterval(animRefsVisitors.current[key]!);
    }

    setDisplayStats((prev) => {
      const start = prev[key];
      let frame = 0;
      const duration = 600;
      const steps = 24;

      animRefsVisitors.current[key] = setInterval(() => {
        frame++;
        const value = Math.round(start + ((to - start) * frame) / steps);
        setDisplayStats((current) => ({
          ...current,
          [key]: value,
        }));
        if (frame >= steps) {
          setDisplayStats((current) => ({ ...current, [key]: to }));
          if (animRefsVisitors.current[key]) {
            clearInterval(animRefsVisitors.current[key]!);
            animRefsVisitors.current[key] = null;
          }
        }
      }, duration / steps);
      return prev;
    });
  }, []);

  const animateCountPV = useCallback((key: keyof typeof displayPVs, to: number) => {
    if (animRefsPV.current[key]) {
      clearInterval(animRefsPV.current[key]!);
    }

    setDisplayPVs((prev) => {
      const start = prev[key];
      let frame = 0;
      const duration = 600;
      const steps = 24;

      animRefsPV.current[key] = setInterval(() => {
        frame++;
        const value = Math.round(start + ((to - start) * frame) / steps);
        setDisplayPVs((current) => ({
          ...current,
          [key]: value,
        }));
        if (frame >= steps) {
          setDisplayPVs((current) => ({ ...current, [key]: to }));
          if (animRefsPV.current[key]) {
            clearInterval(animRefsPV.current[key]!);
            animRefsPV.current[key] = null;
          }
        }
      }, duration / steps);
      return prev;
    });
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        console.log("Stats fetched from API:", data);
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  }, []);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    await fetchStats();
    setIsLoading(false);
  }, [fetchStats]);

  useEffect(() => {
    setIsMounted(true);
    // Fetch stats on initial mount for first page load
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [isOpen, refetch]);

  // Refetch when switching between visitors and pageviews tabs
  useEffect(() => {
    if (isOpen) {
      refetch();
    }
  }, [activeMetric, isOpen, refetch]);

  // Animate on stats change
  useEffect(() => {
    console.log("useEffect triggered - stats:", { today: stats.today, week: stats.week, month: stats.month, displayStats });
    if (!isLoading) {
      console.log("Calling animateCount with:", { today: stats.today, week: stats.week, month: stats.month });
      animateCount("today", stats.today);
      animateCount("week", stats.week);
      animateCount("month", stats.month);
      if (stats.pageViews) {
        animateCountPV("today", stats.pageViews.today);
        animateCountPV("week", stats.pageViews.week);
        animateCountPV("month", stats.pageViews.month);
      }
    }
  }, [stats.today, stats.week, stats.month, isLoading, animateCount, animateCountPV, stats.pageViews]);

  const visitorsTotal = displayStats.month;
  const pageViewsTotal = displayPVs.month;
  const visitorsDelta = stats.monthDelta ?? 0;
  const pageViewsDelta = stats.monthDelta ?? 0;

  const visitorsTrend = stats.monthTrend ?? [];
  const pageViewsTrend = stats.monthPageviewTrend ?? [];

  // Build simple date labels for the last N days, ending today.
  const trendLength =
    visitorsTrend.length || pageViewsTrend.length || 0;
  const trendLabels =
    trendLength > 0
      ? Array.from({ length: trendLength }, (_, idx) => {
        const d = new Date();
        d.setDate(d.getDate() - (trendLength - 1 - idx));
        return d.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      })
      : [];

  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  // Use chart color variables so lines adapt between light/dark themes.
  const primaryLineColor =
    activeMetric === "visitors"
      ? "hsl(var(--chart-1))"
      : "hsl(var(--chart-4))";
  const secondaryLineColor =
    activeMetric === "visitors"
      ? "hsl(var(--chart-2))"
      : "hsl(var(--chart-5))";

  return (
    <>
      <Button
        size="icon"
        variant="ghost"
        title="View visit statistics"
        onClick={() => setIsOpen(true)}
      >
        <BarChart3 className="size-5" />
        <span className="sr-only">Visit Statistics</span>
      </Button>

      {isMounted && isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[2000]">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setIsOpen(false)}
            />

            <div
              role="dialog"
              aria-modal="true"
              className="fixed left-1/2 top-1/2 z-[2001] w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-border bg-background/95 text-foreground shadow-2xl dark:bg-slate-950/90 dark:text-slate-50"
              style={{
                borderRadius: 28,
                boxShadow: "0 20px 60px rgba(2,6,23,0.6)",
                backdropFilter: "blur(28px) saturate(1.15)",
                WebkitBackdropFilter: "blur(28px) saturate(1.15)",
              }}
            >
              {/* Glass gradient + inline SVG noise overlay (fallback-safe) */}
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 100%), url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="f"><feTurbulence baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23f)" opacity="0.04"/></svg>')`,
                  backgroundSize: "cover",
                  backgroundBlendMode: "overlay",
                  opacity: 1,
                }}
              />

              <div className="relative z-10 p-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-md text-foreground/70 hover:bg-foreground/10 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/30"
                >
                  <X className="size-4" />
                  <span className="sr-only">Close</span>
                </button>

                <div className="flex items-center justify-start gap-3">
                  <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground dark:text-white">
                    <BarChart3 className="size-5 text-[hsl(var(--chart-1))]" />
                    Visit Statistics
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={refetch}
                    disabled={isLoading}
                    title="Refresh stats"
                    className="size-8"
                  >
                    <RefreshCw
                      className={`size-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                  </Button>
                </div>

                {/* Top summary row as interactive buttons: Visitors / Page Views */}
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => {
                      refetch();
                      setActiveMetric("visitors");
                    }}
                    className={`rounded-2xl px-4 py-3 text-left shadow-sm transition-all ${activeMetric === "visitors"
                      ? "border border-border bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white shadow-[0_18px_40px_rgba(15,23,42,0.75)] dark:from-[hsl(var(--chart-1))] dark:via-[hsl(var(--chart-2))] dark:to-[hsl(var(--chart-3))]"
                      : "border border-blue-400/40 bg-gradient-to-r from-blue-400/15 via-cyan-400/10 to-teal-400/10 text-foreground/90 dark:border-[hsl(var(--chart-1))]/40 dark:bg-gradient-to-r dark:from-[hsl(var(--chart-1))]/20 dark:via-[hsl(var(--chart-2))]/15 dark:to-[hsl(var(--chart-3))]/15 dark:text-foreground hover:border-blue-400/60 hover:bg-gradient-to-r hover:from-blue-400/25 hover:via-cyan-400/20 hover:to-teal-400/20 dark:hover:border-[hsl(var(--chart-1))]/60 dark:hover:bg-gradient-to-r dark:hover:from-[hsl(var(--chart-1))]/25 dark:hover:via-[hsl(var(--chart-2))]/20 dark:hover:to-[hsl(var(--chart-3))]/20"
                      }`}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.16em] ${activeMetric === "visitors"
                        ? "text-white/75"
                        : "text-foreground/70"
                        }`}
                    >
                      Visitors
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-semibold leading-tight ${activeMetric === "visitors"
                          ? "text-white"
                          : "text-foreground"
                          }`}
                      >
                        {visitorsTotal.toLocaleString()}
                      </span>
                      {typeof visitorsDelta === "number" && visitorsDelta !== 0 && (
                        <StatDelta delta={visitorsDelta} />
                      )}
                    </div>
                    <div
                      className={`mt-1 text-xs ${activeMetric === "visitors"
                        ? "text-white/80"
                        : "text-foreground/70"
                        }`}
                    >
                      Unique visitors this month
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      refetch();
                      setActiveMetric("pageviews");
                    }}
                    className={`rounded-2xl px-4 py-3 text-left shadow-sm transition-all ${activeMetric === "pageviews"
                      ? "border border-border bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white shadow-[0_18px_40px_rgba(15,23,42,0.75)] dark:from-[hsl(var(--chart-4))] dark:via-[hsl(var(--chart-5))] dark:to-[hsl(var(--chart-1))]"
                      : "border border-amber-400/40 bg-gradient-to-r from-amber-400/15 via-orange-400/10 to-rose-400/10 text-foreground/90 dark:border-[hsl(var(--chart-4))]/40 dark:bg-gradient-to-r dark:from-[hsl(var(--chart-4))]/20 dark:via-[hsl(var(--chart-5))]/15 dark:to-[hsl(var(--chart-1))]/15 dark:text-foreground hover:border-amber-400/60 hover:bg-gradient-to-r hover:from-amber-400/25 hover:via-orange-400/20 hover:to-rose-400/20 dark:hover:border-[hsl(var(--chart-4))]/60 dark:hover:bg-gradient-to-r dark:hover:from-[hsl(var(--chart-4))]/25 dark:hover:via-[hsl(var(--chart-5))]/20 dark:hover:to-[hsl(var(--chart-1))]/20"
                      }`}
                  >
                    <div
                      className={`text-xs font-semibold uppercase tracking-[0.16em] ${activeMetric === "pageviews"
                        ? "text-white/75"
                        : "text-foreground/70"
                        }`}
                    >
                      Page Views
                    </div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-semibold leading-tight ${activeMetric === "pageviews"
                          ? "text-white"
                          : "text-foreground"
                          }`}
                      >
                        {pageViewsTotal.toLocaleString()}
                      </span>
                      {typeof pageViewsDelta === "number" && pageViewsDelta !== 0 && (
                        <StatDelta delta={pageViewsDelta} />
                      )}
                    </div>
                    <div
                      className={`mt-1 text-xs ${activeMetric === "pageviews"
                        ? "text-white/80"
                        : "text-foreground/70"
                        }`}
                    >
                      Page views this month
                    </div>
                  </button>
                </div>

                {/* Detail panel for the active metric: line graph + numeric trends */}
                <div className="mt-6 rounded-2xl border border-border bg-gradient-to-br from-white/85 via-white/80 to-slate-100 px-4 py-4 text-slate-900 dark:from-slate-900/80 dark:via-slate-900/70 dark:to-slate-800/80 dark:text-slate-50">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-[0.16em] text-foreground/70 dark:text-white/60">
                        {activeMetric === "visitors" ? "Visitors" : "Page Views"} ·
                        Last 30 days
                      </div>
                      <div className="mt-2 flex items-baseline gap-2 text-2xl font-semibold">
                        <span>
                          {activePointIndex !== null
                            ? (activeMetric === "visitors"
                              ? visitorsTrend[activePointIndex]?.toLocaleString()
                              : pageViewsTrend[activePointIndex]?.toLocaleString())
                            : (activeMetric === "visitors"
                              ? visitorsTotal.toLocaleString()
                              : pageViewsTotal.toLocaleString())}
                        </span>
                        {activePointIndex !== null &&
                          trendLabels[activePointIndex] && (
                            <span className="rounded-full bg-foreground/10 dark:bg-white/15 px-2 py-0.5 text-xs font-medium text-foreground dark:text-white/85">
                              {trendLabels[activePointIndex]}
                            </span>
                          )}
                      </div>
                    </div>

                    {(activeMetric === "visitors"
                      ? visitorsTrend.length > 1
                      : pageViewsTrend.length > 1) && (
                        <div className="sm:w-1/2">
                          <Sparkline
                            data={
                              activeMetric === "visitors"
                                ? visitorsTrend
                                : pageViewsTrend
                            }
                            width={200}
                            height={60}
                            color={primaryLineColor}
                            color2={secondaryLineColor}
                            interactive
                            onActiveIndexChange={setActivePointIndex}
                          />
                        </div>
                      )}
                  </div>

                  {/* Today / This week / This month numbers */}
                  <div className="mt-4 grid grid-cols-1 gap-3 text-xs text-foreground/85 dark:text-white/85 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-card/95 p-3 shadow-sm dark:bg-slate-900/80">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-300/80">
                        Today
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-base font-semibold">
                          {(
                            activeMetric === "visitors"
                              ? displayStats.today
                              : displayPVs.today
                          ).toLocaleString()}
                        </span>
                        {typeof stats.todayDelta === "number" &&
                          stats.todayDelta !== 0 && (
                            <StatDelta delta={stats.todayDelta} />
                          )}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card/95 p-3 shadow-sm dark:bg-slate-900/80">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-300/80">
                        This Week
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-base font-semibold">
                          {(
                            activeMetric === "visitors"
                              ? displayStats.week
                              : displayPVs.week
                          ).toLocaleString()}
                        </span>
                        {typeof stats.weekDelta === "number" &&
                          stats.weekDelta !== 0 && (
                            <StatDelta delta={stats.weekDelta} />
                          )}
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-card/95 p-3 shadow-sm dark:bg-slate-900/80">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-300/80">
                        This Month
                      </div>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-base font-semibold">
                          {(
                            activeMetric === "visitors"
                              ? displayStats.month
                              : displayPVs.month
                          ).toLocaleString()}
                        </span>
                        {typeof stats.monthDelta === "number" &&
                          stats.monthDelta !== 0 && (
                            <StatDelta delta={stats.monthDelta} />
                          )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border-t border-foreground/10 dark:border-white/10 pt-4">
                  <p className="flex items-center justify-center gap-1 text-xs text-foreground/70 dark:text-white/70">
                    Powered by
                    <span className="ml-1 inline-block opacity-90">
                      <Image
                        src="/img/vercel-logomark.svg"
                        alt="Vercel"
                        width={16}
                        height={16}
                        priority
                        className="inline"
                      />
                    </span>
                    <a
                      href="https://vercel.com/analytics"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-foreground dark:text-white hover:underline"
                    >
                      Vercel Analytics
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
