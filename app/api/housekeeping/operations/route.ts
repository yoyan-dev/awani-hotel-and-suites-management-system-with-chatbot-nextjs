import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ApiResponse, TodayOperations } from "@/types/housekeeping";
import { startOfDay, endOfDay, format, parseISO, isValid } from "date-fns";
import { BookingStatus } from "@/types/booking";

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
): Promise<NextResponse<ApiResponse<TodayOperations>>> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const dateParam = searchParams.get("date");
    let targetDate = new Date();

    if (dateParam) {
      const parsed = parseISO(dateParam);
      if (isValid(parsed)) {
        targetDate = parsed;
      }
    }

    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);

    filters_applied.date = format(dayStart, "yyyy-MM-dd");

    const { data: bookings, error: bookingsError } = await supabase
      .from("bookings")
      .select(
        "id, room_id, guest_id, checked_in, checked_out, status, guest:guest(full_name)",
      )
      .gte("checked_in", dayStart.toISOString())
      .lte("checked_in", dayEnd.toISOString())
      .eq("status", "confirmed");

    if (bookingsError) {
      console.error("Supabase error:", bookingsError);
      throw bookingsError;
    }

    const { data: checkoutBookings, error: checkoutError } = await supabase
      .from("bookings")
      .select(
        "id, room_id, guest_id, checked_in, checked_out, status, guest:guest(full_name)",
      )
      .gte("checked_out", dayStart.toISOString())
      .lte("checked_out", dayEnd.toISOString())
      .eq("status", "checked_in");

    if (checkoutError) {
      console.error("Supabase error:", checkoutError);
      throw checkoutError;
    }

    const { data: notArrivedBookings, error: notArrivedBookingError } =
      await supabase
        .from("bookings")
        .select("id, room_id, guest_id, checked_in, checked_out, status")
        .gte("checked_in", dayStart.toISOString())
        .eq("status", "checked_in");

    if (notArrivedBookingError) {
      console.error("Supabase error:", notArrivedBookingError);
      throw notArrivedBookingError;
    }

    const { data: stayoverBookings, error: stayoverError } = await supabase
      .from("bookings")
      .select("id, room_id, guest_id, checked_in, checked_out, status")
      .lte("checked_in", dayStart.toISOString())
      .gte("checked_out", dayEnd.toISOString())
      .eq("status", "checked_in");

    if (stayoverError) {
      console.error("Supabase error:", stayoverError);
      throw stayoverError;
    }

    const allRoomIds = [
      ...(bookings || []).map((b) => b.room_id).filter(Boolean),
      ...(checkoutBookings || []).map((b) => b.room_id).filter(Boolean),
    ];

    const { data: rooms, error: roomsError } = await supabase
      .from("rooms")
      .select("id, room_number")
      .in("id", allRoomIds);

    if (roomsError) {
      console.error("Supabase error:", roomsError);
      throw roomsError;
    }

    const roomMap = new Map((rooms || []).map((r) => [r.id, r.room_number]));

    const checkIns = (bookings || []).map((booking) => ({
      id: booking.id,
      room_number: roomMap.get(booking.room_id as string) || 0,
      guest_name:
        (booking.guest as unknown as { full_name?: string })?.full_name ||
        "Guest",
      expected_time: booking.checked_in as string,
      status: booking.status as BookingStatus,
    }));

    const checkOuts = (checkoutBookings || []).map((booking) => ({
      id: booking.id,
      room_number: roomMap.get(booking.room_id as string) || 0,
      guest_name:
        (booking.guest as unknown as { full_name?: string })?.full_name ||
        "Guest",
      status: booking.status as BookingStatus,
    }));

    const notArrivedBookingIds = (notArrivedBookings || [])
      .filter((b) => b.room_id)
      .map((b) => b.room_id as string);

    const stayoverRoomIds = (stayoverBookings || [])
      .filter((b) => b.room_id)
      .map((b) => b.room_id as string);

    const response: TodayOperations = {
      date: format(dayStart, "yyyy-MM-dd"),
      checked_ins: {
        total: checkIns.length,
        rooms: checkIns,
      },
      checked_outs: {
        total: checkOuts.length,
        rooms: checkOuts,
      },
      booking_not_arrived: {
        total: notArrivedBookingIds.length,
        rooms: notArrivedBookingIds,
      },
      stayovers: {
        total: stayoverRoomIds.length,
        rooms: stayoverRoomIds,
      },
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Today operations error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch today's operations";
    const emptyResponse: TodayOperations = {
      date: format(startOfDay(new Date()), "yyyy-MM-dd"),
      checked_ins: { total: 0, rooms: [] },
      checked_outs: { total: 0, rooms: [] },
      booking_not_arrived: { total: 0, rooms: [] },
      stayovers: { total: 0, rooms: [] },
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
