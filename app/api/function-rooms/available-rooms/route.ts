import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionHallBooking } from "@/types/function-room-booking";
import { FunctionRoom } from "@/types/function-room";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status") || ""; // available | half | full
  const eventDate = searchParams.get("eventDate") || ""; // YYYY-MM-DD
  const start = searchParams.get("start") || ""; // ISO datetime
  const end = searchParams.get("end") || ""; // ISO datetime

  /* ----------------------------------------
   * Fetch rooms with bookings
   * -------------------------------------- */
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
          title: "Error",
          description: error.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }

  /* ----------------------------------------
   * Helpers
   * -------------------------------------- */
  const toDateTime = (date: string, time: string) =>
    new Date(`${date}T${time}:00`);

  const isOverlapping = (
    bookingDate: string,
    bookingStart: string,
    bookingEnd: string,
    eventDate: string,
    checkStart: string,
    checkEnd: string,
  ) => {
    if (bookingDate !== eventDate) return false;

    const bookingStartDT = toDateTime(bookingDate, bookingStart);
    const bookingEndDT = toDateTime(bookingDate, bookingEnd);

    const checkStartDT = new Date(checkStart);
    const checkEndDT = new Date(checkEnd);

    return bookingStartDT < checkEndDT && bookingEndDT > checkStartDT;
  };

  /* ----------------------------------------
   * Compute availability
   * -------------------------------------- */
  const computedRooms =
    function_rooms?.map((room: FunctionRoom) => {
      const bookings =
        room.bookings?.filter(
          (b: FunctionHallBooking) =>
            b.status !== "cancelled" &&
            b.event_date &&
            b.event_duration?.start &&
            b.event_duration?.end &&
            isOverlapping(
              b.event_date,
              b.event_duration.start,
              b.event_duration.end,
              eventDate,
              start,
              end,
            ),
        ) || [];

      const totalGuests = bookings.reduce(
        (sum: number, b: FunctionHallBooking) => sum + (b.number_of_guest || 0),
        0,
      );

      let roomStatus: "available" | "half occupied" | "full occupied" =
        "available";
      let availability = "Available";

      if (totalGuests > 0 && totalGuests < (room.max_guest || 0)) {
        roomStatus = "half occupied";
        availability = "Half occupied";
      }

      if (totalGuests >= (room.max_guest || 0)) {
        roomStatus = "full occupied";
        availability = "Fully occupied";
      }

      return {
        ...room,
        total_guests: totalGuests,
        remaining_slots: Math.max((room.max_guest || 0) - totalGuests, 0),
        status: roomStatus,
        availability,
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
        description: "",
        color: "success",
      },
      data: filteredRooms,
    },
    { status: 200 },
  );
}
