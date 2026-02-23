import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionRoom } from "@/types/function-room";
import { computeFunctionRoomAvailabilityByDate } from "@/lib/function-room/function-room-availability";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";

  let roomQuery = supabase.from("function_rooms").select("*");

  if (status) {
    roomQuery = roomQuery.eq("status", status);
  }

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

  const computedRooms =
    start || end
      ? computeFunctionRoomAvailabilityByDate(roomsWithBookings, start, end)
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
