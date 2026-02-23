import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { FunctionHallBooking } from "@/types/function-room-booking";

//GET ONE
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: booking, error } = await supabase
    .from("function_hall_bookings")
    .select(
      `
      id,
      booking_number,
      guest_id,
      event_type,
      event_duration,
      number_of_guest,
      room_id,
      notes,
      status,
      booking_source,
      created_at,
      guest: guest_id(*),
      room: room_id(*)
    `,
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
      { status: 500 },
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
      data: booking as FunctionHallBooking,
    },
    { status: 201 },
  );
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from("function_hall_bookings")
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
      { status: 500 },
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
      { status: 404 },
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
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase
    .from("function_hall_bookings")
    .delete()
    .eq("id", id);

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
      { status: 404 },
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
    { status: 200 },
  );
}
