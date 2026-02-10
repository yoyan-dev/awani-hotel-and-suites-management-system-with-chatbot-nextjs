import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { startOfDay, parseISO } from "date-fns";
import { calculateSummary } from "@/utils/housekeeping-room/room";
import { generateResponse } from "@/utils/housekeeping-room/response";

export async function GET(req: NextRequest) {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    // Parse query params
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "100");
    const status = searchParams.get("status") || undefined;
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
    if (room_type_id) filters_applied.room_type_id = room_type_id;
    if (search) filters_applied.search = search;

    // Fetch rooms
    let roomsQuery = supabase.from("rooms").select("*", { count: "exact" });

    if (status) roomsQuery = roomsQuery.eq("status", status);
    if (room_type_id) roomsQuery = roomsQuery.eq("room_type_id", room_type_id);
    if (search) roomsQuery = roomsQuery.ilike("room_id", `%${search}%`);

    const { data: rooms, error: roomsError, count } = await roomsQuery;
    if (roomsError) throw roomsError;
    console.log(rooms.length);
    // Fetch bookings
    const roomIds = (rooms || []).map((r) => r.id);
    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        "id, room_id, guest_id, checked_in, checked_out, status, guest:guest(full_name)",
      )
      .in("room_id", roomIds);
    if (bookingsError) throw bookingsError;

    // Map bookings by room
    const roomBookings = new Map<string, Record<string, unknown>[]>();
    (bookings || []).forEach((booking) => {
      const existing = roomBookings.get(booking.room_id as string) || [];
      existing.push(booking);
      roomBookings.set(booking.room_id as string, existing);
    });

    const today = startOfDay(new Date());

    // Prepare room details
    const roomDetails = (rooms || []).map((room) => {
      const roomBookingsList = roomBookings.get(room.id) || [];
      const activeBooking = roomBookingsList.find((b) => {
        const checkIn = b.checked_in as string;
        const checkOut = b.checked_out as string;
        if (!checkIn || !checkOut) return false;
        const inDate = parseISO(checkIn);
        const outDate = parseISO(checkOut);
        return inDate <= today && outDate >= today;
      });

      const currentGuest = activeBooking
        ? {
            guest_name: (activeBooking.guest as any)?.full_name || "Guest",
            checked_in: activeBooking.checked_in,
            checked_out: activeBooking.checked_out,
            status: activeBooking.status,
          }
        : null;

      return {
        ...room,
        cleaning_status: (room.cleaning_status as any) || "clean",
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

    return generateResponse(
      false,
      {
        rooms: [],
        summary: {
          total_rooms: 0,
          by_status: {
            stock_room: 0,
            vacant: 0,
            vacant_dirty: 0,
            dirty: 0,
            out_of_service: 0,
            occupied: 0,
            maintenance: 0,
          },
          by_cleaning_status: { clean: 0, dirty: 0, not_available: 0 },
          pending_cleaning: 0,
          ready_for_checked_in: 0,
          requires_attention: 0,
        },
        pagination: { page: 1, limit: 20, total: 0, total_pages: 0 },
      },
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied: {},
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
