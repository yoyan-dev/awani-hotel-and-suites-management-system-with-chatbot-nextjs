import { createClient } from "@/lib/supabase/server";
import {
  BookingAnalyticsParams,
  BookingAnalyticsResponse,
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

type Booking = Tables<"bookings">;

const EMPTY_BOOKING_ANALYTICS_RESPONSE: BookingAnalyticsResponse = {
  summary: {
    total_bookings: 0,
    total_revenue: 0,
    average_booking_value: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    checked_in_today: 0,
    checked_out_today: 0,
    cancelled_bookings: 0,
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
    by_status: {},
    by_payment_status: {},
    by_booking_source: {},
    by_room_type: {},
    by_month: {},
  },
  top_performers: {
    most_booked_room_types: [],
    peak_booking_days: [],
    revenue_by_source: [],
  },
};

function calculateDateRange(
  params: BookingAnalyticsParams,
): { start: Date; end: Date } {
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
}

export async function getBookingAnalytics(params: BookingAnalyticsParams) {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const sort_by = params.sort_by || "created_at";
  const sort_order = params.sort_order || "desc";
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const filters_applied: Record<string, unknown> = {
    pagination: { page, limit },
  };

  if (params.status) filters_applied.status = params.status;
  if (params.booking_source) {
    filters_applied.booking_source = params.booking_source;
  }
  if (params.room_type_id) filters_applied.room_type_id = params.room_type_id;
  if (params.search) filters_applied.search = params.search;

  let baseQuery = supabase.from("bookings").select("*", { count: "exact" });
  const dateRange = calculateDateRange(params);

  filters_applied.date_range = {
    start: format(dateRange.start, "yyyy-MM-dd"),
    end: format(dateRange.end, "yyyy-MM-dd"),
  };

  baseQuery = baseQuery
    .gte("checked_in", dateRange.start.toISOString())
    .lte("checked_out", dateRange.end.toISOString());

  if (params.status) {
    baseQuery = baseQuery.eq("status", params.status);
  }

  if (params.booking_source) {
    baseQuery = baseQuery.eq("booking_source", params.booking_source);
  }

  if (params.room_type_id) {
    baseQuery = baseQuery.eq("room_type_id", params.room_type_id);
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
    throw error;
  }

  const transformedBookings: Booking[] = (bookings || []) as Booking[];
  const totalBookings = bookings?.length || 0;
  const totalRevenue = transformedBookings.reduce(
    (acc, b) => acc + (b.amount_paid || 0),
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

  const paymentStatusDistribution = transformedBookings.reduce(
    (acc, b) => {
      const status = b.payment_status || "pending";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const bookingSourceDistribution = transformedBookings.reduce(
    (acc, b) => {
      const source = b.booking_source || "unknown";
      acc[source] = (acc[source] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = subDays(todayStart, 7);

  const checkedInToday = transformedBookings.filter(
    (b) =>
      b.status === "checked_in" &&
      b.checked_in &&
      b.checked_in >= todayStart.toISOString(),
  ).length;

  const checkedOutToday = transformedBookings.filter(
    (b) =>
      b.status === "checked_out" &&
      b.checked_out &&
      b.checked_out >= todayStart.toISOString(),
  ).length;

  const confirmedBookings = transformedBookings.filter(
    (b) => b.status === "confirmed",
  ).length;

  const pendingBookings = transformedBookings.filter(
    (b) => b.status === "pending",
  ).length;

  const cancelledBookings = transformedBookings.filter(
    (b) => b.status === "cancelled",
  ).length;

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

  const response: BookingAnalyticsResponse = {
    summary: {
      total_bookings: count || 0,
      total_revenue: totalRevenue,
      average_booking_value: totalBookings > 0 ? totalRevenue / totalBookings : 0,
      pending_bookings: pendingBookings,
      confirmed_bookings: confirmedBookings,
      checked_in_today: checkedInToday,
      checked_out_today: checkedOutToday,
      cancelled_bookings: cancelledBookings,
    },
    trends: {
      daily: dailyAnalytics,
      monthly: [],
      weekly_comparison: weeklyComparison,
    },
    distributions: {
      by_status: statusDistribution,
      by_payment_status: paymentStatusDistribution,
      by_booking_source: bookingSourceDistribution,
      by_room_type: {},
      by_month: {},
    },
    top_performers: {
      most_booked_room_types: [],
      peak_booking_days: [],
      revenue_by_source: Object.entries(bookingSourceDistribution).map(
        ([source]) => ({
          source,
          revenue:
            transformedBookings
              .filter((b) => b.booking_source === source)
              .reduce((acc, b) => acc + (b.amount_paid || 0), 0) || 0,
        }),
      ),
    },
  };

  return { data: response, filters_applied };
}

export function getEmptyBookingAnalyticsResponse() {
  return EMPTY_BOOKING_ANALYTICS_RESPONSE;
}
