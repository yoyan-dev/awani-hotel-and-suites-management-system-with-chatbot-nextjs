import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  FunctionHallAnalyticsParams,
  FunctionHallAnalyticsResponse,
} from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getEmptyFunctionHallAnalyticsResponse,
  getFunctionHallAnalytics,
} from "@/services/api/analytics/function-hall-bookings";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<FunctionHallAnalyticsResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const params: FunctionHallAnalyticsParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sort_by: searchParams.get("sort_by") || "created_at",
      sort_order: (searchParams.get("sort_order") || "desc") as "asc" | "desc",
      date: searchParams.get("date") || undefined,
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
      status: searchParams.get("status") || undefined,
      event_type: searchParams.get("event_type") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const result = await getFunctionHallAnalytics(params);

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Function hall analytics error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch function hall analytics";

    return generateAnalyticsResponse(
      false,
      getEmptyFunctionHallAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
