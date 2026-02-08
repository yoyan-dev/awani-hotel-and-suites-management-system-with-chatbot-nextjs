import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Booking } from "@/types/booking";

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

  let q = supabase.from("archives").select(
    `
    id,
    room_id,
    guest_id,
    room_type_id,
    check_in,
    check_out,
    special_requests,
    number_of_guests,
    status,
    total_add_ons,
    total,
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
    { count: "exact" },
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
  } = await q.order("created_at", { ascending: true }).range(from, to);

  if (error) {
    console.error("Error fetching archives:", error.message);
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

  console.log("Archives:", bookingData);
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
        total_pages: Math.ceil((count ?? 0) / limit),
      },
    },
    { status: 201 },
  );
}

// CREATE
export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const archive = req.body;

    const { data, error } = await supabase
      .from("archives")
      .insert([archive])
      .select();

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
          description: "Booking successfully added to archive.",
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

    let query = supabase.from("archives").delete();

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
