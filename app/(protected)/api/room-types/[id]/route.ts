import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";
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

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const { data, error } = await supabase
    .from("room_types")
    .select(ROOM_TYPE_ADD_ONS_SELECT)
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "",
      color: "success",
    },
    data,
  });
}

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();
  const hasRoomTypeAddOns = Array.isArray(body.room_type_add_ons);
  const roomTypeAddOns = (body.room_type_add_ons ?? []) as RoomTypeAddOnPayload[];

  const updateBody = { ...body };
  delete updateBody.room_type_add_ons;
  if (Array.isArray(updateBody.images)) {
    updateBody.image = updateBody.images[0] ?? updateBody.image ?? "";
  }

  const { error } = await supabase.from("room_types").update(updateBody).eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
        error: error.message,
      },
      { status: 500 },
    );
  }

  if (hasRoomTypeAddOns) {
    await upsertRoomTypeAddOns(id, roomTypeAddOns);
  }

  const { data, error: fetchError } = await supabase
    .from("room_types")
    .select(ROOM_TYPE_ADD_ONS_SELECT)
    .eq("id", id)
    .single();

  if (fetchError || !data) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: fetchError?.message || "Item not found",
          color: "error",
        },
      },
      { status: fetchError ? 500 : 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Room types updated successfully",
      color: "success",
    },
    data,
  });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: links, error: linkError } = await supabase
    .from("room_type_add_ons")
    .select("id")
    .eq("room_type_id", id);

  if (linkError) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: linkError.message,
          color: "error",
        },
      },
      { status: 500 },
    );
  }

  if ((links ?? []).length > 0) {
    const { error } = await supabase
      .from("room_type_add_ons")
      .delete()
      .eq("room_type_id", id);
    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: {
            title: "Error",
            description: error.message,
            color: "error",
          },
        },
        { status: 500 },
      );
    }
  }

  const { data, error } = await supabase.from("room_types").delete().eq("id", id);

  if (error) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: error.message,
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      success: true,
      message: {
        title: "Success",
        description: "Room types deleted successfully",
        color: "success",
      },
      data,
    },
    { status: 200 },
  );
}
