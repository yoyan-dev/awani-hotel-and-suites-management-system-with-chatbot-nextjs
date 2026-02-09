import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const isStatusSelected = searchParams.get("isStatusSelected") || false;
  const roomTypeID = searchParams.get("roomTypeId") || "";
  const status = searchParams.get("status") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const roomId = searchParams.get("roomId") || "";

  const allowedStatuses = [
    "vacant",
    "dirty",
    "occupied",
    "available",
    "booked",
  ];

  let queryRooms = supabase.from("rooms").select(
    `
    id,
    room_id,
    room_number,
    room_type_id,
    room_type:room_type_id (*),
    area,
    description,
    status,
    remarks
  `,
  );
  let queryBookings = supabase.from("bookings").select(`
    id,
    booking_number,
    room_id,
    guest_id,
    room_type_id,
    checked_in,
    checked_out
  `);

  if (isStatusSelected) queryRooms = queryRooms.in("status", allowedStatuses);

  if (roomTypeID) {
    queryRooms = queryRooms.eq("room_type_id", roomTypeID);
    queryBookings = queryBookings.eq("room_type_id", roomTypeID);
  }

  if (status) {
    queryRooms = queryRooms.eq("status", status);
  }

  if (roomId) {
    queryRooms = queryRooms.eq("room_id", roomId);
  }

  if (checkIn && checkOut) {
    queryBookings = queryBookings
      .lte("checked_in", checkOut)
      .gte("checked_out", checkIn);
  }

  const { data: rooms, error: roomError } = await queryRooms;
  const { data: bookings, error: bookingError } = await queryBookings;

  if (roomError || bookingError) {
    console.error(
      "Error fetching rooms:",
      roomError?.message || bookingError?.message,
    );
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: roomError?.message || bookingError?.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  const availableRooms = () => {
    return (
      rooms?.map((room) => {
        const roomBookings = bookings.filter((b: any) => b.room_id === room.id);

        const hasOverlap = roomBookings.some((b: any) => {
          return b.checked_in <= checkOut && b.checked_out >= checkIn;
        });

        return {
          ...room,
          availability: hasOverlap
            ? "Not available on the selected date"
            : "Available on the selected date",
        };
      }) || []
    );
  };

  console.log("Room data:", rooms);

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: availableRooms(),
    },
    { status: 200 },
  );
}
