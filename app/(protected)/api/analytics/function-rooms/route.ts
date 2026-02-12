import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  FunctionRoomAnalyticsResponse,
  FunctionRoomAnalyticsParams,
  ApiResponse,
} from "@/types/analytics";
import { Tables } from "@/types/supabase";

type FunctionRoom = Tables<"function-rooms">;

const generateResponse = <T>(
  success: boolean,
  data: T,
  error: { message: string } | undefined,
  meta: {
    generated_at: string;
    filters_applied: Record<string, unknown>;
    execution_time_ms: number;
  },
): NextResponse<ApiResponse<T>> => {
  return NextResponse.json(
    {
      success,
      data,
      error: error ? { code: "ERROR", message: error.message } : undefined,
      meta,
    },
    { status: success ? 200 : 500 },
  );
};

export async function GET(
  req: NextRequest,
): Promise<NextResponse<ApiResponse<FunctionRoomAnalyticsResponse>>> {
  const startTime = Date.now();
  const filters_applied: Record<string, unknown> = {};

  try {
    const { searchParams } = new URL(req.url);
    const supabase = await createClient();

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const sort_by = searchParams.get("sort_by") || "room_number";
    const sort_order = (searchParams.get("sort_order") || "asc") as
      | "asc"
      | "desc";
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    filters_applied.pagination = { page, limit };
    if (status) filters_applied.status = status;
    if (type) filters_applied.type = type;

    let baseQuery = supabase
      .from("function-rooms")
      .select("*", { count: "exact" });

    if (status) {
      baseQuery = baseQuery.eq("status", status);
    }

    if (type) {
      baseQuery = baseQuery.eq("type", type);
    }

    const {
      data: rooms,
      error,
      count,
    } = await baseQuery
      .order(sort_by, { ascending: sort_order === "asc" })
      .range(from, to);

    if (error) {
      console.error("Supabase error:", error);
      const emptyResponse: FunctionRoomAnalyticsResponse = {
        summary: {
          total_function_rooms: 0,
          available_rooms: 0,
          booked_rooms: 0,
          maintenance_rooms: 0,
          utilization_rate: 0,
          average_utilization: 0,
          total_revenue: 0,
        },
        trends: {
          daily_utilization: [],
          monthly: [],
        },
        distributions: {
          by_status: {},
          by_type: {},
          by_capacity: {},
        },
        room_details: [],
      };
      return generateResponse(
        false,
        emptyResponse,
        { message: error.message },
        {
          generated_at: new Date().toISOString(),
          filters_applied,
          execution_time_ms: Date.now() - startTime,
        },
      );
    }

    const transformedRooms: FunctionRoom[] = (rooms || []) as FunctionRoom[];
    const totalRooms = rooms?.length || 0;

    const statusDistribution = transformedRooms.reduce(
      (acc, r) => {
        const roomStatus = r.status || "unknown";
        acc[roomStatus] = (acc[roomStatus] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const typeDistribution = transformedRooms.reduce(
      (acc, r) => {
        const roomType = r.type || "unknown";
        acc[roomType] = (acc[roomType] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const availableRooms = transformedRooms.filter(
      (r) => r.status === "available",
    ).length;
    const bookedRooms = transformedRooms.filter(
      (r) => r.status === "booked",
    ).length;
    const maintenanceRooms = transformedRooms.filter(
      (r) => r.status === "maintenance",
    ).length;

    const roomDetails = transformedRooms.map((r) => ({
      id: r.id,
      room_number: r.room_number,
      status: r.status || "unknown",
      type: r.type,
      max_guest: r.max_guest,
      current_booking: null as {
        guest_name: string;
        event_date: string;
        number_of_guest: number;
      } | null,
      utilization_percentage: 0,
    }));

    const response: FunctionRoomAnalyticsResponse = {
      summary: {
        total_function_rooms: count || 0,
        available_rooms: availableRooms,
        booked_rooms: bookedRooms,
        maintenance_rooms: maintenanceRooms,
        utilization_rate: totalRooms > 0 ? (bookedRooms / totalRooms) * 100 : 0,
        average_utilization: 0,
        total_revenue: 0,
      },
      trends: {
        daily_utilization: [],
        monthly: [],
      },
      distributions: {
        by_status: statusDistribution,
        by_type: typeDistribution,
        by_capacity: {},
      },
      room_details: roomDetails,
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Function room analytics error:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Failed to fetch function room analytics";
    const emptyResponse: FunctionRoomAnalyticsResponse = {
      summary: {
        total_function_rooms: 0,
        available_rooms: 0,
        booked_rooms: 0,
        maintenance_rooms: 0,
        utilization_rate: 0,
        average_utilization: 0,
        total_revenue: 0,
      },
      trends: {
        daily_utilization: [],
        monthly: [],
      },
      distributions: {
        by_status: {},
        by_type: {},
        by_capacity: {},
      },
      room_details: [],
    };
    return generateResponse(
      false,
      emptyResponse,
      { message },
      {
        generated_at: new Date().toISOString(),
        filters_applied,
        execution_time_ms: Date.now() - startTime,
      },
    );
  }
}
