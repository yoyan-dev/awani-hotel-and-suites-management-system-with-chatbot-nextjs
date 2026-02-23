import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  FunctionHallAnalyticsResponse,
  FunctionHallAnalyticsParams,
  ApiResponse,
} from "@/types/analytics";
import { Tables } from "@/types/supabase";
import {
  startOfDay,
  endOfDay,
  subDays,
  format,
  parseISO,
  isValid,
} from "date-fns";
import { parseEventDurationBoundaryDateTime } from "@/utils/function-room/event-duration-date";

type FunctionHallBooking = Tables<"function_hall_bookings">;

const generateResponse = <T>(
  success: boolean,
  data: T,
  error: { message: string } | undefined,
  meta: {
    generated_at: string;
    filters_applied: Record<string, unknown>;
    execution_time_ms: number;
  },
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success,
      data,
      error: error ? { code: "ERROR", message: error.message } : undefined,
      meta,
    },
    { status: success ? 200 : 500 },
  );
};

const calculateDateRange = (
  params: FunctionHallAnalyticsParams,
): { start: Date; end: Date } => {
  const today = new Date();

  if (params.start && params.end) {
    const start = parseISO(params.start);
    const end = parseISO(params.end);
    if (isValid(start) && isValid(end)) {
      return { start, end };
    }
  }

  if (params.date) {
    const date = parseISO(params.date);
    if (isValid(date)) {
      return { start: startOfDay(date), end: endOfDay(date) };
    }
  }

  return { start: startOfDay(today), end: endOfDay(today) };
};

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<FunctionHallAnalyticsResponse>>> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort_by = searchParams.get("sort_by") || "created_at";
    const sort_order = (searchParams.get("sort_order") || "desc") as
      | "asc"
      | "desc";

    const params: FunctionHallAnalyticsParams = {
      page,
      limit,
      sort_by,
      sort_order,
      date: searchParams.get("date") || undefined,
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
      status: searchParams.get("status") || undefined,
      event_type: searchParams.get("event_type") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    filters_applied.pagination = { page, limit };
    if (params.status) filters_applied.status = params.status;
    if (params.event_type) filters_applied.event_type = params.event_type;
    if (params.search) filters_applied.search = params.search;

    let baseQuery = supabase
      .from("function_hall_bookings")
      .select("*", { count: "exact" });

    const dateRange = calculateDateRange(params);

    const startYear = dateRange.start.getFullYear();
    const startMonth = dateRange.start.getMonth() + 1;
    const startDay = dateRange.start.getDate();

    const endYear = dateRange.end.getFullYear();
    const endMonth = dateRange.end.getMonth() + 1;
    const endDay = dateRange.end.getDate();

    baseQuery = baseQuery
      .filter("event_duration->start->>year", "gte", startYear)
      .filter("event_duration->start->>month", "gte", startMonth)
      .filter("event_duration->start->>day", "gte", startDay)
      .filter("event_duration->end->>year", "lte", endYear)
      .filter("event_duration->end->>month", "lte", endMonth)
      .filter("event_duration->end->>day", "lte", endDay);

    if (params.status) {
      baseQuery = baseQuery.eq("status", params.status);
    }

    if (params.event_type) {
      baseQuery = baseQuery.eq("event_type", params.event_type);
    }

    if (params.search) {
      baseQuery = baseQuery.or(
        `booking_number.ilike.%${params.search}%,guest_id.ilike.%${params.search}%`,
      );
    }

    const {
      data: bookings,
      error,
      count,
    } = await baseQuery
      .order(sort_by, { ascending: sort_order === "asc" })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      const emptyResponse: FunctionHallAnalyticsResponse = {
        summary: {
          total_bookings: 0,
          total_revenue: 0,
          average_booking_value: 0,
          upcoming_bookings: 0,
          completed_bookings: 0,
          pending_bookings: 0,
          cancelled_bookings: 0,
          total_guests_expected: 0,
        },
        trends: {
          daily: [],
          monthly: [],
          weekly_comparison: {
            current_week: 0,
            previous_week: 0,
            percent_change: 0,
          },
        },
        distributions: {
          by_event_type: {},
          by_status: {},
          by_room: {},
          by_month: {},
          by_day_of_week: {},
        },
        top_performers: {
          most_popular_rooms: [],
          most_popular_event_types: [],
          peak_months: [],
        },
      };
      return generateResponse(
        false,
        emptyResponse,
        { message: error.message },
        {
          generated_at: new Date().toISOString(),
          filters_applied,
          execution_time_ms: Date.now() - startTime,
        },
      );
    }

    const transformedBookings: FunctionHallBooking[] = (bookings ||
      []) as FunctionHallBooking[];
    const totalBookings = bookings?.length || 0;
    const totalRevenue = transformedBookings.reduce(
      (acc, b) => acc + (b.amount_paid || 0),
      0,
    );

    const eventTypeDistribution = transformedBookings.reduce(
      (acc, b) => {
        const type = b.event_type || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const statusDistribution = transformedBookings.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const roomDistribution = transformedBookings.reduce(
      (acc, b) => {
        const roomId = b.room_id || "unknown";
        acc[roomId] = (acc[roomId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const now = new Date();
    const todayStart = startOfDay(now);
    const weekStart = subDays(todayStart, 7);

    const upcomingBookings = transformedBookings.filter((b) => {
      if (b.status === "cancelled" || b.status === "completed") return false;

      const startDate = parseEventDurationBoundaryDateTime(
        (b as any).event_duration,
        "start",
      );
      const endDate =
        parseEventDurationBoundaryDateTime((b as any).event_duration, "end") ||
        startDate;

      if (!startDate && !endDate) return false;

      const eventEnd = endDate || startDate!;
      return eventEnd >= now;
    }).length;

    const completedBookings = transformedBookings.filter(
      (b) => b.status === "completed",
    ).length;

    const pendingBookings = transformedBookings.filter(
      (b) => b.status === "pending",
    ).length;

    const cancelledBookings = transformedBookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const totalGuests = transformedBookings.reduce(
      (acc, b) => acc + (b.number_of_guest || 0),
      0,
    );

    const dailyTrends = transformedBookings.reduce(
      (acc, b) => {
        if (!b.created_at) return acc;
        const date = format(parseISO(b.created_at), "yyyy-MM-dd");
        if (!acc[date]) {
          acc[date] = { count: 0, total: 0 };
        }
        acc[date].count += 1;
        acc[date].total += b.amount_paid || 0;
        return acc;
      },
      {} as Record<string, { count: number; total: number }>,
    );

    const dailyAnalytics = Object.entries(dailyTrends)
      .map(([date, data]) => ({
        date,
        count: data.count,
        total: data.total,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-30);

    const weeklyComparison = {
      current_week: transformedBookings.filter(
        (b) => b.created_at && b.created_at >= weekStart.toISOString(),
      ).length,
      previous_week: transformedBookings.filter(
        (b) =>
          b.created_at &&
          b.created_at < weekStart.toISOString() &&
          b.created_at >= subDays(weekStart, 7).toISOString(),
      ).length,
      percent_change: 0,
    };
    weeklyComparison.percent_change =
      weeklyComparison.previous_week > 0
        ? ((weeklyComparison.current_week - weeklyComparison.previous_week) /
            weeklyComparison.previous_week) *
          100
        : 0;

    const response: FunctionHallAnalyticsResponse = {
      summary: {
        total_bookings: count || 0,
        total_revenue: totalRevenue,
        average_booking_value:
          totalBookings > 0 ? totalRevenue / totalBookings : 0,
        upcoming_bookings: upcomingBookings,
        completed_bookings: completedBookings,
        pending_bookings: pendingBookings,
        cancelled_bookings: cancelledBookings,
        total_guests_expected: totalGuests,
      },
      trends: {
        daily: dailyAnalytics,
        monthly: [],
        weekly_comparison: weeklyComparison,
      },
      distributions: {
        by_event_type: eventTypeDistribution,
        by_status: statusDistribution,
        by_room: roomDistribution,
        by_month: {},
        by_day_of_week: {},
      },
      top_performers: {
        most_popular_rooms: [],
        most_popular_event_types: Object.entries(eventTypeDistribution)
          .map(([type, count]) => ({ type, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5),
        peak_months: [],
      },
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Function hall analytics error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch function hall analytics";
    const emptyResponse: FunctionHallAnalyticsResponse = {
      summary: {
        total_bookings: 0,
        total_revenue: 0,
        average_booking_value: 0,
        upcoming_bookings: 0,
        completed_bookings: 0,
        pending_bookings: 0,
        cancelled_bookings: 0,
        total_guests_expected: 0,
      },
      trends: {
        daily: [],
        monthly: [],
        weekly_comparison: {
          current_week: 0,
          previous_week: 0,
          percent_change: 0,
        },
      },
      distributions: {
        by_event_type: {},
        by_status: {},
        by_room: {},
        by_month: {},
        by_day_of_week: {},
      },
      top_performers: {
        most_popular_rooms: [],
        most_popular_event_types: [],
        peak_months: [],
      },
    };
    return generateResponse(
      false,
      emptyResponse,
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied,
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
