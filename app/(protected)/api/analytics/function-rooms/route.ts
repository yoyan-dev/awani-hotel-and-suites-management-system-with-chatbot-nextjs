import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  FunctionRoomAnalyticsParams,
  FunctionRoomAnalyticsResponse,
} from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getEmptyFunctionRoomAnalyticsResponse,
  getFunctionRoomAnalytics,
} from "@/services/api/analytics/function-rooms";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<FunctionRoomAnalyticsResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const params: FunctionRoomAnalyticsParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sort_by: searchParams.get("sort_by") || "room_number",
      sort_order: (searchParams.get("sort_order") || "asc") as "asc" | "desc",
      status: searchParams.get("status") || undefined,
      event_type: searchParams.get("type") || undefined,
    };

    const result = await getFunctionRoomAnalytics(params);

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Function room analytics error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch function room analytics";

    return generateAnalyticsResponse(
      false,
      getEmptyFunctionRoomAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
