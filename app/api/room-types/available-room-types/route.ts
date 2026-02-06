import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { filterAvailableRoomTypes } from "@/lib/room-availability/room-type-availability";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");
  const maxGuest = Number(searchParams.get("maxGuest") || 1);

  if (!checkIn || !checkOut) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid request",
          description: "checkIn and checkOut are required",
          color: "danger",
        },
      },
      { status: 400 },
    );
  }

  const { data: roomTypes, error } = await supabase
    .from("room_types")
    .select(
      `
        *,
        rooms (
          id,
          room_number,
          bookings (
            id,
            check_in,
            check_out,
            status
          )
        )
      `,
    )
    .gte("max_guest", maxGuest);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  const availableRoomTypes = filterAvailableRoomTypes(
    roomTypes || [],
    checkIn,
    checkOut,
  );

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Available room types fetched",
        color: "success",
      },
      data: availableRoomTypes,
    },
    { status: 200 },
  );
}
