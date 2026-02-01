import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  ApiResponse,
  RoomHousekeepingDetail,
  HousekeepingSummary,
  FilterParams,
} from "@/types/housekeeping";
import { startOfDay, format, parseISO } from "date-fns";

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

const getRoomStatusFromBooking = (
  bookings: Record<string, unknown>[],
): string => {
  const today = new Date();
  const activeBooking = bookings.find((b) => {
    const checkIn = b.check_in as string;
    const checkOut = b.check_out as string;
    if (!checkIn || !checkOut) return false;
    const inDate = parseISO(checkIn);
    const outDate = parseISO(checkOut);
    return inDate <= today && outDate >= today;
  });
  return activeBooking ? "occupied" : "available";
};

const calculateSummary = (
  rooms: Record<string, unknown>[],
  roomBookings: Map<string, Record<string, unknown>[]>,
): HousekeepingSummary => {
  const byStatus: Record<string, number> = {
    available: 0,
    occupied: 0,
    maintenance: 0,
    cleaning: 0,
    dirty: 0,
  };
  const byCleaningStatus: Record<string, number> = {
    clean: 0,
    dirty: 0,
    in_progress: 0,
    inspected: 0,
  };

  let pendingCleaning = 0;
  let readyForCheckIn = 0;
  let requiresAttention = 0;

  rooms.forEach((room) => {
    const status = (room.status as string) || "available";
    byStatus[status] = (byStatus[status] || 0) + 1;

    const cleaningStatus = (room.cleaning_status as string) || "clean";
    byCleaningStatus[cleaningStatus] =
      (byCleaningStatus[cleaningStatus] || 0) + 1;

    const bookings = roomBookings.get(room.id as string) || [];
    const roomStatus = getRoomStatusFromBooking(bookings);

    if (status === "dirty" || status === "cleaning") {
      pendingCleaning++;
    }
    if (status === "available" && cleaningStatus === "clean") {
      readyForCheckIn++;
    }
    if (
      status === "maintenance" ||
      (status === "dirty" && roomStatus === "occupied")
    ) {
      requiresAttention++;
    }
  });

  return {
    total_rooms: rooms.length,
    by_status: byStatus as Record<
      "available" | "occupied" | "maintenance" | "cleaning" | "dirty",
      number
    >,
    by_cleaning_status: byCleaningStatus as Record<
      "clean" | "dirty" | "in_progress" | "inspected",
      number
    >,
    pending_cleaning: pendingCleaning,
    ready_for_check_in: readyForCheckIn,
    requires_attention: requiresAttention,
  };
};

export async function GET(req: NextRequest): Promise<
  NextResponse<
    ApiResponse<{
      rooms: RoomHousekeepingDetail[];
      summary: HousekeepingSummary;
      pagination: {
        page: number;
        limit: number;
        total: number;
        total_pages: number;
      };
    }>
  >
> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const status = searchParams.get("status") || undefined;
    const cleaning_status = searchParams.get("cleaning_status") || undefined;
    const room_type_id = searchParams.get("room_type_id") || undefined;
    const search = searchParams.get("search") || undefined;
    const sort_by = searchParams.get("sort_by") || "room_number";
    const sort_order = (searchParams.get("sort_order") || "asc") as
      | "asc"
      | "desc";

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    filters_applied.pagination = { page, limit };
    if (status) filters_applied.status = status;
    if (cleaning_status) filters_applied.cleaning_status = cleaning_status;
    if (room_type_id) filters_applied.room_type_id = room_type_id;
    if (search) filters_applied.search = search;

    let roomsQuery = supabase
      .from("rooms")
      .select("*", { count: "exact" })
      .range(from, to)
      .order(sort_by, { ascending: sort_order === "asc" });

    if (status) {
      roomsQuery = roomsQuery.eq("status", status);
    }
    if (room_type_id) {
      roomsQuery = roomsQuery.eq("room_type_id", room_type_id);
    }
    if (search) {
      roomsQuery = roomsQuery.ilike("room_id", `%${search}%`);
    }

    const { data: rooms, error: roomsError, count } = await roomsQuery;

    if (roomsError) {
      console.error("Supabase error:", roomsError);
      throw roomsError;
    }

    const roomIds = (rooms || []).map((r) => r.id);
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        "id, room_id, guest_id, check_in, check_out, status, guest:guest(full_name)",
      )
      .in("room_id", roomIds);

    if (bookingsError) {
      console.error("Supabase error:", bookingsError);
      throw bookingsError;
    }

    const roomBookings = new Map<string, Record<string, unknown>[]>();
    (bookings || []).forEach((booking) => {
      const existing = roomBookings.get(booking.room_id as string) || [];
      existing.push(booking);
      roomBookings.set(booking.room_id as string, existing);
    });

    const today = startOfDay(new Date());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const roomDetails: RoomHousekeepingDetail[] = (rooms || []).map((room) => {
      const roomBookingsList = roomBookings.get(room.id) || [];
      const activeBooking = roomBookingsList.find((b) => {
        const checkIn = b.check_in as string;
        const checkOut = b.check_out as string;
        if (!checkIn || !checkOut) return false;
        const inDate = parseISO(checkIn);
        const outDate = parseISO(checkOut);
        return inDate <= today && outDate >= today;
      });

      let currentGuest = null;
      if (activeBooking) {
        const guestData = activeBooking.guest as Record<string, unknown>;
        currentGuest = {
          guest_name: (guestData?.full_name as string) || "Guest",
          check_in: activeBooking.check_in as string,
          check_out: activeBooking.check_out as string,
          status: activeBooking.status as
            | "pending"
            | "confirmed"
            | "checked_in"
            | "checked_out"
            | "cancelled",
        };
      }

      return {
        ...room,
        cleaning_status:
          (room.cleaning_status as
            | "clean"
            | "dirty"
            | "in_progress"
            | "inspected") || "clean",
        current_guest: currentGuest,
      };
    });

    const summary = calculateSummary(rooms || [], roomBookings);

    return generateResponse(
      true,
      {
        rooms: roomDetails,
        summary,
        pagination: {
          page,
          limit,
          total: count || 0,
          total_pages: Math.ceil((count || 0) / limit),
        },
      },
      undefined,
      {
        generated_at: new Date().toISOString(),
        filters_applied,
        execution_time_ms: Date.now() - startTime,
      },
    );
  } catch (err) {
    console.error("Housekeeping rooms error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch housekeeping data";
    const emptySummary: HousekeepingSummary = {
      total_rooms: 0,
      by_status: {
        available: 0,
        occupied: 0,
        maintenance: 0,
        cleaning: 0,
        dirty: 0,
      },
      by_cleaning_status: { clean: 0, dirty: 0, in_progress: 0, inspected: 0 },
      pending_cleaning: 0,
      ready_for_check_in: 0,
      requires_attention: 0,
    };
    return generateResponse(
      false,
      {
        rooms: [],
        summary: emptySummary,
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
      },
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied,
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
