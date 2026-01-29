import { NextRequest, NextResponse } from "next/server";

interface VercelTimeSeriesEntry {
  key: string;
  total?: number;
  devices?: number;
  bounceRate?: number;
}

interface VercelAnalyticsResponse {
  data: {
    groups: {
      all: VercelTimeSeriesEntry[];
    };
    groupCount: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.VERCEL_API_TOKEN;
    const projectId = process.env.VERCEL_PROJECT_ID;
    const teamId = process.env.VERCEL_TEAM_ID;

    if (!apiToken || !projectId) {
      console.error("Missing environment variables:", {
        apiToken: !!apiToken,
        projectId: !!projectId,
        teamId: !!teamId,
      });
      return NextResponse.json(
        { error: "Missing VERCEL_API_TOKEN or VERCEL_PROJECT_ID" },
        { status: 400 }
      );
    }

    const headers = {
      Authorization: `Bearer ${apiToken}`,
    };

    // Calculate date ranges
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Format dates for API (ISO format)
    const fromDate = last30Days.toISOString();
    const toDate = now.toISOString();

    console.log("Fetching Vercel analytics:", {
      projectId,
      teamId,
      from: fromDate,
      to: toDate,
      tokenProvided: !!apiToken,
    });

    // Build URL with query parameters
    const timeseriesUrl = new URL("https://vercel.com/api/web-analytics/timeseries");
    timeseriesUrl.searchParams.set("projectId", projectId);
    if (teamId) {
      timeseriesUrl.searchParams.set("teamId", teamId);
    }
    timeseriesUrl.searchParams.set("from", fromDate);
    timeseriesUrl.searchParams.set("to", toDate);
    timeseriesUrl.searchParams.set("environment", "production");
    timeseriesUrl.searchParams.set("filter", "{}");

    console.log("Request URL:", timeseriesUrl.toString());

    // Fetch data from Vercel API
    const response = await fetch(timeseriesUrl.toString(), { headers });

    console.log("Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", {
        status: response.status,
        body: errorText.substring(0, 500),
      });
      throw new Error(`Vercel API error: ${response.status} - ${errorText}`);
    }

    const data = (await response.json()) as VercelAnalyticsResponse;
    console.log("API response received, groups count:", data.data?.groups?.all?.length || 0);

    // Parse the analytics entries
    const entries: VercelTimeSeriesEntry[] = data.data?.groups?.all || [];

    if (!Array.isArray(entries)) {
      throw new Error("Invalid response format: expected array in data.groups.all");
    }

    console.log("Total entries:", entries.length);
    if (entries.length > 0) {
      console.log("First entry:", entries[0]);
      console.log("Last entry:", entries[entries.length - 1]);
    }

    // Calculate today's date string (YYYY-MM-DD)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayDateStr = today.toISOString().split("T")[0];

    console.log("Today date string:", todayDateStr);

    // Get today's data - use the last entry as today (most recent data)
    const todayEntry = entries[entries.length - 1];
    const visitorsToday = todayEntry?.devices || 0; // devices = unique visitors
    const pageViewsToday = todayEntry?.total || 0; // total = page views

    console.log("Today entry:", todayEntry, "Visitors today:", visitorsToday, "Page views:", pageViewsToday);

    // Get week data (last 7 days) - use the last 7 entries as week
    const weekEntries = entries.slice(-7);
    const visitorsWeek = weekEntries.reduce((sum, entry) => sum + (entry.devices || 0), 0);
    const pageViewsWeek = weekEntries.reduce((sum, entry) => sum + (entry.total || 0), 0);

    console.log("Week entries count:", weekEntries.length, "Visitors week:", visitorsWeek, "Page views:", pageViewsWeek);

    // Get month data (all entries)
    const visitorsMonth = entries.reduce((sum, entry) => sum + (entry.devices || 0), 0);
    const pageViewsMonth = entries.reduce((sum, entry) => sum + (entry.total || 0), 0);

    console.log("Month entries count:", entries.length, "Visitors month:", visitorsMonth, "Page views:", pageViewsMonth);

    console.log("Calculated totals:", {
      today: visitorsToday,
      todayPageViews: pageViewsToday,
      week: visitorsWeek,
      weekPageViews: pageViewsWeek,
      month: visitorsMonth,
      monthPageViews: pageViewsMonth,
      todayEntry,
      weekEntriesCount: weekEntries.length,
      allEntriesCount: entries.length,
    });

    // Create trend arrays - visitors = devices, pageviews = total
    const todayTrend = [visitorsToday];
    const todayPageviewTrend = [pageViewsToday];
    const weekTrend = weekEntries.map((e) => e.devices || 0);
    const weekPageviewTrend = weekEntries.map((e) => e.total || 0);
    const monthTrend = entries.map((e) => e.devices || 0);
    const monthPageviewTrend = entries.map((e) => e.total || 0);

    // Calculate deltas
    const todayDelta =
      weekEntries.length > 1 && weekEntries[weekEntries.length - 2]?.devices
        ? Math.round(
            (((visitorsToday - weekEntries[weekEntries.length - 2].devices) / 
              weekEntries[weekEntries.length - 2].devices) * 100)
          )
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
      weekDelta: 0,
      monthDelta: 0,
      todayTrend: todayTrend.length > 0 ? todayTrend : [0],
      todayPageviewTrend: todayPageviewTrend.length > 0 ? todayPageviewTrend : [0],
      weekTrend: weekTrend.length > 0 ? weekTrend : [0],
      weekPageviewTrend: weekPageviewTrend.length > 0 ? weekPageviewTrend : [0],
      monthTrend: monthTrend.length > 0 ? monthTrend : [0],
      monthPageviewTrend: monthPageviewTrend.length > 0 ? monthPageviewTrend : [0],
    };

    console.log("Returning stats:", stats);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching stats:", error);
    const errorMessage =
      error instanceof Error ? error.message : String(error);
    console.error("Error details:", errorMessage);

    return NextResponse.json(
      {
        error: "Failed to fetch statistics",
        details: errorMessage,
      },
      { status: 500 }
    );
  }
}
