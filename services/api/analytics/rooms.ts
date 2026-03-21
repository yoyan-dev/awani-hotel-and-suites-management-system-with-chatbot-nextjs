import { createClient } from "@/lib/supabase/server";
import { RoomAnalyticsParams, RoomAnalyticsResponse } from "@/types/analytics";
import { Tables } from "@/types/supabase";

type Room = Tables<"rooms">;

const EMPTY_ROOM_ANALYTICS_RESPONSE: RoomAnalyticsResponse = {
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

export async function getRoomAnalytics(params: RoomAnalyticsParams) {
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
  if (params.room_type_id) filters_applied.room_type_id = params.room_type_id;

  let baseQuery = supabase.from("rooms").select("*", { count: "exact" });

  if (params.status) {
    baseQuery = baseQuery.eq("status", params.status);
  }

  if (params.room_type_id) {
    baseQuery = baseQuery.eq("room_type_id", params.room_type_id);
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

  const transformedRooms: Room[] = (rooms || []) as Room[];
  const totalRooms = rooms?.length || 0;

  const statusDistribution = transformedRooms.reduce(
    (acc, room) => {
      const status = room.status || "unknown";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const availableRooms = transformedRooms.filter(
    (room) => room.status === "available",
  ).length;
  const occupiedRooms = transformedRooms.filter(
    (room) => room.status === "occupied",
  ).length;
  const maintenanceRooms = transformedRooms.filter(
    (room) => room.status === "maintenance",
  ).length;

  const roomDetails = transformedRooms.map((room) => ({
    id: room.id,
    room_number: room.room_number,
    status: room.status,
    room_type_id: room.room_type_id,
    current_booking: null as {
      guest_name: string;
      checked_in: string;
      checked_out: string;
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

  return { data: response, filters_applied };
}

export function getEmptyRoomAnalyticsResponse() {
  return EMPTY_ROOM_ANALYTICS_RESPONSE;
}
