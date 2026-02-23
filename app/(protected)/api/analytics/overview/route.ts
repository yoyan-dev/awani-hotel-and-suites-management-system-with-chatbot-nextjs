import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types/analytics";
import { Tables } from "@/types/supabase";
import { startOfDay, endOfDay, format, parseISO, isValid } from "date-fns";
import {
  Booking,
  BookingOverviewResponse,
  FunctionHallBooking,
  FunctionRoom,
  Room,
} from "@/types/analytics-contracts";
import { calculateDateRange } from "@/utils/overview/calculate-date-range";

const parseEventDurationBoundary = (
  eventDuration: unknown,
  boundary: "start" | "end",
): Date | null => {
  if (!eventDuration || typeof eventDuration !== "object") return null;

  const durationRecord = eventDuration as Record<string, unknown>;
  const boundaryData = durationRecord[boundary];
  if (!boundaryData || typeof boundaryData !== "object") return null;

  const point = boundaryData as Record<string, unknown>;
  const year = Number(point.year);
  const month = Number(point.month);
  const day = Number(point.day);
  const hour = Number(point.hour ?? 0);
  const minute = Number(point.minute ?? 0);
  const second = Number(point.second ?? 0);
  const millisecond = Number(point.millisecond ?? 0);
  const offset = Number(point.offset ?? 0);

  if (!year || !month || !day) return null;

  // Offset is milliseconds from UTC in stored event_duration payload.
  const utcTime =
    Date.UTC(year, month - 1, day, hour, minute, second, millisecond) - offset;
  const parsedDate = new Date(utcTime);

  return isValid(parsedDate) ? parsedDate : null;
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
): Promise<NextResponse<ApiResponse<BookingOverviewResponse>>> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const date = searchParams.get("date") || undefined;
    const start = searchParams.get("start") || undefined;
    const end = searchParams.get("end") || undefined;

    filters_applied.date_range = {
      start: format(
        calculateDateRange({ date, start, end }).start,
        "yyyy-MM-dd",
      ),
      end: format(calculateDateRange({ date, start, end }).end, "yyyy-MM-dd"),
    };

    const dateRange = calculateDateRange({ date, start, end });
    const now = new Date();
    const todayStart = startOfDay(now);
    const todayEnd = endOfDay(now);

    let bookingsQuery = supabase
      .from("bookings")
      .select("*", { count: "exact" })
      .gte("checked_in", dateRange.start.toISOString())
      .lte("checked_out", dateRange.end.toISOString());

    const {
      data: bookings,
      error: bookingsError,
      count: bookingsCount,
    } = await bookingsQuery;

    if (bookingsError) throw bookingsError;

    const transformedBookings: Booking[] = (bookings || []) as Booking[];

    const totalRevenue = transformedBookings.reduce(
      (acc, b) => acc + (Number(b.total) || 0),
      0,
    );

    const bookingsStatusDistribution = transformedBookings.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const checkedInToday = transformedBookings.filter((b) => {
      if (b.status !== "checked_in" || !b.checked_in) return false;
      const checkIn = parseISO(b.checked_in);
      return checkIn >= todayStart && checkIn <= todayEnd;
    }).length;

    const checkedOutToday = transformedBookings.filter((b) => {
      if (b.status !== "checked_out" || !b.checked_out) return false;
      const checkOut = parseISO(b.checked_out);
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
      if (!b.checked_in) return false;
      return parseISO(b.checked_in) > now;
    }).length;

    const occupiedCount = transformedBookings.filter(
      (b) => b.status === "checked_in",
    ).length;

    const recentBookings = transformedBookings.slice(0, 10);

    const bookingsData = {
      summary: {
        total_revenue: totalRevenue,
        total_bookings: bookingsCount || 0,
        pending_bookings: pendingBookings,
        confirmed_bookings: confirmedBookings,
        checked_in_today: checkedInToday,
        checked_out_today: checkedOutToday,
        cancelled_bookings: cancelledBookings,
        upcoming_bookings: upcomingBookings,
        occupancy_rate:
          (occupiedCount / (transformedBookings.length || 1)) * 100,
        average_booking_value: totalRevenue / (transformedBookings.length || 1),
      },
      status_distribution: bookingsStatusDistribution,
      recent_bookings: recentBookings,
    };

    let functionHallBookingsQuery = supabase
      .from("function_hall_bookings")
      .select("*");

    const { data: functionHallBookings, error: functionHallBookingsError } =
      await functionHallBookingsQuery;

    if (functionHallBookingsError) throw functionHallBookingsError;

    const transformedFunctionHallBookings: FunctionHallBooking[] =
      (functionHallBookings || []) as FunctionHallBooking[];

    const filteredFunctionHallBookings = transformedFunctionHallBookings.filter(
      (booking) => {
        const startDate = parseEventDurationBoundary(
          (booking as any).event_duration,
          "start",
        );
        const endDate =
          parseEventDurationBoundary((booking as any).event_duration, "end") ||
          startDate;

        if (!startDate && !endDate) return false;

        const bookingStart = startDate || endDate!;
        const bookingEnd = endDate || startDate!;

        return bookingStart <= dateRange.end && bookingEnd >= dateRange.start;
      },
    );

    const functionHallTotalRevenue = filteredFunctionHallBookings.reduce(
      (acc, b) => acc + (Number((b as any).amount_paid ?? 0) || 0),
      0,
    );

    const functionHallStatusDistribution = filteredFunctionHallBookings.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const functionHallUpcomingBookings = filteredFunctionHallBookings.filter(
      (b) => {
        const startDate = parseEventDurationBoundary(
          (b as any).event_duration,
          "start",
        );
        if (!startDate) return false;
        return startDate > now;
      },
    ).length;

    const functionHallPendingBookings = filteredFunctionHallBookings.filter(
      (b) => b.status === "pending",
    ).length;

    const functionHallCompletedBookings = filteredFunctionHallBookings.filter(
      (b) => b.status === "completed",
    ).length;

    const functionHallCancelledBookings = filteredFunctionHallBookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const functionHallRecentBookings = filteredFunctionHallBookings.slice(
      0,
      10,
    );

    const functionHallData = {
      summary: {
        total_bookings: filteredFunctionHallBookings.length,
        total_revenue: functionHallTotalRevenue,
        upcoming_bookings: functionHallUpcomingBookings,
        pending_bookings: functionHallPendingBookings,
        completed_bookings: functionHallCompletedBookings,
        cancelled_bookings: functionHallCancelledBookings,
        total_guests_expected: filteredFunctionHallBookings.reduce(
          (acc, b) => acc + (Number((b as any).number_of_guest ?? 0) || 0),
          0,
        ),
      },
      status_distribution: functionHallStatusDistribution,
      recent_bookings: functionHallRecentBookings,
    };

    const {
      data: rooms,
      error: roomsError,
      count: roomsCount,
    } = await supabase.from("rooms").select("*", { count: "exact" });

    if (roomsError) throw roomsError;

    const transformedRooms: Room[] = (rooms || []) as Room[];

    const roomsStatusDistribution = transformedRooms.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const vacantRooms = transformedRooms.filter(
      (b) => b.status === "vacant",
    ).length;

    const vacantDirtyRooms = transformedRooms.filter(
      (b) => b.status === "vacant_dirty",
    ).length;

    const dirtyRooms = transformedRooms.filter(
      (b) => b.status === "dirty",
    ).length;

    const occupiedRooms = transformedRooms.filter(
      (b) => b.status === "occupied",
    ).length;

    const maintenanceRooms = transformedRooms.filter(
      (b) => b.status === "maintenance",
    ).length;

    const outOfServiceRooms = transformedRooms.filter(
      (b) => b.status === "out_of_service",
    ).length;

    const stockRooms = transformedRooms.filter(
      (b) => b.status === "stock_room",
    ).length;

    const roomsData = {
      summary: {
        total_rooms: roomsCount || 0,
        vacant_rooms: vacantRooms,
        vacant_dirty_rooms: vacantDirtyRooms,
        dirty_rooms: dirtyRooms,
        occupied_rooms: occupiedRooms,
        maintenance_rooms: maintenanceRooms,
        out_of_service_rooms: outOfServiceRooms,
        stock_rooms: stockRooms,
        occupancy_rate: (occupiedRooms / (transformedRooms.length || 1)) * 100,
        average_room_rate: 0,
        total_room_revenue: totalRevenue,
      },
      status_distribution: roomsStatusDistribution,
      recent_bookings: recentBookings,
    };

    const {
      data: functionRooms,
      error: functionRoomsError,
      count: functionRoomsCount,
    } = await supabase.from("function_rooms").select("*", { count: "exact" });

    if (functionRoomsError) throw functionRoomsError;

    const transformedFunctionRooms: FunctionRoom[] = (functionRooms ||
      []) as FunctionRoom[];

    const frStatusDistribution = transformedFunctionRooms.reduce(
      (acc, b) => {
        const status = (b as any).status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const frAvailableRooms = transformedFunctionRooms.filter(
      (b) => (b as any).status === "available",
    ).length;

    const frHalfOccupiedRooms = transformedFunctionRooms.filter(
      (b) => (b as any).status === "half occupied",
    ).length;

    const frFullOccupiedRooms = transformedFunctionRooms.filter(
      (b) => (b as any).status === "full occupied",
    ).length;

    const functionRoomData = {
      summary: {
        total_rooms: functionRoomsCount || 0,
        available_rooms: frAvailableRooms,
        half_occupied_rooms: frHalfOccupiedRooms,
        full_occupied_rooms: frFullOccupiedRooms,
        utilization_rate:
          ((frHalfOccupiedRooms + frFullOccupiedRooms) /
            (transformedFunctionRooms.length || 1)) *
          100,
        total_revenue: functionHallTotalRevenue,
      },

      status_distribution: frStatusDistribution,

      recent_bookings: functionHallRecentBookings,
    };

    const response: BookingOverviewResponse = {
      bookings: bookingsData,
      function_hall_bookings: functionHallData,
      rooms: roomsData,
      function_rooms: functionRoomData,
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Analytics overview error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch analytics overview";
    const emptyResponse: BookingOverviewResponse = {
      bookings: {
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
      },
      function_hall_bookings: {
        summary: {
          total_bookings: 0,
          total_revenue: 0,
          upcoming_bookings: 0,
          pending_bookings: 0,
          completed_bookings: 0,
          cancelled_bookings: 0,
          total_guests_expected: 0,
        },
        status_distribution: {},
        recent_bookings: [],
      },
      rooms: {
        summary: {
          total_rooms: 0,
          vacant_rooms: 0,
          vacant_dirty_rooms: 0,
          dirty_rooms: 0,
          occupied_rooms: 0,
          maintenance_rooms: 0,
          out_of_service_rooms: 0,
          stock_rooms: 0,
          occupancy_rate: 0,
          average_room_rate: 0,
          total_room_revenue: 0,
        },
        status_distribution: {},
        recent_bookings: [],
      },
      function_rooms: {
        summary: {
          total_rooms: 0,
          available_rooms: 0,
          half_occupied_rooms: 0,
          full_occupied_rooms: 0,
          utilization_rate: 0,
          total_revenue: 0,
        },
        status_distribution: {},
        recent_bookings: [],
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
