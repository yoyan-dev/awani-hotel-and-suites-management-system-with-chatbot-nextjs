import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const { count, error: countError } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .neq("id", 0);

    if (countError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: countError.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    const { data: latest, error: latestError } = await supabase
      .from("notifications")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestError) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: latestError.message,
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
        data: {
          unreadCount: count ?? 0,
          latestCreatedAt: latest?.created_at ?? "",
        },
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
