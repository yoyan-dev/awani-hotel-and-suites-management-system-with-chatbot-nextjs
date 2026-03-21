import { supabase } from "@/lib/supabase/supabase-client";
import { ApiRouteError } from "@/lib/api/route-error";

export const ROOMS_SELECT = `
  id,
  room_id,
  room_number,
  room_type_id,
  room_type:room_type_id (*),
  area,
  description,
  status,
  remarks,
  bookings
`;

type ListRoomsParams = {
  query?: string;
  roomTypeID?: string;
  status?: string;
  page: number;
  limit: number;
};

export async function listRooms({
  query = "",
  roomTypeID = "",
  status = "",
  page,
  limit,
}: ListRoomsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase
    .from("rooms")
    .select(ROOMS_SELECT, { count: "exact" });

  if (query) {
    request = request.or(`
      room_id.ilike.%${query}%,
      description.ilike.%${query}%,
      remarks.ilike.%${query}%,
      area.ilike.%${query}%
    `);
  }

  if (roomTypeID) {
    request = request.eq("room_type_id", roomTypeID);
  }

  if (status) {
    request = request.eq("status", status);
  }

  const { data, error, count } = await request
    .range(from, to)
    .order("room_type_id", { ascending: true });

  if (error) {
    throw new ApiRouteError(error.message);
  }

  const rooms = [...(data ?? [])].sort((a: any, b: any) =>
    a.room_type?.name.localeCompare(b.room_type?.name),
  );

  return {
    data: rooms,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function createRoom(formData: FormData) {
  const roomNumber = Number(formData.get("room_number"));
  const formObj = Object.fromEntries(formData.entries());
  const newRoom = {
    ...formObj,
    room_number: roomNumber,
    room_id: `RM-${roomNumber}`,
  };

  const { data, error } = await supabase.from("rooms").insert([newRoom]).select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Room number already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function getRoomById(id: string) {
  const { data, error } = await supabase
    .from("rooms")
    .select(ROOMS_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateRoomById(id: string, body: Record<string, unknown>) {
  const { data, error } = await supabase
    .from("rooms")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      extra: { error: error.message },
      color: "error",
    });
  }

  if (!data) {
    throw new ApiRouteError("Room not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteRoomById(id: string) {
  const { error } = await supabase.from("rooms").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, { status: 404, color: "error" });
  }
}

export async function deleteRooms(selectedValues: number[] | "all") {
  let request = supabase.from("rooms").delete();

  if (selectedValues === "all") {
  } else if (Array.isArray(selectedValues) && selectedValues.length > 0) {
    request = request.in("id", selectedValues.map(String));
  } else {
    throw new ApiRouteError(String(selectedValues), {
      status: 400,
      color: "warning",
    });
  }

  const { data, error } = await request;

  if (error) {
    throw new ApiRouteError("Failed to delete rooms", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}
