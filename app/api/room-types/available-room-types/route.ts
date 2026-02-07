import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { filterAvailableRoomTypes } from "@/lib/room-availability/room-type-availability";
import { RoomType } from "@/types/room";

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

  /** Fetch room types + rooms */
  const { data: roomTypes, error } = await supabase
    .from("room_types")
    .select(
      `
        *,
        rooms (
          id,
          room_number
        )
      `,
    )
    .gte("max_guest", maxGuest)
    .order("max_guest", { ascending: true });

  if (error || !roomTypes) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error?.message || "Failed to fetch room types",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  /** Fetch bookings ONCE (overlapping date range) */
  const { data: bookings, error: bookingsError } = await supabase
    .from("bookings")
    .select("*")
    .lt("check_in", checkOut)
    .gt("check_out", checkIn);

  if (bookingsError) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: bookingsError.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  /** Attach bookings to room types */
  const roomTypesWithBookings: RoomType[] = roomTypes.map((roomType) => ({
    ...roomType,
    bookings: bookings?.filter((b) => b.room_type_id === roomType.id) || [],
  }));

  /** Compute availability */
  const availableRoomTypes = filterAvailableRoomTypes(
    roomTypesWithBookings,
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
