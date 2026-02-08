import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { ApiResponse } from "@/types/response";
import { Guest } from "@/types/guest";
import { uploadUserImage } from "../../../lib/upload-user-image";
import { uploadValidIDImage } from "@/lib/upload-valid-id";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  const { data, error } = await supabase.rpc("get_full_analytics");

  if (error) {
    console.error("Error fetching guests:", error.message);
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

  console.log("Guests data:", data);
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
    { status: 201 },
  );
}
