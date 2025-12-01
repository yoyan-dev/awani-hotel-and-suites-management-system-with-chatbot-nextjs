import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Booking } from "@/types/booking";
import { GenerateBookingNumber } from "@/lib/generate-booking-number";

let bookings: Booking[];

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("query") || "";
  const roomTypeID = searchParams.get("roomTypeID") || "";
  const guest_id = searchParams.get("guest_id") || "";
  const check_in = searchParams.get("check_in");
  const check_out = searchParams.get("check_out");
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const status = searchParams.get("status") || "";
  const page = Number(searchParams.get("page") || "1");
  const limit = 10;

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let q = supabase.from("bookings").select(
    `
    id,
    booking_number,
    room_id,
    guest_id,
    room_type_id,
    check_in,
    check_out,
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
    room:room_id (
      id,
      room_id,
      room_number,
      room_type_id,
      room_type:room_type_id(*),
      area,
      description,
      status,
      images,
      remarks
    ),
    user:guest_id (*)
  `,
    { count: "exact" }
  );

  if (roomTypeID) q = q.eq("room_type_id", roomTypeID);
  if (guest_id) q = q.eq("guest_id", guest_id);
  if (check_in) q = q.eq("check_in", check_in);
  if (check_out) q = q.eq("check_out", check_out);
  if (start && end) q = q.gte("check_in", start).lte("check_in", end);
  if (status) q = q.eq("status", status);

  if (query) {
    //   q = q.or(`
    //   r.ilike.%${query}%,
    // `);
  }

  const {
    data: bookingData,
    error,
    count,
  } = await q.order("created_at", { ascending: false }).range(from, to);

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
      { status: 500 }
    );
  }

  console.log("Bookings data:", bookingData);
  bookings = bookingData || [];
  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: bookings,
      pagination: {
        page,
        limit,
        total: count ?? 0,
        totalPages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 201 }
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
    const formObj = Object.fromEntries(formData.entries());
    const specialRequests = JSON.parse(formObj.special_requests as string);

    const bookingNumber = await GenerateBookingNumber();

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
        { status: 400 }
      );
    }
    const newData = {
      ...formObj,
      booking_number: bookingNumber,
      special_requests: specialRequests,
    } as Booking;

    const guestId = formObj.guest_id;
    const newCheckIn = new Date(newData.check_in);
    const newCheckOut = new Date(newData.check_out);

    // Check existing bookings for this guest
    const { data: existingBookings, error: checkError } = await supabase
      .from("bookings")
      .select("id, check_in, check_out, status")
      .eq("guest_id", guestId)
      .not("status", "in", "(cancelled, completed, check-out)");

    if (checkError) throw checkError;

    const hasOverlap = existingBookings?.some((booking) => {
      const existingIn = new Date(booking.check_in);
      const existingOut = new Date(booking.check_out);

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
        { status: 400 }
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
          { status: 400 }
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
        { status: 500 }
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
      { status: 201 }
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
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request
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
        { status: 400 }
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
        { status: 500 }
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
      { status: 500 }
    );
  }
}
