import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Booking } from "@/types/booking";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";

let bookings: Booking[];

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const roomTypeID = searchParams.get("roomTypeID");
  const guest_id = searchParams.get("guest_id");
  const status = searchParams.get("status");

  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const page = Number(searchParams.get("page") || 1);
  const limitParam = searchParams.get("limit") || "10";
  const limit = limitParam === "all" ? null : Number(limitParam);

  const from = limit ? (page - 1) * limit : 0;
  const to = limit ? from + limit - 1 : undefined;

  let q = supabase
    .from("bookings")
    .select(
      `
      id,
      booking_number,
      room_id,
      guest_id,
      room_type_id,
      checked_in,
      checked_out,
      total_add_ons,
      total,
      company,
      special_requests,
      places_last_visited,
      purpose,
      number_of_guests,
      recent_sickness,
      payment_status,
      payment_method,
      booking_source,
      amount_paid,
      status,
      created_at,
      room_type:room_type_id(*),
      room:room_id (*),
      user:guest_id (*)
    `,
      { count: "exact" },
    )
    .order("created_at", { ascending: false });

  if (roomTypeID) q = q.eq("room_type_id", roomTypeID);
  if (guest_id) q = q.eq("guest_id", guest_id);
  if (status) q = q.eq("status", status);

  // date range filter
  if (start && end) {
    q = q.gte("checked_in", start).lte("checked_in", end);
  }

  if (limit && to !== undefined) q = q.range(from, to);

  const { data, error, count } = await q;

  if (error) {
    console.error("Error fetching bookings:", error.message);
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
        limit: limit ?? 10,
        total: count ?? 0,
        total_pages:
          limitParam === "all" ? 1 : Math.ceil((count ?? 0) / (limit ?? 1)),
      },
    },
    { status: 200 },
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const specialRequests = JSON.parse(formObj.special_requests as string);

    const bookingNumber = await GenerateBookingNumber("hotel-room");

    if (!bookingNumber) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Unknown Error!",
            description: "Unknow Error, Please try again",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }
    const newData = {
      ...formObj,
      booking_number: bookingNumber,
      special_requests: specialRequests,
    } as Booking;

    const guestId = formObj.guest_id;
    const newCheckIn = new Date(newData.checked_in);
    const newCheckOut = new Date(newData.checked_out);

    // Check existing bookings for this guest
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("id, checked_in, checked_out, status")
      .eq("guest_id", guestId)
      .not("status", "in", "(cancelled, completed, checked_out)");

    if (checkError) throw checkError;

    const hasOverlap = existingBookings?.some((booking) => {
      const existingIn = new Date(booking.checked_in);
      const existingOut = new Date(booking.checked_out);

      return newCheckIn <= existingOut && newCheckOut >= existingIn;
    });

    if (hasOverlap) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Booking Restricted",
            description:
              "Guest already has an active booking during this period.",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("bookings")
      .insert([newData])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      if (error.code === "23505") {
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Booking already exists.",
              color: "danger",
            },
          },
          { status: 400 },
        );
      }
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
          description: "Reservation successfully added.",
          color: "success",
        },
        data: data[0],
      },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Unexpected error:", err);
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

export async function DELETE(
  request: Request,
): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await request.json();
    const selectedValues: number[] | "all" = body.selectedValues;

    let query = supabase.from("bookings").delete();

    if (selectedValues === "all") {
    } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
      query = query.in("id", selectedValues);
    } else {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: selectedValues,
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: "Failed to delete items.",
            color: "error",
          },
          error: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: {
        title: "Success",
        description:
          selectedValues === "all"
            ? "All items deleted successfully"
            : "Selected items deleted successfully",
        color: "success",
      },
      data,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message,
          color: "error",
        },
        error: err.message,
      },
      { status: 500 },
    );
  }
}
