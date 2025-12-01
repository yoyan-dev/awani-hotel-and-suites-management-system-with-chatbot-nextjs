import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Booking } from "@/types/booking";

//GET ONE
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
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
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching booking:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "API Error",
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
        title: "success",
        description: "",
        color: "success",
      },
      data: booking as Booking,
    },
    { status: 201 }
  );
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("bookings")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Database Error",
          description: error.message,
          color: "error",
        },
        error: error.message,
      },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Item not found",
          color: "error",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Booking updated successfully",
      color: "success",
    },
    data: data,
  });
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Item deleted successfully",
        color: "success",
      },
    },
    { status: 200 }
  );
}
