import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
import { uploadRoomImage } from "@/lib/upload-room-image";
import { ROOM_TYPE_ADD_ONS_SELECT } from "@/lib/add-ons/selects";

type RoomTypeAddOnPayload = {
  id?: string;
  inventory_id?: string;
  add_on_id?: string;
  quantity_limit: number;
};

async function upsertRoomTypeAddOns(
  roomTypeId: string,
  payload: RoomTypeAddOnPayload[],
) {
  const { data: existingLinks, error: existingError } = await supabase
    .from("room_type_add_ons")
    .select("id")
    .eq("room_type_id", roomTypeId);

  if (existingError) {
    throw existingError;
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
    if (error) throw error;
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
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("room_type_add_ons")
        .insert(relationPayload);
      if (error) throw error;
    }
  }
}

export async function GET(req: Request): Promise<NextResponse<ApiResponse>> {
  const { searchParams } = new URL(req.url);

  const query = searchParams.get("q") || "";
  const max_guest = searchParams.get("maxGuest") || "";

  let q = supabase.from("room_types").select(ROOM_TYPE_ADD_ONS_SELECT);

  if (query) {
    q = q.or(`name.ilike.%${query}%`);
  }

  if (max_guest) {
    q = q.eq("max_guest", Number(max_guest));
  }

  const { data: roomTypes, error } = await q;

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
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "success",
        description: "",
        color: "success",
      },
      data: roomTypes || [],
    },
    { status: 201 },
  );
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const formData = await req.formData();
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
        return NextResponse.json(
          {
            success: false,
            message: {
              title: "Error",
              description: "Item already exists.",
              color: "danger",
            },
          },
          { status: 400 },
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "danger",
          },
        },
        { status: 500 },
      );
    }

    if (roomTypeAddOns.length) {
      await upsertRoomTypeAddOns(data.id, roomTypeAddOns);
    }

    const { data: createdRoomType, error: createdError } = await supabase
      .from("room_types")
      .select(ROOM_TYPE_ADD_ONS_SELECT)
      .eq("id", data.id)
      .single();

    if (createdError) {
      throw createdError;
    }

    return NextResponse.json(
      {
        success: true,
        message: {
          title: "Success",
          description: "Item successfully added.",
          color: "success",
        },
        data: createdRoomType,
      },
      { status: 201 },
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
