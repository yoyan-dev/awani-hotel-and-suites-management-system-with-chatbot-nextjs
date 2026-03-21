import { createClient } from "@/lib/supabase/server";
import { DashboardSummaryResponse } from "@/types/analytics";
import { startOfDay, endOfDay, subDays } from "date-fns";
import { parseBookingBoundaryDateTime } from "@/utils/function-room/event-duration-date";

const EMPTY_DASHBOARD_SUMMARY_RESPONSE: DashboardSummaryResponse = {
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

export async function getDashboardAnalytics(params: {
  start?: string;
  end?: string;
}) {
  const supabase = await createClient();
  const filters_applied: Record<string, unknown> = {
    date_range: { start: params.start, end: params.end },
  };

  const today = new Date();
  const todayStart = startOfDay(today);
  const todayEnd = endOfDay(today);
  const weekStart = subDays(todayStart, 7);
  const monthStart = subDays(todayStart, 30);

  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("id, checked_in, checked_out, status, amount_paid, created_at");
  if (bookingsError) throw bookingsError;

  const { data: functionHallBookings, error: functionHallError } = await supabase
    .from("function_hall_bookings")
    .select("id, event_start, event_end, status, amount_paid, created_at");
  if (functionHallError) throw functionHallError;

  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select("id, status");
  if (roomsError) throw roomsError;

  const { data: functionRooms, error: functionRoomsError } = await supabase
    .from("function_rooms")
    .select("id, status");
  if (functionRoomsError) throw functionRoomsError;

  const todayBookings = (bookings || []).filter((booking) => {
    if (!booking.created_at) return false;
    const created = new Date(booking.created_at);
    return created >= todayStart && created <= todayEnd;
  });

  const weekBookings = (bookings || []).filter((booking) => {
    if (!booking.created_at) return false;
    return new Date(booking.created_at) >= weekStart;
  });

  const monthBookings = (bookings || []).filter((booking) => {
    if (!booking.created_at) return false;
    return new Date(booking.created_at) >= monthStart;
  });

  const todayRevenue = todayBookings.reduce(
    (acc, booking) => acc + (booking.amount_paid || 0),
    0,
  );
  const monthRevenue = monthBookings.reduce(
    (acc, booking) => acc + (booking.amount_paid || 0),
    0,
  );

  const pendingBookings = (bookings || []).filter(
    (booking) => booking.status === "pending",
  ).length;

  const checkedInToday = (bookings || []).filter(
    (booking) =>
      booking.status === "checked_in" &&
      booking.checked_in &&
      new Date(booking.checked_in) >= todayStart &&
      new Date(booking.checked_in) <= todayEnd,
  ).length;

  const todayFunctionHallBookings = (functionHallBookings || []).filter(
    (booking) => {
      if (!booking.created_at) return false;
      const created = new Date(booking.created_at);
      return created >= todayStart && created <= todayEnd;
    },
  );

  const weekFunctionHallBookings = (functionHallBookings || []).filter(
    (booking) => {
      if (!booking.created_at) return false;
      return new Date(booking.created_at) >= weekStart;
    },
  );

  const monthFunctionHallBookings = (functionHallBookings || []).filter(
    (booking) => {
      if (!booking.created_at) return false;
      return new Date(booking.created_at) >= monthStart;
    },
  );

  const todayFunctionHallRevenue = todayFunctionHallBookings.reduce(
    (acc, booking) => acc + (booking.amount_paid || 0),
    0,
  );
  const monthFunctionHallRevenue = monthFunctionHallBookings.reduce(
    (acc, booking) => acc + (booking.amount_paid || 0),
    0,
  );

  const pendingFunctionHallBookings = (functionHallBookings || []).filter(
    (booking) => booking.status === "pending",
  ).length;

  const upcomingEvents = (functionHallBookings || []).filter((booking) => {
    if (booking.status === "cancelled" || booking.status === "completed") {
      return false;
    }

    const startDate = parseBookingBoundaryDateTime(booking as any, "start");
    const endDate = parseBookingBoundaryDateTime(booking as any, "end") || startDate;

    if (startDate || endDate) {
      const eventEnd = endDate || startDate!;
      return eventEnd >= today;
    }

    return false;
  }).length;

  const totalRooms = (rooms || []).length;
  const availableRooms = (rooms || []).filter(
    (room) => room.status === "available",
  ).length;
  const occupiedRooms = (rooms || []).filter(
    (room) => room.status === "occupied",
  ).length;
  const maintenanceRooms = (rooms || []).filter(
    (room) => room.status === "maintenance",
  ).length;

  const totalFunctionRooms = (functionRooms || []).length;
  const availableFunctionRooms = (functionRooms || []).filter(
    (room) => room.status === "available",
  ).length;
  const bookedFunctionRooms = (functionRooms || []).filter(
    (room) => room.status === "booked",
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
      today: todayFunctionHallBookings.length,
      this_week: weekFunctionHallBookings.length,
      this_month: monthFunctionHallBookings.length,
      pending: pendingFunctionHallBookings,
      revenue_today: todayFunctionHallRevenue,
      revenue_this_month: monthFunctionHallRevenue,
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
      available: availableFunctionRooms,
      booked: bookedFunctionRooms,
      utilization_rate:
        totalFunctionRooms > 0
          ? (bookedFunctionRooms / totalFunctionRooms) * 100
          : 0,
    },
    quick_stats: {
      total_guests_checked_in: checkedInToday,
      total_guests_checked_out_today: 0,
      upcoming_checked_outs: 0,
      upcoming_events: upcomingEvents,
    },
  };

  return { data: response, filters_applied };
}

export function getEmptyDashboardAnalyticsResponse() {
  return {
    ...EMPTY_DASHBOARD_SUMMARY_RESPONSE,
    timestamp: new Date().toISOString(),
  };
}
