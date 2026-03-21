import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";
import { ApiRouteError } from "@/lib/api/route-error";
import { supabase } from "@/lib/supabase/supabase-client";
import { uploadRoomImage } from "@/lib/upload-room-image";

export type RoomTypeAddOnPayload = {
  id?: string;
  inventory_id?: string;
  add_on_id?: string;
  quantity_limit: number;
};

type ListRoomTypesParams = {
  query?: string;
  maxGuest?: string;
};

export async function upsertRoomTypeAddOns(
  roomTypeId: string,
  payload: RoomTypeAddOnPayload[],
) {
  const { data: existingLinks, error: existingError } = await supabase
    .from("room_type_add_ons")
    .select("id")
    .eq("room_type_id", roomTypeId);

  if (existingError) {
    throw new ApiRouteError(existingError.message);
  }

  const keepIds = new Set(payload.map((item) => item.id).filter(Boolean));
  const deleteIds = (existingLinks ?? [])
    .map((row) => row.id)
    .filter((id) => !keepIds.has(id));

  if (deleteIds.length > 0) {
    const { error } = await supabase
      .from("room_type_add_ons")
      .delete()
      .in("id", deleteIds);

    if (error) {
      throw new ApiRouteError(error.message);
    }
  }

  for (const item of payload) {
    const inventoryId = item.inventory_id ?? item.add_on_id;
    if (!inventoryId) continue;

    const relationPayload = {
      room_type_id: roomTypeId,
      inventory_id: inventoryId,
      quantity_limit: Number(item.quantity_limit ?? 0),
    };

    if (item.id) {
      const { error } = await supabase
        .from("room_type_add_ons")
        .update(relationPayload)
        .eq("id", item.id);

      if (error) {
        throw new ApiRouteError(error.message);
      }
    } else {
      const { error } = await supabase
        .from("room_type_add_ons")
        .insert(relationPayload);

      if (error) {
        throw new ApiRouteError(error.message);
      }
    }
  }
}

export async function listRoomTypes({
  query = "",
  maxGuest = "",
}: ListRoomTypesParams) {
  let request = supabase.from("room_types").select(ROOM_TYPE_ADD_ONS_SELECT);

  if (query) {
    request = request.or(`name.ilike.%${query}%`);
  }

  if (maxGuest) {
    request = request.eq("max_guest", Number(maxGuest));
  }

  const { data, error } = await request;

  if (error) {
    throw new ApiRouteError(error.message);
  }

  return data ?? [];
}

export async function createRoomType(formData: FormData) {
  const formObj = Object.fromEntries(formData.entries());
  const images = formData
    .getAll("images")
    .filter((file): file is File => file instanceof File);
  const legacyImage = formData.get("image") as File;
  const roomTypeAddOns = JSON.parse(
    String(formObj.room_type_add_ons ?? "[]"),
  ) as RoomTypeAddOnPayload[];

  const uploads =
    images.length > 0
      ? images
      : legacyImage && legacyImage.size > 0
        ? [legacyImage]
        : [];

  const imageUrls = await Promise.all(
    uploads.map((file) => uploadRoomImage(file, "type-image")),
  );

  const newData = {
    ...formObj,
    images: imageUrls,
    image: imageUrls[0] ?? "",
  };

  delete (newData as Record<string, unknown>).room_type_add_ons;
  delete (newData as Record<string, unknown>).images;
  delete (newData as Record<string, unknown>).image;

  const { data, error } = await supabase
    .from("room_types")
    .insert([
      {
        ...newData,
        images: imageUrls,
        image: imageUrls[0] ?? "",
      },
    ])
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new ApiRouteError("Item already exists.", { status: 400 });
    }

    throw new ApiRouteError(error.message);
  }

  if (roomTypeAddOns.length) {
    await upsertRoomTypeAddOns(data.id, roomTypeAddOns);
  }

  return getRoomTypeById(data.id);
}

export async function getRoomTypeById(id: string) {
  const { data, error } = await supabase
    .from("room_types")
    .select(ROOM_TYPE_ADD_ONS_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    throw new ApiRouteError(error.message, { color: "error" });
  }

  return data;
}

export async function updateRoomTypeById(
  id: string,
  body: Record<string, unknown>,
) {
  const hasRoomTypeAddOns = Array.isArray(body.room_type_add_ons);
  const roomTypeAddOns = (body.room_type_add_ons ?? []) as RoomTypeAddOnPayload[];
  const updateBody = { ...body };

  delete updateBody.room_type_add_ons;

  if (Array.isArray(updateBody.images)) {
    updateBody.image = updateBody.images[0] ?? updateBody.image ?? "";
  }

  const { error } = await supabase.from("room_types").update(updateBody).eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, {
      color: "error",
      extra: { error: error.message },
    });
  }

  if (hasRoomTypeAddOns) {
    await upsertRoomTypeAddOns(id, roomTypeAddOns);
  }

  const data = await getRoomTypeById(id);

  if (!data) {
    throw new ApiRouteError("Item not found", {
      status: 404,
      color: "error",
    });
  }

  return data;
}

export async function deleteRoomTypeById(id: string) {
  const { data: links, error: linkError } = await supabase
    .from("room_type_add_ons")
    .select("id")
    .eq("room_type_id", id);

  if (linkError) {
    throw new ApiRouteError(linkError.message, { color: "error" });
  }

  if ((links ?? []).length > 0) {
    const { error } = await supabase
      .from("room_type_add_ons")
      .delete()
      .eq("room_type_id", id);

    if (error) {
      throw new ApiRouteError(error.message, { color: "error" });
    }
  }

  const { data, error } = await supabase.from("room_types").delete().eq("id", id);

  if (error) {
    throw new ApiRouteError(error.message, { status: 404, color: "error" });
  }

  return data;
}
