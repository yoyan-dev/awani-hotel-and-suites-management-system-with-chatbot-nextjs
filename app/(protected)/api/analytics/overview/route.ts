import { NextRequest, NextResponse } from "next/server";
import { ApiResponse, BookingOverviewResponse } from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getEmptyOverviewAnalyticsResponse,
  getOverviewAnalytics,
} from "@/services/api/analytics/overview";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<BookingOverviewResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const result = await getOverviewAnalytics({
      date: searchParams.get("date") || undefined,
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
    });

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch analytics overview";

    return generateAnalyticsResponse(
      false,
      getEmptyOverviewAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
