import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const maxGuest = searchParams.get("maxGuest") || 50;

  const { data, error } = await supabase.rpc("get_available_room_types", {
    check_in: checkIn || null,
    check_out: checkOut || null,
    guests: maxGuest || null,
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
