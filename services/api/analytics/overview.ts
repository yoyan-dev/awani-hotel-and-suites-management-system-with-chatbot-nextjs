import { createClient } from "@/lib/supabase/server";
import { BookingOverviewResponse } from "@/types/analytics";
import {
  Booking,
  FunctionHallBooking,
  FunctionRoom,
  Room,
} from "@/types/analytics-contracts";
import { startOfDay, endOfDay, format, parseISO } from "date-fns";
import { calculateDateRange } from "@/utils/overview/calculate-date-range";
import { parseBookingBoundaryDateTime } from "@/utils/function-room/event-duration-date";

const EMPTY_BOOKING_OVERVIEW_RESPONSE: BookingOverviewResponse = {
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
      total_room_revenue: 0,
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

export async function getOverviewAnalytics(params: {
  date?: string;
  start?: string;
  end?: string;
}) {
  const supabase = await createClient();
  const dateRange = calculateDateRange(params);
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  const filters_applied: Record<string, unknown> = {
    date_range: {
      start: format(dateRange.start, "yyyy-MM-dd"),
      end: format(dateRange.end, "yyyy-MM-dd"),
    },
  };

  const {
    data: bookings,
    error: bookingsError,
    count: bookingsCount,
  } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .gte("checked_in", dateRange.start.toISOString())
    .lte("checked_out", dateRange.end.toISOString());

  if (bookingsError) throw bookingsError;

  const transformedBookings: Booking[] = (bookings || []) as Booking[];
  const totalRevenue = transformedBookings.reduce(
    (acc, booking) => acc + (Number(booking.total) || 0),
    0,
  );

  const bookingsStatusDistribution = transformedBookings.reduce(
    (acc, booking) => {
      const status = booking.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const checkedInToday = transformedBookings.filter((booking) => {
    if (booking.status !== "checked_in" || !booking.checked_in) return false;
    const checkIn = parseISO(booking.checked_in);
    return checkIn >= todayStart && checkIn <= todayEnd;
  }).length;

  const checkedOutToday = transformedBookings.filter((booking) => {
    if (booking.status !== "checked_out" || !booking.checked_out) return false;
    const checkOut = parseISO(booking.checked_out);
    return checkOut >= todayStart && checkOut <= todayEnd;
  }).length;

  const pendingBookings = transformedBookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const confirmedBookings = transformedBookings.filter(
    (booking) => booking.status === "confirmed",
  ).length;
  const cancelledBookings = transformedBookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;
  const upcomingBookings = transformedBookings.filter((booking) => {
    if (!booking.checked_in) return false;
    return parseISO(booking.checked_in) > now;
  }).length;
  const occupiedCount = transformedBookings.filter(
    (booking) => booking.status === "checked_in",
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
      occupancy_rate: (occupiedCount / (transformedBookings.length || 1)) * 100,
      average_booking_value: totalRevenue / (transformedBookings.length || 1),
    },
    status_distribution: bookingsStatusDistribution,
    recent_bookings: recentBookings,
  };

  const { data: functionHallBookings, error: functionHallBookingsError } =
    await supabase.from("function_hall_bookings").select("*");
  if (functionHallBookingsError) throw functionHallBookingsError;

  const transformedFunctionHallBookings: FunctionHallBooking[] =
    (functionHallBookings || []) as FunctionHallBooking[];

  const filteredFunctionHallBookings = transformedFunctionHallBookings.filter(
    (booking) => {
      const startDate = parseBookingBoundaryDateTime(booking as any, "start");
      const endDate = parseBookingBoundaryDateTime(booking as any, "end") || startDate;

      if (!startDate && !endDate) return false;

      const bookingStart = startDate || endDate!;
      const bookingEnd = endDate || startDate!;

      return bookingStart <= dateRange.end && bookingEnd >= dateRange.start;
    },
  );

  const functionHallTotalRevenue = filteredFunctionHallBookings.reduce(
    (acc, booking) => acc + (Number((booking as any).amount_paid ?? 0) || 0),
    0,
  );

  const functionHallStatusDistribution = filteredFunctionHallBookings.reduce(
    (acc, booking) => {
      const status = booking.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const functionHallUpcomingBookings = filteredFunctionHallBookings.filter(
    (booking) => {
      const startDate = parseBookingBoundaryDateTime(booking as any, "start");
      if (!startDate) return false;
      return startDate > now;
    },
  ).length;

  const functionHallPendingBookings = filteredFunctionHallBookings.filter(
    (booking) => booking.status === "pending",
  ).length;
  const functionHallCompletedBookings = filteredFunctionHallBookings.filter(
    (booking) => booking.status === "completed",
  ).length;
  const functionHallCancelledBookings = filteredFunctionHallBookings.filter(
    (booking) => booking.status === "cancelled",
  ).length;
  const functionHallRecentBookings = filteredFunctionHallBookings.slice(0, 10);

  const functionHallData = {
    summary: {
      total_bookings: filteredFunctionHallBookings.length,
      total_revenue: functionHallTotalRevenue,
      upcoming_bookings: functionHallUpcomingBookings,
      pending_bookings: functionHallPendingBookings,
      completed_bookings: functionHallCompletedBookings,
      cancelled_bookings: functionHallCancelledBookings,
      total_guests_expected: filteredFunctionHallBookings.reduce(
        (acc, booking) =>
          acc + (Number((booking as any).number_of_guest ?? 0) || 0),
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
    (acc, room) => {
      const status = room.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const vacantRooms = transformedRooms.filter((room) => room.status === "vacant").length;
  const vacantDirtyRooms = transformedRooms.filter(
    (room) => room.status === "vacant_dirty",
  ).length;
  const dirtyRooms = transformedRooms.filter((room) => room.status === "dirty").length;
  const occupiedRooms = transformedRooms.filter(
    (room) => room.status === "occupied",
  ).length;
  const maintenanceRooms = transformedRooms.filter(
    (room) => room.status === "maintenance",
  ).length;
  const outOfServiceRooms = transformedRooms.filter(
    (room) => room.status === "out_of_service",
  ).length;
  const stockRooms = transformedRooms.filter(
    (room) => room.status === "stock_room",
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

  const transformedFunctionRooms: FunctionRoom[] = (functionRooms || []) as FunctionRoom[];
  const functionRoomStatusDistribution = transformedFunctionRooms.reduce(
    (acc, room) => {
      const status = (room as any).status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const availableFunctionRooms = transformedFunctionRooms.filter(
    (room) => (room as any).status === "available",
  ).length;
  const halfOccupiedFunctionRooms = transformedFunctionRooms.filter(
    (room) => (room as any).status === "half occupied",
  ).length;
  const fullOccupiedFunctionRooms = transformedFunctionRooms.filter(
    (room) => (room as any).status === "full occupied",
  ).length;

  const functionRoomData = {
    summary: {
      total_rooms: functionRoomsCount || 0,
      available_rooms: availableFunctionRooms,
      half_occupied_rooms: halfOccupiedFunctionRooms,
      full_occupied_rooms: fullOccupiedFunctionRooms,
      utilization_rate:
        ((halfOccupiedFunctionRooms + fullOccupiedFunctionRooms) /
          (transformedFunctionRooms.length || 1)) *
        100,
      total_revenue: functionHallTotalRevenue,
    },
    status_distribution: functionRoomStatusDistribution,
    recent_bookings: functionHallRecentBookings,
  };

  return {
    data: {
      bookings: bookingsData,
      function_hall_bookings: functionHallData,
      rooms: roomsData,
      function_rooms: functionRoomData,
    } as unknown as BookingOverviewResponse,
    filters_applied,
  };
}

export function getEmptyOverviewAnalyticsResponse() {
  return EMPTY_BOOKING_OVERVIEW_RESPONSE;
}
