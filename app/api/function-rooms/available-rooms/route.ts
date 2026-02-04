import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { FunctionRoom } from "@/types/function-room";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || "";
  const eventDate = searchParams.get("eventDate") || "";
  const start = searchParams.get("start") || "";
  const end = searchParams.get("end") || "";

  if (!eventDate || !start || !end) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid Request",
          description: "Missing required parameters: eventDate, start, end",
          color: "warning",
        },
      },
      { status: 400 },
    );
  }

  console.log(eventDate, start, end);

  // if (isNaN(Date.parse(start)) || isNaN(Date.parse(end))) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: {
  //         title: "Invalid Date Format",
  //         description: "Invalid date format for start or end parameters",
  //         color: "warning",
  //       },
  //     },
  //     { status: 400 },
  //   );
  // }

  const { data: function_rooms, error } = await supabase.from("function-rooms")
    .select(`
      *,
      function_hall_bookings (
        id,
        event_date,
        event_duration,
        number_of_guest,
        status
      )
    `);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Database Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  const checkStart = new Date(start);
  const checkEnd = new Date(end);

  if (checkStart >= checkEnd) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Invalid Time Range",
          description: "End time must be after start time",
          color: "warning",
        },
      },
      { status: 400 },
    );
  }

  const computedRooms =
    function_rooms?.map((room: FunctionRoom) => {
      const bookings =
        room.bookings?.filter((b: FunctionHallBooking) => {
          if (b.status === "cancelled") return false;
          if (
            !b.event_date ||
            !b.event_duration?.start ||
            !b.event_duration?.end
          ) {
            return false;
          }

          const existingStart = new Date(
            `${b.event_date}T${b.event_duration.start}:00`,
          );
          const existingEnd = new Date(
            `${b.event_date}T${b.event_duration.end}:00`,
          );

          return checkStart < existingEnd && checkEnd > existingStart;
        }) || [];

      const totalGuests = bookings.reduce(
        (sum: number, b: FunctionHallBooking) => sum + (b.number_of_guest || 0),
        0,
      );

      const maxGuests = room.max_guest || 0;
      let roomStatus: "available" | "half occupied" | "full occupied" =
        "available";
      let availability = "Available";

      if (totalGuests > 0 && totalGuests < maxGuests) {
        roomStatus = "half occupied";
        availability = "Half occupied";
      } else if (totalGuests >= maxGuests && maxGuests > 0) {
        roomStatus = "full occupied";
        availability = "Fully occupied";
      }

      return {
        ...room,
        total_guests: totalGuests,
        remaining_slots: Math.max(maxGuests - totalGuests, 0),
        status: roomStatus,
        availability,
        availability_status: roomStatus,
      };
    }) || [];

  const filteredRooms = status
    ? computedRooms.filter((r) => r.status === status)
    : computedRooms;

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: `${eventDate}: ${start} - ${end}`,
        start,
        end,
        color: "success",
      },
      data: filteredRooms,
    },
    { status: 200 },
  );
}
