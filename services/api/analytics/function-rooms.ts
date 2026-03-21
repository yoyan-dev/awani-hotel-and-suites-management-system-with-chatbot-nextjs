import { createClient } from "@/lib/supabase/server";
import {
  FunctionRoomAnalyticsParams,
  FunctionRoomAnalyticsResponse,
} from "@/types/analytics";
import { Tables } from "@/types/supabase";

type FunctionRoom = Tables<"function_rooms">;

const EMPTY_FUNCTION_ROOM_ANALYTICS_RESPONSE: FunctionRoomAnalyticsResponse = {
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

export async function getFunctionRoomAnalytics(
  params: FunctionRoomAnalyticsParams,
) {
  const supabase = await createClient();
  const page = params.page ?? 1;
  const limit = params.limit ?? 10;
  const sort_by = params.sort_by || "room_number";
  const sort_order = params.sort_order || "asc";
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  const filters_applied: Record<string, unknown> = {
    pagination: { page, limit },
  };

  if (params.status) filters_applied.status = params.status;
  if (params.event_type) filters_applied.type = params.event_type;

  let baseQuery = supabase
    .from("function_rooms")
    .select("*", { count: "exact" });

  if (params.status) {
    baseQuery = baseQuery.eq("status", params.status);
  }

  if (params.event_type) {
    baseQuery = baseQuery.eq("type", params.event_type);
  }

  const {
    data: rooms,
    error,
    count,
  } = await baseQuery
    .order(sort_by, { ascending: sort_order === "asc" })
    .range(from, to);

  if (error) {
    throw error;
  }

  const transformedRooms: FunctionRoom[] = (rooms || []) as FunctionRoom[];
  const totalRooms = rooms?.length || 0;

  const statusDistribution = transformedRooms.reduce(
    (acc, room) => {
      const roomStatus = room.status || "unknown";
      acc[roomStatus] = (acc[roomStatus] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const typeDistribution = transformedRooms.reduce(
    (acc, room) => {
      const roomType = room.type || "unknown";
      acc[roomType] = (acc[roomType] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const availableRooms = transformedRooms.filter(
    (room) => room.status === "available",
  ).length;
  const bookedRooms = transformedRooms.filter(
    (room) => room.status === "booked",
  ).length;
  const maintenanceRooms = transformedRooms.filter(
    (room) => room.status === "maintenance",
  ).length;

  const roomDetails = transformedRooms.map((room) => ({
    id: room.id,
    room_number: room.room_number,
    status: room.status || "unknown",
    type: room.type,
    max_guest: room.max_guest,
    current_booking: null as {
      guest_name: string;
      event_start: string;
      event_end: string;
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

  return { data: response, filters_applied };
}

export function getEmptyFunctionRoomAnalyticsResponse() {
  return EMPTY_FUNCTION_ROOM_ANALYTICS_RESPONSE;
}
