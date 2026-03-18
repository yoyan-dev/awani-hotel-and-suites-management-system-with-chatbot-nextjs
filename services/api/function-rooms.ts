import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";
import { uploadRoomImage } from "@/lib/upload-room-image";

export const FUNCTION_ROOMS_SELECT = `
  id,
  image,
  room_number,
  type,
  max_guest,
  size,
  description,
  status,
  remarks
`;

type ListFunctionRoomsParams = {
  query?: string;
  status?: string;
  page: number;
  limit: number;
};

export async function listFunctionRooms({
  query = "",
  status = "",
  page,
  limit,
}: ListFunctionRoomsParams) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let request = supabase
    .from("function_rooms")
    .select(FUNCTION_ROOMS_SELECT, { count: "exact" });

  if (query) {
    request = request.or(`
      description.ilike.%${query}%,
      remarks.ilike.%${query}%,
    `);
  }

  if (status) {
    request = request.eq("status", status);
  }

  const { data, error, count } = await request.range(from, to);

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return {
    data: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      total_pages: Math.ceil((count ?? 0) / limit),
    },
  };
}

export async function createFunctionRoom(formData: FormData) {
  const roomNumber = Number(formData.get("room_number"));
  const formObj = Object.fromEntries(formData.entries());
  const file = formData.get("image") as File;
  const imageUrl = await uploadRoomImage(file, "FRN" + Number(roomNumber));

  const newRoom = {
    ...formObj,
    image: imageUrl,
    status: "available",
  };

  const { data, error } = await supabase
    .from("function_rooms")
    .insert([newRoom])
    .select();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Room number already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  return data?.[0];
}

export async function getFunctionRoomById(id: string) {
  const { data, error } = await supabase
    .from("function_rooms")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data;
}

export async function updateFunctionRoomById(
  id: string,
  body: Record<string, unknown>,
) {
  const { data, error } = await supabase
    .from("function_rooms")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new ApiRouteError(error.message, {
      color: "error",
      extra: { error: error.message },
    });
  }

  if (!data) {
    throw new ApiRouteError("Function Room not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteFunctionRoomById(id: string) {
  const { error } = await supabase.from("function_rooms").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, { status: 404, color: "error" });
  }
}

export async function deleteFunctionRooms(selectedValues: number[] | "all") {
  let request = supabase.from("function_rooms").delete();

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
    throw new ApiRouteError("Failed to delete function rooms", {
      color: "error",
      extra: { error: error.message },
    });
  }

  return data;
}
