import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  RoomAnalyticsResponse,
  RoomAnalyticsParams,
  ApiResponse,
} from "@/types/analytics";
import { Tables } from "@/types/supabase";
import { startOfDay, format, parseISO, isValid } from "date-fns";

type Room = Tables<"rooms">;

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
): Promise<NextResponse<ApiResponse<RoomAnalyticsResponse>>> {
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
    const room_type_id = searchParams.get("room_type_id") || undefined;

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    filters_applied.pagination = { page, limit };
    if (status) filters_applied.status = status;
    if (room_type_id) filters_applied.room_type_id = room_type_id;

    let baseQuery = supabase.from("rooms").select("*", { count: "exact" });

    if (status) {
      baseQuery = baseQuery.eq("status", status);
    }

    if (room_type_id) {
      baseQuery = baseQuery.eq("room_type_id", room_type_id);
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
      const emptyResponse: RoomAnalyticsResponse = {
        summary: {
          total_rooms: 0,
          available_rooms: 0,
          occupied_rooms: 0,
          maintenance_rooms: 0,
          occupancy_rate: 0,
          average_room_rate: 0,
          total_room_revenue: 0,
        },
        trends: {
          daily_occupancy: [],
          monthly_revenue: [],
        },
        distributions: {
          by_status: {},
          by_room_type: {},
          by_floor: {},
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

    const transformedRooms: Room[] = (rooms || []) as Room[];
    const totalRooms = rooms?.length || 0;

    const statusDistribution = transformedRooms.reduce(
      (acc, r) => {
        const status = r.status || "unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const availableRooms = transformedRooms.filter(
      (r) => r.status === "available",
    ).length;
    const occupiedRooms = transformedRooms.filter(
      (r) => r.status === "occupied",
    ).length;
    const maintenanceRooms = transformedRooms.filter(
      (r) => r.status === "maintenance",
    ).length;

    const roomDetails = transformedRooms.map((r) => ({
      id: r.id,
      room_number: r.room_number,
      status: r.status,
      room_type_id: r.room_type_id,
      current_booking: null as {
        guest_name: string;
        check_in: string;
        check_out: string;
      } | null,
    }));

    const response: RoomAnalyticsResponse = {
      summary: {
        total_rooms: count || 0,
        available_rooms: availableRooms,
        occupied_rooms: occupiedRooms,
        maintenance_rooms: maintenanceRooms,
        occupancy_rate: totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0,
        average_room_rate: 0,
        total_room_revenue: 0,
      },
      trends: {
        daily_occupancy: [],
        monthly_revenue: [],
      },
      distributions: {
        by_status: statusDistribution,
        by_room_type: {},
        by_floor: {},
      },
      room_details: roomDetails,
    };

    return generateResponse(true, response, undefined, {
      generated_at: new Date().toISOString(),
      filters_applied,
      execution_time_ms: Date.now() - startTime,
    });
  } catch (err) {
    console.error("Room analytics error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to fetch room analytics";
    const emptyResponse: RoomAnalyticsResponse = {
      summary: {
        total_rooms: 0,
        available_rooms: 0,
        occupied_rooms: 0,
        maintenance_rooms: 0,
        occupancy_rate: 0,
        average_room_rate: 0,
        total_room_revenue: 0,
      },
      trends: {
        daily_occupancy: [],
        monthly_revenue: [],
      },
      distributions: {
        by_status: {},
        by_room_type: {},
        by_floor: {},
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
