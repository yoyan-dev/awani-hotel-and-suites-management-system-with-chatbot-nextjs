import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { parseEventDurationBoundaryDateTime } from "@/utils/function-room/event-duration-date";

interface CompletionRequest {
  booking_id: string;
  room_id: string;
  occupancy_type: "available" | "half occupied" | "full occupied";
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { booking_id, room_id, occupancy_type } =
      (await req.json()) as CompletionRequest;

    if (!booking_id || !room_id || !occupancy_type) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Request",
            description:
              "Missing required fields: booking_id, room_id, occupancy_type",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data: booking, error: fetchError } = await supabase
      .from("function_hall_bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (fetchError || !booking) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Not Found",
            description: "Booking not found",
            color: "danger",
          },
        },
        { status: 404 },
      );
    }

    if (!booking.event_duration?.start || !booking.event_duration?.end) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Booking",
            description: "Booking is missing event duration",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const ineligibleStatuses = [
      "cancelled",
      "completed",
      "checked_in",
      "checked_out",
    ];
    if (ineligibleStatuses.includes(booking.status)) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Status",
            description: `Booking cannot be completed. Current status: ${booking.status}`,
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data: existingBookings, error: conflictError } = await supabase
      .from("function_hall_bookings")
      .select("id, event_duration, number_of_guest, status")
      .eq("room_id", room_id)
      .neq("status", "cancelled")
      .neq("id", booking_id);

    if (conflictError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Database Error",
            description: conflictError.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    const bookingStart = parseEventDurationBoundaryDateTime(
      booking.event_duration,
      "start",
    );
    const bookingEnd =
      parseEventDurationBoundaryDateTime(booking.event_duration, "end") ||
      bookingStart;

    if (!bookingStart || !bookingEnd) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Duration",
            description: "Booking has invalid event duration format",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    if (bookingStart >= bookingEnd) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Time",
            description: "Event end time must be after start time",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const conflictingBookings =
      existingBookings?.filter((b) => {
        if (!b.event_duration?.start || !b.event_duration?.end) {
          return false;
        }

        const existingStart = parseEventDurationBoundaryDateTime(
          b.event_duration,
          "start",
        );
        const existingEnd =
          parseEventDurationBoundaryDateTime(b.event_duration, "end") ||
          existingStart;

        if (!existingStart || !existingEnd) {
          return false;
        }

        return bookingStart < existingEnd && bookingEnd > existingStart;
      }) || [];

    if (conflictingBookings.length > 0) {
      const conflictIds = conflictingBookings.map((b) => b.id).join(", ");
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Booking Conflict",
            description: `Room is already booked for this time slot. Conflicting booking IDs: ${conflictIds}`,
            color: "warning",
          },
        },
        { status: 409 },
      );
    }

    const { data: roomData, error: roomError } = await supabase
      .from("function-rooms")
      .select("max_guest")
      .eq("id", room_id)
      .single();

    if (roomError || !roomData) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Room Not Found",
            description: "Function room not found",
            color: "danger",
          },
        },
        { status: 404 },
      );
    }

    const currentGuests =
      existingBookings?.reduce((sum, b) => sum + (b.number_of_guest || 0), 0) ||
      0;

    const roomMaxGuests = roomData.max_guest || 0;
    const newBookingGuests = booking.number_of_guest || 0;
    const totalAfterBooking = currentGuests + newBookingGuests;

    if (totalAfterBooking > roomMaxGuests) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Capacity Exceeded",
            description: `Room capacity (${roomMaxGuests}) would be exceeded. Current: ${currentGuests}, New: ${newBookingGuests}, Total: ${totalAfterBooking}`,
            color: "danger",
          },
        },
        { status: 400 },
      );
    }

    if (
      occupancy_type === "full occupied" &&
      totalAfterBooking < roomMaxGuests
    ) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Occupancy",
            description:
              "Cannot mark as 'full occupied' when room capacity is not reached",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data: updated, error: updateError } = await supabase
      .from("function_hall_bookings")
      .update({
        room_id,
        occupancy_type,
        status: "confirmed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", booking_id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Update Failed",
            description: updateError.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Booking completed successfully",
          color: "success",
        },
        data: updated,
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Server Error",
          description: err.message || "An unexpected error occurred",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
