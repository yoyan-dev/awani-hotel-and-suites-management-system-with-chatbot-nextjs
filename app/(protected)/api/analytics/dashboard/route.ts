import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, DashboardSummaryResponse } from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getDashboardAnalytics,
  getEmptyDashboardAnalyticsResponse,
} from "@/services/api/analytics/dashboard";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<DashboardSummaryResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const result = await getDashboardAnalytics({
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
    });

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch dashboard summary";

    return generateAnalyticsResponse(
      false,
      getEmptyDashboardAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
