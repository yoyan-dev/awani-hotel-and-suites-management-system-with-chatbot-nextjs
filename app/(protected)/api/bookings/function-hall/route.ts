import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";
import { FunctionHallBooking } from "@/types/function-room-booking";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const guest_id = searchParams.get("guest_id") || "";
  const room_id = searchParams.get("room_id") || "";
  const status = searchParams.get("status") || "";
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase
    .from("function_hall_bookings")
    .select(
      `
      *,
      guest: guest_id(*),
      banquet_package: banquet_package_id(*),
      room: room_id(*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (guest_id) q = q.eq("guest_id", guest_id);
  if (room_id) q = q.eq("room_id", room_id);
  if (status) q = q.eq("status", status);

  // DATE + TIME filter (JSONB)
  if (start && end) {
    q = q.gte("event_duration->>start", start).lte("event_duration->>end", end);
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
    const roomId = formObj.room_id as string;
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
      event_date: formObj.event_date as string,
      banquet_package_id: formObj.banquet_package_id as string,
      number_of_guest: Number(formObj.number_of_guest),
      event_duration: eventDuration,
      // room_id: roomId,
      notes: formObj.notes as string,
    };

    if (newBooking.guest_id) {
      const { data: existing, error: overlapError } = await supabase
        .from("function_hall_bookings")
        .select("id, event_date, event_duration, status")
        .eq("guest", newBooking.guest_id)
        .not("status", "in", "(cancelled,completed)");

      const hasOverlap = existing?.some((b) => {
        const eventDate = new Date(b.event_date);
        const existingStart = new Date(b.event_duration.start);
        const existingEnd = new Date(b.event_duration.end);
        const newStart = new Date(eventDuration.start);
        const newEnd = new Date(eventDuration.end);

        return (
          (newStart < existingEnd && newEnd > existingStart) ||
          eventDate === new Date(formObj.event_date as string)
        );
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
