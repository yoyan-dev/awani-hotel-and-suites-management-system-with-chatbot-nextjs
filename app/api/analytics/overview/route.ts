import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse } from "@/types/analytics";
import { Tables } from "@/types/supabase";
import { startOfDay, endOfDay, format, parseISO, isValid } from "date-fns";

type Booking = Tables<"bookings">;
type FunctionHallBooking = Tables<"function_hall_bookings">;
type Room = Tables<"rooms">;
type FunctionRoom = Tables<"function-rooms">;

interface BookingOverviewResponse {
  bookings: {
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
  };
  function_hall_bookings: {
    summary: {
      total_bookings: number;
      total_revenue: number;
      upcoming_bookings: number;
      pending_bookings: number;
      completed_bookings: number;
      cancelled_bookings: number;
      total_guests_expected: number;
    };
    status_distribution: Record<string, number>;
    recent_bookings: FunctionHallBooking[];
  };
  rooms: {
    summary: {
      total_rooms: number;
      available_rooms: number;
      occupied_rooms: number;
      maintenance_rooms: number;
      occupancy_rate: number;
      average_room_rate: number;
    };
    status_distribution: Record<string, number>;
    recent_bookings: Booking[];
  };
  function_rooms: {
    summary: {
      total_rooms: number;
      available_rooms: number;
      booked_rooms: number;
      maintenance_rooms: number;
      utilization_rate: number;
      total_revenue: number;
    };
    status_distribution: Record<string, number>;
    recent_bookings: FunctionHallBooking[];
  };
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

    let fhBookingsQuery = supabase
      .from("function_hall_bookings")
      .select("*", { count: "exact" })
      .gte("event_date", dateRange.start.toISOString())
      .lte("event_date", dateRange.end.toISOString());

    const {
      data: fhBookings,
      error: fhBookingsError,
      count: fhBookingsCount,
    } = await fhBookingsQuery;

    if (fhBookingsError) throw fhBookingsError;

    const transformedFHBookings: FunctionHallBooking[] = (fhBookings ||
      []) as FunctionHallBooking[];

    const fhTotalRevenue = transformedFHBookings.reduce(
      (acc, b) => acc + (Number((b as any).total_amount ?? 0) || 0),
      0,
    );

    const fhStatusDistribution = transformedFHBookings.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const fhUpcomingBookings = transformedFHBookings.filter((b) => {
      if (!b.event_date) return false;
      return parseISO(b.event_date) > now;
    }).length;

    const fhPendingBookings = transformedFHBookings.filter(
      (b) => b.status === "pending",
    ).length;

    const fhCompletedBookings = transformedFHBookings.filter(
      (b) => b.status === "completed",
    ).length;

    const fhCancelledBookings = transformedFHBookings.filter(
      (b) => b.status === "cancelled",
    ).length;

    const fhRecentBookings = transformedFHBookings.slice(0, 10);

    const functionHallData = {
      summary: {
        total_bookings: fhBookingsCount || 0,
        total_revenue: fhTotalRevenue,
        upcoming_bookings: fhUpcomingBookings,
        pending_bookings: fhPendingBookings,
        completed_bookings: fhCompletedBookings,
        cancelled_bookings: fhCancelledBookings,
        total_guests_expected: transformedFHBookings.reduce(
          (acc, b) => acc + (Number((b as any).number_of_guest ?? 0) || 0),
          0,
        ),
      },
      status_distribution: fhStatusDistribution,
      recent_bookings: fhRecentBookings,
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

    const availableRooms = transformedRooms.filter(
      (b) => b.status === "available",
    ).length;

    const occupiedRooms = transformedRooms.filter(
      (b) => b.status === "occupied",
    ).length;

    const maintenanceRooms = transformedRooms.filter(
      (b) => b.status === "maintenance",
    ).length;

    const roomsData = {
      summary: {
        total_rooms: roomsCount || 0,
        available_rooms: availableRooms,
        occupied_rooms: occupiedRooms,
        maintenance_rooms: maintenanceRooms,
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
    } = await supabase.from("function-rooms").select("*", { count: "exact" });

    if (functionRoomsError) throw functionRoomsError;

    const transformedFunctionRooms: FunctionRoom[] = (functionRooms ||
      []) as FunctionRoom[];

    const frStatusDistribution = transformedFunctionRooms.reduce(
      (acc, b) => {
        const status = b.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const frAvailableRooms = transformedFunctionRooms.filter(
      (b) => b.status === "available",
    ).length;

    const frBookedRooms = transformedFunctionRooms.filter(
      (b) => b.status === "booked",
    ).length;

    const frMaintenanceRooms = transformedFunctionRooms.filter(
      (b) => b.status === "maintenance",
    ).length;

    const frData = {
      summary: {
        total_rooms: functionRoomsCount || 0,
        available_rooms: frAvailableRooms,
        booked_rooms: frBookedRooms,
        maintenance_rooms: frMaintenanceRooms,
        utilization_rate:
          (frBookedRooms / (transformedFunctionRooms.length || 1)) * 100,
        total_revenue: fhTotalRevenue,
      },
      status_distribution: frStatusDistribution,
      recent_bookings: fhRecentBookings,
    };

    const response: BookingOverviewResponse = {
      bookings: bookingsData,
      function_hall_bookings: functionHallData,
      rooms: roomsData,
      function_rooms: frData,
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
          available_rooms: 0,
          occupied_rooms: 0,
          maintenance_rooms: 0,
          occupancy_rate: 0,
          average_room_rate: 0,
        },
        status_distribution: {},
        recent_bookings: [],
      },
      function_rooms: {
        summary: {
          total_rooms: 0,
          available_rooms: 0,
          booked_rooms: 0,
          maintenance_rooms: 0,
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
