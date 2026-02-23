import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { FunctionHallBooking } from "@/types/function-room-booking";
import {
  parseEventDurationBoundaryDateOnly,
  parseEventDurationBoundaryDateTime,
} from "@/utils/function-room/event-duration-date";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query")?.trim() || "";
  const guest_id = searchParams.get("guest_id") || "";
  const room_id = searchParams.get("room_id") || "";
  const status = searchParams.get("status") || "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const hasDateRangeFilter = Boolean(start && end);

  let q = supabase
    .from("function_hall_bookings")
    .select(
      `
      *,
      guest: guest_id(*),
      room: room_id(*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (guest_id) q = q.eq("guest_id", guest_id);
  if (room_id) q = q.eq("room_id", room_id);
  if (status) q = q.eq("status", status);
  if (query) {
    q = q.or(
      `booking_number.ilike.%${query}%,event_type.ilike.%${query}%,notes.ilike.%${query}%`,
    );
  }

  if (!hasDateRangeFilter) {
    q = q.range(from, to);
  }

  const { data, error, count } = await q;

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

  if (hasDateRangeFilter && start && end) {
    const filtered =
      (data ?? []).filter((booking) => {
        const bookingStart = parseEventDurationBoundaryDateOnly(
          booking.event_duration,
          "start",
        );
        const bookingEnd =
          parseEventDurationBoundaryDateOnly(booking.event_duration, "end") ||
          bookingStart;

        if (!bookingStart || !bookingEnd) {
          return false;
        }

        return bookingStart >= start && bookingEnd <= end;
      }) ?? [];

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "",
          color: "success",
        },
        data: filtered.slice(from, to + 1),
        pagination: {
          page,
          limit,
          total: filtered.length,
          total_pages: Math.ceil(filtered.length / limit),
        },
      },
      { status: 200 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "",
        color: "success",
      },
      data: data ?? [],
      pagination: {
        page,
        limit,
        total: count ?? 0,
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 200 },
  );
}

/*CREATE */

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    // Parse JSON safely
    const eventDuration =
      typeof formObj.event_duration === "string"
        ? JSON.parse(formObj.event_duration)
        : null;

    if (!eventDuration?.start || !eventDuration?.end) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Event duration is required",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }
    console.log(formObj);

    const bookingNumber = await GenerateBookingNumber("function-room");
    if (!bookingNumber) throw new Error("Failed to generate booking number");

    const newBooking = {
      booking_number: bookingNumber,
      guest_id: formObj.guest_id as string,
      event_type: formObj.event_type as string,
      number_of_guest: Number(formObj.number_of_guest),
      event_duration: eventDuration,
      // room_id: roomId,
      notes: formObj.notes as string,
    };

    if (newBooking.guest_id) {
      const { data: existing, error: overlapError } = await supabase
        .from("function_hall_bookings")
        .select("id, event_duration, status")
        .eq("guest", newBooking.guest_id)
        .not("status", "in", "(cancelled,completed)");

      if (overlapError) {
        throw overlapError;
      }

      const hasOverlap = existing?.some((b) => {
        const existingStart = parseEventDurationBoundaryDateTime(
          b.event_duration,
          "start",
        );
        const existingEnd =
          parseEventDurationBoundaryDateTime(b.event_duration, "end") ||
          existingStart;
        const newStart = parseEventDurationBoundaryDateTime(
          eventDuration,
          "start",
        );
        const newEnd =
          parseEventDurationBoundaryDateTime(eventDuration, "end") || newStart;

        if (!existingStart || !existingEnd || !newStart || !newEnd) {
          return false;
        }

        return newStart < existingEnd && newEnd > existingStart;
      });

      if (hasOverlap) {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Booking Conflict",
              description: "Room already booked for this time range.",
              color: "warning",
            },
          },
          { status: 409 },
        );
      }
    }

    /* INSERT */

    const { data, error } = await supabase
      .from("function_hall_bookings")
      .insert([newBooking])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Reservation successfully added.",
          color: "success",
        },
        data,
      },
      { status: 201 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}

/* DELETE — BULK DELETE*/

export async function DELETE(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("function_hall_bookings").delete();

    if (selectedValues === "all") {
      // delete all
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Request",
            description: "No items selected",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Items deleted successfully",
          color: "success",
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
