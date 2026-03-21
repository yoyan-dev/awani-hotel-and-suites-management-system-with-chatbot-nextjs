import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  RoomAnalyticsParams,
  RoomAnalyticsResponse,
} from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getEmptyRoomAnalyticsResponse,
  getRoomAnalytics,
} from "@/services/api/analytics/rooms";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<RoomAnalyticsResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const params: RoomAnalyticsParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sort_by: searchParams.get("sort_by") || "room_number",
      sort_order: (searchParams.get("sort_order") || "asc") as "asc" | "desc",
      status: searchParams.get("status") || undefined,
      room_type_id: searchParams.get("room_type_id") || undefined,
    };

    const result = await getRoomAnalytics(params);

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Room analytics error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch room analytics";

    return generateAnalyticsResponse(
      false,
      getEmptyRoomAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
