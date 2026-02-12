import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionRoom } from "@/types/function-room";
import { computeFunctionRoomAvailabilityByDate } from "@/lib/function-room/function-room-availability";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || "";
  const eventDate = searchParams.get("eventDate") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";

  // ✅ build query dynamically
  let roomQuery = supabase.from("function-rooms").select("*");

  if (status) {
    roomQuery = roomQuery.eq("status", status);
  }

  // execute query
  const { data: rooms, error } = await roomQuery;

  if (error || !rooms) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Database Error",
          description: error?.message ?? "Unknown error",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  // ✅ fetch bookings for each room
  const roomsWithBookings = await Promise.all(
    rooms.map(async (room: FunctionRoom) => {
      const { data: bookings, error: bookingsError } = await supabase
        .from("function_hall_bookings")
        .select("*")
        .eq("room_id", room.id);

      if (bookingsError) {
        console.error(
          `Error fetching bookings for room ${room.id}:`,
          bookingsError,
        );
        return { ...room, function_hall_bookings: [] };
      }

      return { ...room, function_hall_bookings: bookings || [] };
    }),
  );

  // ✅ compute availability
  const computedRooms = eventDate
    ? computeFunctionRoomAvailabilityByDate(roomsWithBookings, eventDate)
    : roomsWithBookings;

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "",
        color: "success",
      },
      data: computedRooms,
    },
    { status: 200 },
  );
}
