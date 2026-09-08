import { NextRequest, NextResponse } from "next/server";

export const revalidate = 0;

const NO_STORE_CACHE_CONTROL = "no-store, no-cache, max-age=0, must-revalidate";

interface UnifiedTimeSeriesEntry {
  key: string;
  visitors: number;
  pageviews: number;
}

function createEmptyStats() {
  return {
    today: 0,
    week: 0,
    month: 0,
    pageViews: {
      today: 0,
      week: 0,
      month: 0,
    },
    todayDelta: 0,
    weekDelta: 0,
    monthDelta: 0,
    todayTrend: [0],
    todayPageviewTrend: [0],
    weekTrend: [0],
    weekPageviewTrend: [0],
    monthTrend: [0],
    monthPageviewTrend: [0],
  };
}

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!apiToken || !projectId) {
      console.warn("[Stats API] Missing VERCEL_API_TOKEN or VERCEL_PROJECT_ID. Returning default zeroed stats.");
      return NextResponse.json(createEmptyStats(), {
        headers: { "Cache-Control": NO_STORE_CACHE_CONTROL },
      });
    }

    const headers = {
      Authorization: `Bearer ${apiToken}`,
    };

    // Calculate date ranges (last 30 days)
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fromDate = last30Days.toISOString().split("T")[0];
    const toDate = now.toISOString().split("T")[0];

    // Primary target: official Vercel Web Analytics visits aggregate endpoint
    const aggregateUrl = new URL("https://api.vercel.com/v1/query/web-analytics/visits/aggregate");
    aggregateUrl.searchParams.set("projectId", projectId);
    if (teamId) aggregateUrl.searchParams.set("teamId", teamId);
    aggregateUrl.searchParams.set("since", fromDate);
    aggregateUrl.searchParams.set("until", toDate);
    aggregateUrl.searchParams.set("by", "day");

    let response = await fetch(aggregateUrl.toString(), {
      headers,
      cache: "no-store",
    });

    // If aggregate endpoint returns 404, attempt fallback to legacy api.vercel.com endpoint
    if (!response.ok && response.status === 404) {
      console.warn("[Stats API] v1/query endpoint returned 404, trying timeseries fallback...");
      const fallbackUrl = new URL("https://api.vercel.com/v1/web-analytics/timeseries");
      fallbackUrl.searchParams.set("projectId", projectId);
      if (teamId) fallbackUrl.searchParams.set("teamId", teamId);
      fallbackUrl.searchParams.set("from", last30Days.toISOString());
      fallbackUrl.searchParams.set("to", now.toISOString());
      fallbackUrl.searchParams.set("environment", "production");
      fallbackUrl.searchParams.set("tz", "Asia/Calcutta");

      const fallbackRes = await fetch(fallbackUrl.toString(), {
        headers,
        cache: "no-store",
      });

      if (fallbackRes.ok) {
        response = fallbackRes;
      }
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      console.error(`[Stats API] Vercel API returned status ${response.status}: ${errorText.slice(0, 300)}`);
      // Return safe defaults so client UI doesn't crash
      return NextResponse.json(createEmptyStats(), {
        headers: { "Cache-Control": NO_STORE_CACHE_CONTROL },
      });
    }

    const json = await response.json();
    const entries: UnifiedTimeSeriesEntry[] = [];

    // Parse format 1: { data: [ { timestamp, pageviews, visitors } ] }
    if (Array.isArray(json?.data)) {
      for (const item of json.data) {
        const rawDate = item.timestamp || item.date || item.key || "";
        const key = rawDate.includes("T") ? rawDate.split("T")[0] : rawDate;
        entries.push({
          key,
          visitors: Number(item.visitors || item.devices || 0),
          pageviews: Number(item.pageviews || item.total || 0),
        });
      }
    }
    // Parse format 2: { data: { groups: { all: [ { key, devices, total } ] } } }
    else if (Array.isArray(json?.data?.groups?.all)) {
      for (const item of json.data.groups.all) {
        entries.push({
          key: String(item.key || ""),
          visitors: Number(item.devices || item.visitors || 0),
          pageviews: Number(item.total || item.pageviews || 0),
        });
      }
    }

    // Sort entries chronologically by date
    entries.sort((a, b) => a.key.localeCompare(b.key));

    const todayStr = now.toISOString().split("T")[0];
    const todayEntry = entries.find((e) => e.key === todayStr);

    const visitorsToday = todayEntry?.visitors || 0;
    const pageViewsToday = todayEntry?.pageviews || 0;

    // Week metrics (last 7 entries)
    const weekEntries = entries.slice(-7);
    const visitorsWeek = weekEntries.reduce((sum, e) => sum + e.visitors, 0);
    const pageViewsWeek = weekEntries.reduce((sum, e) => sum + e.pageviews, 0);

    // Month metrics (all entries)
    const visitorsMonth = entries.reduce((sum, e) => sum + e.visitors, 0);
    const pageViewsMonth = entries.reduce((sum, e) => sum + e.pageviews, 0);

    // Trends
    const todayTrend = [visitorsToday];
    const todayPageviewTrend = [pageViewsToday];
    const weekTrend = weekEntries.map((e) => e.visitors);
    const weekPageviewTrend = weekEntries.map((e) => e.pageviews);
    const monthTrend = entries.map((e) => e.visitors);
    const monthPageviewTrend = entries.map((e) => e.pageviews);

    // Delta calculation
    const previousDayEntry = weekEntries.length > 1 ? weekEntries[weekEntries.length - 2] : null;
    const prevDayVisitors = previousDayEntry?.visitors || 0;
    const todayDelta =
      prevDayVisitors > 0
        ? Math.round(((visitorsToday - prevDayVisitors) / prevDayVisitors) * 100)
        : 0;

    const previousWeekVisitors =
      entries.length >= 14
        ? entries.slice(-14, -7).reduce((sum, e) => sum + e.visitors, 0)
        : 0;
    const weekDelta =
      previousWeekVisitors > 0
        ? Math.round(((visitorsWeek - previousWeekVisitors) / previousWeekVisitors) * 100)
        : 0;

    const stats = {
      today: visitorsToday,
      week: visitorsWeek,
      month: visitorsMonth,
      pageViews: {
        today: pageViewsToday,
        week: pageViewsWeek,
        month: pageViewsMonth,
      },
      todayDelta,
      weekDelta,
      monthDelta: 0,
      todayTrend: todayTrend.length > 0 ? todayTrend : [0],
      todayPageviewTrend: todayPageviewTrend.length > 0 ? todayPageviewTrend : [0],
      weekTrend: weekTrend.length > 0 ? weekTrend : [0],
      weekPageviewTrend: weekPageviewTrend.length > 0 ? weekPageviewTrend : [0],
      monthTrend: monthTrend.length > 0 ? monthTrend : [0],
      monthPageviewTrend: monthPageviewTrend.length > 0 ? monthPageviewTrend : [0],
    };

    return NextResponse.json(stats, {
      headers: {
        "Cache-Control": NO_STORE_CACHE_CONTROL,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Stats API Error]:", errorMessage);

    // Return safe zeroed stats rather than throwing 500 error to keep the dashboard intact
    return NextResponse.json(createEmptyStats(), {
      headers: {
        "Cache-Control": NO_STORE_CACHE_CONTROL,
      },
    });
  }
}
