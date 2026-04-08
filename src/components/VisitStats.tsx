"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { BarChart3, Clock3, Eye, RefreshCw, Users, X } from "lucide-react";

import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { cn } from "@/lib/utils";

import { Button } from "./ui/Button";
import Sparkline from "./ui/Sparkline";
import StatDelta from "./ui/StatDelta";

interface Stats {
  today: number;
  week: number;
  month: number;
  todayDelta?: number;
  weekDelta?: number;
  monthDelta?: number;
  pageViewsDelta?: number;
  todayTrend?: number[];
  weekTrend?: number[];
  monthTrend?: number[];
  pageViews?: {
    today: number;
    week: number;
    month: number;
  };
  todayPageviewTrend?: number[];
  weekPageviewTrend?: number[];
  monthPageviewTrend?: number[];
}

type MetricKey = "visitors" | "pageviews";

function sumSeries(values?: number[]) {
  return (values ?? []).reduce((sum, value) => sum + value, 0);
}

function calculateDelta(current: number, previous: number) {
  if (previous <= 0) return 0;
  return Math.round(((current - previous) / previous) * 100);
}

function formatRelativeRefresh(lastFetchedAt: number | null) {
  if (!lastFetchedAt) return "Syncing";

  const elapsedMs = Date.now() - lastFetchedAt;
  const elapsedMinutes = Math.floor(elapsedMs / 60000);

  if (elapsedMinutes <= 0) return "Just now";
  if (elapsedMinutes === 1) return "1m ago";
  if (elapsedMinutes < 60) return `${elapsedMinutes}m ago`;

  return new Date(lastFetchedAt).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function VisitStats() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricKey>("visitors");
  const [isLoading, setIsLoading] = useState(false);
  const [lastFetchedAt, setLastFetchedAt] = useState<number | null>(null);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
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
    pageViews: {
      today: 0,
      week: 0,
      month: 0,
    },
    todayPageviewTrend: [],
    weekPageviewTrend: [],
    monthPageviewTrend: [],
  });

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stats", {
        cache: "no-store",
      });

      if (!response.ok) {
        console.error("Failed to fetch stats:", response.status);
        return;
      }

      const data = (await response.json()) as Stats;
      setStats(data);
      setLastFetchedAt(Date.now());
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsMounted(true);
    void fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    if (!isOpen) return;

    const isStale = !lastFetchedAt || Date.now() - lastFetchedAt > 2 * 60 * 1000;
    if (isStale) {
      void fetchStats();
    }
  }, [fetchStats, isOpen, lastFetchedAt]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    setActivePointIndex(null);
  }, [activeMetric]);

  const visitorsToday = stats.today > 0 ? stats.today : (stats.monthTrend ?? []).at(-1) ?? 0;
  const visitorsWeek = stats.week > 0 ? stats.week : sumSeries(stats.weekTrend);
  const visitorsMonth = stats.month > 0 ? stats.month : sumSeries(stats.monthTrend);

  const pageViewsToday =
    (stats.pageViews?.today ?? 0) > 0
      ? stats.pageViews?.today ?? 0
      : (stats.monthPageviewTrend ?? []).at(-1) ?? 0;
  const pageViewsWeek =
    (stats.pageViews?.week ?? 0) > 0
      ? stats.pageViews?.week ?? 0
      : sumSeries(stats.weekPageviewTrend);
  const pageViewsMonth =
    (stats.pageViews?.month ?? 0) > 0
      ? stats.pageViews?.month ?? 0
      : sumSeries(stats.monthPageviewTrend);

  const visitorsTrend = stats.monthTrend ?? [];
  const pageViewsTrend = stats.monthPageviewTrend ?? [];
  const trendLength = visitorsTrend.length || pageViewsTrend.length || 0;
  const trendLabels =
    trendLength > 0
      ? Array.from({ length: trendLength }, (_, index) => {
          const date = new Date();
          date.setDate(date.getDate() - (trendLength - 1 - index));
          return date.toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
        })
      : [];

  const previousVisitorsDay = visitorsTrend.at(-2) ?? 0;
  const previousPageViewsDay = pageViewsTrend.at(-2) ?? 0;
  const previousVisitorsWeek = sumSeries(visitorsTrend.slice(-14, -7));
  const previousPageViewsWeek = sumSeries(pageViewsTrend.slice(-14, -7));

  const metrics = {
    visitors: {
      label: "Visitors",
      icon: Users,
      accentBorder: "border-cyan-400/30",
      accentBackground:
        "bg-[linear-gradient(135deg,rgba(37,99,235,0.24),rgba(34,211,238,0.18),rgba(16,185,129,0.14))]",
      accentText: "text-cyan-100",
      chartColor: "hsl(var(--chart-1))",
      total: visitorsMonth,
      trend: visitorsTrend,
      delta: stats.monthDelta ?? 0,
      today: visitorsToday,
      week: visitorsWeek,
      month: visitorsMonth,
      todayDelta: stats.todayDelta ?? calculateDelta(visitorsToday, previousVisitorsDay),
      weekDelta: stats.weekDelta ?? calculateDelta(visitorsWeek, previousVisitorsWeek),
      monthDelta: stats.monthDelta ?? 0,
      short: "UV",
    },
    pageviews: {
      label: "Page Views",
      icon: Eye,
      accentBorder: "border-amber-400/30",
      accentBackground:
        "bg-[linear-gradient(135deg,rgba(251,191,36,0.2),rgba(249,115,22,0.16),rgba(244,63,94,0.12))]",
      accentText: "text-amber-50",
      chartColor: "hsl(var(--chart-4))",
      total: pageViewsMonth,
      trend: pageViewsTrend,
      delta: stats.pageViewsDelta ?? 0,
      today: pageViewsToday,
      week: pageViewsWeek,
      month: pageViewsMonth,
      todayDelta: calculateDelta(pageViewsToday, previousPageViewsDay),
      weekDelta: calculateDelta(pageViewsWeek, previousPageViewsWeek),
      monthDelta: stats.pageViewsDelta ?? 0,
      short: "PV",
    },
  } as const;

  const active = metrics[activeMetric];
  const comparisonMetric = activeMetric === "visitors" ? metrics.pageviews : metrics.visitors;
  const peakIndex = active.trend.reduce((bestIndex, value, index, values) => {
    return value > (values[bestIndex] ?? 0) ? index : bestIndex;
  }, 0);
  const highlightedIndex =
    activePointIndex !== null && active.trend[activePointIndex] !== undefined
      ? activePointIndex
      : null;
  const highlightedValue =
    highlightedIndex !== null ? active.trend[highlightedIndex] ?? active.total : active.total;
  const highlightedLabel =
    highlightedIndex !== null ? trendLabels[highlightedIndex] ?? "30D" : "Last 30 Days";
  const averagePerDay = active.trend.length > 0 ? Math.round(active.total / active.trend.length) : 0;
  const peakLabel = trendLabels[peakIndex] ?? "N/A";
  const peakValue = active.trend[peakIndex] ?? 0;
  const lastUpdatedText = formatRelativeRefresh(lastFetchedAt);
  const activeTodayTrend =
    activeMetric === "visitors"
      ? [previousVisitorsDay, visitorsToday]
      : [previousPageViewsDay, pageViewsToday];
  const activeWeekTrend =
    activeMetric === "visitors" ? stats.weekTrend ?? [] : stats.weekPageviewTrend ?? [];
  const comparisonTrend =
    comparisonMetric.trend.length === active.trend.length ? comparisonMetric.trend : undefined;
  const activityBars = active.trend.slice(-20);
  const maxBarValue = Math.max(...activityBars, 1);

  const rangeCards = [
    {
      label: "1D",
      value: active.today,
      delta: active.todayDelta,
      trend: activeTodayTrend,
    },
    {
      label: "7D",
      value: active.week,
      delta: active.weekDelta,
      trend: activeWeekTrend,
    },
    {
      label: "30D",
      value: active.month,
      delta: active.monthDelta,
      trend: active.trend,
    },
  ];

  return (
    <>
      <Button
        variant="ghost"
        title="View visit statistics"
        aria-label="View visit statistics"
        onClick={() => setIsOpen(true)}
        className="group relative h-11 overflow-hidden rounded-full border border-border/60 bg-background/70 px-2.5 text-muted-foreground shadow-[0_14px_40px_rgba(15,23,42,0.08)] backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-border hover:bg-card/85 hover:text-foreground sm:px-3"
      >
        <span className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.14),transparent_45%),radial-gradient(circle_at_right,rgba(245,158,11,0.12),transparent_40%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <span className="relative inline-flex size-8 items-center justify-center rounded-full border border-foreground/10 bg-foreground text-background shadow-sm transition-transform duration-300 group-hover:scale-105">
          <BarChart3 className="size-4" />
        </span>
        <span className="relative hidden flex-col items-start leading-none sm:flex">
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Stats
          </span>
          <span className="text-sm font-semibold text-foreground">Visitors</span>
        </span>
        <span className="relative hidden min-w-20 items-center justify-center rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-foreground md:inline-flex">
          {visitorsMonth.toLocaleString()}
        </span>
      </Button>

      {isMounted && isOpen
        ? createPortal(
            <div className="fixed inset-0 z-[2000]">
              <button
                type="button"
                aria-label="Close visit statistics"
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={() => setIsOpen(false)}
              />

              <div className="fixed bottom-4 left-1/2 z-[2001] w-[min(calc(100vw-1.25rem),34rem)] -translate-x-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(1040px,calc(100vw-2rem))] sm:-translate-y-1/2">
                <div className="relative flex max-h-[68svh] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-[#07111f]/95 text-white shadow-[0_40px_160px_rgba(2,6,23,0.78)] sm:max-h-[min(88vh,860px)] sm:rounded-[34px]">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.26),transparent_32%),radial-gradient(circle_at_85%_18%,rgba(34,211,238,0.18),transparent_30%),radial-gradient(circle_at_80%_88%,rgba(251,191,36,0.16),transparent_28%)]" />
                  <div
                    className="pointer-events-none absolute inset-0 opacity-[0.08]"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)",
                      backgroundSize: "72px 72px",
                    }}
                  />

                  <div className="relative min-h-0 flex-1 overflow-y-auto">
                    <div className="flex justify-center pt-3 sm:hidden">
                      <span className="h-1 w-14 rounded-full bg-white/15" />
                    </div>

                    <div className="sticky top-0 z-10 border-b border-white/10 bg-[#07111f]/72 px-3 pb-3 pt-3 backdrop-blur-xl sm:px-6 sm:pb-5 sm:pt-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-emerald-100/90">
                              <span
                                className={cn(
                                  "size-2 rounded-full bg-emerald-300",
                                  prefersReducedMotion ? "" : "animate-pulse",
                                )}
                              />
                              Live
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                              30D
                            </span>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                              {lastUpdatedText}
                            </span>
                          </div>
                          <h2 className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-3xl">
                            Visitor Stats
                          </h2>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => void fetchStats()}
                            disabled={isLoading}
                            title="Refresh stats"
                            className="size-10 rounded-full border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                          >
                            <RefreshCw
                              className={cn(
                                "size-4",
                                isLoading && !prefersReducedMotion ? "animate-spin" : "",
                              )}
                            />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(false)}
                            title="Close"
                            className="size-10 rounded-full border border-white/10 bg-white/5 text-white/75 hover:bg-white/10 hover:text-white"
                          >
                            <X className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-3 p-3 sm:gap-4 sm:p-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                      <section className="grid gap-4">
                        <div className="grid grid-cols-2 gap-3">
                          {(Object.entries(metrics) as Array<[MetricKey, typeof metrics.visitors]>).map(
                            ([key, metric]) => {
                              const Icon = metric.icon;
                              const isActive = key === activeMetric;

                              return (
                                <button
                                  key={key}
                                  type="button"
                                  aria-pressed={isActive}
                                  onClick={() => setActiveMetric(key)}
                                  className={cn(
                                    "group relative overflow-hidden rounded-[22px] border px-3 py-3.5 text-left transition-all duration-300 sm:rounded-[24px] sm:px-4 sm:py-4",
                                    isActive
                                      ? cn(
                                          "shadow-[0_20px_55px_rgba(2,6,23,0.35)]",
                                          metric.accentBorder,
                                          metric.accentBackground,
                                        )
                                      : "border-white/10 bg-white/[0.035] hover:border-white/20 hover:bg-white/[0.06]",
                                  )}
                                >
                                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),transparent_55%)] opacity-60" />
                                  <div className="relative flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={cn(
                                            "inline-flex size-8 items-center justify-center rounded-2xl border sm:size-9",
                                            isActive
                                              ? "border-white/15 bg-white/10 text-white"
                                              : "border-white/10 bg-white/[0.05] text-white/70",
                                          )}
                                        >
                                          <Icon className="size-4" />
                                        </span>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/62 sm:text-[11px] sm:tracking-[0.24em]">
                                          {metric.label}
                                        </p>
                                      </div>

                                      <div className="mt-4 flex items-end gap-2 sm:mt-5">
                                        <span
                                          className={cn(
                                            "text-2xl font-semibold tracking-tight sm:text-4xl",
                                            isActive ? metric.accentText : "text-white/92",
                                          )}
                                        >
                                          {metric.total.toLocaleString()}
                                        </span>
                                        {metric.delta !== 0 ? <StatDelta delta={metric.delta} /> : null}
                                      </div>
                                    </div>

                                    <span className="rounded-full border border-white/10 bg-white/[0.06] px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white/60 sm:px-2.5 sm:text-[10px] sm:tracking-[0.22em]">
                                      {metric.short}
                                    </span>
                                  </div>

                                  <div className="relative mt-3 rounded-[18px] border border-white/8 bg-slate-950/25 p-2.5 sm:mt-4 sm:p-3">
                                    <Sparkline
                                      data={metric.trend.length > 1 ? metric.trend : [0, metric.total]}
                                      width={280}
                                      height={56}
                                      className="h-10 w-full sm:h-14"
                                      color={metric.chartColor}
                                      showArea
                                    />
                                  </div>
                                </button>
                              );
                            },
                          )}
                        </div>

                        <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-5">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/58">
                                  {active.label}
                                </span>
                                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
                                  {highlightedLabel}
                                </span>
                              </div>
                              <div className="mt-4 flex flex-wrap items-end gap-3">
                                <h3 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                                  {highlightedValue.toLocaleString()}
                                </h3>
                                {active.delta !== 0 ? <StatDelta delta={active.delta} /> : null}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
                              <div className="rounded-[20px] border border-white/10 bg-slate-950/35 px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                  Avg
                                </p>
                                <p className="mt-2 text-xl font-semibold text-white">
                                  {averagePerDay.toLocaleString()}
                                </p>
                              </div>
                              <div className="rounded-[20px] border border-white/10 bg-slate-950/35 px-4 py-3">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                  Peak
                                </p>
                                <p className="mt-2 text-xl font-semibold text-white">
                                  {peakValue.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>

                          {active.trend.length > 1 ? (
                            <div className="mt-5 rounded-[24px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] p-3 sm:p-4">
                              <Sparkline
                                data={active.trend}
                                data2={comparisonTrend}
                                width={680}
                                height={160}
                                className="h-28 w-full sm:h-44"
                                color={active.chartColor}
                                color2="rgba(255,255,255,0.24)"
                                showArea
                                interactive
                                onActiveIndexChange={setActivePointIndex}
                              />
                            </div>
                          ) : (
                            <div className="mt-5 rounded-[24px] border border-dashed border-white/10 bg-slate-950/35 px-4 py-8 text-center text-sm text-slate-300/65">
                              Waiting for more data
                            </div>
                          )}

                          {activityBars.length > 0 ? (
                            <div className="mt-4 hidden rounded-[22px] border border-white/10 bg-slate-950/28 px-3 py-4 sm:block sm:px-4">
                              <div className="flex h-14 items-end gap-1.5">
                                {activityBars.map((value, index) => {
                                  const height = `${Math.max((value / maxBarValue) * 100, 10)}%`;
                                  const isSelected =
                                    highlightedIndex !== null &&
                                    highlightedIndex === active.trend.length - activityBars.length + index;

                                  return (
                                    <span
                                      key={`${index}-${value}`}
                                      className={cn(
                                        "flex-1 rounded-full bg-white/14 transition-all duration-300",
                                        isSelected ? "opacity-100" : "opacity-60",
                                      )}
                                      style={{
                                        height,
                                        background: isSelected
                                          ? `linear-gradient(180deg, ${active.chartColor}, rgba(255,255,255,0.22))`
                                          : undefined,
                                      }}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                        </section>
                      </section>

                      <aside className="grid gap-3 sm:gap-4">
                        <section className="grid grid-cols-2 gap-3 min-[430px]:grid-cols-3 xl:grid-cols-1">
                          {rangeCards.map((card) => (
                            <div
                              key={card.label}
                              className="rounded-[22px] border border-white/10 bg-white/[0.04] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:p-4"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-white/45 sm:text-[10px] sm:tracking-[0.22em]">
                                  {card.label}
                                </p>
                                {card.delta !== 0 ? <StatDelta delta={card.delta} /> : null}
                              </div>
                              <p className="mt-3 text-xl font-semibold tracking-tight text-white sm:text-3xl">
                                {card.value.toLocaleString()}
                              </p>
                              <div className="mt-3 hidden rounded-[18px] border border-white/8 bg-slate-950/25 p-2 sm:mt-4 sm:block sm:p-3">
                                <Sparkline
                                  data={card.trend.length > 1 ? card.trend : [0, card.value]}
                                  width={220}
                                  height={44}
                                  className="h-8 w-full sm:h-11"
                                  color={active.chartColor}
                                  showArea
                                />
                              </div>
                            </div>
                          ))}
                        </section>

                        <section className="hidden rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-md sm:block">
                          <div className="flex items-start justify-between gap-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                                <span
                                  className="size-2 rounded-full"
                                  style={{ backgroundColor: active.chartColor }}
                                />
                                {active.label}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                <span className="size-2 rounded-full bg-white/45" />
                                {comparisonMetric.label}
                              </div>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                              <Clock3 className="size-3.5" />
                              {lastUpdatedText}
                            </span>
                          </div>

                          <div className="mt-4 rounded-[24px] border border-white/10 bg-slate-950/35 p-4">
                            <Sparkline
                              data={active.trend.length > 1 ? active.trend : [0, active.total]}
                              data2={
                                comparisonTrend && comparisonTrend.length > 1
                                  ? comparisonTrend
                                  : undefined
                              }
                              width={260}
                              height={88}
                              className="h-24 w-full"
                              color={active.chartColor}
                              color2="rgba(255,255,255,0.34)"
                              showArea
                            />
                          </div>

                          <div className="mt-4 grid grid-cols-3 gap-3">
                            <div className="rounded-[20px] border border-white/10 bg-slate-950/35 px-3 py-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                Peak
                              </p>
                              <p className="mt-2 text-lg font-semibold text-white">
                                {peakValue.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-white/42">{peakLabel}</p>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-slate-950/35 px-3 py-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                Avg
                              </p>
                              <p className="mt-2 text-lg font-semibold text-white">
                                {averagePerDay.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-white/42">per day</p>
                            </div>
                            <div className="rounded-[20px] border border-white/10 bg-slate-950/35 px-3 py-3">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/42">
                                Live
                              </p>
                              <p className="mt-2 text-lg font-semibold text-white">
                                {active.total.toLocaleString()}
                              </p>
                              <p className="mt-1 text-[11px] text-white/42">{active.short}</p>
                            </div>
                          </div>
                        </section>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
