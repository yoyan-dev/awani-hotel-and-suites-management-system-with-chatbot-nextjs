import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { ApiResponse } from "@/types/response";

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(req.url);
    const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
    const limit = Math.min(
      Math.max(Number(searchParams.get("limit") ?? 20), 1),
      100,
    );
    const userId = searchParams.get("userId");
    const queryText = (searchParams.get("q") ?? "").trim();

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabaseAdmin
      .from("auth_activity_logs")
      .select("*", { count: "exact" })
      .order("event_at", { ascending: false })
      .range(from, to);

    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (queryText) {
      const escaped = queryText.replace(/,/g, "");
      query = query.or(
        [
          `email.ilike.%${escaped}%`,
          `role.ilike.%${escaped}%`,
          `event_type.ilike.%${escaped}%`,
          `device_name.ilike.%${escaped}%`,
          `user_id.ilike.%${escaped}%`,
        ].join(","),
      );
    }

    const { data, error, count } = await query;

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
        { status: 400 },
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
          items: data ?? [],
          total: count ?? 0,
          page,
          limit,
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
