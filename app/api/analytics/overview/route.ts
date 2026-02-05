import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types/analytics";
import { Tables } from "@/types/supabase";
import { startOfDay, endOfDay, format, parseISO, isValid } from "date-fns";

type Booking = Tables<"bookings">;

interface BookingOverviewResponse {
  summary: {
    total_revenue: number;
    total_bookings: number;
    pending_bookings: number;
    confirmed_bookings: number;
    checked_in_today: number;
    checked_out_today: number;
    cancelled_bookings: number;
    upcoming_bookings: number;
    occupancy_rate: number;
    average_booking_value: number;
  };
  status_distribution: Record<string, number>;
  recent_bookings: Booking[];
}

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

const calculateDateRange = (params: {
  date?: string;
  start?: string;
  end?: string;
}): { start: Date; end: Date } => {
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
): Promise<NextResponse<ApiResponse<BookingOverviewResponse>>> {
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

    const params = {
      date: searchParams.get("date") || undefined,
      start: searchParams.get("start") || undefined,
      end: searchParams.get("end") || undefined,
      status: searchParams.get("status") || undefined,
      search: searchParams.get("search") || undefined,
    };

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    filters_applied.pagination = { page, limit };
    if (params.status) filters_applied.status = params.status;
    if (params.search) filters_applied.search = params.search;

    let baseQuery = supabase.from("bookings").select("*", { count: "exact" });

    const dateRange = calculateDateRange(params);
    filters_applied.date_range = {
      start: format(dateRange.start, "yyyy-MM-dd"),
      end: format(dateRange.end, "yyyy-MM-dd"),
    };

    baseQuery = baseQuery
      .gte("check_in", dateRange.start.toISOString())
      .lte("check_out", dateRange.end.toISOString());

    if (params.status) {
      baseQuery = baseQuery.eq("status", params.status);
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
      const emptyResponse: BookingOverviewResponse = {
        summary: {
          total_revenue: 0,
          total_bookings: 0,
          pending_bookings: 0,
          confirmed_bookings: 0,
          checked_in_today: 0,
          checked_out_today: 0,
          cancelled_bookings: 0,
          upcoming_bookings: 0,
          occupancy_rate: 0,
          average_booking_value: 0,
        },
        status_distribution: {},
        recent_bookings: [],
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

    const transformedBookings: Booking[] = (bookings || []) as Booking[];
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    const totalRevenue = transformedBookings.reduce(
      (acc, b) => acc + (Number(b.total) || 0),
      0,
    );

    const statusDistribution = transformedBookings.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const checkedInToday = transformedBookings.filter((b) => {
      if (b.status !== "checked_in" || !b.check_in) return false;
      const checkIn = parseISO(b.check_in);
      return checkIn >= todayStart && checkIn <= todayEnd;
    }).length;

    const checkedOutToday = transformedBookings.filter((b) => {
      if (b.status !== "checked_out" || !b.check_out) return false;
      const checkOut = parseISO(b.check_out);
      return checkOut >= todayStart && checkOut <= todayEnd;
    }).length;

    const pendingBookings = transformedBookings.filter(
      (b) => b.status === "pending",
    ).length;

    const confirmedBookings = transformedBookings.filter(
      (b) => b.status === "confirmed",
    ).length;

    const cancelledBookings = transformedBookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const upcomingBookings = transformedBookings.filter((b) => {
      if (!b.check_in) return false;
      return parseISO(b.check_in) > now;
    }).length;

    const occupiedCount = transformedBookings.filter(
      (b) => b.status === "checked_in",
    ).length;

    const totalBookingsCount = transformedBookings.length || 1;
    const occupancyRate = (occupiedCount / totalBookingsCount) * 100;
    const averageBookingValue = totalRevenue / totalBookingsCount;

    const recentBookings = transformedBookings.slice(0, 10);

    const response: BookingOverviewResponse = {
      summary: {
        total_revenue: totalRevenue,
        total_bookings: count || 0,
        pending_bookings: pendingBookings,
        confirmed_bookings: confirmedBookings,
        checked_in_today: checkedInToday,
        checked_out_today: checkedOutToday,
        cancelled_bookings: cancelledBookings,
        upcoming_bookings: upcomingBookings,
        occupancy_rate: occupancyRate,
        average_booking_value: averageBookingValue,
      },
      status_distribution: statusDistribution,
      recent_bookings: recentBookings,
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Booking overview error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch booking overview";
    const emptyResponse: BookingOverviewResponse = {
      summary: {
        total_revenue: 0,
        total_bookings: 0,
        pending_bookings: 0,
        confirmed_bookings: 0,
        checked_in_today: 0,
        checked_out_today: 0,
        cancelled_bookings: 0,
        upcoming_bookings: 0,
        occupancy_rate: 0,
        average_booking_value: 0,
      },
      status_distribution: {},
      recent_bookings: [],
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
