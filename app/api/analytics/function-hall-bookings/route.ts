import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-client";
import { startOfDay, endOfDay } from "date-fns";
import { ApiResponse } from "@/types/response";

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse>> {
  try {
    const searchParams = req.nextUrl.searchParams;

    const date = searchParams.get("date");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const status = searchParams.get("status");
    const eventType = searchParams.get("event_type");

    // let query = supabase.from("function_hall_bookings").select("*");

    // // 🔹 DATE PRIORITY
    // if (start && end) {
    //   query = query
    //     .gte("event_date", startOfDay(new Date(start)).toISOString())
    //     .lte("event_date", endOfDay(new Date(end)).toISOString());
    // } else if (date) {
    //   query = query
    //     .gte("event_date", startOfDay(new Date(date)).toISOString())
    //     .lte("event_date", endOfDay(new Date(date)).toISOString());
    // } else {
    //   const today = new Date();
    //   query = query
    //     .gte("event_date", startOfDay(today).toISOString())
    //     .lte("event_date", endOfDay(today).toISOString());
    // }

    // // 🔹 OPTIONAL FILTERS
    // if (status) {
    //   query = query.eq("status", status);
    // }

    // if (eventType) {
    //   query = query.eq("event_type", eventType);
    // }

    // const { data: bookings, error } = await query;
    const { data: bookings, error } = await supabase
      .from("function_hall_bookings")
      .select("*");
    if (error) throw error;

    // 🔹 ANALYTICS
    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, b) => acc + Number(b.amount_paid || 0),
      0,
    );

    const eventTypes = bookings.reduce(
      (acc, b) => {
        const type = b.event_type || "unknown";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Function hall analytics fetched successfully",
          color: "success",
        },
        data: {
          totalBookings,
          totalRevenue,
          eventTypes,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Function hall analytics error:", err);

    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message ?? "Failed to fetch function hall analytics",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
