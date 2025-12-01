import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Room } from "@/types/room";
import { Booking } from "@/types/booking";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const roomTypeID = searchParams.get("roomTypeID") || "";
  const status = searchParams.get("status") || "";
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  let q = supabase.from("rooms").select(
    `
    id,
    room_id,
    room_number,
    room_type_id,
    room_type:room_type_id (*),
    area,
    description,
    status,
    images,
    remarks,
    bookings
  `
  );

  if (roomTypeID) {
    q = q.eq("room_type_id", roomTypeID);
  }

  if (status) {
    q = q.eq("status", status);
  }

  const { data: rooms, error } = await q;

  const availableRooms = () => {
    return (
      rooms?.map((room) => {
        const hasOverlap = room?.bookings?.some(
          (b: Booking) => b.check_in < checkIn && b.check_out > checkOut
        );

        return {
          ...room,
          availability: hasOverlap
            ? "Not available on the selected date"
            : "Available on the selected date",
        };
      }) || []
    );
  };

  if (error) {
    console.error("Error fetching rooms:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 }
    );
  }

  console.log("Room data:", availableRooms());
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
    { status: 201 }
  );
}
