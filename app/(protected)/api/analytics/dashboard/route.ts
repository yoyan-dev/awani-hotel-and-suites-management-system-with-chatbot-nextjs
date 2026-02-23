import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DashboardSummaryResponse, ApiResponse } from "@/types/analytics";
import { startOfDay, endOfDay, subDays, isValid } from "date-fns";

const parseEventDurationBoundary = (
  eventDuration: unknown,
  boundary: "start" | "end",
): Date | null => {
  if (!eventDuration || typeof eventDuration !== "object") return null;

  const durationRecord = eventDuration as Record<string, unknown>;
  const boundaryData = durationRecord[boundary];

  if (!boundaryData) return null;

  if (typeof boundaryData === "string") {
    const parsed = new Date(boundaryData);
    return isValid(parsed) ? parsed : null;
  }

  if (typeof boundaryData !== "object") return null;

  const point = boundaryData as Record<string, unknown>;
  const year = Number(point.year);
  const month = Number(point.month);
  const day = Number(point.day);
  const hour = Number(point.hour ?? 0);
  const minute = Number(point.minute ?? 0);
  const second = Number(point.second ?? 0);
  const millisecond = Number(point.millisecond ?? 0);
  const offset = Number(point.offset ?? 0);

  if (year && month && day) {
    const utcTime =
      Date.UTC(year, month - 1, day, hour, minute, second, millisecond) -
      offset;
    const parsedDate = new Date(utcTime);
    return isValid(parsedDate) ? parsedDate : null;
  }

  return null;
};

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

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<DashboardSummaryResponse>>> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    const today = new Date();
    const todayStart = startOfDay(today);
    const todayEnd = endOfDay(today);
    const weekStart = subDays(todayStart, 7);
    const monthStart = subDays(todayStart, 30);

    filters_applied.date_range = { start, end };

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select("id, checked_in, checked_out, status, amount_paid, created_at");

    if (bookingsError) {
      console.error("Supabase error:", bookingsError);
      throw bookingsError;
    }

    const { data: functionHallBookings, error: fhError } = await supabase
      .from("function_hall_bookings")
      .select("id, event_duration, status, amount_paid, created_at");

    if (fhError) {
      console.error("Supabase error:", fhError);
      throw fhError;
    }

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, status");

    if (roomsError) {
      console.error("Supabase error:", roomsError);
      throw roomsError;
    }

    const { data: functionRooms, error: frError } = await supabase
      .from("function_rooms")
      .select("id, status");

    if (frError) {
      console.error("Supabase error:", frError);
      throw frError;
    }

    const todayBookings = (bookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= todayStart && created <= todayEnd;
    });

    const weekBookings = (bookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= weekStart;
    });

    const monthBookings = (bookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= monthStart;
    });

    const todayRevenue = todayBookings.reduce(
      (acc, b) => acc + (b.amount_paid || 0),
      0,
    );
    const monthRevenue = monthBookings.reduce(
      (acc, b) => acc + (b.amount_paid || 0),
      0,
    );

    const pendingBookings = (bookings || []).filter(
      (b) => b.status === "pending",
    ).length;
    const checkedInToday = (bookings || []).filter(
      (b) =>
        b.status === "checked_in" &&
        b.checked_in &&
        new Date(b.checked_in) >= todayStart &&
        new Date(b.checked_in) <= todayEnd,
    ).length;

    const todayFHBookings = (functionHallBookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= todayStart && created <= todayEnd;
    });

    const weekFHBookings = (functionHallBookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= weekStart;
    });

    const monthFHBookings = (functionHallBookings || []).filter((b) => {
      if (!b.created_at) return false;
      const created = new Date(b.created_at);
      return created >= monthStart;
    });

    const todayFHRevenue = todayFHBookings.reduce(
      (acc, b) => acc + (b.amount_paid || 0),
      0,
    );
    const monthFHRevenue = monthFHBookings.reduce(
      (acc, b) => acc + (b.amount_paid || 0),
      0,
    );

    const pendingFHBookings = (functionHallBookings || []).filter(
      (b) => b.status === "pending",
    ).length;
    const upcomingEvents = (functionHallBookings || []).filter((b) => {
      if (b.status === "cancelled" || b.status === "completed") return false;

      const startDate = parseEventDurationBoundary(b.event_duration, "start");
      const endDate =
        parseEventDurationBoundary(b.event_duration, "end") || startDate;

      if (startDate || endDate) {
        const eventEnd = endDate || startDate!;
        return eventEnd >= today;
      }

      return false;
    }).length;

    const totalRooms = (rooms || []).length;
    const availableRooms = (rooms || []).filter(
      (r) => r.status === "available",
    ).length;
    const occupiedRooms = (rooms || []).filter(
      (r) => r.status === "occupied",
    ).length;
    const maintenanceRooms = (rooms || []).filter(
      (r) => r.status === "maintenance",
    ).length;

    const totalFunctionRooms = (functionRooms || []).length;
    const availableFRooms = (functionRooms || []).filter(
      (r) => r.status === "available",
    ).length;
    const bookedFRooms = (functionRooms || []).filter(
      (r) => r.status === "booked",
    ).length;

    const response: DashboardSummaryResponse = {
      timestamp: new Date().toISOString(),
      bookings: {
        today: todayBookings.length,
        this_week: weekBookings.length,
        this_month: monthBookings.length,
        pending: pendingBookings,
        revenue_today: todayRevenue,
        revenue_this_month: monthRevenue,
      },
      function_halls: {
        today: todayFHBookings.length,
        this_week: weekFHBookings.length,
        this_month: monthFHBookings.length,
        pending: pendingFHBookings,
        revenue_today: todayFHRevenue,
        revenue_this_month: monthFHRevenue,
      },
      rooms: {
        total: totalRooms,
        available: availableRooms,
        occupied: occupiedRooms,
        maintenance: maintenanceRooms,
        occupancy_rate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
      },
      function_rooms: {
        total: totalFunctionRooms,
        available: availableFRooms,
        booked: bookedFRooms,
        utilization_rate:
          totalFunctionRooms > 0
            ? (bookedFRooms / totalFunctionRooms) * 100
            : 0,
      },
      quick_stats: {
        total_guests_checked_in: checkedInToday,
        total_guests_checked_out_today: 0,
        upcoming_checked_outs: 0,
        upcoming_events: upcomingEvents,
      },
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Dashboard summary error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch dashboard summary";
    const emptyResponse: DashboardSummaryResponse = {
      timestamp: new Date().toISOString(),
      bookings: {
        today: 0,
        this_week: 0,
        this_month: 0,
        pending: 0,
        revenue_today: 0,
        revenue_this_month: 0,
      },
      function_halls: {
        today: 0,
        this_week: 0,
        this_month: 0,
        pending: 0,
        revenue_today: 0,
        revenue_this_month: 0,
      },
      rooms: {
        total: 0,
        available: 0,
        occupied: 0,
        maintenance: 0,
        occupancy_rate: 0,
      },
      function_rooms: {
        total: 0,
        available: 0,
        booked: 0,
        utilization_rate: 0,
      },
      quick_stats: {
        total_guests_checked_in: 0,
        total_guests_checked_out_today: 0,
        upcoming_checked_outs: 0,
        upcoming_events: 0,
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
