import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const roomTypeID = searchParams.get("roomTypeID") || "";
  const status = searchParams.get("status") || "";

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";

  const selectedDate = searchParams.get("selectedDate") || "";

  const { data, error } = await supabase.rpc("get_room_availability", {
    check_in: checkIn || null,
    check_out: checkOut || null,
    selected_date: selectedDate || null,
    room_type_id: roomTypeID || null,
    room_status: status || null,
  });

  if (error) {
    console.error("Error fetching rooms:", error.message);
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
        title: "success",
        description: "",
        color: "success",
      },
      data: data || [],
    },
    { status: 200 }
  );
}
