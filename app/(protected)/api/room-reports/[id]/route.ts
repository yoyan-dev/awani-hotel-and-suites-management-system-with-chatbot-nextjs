import { NextRequest, NextResponse } from "next/server";
import type { Room } from "@/types/room";
import { supabase } from "@/lib/supabase/supabase-client";
import { ApiResponse } from "@/types/response";

const tableName = "room-reports";

//GET ONE
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { data: room, error } = await supabase
    .from(tableName)
    .select(`*`)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching room report:", error.message);
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
      data: room,
    },
    { status: 201 },
  );
}

// UPDATE
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;
  const body = await req.json();

  const { data, error } = await supabase
    .from(tableName)
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Update error:", error);
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

  if (!data) {
    return NextResponse.json(
      {
        success: false,
        message: {
          title: "Error",
          description: "Room report not found",
          color: "error",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    success: true,
    message: {
      title: "Success",
      description: "Room report updated successfully",
      color: "success",
    },
    data: data,
  });
}

// DELETE
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse<ApiResponse>> {
  const { id } = await context.params;

  const { error } = await supabase.from(tableName).delete().eq("id", id);

  if (error) {
    console.error("Delete error:", error);
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
        description: "Room report deleted successfully",
        color: "success",
      },
    },
    { status: 200 },
  );
}
