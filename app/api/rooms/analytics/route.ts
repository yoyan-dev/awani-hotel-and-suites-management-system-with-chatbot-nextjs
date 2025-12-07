import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const { data, error } = await supabase.from("rooms").select("status");

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

  const statusCounts = data?.reduce(
    (acc, room) => {
      const s = room.status;
      if (s) {
        acc[s] = (acc[s] || 0) + 1;
      }
      return acc;
    },
    {} as Record<string, number>
  );

  const status = Object.entries(statusCounts).map(([name, count]) => ({
    name,
    count,
  }));

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: status || [],
    },
    { status: 200 }
  );
}
