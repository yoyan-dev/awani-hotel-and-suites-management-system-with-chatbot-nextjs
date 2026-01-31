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
    const bookingSource = searchParams.get("booking_source");
    const roomTypeId = searchParams.get("room_type_id");

    let query = supabase.from("bookings").select("*");

    // 🔹 DATE PRIORITY
    // if (start && end) {
    //   query = query
    //     .gte("check_in", startOfDay(new Date(start)).toISOString())
    //     .lte("check_out", endOfDay(new Date(end)).toISOString());
    // } else if (date) {
    //   query = query
    //     .gte("check_in", startOfDay(new Date(date)).toISOString())
    //     .lte("check_out", endOfDay(new Date(date)).toISOString());
    // } else {
    //   const today = new Date();
    //   query = query
    //     .gte("check_in", startOfDay(today).toISOString())
    //     .lte("check_out", endOfDay(today).toISOString());
    // }

    // // 🔹 OPTIONAL FILTERS
    // if (status) {
    //   query = query.eq("status", status);
    // }

    // if (bookingSource) {
    //   query = query.eq("booking_source", bookingSource);
    // }

    // if (roomTypeId) {
    //   query = query.eq("room_type_id", roomTypeId);
    // }

    // const { data: bookings, error } = await query;
    const { data: bookings, error } = await supabase
      .from("bookings")
      .select("*");
    if (error) throw error;

    // 🔹 ANALYTICS
    const totalBookings = bookings.length;

    const totalRevenue = bookings.reduce(
      (acc, b) => acc + Number(b.amount_paid || 0),
      0,
    );

    const statusDistribution = bookings.reduce(
      (acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const bookingSourceDistribution = bookings.reduce(
      (acc, b) => {
        const key = b.booking_source === "walk-in" ? "walk_in" : "online";
        acc[key] += 1;
        return acc;
      },
      { walk_in: 0, online: 0 },
    );

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Booking analytics fetched successfully",
          color: "success",
        },
        data: {
          totalBookings,
          totalRevenue,
          statusDistribution,
          bookingSourceDistribution,
        },
      },
      { status: 200 },
    );
  } catch (err: any) {
    console.error("Booking analytics error:", err);

    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: err.message ?? "Failed to fetch booking analytics",
          color: "danger",
        },
      },
      { status: 500 },
    );
  }
}
