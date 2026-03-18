import { NextRequest, NextResponse } from "next/server";
import {
  ApiResponse,
  BookingAnalyticsParams,
  BookingAnalyticsResponse,
} from "@/types/analytics";
import { generateAnalyticsResponse } from "@/services/api/analytics/response";
import {
  getBookingAnalytics,
  getEmptyBookingAnalyticsResponse,
} from "@/services/api/analytics/bookings";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<BookingAnalyticsResponse>>> {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(req.url);
    const params: BookingAnalyticsParams = {
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
      sort_by: searchParams.get("sort_by") || "created_at",
      sort_order: (searchParams.get("sort_order") || "desc") as "asc" | "desc",
      date: searchParams.get("date") || undefined,
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
      status: searchParams.get("status") || undefined,
      booking_source: searchParams.get("booking_source") || undefined,
      room_type_id: searchParams.get("room_type_id") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const result = await getBookingAnalytics(params);

    return generateAnalyticsResponse(true, result.data, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied: result.filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Booking analytics error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch booking analytics";

    return generateAnalyticsResponse(
      false,
      getEmptyBookingAnalyticsResponse(),
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
