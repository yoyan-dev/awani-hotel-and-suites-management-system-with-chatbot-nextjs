import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const body = await req.json();
    const bookingId = String(body?.id ?? "");

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Invalid Data",
            description: "Booking id is required.",
            color: "warning",
          },
        },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("function_hall_bookings")
      .update({ status: "completed" })
      .eq("id", bookingId)
      .select()
      .single();

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
          description: "Booking marked as completed.",
          color: "success",
        },
        data,
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
